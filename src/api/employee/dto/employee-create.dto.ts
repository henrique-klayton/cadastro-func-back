import { Field, InputType, Int } from "@nestjs/graphql";
import { Prisma } from "@prisma/client";

@InputType()
export class EmployeeCreateDto {
	@Field()
	firstName: string;

	@Field()
	lastName: string;

	@Field()
	birthDate: Date;

	@Field(() => Boolean, { defaultValue: true })
	status = true;

	@Field(() => Int, { nullable: true })
	scheduleId?: number | null;

	schedule: Prisma.ScheduleCreateNestedOneWithoutEmployeesInput = {
		connect: { id: 0 },
	};
}
