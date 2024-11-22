import { ArgsType, Field, Int } from "@nestjs/graphql";
import { Min } from "class-validator";

@ArgsType()
export class FindWithPaginationArgs {
	@Field(() => Int, { name: "limit", defaultValue: 10 })
	@Min(1)
	limit: number;

	@Field(() => Int, { name: "offset", defaultValue: 0 })
	@Min(0)
	offset: number;

	@Field(() => Boolean, { defaultValue: true })
	filterStatus: boolean;
}
