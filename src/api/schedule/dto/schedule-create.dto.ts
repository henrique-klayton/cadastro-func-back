import { Field, InputType } from "@nestjs/graphql";
import { ScheduleType } from "@prisma/client";
import { TimeScalar } from "src/graphql/scalars/time.scalar";

@InputType()
export class ScheduleCreateDto {
	@Field(() => TimeScalar)
	startTime: Date;

	@Field(() => TimeScalar)
	endTime: Date;

	// TODO Type enum
	@Field(() => ScheduleType)
	type: ScheduleType;

	@Field(() => Boolean, { defaultValue: true })
	status = true;
}
