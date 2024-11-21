import { NotFoundException } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FindWithPaginationArgs } from "src/graphql/args/find-with-pagination.args";
import { ScheduleCreateDto } from "./dto/schedule-create.dto";
import { ScheduleUpdateDto } from "./dto/schedule-update.dto";
import { ScheduleDto } from "./dto/schedule.dto";
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

	@Query(() => [ScheduleDto])
	async scheduleList(
		@Args() {
			amount: take,
			offset: skip,
			filterStatus,
		}: FindWithPaginationArgs,
	): Promise<ScheduleDto[]> {
		return this.service.findWithPagination({ take, skip }, filterStatus);
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
