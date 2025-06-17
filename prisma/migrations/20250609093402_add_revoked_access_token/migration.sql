-- CreateTable
CREATE TABLE "RevokedAccessToken" (
    "id" TEXT NOT NULL,
    "jti" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "revokedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RevokedAccessToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RevokedAccessToken_jti_key" ON "RevokedAccessToken"("jti");
