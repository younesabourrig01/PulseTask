import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectCurrentUser } from "../features/auth/authSlice";
import { useTeamInfoQuery } from "../features/team/teamApiSlice";

export const TeamGuard = ({ children }) => {
  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  const { data: teamData, isLoading } = useTeamInfoQuery(undefined, {
    skip: !user,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1117] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400">Checking team context...</p>
        </div>
      </div>
    );
  }

  const hasTeam = Boolean(user?.team_id || (teamData && teamData.has_team));

  if (!hasTeam) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default TeamGuard;
