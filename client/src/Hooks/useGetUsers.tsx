import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { useUsersDispatch, useUsersState } from "../context/users";
import { GET_USERS } from "../GraphQl/Queries";

const useGetUsers = (pageNum: number) => {
  const { hasMoreToFetch } = useUsersState();
  const UsersDispatch = useUsersDispatch();
  const [getUsersGql, { loading }] = useLazyQuery(GET_USERS, {
    variables: { pageNum },
    onError: (error) => {
      console.log(error.message);
    },
    onCompleted: (data) => {
      console.log(data.users);
      if (data.users.length > 0)
        UsersDispatch({ type: "ADD_TO_USERS_LIST", payload: data.users });
      UsersDispatch({ type: "SET_HAS_MORE", payload: data.users.length });
    },
  });

  useEffect(() => {
    if (hasMoreToFetch) getUsersGql();
  }, [pageNum, hasMoreToFetch]);

  return { loading, hasMoreToFetch };
};

export default useGetUsers;
