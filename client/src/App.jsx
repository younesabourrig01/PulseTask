import { Header } from "./Layout/Header";
import { Routes, Route } from "react-router-dom";
import { SignIn } from "./Pages/Auth/SignIn";
import { SignUp } from "./Pages/Auth/SignUp";
import { Home } from "./Pages/Home/Home";
import { OpenSource } from "./Pages/OpenSource/OpenSource";
import { Platform } from "./Pages/Platform/Platform";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Platform />} />
        <Route path="/open-source" element={<OpenSource />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;
