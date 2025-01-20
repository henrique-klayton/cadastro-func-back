import IntIdArgs from "@graphql/args/int-id-args";
import { ArgsType, Field } from "@nestjs/graphql";
import { ScheduleUpdateDto } from "../dto/schedule-update.dto";

@ArgsType()
export default class UpdateScheduleArgs extends IntIdArgs {
	@Field()
	schedule: ScheduleUpdateDto;
}
