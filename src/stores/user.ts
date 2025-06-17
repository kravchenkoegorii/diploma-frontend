import { create } from 'zustand';
import { IUser } from '../types/user';

interface IUserStore {
  userData: IUser | null;
  isLoadingUserData: boolean;
  setUserData: (userData: IUser | null) => void;

  setIsLoadingUserData(val: boolean): void;
}

export const userStore = create<IUserStore>(set => ({
  userData: null,
  isLoadingUserData: false,
  setIsLoadingUserData: isLoadingUserData => set({ isLoadingUserData }),
  setUserData: (userData: IUser | null) =>
    set(state => ({ ...state, userData })),
}));

export const useUserStore = userStore;
