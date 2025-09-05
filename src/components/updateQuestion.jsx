import { useState, useEffect } from "react";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router";

function UpdateQuestion() {
  const navigate = useNavigate();
  const [AllQuestions, setAllQuestions] = useState([]);

  const fetchQuestions = async () => {
    try {
      const ans = await axiosClient.get("/question/all");
      setAllQuestions(ans.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  function updateQuestion(id) {
    try {
      navigate(`/admin/updatequestion/update/${id}`);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center gap-10 px-6 py-12 bg-gradient-to-br from-blue-950 via-gray-800 to-purple-950 ">
      <h1 className="font-extrabold text-5xl text-white drop-shadow-lg">
        Update Problems
      </h1>

      <div className="w-full max-w-5xl rounded-4xl bg-white/10 backdrop-blur-xl border border-white/30 shadow-xl overflow-hidden">
        {AllQuestions.map((element) => (
          <div
            key={element._id}
            className="flex items-center justify-between gap-6 p-6 
            bg-white/10  border border-white/20 shadow-lg
            hover:scale-[1.02] hover:shadow-2xl transition-all duration-300"
          >
            {/* Problem details */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
              <span className="text-lg font-semibold text-white">
                {element.title}
              </span>

              <span
                className={`px-3 py-1 rounded-xl text-sm font-semibold
                ${
                  element.difficulty === "easy"
                    ? "bg-green-300/30 text-green-400 border border-green-500/50"
                    : element.difficulty === "medium"
                    ? "bg-yellow-300/30 text-yellow-400 border border-yellow-500/50"
                    : "bg-red-300/30 text-red-400 border border-red-500/50"
                }`}
              >
                {element.difficulty}
              </span>

              <span className="px-3 py-1 rounded-xl text-sm bg-white/20 text-white border border-white/30">
                {element.tags}
              </span>
            </div>

            {/* Update button aligned to the right */}
            <button
              onClick={() => updateQuestion(element._id)}
              className="px-5 py-2 rounded-xl font-semibold 
              bg-gradient-to-r from-blue-500 to-purple-600 
              text-white shadow-lg hover:shadow-blue-500/50 
              hover:scale-105 transition-all duration-300"
            >
              Update
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UpdateQuestion;
