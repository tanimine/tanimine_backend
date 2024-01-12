-- CreateTable
CREATE TABLE "region" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "region_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "commodity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commodity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "refreshToken" TEXT,
    "hasVerified" BOOLEAN NOT NULL DEFAULT false,
    "roles" TEXT NOT NULL DEFAULT 'farmer',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "change_password_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "change_password_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_verification_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "user_verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farmers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nik" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "provinceId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "villageId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farmers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farmer_device" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "usersId" TEXT,

    CONSTRAINT "farmer_device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disease_plants" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symtomps" TEXT NOT NULL,
    "howTo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disease_plants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farmlands" (
    "id" TEXT NOT NULL,
    "farmersId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cropping_pattern" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "landArea" DOUBLE PRECISION NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "polygon" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farmlands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planting" (
    "id" TEXT NOT NULL,
    "farmlandsId" TEXT NOT NULL,
    "commodityId" INTEGER NOT NULL,
    "planting_type" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "planting_size" DOUBLE PRECISION NOT NULL,
    "production_per_harvest" DOUBLE PRECISION NOT NULL,
    "longitude" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disease_distribution" (
    "id" TEXT NOT NULL,
    "plantingId" TEXT NOT NULL,
    "commodityId" INTEGER NOT NULL,
    "diseaseid" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disease_distribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "change_password_tokens" ADD CONSTRAINT "change_password_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_verification_tokens" ADD CONSTRAINT "user_verification_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmers" ADD CONSTRAINT "farmers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmer_device" ADD CONSTRAINT "farmer_device_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmlands" ADD CONSTRAINT "farmlands_farmersId_fkey" FOREIGN KEY ("farmersId") REFERENCES "farmers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disease_distribution" ADD CONSTRAINT "disease_distribution_plantingId_fkey" FOREIGN KEY ("plantingId") REFERENCES "planting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disease_distribution" ADD CONSTRAINT "disease_distribution_commodityId_fkey" FOREIGN KEY ("commodityId") REFERENCES "commodity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disease_distribution" ADD CONSTRAINT "disease_distribution_diseaseid_fkey" FOREIGN KEY ("diseaseid") REFERENCES "disease_plants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
