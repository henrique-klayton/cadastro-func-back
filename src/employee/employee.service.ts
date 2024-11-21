import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Pagination } from "src/graphql/interfaces/pagination.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { EmployeeCreateDto } from "./dto/employee-create.dto";
import { EmployeeUpdateDto } from "./dto/employee-update.dto";
import { EmployeeDto } from "./dto/employee.dto";

@Injectable()
export class EmployeeService {
	constructor(private readonly prisma: PrismaService) {}

	async find(id: string): Promise<EmployeeDto | null> {
		return this.prisma.employee.findUnique({
			where: { id },
		});
	}

	async findWithPagination(
		{ take, skip }: Pagination,
		filterStatus = true,
	): Promise<EmployeeDto[]> {
		const status = filterStatus ? true : undefined;
		return this.prisma.employee.findMany({
			take,
			skip,
			where: { status },
		});
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
