import { ArgsType, Field, InputType } from "@nestjs/graphql";
import { ScheduleType } from "@prisma/client";
import PaginationArgs from "src/graphql/args/pagination-args";

@InputType()
export class ScheduleFilterDto {
	@Field(() => [ScheduleType], { defaultValue: [] })
	type: ScheduleType[];

	@Field(() => Boolean, { defaultValue: true })
	status: boolean;
}

@ArgsType()
export class SchedulePaginationArgs extends PaginationArgs(ScheduleFilterDto) {}
