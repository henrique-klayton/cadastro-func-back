import { ArgsType, Field, InputType } from "@nestjs/graphql";
import PaginationArgs from "src/graphql/args/pagination-args";

@InputType()
export class SkillFilterDto {
	@Field(() => Boolean, { nullable: true })
	status: boolean | null | undefined;
}

@ArgsType()
export class SkillPaginationArgs extends PaginationArgs(SkillFilterDto) {}
