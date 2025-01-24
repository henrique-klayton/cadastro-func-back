import { registerEnumType } from "@nestjs/graphql";

enum ErrorCodes {
	ERROR = "ERROR",
	READ_ERROR = "READ_ERROR",
	CREATE_ERROR = "CREATE_ERROR",
	UPDATE_ERROR = "UPDATE_ERROR",
	DELETE_ERROR = "DELETE_ERROR",
	INACTIVE_REGISTER_RELATIONS = "INACTIVE_REGISTER_RELATIONS",
	HAS_ACTIVE_RELATIONS = "HAS_ACTIVE_RELATIONS",
	NOT_FOUND = "NOT_FOUND",
}
export default ErrorCodes;
registerEnumType(ErrorCodes, { name: "ErrorCodes" });
