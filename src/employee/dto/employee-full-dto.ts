import { ObjectType, Field } from "@nestjs/graphql";
import { ScheduleDto } from "src/schedule/dto/schedule.dto";
import { SkillDto } from "src/skill/dto/skill.dto";
import { EmployeeDto } from "./employee.dto";


@ObjectType()
export class EmployeeFullDto extends EmployeeDto {
	@Field(() => ScheduleDto)
	schedule: ScheduleDto;

	@Field(() => [SkillDto])
	skills: SkillDto[];
}
