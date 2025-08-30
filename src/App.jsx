import { Routes, Route, Navigate } from "react-router";
import HomePage from "./pages/home";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./slicers/slice";

function App() {
  const dispatch = useDispatch();
  const slicedData = useSelector((state) => state.auth);
  const isAuthenticated = slicedData.isAuthenticated;
  useEffect(() => {
    dispatch(checkAuth());
  }, []);
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        ></Route>
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <SignUp />}
        ></Route>
      </Routes>
    </>
  );
}

export default App;
