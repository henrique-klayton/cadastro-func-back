import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";
import PaginationArgs from "src/graphql/args/pagination-args";

@InputType()
export class EmployeeFilterDto {
	@Field(() => [Int], { defaultValue: [] })
	scheduleId: number[];

	@Field(() => Boolean, { nullable: true })
	status: boolean | null | undefined;
}

@ArgsType()
export class EmployeePaginationArgs extends PaginationArgs(EmployeeFilterDto) {}
