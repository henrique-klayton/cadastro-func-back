import { Field, Int, ObjectType } from "@nestjs/graphql";
import { SkillCreateDto } from "./skill-create.dto";
import { EmployeeDto } from "src/employee/dto/employee.dto";

@ObjectType()
export class SkillDto extends SkillCreateDto {
	@Field(() => Int)
	id: number;

	@Field(() => String)
	description: string;

	@Field(() => Boolean)
	status: boolean;

	// @Field(() => [EmployeeDto], { nullable: true })
	// employees?: EmployeeDto[];
}
