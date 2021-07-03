const initState = [];

export const actions = {
  todoAdd: "todo/add",
  todoRemove: "todo/remove",
  todoChecked: "todo/checked",
};

function reducer(state = initState, action) {
  switch (action.type) {
    case actions.todoAdd: {
      const { text } = action.payload;
      return [
        ...state,
        {
          id: state.length + 1,
          text: text,
          finished: false,
        },
      ];
    }

    case actions.todoRemove: {
      const { id } = action.payload;
      return state.filter((item) => item.id !== id);
    }

    case actions.todoChecked: {
      const { id, checked } = action.payload;
      return state.map((item) => {
        return item.id === id
          ? {
              ...item,
              finished: checked,
            }
          : item;
      });
    }

    default:
      return state;
  }
}

export default reducer;
