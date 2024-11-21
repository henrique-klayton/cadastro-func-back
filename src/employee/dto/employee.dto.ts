import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class EmployeeDto {
	@Field(() => ID)
	id: string;

	@Field(() => String)
	firstName: string;

	@Field(() => String)
	lastName: string;

	@Field(() => Date)
	birthDate: Date;

	@Field(() => Boolean)
	status: boolean;

	@Field(() => Int, { nullable: true })
	scheduleId: number | null;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}
