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
		if (skillsIds != null) {
			if (!employee.status) {
				throw new BadRequestException(ErrorCodes.INACTIVE_REGISTER);
			}
			data.skills = {
				create: skillsIds.map((id) => ({
					skill: { connect: { id, NOT: { status: false } } },
				})),
			};
		}

		if (employee.scheduleId != null) {
			if (!employee.status) {
				throw new BadRequestException(ErrorCodes.INACTIVE_REGISTER);
			}
			data.schedule = {
				connect: { id: employee.scheduleId, NOT: { status: false } },
			};
		}
		employee.scheduleId = undefined;

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

		// Update Skills
		if (skillsIds != null && employee.status) {
			data.skills = {
				connectOrCreate: skillsIds.map((skillId) => ({
					where: { employeeId_skillId: { employeeId: id, skillId } },
					create: {
						skill: { connect: { id: skillId, NOT: { status: false } } },
					},
				})),
			};
		}

		// Update Schedule
		if (employee.scheduleId != null && employee.status) {
			data.schedule = {
				connect: { id: employee.scheduleId, NOT: { status: false } },
			};
			employee.scheduleId = undefined;
		}

		// Disconnect relations when deactivating object
		if (!employee.status) {
			data.skills = { deleteMany: { employeeId: id } };
			data.schedule = { disconnect: {} };
			employee.scheduleId = undefined;
		}

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
}
