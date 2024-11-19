import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class SkillCreateDto {
	@Field(() => String)
	description: string;

	@Field(() => Boolean, { defaultValue: true })
	status = true;
}
