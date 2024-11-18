import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { ScheduleResolver } from "./schedule.resolver";
import { ScheduleService } from "./schedule.service";

@Module({
	imports: [PrismaModule],
	providers: [ScheduleService, ScheduleResolver],
})
export class ScheduleModule {}
