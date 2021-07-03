import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const addAsync = (text) => (dispatch, getState) => {
  setTimeout(() => {
    dispatch(add(text));
  }, 2000);
};

export const addAsync2 = createAsyncThunk("todo/more-addr", (text) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(text);
    }, 2000);
  });
});

export const todoSlice = createSlice({
  name: "todo",
  initialState: [
    { id: 1, text: "go to work", finished: false },
    { id: 2, text: "have a lunch", finished: false },
    { id: 3, text: "play with friends", finished: false },
  ],
  reducers: {
    add: (state, action) => {
      const { text } = action.payload;
      state.push({
        id: state.length + 1,
        text: text,
        finished: false,
      });
    },
    remove: (state, action) => {
      const { id } = action.payload;
      const index = state.findIndex((it) => it.id === id);
      state.splice(index, 1);
    },

    toggle: (state, action) => {
      const { id, checked } = action.payload;
      const findItem = state.find((it) => it.id === id);
      if (findItem) {
        findItem.finished = checked;
      }
    },
  },

  extraReducers: {
    [addAsync2.fulfilled]: (state, action) => {
      state.push({
        id: state.length + 1,
        text: action.payload,
        finished: false,
      });
    },
  },
});

export const { add, remove, toggle } = todoSlice.actions;

export default todoSlice.reducer;
