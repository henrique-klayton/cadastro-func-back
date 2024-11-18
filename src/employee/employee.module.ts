import { Module } from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { EmployeeResolver } from "./employee.resolver";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
	imports: [PrismaModule],
	providers: [EmployeeService, EmployeeResolver],
})
export class EmployeeModule {}
