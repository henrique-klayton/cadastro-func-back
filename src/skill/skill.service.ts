import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Pagination } from "src/graphql/interfaces/pagination.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { SkillCreateDto } from "./dto/skill-create.dto";
import { SkillUpdateDto } from "./dto/skill-update.dto";
import { SkillDto } from "./dto/skill.dto";

@Injectable()
export class SkillService {
	constructor(private readonly prisma: PrismaService) {}

	async find(id: number): Promise<SkillDto | null> {
		return this.prisma.skill.findUnique({
			where: { id },
		});
	}

	async findWithPagination(
		{ take, skip }: Pagination,
		filterStatus = true,
	): Promise<SkillDto[]> {
		const status = filterStatus ? true : undefined;
		return this.prisma.skill.findMany({
			take,
			skip,
			where: { status },
		});
	}

	async create(
		skill: SkillCreateDto,
		employeesIds?: string[],
	): Promise<SkillDto> {
		const data: Prisma.SkillCreateInput = skill;
		if (employeesIds != null) {
			data.employees = {
				create: employeesIds.map((id) => ({
					employee: { connect: { id, NOT: { status: false } } },
				})),
			};
		}

		return this.prisma.skill.create({ data }).catch((err) => {
			throw new BadRequestException("Error while creating skill", {
				cause: err,
			});
		});
	}

	async update(
		id: number,
		skill: SkillUpdateDto,
		employeesIds?: string[],
	): Promise<SkillDto> {
		const data: Prisma.SkillUpdateInput = skill;
		if (employeesIds != null) {
			data.employees = {
				connectOrCreate: employeesIds.map((employeeId) => ({
					where: { employeeId_skillId: { employeeId, skillId: id } },
					create: {
						employee: { connect: { id: employeeId, NOT: { status: false } } },
					},
				})),
			};
		}

		return this.prisma.skill.update({ where: { id }, data }).catch((err) => {
			throw new BadRequestException("Error while updating skill", {
				cause: err,
			});
		});
	}

	async updateStatus(id: number, status: boolean): Promise<SkillDto> {
		return this.prisma.skill.update({
			where: { id },
			data: { status },
		});
	}

	async delete(id: number): Promise<SkillDto> {
		return this.prisma.skill.delete({ where: { id } }).catch((err) => {
			throw new BadRequestException("Error while deleting skill", {
				cause: err,
			});
		});
	}
}
