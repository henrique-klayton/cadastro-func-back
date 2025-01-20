import { ArgsType, Field, ID } from "@nestjs/graphql";
import { SkillCreateDto } from "../dto/skill-create.dto";

@ArgsType()
export default class CreateSkillArgs {
	@Field()
	skill: SkillCreateDto;
	@Field(() => [ID], { nullable: true })
	employees?: string[];
}
