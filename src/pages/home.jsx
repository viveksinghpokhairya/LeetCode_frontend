import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../slicers/slice";
import { useNavigate } from "react-router";

function Homepage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  console.log(user);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get("/question/all");
        setProblems(data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get("/question/getAllProblemsSolved");
        console.log("Solved problems:", data);
        setSolvedProblems(data || []);
      } catch (error) {
        console.error("Error fetching solved problems:", error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch =
      filters.difficulty === "all" || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === "all" || problem.tags === filters.tag;

    let statusMatch = true;
    if (filters.status === "solved") {
      statusMatch = solvedProblems.includes(problem._id);
    } else if (filters.status === "unsolved") {
      statusMatch = !solvedProblems.includes(problem._id);
    }

    return difficultyMatch && tagMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-800 to-blue-950 py-28 px-6 md:px-30 lg:px-60 text-white">
      {/* Navigation Bar */}
      <nav className="navbar relative z-50 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl px-6 py-3 flex justify-between items-center">
        <div className="flex-1">
          <NavLink
            to="/"
            className="text-3xl font-extrabold bg-orange-600  bg-clip-text text-transparent drop-shadow-lg"
          >
            LeetCode
          </NavLink>
        </div>
        <div className="flex-none gap-4">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              className="btn text-white font-semibold backdrop-blur-lg bg-white/20 hover:bg-white/30 border border-white/30 shadow-lg rounded-xl py-1 px-5 transition duration-300 ease-in-out"
            >
              {user?.name}
            </div>
            <ul
              className="mt-3 p-3 shadow-2xl menu menu-sm dropdown-content 
              bg-white/20 backdrop-blur-2xl rounded-2xl w-56 border border-white/30 
              absolute z-10 text-white font-medium"
            >
              {user.user === "admin" && (
                <li>
                  <button
                    onClick={() => navigate("/admin")}
                    className="hover:bg-white/30 rounded-lg px-2 py-1 transition"
                  >
                    Admin
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:bg-red-500/40 rounded-lg px-2 py-1 transition"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto mt-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-10 justify-center">
          <select
            className="select select-bordered bg-white/10 backdrop-blur-lg border border-white/30 text-white rounded-xl shadow-lg"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved Problems</option>
            <option value="unsolved">Unsolved Problems</option>
          </select>

          <select
            className="select select-bordered bg-white/10 backdrop-blur-lg border border-white/30 text-white rounded-xl shadow-lg"
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            className="select select-bordered bg-white/10 backdrop-blur-lg border border-white/30 text-white rounded-xl shadow-lg"
            value={filters.tag}
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
          >
            <option value="all">All Tags</option>
            <option value="array">Array</option>
            <option value="linked list">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
            <option value="string">String</option>
          </select>
        </div>

        {/* Problems List */}
        <div className="grid rounded-2xl overflow-hidden">
          {filteredProblems.map((problem) => (
            <div
              key={problem._id}
              className=" bg-white/10 backdrop-blur-xl shadow-xl border border-white/20 hover:scale-[1.02] transition duration-300 ease-in-out"
            >
              <div className="card-body text-white">
                <div className="flex items-center justify-between">
                  <h2 className="card-title text-xl font-semibold">
                    <NavLink
                      to={`question/${problem._id}`}
                      className="hover:text-yellow-300 transition"
                    >
                      {problem.title}
                    </NavLink>
                  </h2>
                  {solvedProblems.includes(problem._id) && (
                    <div className="badge badge-success bg-green-500/40 text-white border-none shadow-md backdrop-blur-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Solved
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-2">
                  <div
                    className={`badge ${getDifficultyBadgeColor(
                      problem.difficulty
                    )} bg-opacity-40 backdrop-blur-md border-none shadow-md`}
                  >
                    {problem.difficulty}
                  </div>
                  <div className="badge badge-info bg-sky-500/40 border-none backdrop-blur-md shadow-md">
                    {problem.tags}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-green-500/40 text-white";
    case "medium":
      return "bg-yellow-500/40 text-white";
    case "hard":
      return "bg-red-500/40 text-white";
    default:
      return "bg-gray-500/40 text-white";
  }
};

export default Homepage;