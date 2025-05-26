# 🛡️ HolyNotes – Backend API

Ce dépôt contient l’API backend de l’application **HolyNotes**, un outil de prise de notes personnelles dédié à l’écoute et à l’étude des sermons.

L’API est conçue pour fonctionner avec le frontend [HolyNotes Frontend](https://github.com/ton-utilisateur/holynotes-frontend) (React). Elle fournit des routes sécurisées pour gérer les notes, la recherche, les contenus bibliques et l’intégration vidéo.

---

## ✨ Fonctionnalités actuelles

* 📝 **CRUD complet des notes**
* 🔍 **Recherche avec filtres simples**
* 📖 **Affichage des versets bibliques (via intégration externe)**
* ▶️ **Support des liens vidéos YouTube**

---

## 🚧 Fonctionnalités à venir

* 🔊 Upload des audios de sermons
* 🗂️ Regroupement des notes par séries de prédications

---

## 🛠️ Stack technique

* **Node.js** + **Express**
* **PostgreSQL** avec **Prisma ORM**
* **Zod** pour la validation de schémas
* **JWT** pour l’authentification (stocké en **cookie HTTPOnly**)

---

## 🔐 Authentification

L’authentification utilise des **JSON Web Tokens (JWT)** :

* Le token est **signé côté serveur** et stocké dans un **cookie sécurisé (HTTPOnly)**.
* Les routes protégées exigent un token valide.

---

## 📦 Installation

### Prérequis

* Node.js ≥ 18
* PostgreSQL ≥ 13
* pnpm (gestionnaire de paquets)

### Étapes

```bash
git clone https://github.com/ton-utilisateur/holynotes-backend.git
cd holynotes-backend
pnpm install
cp .env.example .env
pnpm prisma migrate dev
pnpm dev
```

---

## 📁 Structure du projet (extrait)

```
holynotes-backend/
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── middlewares/
│   ├── prisma/
│   └── utils/
├── prisma/
│   └── schema.prisma
├── .env
├── server.ts
└── ...
```

---

## 🔄 API REST

Les routes de l’API sont documentées (Swagger à venir ou fichier `docs/openapi.yaml` si disponible).

---

## 🤝 Contribuer

Les contributions sont bienvenues !
Merci de :

* Créer une issue avant une PR majeure
* Suivre les conventions de codage (linter, types)
* Ajouter des tests si possible

---

## 📄 Licence

MIT — libre d’usage et de modification.
