import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { ScheduleType } from "@prisma/client";
import { EmployeeDto } from "src/employee/dto/employee.dto";

@ObjectType()
export class Schedule {
	@Field(() => Int)
	id: number;

	@Field(() => Date)
	startTime: Date;

	@Field(() => Date)
	endTime: Date;

	// TODO Type enum
	@Field(() => String)
	type: ScheduleType;

	@Field(() => Boolean)
	status: boolean;

	@Field(() => EmployeeDto, { nullable: true })
	employee?: EmployeeDto;

	@Field(() => Int, { nullable: true })
	employeeId?: number;
}
