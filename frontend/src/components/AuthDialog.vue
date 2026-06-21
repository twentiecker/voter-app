<script setup>
import { computed } from "vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const props = defineProps({
  visible: { type: Boolean, required: true },
  authMode: { type: String, required: true },
  loginForm: { type: Object, required: true },
  registerForm: { type: Object, required: true },
  loggingIn: { type: Boolean, required: true },
  registering: { type: Boolean, required: true },
});

const emit = defineEmits(["login", "register", "update:visible", "switchMode"]);

const dialogHeader = computed(() =>
  props.authMode === "login" ? "Welcome back" : "Create account",
);

function onSubmit() {
  if (props.authMode === "login") {
    if (
      !props.loginForm.username.trim() ||
      !props.loginForm.password.trim()
    ) {
      toast.add({
        severity: "warn",
        summary: "Missing fields",
        detail: "Enter both username and password.",
        life: 2600,
      });
      return;
    }
    emit("login");
  } else {
    if (
      !props.registerForm.username.trim() ||
      !props.registerForm.password.trim() ||
      !props.registerForm.name.trim()
    ) {
      toast.add({
        severity: "warn",
        summary: "Missing fields",
        detail: "Enter name, username, and password.",
        life: 2600,
      });
      return;
    }
    emit("register");
  }
}

function switchMode() {
  emit("switchMode");
}

function closeDialog() {
  emit("update:visible", false);
  emit("switchMode", "login");
}
</script>

<template>
  <Dialog
    :visible="visible"
    :header="dialogHeader"
    :style="{ width: '26rem' }"
    @update:visible="closeDialog"
  >
    <form v-if="authMode === 'login'" class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <span class="text-sm text-slate-600">Enter your credentials to access your account.</span>
      <div>
        <label class="mb-1 block text-sm font-semibold text-slate-900">Username</label>
        <InputText
          v-model="loginForm.username"
          class="w-full"
          placeholder="Enter username"
          autocomplete="username"
        />
      </div>
      <div>
        <label class="mb-1 block text-sm font-semibold text-slate-900">Password</label>
        <Password
          v-model="loginForm.password"
          class="w-full"
          placeholder="Enter password"
          autocomplete="current-password"
          :feedback="false"
          toggle-mask
        />
      </div>
      <Button
        type="submit"
        label="Sign in"
        :loading="loggingIn"
        class="w-full cursor-pointer"
      />
      <p class="text-center text-sm text-slate-600">
        Don't have an account?
        <button
          type="button"
          class="font-semibold text-emerald-700 hover:underline cursor-pointer"
          @click="switchMode"
        >Register
        </button>
      </p>
    </form>

    <form v-else class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <span class="text-sm text-slate-600">Create a new voter account.</span>
      <div>
        <label class="mb-1 block text-sm font-semibold text-slate-900">Full name</label>
        <InputText
          v-model="registerForm.name"
          class="w-full"
          placeholder="Enter your name"
          autocomplete="name"
        />
      </div>
      <div>
        <label class="mb-1 block text-sm font-semibold text-slate-900">Username</label>
        <InputText
          v-model="registerForm.username"
          class="w-full"
          placeholder="Choose a username"
          autocomplete="username"
        />
      </div>
      <div>
        <label class="mb-1 block text-sm font-semibold text-slate-900">Password</label>
        <Password
          v-model="registerForm.password"
          class="w-full"
          placeholder="Create a password"
          autocomplete="new-password"
          :feedback="false"
          toggle-mask
        />
      </div>
      <Button
        type="submit"
        label="Create account"
        :loading="registering"
        class="w-full cursor-pointer"
      />
      <p class="text-center text-sm text-slate-600">
        Already have an account?
        <button
          type="button"
          class="font-semibold text-emerald-700 hover:underline cursor-pointer"
          @click="switchMode"
        >Sign in
        </button>
      </p>
    </form>
  </Dialog>
</template>
