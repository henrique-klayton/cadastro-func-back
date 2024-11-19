import { Module, OnModuleInit } from "@nestjs/common";
import { registerEnumType } from "@nestjs/graphql";
import { ScheduleType } from "@prisma/client";
import { PrismaService } from "./prisma.service";

@Module({
	providers: [PrismaService],
	exports: [PrismaService],
})
export class PrismaModule implements OnModuleInit {
	onModuleInit() {
		registerEnumType(ScheduleType, { name: "ScheduleType" });
	}
}
