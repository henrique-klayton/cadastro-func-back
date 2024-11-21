/*
  Warnings:

  - You are about to drop the `_EmployeeToSkill` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EmployeeToSkill" DROP CONSTRAINT "_EmployeeToSkill_A_fkey";

-- DropForeignKey
ALTER TABLE "_EmployeeToSkill" DROP CONSTRAINT "_EmployeeToSkill_B_fkey";

-- DropTable
DROP TABLE "_EmployeeToSkill";

-- CreateTable
CREATE TABLE "EmployeeSkills" (
    "employeeId" TEXT NOT NULL,
    "skillId" INTEGER NOT NULL,

    CONSTRAINT "EmployeeSkills_pkey" PRIMARY KEY ("employeeId","skillId")
);

-- AddForeignKey
ALTER TABLE "EmployeeSkills" ADD CONSTRAINT "EmployeeSkills_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeSkills" ADD CONSTRAINT "EmployeeSkills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
