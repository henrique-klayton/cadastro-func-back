import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EmployeeModule } from "./employee/employee.module";
import { ScheduleModule } from "./schedule/schedule.module";
import { SkillModule } from "./skill/skill.module";

@Module({
	imports: [EmployeeModule, ScheduleModule, SkillModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
