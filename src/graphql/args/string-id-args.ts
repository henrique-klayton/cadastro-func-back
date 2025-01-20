import { ArgsType, Field, ID } from "@nestjs/graphql";

@ArgsType()
export default class StringIdArgs {
	@Field(() => ID, { name: "id" })
	id: string;
}
