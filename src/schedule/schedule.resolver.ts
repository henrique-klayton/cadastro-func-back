import { NotFoundException } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ScheduleCreateDto } from "./dto/schedule-create.dto";
import { ScheduleDto } from "./dto/schedule.dto";
import { ScheduleService } from "./schedule.service";

@Resolver(() => ScheduleDto)
export class ScheduleResolver {
	constructor(private readonly service: ScheduleService) {}

	@Query(() => ScheduleDto)
	async schedule(
		@Args("id", { type: () => Int })
		id: number,
	): Promise<ScheduleDto | null> {
		const schedule = this.service.find(id);
		if (schedule == null) throw new NotFoundException("Escala não encontrada");
		return schedule;
	}

	@Mutation(() => ScheduleDto)
	async createSchedule(
		@Args("schedule", { type: () => ScheduleCreateDto })
		schedule: ScheduleCreateDto,
	) {
		return this.service.create(schedule);
	}
}
