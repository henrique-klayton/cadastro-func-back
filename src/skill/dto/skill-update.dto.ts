import { InputType, PartialType } from "@nestjs/graphql";
import { SkillCreateDto } from "./skill-create.dto";

@InputType()
export class SkillUpdateDto extends PartialType(SkillCreateDto) {}
