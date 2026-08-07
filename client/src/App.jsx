import { Header } from "./Layout/Header";
import { Footer } from "./Layout/Footer";
import { Routes, Route } from "react-router-dom";
import { SignIn } from "./Pages/Auth/SignIn";
import { SignUp } from "./Pages/Auth/SignUp";
import { Home } from "./Pages/Home/Home";
import { OpenSource } from "./Pages/OpenSource/OpenSource";
import { Platform } from "./Pages/Platform/Platform";
import { Dashboard } from "./Pages/Dashboard/Dashboard";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Platform />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/open-source" element={<OpenSource />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
