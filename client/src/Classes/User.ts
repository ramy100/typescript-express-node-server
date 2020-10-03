export class User {
  static loginUser(token: string, dispatch: any, user: any, history: any) {
    localStorage.setItem("token", token);
    dispatch({ type: "LOGIN", payload: user });
    history.push("/");
  }
  static logOut(dispatch: any, history: any) {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    history.push("/login");
  }
}
