-- CreateEnum
CREATE TYPE "QRStatus" AS ENUM ('PENDING', 'SCANNED', 'COMPLETED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'APPROVED', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateTable User
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "piUid" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "businessName" TEXT,
    "businessCategory" TEXT,
    "profileImage" TEXT,
    "description" TEXT,
    "website" TEXT,
    "isKycVerified" BOOLEAN NOT NULL DEFAULT false,
    "kycVerifiedAt" TIMESTAMP(3),
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "currency" TEXT NOT NULL DEFAULT 'Pi',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable QRCode
CREATE TABLE "QRCode" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" NUMERIC(18,7) NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "qrData" TEXT NOT NULL,
    "status" "QRStatus" NOT NULL DEFAULT 'PENDING',
    "scanCount" INTEGER NOT NULL DEFAULT 0,
    "completedPaymentId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QRCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable Payment
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "qrCodeId" TEXT,
    "piPaymentId" TEXT NOT NULL,
    "amount" NUMERIC(18,7) NOT NULL,
    "memo" VARCHAR(200) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "txid" TEXT,
    "buyerPiUid" TEXT,
    "buyerUsername" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable Analytics
CREATE TABLE "Analytics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "totalPayments" INTEGER NOT NULL DEFAULT 0,
    "totalAmount" NUMERIC(18,7) NOT NULL DEFAULT 0,
    "uniqueCustomers" INTEGER NOT NULL DEFAULT 0,
    "qrCodesGenerated" INTEGER NOT NULL DEFAULT 0,
    "qrCodesScanned" INTEGER NOT NULL DEFAULT 0,
    "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estimatedFee" NUMERIC(18,7) NOT NULL DEFAULT 0,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_piUid_key" ON "User"("piUid");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "QRCode_userId_idx" ON "QRCode"("userId");
CREATE INDEX "QRCode_status_idx" ON "QRCode"("status");
CREATE INDEX "QRCode_expiresAt_idx" ON "QRCode"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_piPaymentId_key" ON "Payment"("piPaymentId");
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");
CREATE INDEX "Payment_status_idx" ON "Payment"("status");
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Analytics_userId_date_key" ON "Analytics"("userId", "date");
CREATE INDEX "Analytics_userId_idx" ON "Analytics"("userId");
CREATE INDEX "Analytics_date_idx" ON "Analytics"("date");

-- AddForeignKey
ALTER TABLE "QRCode" ADD CONSTRAINT "QRCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_qrCodeId_fkey" FOREIGN KEY ("qrCodeId") REFERENCES "QRCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
