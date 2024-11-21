import { NotFoundException } from "@nestjs/common";
import { Args, ID, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FindWithPaginationArgs } from "src/graphql/args/find-with-pagination.args";
import { EmployeeCreateDto } from "./dto/employee-create.dto";
import { EmployeeUpdateDto } from "./dto/employee-update.dto";
import { EmployeeDto } from "./dto/employee.dto";
import { EmployeeService } from "./employee.service";

@Resolver(() => EmployeeDto)
export class EmployeeResolver {
	constructor(private readonly service: EmployeeService) {}

	@Query(() => EmployeeDto)
	async employee(
		@Args("id", { type: () => ID }) id: string,
	): Promise<EmployeeDto> {
		const employee = await this.service.find(id);
		if (employee == null)
			throw new NotFoundException("Funcionário não encontrado");
		return employee;
	}

	@Query(() => [EmployeeDto])
	async employeeList(
		@Args() {
			amount: take,
			offset: skip,
			filterStatus,
		}: FindWithPaginationArgs,
	): Promise<EmployeeDto[]> {
		return this.service.findWithPagination({ take, skip }, filterStatus);
	}

	@Mutation(() => EmployeeDto)
	async createEmployee(
		@Args("employee", { type: () => EmployeeCreateDto })
		employee: EmployeeCreateDto,
		@Args("skills", { type: () => [Int], nullable: true })
		skills?: number[],
	) {
		return this.service.create(employee, skills);
	}

	@Mutation(() => EmployeeDto)
	async updateEmployee(
		@Args("id", { type: () => ID })
		id: string,
		@Args("employee", { type: () => EmployeeUpdateDto })
		employee: EmployeeUpdateDto,
		@Args("skills", { type: () => [Int], nullable: true })
		skills?: number[],
	) {
		return this.service.update(id, employee, skills);
	}

	@Mutation(() => EmployeeDto)
	async updateEmployeeStatus(
		@Args("id", { type: () => ID })
		id: string,
		@Args("status", { type: () => Boolean })
		status: boolean,
	) {
		return this.service.updateStatus(id, status);
	}

	@Mutation(() => EmployeeDto)
	async deleteEmployee(
		@Args("id", { type: () => ID })
		id: string,
	) {
		return this.service.delete(id);
	}
}
