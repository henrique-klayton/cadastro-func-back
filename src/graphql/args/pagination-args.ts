import { Type } from "@nestjs/common";
import { ArgsType, Field, Int } from "@nestjs/graphql";
import { Min } from "class-validator";

export default function PaginationArgs<T>(filterRef: Type<T>) {
	@ArgsType()
	abstract class PaginationArgsType<T> {
		@Field(() => Int, { name: "limit", defaultValue: 10 })
		@Min(1)
		limit: number;

		@Field(() => Int, { name: "offset", defaultValue: 0 })
		@Min(0)
		offset: number;

		@Field(() => filterRef)
		filter: T;
	}

	return PaginationArgsType as Type<PaginationArgsType<T>>;
}
