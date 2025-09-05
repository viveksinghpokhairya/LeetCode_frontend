import { Routes, Route, Navigate } from "react-router";
import HomePage from "./pages/home";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import QuestionCreation from "./pages/questionCreation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./slicers/slice";
import Admin from "./pages/Admin";
import ProblemPage from "./pages/problemPage";
import DeleteQuestion from "./components/deleteQuestion";
import UpdateQuestion from "./components/updateQuestion";
import QuestionUpdatingLogic from "./components/QuestionUpdatingLogic";

function App() {
  const dispatch = useDispatch();
  const slicedData = useSelector((state) => state.auth);
  
  const { isAuthenticated, user, loading } = slicedData;
  console.log(isAuthenticated);
  useEffect(() => {
    dispatch(checkAuth());
  }, []);
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/signup" />}
        ></Route>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        ></Route>
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <SignUp />}
        ></Route>
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/questioncreate" element={<QuestionCreation />} />
        <Route path="/admin/questiondelete" element={<DeleteQuestion />} />
        <Route path="/question/:problemId" element={<ProblemPage />}></Route>
        <Route path="/admin/updatequestion" element={<UpdateQuestion />} />
        <Route
          path="/admin/updatequestion/update/:id"
          element={<QuestionUpdatingLogic />}
        />
      </Routes>
    </>
  );
}

export default App;
