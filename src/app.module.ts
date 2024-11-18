import path from "node:path";

import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EmployeeModule } from "./employee/employee.module";
import { ScheduleModule } from "./schedule/schedule.module";
import { SkillModule } from "./skill/skill.module";
import { ApolloDriver } from "@nestjs/apollo";

@Module({
	imports: [
		GraphQLModule.forRoot({
			driver: ApolloDriver,
			autoSchemaFile: path.join(process.cwd(), "src/schema.gql"),
		}),
		EmployeeModule,
		ScheduleModule,
		SkillModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
