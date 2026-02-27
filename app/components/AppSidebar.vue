<script setup lang="ts">
defineProps<{
  open: boolean
}>()

defineEmits<{
  toggle: []
}>()


interface MenuItem {
  label: string
  icon: string
  to?: string
  items?: MenuItem[]
}

const menuItems: MenuItem[] = [
  { label: 'Home', icon: 'pi pi-home', to: '/dashboard' },
  { label: 'Home Investpro', icon: 'pi pi-home', to: '/dashboard' },
  { label: 'Formulir Registrasi', icon: 'pi pi-id-card', to: '/dashboard' },
  {
    label: 'Persetujuan PPIP',
    icon: 'pi pi-verified',
    items: [
      { label: 'Dashboard', icon: 'pi pi-objects-column', to: '/dashboard' },
      { label: 'Perusahaan', icon: 'pi pi-building', to: '/dashboard' },
      { label: 'Individu', icon: 'pi pi-user', to: '/dashboard' },
      { label: 'Peserta Keluar', icon: 'pi pi-user-minus', to: '/dashboard' },
    ],
  },
  {
    label: 'Persetujuan DKP',
    icon: 'pi pi-verified',
    items: [
      { label: 'Dashboard', icon: 'pi pi-objects-column', to: '/dashboard' },
      { label: 'Perusahaan', icon: 'pi pi-building', to: '/dashboard' },
    ],
  },
  {
    label: 'Kepesertaan PPIP',
    icon: 'pi pi-users',
    items: [
      { label: 'Data Peserta', icon: 'pi pi-list', to: '/dashboard' },
    ],
  },
  {
    label: 'Kepesertaan DKP',
    icon: 'pi pi-th-large',
    items: [
      { label: 'Data Peserta', icon: 'pi pi-list', to: '/dashboard' },
    ],
  },
  {
    label: 'Perubahan Data',
    icon: 'pi pi-pencil',
    items: [
      { label: 'Daftar Perubahan', icon: 'pi pi-list', to: '/dashboard' },
    ],
  },
  {
    label: 'Iuran Peserta',
    icon: 'pi pi-wallet',
    items: [
      { label: 'Daftar Iuran', icon: 'pi pi-list', to: '/dashboard' },
    ],
  },
  {
    label: 'Entertainment Budget',
    icon: 'pi pi-credit-card',
    items: [
      { label: 'Daftar Budget', icon: 'pi pi-list', to: '/dashboard' },
    ],
  },
  { label: 'E Statement', icon: 'pi pi-file-edit', to: '/dashboard' },
  {
    label: 'Laporan',
    icon: 'pi pi-chart-bar',
    items: [
      { label: 'Daftar Laporan', icon: 'pi pi-list', to: '/dashboard' },
    ],
  },
  {
    label: 'Premi Asuransi',
    icon: 'pi pi-shield',
    items: [
      { label: 'Daftar Premi', icon: 'pi pi-list', to: '/dashboard' },
    ],
  },
  { label: 'APUPPT', icon: 'pi pi-file', to: '/dashboard' },
  {
    label: 'Klaim Pembayaran',
    icon: 'pi pi-money-bill',
    items: [
      { label: 'Dashboard', icon: 'pi pi-objects-column', to: '/dashboard' },
      {
        label: 'Manfaat Pensiun',
        icon: 'pi pi-verified',
        items: [
          { label: 'Verifikasi Manfaat', icon: 'pi pi-check-circle', to: '/dashboard' },
          { label: 'Jadwal Berkala', icon: 'pi pi-calendar', to: '/dashboard' },
          { label: 'Tagihan Manfaat', icon: 'pi pi-file-check', to: '/dashboard' },
          { label: 'Historis Pengajuan Manfaat', icon: 'pi pi-history', to: '/dashboard' },
          { label: 'Historis Pembayaran Manfaat', icon: 'pi pi-history', to: '/dashboard' },
        ],
      },
      { label: 'Pengalihan Dana', icon: 'pi pi-arrow-right-arrow-left', to: '/dashboard' },
      { label: 'Penarikan Dana', icon: 'pi pi-download', to: '/dashboard' },
      { label: 'Retur dan Realisasi Klaim', icon: 'pi pi-replay', to: '/dashboard' },
    ],
  },
  {
    label: 'Data Cycle',
    icon: 'pi pi-sync',
    items: [
      { label: 'Daftar Cycle', icon: 'pi pi-list', to: '/dashboard' },
    ],
  },
  {
    label: 'Arahan Investasi',
    icon: 'pi pi-chart-line',
    items: [
      { label: 'Daftar Arahan', icon: 'pi pi-list', to: '/dashboard' },
    ],
  },
  { label: 'Pengumuman', icon: 'pi pi-megaphone', to: '/dashboard' },
  { label: 'User DPLK', icon: 'pi pi-user', to: '/dashboard' },
  { label: 'Pengaturan', icon: 'pi pi-cog', to: '/dashboard' },
  { label: 'Audit Log', icon: 'pi pi-history', to: '/dashboard' },
]

