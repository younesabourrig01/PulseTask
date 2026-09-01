import { Header } from "./Layout/Header";
import { Footer } from "./Layout/Footer";
import { Routes, Route, useLocation } from "react-router-dom";
import { SignIn } from "./Pages/Auth/SignIn";
import { SignUp } from "./Pages/Auth/SignUp";
import { ForgotPassword } from "./Pages/Auth/ForgotPassword";
import { OpenSource } from "./Pages/OpenSource/OpenSource";
import { Platform } from "./Pages/Platform/Platform";
import { Dashboard } from "./Pages/Dashboard/Dashboard";

function App() {
  const { pathname } = useLocation();
  const isAuthPage =
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/forgot-password";

  return (
    <>
      {!isAuthPage && <Header />}
      <Routes>
        <Route path="/" element={<Platform />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/open-source" element={<OpenSource />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      {!isAuthPage && <Footer />}
    </>
  );
}

export default App;
