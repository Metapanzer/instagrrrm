import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: 0,
  username: "",
  email: "",
  profile_picture: "",
  fullname: "",
  bio: "",
  is_verified: 0,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.profile_picture = action.payload.profile_picture;
      state.fullname = action.payload.fullname;
      state.bio = action.payload.bio;
      state.is_verified = action.payload.is_verified;
    },
    logout: (state) => {
      state.id = 0;
      state.username = "";
      state.email = "";
      state.profile_picture = "";
      state.fullname = "";
      state.bio = "";
      state.is_verified = 0;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
