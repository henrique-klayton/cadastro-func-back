import { Field, InputType, Int } from "@nestjs/graphql";

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
	scheduleId: number;

	schedule = { connect: { id: 0 } };
}
