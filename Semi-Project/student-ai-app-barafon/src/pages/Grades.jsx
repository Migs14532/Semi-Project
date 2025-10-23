import { useState } from "react";
import { Link } from "react-router-dom";

export default function Grades() {
  const [subject, setSubject] = useState("");
  const [grades, setGrades] = useState([
    { name: "Juan Dela Cruz", prelim: "", midterm: "", semifinal: "", final: "" },
    { name: "Maria Santos", prelim: "", midterm: "", semifinal: "", final: "" },
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...grades];
    updated[index][field] = value;
    setGrades(updated);
  };

  const handleSave = () => {
    alert("Grades saved successfully!");
  };

  const handleAIReport = () => {
    alert("AI Analysis Report generated! 🚀");
  };

  const calculateAverage = (student) => {
    const scores = [student.prelim, student.midterm, student.semifinal, student.final]
      .filter(score => score !== "")
      .map(score => parseFloat(score));
    if (scores.length === 0) return "-";
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return avg.toFixed(2);
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white p-8 rounded-t-3xl shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Grade Management</h1>
              <p className="text-gray-300 text-sm">Track and analyze student performance</p>
            </div>
            <Link
              to="/"
              className="text-white hover:text-gray-300 font-medium transition-colors px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-black"
            >
               Back to Home
            </Link>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white p-8 rounded-b-3xl shadow-xl border-x border-b border-gray-200">
          {/* Subject Selection */}
          <div className="mb-8 bg-gray-50 p-6 rounded-2xl border-2 border-gray-200">
            <label className="block mb-3 font-semibold text-gray-800 text-lg">
              Select Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border-2 border-gray-300 p-3 rounded-xl w-full focus:border-black focus:outline-none transition-colors font-medium"
            >
              <option value="">-- Choose a Subject --</option>
              <option value="IT101">IT101 - Introduction to IT</option>
              <option value="WEBDEV">WEBDEV - Web Development</option>
              <option value="DBSYS">DBSYS - Database Systems</option>
            </select>
          </div>

          {/* Grades Table */}
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-lg">
            <table className="w-full">
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-4 text-left font-semibold">Student Name</th>
                  <th className="p-4 text-center font-semibold">Prelim</th>
                  <th className="p-4 text-center font-semibold">Midterm</th>
                  <th className="p-4 text-center font-semibold">Semifinal</th>
                  <th className="p-4 text-center font-semibold">Final</th>
                  <th className="p-4 text-center font-semibold bg-gray-800">Average</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {grades.map((student, i) => {
                  const avg = calculateAverage(student);
                  const avgNum = parseFloat(avg);
                  return (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-semibold text-gray-900">{student.name}</td>
                      {["prelim", "midterm", "semifinal", "final"].map((term) => (
                        <td key={term} className="p-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={student[term]}
                            onChange={(e) => handleChange(i, term, e.target.value)}
                            className="border-2 border-gray-300 rounded-lg p-2 w-20 text-center font-medium focus:border-black focus:outline-none transition-colors"
                            placeholder="--"
                          />
                        </td>
                      ))}
                      <td className="p-4 text-center">
                        <span className={`inline-block px-4 py-2 rounded-lg font-bold ${
                          avg === "-" ? "bg-gray-200 text-gray-500" :
                          avgNum >= 90 ? "bg-black text-white" :
                          avgNum >= 80 ? "bg-gray-700 text-white" :
                          avgNum >= 75 ? "bg-gray-500 text-white" :
                          "bg-gray-300 text-gray-700"
                        }`}>
                          {avg}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap justify-end gap-4">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-0.5 font-medium"
            >
              💾 Save Grades
            </button>
            <button
              onClick={handleAIReport}
              className="px-6 py-3 bg-white text-black border-2 border-black rounded-xl hover:bg-black hover:text-white transition-all duration-300 shadow-lg font-medium"
            >
              🤖 Generate AI Analysis Report
            </button>
          </div>

          {/* Grading Scale Legend */}
          <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border-2 border-gray-200">
            <h3 className="font-bold text-lg mb-3 text-gray-800">Grading Scale</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black rounded"></div>
                <span className="text-sm font-medium">90-100: Excellent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-700 rounded"></div>
                <span className="text-sm font-medium">80-89: Very Good</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-500 rounded"></div>
                <span className="text-sm font-medium">75-79: Good</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                <span className="text-sm font-medium">Below 75: Needs Improvement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}