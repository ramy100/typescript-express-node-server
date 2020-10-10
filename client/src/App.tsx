import React from "react";
import "./App.scss";
import MainPage from "./Components/MainPage/MainPage";
import { AuthProvider } from "./context/auth";
import { UsersProvider } from "./context/users";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <UsersProvider>
          <MainPage />
        </UsersProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
