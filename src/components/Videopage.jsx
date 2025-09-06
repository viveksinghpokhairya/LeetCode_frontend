import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { NavLink } from "react-router";

const AdminVideopage = () => {
  console.log("video page is called");
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get("/question/all");
      setProblems(data);
    } catch (err) {
      setError("Failed to fetch problems");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const videoDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?"))
      return;

    try {
      await axiosClient.delete(`/video/delete/${id}`);
      setProblems(problems.filter((problem) => problem._id !== id));
    } catch (err) {
      setError(err);
      console.error("this is the error we are getting", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-white"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-6 p-4 rounded-2xl bg-red-500/20 text-red-300 border border-red-400/40 backdrop-blur-lg shadow-lg">
        <div className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 
              2l2 2m7-2a9 9 0 11-18 
              0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error.response.data.error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-blue-950 via-gray-800 to-purple-950 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-white drop-shadow-lg mb-10">
        Video Solutions
      </h1>

      <div className="w-full max-w-6xl rounded-4xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/10 text-white text-xl">
            <tr>
              <th className="px-6 py-4">S no.</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Difficulty</th>
              <th className="px-6 py-4">Tags</th>
              <th className="px-6 py-4 text-center">Actions</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-white/90">
            {problems.map((problem, index) => (
              <tr
                key={problem._id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{problem.title}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-xl text-sm font-semibold border 
                    ${
                      problem.difficulty.toLowerCase() === "easy"
                        ? "bg-green-300/30 text-green-400 border-green-500/50"
                        : problem.difficulty.toLowerCase() === "medium"
                        ? "bg-yellow-300/30 text-yellow-400 border-yellow-500/50"
                        : "bg-red-300/30 text-red-400 border-red-500/50"
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-xl text-sm bg-white/20 text-white border border-white/30">
                    {problem.tags}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <NavLink
                    to={`/admin/video/update/${problem._id}`}
                    className={`btn btn-wide px-4 py-2 rounded-4xl font-semibold 
                    bg-gradient-to-r from-blue-800 to-gray-600 
                    text-white shadow-lg hover:shadow-blue-500/50 
                    hover:scale-105 transition-all duration-300`}
                  >
                    Upload
                  </NavLink>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => videoDelete(problem._id)}
                    className=" btn-wide px-4 py-2 rounded-4xl font-semibold 
                    bg-gradient-to-r from-red-500 to-pink-900 
                    text-white shadow-lg hover:shadow-red-500/50 
                    hover:scale-105 transition-all duration-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminVideopage;
