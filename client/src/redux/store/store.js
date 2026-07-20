import { configureStore } from "@reduxjs/toolkit";

import CartReducer from "../reduceres/cartReducer";
import UserReducer from "../reduceres/userReducer";
import WishReducer from "../reduceres/wishlistReducer"


const store = configureStore({
  reducer: {
    cart: CartReducer,
    user: UserReducer,
    wish:WishReducer

  },
});

export default store;
 