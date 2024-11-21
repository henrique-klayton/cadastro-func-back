import { InputType, PartialType } from "@nestjs/graphql";
import { ScheduleCreateDto } from "./schedule-create.dto";

@InputType()
export class ScheduleUpdateDto extends PartialType(ScheduleCreateDto) {}
