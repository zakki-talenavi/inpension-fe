<script setup lang="ts">
defineProps<{
  open: boolean
}>()

defineEmits<{
  toggle: []
}>()


import { useMenuStore, type MenuItem } from '~/stores/menu/useMenuStore'
import { VueDraggable } from 'vue-draggable-plus'

const menuStore = useMenuStore()

onMounted(() => {
  menuStore.initialize()
})

const isEditMode = ref(false)

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

// Manage Modals
const showDialog = ref(false)
const isEdit = ref(false)
const formData = ref({
  key: '',
  label: '',
  icon: 'pi pi-folder',
  to: ''
})

const openAddModal = (parentKey?: string) => {
  isEdit.value = false
  formData.value = {
    key: parentKey || '', // If adding to root, parentKey is empty
    label: '',
    icon: 'pi pi-folder',
    to: ''
  }
  showDialog.value = true
}

const openEditModal = (node: any) => {
  isEdit.value = true
  formData.value = {
    key: node.key,
    label: node.label,
    icon: node.icon,
    to: node.to || ''
  }
  showDialog.value = true
}

const saveMenu = () => {
  if (isEdit.value) {
    menuStore.updateMenuItem(formData.value.key, {
      label: formData.value.label,
      icon: formData.value.icon,
      to: formData.value.to || undefined,
    })
  } else {
    menuStore.addMenuItem({
      label: formData.value.label,
      icon: formData.value.icon,
      to: formData.value.to || undefined,
    }, formData.value.key || undefined)
  }
  showDialog.value = false
}

const confirmDelete = (key: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
    menuStore.deleteMenuItem(key)
  }
}
</script>

