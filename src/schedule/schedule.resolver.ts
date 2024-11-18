import { Args, Int, Query, Resolver } from "@nestjs/graphql";
import { Schedule } from "./dto/schedule.dto";
import { NotFoundException } from "@nestjs/common";
import { ScheduleService } from "./schedule.service";

@Resolver(() => Schedule)
export class ScheduleResolver {
	constructor(private readonly service: ScheduleService) {}

	@Query(() => Schedule)
	async schedule(
		@Args("id", { type: () => Int })
		id: number,
	): Promise<Schedule | null> {
		const schedule = this.service.find(id);
		if (schedule == null) throw new NotFoundException("Escala não encontrada");
		return schedule;
	}
}
