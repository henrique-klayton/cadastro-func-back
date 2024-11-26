import { GraphQLScalarType, Kind, ValueNode } from "graphql";

const stringParser = (value: string): Date => {
	const date = new Date(`1970-01-01T${value}`);
	if (Number.isNaN(date.getTime())) {
		throw new Error("Invalid Time");
	}
	return date;
};

export const TimeScalar = new GraphQLScalarType<Date, string>({
	name: "Time",
	description: "Format representating time with timezone in the format HH:mm:ss.sssZ",

	parseValue: (value: string) => {
		return stringParser(value);
	},

	serialize: (value: Date) => {
		return value.toISOString().slice(11);
	},

	parseLiteral: (ast: ValueNode) => {
		if (ast.kind === Kind.STRING) {
			return stringParser(ast.value);
		}

		throw new Error("Invalid Time");
	},
});
