import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const labTests = pgTable("lab_tests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: text("patient_id").notNull(),
  patientName: text("patient_name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  testType: text("test_type").notNull(),
  purpose: text("purpose").notNull(),
  sampleReceivedTime: text("sample_received_time").notNull(),
  sampleTestedTime: text("sample_tested_time").notNull(),
  testData: text("test_data").notNull(),
});

export const insertLabTestSchema = createInsertSchema(labTests).omit({
  id: true,
});

export type InsertLabTest = z.infer<typeof insertLabTestSchema>;
export type LabTest = typeof labTests.$inferSelect;
