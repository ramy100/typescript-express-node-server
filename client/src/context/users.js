import React, { createContext, useReducer, useContext } from "react";

const UsersStateContext = createContext();
const UsersDispatchContext = createContext();

const initialState = {
  showModal: false,
  users: [],
  pageNum: 0,
  currentPage: null,
  hasMoreToFetch: true,
};

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

    case "REMOVE_FROM_NOT_ADDED_USERS":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
      };

    case "INCREMENT_PAGE_NUM":
      return {
        ...state,
        pageNum: state.pageNum + 1,
      };

    case "SET_CURRENT_PAGE":
      return {
        ...state,
        currentPage: action.payload,
      };

    case "SET_HAS_MORE":
      return { ...state, hasMoreToFetch: action.payload };

    case "LOGOUT":
      return initialState;

    default:
      throw new Error(`Unknown Action Type ${action.type}`);
  }
};

export const UsersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(usersReducer, initialState);
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
