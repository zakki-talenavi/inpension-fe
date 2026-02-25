# Kesiapan Arsitektur untuk Aplikasi Besar

## Ringkasan

**Ya, fondasinya siap.** Arsitektur layer-based (auth + shared) plus konvensi yang ada sudah memadai untuk dipakai sebagai dasar aplikasi besar. Beberapa hal perlu dilengkapi atau diperketat seiring pertumbuhan tim dan fitur.

---

## Yang Sudah Siap

| Aspek | Status | Keterangan |
|--------|--------|------------|
| **Layer-based structure** | ✅ | `shared` only; auth di **app/** (login, store, middleware). Tambah layer per domain (access-control, builder-*, dll.). |
| **Batasan dependensi** | ✅ | Layer hanya depend ke `shared`; `#layers/` + ESLint (nuxt-layers) bantu enforce. |
| **Explicit imports** | ✅ | Imports eksplisit (Vue/Nuxt/composables); lebih aman untuk refactor & codebase besar. |
| **State management** | ✅ | Pinia di app (useAuthStore); pola yang sama bisa dipakai di layer lain. |
| **API layer** | ✅ | `app/services/api/` (client + interceptors, error handling, types). |
| **Type safety** | ✅ | TypeScript, `app/types/`, Zod di `app/schemas/` (user, dll.). |
| **Runtime config** | ✅ | `runtimeConfig.public.apiBaseUrl` untuk env. |
| **Testing** | ✅ | Vitest (unit/integration) + Playwright (e2e); script di `package.json`. |
| **Linting** | ✅ | ESLint + oxlint; aturan Vue/TS dan nuxt-layers. |
| **Dokumentasi arsitektur** | ✅ | ARCHITECTURE.md menjelaskan layer, dependency flow, pola store. |

---

## Yang Perlu Diperkuat untuk Skala Besar

### 1. Konvensi layer & dependency

- **Sekarang:** ARCHITECTURE.md mendeskripsikan aturan; ESLint nuxt-layers membantu.
- **Untuk skala besar:** Pastikan semua dev baca ARCHITECTURE.md; tambah aturan ESLint yang melarang import antar layer feature (hanya app → layer, layer → shared).
- **Opsional:** CI check yang memastikan tidak ada import dari `layer A` ke `layer B` (kecuali ke shared).

### 2. Error handling & feedback global

- **Sekarang:** API client punya error handling; toast untuk feedback.
- **Untuk skala besar:** Tambah error boundary global (Vue/Nuxt) dan kebijakan sentral: kapan log, kapan tampil ke user, kapan report ke monitoring. Konsisten untuk API, client, dan SSR.

### 3. Server / API routes

- **Sekarang:** Fokus di frontend; `apiBaseUrl` mengarah ke backend eksternal.
- **Untuk skala besar:** Jika Nuxt dipakai juga sebagai BFF/API, buat struktur `server/` yang jelas (by domain atau by resource) dan konvensi penamaan route + error response.

### 4. Schemas & kontrak shared

- **Sekarang:** Zod di auth; types di `app/types/`.
- **Untuk skala besar:** Untuk entitas yang dipakai banyak layer (user, tenant, dll.), pertimbangkan menaruh schema (Zod) dan types di `layers/shared` agar satu sumber kebenaran dan konsisten dengan ARCHITECTURE (shared = domain entities + utils).

### 5. Testing yang sejalan dengan layer

- **Sekarang:** Vitest + Playwright ada; beberapa e2e mungkin masih mengacu ke flow lama (mis. products/checkout).
- **Untuk skala besar:** Sesuaikan e2e dengan flow saat ini (auth + halaman utama). Unit/integration test per layer (stores, composables, utils) agar perubahan di satu layer tidak bikin aplikasi besar sulit di-maintain.

### 6. Lingkungan & keamanan

- **Sekarang:** `.env.example` dan `runtimeConfig`.
- **Untuk skala besar:** Pastikan rahasia tidak masuk ke client; env per environment (dev/staging/prod); dokumentasi deploy dan env vars.

### 7. Observability (opsional tapi disarankan untuk “besar”)

- **Sekarang:** Belum ada.
- **Untuk skala besar:** Logging terstruktur, error tracking (e.g. Sentry), dan metrik (performance, API) agar masalah cepat terdeteksi.

---

## Checklist Singkat Sebelum “Scale Up”

- [ ] Semua developer baca ARCHITECTURE.md dan ikut aturan dependency layer.
- [ ] ESLint (dan bila perlu CI) memastikan tidak ada pelanggaran batas layer.
- [ ] Error boundary global + kebijakan error handling terdokumentasi.
- [ ] Struktur `server/` (jika dipakai) dan konvensi API route jelas.
- [ ] Schema/types untuk entitas bersama ada di shared (atau di layer yang jelas).
- [ ] E2E dan test kritis mengcover flow utama (login, halaman inti).
- [ ] Env dan rahasia diatur per environment; dokumentasi deploy ada.

---

## Auth di app/ vs layer, dan access-control

Saran dari diskusi arsitektur: **authentication tidak dimasukkan sebagai layer**, melainkan di **app/**; layer dipakai untuk **shared**, **builder-core**, **builder-ui**, dan **access-control** (mesin RBAC/ABAC).

### Rekomendasi: setuju dengan pemisahan ini

| Letak | Peran | Isi |
|--------|--------|-----|
| **app/** | **Authentication** (siapa kamu) | Login page, auth store/session, token, interceptors, middleware “harus login”. Milik aplikasi, dipakai di mana-mana. |
| **layers/access-control/** | **Authorization** (apa yang boleh) | RBAC/ABAC: roles, permissions, policies, `can()`, `hasRole()`, guard di route/component. Bisa dipakai ulang oleh banyak fitur. |
| **layers/shared/** | Fondasi | UI dasar, utils, format, types/schemas bersama. |
| **layers/builder-core/** | Domain inti | Logika bisnis builder (jika ada). |
| **layers/builder-ui/** | UI builder | Komponen dan halaman builder. |

**Alasan auth di app/, bukan layer:**

1. **Authentication = identitas aplikasi** – Login, session, token adalah bagian dari “app ini” dan dipakai oleh hampir semua fitur. Bukan modul yang bisa dicabut atau diganti seperti feature layer.
2. **Dependency lebih jernih** – App memakai layers (shared, access-control, builder-*). App yang punya auth; layer tidak perlu depend ke “layer auth”. Kalau auth di layer, layer lain (mis. access-control) bisa tergoda depend ke auth layer → tambah coupling.
3. **Layers = fitur/domain yang optional atau reusable** – shared, builder-ui, access-control masuk akal sebagai modul. Auth lebih cocok sebagai bagian inti app.
4. **Pemisahan Authn vs Authz** – Auth (login, token) di app; authorization (role, permission, policy) di layer `access-control`. Satu layer fokus untuk “boleh/tidak boleh”, bisa di-test dan di-extend (RBAC/ABAC) tanpa menyentuh halaman login.

**Struktur target yang disarankan (untuk aplikasi besar):**

```
app/                        ← Authentication (login, session, token, middleware auth)
├── pages/
│   ├── index.vue
│   └── login.vue
├── stores/                 ← useAuthStore (atau auth/ di sini)
├── middleware/             ← auth, guest, login-layout
├── services/api/          ← client + interceptors (token, 401)
└── ...

layers/
├── shared/                 ← UI dasar, utils, types/schemas bersama
├── access-control/         ← RBAC/ABAC: can(), hasRole(), permissions, route guards
├── builder-core/           ← (opsional) logika bisnis builder
└── builder-ui/             ← (opsional) komponen & halaman builder
```

**Jika mau pakai pola ini dari sekarang:**

1. Pindahkan isi **layers/auth** ke **app/** (store auth, schema user, halaman login, komponen login jika dipakai).
2. Hapus **layers/auth** dari `extends` di `nuxt.config.ts` dan hapus folder `layers/auth`.
3. Buat layer **access-control** ketika butuh: composables/helpers `can()`, `hasRole()`, definisi roles/permissions, dan middleware atau guard yang memakai mereka. Layer ini boleh mengonsumsi **shared**; app dan layer lain memakai access-control untuk cek akses.

Dengan begitu, auth tetap jelas dan di satu tempat (app), sementara authorization punya rumah sendiri (access-control) dan siap untuk skala besar (banyak role, permission, policy).

---

## Kesimpulan

Arsitektur saat ini **cukup siap** untuk dipakai sebagai dasar aplikasi besar: layer, batas dependensi, API layer, state, types, dan testing sudah ada. Yang membuatnya **benar-benar siap** untuk skala besar adalah: konsisten mematuhi konvensi (terutama layer), melengkapi error handling & observability, dan menjaga kualitas dengan testing dan CI. ARCHITECTURE.md tetap jadi acuan utama; dokumen ini melengkapi dari sisi “readiness” dan langkah berikutnya.
