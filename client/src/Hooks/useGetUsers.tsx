import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { useUsersDispatch, useUsersState } from "../context/users";
import { GET_USERS } from "../GraphQl/Queries";

const useGetUsers = (pageNum: number) => {
  const { hasMoreToFetch } = useUsersState();
  const UsersDispatch = useUsersDispatch();
  const [getUsersGql, { loading }] = useLazyQuery(GET_USERS, {
    variables: { pageNum },
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      console.log(error.message);
    },
    onCompleted: (data) => {
      if (data.users.length > 0)
        UsersDispatch({ type: "ADD_TO_USERS_LIST", payload: data.users });
      UsersDispatch({ type: "SET_HAS_MORE", payload: data.users.length });
    },
  });

  useEffect(() => {
    console.log(pageNum);
    if (hasMoreToFetch) getUsersGql();
  }, []);

  return { loading, hasMoreToFetch };
};

export default useGetUsers;
