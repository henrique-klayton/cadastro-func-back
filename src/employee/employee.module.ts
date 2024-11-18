import { Module } from "@nestjs/common";
import { EmployeeController } from "./employee.controller";
import { EmployeeService } from "./employee.service";
import { EmployeeResolver } from './employee.resolver';

@Module({
	controllers: [EmployeeController],
	providers: [EmployeeService, EmployeeResolver],
})
export class EmployeeModule {}
