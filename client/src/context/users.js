import React, { createContext, useReducer, useContext } from "react";

const UsersStateContext = createContext();
const UsersDispatchContext = createContext();

const usersReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_MODAL":
      return {
        ...state,
        showModal: !state.showModal,
      };

    case "CLOSE_MODAL":
      return { ...state, showModal: false };

    case "ADD_TO_USERS_LIST":
      return { ...state, users: [...state.users, ...action.payload] };

    case "INCREMENT_PAGE_NUM":
      return { ...state, pageNum: state.pageNum + 1 };

    case "SET_HAS_MORE":
      return { ...state, hasMoreToFetch: action.payload };

    default:
      throw new Error(`Unknown Action Type ${action.type}`);
  }
};

export const UsersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(usersReducer, {
    showModal: false,
    users: [],
    pageNum: 0,
    hasMoreToFetch: true,
  });
  return (
    <UsersDispatchContext.Provider value={dispatch}>
      <UsersStateContext.Provider value={state}>
        {children}
      </UsersStateContext.Provider>
    </UsersDispatchContext.Provider>
  );
};

export const useUsersState = () => useContext(UsersStateContext);
export const useUsersDispatch = () => useContext(UsersDispatchContext);
