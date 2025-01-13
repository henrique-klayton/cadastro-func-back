import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Pagination } from "src/graphql/interfaces/pagination.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { EmployeeCreateDto } from "./dto/employee-create.dto";
import { EmployeeFilterDto } from "./dto/employee-filter-dto";
import { EmployeeFullDto } from "./dto/employee-full-dto";
import { EmployeeUpdateDto } from "./dto/employee-update.dto";
import { EmployeeDto, PaginatedEmployeeDto } from "./dto/employee.dto";

@Injectable()
export class EmployeeService {
	constructor(private readonly prisma: PrismaService) {}

	async find(id: string, relations: true): Promise<EmployeeFullDto | null>;
	async find(id: string, relations?: false): Promise<EmployeeDto | null>;
	async find(
		id: string,
		relations = false,
	): Promise<EmployeeDto | EmployeeFullDto | null> {
		const include: Prisma.EmployeeInclude = {
			schedule: {},
			skills: { include: { skill: {} } },
		};

		return this.prisma.employee
			.findUnique({
				where: { id },
				include: relations ? include : undefined,
			})
			.then((data) => {
				// biome-ignore lint/suspicious/noExplicitAny: Converting skills to expected type
				const employee = data as any;
				if (relations) {
					employee.skills = employee.skills.map((item) => item.skill);
				}
				return employee;
			});
	}

	async findWithPagination(
		{ take, skip }: Pagination,
		{ status, scheduleId: scheduleIdList }: EmployeeFilterDto,
	): Promise<PaginatedEmployeeDto> {
		const hasIds = scheduleIdList.length > 0;
		const schedule = hasIds ? { id: { in: scheduleIdList } } : undefined;
		const [count, employees] = await this.prisma.$transaction([
			this.prisma.schedule.count(),
			this.prisma.employee.findMany({
				take,
				skip,
				where: {
					status: status,
					schedule,
				},
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
				throw new BadRequestException(
					"Cannot create inactive employee with skills",
				);
			}
			data.skills = {
				create: skillsIds.map((id) => ({
					skill: { connect: { id, NOT: { status: false } } },
				})),
			};
		}

		if (employee.scheduleId != null) {
			if (!employee.status) {
				throw new BadRequestException(
					"Cannot create inactive employee with schedule",
				);
			}
			data.schedule = {
				connect: { id: employee.scheduleId, NOT: { status: false } },
			};
		}
		employee.scheduleId = undefined;

		return this.prisma.employee.create({ data }).catch((err) => {
			throw new BadRequestException("Error while creating employee", {
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
			throw new BadRequestException("Error while updating employee", {
				cause: err,
			});
		});
	}

	async delete(id: string): Promise<EmployeeDto> {
		return this.prisma.employee.delete({ where: { id } }).catch((err) => {
			throw new BadRequestException("Error while deleting employee", {
				cause: err,
			});
		});
	}
}
