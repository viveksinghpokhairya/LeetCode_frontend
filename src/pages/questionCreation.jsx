import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router";

// Zod schema matching the problem schema
const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.enum(["array", "linked list", "graph", "dp", "string"]),
  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        explanation: z.string().min(1, "Explanation is required"),
      })
    )
    .min(1, "At least one visible test case required"),
  hiddenTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "At least one hidden test case required"),
  starterCode: z
    .array(
      z.object({
        language: z.enum(["c++", "java", "python"]),
        initialCode: z.string().min(1, "Initial code is required"),
      })
    )
    .length(3, "All three languages required"),
  Solution: z
    .array(
      z.object({
        language: z.enum(["c++", "java", "python"]),
        completeCode: z.string().min(1, "Complete code is required"),
      })
    )
    .length(3, "All three languages required"),
});

function QuestionCreation() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      starterCode: [
        { language: "c++", initialCode: "" },
        { language: "java", initialCode: "" },
        { language: "python", initialCode: "" },
      ],
      Solution: [
        { language: "c++", completeCode: "" },
        { language: "java", completeCode: "" },
        { language: "python", completeCode: "" },
      ],
    },
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({
    control,
    name: "visibleTestCases",
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({
    control,
    name: "hiddenTestCases",
  });

  const onSubmit = async (data) => {
    try {
      console.log("problem creation called", data);
      await axiosClient.post("/problem/create", data);
      alert("Problem created successfully!");
      navigate("/");
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-900 via-gray-800 to-black p-8">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold text-center text-white mb-10 drop-shadow-lg">
          Create New Problem
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-10 backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-10"
        >
          {/* Basic Information */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Basic Information
            </h2>
            <div className="space-y-6">
              <div className="form-control">
                <label className="label text-white">Title</label>
                <input
                  {...register("title")}
                  className={`input w-full bg-white/10 text-white placeholder-gray-300 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                    errors.title && "border-red-500"
                  }`}
                />
                {errors.title && (
                  <span className="text-red-400 text-sm">
                    {errors.title.message}
                  </span>
                )}
              </div>

              <div className="form-control">
                <label className="label text-white">Description</label>
                <textarea
                  {...register("description")}
                  className={`textarea w-full bg-white/10 text-white placeholder-gray-300 border border-white/30 rounded-xl h-32 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                    errors.description && "border-red-500"
                  }`}
                />
                {errors.description && (
                  <span className="text-red-400 text-sm">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div className="flex gap-6">
                <div className="form-control w-1/2">
                  <label className="label text-white">Difficulty</label>
                  <select
                    {...register("difficulty")}
                    className="select w-full bg-white/10 text-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="form-control w-1/2">
                  <label className="label text-white">Tag</label>
                  <select
                    {...register("tags")}
                    className="select w-full bg-white/10 text-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="array">Array</option>
                    <option value="linked list">Linked List</option>
                    <option value="graph">Graph</option>
                    <option value="dp">DP</option>
                    <option value="string">String</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Test Cases */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Test Cases
            </h2>

            {/* Visible Test Cases */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-white">Visible Test Cases</h3>
                <button
                  type="button"
                  onClick={() =>
                    appendVisible({ input: "", output: "", explanation: "" })
                  }
                  className="px-4 py-1 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition"
                >
                  Add Visible Case
                </button>
              </div>

              {visibleFields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 space-y-2"
                >
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeVisible(index)}
                      className="px-3 py-1 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </div>

                  <input
                    {...register(`visibleTestCases.${index}.input`)}
                    placeholder="Input"
                    className="input w-full bg-white/10 text-white placeholder-gray-300 border border-white/30 rounded-lg"
                  />

                  <input
                    {...register(`visibleTestCases.${index}.output`)}
                    placeholder="Output"
                    className="input w-full bg-white/10 text-white placeholder-gray-300 border border-white/30 rounded-lg"
                  />

                  <textarea
                    {...register(`visibleTestCases.${index}.explanation`)}
                    placeholder="Explanation"
                    className="textarea w-full bg-white/10 text-white placeholder-gray-300 border border-white/30 rounded-lg"
                  />
                </div>
              ))}
            </div>

            {/* Hidden Test Cases */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-white">Hidden Test Cases</h3>
                <button
                  type="button"
                  onClick={() => appendHidden({ input: "", output: "" })}
                  className="px-4 py-1 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition"
                >
                  Add Hidden Case
                </button>
              </div>

              {hiddenFields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 space-y-2"
                >
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeHidden(index)}
                      className="px-3 py-1 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </div>

                  <input
                    {...register(`hiddenTestCases.${index}.input`)}
                    placeholder="Input"
                    className="input w-full bg-white/10 text-white placeholder-gray-300 border border-white/30 rounded-lg"
                  />

                  <input
                    {...register(`hiddenTestCases.${index}.output`)}
                    placeholder="Output"
                    className="input w-full bg-white/10 text-white placeholder-gray-300 border border-white/30 rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Code Templates */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Code Templates
            </h2>

            <div className="space-y-6">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 space-y-2"
                >
                  <h3 className="font-medium text-white">
                    {index === 0 ? "c++" : index === 1 ? "java" : "python"}
                  </h3>

                  <div className="form-control">
                    <label className="label text-white">Initial Code</label>
                    <textarea
                      {...register(`starterCode.${index}.initialCode`)}
                      className="w-full bg-white/10 text-white border border-white/30 rounded-lg font-mono p-3 font-black"
                      rows={6}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label text-white">Reference Solution</label>
                    <textarea
                      {...register(`Solution.${index}.completeCode`)}
                      className="w-full bg-white/10 text-white border border-white/30 rounded-lg font-mono p-3 font-black"
                      rows={6}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-xl hover:opacity-90 transition-all"
          >
            Create Problem
          </button>
        </form>
      </div>
    </div>
  );
}

export default QuestionCreation;
