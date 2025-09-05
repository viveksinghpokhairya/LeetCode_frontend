import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";

function UpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestion() {
      try {
        const res = await axiosClient.get(`/question/admin/${id}`);
        setQuestion(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    fetchQuestion();
  }, [id]);

  const handleChange = (field, value) => {
    setQuestion((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, key, value) => {
    setQuestion((prev) => {
      const updated = [...prev[field]];
      updated[index][key] = value;
      return { ...prev, [field]: updated };
    });
  };

  const addArrayItem = (field, template) => {
    setQuestion((prev) => ({
      ...prev,
      [field]: [...prev[field], template],
    }));
  };

  const removeArrayItem = (field, index) => {
    setQuestion((prev) => {
      const updated = [...prev[field]];
      updated.splice(index, 1);
      return { ...prev, [field]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(question);
      await axiosClient.post(`/problem/update/${id}`, question);
      alert("Question updated successfully!");
      navigate("/"); // redirect after update
    } catch (err) {
      console.error(err);
      alert("Failed to update question");
    }
  };

  if (loading) return <p className="text-center text-white">Loading...</p>;
  if (!question) return <p className="text-center text-red-400">Question not found</p>;

  return (
    <div className="min-h-screen px-6 py-12 flex justify-center bg-gradient-to-br from-gray-950 via-gray-800 to-blue-950">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-10">
        <h1 className="text-3xl font-extrabold text-white mb-8 text-center drop-shadow-md">
           Update Question
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <input
            type="text"
            value={question.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Title"
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Description */}
          <textarea
            value={question.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Description"
            className="w-full h-28 px-4 py-3 rounded-xl bg-white/20 text-white border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Difficulty */}
          <select
            value={question.difficulty}
            onChange={(e) => handleChange("difficulty", e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="easy" className="text-black">Easy</option>
            <option value="medium" className="text-black">Medium</option>
            <option value="hard" className="text-black">Hard</option>
          </select>

          {/* Tags */}
          <input
            type="text"
            value={question.tags}
            onChange={(e) => handleChange("tags", e.target.value)}
            placeholder="Tags"
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Visible Test Cases */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Visible Test Cases</h2>
            {question.visibleTestCases.map((tc, i) => (
              <div
                key={tc._id || i}
                className="flex flex-wrap gap-3 items-center bg-white/10 p-4 rounded-xl border border-white/20 shadow-md mb-3"
              >
                <input
                  type="text"
                  value={tc.input}
                  onChange={(e) =>
                    handleArrayChange("visibleTestCases", i, "input", e.target.value)
                  }
                  placeholder="Input"
                  className="flex-1 px-3 py-2 rounded-lg bg-white/20 text-white border border-white/30 placeholder-gray-300"
                />
                <input
                  type="text"
                  value={tc.output}
                  onChange={(e) =>
                    handleArrayChange("visibleTestCases", i, "output", e.target.value)
                  }
                  placeholder="Output"
                  className="flex-1 px-3 py-2 rounded-lg bg-white/20 text-white border border-white/30 placeholder-gray-300"
                />
                <input
                  type="text"
                  value={tc.explanation}
                  onChange={(e) =>
                    handleArrayChange("visibleTestCases", i, "explanation", e.target.value)
                  }
                  placeholder="Explanation"
                  className="flex-1 px-3 py-2 rounded-lg bg-white/20 text-white border border-white/30 placeholder-gray-300"
                />
                <button
                  type="button"
                  className="px-3 py-1 text-red-400 font-semibold hover:text-red-500"
                  onClick={() => removeArrayItem("visibleTestCases", i)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="text-blue-400 hover:text-blue-500 font-semibold"
              onClick={() =>
                addArrayItem("visibleTestCases", { input: "", output: "", explanation: "" })
              }
            >
              + Add Test Case
            </button>
          </div>

          {/* Hidden Test Cases */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Hidden Test Cases</h2>
            {question.hiddenTestCases.map((tc, i) => (
              <div
                key={tc._id || i}
                className="flex flex-wrap gap-3 items-center bg-white/10 p-4 rounded-xl border border-white/20 shadow-md mb-3"
              >
                <input
                  type="text"
                  value={tc.input}
                  onChange={(e) =>
                    handleArrayChange("hiddenTestCases", i, "input", e.target.value)
                  }
                  placeholder="Input"
                  className="flex-1 px-3 py-2 rounded-lg bg-white/20 text-white border border-white/30 placeholder-gray-300"
                />
                <input
                  type="text"
                  value={tc.output}
                  onChange={(e) =>
                    handleArrayChange("hiddenTestCases", i, "output", e.target.value)
                  }
                  placeholder="Output"
                  className="flex-1 px-3 py-2 rounded-lg bg-white/20 text-white border border-white/30 placeholder-gray-300"
                />
                <button
                  type="button"
                  className="px-3 py-1 text-red-400 font-semibold hover:text-red-500"
                  onClick={() => removeArrayItem("hiddenTestCases", i)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="text-blue-400 hover:text-blue-500 font-semibold"
              onClick={() =>
                addArrayItem("hiddenTestCases", { input: "", output: "" })
              }
            >
              + Add Hidden Test Case
            </button>
          </div>

          {/* Starter Code */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Starter Code</h2>
            {question.starterCode.map((sc, i) => (
              <div
                key={sc._id || i}
                className="bg-white/10 p-4 rounded-xl border border-white/20 shadow-md mb-3"
              >
                <input
                  type="text"
                  value={sc.language}
                  onChange={(e) =>
                    handleArrayChange("starterCode", i, "language", e.target.value)
                  }
                  placeholder="Language"
                  className="w-full mb-2 px-3 py-2 rounded-lg bg-white/20 text-white border border-white/30 placeholder-gray-300"
                />
                <textarea
                  value={sc.initialCode}
                  onChange={(e) =>
                    handleArrayChange("starterCode", i, "initialCode", e.target.value)
                  }
                  placeholder="Starter Code"
                  className="w-full h-28 px-3 py-2 rounded-lg bg-white/20 text-white border border-white/30 placeholder-gray-300"
                />
              </div>
            ))}
          </div>

          {/* Solutions */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Solutions</h2>
            {question.Solution.map((sol, i) => (
              <div
                key={sol._id || i}
                className="bg-white/10 p-4 rounded-xl border border-white/20 shadow-md mb-3"
              >
                <input
                  type="text"
                  value={sol.language}
                  onChange={(e) =>
                    handleArrayChange("Solution", i, "language", e.target.value)
                  }
                  placeholder="Language"
                  className="w-full mb-2 px-3 py-2 rounded-lg bg-white/20 text-white border border-white/30 placeholder-gray-300"
                />
                <textarea
                  value={sol.completeCode}
                  onChange={(e) =>
                    handleArrayChange("Solution", i, "completeCode", e.target.value)
                  }
                  placeholder="Complete Code"
                  className="w-full h-28 px-3 py-2 rounded-lg bg-white/20 text-white border border-white/30 placeholder-gray-300"
                />
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:shadow-green-500/40 transition-all duration-300"
            >
               Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdatePage;
