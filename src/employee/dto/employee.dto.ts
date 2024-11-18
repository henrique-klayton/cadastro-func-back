import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { Schedule } from "src/schedule/dto/schedule.dto";
import { Skill } from "src/skill/dto/skill.dto";

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

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	@Field(() => Schedule, { nullable: true })
	schedule?: Schedule;

	@Field(() => Int, { nullable: true })
	scheduleId?: number;

	@Field(() => [Skill], { nullable: true })
	skills?: Skill[];
}
