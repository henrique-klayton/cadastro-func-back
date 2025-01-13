import { Type } from "@nestjs/common";
import { Field, Int, ObjectType } from "@nestjs/graphql";

export default function Pagination<T>(classRef: Type<T>) {
	@ObjectType({ isAbstract: true })
	abstract class PaginatedType<T> {
		@Field(() => [classRef])
		data: T[];

		@Field(() => Int)
		total: number;
	}

	return PaginatedType as Type<PaginatedType<T>>;
}
