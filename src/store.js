import { configureStore } from "@reduxjs/toolkit";
import postSlice from "./features/post/posts.slice";
import userSlice from "./features/user/users.slice";

export default configureStore({
  reducer: {
    posts: postSlice,
    users: userSlice,
  },
});
