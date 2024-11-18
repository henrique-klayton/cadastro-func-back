import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { SkillResolver } from "./skill.resolver";
import { SkillService } from "./skill.service";

@Module({
	imports: [PrismaModule],
	providers: [SkillService, SkillResolver],
})
export class SkillModule {}
