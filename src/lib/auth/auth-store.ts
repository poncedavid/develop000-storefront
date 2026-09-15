'use client';

/**
 * Store de autenticación con Zustand
 * Estado del usuario autenticado en el storefront
 */
import { create } from 'zustand';
import {
  signIn,
  signOut,
  signUp,
  confirmSignUp,
  getCurrentUser,
  fetchUserAttributes,
  resendSignUpCode,
  type AuthUser,
} from 'aws-amplify/auth';
// Import lazy para evitar circular dependency — wishlist-store importa de auth indirectamente
import { useWishlistStore } from '@/lib/store/wishlist-store';

interface AuthState {
  user:      AuthUser | null;
  email:     string | null;
  nombre:    string | null;
  isLoading: boolean;
  isChecked: boolean; // true después del primer checkSession

  // Acciones
  checkSession:    () => Promise<void>;
  login:           (email: string, password: string) => Promise<void>;
  register:        (email: string, password: string, nombre: string) => Promise<{ needsConfirmation: boolean }>;
  confirmRegister: (email: string, code: string) => Promise<void>;
  resendCode:      (email: string) => Promise<void>;
  logout:          () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user:      null,
  email:     null,
  nombre:    null,
  isLoading: false,
  isChecked: false,

  checkSession: async () => {
    try {
      const user = await getCurrentUser();
      const attrs = await fetchUserAttributes();
      set({
        user,
        email:  attrs.email ?? null,
        nombre: attrs.name  ?? null,
        isChecked: true,
      });
    } catch {
      set({ user: null, email: null, nombre: null, isChecked: true });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      await signIn({ username: email, password });
      const user  = await getCurrentUser();
      const attrs = await fetchUserAttributes();
      set({ user, email: attrs.email ?? null, nombre: attrs.name ?? null });

      // Sincronizar favoritos localStorage → backend en background
      // No bloquea el login — fire-and-forget
      useWishlistStore.getState().syncFromBackend().catch(() => {
        // Si falla la sync, no es crítico — localStorage sigue disponible
      });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email, password, nombre) => {
    set({ isLoading: true });
    try {
      const result = await signUp({
        username: email,
        password,
        options: {
          userAttributes: { email, name: nombre },
        },
      });
      return {
        needsConfirmation:
          result.nextStep.signUpStep === 'CONFIRM_SIGN_UP',
      };
    } finally {
      set({ isLoading: false });
    }
  },

  confirmRegister: async (email, code) => {
    set({ isLoading: true });
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
    } finally {
      set({ isLoading: false });
    }
  },

  resendCode: async (email) => {
    await resendSignUpCode({ username: email });
  },

  logout: async () => {
    await signOut();
    set({ user: null, email: null, nombre: null });
    // Limpiar favoritos de memoria al cerrar sesión
    // (no borra localStorage — el usuario puede tener favoritos offline)
    useWishlistStore.getState().clearMemory();
  },
}));

// Selectores
export const selectIsAuthenticated = (s: AuthState) => !!s.user;
export const selectAuthUser        = (s: AuthState) => s.user;
export const selectUserEmail       = (s: AuthState) => s.email;
export const selectUserName        = (s: AuthState) => s.nombre;
export const selectIsAuthLoading   = (s: AuthState) => s.isLoading;
