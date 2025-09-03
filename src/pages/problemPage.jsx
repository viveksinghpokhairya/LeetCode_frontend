import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router";
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionDetails";

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState("description");
  const [activeRightTab, setActiveRightTab] = useState("code");
  const editorRef = useRef(null);
  let { problemId } = useParams();

  const { handleSubmit } = useForm();

  // Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/question/${problemId}`);

        const initialCode =
          response.data.starterCode.find((sc) => {
            if (
              sc.language.toLowerCase() === "c++" &&
              selectedLanguage === "cpp"
            )
              return true;
            if (
              sc.language.toLowerCase() === "java" &&
              selectedLanguage === "java"
            )
              return true;
            if (
              sc.language.toLowerCase() === "python" &&
              selectedLanguage === "python"
            )
              return true;
            return false;
          })?.initialCode || "";

        setProblem(response.data);
        setCode(initialCode);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching problem:", error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  // Update code when language changes
  useEffect(() => {
    if (problem) {
      const initialCode =
        problem.starterCode.find((sc) => {
          if (sc.language.toLowerCase() === "c++" && selectedLanguage === "cpp")
            return true;
          if (
            sc.language.toLowerCase() === "java" &&
            selectedLanguage === "java"
          )
            return true;
          if (
            sc.language.toLowerCase() === "python" &&
            selectedLanguage === "python"
          )
            return true;
          return false;
        })?.initialCode || "";
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || "");
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);

    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        Solution: {
          language: selectedLanguage,
          completeCode: code,
        },
      });
      setRunResult(response.data);
      setLoading(false);
      setActiveRightTab("testcase");
    } catch (error) {
      console.error("Error running code:", error);
      setRunResult({
        success: false,
        error: "Internal server error",
      });
      setLoading(false);
      setActiveRightTab("testcase");
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);

    try {
      const response = await axiosClient.post(
        `/submission/submit/${problemId}`,
        {
          Solution: {
            language: selectedLanguage,
            completeCode: code,
          },
        }
      );

      setSubmitResult(response.data);
      setLoading(false);
      setActiveRightTab("result");
    } catch (error) {
      console.error("Error submitting code:", error);
      setSubmitResult(null);
      setLoading(false);
      setActiveRightTab("result");
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case "python":
        return "python";
      case "java":
        return "java";
      case "cpp":
        return "cpp";
      default:
        return "python";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "hard":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-900 via-gray-500 to-purple-950 text-white">
      {/* Left Panel */}
      <div className="w-1/2 flex flex-col border-r border-white/20 backdrop-blur-xl bg-white/10 shadow-lg rounded-2xl m-2">
        {/* Left Tabs */}
        <div className="tabs tabs-bordered bg-white/10 border-b border-white/20 rounded-t-2xl px-4">
          {["description", "editorial", "solutions", "submissions"].map((tab) => (
            <button
              key={tab}
              className={`tab text-sm font-medium ${
                activeLeftTab === tab
                  ? "tab-active text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-300"
              }`}
              onClick={() => setActiveLeftTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Left Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {problem && (
            <>
              {activeLeftTab === "description" && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-blue-300">
                      {problem.title}
                    </h1>
                    <div
                      className={`badge border border-white/20 ${getDifficultyColor(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty.charAt(0).toUpperCase() +
                        problem.difficulty.slice(1)}
                    </div>
                    <div className="badge border border-white/20 text-blue-400">
                      {Array.isArray(problem.tags)
                        ? problem.tags.join(", ")
                        : problem.tags}
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-200">
                      {problem.description}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-blue-300 mb-4">
                      Examples:
                    </h3>
                    <div className="space-y-4">
                      {problem.visibleTestCases.map((example, index) => (
                        <div
                          key={index}
                          className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 rounded-lg shadow-md"
                        >
                          <h4 className="font-semibold mb-2 text-blue-400">
                            Example {index + 1}:
                          </h4>
                          <div className="space-y-2 text-sm font-mono text-gray-200">
                            <div>
                              <strong>Input:</strong> {example.input}
                            </div>
                            <div>
                              <strong>Output:</strong> {example.output}
                            </div>
                            <div>
                              <strong>Explanation:</strong>{" "}
                              {example.explanation}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeLeftTab === "editorial" && (
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-xl font-bold mb-4 text-blue-300">
                    Editorial
                  </h2>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-200">
                    Editorial is here for the problem
                  </div>
                </div>
              )}

              {activeLeftTab === "solutions" && (
                <div>
                  <h2 className="text-xl font-bold mb-4 text-blue-300">
                    Solutions
                  </h2>
                  <div className="space-y-6">
                    {problem.Solution?.map((solution, index) => (
                      <div
                        key={index}
                        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-md"
                      >
                        <div className="px-4 py-2 border-b border-white/20 text-blue-300 font-semibold">
                          {problem?.title} - {solution?.language}
                        </div>
                        <div className="p-4">
                          <pre className="bg-gray-900/60 p-4 rounded text-sm overflow-x-auto text-gray-100">
                            <code>{solution?.completeCode}</code>
                          </pre>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-400">
                        Solutions will be available after you solve the problem.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeLeftTab === "submissions" && (
                <div>
                  <h2 className="text-xl font-bold mb-4 text-blue-300">
                    My Submissions
                  </h2>
                  <div className="text-gray-400">
                    <SubmissionHistory problemId={problemId} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl m-2">
        {/* Right Tabs */}
        <div className="tabs tabs-bordered bg-white/10 border-b border-white/20 rounded-t-2xl px-4">
          {["code", "testcase", "result"].map((tab) => (
            <button
              key={tab}
              className={`tab text-sm font-medium ${
                activeRightTab === tab
                  ? "tab-active text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-300"
              }`}
              onClick={() => setActiveRightTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col">
          {activeRightTab === "code" && (
            <div className="flex-1 flex flex-col">
              {/* Language Selector */}
              <div className="flex justify-between items-center p-4 border-b border-white/20">
                <div className="flex gap-2">
                  {["python", "java", "cpp"].map((lang) => (
                    <button
                      key={lang}
                      className={`btn btn-sm rounded-xl shadow-md ${
                        selectedLanguage === lang
                          ? "bg-blue-500/80 text-white"
                          : "bg-white/10 text-gray-200 border border-white/20 hover:bg-blue-400/30"
                      }`}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang === "cpp"
                        ? "C++"
                        : lang === "python"
                        ? "Python"
                        : "Java"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={getLanguageForMonaco(selectedLanguage)}
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    wordWrap: "on",
                    lineNumbers: "on",
                    glyphMargin: false,
                    folding: true,
                    lineDecorationsWidth: 10,
                    lineNumbersMinChars: 3,
                    renderLineHighlight: "line",
                    selectOnLineNumbers: true,
                    roundedSelection: true,
                    readOnly: false,
                    cursorStyle: "line",
                    mouseWheelZoom: true,
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-white/20 flex justify-between">
                <div className="flex gap-2">
                  <button
                    className="btn btn-sm bg-white/10 text-gray-200 border border-white/20 hover:bg-blue-400/30 rounded-xl"
                    onClick={() => setActiveRightTab("testcase")}
                  >
                    Console
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    className={`btn btn-sm bg-blue-400/30 text-white rounded-xl ${
                      loading ? "loading" : ""
                    }`}
                    onClick={handleRun}
                    disabled={loading}
                  >
                    Run
                  </button>
                  <button
                    className={`btn btn-sm bg-blue-500/80 text-white shadow-lg rounded-xl ${
                      loading ? "loading" : ""
                    }`}
                    onClick={handleSubmitCode}
                    disabled={loading}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Keep testcase and result tabs same but wrapped in glass cards */}
          {activeRightTab === "testcase" && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4 text-blue-300">Test Results</h3>
              {runResult ? (
                <div
                  className={`p-4 rounded-xl backdrop-blur-lg border border-white/20 ${
                    runResult.success ? "bg-green-500/20" : "bg-red-500/20"
                  }`}
                >
                  <div>
                    {runResult.success ? (
                      <div>
                        <h4 className="font-bold">✅ All test cases passed!</h4>
                        <p className="text-sm mt-2">Runtime: {runResult.runtime+" sec"}</p>
                        <p className="text-sm">Memory: {runResult.memory+" KB"}</p>
                        
                        <div className="mt-4 space-y-2">
                          {runResult.testCases.map((tc, i) => (
                            <div key={i} className="bg-base-100 p-3 rounded text-xs">
                              <div className="font-mono">
                                <div><strong>Input:</strong> {tc.stdin}</div>
                                <div><strong>Expected:</strong> {tc.expected_output}</div>
                                <div><strong>Output:</strong> {tc.stdout}</div>
                                <div className={'text-green-600'}>
                                  {'✓ Passed'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold">❌ Error</h4>
                        <div className="mt-4 space-y-2">
                          {runResult.testCases.map((tc, i) => (
                            <div key={i} className="bg-base-100 p-3 rounded text-xs">
                              <div className="font-mono">
                                <div><strong>Input:</strong> {tc.stdin}</div>
                                <div><strong>Expected:</strong> {tc.expected_output}</div>
                                <div><strong>Output:</strong> {tc.stdout}</div>
                                <div className={tc.status_id==3 ? 'text-green-600' : 'text-red-600'}>
                                  {tc.status_id==3 ? '✓ Passed' : '✗ Failed'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">
                  Click "Run" to test your code with the example test cases.
                </div>
              )}
            </div>
          )}

          {activeRightTab === "result" && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4 text-blue-300">
                Submission Result
              </h3>
              {submitResult ? (
                <div
                  className={`p-4 rounded-xl backdrop-blur-lg border border-white/20 ${
                    submitResult.accepted ? "bg-green-500/20" : "bg-red-500/20"
                  }`}
                >
                  <div>
                    {submitResult.accepted ? (
                      <div>
                        <h4 className="font-bold text-lg">🎉 Accepted</h4>
                        <div className="mt-4 space-y-2">
                          <p>Test Cases Passed: {submitResult.testCasesPassed}/{submitResult.testCasesTotal}</p>
                          <p>Runtime: {submitResult.runtime + " sec"}</p>
                          <p>Memory: {submitResult.memory + "KB"} </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold text-lg">❌ {submitResult.error}</h4>
                        <div className="mt-4 space-y-2">
                          <p>Test Cases Passed: {submitResult.testCasesPassed}/{submitResult.testCasesTotal}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">
                  Click "Submit" to submit your solution for evaluation.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
