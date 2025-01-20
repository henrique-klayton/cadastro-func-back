import { NotFoundException } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import ErrorCodes from "@enums/error-codes";
import IntIdArgs from "@graphql/args/int-id-args";
import CreateSkillArgs from "./args/create-skill-args";
import UpdateSkillArgs from "./args/update-skill-args";
import { SkillPaginationArgs } from "./dto/skill-filter-dto";
import { PaginatedSkillDto, SkillDto } from "./dto/skill.dto";
import { SkillService } from "./skill.service";

@Resolver(() => SkillDto)
export class SkillResolver {
	constructor(private readonly service: SkillService) {}

	@Query(() => SkillDto)
	async skill(@Args() { id }: IntIdArgs): Promise<SkillDto> {
		const skill = await this.service.find(id);
		if (skill == null) throw new NotFoundException(ErrorCodes.NOT_FOUND);
		return skill;
	}

	@Query(() => PaginatedSkillDto)
	async skillList(
		@Args() { limit: take, offset: skip, filter }: SkillPaginationArgs,
	): Promise<PaginatedSkillDto> {
		return this.service.findWithPagination({ take, skip }, filter);
	}

	@Mutation(() => SkillDto)
	async createSkill(@Args() { skill, employees }: CreateSkillArgs) {
		return this.service.create(skill, employees);
	}

	@Mutation(() => SkillDto)
	async updateSkill(@Args() { id, skill, employees }: UpdateSkillArgs) {
		return this.service.update(id, skill, employees);
	}

	@Mutation(() => SkillDto)
	async updateSkillStatus(
		@Args() { id }: IntIdArgs,
		@Args("status") status: boolean,
	) {
		return this.service.update(id, { status });
	}

	@Mutation(() => SkillDto)
	async deleteSkill(@Args() { id }: IntIdArgs) {
		return this.service.delete(id);
	}
}
