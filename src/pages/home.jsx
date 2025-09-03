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
  const [solvedProblems, setSolvedProblems] = useState([]); // this will hold array of IDs
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get("/question/all");
        setProblems(data); // array of { _id, title, difficulty, tags }
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get(
          "/question/getAllProblemsSolved"
        );
        console.log("Solved problems:", data);
        setSolvedProblems(data || []); // store array of IDs
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


  // Filtering logic
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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-600 to-purple-950 py-28 px-52">
      {/* Navigation Bar */}
      <nav className="navbar relative z-50 bg-white/20 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl px-4">
        <div className="flex-1">
          <NavLink
            to="/"
            className="btn btn-ghost text-2xl font-bold text-orange-500"
          >
            LeetCode
          </NavLink>
        </div>
        <div className="flex-none gap-4">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              className="btn text-white backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl rounded-xl py-0.5 px-5"
            >
              {user?.name}
            </div>
            <ul
              className="mt-5 p-2 shadow menu menu-sm dropdown-content 
              bg-white backdrop-blur-3xl rounded-xl w-52 border border-white/20 
              absolute z-10 text-black"
            >
              {user.user === "admin" && <li><button onClick={() => navigate("/admin")}>Admin</button></li>}
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto mt-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          <select
            className="select select-bordered bg-white/30 backdrop-blur-md border border-white/20 text-black"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved Problems</option>
            <option value="unsolved">Unsolved Problems</option>
          </select>

          <select
            className="select select-bordered bg-white/30 backdrop-blur-md border border-white/20 text-black"
            value={filters.difficulty}
            onChange={(e) =>
              setFilters({ ...filters, difficulty: e.target.value })
            }
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            className="select select-bordered bg-white/30 backdrop-blur-md border border-white/20 text-black"
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
        <div className="grid gap-4">
          {filteredProblems.map((problem) => (
            <div
              key={problem._id}
              className="card bg-white/20 backdrop-blur-md shadow-xl border border-white/20"
            >
              <div className="card-body text-white">
                <div className="flex items-center justify-between">
                  <h2 className="card-title">
                    <NavLink
                      to={`question/${problem._id}`}
                      className="hover:text-yellow-300"
                    >
                      {problem.title}
                    </NavLink>
                  </h2>
                  {solvedProblems.includes(problem._id) && (
                    <div className="badge badge-success gap-2">
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

                <div className="flex gap-2">
                  <div
                    className={`badge ${getDifficultyBadgeColor(
                      problem.difficulty
                    )}`}
                  >
                    {problem.difficulty}
                  </div>
                  <div className="badge badge-info">{problem.tags}</div>
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
      return "badge-success";
    case "medium":
      return "badge-warning";
    case "hard":
      return "badge-error";
    default:
      return "badge-neutral";
  }
};

export default Homepage;
