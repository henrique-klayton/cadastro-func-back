import { Injectable } from "@nestjs/common";
import { Schedule } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ScheduleService {
	constructor(private readonly prisma: PrismaService) {}

	async find(id: number): Promise<Schedule | null> {
		return this.prisma.schedule.findUnique({
			where: { id },
		});
	}
}
