import { ArgsType, Field, Int } from "@nestjs/graphql";
import { Min } from "class-validator";

@ArgsType()
export class FindWithPaginationArgs {
	@Field(() => Int, { name: "amount", defaultValue: 10 })
	@Min(1)
	take: number;

	@Field(() => Int, { name: "offset", defaultValue: 0 })
	@Min(0)
	skip: number;

	@Field(() => Boolean, { defaultValue: true })
	filterStatus: boolean;
}