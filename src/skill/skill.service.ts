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

	async create(skill: SkillCreateDto, employees: string[]): Promise<SkillDto> {
		const employeesIds = employees.map((id) => {
			return { id };
		});

		const data: Prisma.SkillCreateInput = skill;
		data.employees = { connect: employeesIds };
		return this.prisma.skill.create({ data });
	}

	async update(
		id: number,
		skill: SkillUpdateDto,
		employees?: string[],
	): Promise<SkillDto> {
		const data: Prisma.SkillUpdateInput = skill;
		if (employees != null) {
			const employeesIds = employees.map((id) => {
				return { id, NOT: { status: false } };
			});
			data.employees = { connect: employeesIds };
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
}
