import { NotFoundException } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ScheduleCreateDto } from "./dto/schedule-create.dto";
import { SchedulePaginationArgs } from "./dto/schedule-filter-dto";
import { ScheduleUpdateDto } from "./dto/schedule-update.dto";
import { PaginatedScheduleDto, ScheduleDto } from "./dto/schedule.dto";
import { ScheduleService } from "./schedule.service";

@Resolver(() => ScheduleDto)
export class ScheduleResolver {
	constructor(private readonly service: ScheduleService) {}

	@Query(() => ScheduleDto)
	async schedule(
		@Args("id", { type: () => Int })
		id: number,
	): Promise<ScheduleDto> {
		const schedule = await this.service.find(id);
		if (schedule == null) throw new NotFoundException("Escala não encontrada");
		return schedule;
	}

	@Query(() => PaginatedScheduleDto)
	async scheduleList(
		@Args() { limit: take, offset: skip, filter }: SchedulePaginationArgs,
	): Promise<PaginatedScheduleDto> {
		return this.service.findWithPagination({ take, skip }, filter);
	}

	@Mutation(() => ScheduleDto)
	async createSchedule(
		@Args("schedule", { type: () => ScheduleCreateDto })
		schedule: ScheduleCreateDto,
	) {
		return this.service.create(schedule);
	}

	@Mutation(() => ScheduleDto)
	async updateSchedule(
		@Args("id", { type: () => Int })
		id: number,
		@Args("schedule", { type: () => ScheduleUpdateDto })
		schedule: ScheduleUpdateDto,
	) {
		return this.service.update(id, schedule);
	}

	@Mutation(() => ScheduleDto)
	async updateScheduleStatus(
		@Args("id", { type: () => Int })
		id: number,
		@Args("status", { type: () => Boolean })
		status: boolean,
	) {
		return this.service.update(id, { status });
	}

	@Mutation(() => ScheduleDto)
	async deleteSchedule(
		@Args("id", { type: () => Int })
		id: number,
	) {
		return this.service.delete(id);
	}
}
