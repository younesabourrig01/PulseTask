import { Header } from "./Layout/Header";
import { Footer } from "./Layout/Footer";
import { Routes, Route, useLocation } from "react-router-dom";
import { SignIn } from "./Pages/Auth/SignIn";
import { SignUp } from "./Pages/Auth/SignUp";
import { ForgotPassword } from "./Pages/Auth/ForgotPassword";
import { OpenSource } from "./Pages/OpenSource/OpenSource";
import { Platform } from "./Pages/Platform/Platform";
import { Dashboard } from "./Pages/Dashboard/Dashboard";
import { ProtectedRoute } from "./Components/ProtectedRoute";
import { TeamGuard } from "./Components/TeamGuard";
import { TeamLobby } from "./Pages/Team/TeamLobby";
import { UserProfile } from "./Pages/Profile/UserProfile";

function App() {
  const { pathname } = useLocation();
  const isAuthPage =
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/dashboard" ||
    pathname === "/profile" ||
    pathname === "/onboarding" ||
    pathname === "/forgot-password";

  return (
    <>
      {!isAuthPage && <Header />}
      <Routes>
        <Route path="/" element={<Platform />} />
        <Route path="/open-source" element={<OpenSource />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<TeamLobby />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route element={<TeamGuard />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
      {!isAuthPage && <Footer />}
    </>
  );
}

export default App;
