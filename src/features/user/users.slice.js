import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "../../api/client";

const initialState = [];

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await client.get("/fakerApi/users");
  return response.users;
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchUsers.fulfilled]: (state, action) => {
      console.log(action);
      return action.payload;
    },
  },
});

export const selectAllUsers = (state) => state.users;
export const selectUserById = (state, userId) =>
  state.users.find((user) => user.id === userId);

export default userSlice.reducer;
