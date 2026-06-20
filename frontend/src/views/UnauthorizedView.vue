<script setup>
import Button from 'primevue/button';
</script>

<template>
  <div class="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
    <div class="flex flex-col items-center justify-center gap-6 text-center">
      <div class="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <i class="pi pi-exclamation-circle text-4xl text-red-600"></i>
      </div>
      <h1 class="text-3xl font-bold text-slate-950">Unauthorized Access</h1>
      <p class="max-w-md text-slate-600">You must be logged in to create a vote. Please sign in to continue.</p>
      <Button label="Go to Home" icon="pi pi-home" @click="$router.push('/')" />
    </div>
  </div>
</template>