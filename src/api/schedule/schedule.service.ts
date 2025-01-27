import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError as PrismaKnownError } from "@prisma/client/runtime/library";

import ErrorCodes from "@enums/error-codes";
import { Pagination } from "@graphql/interfaces/pagination.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ScheduleCreateDto } from "./dto/schedule-create.dto";
import { ScheduleFilterDto } from "./dto/schedule-filter-dto";
import { ScheduleUpdateDto } from "./dto/schedule-update.dto";
import { PaginatedScheduleDto, ScheduleDto } from "./dto/schedule.dto";

@Injectable()
export class ScheduleService {
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: number): Promise<ScheduleDto | null> {
		return this.prisma.schedule.findUnique({
			where: { id },
		});
	}

	async findWithPagination(
		{ take, skip }: Pagination,
		{ status, type: typeList }: ScheduleFilterDto,
	): Promise<PaginatedScheduleDto> {
		const hasTypes = typeList.length > 0;
		const type = hasTypes ? { in: typeList } : undefined;
		const where = { status: status ?? undefined, type };
		const [count, schedules] = await this.prisma.$transaction([
			this.prisma.schedule.count({ where }),
			this.prisma.schedule.findMany({
				take,
				skip,
				where,
			}),
		]);
		return { data: schedules, total: count };
	}

	async findAllReport() {
		const employeeSelect = {
			select: {
				id: true,
				firstName: true,
				lastName: true,
			},
		};
		return await this.prisma.schedule
			.findMany({ include: { employees: employeeSelect } })
			.catch((err: unknown) => {
				throw new InternalServerErrorException(ErrorCodes.READ_ERROR, {
					cause: err,
				});
			});
	}

	async create(data: ScheduleCreateDto): Promise<ScheduleDto> {
		return this.prisma.schedule.create({ data });
	}

	// TODO Throw an error if an active relation exists while updating to inactive
	async update(id: number, data: ScheduleUpdateDto): Promise<ScheduleDto> {
		const where: Prisma.ScheduleWhereUniqueInput = { id };
		if (!data.status) where.employees = { none: { status: true } };
		return this.prisma.schedule.update({ where, data }).catch((err) => {
			throw new InternalServerErrorException(ErrorCodes.UPDATE_ERROR, {
				cause: err,
			});
		});
	}

	async delete(id: number): Promise<ScheduleDto> {
		return this.prisma.schedule.delete({ where: { id } }).catch((err) => {
			if (err instanceof PrismaKnownError && err.message) {
				if (err.message.match(/constraint.*employee/gi)) {
					throw new BadRequestException(ErrorCodes.HAS_ACTIVE_RELATIONS);
				}
			}
			throw new InternalServerErrorException(ErrorCodes.DELETE_ERROR, {
				cause: err,
			});
		});
	}
}
