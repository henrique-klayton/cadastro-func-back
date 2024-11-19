import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ScheduleDto } from "./dto/schedule.dto";

@Injectable()
export class ScheduleService {
	constructor(private readonly prisma: PrismaService) {}

	async find(id: number): Promise<ScheduleDto | null> {
		return this.prisma.schedule.findUnique({
			where: { id },
		});
	}
}
