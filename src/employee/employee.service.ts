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
		skills: number[],
	): Promise<EmployeeDto> {
		const skillsIds = skills.map((id) => {
			return { id };
		});

		const data: Prisma.EmployeeCreateInput = employee;
		data.skills = { connect: skillsIds };
		return this.prisma.employee.create({ data });
	}

	async update(
		id: string,
		employee: EmployeeUpdateDto,
		skills?: number[],
	): Promise<EmployeeDto> {
		const data: Prisma.EmployeeUpdateInput = employee;
		if (skills != null) {
			const skillsIds = skills.map((id) => {
				return { id, NOT: { status: false } };
			});
			data.skills = { connect: skillsIds };
		}

		return this.prisma.employee.update({ where: { id }, data }).catch((err) => {
			throw new BadRequestException("Error while updating skill", {
				cause: err,
			});
		});
	}

	async updateStatus(id: string, status: boolean): Promise<EmployeeDto> {
		return this.prisma.employee.update({
			where: { id },
			data: { status },
		});
	}

	async delete(id: string): Promise<EmployeeDto> {
		return this.prisma.employee.delete({ where: { id } });
	}
}
