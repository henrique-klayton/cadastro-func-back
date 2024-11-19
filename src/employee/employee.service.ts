import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Pagination } from "src/graphql/interfaces/pagination.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { EmployeeCreateDto } from "./dto/employee-create.dto";
import { EmployeeDto } from "./dto/employee.dto";

@Injectable()
export class EmployeeService {
	constructor(private readonly prisma: PrismaService) {}

	async find(id: string): Promise<EmployeeDto | null> {
		return this.prisma.employee.findUnique({
			where: { id },
		});
	}

	async findList(
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

	async update(id: string, data: EmployeeDto): Promise<EmployeeDto> {
		return this.prisma.employee.update({ where: { id }, data });
	}

	async updateStatus(id: string, status: boolean): Promise<EmployeeDto> {
		return this.prisma.employee.update({ where: { id }, data: { status } });
	}

	async delete(id: string): Promise<EmployeeDto> {
		return this.prisma.employee.delete({ where: { id } });
	}
}
