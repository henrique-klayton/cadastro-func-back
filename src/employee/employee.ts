import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Schedule } from "src/schedule/schedule";
import { Skill } from "src/skill/skill";

@ObjectType()
export class Employee {
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

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	@Field(() => Schedule)
	schedule?: Schedule;

	@Field(() => Number)
	scheduleId?: number;

	@Field(() => [Skill])
	skills?: Skill;
}
