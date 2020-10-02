import React, { useEffect } from "react";
import "./App.scss";
import MainPage from "./Components/MainPage/MainPage";
import { AuthProvider } from "./context/auth";

function App() {
  return (
    <div className='App'>
      <AuthProvider>
        <MainPage />
      </AuthProvider>
    </div>
  );
}

export default App;
