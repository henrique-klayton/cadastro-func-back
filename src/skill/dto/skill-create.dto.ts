import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class SkillCreateDto {
	@Field(() => String)
	description: string;

	@Field(() => Boolean)
	status: boolean;
}
