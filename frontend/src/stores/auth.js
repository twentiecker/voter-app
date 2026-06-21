import { defineStore } from "pinia";
import { login as apiLogin, register as apiRegister } from "../api.js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    loggingIn: false,
    registering: false,
    loginForm: { username: "", password: "" },
    registerForm: { username: "", password: "", name: "" },
    showLoginDialog: false,
    authMode: "login",
  }),
  actions: {
    async handleLogin() {
      if (!this.loginForm.username.trim() || !this.loginForm.password.trim()) {
        return { fieldsMissing: true };
      }
      this.loggingIn = true;
      try {
        const userData = await apiLogin({
          username: this.loginForm.username.trim(),
          password: this.loginForm.password.trim(),
        });
        this.user = userData;
        localStorage.setItem("voter_user", JSON.stringify(userData));
        this.loginForm = { username: "", password: "" };
        this.showLoginDialog = false;
        this.authMode = "login";
        return { success: true, userData };
      } catch (err) {
        return { success: false, error: "Invalid username or password." };
      } finally {
        this.loggingIn = false;
      }
    },

    async handleRegister() {
      if (
        !this.registerForm.username.trim() ||
        !this.registerForm.password.trim() ||
        !this.registerForm.name.trim()
      ) {
        return { fieldsMissing: true };
      }
      this.registering = true;
      try {
        const userData = await apiRegister({
          username: this.registerForm.username.trim(),
          password: this.registerForm.password.trim(),
          name: this.registerForm.name.trim(),
        });
        this.user = userData;
        localStorage.setItem("voter_user", JSON.stringify(userData));
        this.registerForm = { username: "", password: "", name: "" };
        this.showLoginDialog = false;
        this.authMode = "login";
        return { success: true, userData };
      } catch (err) {
        return {
          success: false,
          error: "Could not create account. Try a different username.",
        };
      } finally {
        this.registering = false;
      }
    },

    handleLogout() {
      this.user = null;
      localStorage.removeItem("voter_user");
    },

    openLogin() {
      this.authMode = "login";
      this.showLoginDialog = true;
    },

    switchAuthMode(mode) {
      this.authMode = mode;
    },
  },
});
