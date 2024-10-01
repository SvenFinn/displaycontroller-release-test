-- CreateEnum
CREATE TYPE "CacheTypes" AS ENUM ('shooter', 'startList', 'discipline');

-- AlterTable
ALTER TABLE "Screens" ALTER COLUMN "condition" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Cache" (
    "type" "CacheTypes" NOT NULL,
    "key" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" JSONB NOT NULL,

    CONSTRAINT "Cache_pkey" PRIMARY KEY ("type","key")
);
