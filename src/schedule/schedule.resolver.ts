import { NotFoundException } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FindWithPaginationArgs } from "src/graphql/args/find-with-pagination.args";
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
	): Promise<ScheduleDto> {
		const schedule = await this.service.find(id);
		if (schedule == null) throw new NotFoundException("Escala não encontrada");
		return schedule;
	}

	@Query(() => [ScheduleDto])
	async scheduleList(
		@Args() { take, skip, filterStatus }: FindWithPaginationArgs,
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
}
