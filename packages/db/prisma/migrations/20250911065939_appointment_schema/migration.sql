-- CreateEnum
CREATE TYPE "public"."Services" AS ENUM ('HAIRCUT', 'COLORING', 'STYLING', 'TREATMENT', 'EXTENSIONS', 'OTHER');

-- CreateTable
CREATE TABLE "public"."appointment" (
    "customerId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "service" VARCHAR(100) NOT NULL,

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("customerId")
);

-- AddForeignKey
ALTER TABLE "public"."appointment" ADD CONSTRAINT "appointment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
