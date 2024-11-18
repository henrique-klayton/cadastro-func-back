import { Injectable } from "@nestjs/common";
import { Pagination } from "src/pagination/pagination.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { EmployeeDto } from "./dto/employee.dto";
import { Employee } from "@prisma/client";

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

	async create(data: Employee): Promise<EmployeeDto> {
		return this.prisma.employee.create({ data });
	}

	async update(id: string, data: Employee): Promise<EmployeeDto> {
		return this.prisma.employee.update({ where: { id }, data });
	}

	async updateStatus(id: string, status: boolean): Promise<EmployeeDto> {
		return this.prisma.employee.update({ where: { id }, data: { status } });
	}

	async delete(id: string): Promise<EmployeeDto> {
		return this.prisma.employee.delete({ where: { id } });
	}
}