const expandedMenus = ref<Set<string>>(new Set())
const activeItem = ref<string>('0') // default: Home

function toggleSubmenu(key: string) {
  // Close other menus at the same level
  const level = key.split('-').length
  const parentKey = key.split('-').slice(0, -1).join('-')
  const keysToRemove: string[] = []
  expandedMenus.value.forEach((k) => {
    const kLevel = k.split('-').length
    const kParent = k.split('-').slice(0, -1).join('-')
    // Close siblings at same level (same parent)
    if (kLevel === level && kParent === parentKey && k !== key) {
      keysToRemove.push(k)
    }
    // Close children of siblings
    if (k.startsWith(key + '-') === false && keysToRemove.some(r => k.startsWith(r))) {
      keysToRemove.push(k)
    }
  })
  keysToRemove.forEach(k => expandedMenus.value.delete(k))

  if (expandedMenus.value.has(key)) {
    // Close this and all children
    const toDelete = [...expandedMenus.value].filter(k => k === key || k.startsWith(key + '-'))
    toDelete.forEach(k => expandedMenus.value.delete(k))
  } else {
    expandedMenus.value.add(key)
  }
}

function isExpanded(key: string): boolean {
  return expandedMenus.value.has(key)
}

function selectItem(id: string) {
  activeItem.value = id
}

// Smooth height animation matching original project: 400ms cubic-bezier(0.86, 0, 0.07, 1)
function onSubmenuEnter(el: Element) {
  const htmlEl = el as HTMLElement
  htmlEl.style.overflow = 'hidden'
  htmlEl.style.height = '0'
  htmlEl.style.transition = 'none'
  // Force browser to paint height: 0 first
  void htmlEl.offsetHeight
  htmlEl.style.transition = 'height 0.4s cubic-bezier(0.86, 0, 0.07, 1)'
  htmlEl.style.height = htmlEl.scrollHeight + 'px'
}
function onSubmenuAfterEnter(el: Element) {
  const htmlEl = el as HTMLElement
  htmlEl.style.height = ''
  htmlEl.style.overflow = ''
  htmlEl.style.transition = ''
}
function onSubmenuLeave(el: Element, done: () => void) {
  const htmlEl = el as HTMLElement
  htmlEl.style.overflow = 'hidden'
  htmlEl.style.height = htmlEl.scrollHeight + 'px'
  htmlEl.style.transition = 'none'
  void htmlEl.offsetHeight
  htmlEl.style.transition = 'height 0.4s cubic-bezier(0.86, 0, 0.07, 1)'
  htmlEl.style.height = '0'
  setTimeout(done, 400)
}
</script>

