import { GraphQLScalarType, Kind, ValueNode } from "graphql";

const stringParser = (value: string): Date => {
	return new Date(`1970-01-01T${value}`);
};

export const TimeScalar = new GraphQLScalarType<Date | undefined, string>({
	name: "Time",
	description: "Format representating time with timezone",

	parseValue: (value: string) => {
		return stringParser(`1970-01-01T${value}`);
	},

	serialize: (value: Date) => {
		return value.toISOString().slice(11);
	},

	parseLiteral: (ast: ValueNode) => {
		if (ast.kind === Kind.STRING) {
			return stringParser(ast.value);
		}

		return undefined;
	},
});
