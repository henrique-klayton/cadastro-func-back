-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
