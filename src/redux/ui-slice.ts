import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
};
type UIUXState = {
  apiToken: string | null;
  likedPosts: number[];
  isAuthenticated: boolean;
  authUser: AuthUser | null;
  isLoggedOut: boolean;
};

const initialState: UIUXState = {
  apiToken: null,
  likedPosts: [],
  isAuthenticated: false,
  authUser: null,
  isLoggedOut: false,
};

const UIUXSlice = createSlice({
  name: 'uiux',
  initialState,
  reducers: {
    setAuthenticated: (
      state,
      action: PayloadAction<{ authUser: AuthUser; apiToken: string }>
    ) => {
      state.isAuthenticated = true;
      state.authUser = action.payload.authUser;
      state.apiToken = action.payload.apiToken;
    },
    setAuthUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.authUser = action.payload;
    },
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.apiToken = action.payload;
    },
    setUnauthenticated: (state, action: PayloadAction<boolean>) => {
      state.isLoggedOut = action.payload;
    },
    addToLikedPost(state, action: PayloadAction<number>) {
      const postId = action.payload;
      const existingItem = state.likedPosts.includes(postId);

      if (!existingItem) {
        state.likedPosts.push(postId);
      } else {
        state.likedPosts = state.likedPosts.filter((id) => id !== postId);
      }
    },

    resetState: () => {
      return initialState;
    },
  },
});

export const {
  setAuthenticated,
  setAuthUser,
  setAuthToken,
  setUnauthenticated,
  addToLikedPost,
  resetState,
} = UIUXSlice.actions;
export const uiUxReducer = UIUXSlice.reducer;
