-- CreateTable
CREATE TABLE "CaseEscalation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "motherId" TEXT NOT NULL,
    "chwId" TEXT NOT NULL,
    "nurseId" TEXT,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "issueType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "notes" TEXT,
    "resolution" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "resolvedAt" DATETIME
);
