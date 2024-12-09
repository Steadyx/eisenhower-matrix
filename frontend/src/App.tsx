import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "@components/auth/Register";
import Login from "@components/auth/Login";
import QuadrantContainer from "@components/quadrants/QuadrantContainer";
import GlobalContextMenu from "@components/context-menu";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import PrivateRoute from "@components/PrivateRoute";
import ThemeSwitcher from "@components/ThemeSwitcher"; // Import ThemeSwitcher
import { useEffect } from "react";

function App() {
  const auth = useSelector((state: RootState) => state.auth);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center justify-center w-full dark:bg-gray-800 bg-cyan-400 transition-colors">
        <div className="absolute top-4 right-4">
          <ThemeSwitcher />
        </div>

        <Routes>
          <Route
            path="/"
            element={<Navigate to={auth.token ? "/tasks" : "/login"} replace />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <QuadrantContainer />
              </PrivateRoute>
            }
          />
          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <GlobalContextMenu />
      </div>
    </Router>
  );
}

export default App;
