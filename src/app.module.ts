import path from "node:path";

import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EmployeeModule } from "./employee/employee.module";
import { TimeScalar } from "./graphql/scalars/time.scalar";
import { PrismaModule } from "./prisma/prisma.module";
import { ScheduleModule } from "./schedule/schedule.module";
import { SkillModule } from "./skill/skill.module";

@Module({
	imports: [
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: path.join(process.cwd(), "src/schema.gql"),
			resolvers: { Time: TimeScalar },
		}),
		PrismaModule,
		EmployeeModule,
		ScheduleModule,
		SkillModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
