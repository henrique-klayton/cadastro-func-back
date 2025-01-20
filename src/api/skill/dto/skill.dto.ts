import { Field, Int, ObjectType } from "@nestjs/graphql";
import Pagination from "src/pagination/pagination";

@ObjectType()
export class SkillDto {
	@Field(() => Int)
	id: number;

	@Field()
	description: string;

	@Field()
	status: boolean;
}

@ObjectType()
export class PaginatedSkillDto extends Pagination(SkillDto) {}
