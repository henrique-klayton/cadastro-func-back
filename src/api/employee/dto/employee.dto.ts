import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { ScheduleDto } from "src/api/schedule/dto/schedule.dto";
import Pagination from "src/pagination/pagination";

@ObjectType()
export class EmployeeDto {
	@Field(() => ID)
	id: string;

	@Field(() => String)
	firstName: string;

	@Field(() => String)
	lastName: string;

	@Field(() => Date)
	birthDate: Date;

	@Field(() => Boolean)
	status: boolean;

	@Field(() => Int, { nullable: true })
	scheduleId?: number | null;

	@Field(() => ScheduleDto, { nullable: true })
	schedule?: ScheduleDto | null;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}

@ObjectType()
export class PaginatedEmployeeDto extends Pagination(EmployeeDto) {}
