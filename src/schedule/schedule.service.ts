import { Injectable } from "@nestjs/common";
import { Pagination } from "src/graphql/interfaces/pagination.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ScheduleCreateDto } from "./dto/schedule-create.dto";
import { ScheduleDto } from "./dto/schedule.dto";

@Injectable()
export class ScheduleService {
	constructor(private readonly prisma: PrismaService) {}

	async find(id: number): Promise<ScheduleDto | null> {
		return this.prisma.schedule.findUnique({
			where: { id },
		});
	}

	async findWithPagination(
		{ take, skip }: Pagination,
		filterStatus = true,
	): Promise<ScheduleDto[]> {
		const status = filterStatus ? true : undefined;
		return this.prisma.schedule.findMany({
			take,
			skip,
			where: { status },
		});
	}

	async create(data: ScheduleCreateDto): Promise<ScheduleDto> {
		return this.prisma.schedule.create({ data });
	}
}
