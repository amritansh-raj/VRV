import { create } from 'zustand';

export interface UserI {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  permissions?: {
    add: boolean;
    delete: boolean;
    update: boolean;
  };
}

interface AuthState {
  user: UserI | null;
  isAuthenticated: boolean;
  setUser: (user: UserI) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

export default useAuthStore;
