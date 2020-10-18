import React, { createContext, useReducer, useContext } from "react";

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();
const initialState = { user: null };

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };

    case "LOGOUT":
      return initialState;

    case "ADD_FRIEND_REQUESTS":
      return {
        ...state,
        user: {
          ...state.user,
          friendRequests: [...state.user.friendRequests, action.payload],
        },
      };

    case "REMOVE_FRIEND_REQUEST":
      return {
        ...state,
        user: {
          ...state.user,
          friendRequests: state.user.friendRequests.filter(
            (friend) => friend.id !== action.payload
          ),
        },
      };

    case "ADD_FRIEND":
      return {
        ...state,
        user: {
          ...state.user,
          friends: [...state.user.friends, action.payload],
        },
      };

    default:
      throw new Error(`Unknown Action Type ${action.type}`);
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);
