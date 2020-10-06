export class User {
  static loginUser(token: string, dispatch: any, user: any, history: any) {
    localStorage.setItem("token", token);
    dispatch({ type: "LOGIN", payload: user });
    history.push("/");
  }
  static logOut(authDispatch: any, usersDispatch: any, history: any) {
    localStorage.removeItem("token");
    authDispatch({ type: "LOGOUT" });
    usersDispatch({ type: "LOGOUT" });
    history.push("/login");
  }
}
