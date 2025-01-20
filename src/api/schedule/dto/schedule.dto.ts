import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ScheduleType } from "@prisma/client";
import { TimeScalar } from "src/graphql/scalars/time.scalar";
import Pagination from "src/pagination/pagination";

@ObjectType()
export class ScheduleDto {
	@Field(() => Int)
	id: number;

	@Field(() => TimeScalar)
	startTime: Date;

	@Field(() => TimeScalar)
	endTime: Date;

	@Field(() => ScheduleType)
	type: ScheduleType;

	@Field(() => Boolean)
	status: boolean;
}

@ObjectType()
export class PaginatedScheduleDto extends Pagination(ScheduleDto) {}
