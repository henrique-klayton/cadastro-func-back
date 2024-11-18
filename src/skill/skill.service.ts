import { Injectable } from "@nestjs/common";
import { Skill } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SkillService {
	constructor(private readonly prisma: PrismaService) {}

	async find(id: number): Promise<Skill | null> {
		return this.prisma.skill.findUnique({
			where: { id },
		});
	}
}
