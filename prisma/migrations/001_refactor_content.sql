-- Migration SQL pour passer de l'ancien schema au nouveau
-- Exécuter avec : npx prisma db execute --file migrations/001_refactor_content.sql

-- 1. Créer les nouvelles tables
CREATE TABLE IF NOT EXISTS "Reflexion" (
    id TEXT PRIMARY KEY DEFAULT cuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    tags TEXT,
    status TEXT DEFAULT 'draft',
    publishedAt TIMESTAMP(3),
    createdAt TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Video" (
    id TEXT PRIMARY KEY DEFAULT cuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    thumbnail TEXT,
    videoUrl TEXT,
    playlist TEXT,
    tags TEXT,
    resume TEXT,
    status TEXT DEFAULT 'draft',
    publishedAt TIMESTAMP(3),
    createdAt TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Ebook" (
    id TEXT PRIMARY KEY DEFAULT cuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subtitle TEXT,
    description TEXT,
    coverImage TEXT,
    downloadUrl TEXT,
    price INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft',
    publishedAt TIMESTAMP(3),
    createdAt TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Note" (
    id TEXT PRIMARY KEY DEFAULT cuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    bookTitle TEXT,
    author TEXT,
    status TEXT DEFAULT 'draft',
    publishedAt TIMESTAMP(3),
    createdAt TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- 2. Créer les index pour la performance
CREATE INDEX IF NOT EXISTS "Reflexion_slug_idx" ON "Reflexion"("slug");
CREATE INDEX IF NOT EXISTS "Reflexion_status_idx" ON "Reflexion"("status");
CREATE INDEX IF NOT EXISTS "Reflexion_tags_idx" ON "Reflexion"("tags");

CREATE INDEX IF NOT EXISTS "Video_slug_idx" ON "Video"("slug");
CREATE INDEX IF NOT EXISTS "Video_status_idx" ON "Video"("status");
CREATE INDEX IF NOT EXISTS "Video_playlist_idx" ON "Video"("playlist");

CREATE INDEX IF NOT EXISTS "Ebook_slug_idx" ON "Ebook"("slug");
CREATE INDEX IF NOT EXISTS "Ebook_status_idx" ON "Ebook"("status");
CREATE INDEX IF NOT EXISTS "Ebook_price_idx" ON "Ebook"("price");

CREATE INDEX IF NOT EXISTS "Note_slug_idx" ON "Note"("slug");
CREATE INDEX IF NOT EXISTS "Note_status_idx" ON "Note"("status");

-- 3. Migrer les données depuis l'ancienne table Post (si elle existe)
-- Réflexions (type = 'model')
INSERT INTO "Reflexion" (id, title, slug, content, tags, status, publishedAt, createdAt, updatedAt)
SELECT id, title, slug, content, tags, status, 
       CASE WHEN status = 'published' THEN createdAt ELSE NULL END as publishedAt,
       createdAt, updatedAt
FROM "Post"
WHERE type = 'model'
ON CONFLICT (id) DO NOTHING;

-- Vidéos (type = 'video')
INSERT INTO "Video" (id, title, slug, description, thumbnail, videoUrl, playlist, tags, resume, status, publishedAt, createdAt, updatedAt)
SELECT id, title, slug, description, coverImage as thumbnail, videoUrl, playlist, tags, content as resume, status,
       CASE WHEN status = 'published' THEN createdAt ELSE NULL END as publishedAt,
       createdAt, updatedAt
FROM "Post"
WHERE type = 'video'
ON CONFLICT (id) DO NOTHING;

-- Ebooks (type = 'ebook')
INSERT INTO "Ebook" (id, title, slug, subtitle, description, coverImage, downloadUrl, price, status, publishedAt, createdAt, updatedAt)
SELECT id, title, slug, '' as subtitle, description, coverImage, downloadUrl, 0 as price, status,
       CASE WHEN status = 'published' THEN createdAt ELSE NULL END as publishedAt,
       createdAt, updatedAt
FROM "Post"
WHERE type = 'ebook'
ON CONFLICT (id) DO NOTHING;

-- Notes (type = 'note')
INSERT INTO "Note" (id, title, slug, content, bookTitle, author, status, publishedAt, createdAt, updatedAt)
SELECT id, title, slug, content, '' as bookTitle, '' as author, status,
       CASE WHEN status = 'published' THEN createdAt ELSE NULL END as publishedAt,
       createdAt, updatedAt
FROM "Post"
WHERE type = 'note'
ON CONFLICT (id) DO NOTHING;

-- 4. Optionnel: Supprimer l'ancienne table Post après vérification
-- DROP TABLE IF EXISTS "Post";
