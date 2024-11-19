import { Args, Int, Query, Resolver } from "@nestjs/graphql";
import { SkillDto } from "./dto/skill.dto";
import { SkillService } from "./skill.service";
import { NotFoundException } from "@nestjs/common";

@Resolver(() => SkillDto)
export class SkillResolver {
	constructor(private readonly service: SkillService) {}

	@Query(() => SkillDto)
	async skill(
		@Args("id", { type: () => Int })
		id: number,
	): Promise<SkillDto | null> {
		const skill = this.service.find(id);
		if (skill == null) throw new NotFoundException("Habilidade não encontrada");
		return skill;
	}
}
