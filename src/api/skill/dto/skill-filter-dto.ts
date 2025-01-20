import PaginationArgs from "@graphql/args/pagination-args";
import { ArgsType, Field, InputType } from "@nestjs/graphql";

@InputType()
export class SkillFilterDto {
	@Field(() => Boolean, { nullable: true })
	status: boolean | null | undefined;
}

@ArgsType()
export class SkillPaginationArgs extends PaginationArgs(SkillFilterDto) {}
