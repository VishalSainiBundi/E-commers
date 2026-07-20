import { createSlice } from "@reduxjs/toolkit";

const recalculateTotals = (state) => {
  state.final_total = state.data.reduce((total, item) => total + item.final_price * item.qty, 0);
  state.original_total = state.data.reduce((total, item) => total + item.original_price * item.qty, 0);
};
const saveCart = (state) => localStorage.setItem("cart", JSON.stringify(state));
const initialState = { data: [], final_total: 0, original_total: 0 };

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    lsToCart(state) {
      try {
        const parsed = JSON.parse(localStorage.getItem("cart") || "null");
        const items = Array.isArray(parsed?.data) ? parsed.data : [];
        state.data = items.map((item) => ({
          id: item.id || item._id,
          name: item.name,
          imgUrl: item.imgUrl,
          original_price: Number(item.original_price) || 0,
          final_price: Number(item.final_price) || 0,
          qty: Math.max(1, Number(item.qty) || 1),
        })).filter((item) => item.id);
        recalculateTotals(state);
      } catch {
        state.data = [];
        recalculateTotals(state);
      }
    },
    setCart(state, { payload }) {
      state.data = Array.isArray(payload) ? payload : [];
      recalculateTotals(state);
      saveCart(state);
    },
    addToCart(state, { payload }) {
      const id = payload.id || payload._id;
      if (!id) return;
      const existing = state.data.find((item) => item.id === id);
      if (existing) existing.qty += 1;
      else state.data.push({ id, name: payload.name, imgUrl: payload.imgUrl, original_price: Number(payload.original_price) || 0, final_price: Number(payload.final_price) || 0, qty: 1 });
      recalculateTotals(state);
      saveCart(state);
    },
    removeFromCart(state, { payload }) {
      const id = payload.id || payload._id;
      state.data = state.data.filter((item) => item.id !== id);
      recalculateTotals(state);
      saveCart(state);
    },
    changeQuantity(state, { payload }) {
      const id = payload.id || payload._id;
      const item = state.data.find((entry) => entry.id === id);
      if (item && payload.flag === 1) item.qty += 1;
      if (item && payload.flag === 0 && item.qty > 1) item.qty -= 1;
      recalculateTotals(state);
      saveCart(state);
    },
    emptyCart(state) {
      state.data = [];
      state.final_total = 0;
      state.original_total = 0;
      localStorage.removeItem("cart");
    },
  },
});

export const { lsToCart, setCart, addToCart, removeFromCart, changeQuantity, emptyCart } = CartSlice.actions;
export default CartSlice.reducer;
