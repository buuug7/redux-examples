import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectAllPosts } from "../post/posts.slice";
import { selectAllUsers, selectUserById } from "./users.slice";

export function UserList() {
  const users = useSelector(selectAllUsers);

  const content = users.map((user) => (
    <li key={user.id}>
      <Link to={`/users/${user.id}`}>{user.name}</Link>
    </li>
  ));

  return (
    <section>
      <h2>UserList</h2>
      <ul className="userList">{content}</ul>
    </section>
  );
}

export function UserPosts({ match }) {
  const { userId } = match.params;
  const user = useSelector((state) => selectUserById(state, userId));
  const userPosts = useSelector((state) => {
    const allPosts = selectAllPosts(state);
    return allPosts.filter((post) => post.user === userId);
  });

  const PostTitles = userPosts.map((post) => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ));

  return (
    <section>
      <h2>{user.name}</h2>
      <ul>{PostTitles}</ul>
    </section>
  );
}
