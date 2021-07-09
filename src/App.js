import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import { Navbar } from "./Navbar";
import {
  PostsList,
  AddPostForm,
  Post,
  EditPostForm,
} from "./features/post/post.components";
import React from "react";
import { UserList, UserPosts } from "./features/user/user.components";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div>
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <React.Fragment>
                <AddPostForm />
                <PostsList />
              </React.Fragment>
            )}
          />
          <Route exact path="/posts/:postId" component={Post} />
          <Route exact path="/editPost/:postId" component={EditPostForm} />
          <Route exact path="/users" component={UserList} />
          <Route exact path="/users/:userId" component={UserPosts} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
