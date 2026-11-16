-- CreateEnum
CREATE TYPE "TopicCategory" AS ENUM (
  'cardiac',
  'respiratory',
  'neuro',
  'pharmacology',
  'maternity',
  'psychiatric',
  'fundamentals',
  'endocrine'
);

-- AlterTable
ALTER TABLE "Question" ADD COLUMN "category" "TopicCategory" NOT NULL DEFAULT 'fundamentals';

-- CreateIndex
CREATE INDEX "Question_category_difficulty_idx" ON "Question"("category", "difficulty");

-- CreateIndex
CREATE INDEX "Question_system_difficulty_idx" ON "Question"("system", "difficulty");
