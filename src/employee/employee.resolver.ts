import { NotFoundException } from "@nestjs/common";
import { Args, ID, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { SkillCreateDto } from "src/skill/dto/skill-create.dto";
import { EmployeeCreateDto } from "./dto/employee-create.dto";
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
		@Args("amount", { type: () => Int, defaultValue: 10 })
		take: number,
		@Args("offset", { type: () => Int, defaultValue: 0 })
		skip: number,
		@Args("filterStatus", { type: () => Boolean, defaultValue: true })
		filterStatus: boolean,
	): Promise<EmployeeDto[]> {
		return this.service.findList({ take, skip }, filterStatus);
	}

	@Mutation(() => EmployeeDto)
	async createEmployee(
		@Args("employee", { type: () => EmployeeCreateDto }) employee: EmployeeCreateDto,
		@Args("skills", { type: () => [Int] }) skills: number[],
	) {
		return this.service.create(employee, skills);
	}
}
