import {
  createAsyncThunk,
  createSelector,
  createSlice,
  nanoid,
} from '@reduxjs/toolkit'
import { client } from "../../api/client";

const reactionsInit = {
  thumbsUp: 0,
  hooray: 0,
  heart: 0,
  rocket: 0,
  eyes: 0,
};

const initialState = {
  value: [],
  status: "idle",
  error: null,
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await client.get("/fakerApi/posts");
  return response.posts;
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (initialPost) => {
    const response = await client.post("/fakerApi/posts", {
      post: initialPost,
    });

    return response.post;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdd: {
      reducer(state, action) {
        state.value.push(action.payload);
      },

      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(),
            title,
            content,
            user: userId,
            reactions: reactionsInit,
          },
        };
      },
    },

    editPost(state, action) {
      const { id, title, content } = action.payload;
      const existsPost = state.value.find((post) => post.id === id);
      if (existsPost) {
        existsPost.title = title;
        existsPost.content = content;
      }
    },

    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      const existsPost = state.value.find((post) => post.id === postId);

      if (existsPost) {
        existsPost.reactions[reaction]++;
      }
    },
  },

  extraReducers: {
    [fetchPosts.pending]: (state, action) => {
      state.status = "pending";
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.status = "fulfilled";
      state.value.push(...action.payload);
    },
    [fetchPosts.rejected]: (state, action) => {
      state.status = "rejected";
      state.error = action.payload.message;
    },
    [addNewPost.fulfilled]: (state, action) => {
      state.value.push(action.payload);
    },
  },
});

export const { postAdd, editPost, reactionAdded } = postsSlice.actions;

export const selectAllPosts = (state) => state.posts.value;
export const selectPostById = (state, postId) =>
  state.posts.value.find((post) => post.id === postId);

export default postsSlice.reducer;
