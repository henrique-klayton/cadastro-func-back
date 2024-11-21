import { InputType, PartialType } from "@nestjs/graphql";
import { EmployeeCreateDto } from "./employee-create.dto";

@InputType()
export class EmployeeUpdateDto extends PartialType(EmployeeCreateDto) {}
