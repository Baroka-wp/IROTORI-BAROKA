<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# IROTORI BAROKA - Plateforme de Clarté Mentale

Une plateforme pour partager des réflexions, vidéos, e-books et notes sur le développement personnel, la philosophie et la spiritualité.

## 🚀 Architecture

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS 4
- **Animations**: Motion
- **Icons**: Lucide React

### Backend (Vercel Serverless)
- **API**: Vercel Functions (Node.js)
- **Database**: Neon PostgreSQL (Serverless)
- **ORM**: Prisma
- **Auth**: JWT

## 📁 Structure des contenus

Le site gère 4 types de contenus distincts :

### 1. Réflexions
Articles de blog / pensées sur :
- Spiritualité
- Entrepreneurial / MindSet
- Management
- Éducation

### 2. Vidéos
Webinaires et formations avec :
- Miniature
- Lien vidéo (YouTube/Drive)
- Playlist/catégorie
- Résumé détaillé

### 3. E-books (Library)
Livres numériques avec :
- Couverture
- Description
- Lien de téléchargement
- Prix (0 = gratuit)

### 4. Notes de lecture
Notes sur des livres avec :
- Titre du livre
- Auteur
- Contenu de la note

## 🛠️ Installation et Développement

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Neon (pour la DB PostgreSQL)

### 1. Installation

```bash
npm install
```

### 2. Configuration

Copier `.env.example` vers `.env` :

```bash
cp .env.example .env
```

Remplir les variables :
- `DATABASE_URL` : URL de votre base Neon PostgreSQL
- `GEMINI_API_KEY` : Clé API Gemini
- `JWT_SECRET` : Clé secrète pour l'authentification
- `ADMIN_EMAIL` et `ADMIN_PASSWORD` : Identifiants admin

### 3. Base de données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev --name init

# (Optionnel) Migrer depuis l'ancien schema
npx prisma db execute --file prisma/migrations/001_refactor_content.sql
```

### 4. Lancer en développement

```bash
npm run dev
```

Le serveur tourne sur `http://localhost:3000`

## 📡 API Endpoints

### Reflexions
- `GET /api/reflexions` - Liste (filtres: status, tags, page, limit)
- `GET /api/reflexions/[slug]` - Détail
- `POST /api/reflexions` - Créer (auth)
- `PUT /api/reflexions/[slug]` - Mettre à jour (auth)
- `DELETE /api/reflexions/[slug]` - Supprimer (auth)

### Videos
- `GET /api/videos` - Liste (filtres: status, playlist, page, limit)
- `GET /api/videos/[slug]` - Détail
- `POST /api/videos` - Créer (auth)
- `PUT /api/videos/[slug]` - Mettre à jour (auth)
- `DELETE /api/videos/[slug]` - Supprimer (auth)

### Ebooks
- `GET /api/ebooks` - Liste
- `GET /api/ebooks/[slug]` - Détail
- `POST /api/ebooks` - Créer (auth)
- `PUT /api/ebooks/[slug]` - Mettre à jour (auth)
- `DELETE /api/ebooks/[slug]` - Supprimer (auth)

### Notes
- `GET /api/notes` - Liste
- `GET /api/notes/[slug]` - Détail
- `POST /api/notes` - Créer (auth)
- `PUT /api/notes/[slug]` - Mettre à jour (auth)
- `DELETE /api/notes/[slug]` - Supprimer (auth)

## 🚀 Déploiement sur Vercel

### 1. Préparer la base de données

Créer une base Neon PostgreSQL :
1. Aller sur https://neon.tech
2. Créer un nouveau projet
3. Copier l'URL de connexion
4. Ajouter à `DATABASE_URL` dans Vercel

### 2. Déployer

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel deploy
```

### 3. Variables d'environnement Vercel

Ajouter dans le dashboard Vercel :
- `DATABASE_URL`
- `GEMINI_API_KEY`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

### 4. Post-deployment

```bash
# Générer Prisma pour la production
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy
```

## 📝 Scripts

```bash
npm run dev          # Développement local
npm run build        # Build de production
npm run preview      # Preview production
npm run lint         # Vérification TypeScript
npm run clean        # Nettoyer dist/
```

## 🔐 Authentification Admin

L'API admin utilise JWT :

1. Login : `POST /api/auth/login`
2. Logout : `POST /api/auth/logout`
3. Vérif : `GET /api/auth/me`

Les routes protégées nécessitent un token JWT valide dans les cookies.

## 📄 License

Propriétaire - Tous droits réservés

## 👤 Auteur

**Baroka Irotori**
- Site: https://irotoribaroka.com
- Philosophie : "Rendre les choses complexes simples et claires"
