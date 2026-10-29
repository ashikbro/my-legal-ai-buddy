-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Version" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "analysis" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Version_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Version_documentId_idx" ON "Version"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Version_documentId_version_key" ON "Version"("documentId", "version");
