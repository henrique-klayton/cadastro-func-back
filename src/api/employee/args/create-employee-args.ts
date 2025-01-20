import { ArgsType, Field, Int } from "@nestjs/graphql";
import { EmployeeCreateDto } from "../dto/employee-create.dto";

@ArgsType()
export default class CreateEmployeeArgs {
	@Field()
	employee: EmployeeCreateDto;
	@Field(() => [Int], { nullable: true })
	skills?: number[];
}
