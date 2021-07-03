import { createStore } from "redux";

import todoReducer from "./features/todo/todo.reducer";

function rootReducer(state = {}, action) {
  return {
    todo: todoReducer(state.todo, action),
  };
}

export const store = createStore(rootReducer);

