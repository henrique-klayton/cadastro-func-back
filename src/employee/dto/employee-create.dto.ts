import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";

@InputType()
export class EmployeeCreateDto {
	@Field(() => String)
	firstName: string;

	@Field(() => String)
	lastName: string;

	@Field(() => Date)
	birthDate: Date;

	@Field(() => Boolean)
	status: boolean;

	@Field(() => Int)
	scheduleId: number;
}