<template>
  <aside
    class="sidebar"
    :class="open ? 'sidebar--open' : 'sidebar--closed'"
  >
    <!-- Logo & Edit Toggle -->
    <div class="sidebar__header w-full flex items-center justify-between h-[56px] px-4 bg-white shrink-0">
      <div class="sidebar__logo flex items-center justify-center">
        <img
          src="https://inpension.oss-ap-southeast-5.aliyuncs.com/information/logo/DziV4m2DZ2hkduma0OvMqdeSC24In2Jk4Z7VuXzq.png?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=LTAI5t6sa6VxtwdLZ6qs88XY%2F20260227%2Foss-ap-southeast-5%2Fs3%2Faws4_request&X-Amz-Date=20260227T062041Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1799&X-Amz-Signature=6da530cb948aca70f3be5a0a3421ccceb48c3da1d9b9a9dc54f756bccf3557d1"
          alt="InPension"
          class="h-8 w-auto object-contain"
        >
      </div>
      <button 
        v-if="open"
        @click="isEditMode = !isEditMode"
        class="text-xs px-2 py-1 rounded border transition-colors outline-none"
        :class="isEditMode ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'"
        :title="isEditMode ? 'Nonaktifkan Mode Edit' : 'Aktifkan Mode Edit Menu'"
      >
        <i class="pi" :class="isEditMode ? 'pi-check' : 'pi-pencil'"></i>
      </button>
    </div>

    <!-- Menu -->
    <nav class="sidebar__nav">
      <!-- Root level Drag & Drop -->
      <VueDraggable 
        v-model="menuStore.menuItems"
        tag="ul"
        class="menu"
        group="root-menu"
        handle=".drag-handle"
        :animation="200"
      >
        <li 
          v-for="(item, idx) in menuStore.menuItems" 
          :key="item.key || idx" 
          class="menu__item"
        >
            <!-- Simple link (no children) -->
            <div v-if="item.to && !item.items" class="menu__item-wrapper group relative">
            <NuxtLink
              :to="item.to"
              class="menu__link"
              :class="{ 'menu__link--active': activeItem === String(idx) }"
              @click="selectItem(String(idx))"
            >
              <i :class="[item.icon, 'menu__icon']" />
              <span v-if="open" class="menu__label">{{ item.label }}</span>
            </NuxtLink>
            <button
              v-if="open && isEditMode"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              title="Edit Menu"
              @click.stop="openEditModal(item)"
            >
              <i class="pi pi-cog text-xs"></i>
            </button>
            <button
              v-if="open && isEditMode"
              class="absolute right-8 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-red-500/20 text-red-300 hover:text-red-200 cursor-pointer"
              title="Hapus Menu"
              @click.stop="confirmDelete(item.key!)"
            >
              <i class="pi pi-trash text-xs"></i>
            </button>
            <div
              v-if="open && isEditMode"
              class="drag-handle absolute right-14 top-1/2 -translate-y-1/2 p-1.5 text-white/50 hover:text-white cursor-grab active:cursor-grabbing"
              title="Geser Menu"
            >
              <i class="pi pi-bars text-xs"></i>
            </div>
          </div>

          <!-- Parent with submenu -->
          <div v-else-if="item.items" class="menu__item-wrapper group relative">
            <button
              class="menu__link menu__link--parent"
              :class="{ 'menu__link--expanded': isExpanded(String(idx)) }"
              @click="toggleSubmenu(String(idx))"
            >
              <i :class="[item.icon, 'menu__icon']" />
              <span v-if="open" class="menu__label">{{ item.label }}</span>
              <i
                v-if="open"
                class="pi menu__chevron mr-6"
                :class="isExpanded(String(idx)) ? 'pi-angle-up' : 'pi-angle-down'"
              />
            </button>
            <button
              v-if="open && isEditMode"
              class="absolute right-2 top-[10px] p-1.5 rounded bg-white/10 hover:bg-white/20 text-white z-10 cursor-pointer"
              title="Edit Menu"
              @click.stop="openEditModal(item)"
            >
              <i class="pi pi-cog text-xs"></i>
            </button>
            <button
              v-if="open && isEditMode"
              class="absolute right-8 top-[10px] p-1.5 rounded hover:bg-red-500/20 text-red-300 hover:text-red-200 z-10 cursor-pointer"
              title="Hapus Menu"
              @click.stop="confirmDelete(item.key!)"
            >
              <i class="pi pi-trash text-xs"></i>
            </button>
            <div
              v-if="open && isEditMode"
              class="drag-handle absolute right-14 top-[10px] p-1.5 text-white/50 hover:text-white cursor-grab active:cursor-grabbing z-10"
              title="Geser Menu"
            >
              <i class="pi pi-bars text-xs"></i>
            </div>

            <!-- Submenu Level 2 -->
            <Transition
              :css="false"
              @enter="onSubmenuEnter"
              @after-enter="onSubmenuAfterEnter"
              @leave="onSubmenuLeave"
            >
              <div v-if="isExpanded(String(idx)) && open" class="submenu-container">
                <VueDraggable 
                  v-model="item.items"
                  tag="ul"
                  class="submenu"
                  group="submenu-level-2"
                  handle=".drag-handle"
                  :animation="200"
                >
                  <li v-for="(child, cidx) in item.items" :key="child.key || cidx">
                      <!-- Leaf child -->
                      <div v-if="child.to && !child.items" class="group relative">
                    <NuxtLink
                      :to="child.to"
                      class="submenu__link"
                      :class="{ 'submenu__link--active': activeItem === `${idx}-${cidx}` }"
                      @click="selectItem(`${idx}-${cidx}`)"
                    >
                      <i :class="[child.icon, 'submenu__icon']" />
                      <span class="submenu__label">{{ child.label }}</span>
                    </NuxtLink>
                    <!-- Quick Edit Action -->
                    <button
                      v-if="isEditMode"
                      class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                      title="Edit Submenu"
                      @click.stop="openEditModal(child)"
                    >
                      <i class="pi pi-cog text-[10px]"></i>
                    </button>
                    <!-- Quick Delete Action -->
                     <button
                      v-if="isEditMode"
                      class="absolute right-8 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-red-500/20 text-red-300 hover:text-red-200 cursor-pointer"
                      title="Hapus Menu"
                      @click.stop="confirmDelete(child.key!)"
                    >
                      <i class="pi pi-trash text-[10px]"></i>
                    </button>
                  </div>

                  <!-- Nested parent (Level 3) -->
                  <div v-else-if="child.items" class="group relative">
                    <button
                      class="submenu__link submenu__link--parent pr-8"
                      :class="{ 'submenu__link--expanded': isExpanded(`${idx}-${cidx}`) }"
                      @click="toggleSubmenu(`${idx}-${cidx}`)"
                    >
                      <i :class="[child.icon, 'submenu__icon']" />
                      <span class="submenu__label">{{ child.label }}</span>
                      <i
                        class="pi menu__chevron mr-6"
                        :class="isExpanded(`${idx}-${cidx}`) ? 'pi-angle-up' : 'pi-angle-down'"
                      />
                    </button>
                    <!-- Quick Edit Action -->
                    <button
                      v-if="isEditMode"
                      class="absolute right-2 top-[6px] p-1 rounded bg-white/10 hover:bg-white/20 text-white z-10 cursor-pointer"
                      title="Edit Kategori"
                      @click.stop="openEditModal(child)"
                    >
                      <i class="pi pi-cog text-[10px]"></i>
                    </button>
                     <button
                      v-if="isEditMode"
                      class="absolute right-8 top-[6px] p-1 rounded hover:bg-red-500/20 text-red-300 hover:text-red-200 z-10 cursor-pointer"
                      title="Hapus Menu"
                      @click.stop="confirmDelete(child.key!)"
                    >
                      <i class="pi pi-trash text-[10px]"></i>
                    </button>

                    <!-- Submenu Level 3 - Skipping draggable for l3 to keep it simple -->
                    <Transition
                      :css="false"
                      @enter="onSubmenuEnter"
                      @after-enter="onSubmenuAfterEnter"
                      @leave="onSubmenuLeave"
                    >
                      <ul v-if="isExpanded(`${idx}-${cidx}`)" class="submenu submenu--nested">
                        <li v-for="(grandchild, gcidx) in child.items" :key="gcidx">
                          <div class="group relative">
                            <NuxtLink
                              :to="grandchild.to || '/dashboard'"
                              class="submenu__link submenu__link--deep"
                              :class="{ 'submenu__link--active': activeItem === `${idx}-${cidx}-${gcidx}` }"
                              @click="selectItem(`${idx}-${cidx}-${gcidx}`)"
                            >
                              <i :class="[grandchild.icon, 'submenu__icon']" />
                              <span class="submenu__label">{{ grandchild.label }}</span>
                            </NuxtLink>
                            <button
                              v-if="isEditMode"
                              class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                              title="Edit Item"
                              @click.stop="openEditModal(grandchild)"
                            >
                              <i class="pi pi-cog text-[10px]"></i>
                            </button>
                            <button
                              v-if="isEditMode"
                              class="absolute right-8 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-red-500/20 text-red-300 hover:text-red-200 cursor-pointer"
                              title="Hapus Item"
                              @click.stop="confirmDelete(grandchild.key!)"
                            >
                              <i class="pi pi-trash text-[10px]"></i>
                            </button>
                          </div>
                        </li>
                      </ul>
                    </Transition>
                  </div>
                </li>
              </VueDraggable>
              </div>
            </Transition>
          </div>
        </li>
      </VueDraggable>
    </nav>

    <!-- Footer -->
    <div v-if="open" class="sidebar__footer">
      <div v-if="isEditMode" class="w-full mb-4 px-4">
        <Button label="Tambah Menu Utama" icon="pi pi-plus" size="small" severity="secondary" class="w-full text-xs" @click.stop="openAddModal()" />
      </div>
      © 2026 Opsitech
    </div>
  </aside>

  <!-- Form Dialog -->
  <Dialog v-model:visible="showDialog" :header="isEdit ? 'Edit Menu' : 'Tambah Menu'" modal class="w-full md:w-[400px]">
    <div class="flex flex-col gap-4 py-4">
      <div class="flex flex-col gap-2">
        <label for="label" class="font-semibold text-sm text-gray-700">Nama Menu <span class="text-red-500">*</span></label>
        <InputText id="label" v-model="formData.label" placeholder="Cth: Dashboard" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="icon" class="font-semibold text-sm text-gray-700">Ikon (PrimeIcons)</label>
        <InputText id="icon" v-model="formData.icon" placeholder="Cth: pi pi-home" />
        <span class="text-xs text-gray-400">Gunakan class dari PrimeIcons, misal: <code class="bg-gray-100 px-1 py-0.5 rounded">pi pi-users</code></span>
      </div>
      <div class="flex flex-col gap-2">
        <label for="to" class="font-semibold text-sm text-gray-700">URL Route</label>
        <InputText id="to" v-model="formData.to" placeholder="Cth: /dashboard/settings" />
        <span class="text-xs text-gray-400">Kosongkan jika menu ini adalah kategori (hanya memiliki submenu)</span>
      </div>
    </div>
    
    <template #footer>
      <Button label="Batal" icon="pi pi-times" text severity="secondary" @click="showDialog = false" />
      <Button label="Simpan" icon="pi pi-check" @click="saveMenu" :disabled="!formData.label" />
    </template>
  </Dialog>
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
