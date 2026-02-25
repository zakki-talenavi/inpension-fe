# Struktur Arsitektur (Starter)

Struktur saat ini mengikuti [docs/READINESS.md](./READINESS.md): **auth di app**, **layer hanya shared** (dan nanti access-control, builder-*, dll.).

## Layout

```
app/                          # Aplikasi utama + authentication
├── assets/
├── components/
├── composables/
├── layouts/
│   ├── default.vue
│   └── auth.vue
├── middleware/
│   ├── auth.global.ts        # Global: redirect ke login jika tidak ada token
│   ├── auth.ts               # Named: protect route (definePageMeta)
│   ├── guest.ts
│   └── login-layout.global.ts
├── pages/
│   ├── index.vue
│   └── login.vue
├── schemas/
│   └── user.ts               # Zod: User, UserSchema
├── services/
│   └── api/
├── stores/
│   └── auth/
│       └── useAuthStore.ts
├── types/
└── utils/

layers/
└── shared/                   # Fondasi: UI, utils, types bersama
    └── app/
        ├── components/ui/
        ├── composables/
        ├── utils/
        └── types/
```

## Dependency

- **App** memakai **layers/shared** (komponen, composables, utils).
- **Shared** tidak bergantung ke app; tidak ada auth di shared.
- Auth (login, session, token, middleware) 100% di **app**.

## Menambah layer baru

Saat butuh authorization (RBAC/ABAC), buat `layers/access-control/`.  
Saat butuh fitur domain (mis. builder), tambah `layers/builder-core/` dan/atau `layers/builder-ui/`.

Lihat **docs/READINESS.md** untuk alur dan checklist.
