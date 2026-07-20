import { createSlice } from "@reduxjs/toolkit";

const saveWishlist = (state) => localStorage.setItem("wish", JSON.stringify(state));

const WishSlice = createSlice({
  name: "wish",
  initialState: { data: [] },
  reducers: {
    addToWishlist(state, { payload }) {
      const id = payload.id || payload._id;
      if (!id || state.data.some((item) => item.id === id)) return;
      state.data.push({ id, name: payload.name, imgUrl: payload.imgUrl, final_price: Number(payload.final_price) || 0, original_price: Number(payload.original_price) || 0 });
      saveWishlist(state);
    },
    removeFromWishlist(state, { payload }) {
      const id = payload.id || payload._id;
      state.data = state.data.filter((item) => item.id !== id);
      saveWishlist(state);
    },
    lsWishCart(state) {
      try {
        const parsed = JSON.parse(localStorage.getItem("wish") || "null");
        const items = Array.isArray(parsed) ? parsed : parsed?.data;
        state.data = Array.isArray(items) ? items.map((item) => ({ ...item, id: item.id || item._id })).filter((item) => item.id) : [];
      } catch {
        state.data = [];
      }
    },
  },
});

export const { addToWishlist, removeFromWishlist, lsWishCart } = WishSlice.actions;
export default WishSlice.reducer;
