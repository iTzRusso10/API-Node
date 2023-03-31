-- CreateTable
CREATE TABLE "Planets" (
    "name" VARCHAR(255) NOT NULL,
    "moons" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Planets_pkey" PRIMARY KEY ("id")
);
