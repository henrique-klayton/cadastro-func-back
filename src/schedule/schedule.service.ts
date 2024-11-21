import { BadRequestException, Injectable } from "@nestjs/common";
import { Pagination } from "src/graphql/interfaces/pagination.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ScheduleCreateDto } from "./dto/schedule-create.dto";
import { ScheduleUpdateDto } from "./dto/schedule-update.dto";
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

	async update(id: number, data: ScheduleUpdateDto): Promise<ScheduleDto> {
		return this.prisma.schedule.update({ where: { id }, data });
	}

	async updateStatus(id: number, status: boolean): Promise<ScheduleDto> {
		return this.prisma.schedule.update({
			where: { id },
			data: { status },
		});
	}

	async delete(id: number): Promise<ScheduleDto> {
		return this.prisma.schedule.delete({ where: { id } }).catch((err) => {
			throw new BadRequestException("Error while deleting schedule", {
				cause: err,
			});
		});
	}
}
