/*
  Warnings:

  - You are about to drop the `_EmployeeToSkill` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `employeeId` to the `Skill` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "_EmployeeToSkill" DROP CONSTRAINT "_EmployeeToSkill_A_fkey";

-- DropForeignKey
ALTER TABLE "_EmployeeToSkill" DROP CONSTRAINT "_EmployeeToSkill_B_fkey";

-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "employeeId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_EmployeeToSkill";

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
