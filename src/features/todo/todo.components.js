import { useDispatch, useSelector } from "react-redux";
import { add, remove, toggle, addAsync } from "./todo.slice";
import { useState } from "react";

function TodoItem({ id, text, finished }) {
  const dispatch = useDispatch();

  return (
    <div
      className={`display-flex flex-row justify-content-start my-2 align-items-center`}
    >
      <input
        type="checkbox"
        checked={finished}
        onChange={(e) => dispatch(toggle({ id, checked: e.target.checked }))}
      />
      <span className="mx-2">{`${text} ${finished ? "[finished]" : ""}`}</span>
      <span
        href="#"
        style={{ color: "blue", cursor: "pointer" }}
        onClick={() => dispatch(remove({ id }))}
      >
        x
      </span>
    </div>
  );
}

function AddTodo() {
  const [text, setText] = useState("");
  const dispatch = useDispatch();

  return (
    <div className="addTodo">
      <input
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && text) {
            dispatch(add({ text }));
            setText("");
          }
        }}
      />
    </div>
  );
}

function TodoList() {
  const myTodo = useSelector((state) => state.todo);
  return (
    <div className="">
      {myTodo.map((item) => (
        <TodoItem {...item} key={item.id} />
      ))}
    </div>
  );
}

function TodoApp() {
  return (
    <div className="TodoApp m-4">
      <div className="header">
        <h4>Todo App</h4>
      </div>
      <AddTodo />
      <TodoList />
    </div>
  );
}

export default TodoApp;
