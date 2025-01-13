-- CreateTable
CREATE TABLE "KnownRanges" (
    "ipAddress" INET NOT NULL,
    "rangeId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KnownRanges_pkey" PRIMARY KEY ("ipAddress")
);

-- CreateIndex
CREATE UNIQUE INDEX "KnownRanges_rangeId_key" ON "KnownRanges"("rangeId");
