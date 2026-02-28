# Backend API Documentation

## Architecture

Le backend est conçu pour Vercel Serverless Functions avec une architecture RESTful.

## Models de données

### 1. Reflexion (Articles de blog / Pensées)
```typescript
{
  id: string
  title: string
  slug: string
  content: string
  tags?: string // "spiritualite,entrepreneurial,management,education"
  status: "draft" | "published"
  publishedAt?: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}
```

### 2. Video (Webinaires, Formations)
```typescript
{
  id: string
  title: string
  slug: string
  description?: string
  thumbnail?: string // URL de la miniature
  videoUrl?: string // Lien YouTube/Drive
  playlist?: string // Catégorie
  tags?: string
  resume?: string // Résumé détaillé
  status: "draft" | "published"
  publishedAt?: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}
```

### 3. Ebook (Library)
```typescript
{
  id: string
  title: string
  slug: string
  subtitle?: string
  description?: string
  coverImage?: string
  downloadUrl?: string
  price: number // en centimes (0 = gratuit)
  status: "draft" | "published"
  publishedAt?: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}
```

### 4. Note (Notes de lecture)
```typescript
{
  id: string
  title: string
  slug: string
  content: string
  bookTitle?: string
  author?: string
  status: "draft" | "published"
  publishedAt?: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}
```

## Endpoints API

### Reflexions
- `GET /api/reflexions` - Liste toutes les réflexions
  - Query params: `status`, `tags`, `page`, `limit`
- `GET /api/reflexions/[slug]` - Récupère une réflexion
- `POST /api/reflexions` - Crée une réflexion (auth requis)
- `PUT /api/reflexions/[slug]` - Met à jour une réflexion (auth requis)
- `DELETE /api/reflexions/[slug]` - Supprime une réflexion (auth requis)

### Videos
- `GET /api/videos` - Liste toutes les vidéos
  - Query params: `status`, `playlist`, `page`, `limit`
- `GET /api/videos/[slug]` - Récupère une vidéo
- `POST /api/videos` - Crée une vidéo (auth requis)
- `PUT /api/videos/[slug]` - Met à jour une vidéo (auth requis)
- `DELETE /api/videos/[slug]` - Supprime une vidéo (auth requis)

### Ebooks
- `GET /api/ebooks` - Liste tous les ebooks
  - Query params: `status`, `page`, `limit`
- `GET /api/ebooks/[slug]` - Récupère un ebook
- `POST /api/ebooks` - Crée un ebook (auth requis)
- `PUT /api/ebooks/[slug]` - Met à jour un ebook (auth requis)
- `DELETE /api/ebooks/[slug]` - Supprime un ebook (auth requis)

### Notes
- `GET /api/notes` - Liste toutes les notes
  - Query params: `status`, `page`, `limit`
- `GET /api/notes/[slug]` - Récupère une note
- `POST /api/notes` - Crée une note (auth requis)
- `PUT /api/notes/[slug]` - Met à jour une note (auth requis)
- `DELETE /api/notes/[slug]` - Supprime une note (auth requis)

## Migration de l'ancien schema

Pour migrer les données depuis l'ancien model `Post` vers les nouveaux models :

```bash
# 1. Sauvegarder les données existantes
npx prisma db pull

# 2. Appliquer le nouveau schema
npx prisma migrate dev --name refactor_content_models

# 3. Générer le client Prisma
npx prisma generate
```

## Variables d'environnement

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="password123"
```

## Déploiement sur Vercel

1. Installer les dépendances : `npm install`
2. Générer Prisma : `npx prisma generate`
3. Déployer : `vercel deploy`

Le backend utilisera Neon Database (PostgreSQL serverless) pour une compatibilité optimale avec Vercel.
