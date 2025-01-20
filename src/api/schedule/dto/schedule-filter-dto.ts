import PaginationArgs from "@graphql/args/pagination-args";
import { ArgsType, Field, InputType } from "@nestjs/graphql";
import { ScheduleType } from "@prisma/client";

@InputType()
export class ScheduleFilterDto {
	@Field(() => [ScheduleType], { defaultValue: [] })
	type: ScheduleType[];

	@Field(() => Boolean, { nullable: true })
	status: boolean | null | undefined;
}

@ArgsType()
export class SchedulePaginationArgs extends PaginationArgs(ScheduleFilterDto) {}
