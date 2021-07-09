import { unwrapResult } from "@reduxjs/toolkit";
import { formatDistanceToNow } from "date-fns";
import { parseISO } from "date-fns/esm";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import {
  editPost,
  reactionAdded,
  selectPostById,
  selectAllPosts,
  fetchPosts,
  addNewPost,
} from "./posts.slice";

export const AddPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const users = useSelector((state) => state.users);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onTitleChange = (e) => setTitle(e.target.value);
  const onContentChange = (e) => setContent(e.target.value);
  const onAuthorChange = (e) => setUserId(e.target.value);

  const canSave = [].every(Boolean) && !loading;

  const onPostSave = async () => {
    if (!canSave) {
      return;
    }

    if (title && content) {
      try {
        setLoading(true);
        const rs = await dispatch(
          addNewPost({
            title,
            content,
            user: userId,
          })
        );
        unwrapResult(rs);
        setTitle("");
        setContent("");
        setLoading(false);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const userOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>Add a new Post</h2>
      <form>
        <label htmlFor="postTitle">title</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChange}
        />

        <label htmlFor="postAuthor">Author:</label>
        <select name="postAuthor" id="postAuthor" onChange={onAuthorChange}>
          <option value=""></option>
          {userOptions}
        </select>

        <label htmlFor="postContent">title</label>
        <textarea
          type="text"
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChange}
        />
        <button type="button" onClick={onPostSave} disabled={!canSave}>
          Save post {loading ? "(loading)" : ""}
        </button>
      </form>
    </section>
  );
};

export function EditPostForm({ match }) {
  const { postId } = match.params;
  const post = useSelector((state) => selectPostById(state, postId));
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const dispatch = useDispatch();
  const history = useHistory();

  const onTitleChange = (e) => setTitle(e.target.value);
  const onContentChange = (e) => setContent(e.target.value);

  const onPostSave = () => {
    if (title && content) {
      dispatch(
        editPost({
          id: postId,
          title,
          content,
        })
      );

      history.push(`/posts/${postId}`);
    }
  };

  return (
    <section>
      <form>
        <label htmlFor="postTitle">Post Title</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder=""
          value={title}
          onChange={onTitleChange}
        />
        <label htmlFor="postContent">Post Title</label>
        <textarea
          type="text"
          id="postContent"
          name="postContent"
          placeholder=""
          value={content}
          onChange={onContentChange}
        />
        <button type="button" onClick={onPostSave}>
          Save Post
        </button>
      </form>
    </section>
  );
}

export function PostAuthor({ userId }) {
  const author = useSelector((state) =>
    state.users.find((user) => user.id === userId)
  );
  return <span>by {author ? author.name : "Unknown author"}</span>;
}

export function TimeAgo({ timestamp }) {
  let timeAgo = "";
  if (timestamp) {
    const date = parseISO(timestamp);
    const period = formatDistanceToNow(date);
    timeAgo = `${period} age`;
  }

  return (
    <span time={timestamp}>
      &nbsp; <i>{timeAgo}</i>
    </span>
  );
}

export function ReactionButtons({ post }) {
  const dispatch = useDispatch();

  const reactionEmoji = {
    thumbsUp: "👍",
    hooray: "🎉",
    heart: "❤️",
    rocket: "🚀",
    eyes: "👀",
  };

  const buttons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className="muted-button reaction-button"
        onClick={() => {
          dispatch(
            reactionAdded({
              postId: post.id,
              reaction: name,
            })
          );
        }}
      >
        {emoji} {post.reactions[name]}
      </button>
    );
  });

  return <div>{buttons}</div>;
}

export function Post({ match }) {
  const { postId } = match.params;
  const post = useSelector((state) => selectPostById(state, postId));

  if (!post) {
    return (
      <section>
        <h2>Post not Found!</h2>
      </section>
    );
  }

  return (
    <section>
      <div className="post">
        <h2>{post.title}</h2>
        <div>
          <PostAuthor userId={post.user} />
          <TimeAgo timestamp={post.date} />
        </div>
        <p className="post-content">{post.content}</p>
        <ReactionButtons post={post} />
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
      </div>
    </section>
  );
}

export function PostsList() {
  const posts = useSelector(selectAllPosts);
  const postStatus = useSelector((state) => state.posts.status);
  const dispatch = useDispatch();

  const orderedPosts = posts
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  useEffect(() => {
    console.log(postStatus);
    if (postStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [dispatch]);

  let content;

  if (postStatus === "pending") {
    content = <div className="loader">pending...</div>;
  } else {
    content = orderedPosts.map((post) => (
      <article className="post border" key={post.id}>
        <h3>{post.title}</h3>
        <div>
          <PostAuthor userId={post.user} />
          <TimeAgo timestamp={post.date} />
        </div>

        <p className="content">{post.content.substring(0, 100)}</p>
        <ReactionButtons post={post} />
        <Link to={`/posts/${post.id}`} className="button muted-button">
          View Post
        </Link>
      </article>
    ));
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  );
}
