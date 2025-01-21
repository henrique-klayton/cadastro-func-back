import path from "node:path";

import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";

import ErrorCodes from "@enums/error-codes";
import { EmployeeModule } from "./api/employee/employee.module";
import { ScheduleModule } from "./api/schedule/schedule.module";
import { SkillModule } from "./api/skill/skill.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TimeScalar } from "./graphql/scalars/time.scalar";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
	imports: [
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: path.join(process.cwd(), "src/schema.gql"),
			resolvers: { Time: TimeScalar },
			buildSchemaOptions: {
				orphanedTypes: [ErrorCodes],
			},
			status400ForVariableCoercionErrors: true,
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
