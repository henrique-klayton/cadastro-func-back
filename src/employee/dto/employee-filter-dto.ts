import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";
import PaginationArgs from "src/graphql/args/pagination-args";

@InputType()
export class EmployeeFilterDto {
	@Field(() => Boolean, { defaultValue: true })
	status: boolean;

	@Field(() => [Int], { defaultValue: [] })
	scheduleId: number[];
}

@ArgsType()
export class EmployeePaginationArgs extends PaginationArgs(EmployeeFilterDto) {}
