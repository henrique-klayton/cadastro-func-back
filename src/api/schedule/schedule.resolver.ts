import { NotFoundException } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import ErrorCodes from "@enums/error-codes";
import IntIdArgs from "@graphql/args/int-id-args";
import UpdateScheduleArgs from "./args/update-schedule-args";
import { ScheduleCreateDto } from "./dto/schedule-create.dto";
import { SchedulePaginationArgs } from "./dto/schedule-filter-dto";
import { PaginatedScheduleDto, ScheduleDto } from "./dto/schedule.dto";
import { ScheduleService } from "./schedule.service";

@Resolver(() => ScheduleDto)
export class ScheduleResolver {
	constructor(private readonly service: ScheduleService) {}

	@Query(() => ScheduleDto)
	async schedule(@Args() { id }: IntIdArgs): Promise<ScheduleDto> {
		const schedule = await this.service.find(id);
		if (schedule == null) throw new NotFoundException(ErrorCodes.NOT_FOUND);
		return schedule;
	}

	@Query(() => PaginatedScheduleDto)
	async scheduleList(
		@Args() { limit: take, offset: skip, filter }: SchedulePaginationArgs,
	): Promise<PaginatedScheduleDto> {
		return this.service.findWithPagination({ take, skip }, filter);
	}

	@Mutation(() => ScheduleDto)
	async createSchedule(@Args("schedule") schedule: ScheduleCreateDto) {
		return this.service.create(schedule);
	}

	@Mutation(() => ScheduleDto)
	async updateSchedule(@Args() { id, schedule }: UpdateScheduleArgs) {
		return this.service.update(id, schedule);
	}

	@Mutation(() => ScheduleDto)
	async updateScheduleStatus(
		@Args() { id }: IntIdArgs,
		@Args("status") status: boolean,
	) {
		return this.service.update(id, { status });
	}

	@Mutation(() => ScheduleDto)
	async deleteSchedule(@Args() { id }: IntIdArgs) {
		return this.service.delete(id);
	}
}
