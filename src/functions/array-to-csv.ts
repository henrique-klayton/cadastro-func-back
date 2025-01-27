export default function arrayToCsv<T>(
	fields: Array<keyof T>,
	data: Array<T>,
	separator: string,
): string {
	const fieldsLine = fields.join(separator);
	const dataLines = data
		.map((item) => {
			return fields
				.map((key) => {
					const val = item[key];
					if (val == null) return "";
					return val;
				})
				.join(separator);
		})
		.join("\n");
	return `${fieldsLine}\n${dataLines}`;
}
