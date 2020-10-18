import { useLazyQuery } from "@apollo/client";
import { useEffect, useMemo } from "react";
import { useUsersDispatch, useUsersState } from "../context/users";
import { GET_USERS } from "../GraphQl/Queries";

const useGetUsers = (pageNum: number) => {
  const { hasMoreToFetch, currentPage } = useUsersState();
  const UsersDispatch = useUsersDispatch();
  const [getUsersGql, { loading }] = useLazyQuery(GET_USERS, {
    variables: { pageNum },
    // so it fetches again if i logged out -- as not added users change from one to another
    fetchPolicy: "network-only",
    onError: (error) => {
      console.log(error.message);
    },
    onCompleted: (data) => {
      if (data.users.length > 0)
        UsersDispatch({ type: "ADD_TO_USERS_LIST", payload: data.users });
      UsersDispatch({ type: "SET_HAS_MORE", payload: data.users.length });
      UsersDispatch({ type: "SET_CURRENT_PAGE", payload: pageNum });
    },
  });

  useEffect(() => {
    // so it does'nt fetch again same page if you opened and closed the modal without changing page
    if (hasMoreToFetch && currentPage !== pageNum) getUsersGql();
  }, [pageNum, currentPage]);

  return { loading, hasMoreToFetch, getUsersGql };
};

export default useGetUsers;
