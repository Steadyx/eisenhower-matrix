import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "@/components/auth/Register";
import Login from "@/components/auth/Login";
import QuadrantContainer from "@/components/quadrants/QuadrantContainer";
import GlobalContextMenu from "@/components/context-menu";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import PrivateRoute from "@/components/PrivateRoute";

function App() {
  const auth = useSelector((state: RootState) => state.auth);

  return (
    <Router>
      <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center w-full">
        <Routes>
          <Route
            path="/"
            element={auth.token ? <Navigate to="/tasks" /> : <Navigate to="/login" />}
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
        </Routes>
        <GlobalContextMenu />
      </div>
    </Router>
  );
}

export default App;
