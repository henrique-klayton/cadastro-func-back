import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Employee } from "src/employee/employee";

@ObjectType()
export class Skill {
	@Field(() => ID)
	id: number;

	@Field(() => String)
	description: string;

	@Field(() => Employee)
	employee?: Employee;

	@Field(() => Number)
	employeeId?: number;
}
