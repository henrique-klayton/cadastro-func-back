import { Field, ObjectType } from "@nestjs/graphql";
import { ScheduleDto } from "src/api/schedule/dto/schedule.dto";
import { SkillDto } from "src/api/skill/dto/skill.dto";
import { EmployeeDto } from "./employee.dto";

@ObjectType()
export class EmployeeFullDto extends EmployeeDto {
	@Field(() => ScheduleDto)
	schedule: ScheduleDto;

	@Field(() => [SkillDto])
	skills: SkillDto[];
}
