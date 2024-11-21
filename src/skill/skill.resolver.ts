import { NotFoundException } from "@nestjs/common";
import { Args, ID, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FindWithPaginationArgs } from "src/graphql/args/find-with-pagination.args";
import { SkillCreateDto } from "./dto/skill-create.dto";
import { SkillUpdateDto } from "./dto/skill-update.dto";
import { SkillDto } from "./dto/skill.dto";
import { SkillService } from "./skill.service";

@Resolver(() => SkillDto)
export class SkillResolver {
	constructor(private readonly service: SkillService) {}

	@Query(() => SkillDto)
	async skill(
		@Args("id", { type: () => Int })
		id: number,
	): Promise<SkillDto> {
		const skill = await this.service.find(id);
		if (skill == null) throw new NotFoundException("Habilidade não encontrada");
		return skill;
	}

	@Query(() => [SkillDto])
	async skillList(
		@Args() {
			amount: take,
			offset: skip,
			filterStatus,
		}: FindWithPaginationArgs,
	): Promise<SkillDto[]> {
		return this.service.findWithPagination({ take, skip }, filterStatus);
	}

	@Mutation(() => SkillDto)
	async createSkill(
		@Args("skill", { type: () => SkillCreateDto })
		skill: SkillCreateDto,
		@Args("employees", { type: () => [ID], nullable: true })
		employees?: string[],
	) {
		return this.service.create(skill, employees);
	}

	@Mutation(() => SkillDto)
	async updateSkill(
		@Args("id", { type: () => Int })
		id: number,
		@Args("skill", { type: () => SkillUpdateDto })
		skill: SkillUpdateDto,
		@Args("employees", { type: () => [ID], nullable: true })
		employees?: string[],
	) {
		return this.service.update(id, skill, employees);
	}

	@Mutation(() => SkillDto)
	async updateSkillStatus(
		@Args("id", { type: () => Int })
		id: number,
		@Args("status", { type: () => Boolean })
		status: boolean,
	) {
		return this.service.update(id, { status });
	}

	@Mutation(() => SkillDto)
	async deleteSkill(
		@Args("id", { type: () => Int })
		id: number,
	) {
		return this.service.delete(id);
	}
}
