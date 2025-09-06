<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">User Management</h1>

    <button @click="openModal()" class="mb-4 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
      Add User
    </button>

    <div class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ user.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ user.role }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openModal(user)" class="text-indigo-600 hover:text-indigo-900">Edit</button>
              <button @click="deleteUser(user.id)" class="ml-4 text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900">{{ isEditing ? 'Edit User' : 'Add User' }}</h3>
          <form @submit.prevent="saveUser" class="mt-4 space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
              <input v-model="currentUser.name" type="text" id="name" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md">
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input v-model="currentUser.email" type="email" id="email" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md">
            </div>
            <div>
              <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
              <select v-model="currentUser.role" id="role" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md">
                <option>Admin</option>
                <option>User</option>
              </select>
            </div>
          </form>
        </div>
        <div class="px-6 py-4 bg-gray-50 text-right space-x-2">
          <button @click="closeModal" class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
          <button @click="saveUser" class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">{{ isEditing ? 'Update' : 'Save' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const users = ref([
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    ]);

    const isModalOpen = ref(false);
    const isEditing = ref(false);
    const currentUser = ref({ id: null, name: '', email: '', role: 'User' });

    const openModal = (user = null) => {
      if (user) {
        isEditing.value = true;
        currentUser.value = { ...user };
      } else {
        isEditing.value = false;
        currentUser.value = { id: null, name: '', email: '', role: 'User' };
      }
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    const saveUser = () => {
      if (isEditing.value) {
        const index = users.value.findIndex(u => u.id === currentUser.value.id);
        users.value[index] = currentUser.value;
      } else {
        currentUser.value.id = Date.now();
        users.value.push(currentUser.value);
      }
      closeModal();
    };

    const deleteUser = (id) => {
      users.value = users.value.filter(u => u.id !== id);
    };

    return {
      users,
      isModalOpen,
      isEditing,
      currentUser,
      openModal,
      closeModal,
      saveUser,
      deleteUser,
    };
  },
};
</script>
