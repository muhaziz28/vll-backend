-- CreateTable
CREATE TABLE "banner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "banner_title" TEXT,
    "image_file" TEXT NOT NULL,
    "image_size" INTEGER NOT NULL,
    "image_path" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
