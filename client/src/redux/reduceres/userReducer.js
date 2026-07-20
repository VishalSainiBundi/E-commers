import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    token: null,
    loginAt: null,
  },
  reducers: {
    setData(current_state, { payload }) {
      current_state.data = payload.user || null;
      current_state.token = payload.token || null;
      current_state.loginAt = Date.now(); // always set current time

      // Save to localStorage safely
      if (payload.user) localStorage.setItem("user", JSON.stringify(payload.user));
      if (payload.token) localStorage.setItem("token", JSON.stringify(payload.token));
      localStorage.setItem("loginAt", JSON.stringify(current_state.loginAt));
    },

    lstouser(current_state) {
      const lsData = localStorage.getItem("user");
      const lsToken = localStorage.getItem("token");
      const lsLoginAt = localStorage.getItem("loginAt");

      // Only parse if value exists and is not "undefined"
      if (lsData && lsData !== "undefined") current_state.data = JSON.parse(lsData);
      if (lsToken && lsToken !== "undefined") current_state.token = JSON.parse(lsToken);
      if (lsLoginAt && lsLoginAt !== "undefined") current_state.loginAt = JSON.parse(lsLoginAt);
    },

    logout(current_state) {
      current_state.data = null;
      current_state.token = null;
      current_state.loginAt = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("loginAt");
    },
  },
});

export const { setData, lstouser, logout } = UserSlice.actions;
export default UserSlice.reducer;
