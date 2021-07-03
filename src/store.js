import { configureStore } from "@reduxjs/toolkit";
import todoSlice from "./features/todo/todo.slice";

export const store = configureStore({
  reducer: {
    todo: todoSlice
  }
})