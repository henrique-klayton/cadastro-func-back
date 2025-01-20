import IntIdArgs from "@graphql/args/int-id-args";
import { ArgsType, Field, ID } from "@nestjs/graphql";
import { SkillUpdateDto } from "../dto/skill-update.dto";

@ArgsType()
export default class UpdateSkillArgs extends IntIdArgs {
	@Field()
	skill: SkillUpdateDto;
	@Field(() => [ID], { nullable: true })
	employees?: string[];
}