<template>
  <aside
    class="sidebar"
    :class="open ? 'sidebar--open' : 'sidebar--closed'"
  >
    <!-- Logo -->
    <div class="sidebar__logo">
      <img
        src="https://inpension.oss-ap-southeast-5.aliyuncs.com/information/logo/DziV4m2DZ2hkduma0OvMqdeSC24In2Jk4Z7VuXzq.png?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=LTAI5t6sa6VxtwdLZ6qs88XY%2F20260227%2Foss-ap-southeast-5%2Fs3%2Faws4_request&X-Amz-Date=20260227T062041Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1799&X-Amz-Signature=6da530cb948aca70f3be5a0a3421ccceb48c3da1d9b9a9dc54f756bccf3557d1"
        alt="InPension"
      >
    </div>

    <!-- Menu -->
    <nav class="sidebar__nav">
      <ul class="menu">
        <li
          v-for="(item, idx) in menuItems"
          :key="idx"
          class="menu__item"
        >
          <!-- Simple link (no children) -->
          <NuxtLink
            v-if="item.to && !item.items"
            :to="item.to"
            class="menu__link"
            :class="{ 'menu__link--active': activeItem === String(idx) }"
            @click="selectItem(String(idx))"
          >
            <i :class="[item.icon, 'menu__icon']" />
            <span v-if="open" class="menu__label">{{ item.label }}</span>
          </NuxtLink>

          <!-- Parent with submenu -->
          <template v-else-if="item.items">
            <button
              class="menu__link menu__link--parent"
              :class="{ 'menu__link--expanded': isExpanded(String(idx)) }"
              @click="toggleSubmenu(String(idx))"
            >
              <i :class="[item.icon, 'menu__icon']" />
              <span v-if="open" class="menu__label">{{ item.label }}</span>
              <i
                v-if="open"
                class="pi menu__chevron"
                :class="isExpanded(String(idx)) ? 'pi-angle-up' : 'pi-angle-down'"
              />
            </button>

            <!-- Submenu Level 2 -->
            <Transition
              :css="false"
              @enter="onSubmenuEnter"
              @after-enter="onSubmenuAfterEnter"
              @leave="onSubmenuLeave"
            >
              <ul v-if="isExpanded(String(idx)) && open" class="submenu">
                <li v-for="(child, cidx) in item.items" :key="cidx">
                  <!-- Leaf child -->
                  <NuxtLink
                    v-if="child.to && !child.items"
                    :to="child.to"
                    class="submenu__link"
                    :class="{ 'submenu__link--active': activeItem === `${idx}-${cidx}` }"
                    @click="selectItem(`${idx}-${cidx}`)"
                  >
                    <i :class="[child.icon, 'submenu__icon']" />
                    <span class="submenu__label">{{ child.label }}</span>
                  </NuxtLink>

                  <!-- Nested parent (Level 3) -->
                  <template v-else-if="child.items">
                    <button
                      class="submenu__link submenu__link--parent"
                      :class="{ 'submenu__link--expanded': isExpanded(`${idx}-${cidx}`) }"
                      @click="toggleSubmenu(`${idx}-${cidx}`)"
                    >
                      <i :class="[child.icon, 'submenu__icon']" />
                      <span class="submenu__label">{{ child.label }}</span>
                      <i
                        class="pi menu__chevron"
                        :class="isExpanded(`${idx}-${cidx}`) ? 'pi-angle-up' : 'pi-angle-down'"
                      />
                    </button>

                    <!-- Submenu Level 3 -->
                    <Transition
                      :css="false"
                      @enter="onSubmenuEnter"
                      @after-enter="onSubmenuAfterEnter"
                      @leave="onSubmenuLeave"
                    >
                      <ul v-if="isExpanded(`${idx}-${cidx}`)" class="submenu submenu--nested">
                        <li v-for="(grandchild, gcidx) in child.items" :key="gcidx">
                          <NuxtLink
                            :to="grandchild.to || '/dashboard'"
                            class="submenu__link submenu__link--deep"
                            :class="{ 'submenu__link--active': activeItem === `${idx}-${cidx}-${gcidx}` }"
                            @click="selectItem(`${idx}-${cidx}-${gcidx}`)"
                          >
                            <i :class="[grandchild.icon, 'submenu__icon']" />
                            <span class="submenu__label">{{ grandchild.label }}</span>
                          </NuxtLink>
                        </li>
                      </ul>
                    </Transition>
                  </template>
                </li>
              </ul>
            </Transition>
          </template>
        </li>
      </ul>
    </nav>

    <!-- Footer -->
    <div v-if="open" class="sidebar__footer">
      © 2026 Opsitech
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  background: #52629d;
  color: white;
  transition: all 0.3s ease;
  flex-shrink: 0;
  overflow: hidden;
}
.sidebar--open {
  width: 280px;
}
.sidebar--closed {
  width: 0;
  margin-left: -280px;
}
@media (min-width: 1024px) {
  .sidebar--closed {
    width: 60px;
    margin-left: 0;
  }
}

/* Logo */
.sidebar__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  padding: 0 16px;
  background: white;
  flex-shrink: 0;
}
.sidebar__logo img {
  height: 32px;
  width: auto;
  object-fit: contain;
}

/* Nav */
.sidebar__nav {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}
.sidebar__nav::-webkit-scrollbar {
  width: 4px;
}
.sidebar__nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

/* Menu list */
.menu {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* Menu link (both simple and parent) */
.menu__link {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: white;
  font-size: 0.82rem;
  font-weight: 400;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease;
  line-height: 1.3;
}
.menu__link:hover {
  background: rgba(0, 0, 0, 0.15);
  color: white;
}
.menu__link--active {
  background: white;
  color: #52629d;
  font-weight: 500;
}
.menu__link--active .menu__icon {
  opacity: 1;
  color: #52629d;
}
.menu__link--active:hover {
  background: white;
  color: #52629d;
}
.menu__link--expanded {
  color: white;
}

.menu__icon {
  font-size: 0.95rem;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.menu__label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}
.menu__chevron {
  font-size: 0.7rem;
  opacity: 0.5;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

/* Submenu */
.submenu {
  list-style: none;
  margin: 2px 0 0 0;
  padding: 0 0 0 8px;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.submenu__link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px 8px 24px;
  border-radius: 6px;
  color: white;
  font-size: 0.78rem;
  text-decoration: none;
  transition: all 0.15s ease;
}
.submenu__link:hover {
  background: rgba(0, 0, 0, 0.15);
  color: white;
}
.submenu__link--active {
  background: white;
  color: #52629d;
  font-weight: 500;
}
.submenu__link--active .submenu__icon {
  opacity: 1;
  color: #52629d;
}
.submenu__link--active:hover {
  background: white;
  color: #52629d;
}
.submenu__icon {
  font-size: 0.8rem;
  width: 18px;
  text-align: center;
  flex-shrink: 0;
}
.submenu__label {
  word-break: break-word;
}

/* Nested submenu parent button */
.submenu__link--parent {
  width: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
}
.submenu__link--expanded {
  color: white;
}

/* Level 3 nested submenu */
.submenu--nested {
  padding-left: 12px;
}
.submenu__link--deep {
  padding-left: 36px;
}

/* Footer */
.sidebar__footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 12px;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
  flex-shrink: 0;
}
</style>
