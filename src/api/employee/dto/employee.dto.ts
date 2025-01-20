import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { ScheduleDto } from "src/api/schedule/dto/schedule.dto";
import Pagination from "src/pagination/pagination";

@ObjectType()
export class EmployeeDto {
	@Field(() => ID)
	id: string;

	@Field()
	firstName: string;

	@Field()
	lastName: string;

	@Field()
	birthDate: Date;

	@Field()
	status: boolean;

	@Field(() => Int, { nullable: true })
	scheduleId?: number | null;

	@Field(() => ScheduleDto, { nullable: true })
	schedule?: ScheduleDto | null;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}

@ObjectType()
export class PaginatedEmployeeDto extends Pagination(EmployeeDto) {}
