import { registerEnumType } from "@nestjs/graphql";

enum ErrorCodes {
	ERROR = "ERROR",
	READ_ERROR = "READ_ERROR",
	CREATE_ERROR = "CREATE_ERROR",
	UPDATE_ERROR = "UPDATE_ERROR",
	DELETE_ERROR = "DELETE_ERROR",
	INACTIVE_REGISTER = "INACTIVE_REGISTER",
	ACTIVE_RELATIONS = "ACTIVE_RELATIONS",
	NOT_FOUND = "NOT_FOUND",
}
export default ErrorCodes;
registerEnumType(ErrorCodes, { name: "ErrorCodes" });
