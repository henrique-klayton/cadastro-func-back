import { Field, InputType } from "@nestjs/graphql";
import { ScheduleType } from "@prisma/client";

@InputType()
export class ScheduleCreateDto {
	@Field(() => Date)
	startTime: Date;

	@Field(() => Date)
	endTime: Date;

	// TODO Type enum
	@Field(() => ScheduleType)
	type: ScheduleType;

	@Field(() => Boolean)
	status: boolean;
}
