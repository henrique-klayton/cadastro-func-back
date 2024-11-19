import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { SkillCreateDto } from "./dto/skill-create.dto";
import { SkillDto } from "./dto/skill.dto";

@Injectable()
export class SkillService {
	constructor(private readonly prisma: PrismaService) {}

	async find(id: number): Promise<SkillDto | null> {
		return this.prisma.skill.findUnique({
			where: { id },
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
}