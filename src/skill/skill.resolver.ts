import { Args, Int, Query, Resolver } from "@nestjs/graphql";
import { Skill } from "./dto/skill.dto";
import { SkillService } from "./skill.service";
import { NotFoundException } from "@nestjs/common";

@Resolver(() => Skill)
export class SkillResolver {
	constructor(private readonly service: SkillService) {}

	@Query(() => Skill)
	async skill(
		@Args("id", { type: () => Int })
		id: number,
	): Promise<Skill | null> {
		const skill = this.service.find(id);
		if (skill == null) throw new NotFoundException("Habilidade não encontrada");
		return skill;
	}
}
