import StringIdArgs from "@graphql/args/string-id-args";
import { ArgsType, Field, Int } from "@nestjs/graphql";
import { EmployeeUpdateDto } from "../dto/employee-update.dto";

@ArgsType()
export default class UpdateEmployeeArgs extends StringIdArgs {
	@Field()
	employee: EmployeeUpdateDto;
	@Field(() => [Int], { nullable: true })
	skills?: number[];
}
