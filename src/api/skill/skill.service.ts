import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import ErrorCodes from "@enums/error-codes";
import { Pagination } from "@graphql/interfaces/pagination.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { SkillCreateDto } from "./dto/skill-create.dto";
import { SkillFilterDto } from "./dto/skill-filter-dto";
import { SkillUpdateDto } from "./dto/skill-update.dto";
import { PaginatedSkillDto, SkillDto } from "./dto/skill.dto";

@Injectable()
export class SkillService {
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: number): Promise<SkillDto | null> {
		return this.prisma.skill.findUnique({
			where: { id },
		});
	}

	async findWithPagination(
		{ take, skip }: Pagination,
		{ status }: SkillFilterDto,
	): Promise<PaginatedSkillDto> {
		const where = { status: status ?? undefined };
		const [count, skills] = await this.prisma.$transaction([
			this.prisma.skill.count({ where }),
			this.prisma.skill.findMany({
				take,
				skip,
				where,
			}),
		]);
		return { data: skills, total: count };
	}

	// TODO Check if trying to create inactive skill with employees relation
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
			throw new InternalServerErrorException(ErrorCodes.CREATE_ERROR, {
				cause: err,
			});
		});
	}

	// TODO Throw an error if an active relation exists while updating to inactive
	async update(
		id: number,
		skill: SkillUpdateDto,
		employeesIds?: string[],
	): Promise<SkillDto> {
		const data: Prisma.SkillUpdateInput = skill;
		const where: Prisma.SkillWhereUniqueInput = { id };

		// Update Employees
		if (employeesIds != null && skill.status) {
			data.employees = {
				connectOrCreate: employeesIds.map((employeeId) => ({
					where: { employeeId_skillId: { employeeId, skillId: id } },
					create: {
						employee: { connect: { id: employeeId, NOT: { status: false } } },
					},
				})),
			};
		}

		// Check for active employees before deactivate
		if (!skill.status) {
			where.employees = { none: { employee: { status: true } } };
		}

		return this.prisma.skill.update({ where: { id }, data }).catch((err) => {
			throw new InternalServerErrorException(ErrorCodes.UPDATE_ERROR, {
				cause: err,
			});
		});
	}

	// TODO Check if it has an active relation before delete
	async delete(id: number): Promise<SkillDto> {
		return this.prisma.skill.delete({ where: { id } }).catch((err) => {
			throw new InternalServerErrorException(ErrorCodes.DELETE_ERROR, {
				cause: err,
			});
		});
	}
}
