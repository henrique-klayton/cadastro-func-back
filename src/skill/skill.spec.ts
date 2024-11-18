import { Skill } from "./dto/skill.dto";

describe("Skill", () => {
	it("should be defined", () => {
		expect(new Skill()).toBeDefined();
	});
});
