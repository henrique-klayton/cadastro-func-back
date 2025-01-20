import PaginationArgs from "@graphql/args/pagination-args";
import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class EmployeeFilterDto {
	@Field(() => [Int], { defaultValue: [] })
	scheduleId: number[];

	@Field(() => Boolean, { nullable: true })
	status: boolean | null | undefined;
}

@ArgsType()
export class EmployeePaginationArgs extends PaginationArgs(EmployeeFilterDto) {}
