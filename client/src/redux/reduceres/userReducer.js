import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
  name: "user",
  initialState: {
    data:        null,
    token:       null,
    isVerified:  false,
    loginAt:     null,
  },
  reducers: {
    setData(state, { payload }) {
      state.data       = payload.user  || null;
      state.token      = payload.token || null;
      state.isVerified = payload.isVerified ?? (payload.user?.isVerified ?? false);
      state.loginAt    = Date.now();

      if (payload.user)  localStorage.setItem("user",       JSON.stringify(payload.user));
      if (payload.token) localStorage.setItem("token",      JSON.stringify(payload.token));
      localStorage.setItem("isVerified", JSON.stringify(state.isVerified));
      localStorage.setItem("loginAt",    JSON.stringify(state.loginAt));
    },

    // Call this after verify-otp succeeds to refresh the user doc in redux
    // without changing the token (the new full token replaces the provisional one)
    setVerified(state, { payload }) {
      state.isVerified = true;
      state.data       = payload.user  || state.data;
      state.token      = payload.token || state.token;

      if (payload.user)  localStorage.setItem("user",  JSON.stringify(payload.user));
      if (payload.token) localStorage.setItem("token", JSON.stringify(payload.token));
      localStorage.setItem("isVerified", JSON.stringify(true));
    },

    lstouser(state) {
      const lsData       = localStorage.getItem("user");
      const lsToken      = localStorage.getItem("token");
      const lsLoginAt    = localStorage.getItem("loginAt");
      const lsIsVerified = localStorage.getItem("isVerified");

      if (lsData       && lsData       !== "undefined") state.data       = JSON.parse(lsData);
      if (lsToken      && lsToken      !== "undefined") state.token      = JSON.parse(lsToken);
      if (lsLoginAt    && lsLoginAt    !== "undefined") state.loginAt    = JSON.parse(lsLoginAt);
      if (lsIsVerified && lsIsVerified !== "undefined") state.isVerified = JSON.parse(lsIsVerified);
    },

    logout(state) {
      state.data       = null;
      state.token      = null;
      state.isVerified = false;
      state.loginAt    = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("loginAt");
      localStorage.removeItem("isVerified");
    },
  },
});

export const { setData, setVerified, lstouser, logout } = UserSlice.actions;
export default UserSlice.reducer;
