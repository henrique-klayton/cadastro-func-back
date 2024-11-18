import { Field, ID, ObjectType } from "@nestjs/graphql";
import { ScheduleType } from "@prisma/client";
import { Employee } from "src/employee/employee";

@ObjectType()
export class Schedule {
	@Field(() => ID)
	id: number;

	@Field(() => Date)
	startTime: Date;

	@Field(() => Date)
	endTime: Date;

	@Field(() => ScheduleType)
	type: ScheduleType;

	@Field(() => Boolean)
	status: boolean;

	@Field(() => Employee)
	employee?: Employee;

	@Field(() => Number)
	employeeId?: number;
}
