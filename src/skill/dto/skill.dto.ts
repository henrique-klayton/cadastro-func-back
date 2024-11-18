import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { EmployeeDto } from "src/employee/dto/employee.dto";

@ObjectType()
export class Skill {
	@Field(() => Int)
	id: number;

	@Field(() => String)
	description: string;

	@Field(() => Boolean)
	status: boolean;

	// @Field(() => Employee, { nullable: true })
	// employee?: Employee;

	// @Field(() => Int, { nullable: true })
	// employeeId?: number;
}
