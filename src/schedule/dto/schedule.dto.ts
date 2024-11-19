import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ScheduleType } from "@prisma/client";
import { TimeScalar } from "src/graphql/scalars/time.scalar";
import { ScheduleCreateDto } from "./schedule-create.dto";

@ObjectType()
export class ScheduleDto extends ScheduleCreateDto {
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
