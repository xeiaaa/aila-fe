import { Route, useLocation, Navigate, Routes } from "react-router-dom";

import Home from "./pages/home";
import useLocalStorage from "./hooks/useLocalStorage";
import { TOKEN_KEY } from "./constants";
import Signin from "./pages/signin";
import Register from "./pages/register";
import Notes from "./pages/notes";
import Media from "./pages/media";
import Generate from "./pages/generate";
import Error from "./pages/error";

const RequireAuth = ({ children }) => {
  const location = useLocation();
  const [tokens] = useLocalStorage(TOKEN_KEY, null);
  if (!tokens) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  return children;
};

const CheckAuth = ({ children }) => {
  const location = useLocation();
  const [tokens] = useLocalStorage(TOKEN_KEY, null);

  if (tokens) {
    return <Navigate to="/notes" state={{ from: location }} replace />;
  }

  return children;
};

export default function App() {
  return (
    <Routes>
      <Route
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      >
        <Route path="/notes" element={<Notes />} />
        <Route path="/" element={<Notes />} />
        <Route path="/media" element={<Media />} />
        <Route path="/generate/:noteId" exact element={<Generate />} />
      </Route>

      <Route
        path="/signin"
        exact
        element={
          <CheckAuth>
            <Signin />
          </CheckAuth>
        }
      />
      <Route
        path="/register"
        exact
        element={
          <CheckAuth>
            <Register />
          </CheckAuth>
        }
      />

      <Route path="*" element={<Error />} />
    </Routes>
  );
}