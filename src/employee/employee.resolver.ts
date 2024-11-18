import { Args, ID, Int, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { EmployeeDto } from "./dto/employee.dto";
import { EmployeeService } from "./employee.service";
import { NotFoundException } from "@nestjs/common";

@Resolver(() => EmployeeDto)
export class EmployeeResolver {
	constructor(private readonly service: EmployeeService) {}

	@Query(() => EmployeeDto)
	async employee(
		@Args("id", { type: () => ID }) id: string,
	): Promise<EmployeeDto | null> {
		const employee = this.service.find(id);
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

	@Query(() => EmployeeDto)
	async asd(@Args("id", { type: () => ID }) id: string) {
		return this.service.find(id);
	}
}
