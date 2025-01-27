import { NotFoundException } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import ErrorCodes from "@enums/error-codes";
import StringIdArgs from "@graphql/args/string-id-args";
import dayjs from "dayjs";
import arrayToCsv from "src/functions/array-to-csv";
import CreateEmployeeArgs from "./args/create-employee-args";
import UpdateEmployeeArgs from "./args/update-employee-args";
import { EmployeePaginationArgs } from "./dto/employee-filter-dto";
import { EmployeeFullDto } from "./dto/employee-full-dto";
import { EmployeeDto, PaginatedEmployeeDto } from "./dto/employee.dto";
import { EmployeeService } from "./employee.service";

@Resolver(() => EmployeeDto)
export class EmployeeResolver {
	constructor(private readonly service: EmployeeService) {}

	@Query(() => EmployeeDto)
	async employee(@Args() { id }: StringIdArgs): Promise<EmployeeDto> {
		const employee = await this.service.findById(id);
		if (employee == null) throw new NotFoundException(ErrorCodes.NOT_FOUND);
		return employee;
	}

	@Query(() => EmployeeFullDto)
	async employeeWithRelations(
		@Args() { id }: StringIdArgs,
	): Promise<EmployeeFullDto> {
		const employee = await this.service.findById(id, true);
		if (employee == null) throw new NotFoundException(ErrorCodes.NOT_FOUND);
		return employee;
	}

	@Query(() => PaginatedEmployeeDto)
	async employeeList(
		@Args() { limit: take, offset: skip, filter }: EmployeePaginationArgs,
	): Promise<PaginatedEmployeeDto> {
		return this.service.findWithPagination({ take, skip }, filter);
	}

	@Query(() => String)
	async generateEmployeeReport(): Promise<string> {
		return this.service.findAll().then((data) => {
			const dateFormat = "DD/MM/YYYY HH:mm:ss";
			const csvData = data.map((item) => {
				let startTime = "";
				let endTime = "";
				if (item.schedule) {
					startTime = dayjs(item.schedule.startTime).format(dateFormat);
					endTime = dayjs(item.schedule.endTime).format(dateFormat);
				}
				return {
					...item,
					birthDate: dayjs(item.birthDate).format(dateFormat),
					scheduleStartTime: startTime,
					scheduleEndTime: endTime,
					scheduleType: item.schedule?.type,
					skills: item.skills.map(({ skill }) => skill.description),
				};
			});

			return arrayToCsv(
				[
					"id",
					"firstName",
					"lastName",
					"birthDate",
					"status",
					"scheduleId",
					"scheduleStartTime",
					"scheduleEndTime",
					"scheduleType",
					"skills",
				],
				csvData,
				";",
			);
		});
	}

	@Mutation(() => EmployeeDto)
	async createEmployee(@Args() { employee, skills }: CreateEmployeeArgs) {
		return this.service.create(employee, skills);
	}

	@Mutation(() => EmployeeDto)
	async updateEmployee(@Args() { id, employee, skills }: UpdateEmployeeArgs) {
		return this.service.update(id, employee, skills);
	}

	@Mutation(() => EmployeeDto)
	async updateEmployeeStatus(
		@Args() { id }: StringIdArgs,
		@Args("status") status: boolean,
	) {
		return this.service.update(id, { status });
	}

	@Mutation(() => EmployeeDto)
	async deleteEmployee(@Args() { id }: StringIdArgs) {
		return this.service.delete(id);
	}
}
