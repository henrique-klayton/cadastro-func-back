import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Pagination } from "src/pagination/pagination";

@ObjectType()
export class SkillDto {
	@Field(() => Int)
	id: number;

	@Field(() => String)
	description: string;

	@Field(() => Boolean)
	status: boolean;
}

@ObjectType()
export class PaginatedSkillDto extends Pagination(SkillDto) {}
