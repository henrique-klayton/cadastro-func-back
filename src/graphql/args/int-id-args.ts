import { ArgsType, Field, Int } from "@nestjs/graphql";

@ArgsType()
export default class IntIdArgs {
	@Field(() => Int, { name: "id" })
	id: number;
}
