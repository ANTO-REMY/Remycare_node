-- CreateTable
CREATE TABLE "HealthCheckIn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "motherId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "symptoms" TEXT,
    "notes" TEXT,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HealthCheckIn_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Mother" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
