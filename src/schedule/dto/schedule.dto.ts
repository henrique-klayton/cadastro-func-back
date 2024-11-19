import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ScheduleCreateDto } from "./schedule-create.dto";
import { ScheduleType } from "@prisma/client";

@ObjectType()
export class ScheduleDto extends ScheduleCreateDto {
	@Field(() => Int)
	id: number;

	@Field(() => Date)
	startTime: Date;

	@Field(() => Date)
	endTime: Date;

	@Field(() => ScheduleType)
	type: ScheduleType;

	@Field(() => Boolean)
	status: boolean;
}
