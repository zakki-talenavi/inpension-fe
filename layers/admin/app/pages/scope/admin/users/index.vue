<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const userStore = useUserStore()
const { showSuccess, showError } = useNotification()

const showDialog = ref(false)
const isEdit = ref(false)
const formData = reactive({
  id: '',
  username: '',
  email: '',
  fullName: '',
  password: '',
  role: '',
  status: 'ACTIVE'
})

const roleOptions = [
  { label: 'Administrator', value: 'ADMINISTRATOR' },
  { label: 'DPLK', value: 'DPLK' },
  { label: 'Company', value: 'COMPANY' },
  { label: 'Personal', value: 'PERSONAL' }
]

const statusOptions = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' }
]

onMounted(() => {
  userStore.fetchUsers()
})

function openCreateDialog() {
  isEdit.value = false
  resetForm()
  showDialog.value = true
}

function openEditDialog(user: any) {
  isEdit.value = true
  formData.id = user.id
  formData.username = user.username
  formData.email = user.email
  formData.fullName = user.fullName
  formData.role = user.role
  formData.status = user.status
  showDialog.value = true
}

function resetForm() {
  formData.id = ''
  formData.username = ''
  formData.email = ''
  formData.fullName = ''
  formData.password = ''
  formData.role = ''
  formData.status = 'ACTIVE'
}

async function handleSubmit() {
  try {
    if (isEdit.value) {
      await userStore.updateUser(formData.id, {
        email: formData.email,
        fullName: formData.fullName,
        role: formData.role,
        status: formData.status
      })
      showSuccess('Success', 'User updated successfully')
    } else {
      await userStore.createUser({
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password,
        role: formData.role
      })
      showSuccess('Success', 'User created successfully')
    }
    showDialog.value = false
    resetForm()
  } catch (error: any) {
    showError('Error', error.message)
  }
}

async function handleDelete(id: string) {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await userStore.deleteUser(id)
      showSuccess('Success', 'User deleted successfully')
    } catch (error: any) {
      showError('Error', error.message)
    }
  }
}
</script>

<template>
  <div class="users-page">
    <div class="page-header mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">User Management</h1>
          <p class="text-gray-600">Manage system users and roles</p>
        </div>
        <Button
          label="Create User"
          icon="pi pi-plus"
          @click="openCreateDialog"
        />
      </div>
    </div>
    
    <!-- Users Table -->
    <Card>
      <template #content>
        <DataTable
          :value="userStore.users"
          :loading="userStore.loading"
          paginator
          :rows="10"
          striped-rows
          responsive-layout="scroll"
        >
          <Column field="username" header="Username" sortable />
          <Column field="fullName" header="Full Name" sortable />
          <Column field="email" header="Email" sortable />
          <Column field="role" header="Role">
            <template #body="{ data }">
              <span class="badge">{{ data.role }}</span>
            </template>
          </Column>
          <Column field="status" header="Status">
            <template #body="{ data }">
              <span
                :class="{
                  'badge-active': data.status === 'ACTIVE',
                  'badge-inactive': data.status === 'INACTIVE'
                }"
                class="badge"
              >
                {{ data.status }}
              </span>
            </template>
          </Column>
          <Column field="lastLogin" header="Last Login" />
          <Column header="Actions">
            <template #body="{ data }">
              <div class="flex gap-2">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-sm p-button-text"
                  @click="openEditDialog(data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-sm p-button-text p-button-danger"
                  @click="handleDelete(data.id)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
    
    <!-- Create/Edit Dialog -->
    <Dialog
      v-model:visible="showDialog"
      :header="isEdit ? 'Edit User' : 'Create User'"
      :modal="true"
      :style="{ width: '500px' }"
    >
      <div class="space-y-4">
        <div v-if="!isEdit" class="field">
          <label for="username" class="block mb-2">Username *</label>
          <InputText
            id="username"
            v-model="formData.username"
            class="w-full"
            required
          />
        </div>
        
        <div class="field">
          <label for="fullName" class="block mb-2">Full Name *</label>
          <InputText
            id="fullName"
            v-model="formData.fullName"
            class="w-full"
            required
          />
        </div>
        
        <div class="field">
          <label for="email" class="block mb-2">Email *</label>
          <InputText
            id="email"
            v-model="formData.email"
            type="email"
            class="w-full"
            required
          />
        </div>
        
        <div v-if="!isEdit" class="field">
          <label for="password" class="block mb-2">Password *</label>
          <InputText
            id="password"
            v-model="formData.password"
            type="password"
            class="w-full"
            required
          />
        </div>
        
        <div class="field">
          <label for="role" class="block mb-2">Role *</label>
          <Dropdown
            id="role"
            v-model="formData.role"
            :options="roleOptions"
            option-label="label"
            option-value="value"
            class="w-full"
          />
        </div>
        
        <div v-if="isEdit" class="field">
          <label for="status" class="block mb-2">Status *</label>
          <Dropdown
            id="status"
            v-model="formData.status"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            class="w-full"
          />
        </div>
      </div>
      
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          severity="secondary"
          @click="showDialog = false"
        />
        <Button
          label="Save"
          icon="pi pi-check"
          @click="handleSubmit"
        />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.users-page {
  padding: 2rem;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-active {
  background-color: #dcfce7;
  color: #166534;
}

.badge-inactive {
  background-color: #fee2e2;
  color: #991b1b;
}
</style>
