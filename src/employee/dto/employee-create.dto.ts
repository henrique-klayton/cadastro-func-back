import { Field, InputType, Int } from "@nestjs/graphql";
import { Prisma } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

@InputType()
export class EmployeeCreateDto {
	@Field(() => String)
	firstName: string;

	@Field(() => String)
	lastName: string;

	@Field(() => Date)
	birthDate: Date;

	@Field(() => Boolean, { defaultValue: true })
	status = true;

	@Field(() => Int)
	@IsNotEmpty()
	scheduleId?: number;

	schedule: Prisma.ScheduleCreateNestedOneWithoutEmployeesInput = { connect: { id: 0 } };
}
