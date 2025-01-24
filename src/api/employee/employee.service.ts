import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from "@nestjs/common";
import { Employee, Prisma, Schedule, Skill } from "@prisma/client";

import ErrorCodes from "@enums/error-codes";
import { Pagination } from "@graphql/interfaces/pagination.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { EmployeeCreateDto } from "./dto/employee-create.dto";
import { EmployeeFilterDto } from "./dto/employee-filter-dto";
import { EmployeeFullDto } from "./dto/employee-full-dto";
import { EmployeeUpdateDto } from "./dto/employee-update.dto";
import { EmployeeDto, PaginatedEmployeeDto } from "./dto/employee.dto";

@Injectable()
export class EmployeeService {
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: string, relations: true): Promise<EmployeeFullDto | null>;
	async findById(id: string, relations?: false): Promise<EmployeeDto | null>;
	async findById(
		id: string,
		relations = false,
	): Promise<EmployeeDto | EmployeeFullDto | null> {
		const include: Prisma.EmployeeInclude = {
			schedule: {},
			skills: { include: { skill: {} } },
		};

		type EmployeeWithIncludes = Employee & {
			schedule: Schedule;
			skills: { skill: Skill }[];
		};

		const isFullEmployee = (
			val: Employee | EmployeeWithIncludes,
		): val is EmployeeWithIncludes => {
			const data = val as EmployeeWithIncludes;
			return data.schedule != null && data.skills != null;
		};

		return this.prisma.employee
			.findUnique({
				where: { id },
				include: relations ? include : undefined,
			})
			.then((data: Employee | EmployeeWithIncludes | null) => {
				if (data == null) return data;
				if (isFullEmployee(data)) {
					return {
						...data,
						skills: data.skills.map((item) => item.skill),
					} satisfies EmployeeFullDto;
				}
				return data;
			});
	}

	async findWithPagination(
		{ take, skip }: Pagination,
		{ status, scheduleId: scheduleIdList }: EmployeeFilterDto,
	): Promise<PaginatedEmployeeDto> {
		const hasIds = scheduleIdList.length > 0;
		const schedule = hasIds ? { id: { in: scheduleIdList } } : undefined;
		const where = {
			status: status ?? undefined,
			schedule,
		};
		const [count, employees] = await this.prisma.$transaction([
			this.prisma.employee.count({ where }),
			this.prisma.employee.findMany({
				take,
				skip,
				where,
				include: { schedule: {} },
			}),
		]);
		return { data: employees, total: count };
	}

	async create(
		employee: EmployeeCreateDto,
		skillsIds?: number[],
	): Promise<EmployeeDto> {
		const data: Prisma.EmployeeCreateInput = employee;
		this.validateEmployeeSchedule(employee, data);
		this.validateEmployeeSkills(employee, skillsIds, data);

		return this.prisma.employee.create({ data }).catch((err) => {
			throw new InternalServerErrorException(ErrorCodes.CREATE_ERROR, {
				cause: err,
			});
		});
	}

	async update(
		id: string,
		employee: EmployeeUpdateDto,
		skillsIds?: number[],
	): Promise<EmployeeDto> {
		const data: Prisma.EmployeeUpdateInput = employee;
		const current = await this.findById(id);
		if (current === null) throw new NotFoundException(ErrorCodes.NOT_FOUND);
		this.validateEmployeeSchedule(employee, data, current);
		this.validateEmployeeSkills(employee, skillsIds, data, current);

		return this.prisma.employee.update({ where: { id }, data }).catch((err) => {
			throw new InternalServerErrorException(ErrorCodes.UPDATE_ERROR, {
				cause: err,
			});
		});
	}

	async delete(id: string): Promise<EmployeeDto> {
		return this.prisma.employee.delete({ where: { id } }).catch((err) => {
			throw new InternalServerErrorException(ErrorCodes.DELETE_ERROR, {
				cause: err,
			});
		});
	}

	private validateEmployeeSchedule(
		employee: EmployeeCreateDto | EmployeeUpdateDto,
		args: Prisma.EmployeeCreateInput | Prisma.EmployeeUpdateInput,
		current?: EmployeeDto | undefined,
	): void {
		if (employee.scheduleId != null) {
			if (!employee.status)
				throw new BadRequestException(ErrorCodes.INACTIVE_REGISTER_RELATIONS);
			args.schedule = {
				connect: { id: employee.scheduleId, NOT: { status: false } },
			};
		}

		// Remove scheduleId because it is not used to create relation connection
		employee.scheduleId = undefined;

		if (current == null) {
			if (employee.scheduleId == null && employee.status)
				throw new BadRequestException(ErrorCodes.MISSING_SCHEDULE);
		} else {
			// Check if employee status changed to active and a new schedule is being added
			if (employee.scheduleId == null && employee.status && !current.status)
				throw new BadRequestException(ErrorCodes.MISSING_SCHEDULE);
			const data = args as Prisma.EmployeeUpdateInput;
			// Disconnect relations when updating to inactive
			if (!employee.status) {
				data.schedule = { disconnect: {} };
			}
		}
	}

	private validateEmployeeSkills(
		employee: EmployeeCreateDto | EmployeeUpdateDto,
		skillsIds: number[] | undefined,
		args: Prisma.EmployeeCreateInput | Prisma.EmployeeUpdateInput,
		current?: EmployeeDto | undefined,
	): void {
		const employeeId = current?.id;
		if (!employee.status && skillsIds != null)
			throw new BadRequestException(ErrorCodes.INACTIVE_REGISTER_RELATIONS);

		if (employeeId == null) {
			const data = args as Prisma.EmployeeCreateInput;
			if (skillsIds == null) return;
			data.skills = {
				create: skillsIds.map((id) => ({
					skill: { connect: { id, NOT: { status: false } } },
				})),
			};
		} else {
			const data = args as Prisma.EmployeeUpdateInput;
			if (skillsIds == null) {
				// Disconnect relations when updating to inactive
				if (!employee.status) {
					data.skills = { deleteMany: { employeeId } };
				}
				return;
			}
			data.skills = {
				connectOrCreate: skillsIds.map((skillId) => {
					return {
						where: { employeeId_skillId: { employeeId, skillId } },
						create: {
							skill: { connect: { id: skillId, NOT: { status: false } } },
						},
					} satisfies Prisma.EmployeeSkillsCreateOrConnectWithoutEmployeeInput;
				}),
			};
		}
	}
}
