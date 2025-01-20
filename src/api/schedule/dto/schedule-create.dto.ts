import { TimeScalar } from "@graphql/scalars/time.scalar";
import { Field, InputType } from "@nestjs/graphql";
import { ScheduleType } from "@prisma/client";

@InputType()
export class ScheduleCreateDto {
	@Field(() => TimeScalar)
	startTime: Date;

	@Field(() => TimeScalar)
	endTime: Date;

	@Field(() => ScheduleType)
	type: ScheduleType;

	@Field(() => Boolean, { defaultValue: true })
	status = true;
}
