import { NotFoundException } from "@nestjs/common";
import { Args, ID, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { SkillCreateDto } from "./dto/skill-create.dto";
import { SkillDto } from "./dto/skill.dto";
import { SkillService } from "./skill.service";

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

	@Mutation(() => SkillDto)
	async createSkill(
		@Args("skill", { type: () => SkillCreateDto }) skill: SkillCreateDto,
		@Args("employees", { type: () => [ID] }) employees: string[],
	) {
		return this.service.create(skill, employees);
	}
}
