import { Header } from "./Layout/Header";
import { Routes, Route, useLocation } from "react-router-dom";
import { SignUp } from "./Pages/Auth/SignUp";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;
