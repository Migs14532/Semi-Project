import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PDFViewer } from "@react-pdf/renderer";
import supabase from "../lib/supabase";
import { studentsAnalyzer } from "../lib/ai";
import StudentReportDocument from "../pdfTemplates/StudentReportDocument";
import toast from "react-hot-toast";

export default function Grades() {
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiReport, setAiReport] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (subject) {
      fetchStudentsAndGrades();
      setAiReport(null);
    } else {
      setGrades([]);
    }
  }, [subject]);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .order("subject_code", { ascending: true });
      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Error loading subjects: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsAndGrades = async () => {
    setLoading(true);
    try {
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("*")
        .order("student_number", { ascending: true });
      if (studentError) throw studentError;

      const { data: gradeData, error: gradeError } = await supabase
        .from("grades")
        .select("*")
        .eq("subject_id", subject);
      if (gradeError) throw gradeError;

      const gradeMap = {};
      (gradeData || []).forEach((grade) => {
        gradeMap[grade.student_id] = grade;
      });

      const combinedData = (studentData || []).map((student) => {
        const existingGrade = gradeMap[student.id];
        return {
          student_id: student.id,
          grade_id: existingGrade?.id || null,
          name: `${student.first_name} ${student.last_name}`,
          student_number: student.student_number,
          prelim: existingGrade?.prelim || "",
          midterm: existingGrade?.midterm || "",
          semifinal: existingGrade?.semifinal || "",
          final: existingGrade?.final || "",
        };
      });

      setStudents(studentData || []);
      setGrades(combinedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error loading data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...grades];
    updated[index][field] = value;
    setGrades(updated);
  };

  const handleSave = async () => {
    if (!subject) {
      toast.error("Please select a subject first!");
      return;
    }
    setLoading(true);
    try {
      const updates = [];
      const inserts = [];

      grades.forEach((grade) => {
        const gradeData = {
          student_id: grade.student_id,
          subject_id: subject,
          prelim: grade.prelim ? parseFloat(grade.prelim) : null,
          midterm: grade.midterm ? parseFloat(grade.midterm) : null,
          semifinal: grade.semifinal ? parseFloat(grade.semifinal) : null,
          final: grade.final ? parseFloat(grade.final) : null,
        };

        if (grade.grade_id) {
          updates.push(
            supabase.from("grades").update(gradeData).eq("id", grade.grade_id)
          );
        } else {
          inserts.push(gradeData);
        }
      });

      await Promise.all(updates);
      if (inserts.length > 0) {
        const { error: insertError } = await supabase
          .from("grades")
          .insert(inserts);
        if (insertError) throw insertError;
      }

      toast.success("Grades saved successfully!");
      await fetchStudentsAndGrades();
    } catch (error) {
      console.error("Error saving grades:", error);
      toast.error("Error saving grades: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAIReport = async () => {
    if (!subject) {
      toast.error("Please select a subject first!");
      return;
    }
    setLoading(true);
    try {
      const report = await studentsAnalyzer(subject);
      if (!report.success) throw new Error(report.analysis);
      setAiReport(report);
    } catch (error) {
      console.error("AI analysis error:", error);
      toast.error("Failed to generate AI report: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ College grading: 1.0 (best) to 5.0 (fail)
  const calculateAverage = (student) => {
    const scores = [
      student.prelim,
      student.midterm,
      student.semifinal,
      student.final,
    ]
      .filter((s) => s !== "")
      .map((s) => parseFloat(s));
    if (scores.length === 0) return "-";
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return avg.toFixed(2);
  };

  // ✅ Determine color based on grade (1.0 = best)
  const getGradeColor = (avg) => {
    const g = parseFloat(avg);
    if (isNaN(g)) return "bg-gray-200 text-gray-600";
    if (g <= 1.25) return "bg-green-600 text-white"; // Excellent
    if (g <= 1.75) return "bg-green-500 text-white"; // Very Good
    if (g <= 2.25) return "bg-yellow-400 text-black"; // Good
    if (g <= 2.75) return "bg-orange-400 text-black"; // Fair
    if (g <= 3.0) return "bg-orange-500 text-white"; // Passed
    return "bg-red-600 text-white"; // Failed
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white p-8 rounded-t-3xl shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Grade Management</h1>
              <p className="text-gray-300 text-sm">
                Track and analyze student performance
              </p>
            </div>
            <Link
              to="/"
              className="text-white hover:text-gray-300 font-medium transition-colors px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-black"
            >
              ← Back to Home
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
              disabled={loading}
            >
              <option value="">-- Choose a Subject --</option>
              {subjects.map((subj) => (
                <option key={subj.id} value={subj.id}>
                  {subj.subject_code} - {subj.subject_name}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : !subject ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl">
              <p className="text-gray-500 text-lg">No subject selected</p>
              <p className="text-gray-400 text-sm mt-2">
                Please select a subject from the dropdown above
              </p>
            </div>
          ) : (
            <>
              {/* Grades Table */}
              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-lg">
                <table className="w-full">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="p-4 text-left">Student Number</th>
                      <th className="p-4 text-left">Student Name</th>
                      <th className="p-4 text-center">Prelim</th>
                      <th className="p-4 text-center">Midterm</th>
                      <th className="p-4 text-center">Semifinal</th>
                      <th className="p-4 text-center">Final</th>
                      <th className="p-4 text-center bg-gray-800">Average</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {grades.map((student, i) => {
                      const avg = calculateAverage(student);
                      return (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="p-4 font-medium text-gray-900">
                            {student.student_number}
                          </td>
                          <td className="p-4 font-semibold text-gray-900">
                            {student.name}
                          </td>
                          {["prelim", "midterm", "semifinal", "final"].map(
                            (term) => (
                              <td key={term} className="p-4 text-center">
                                <input
                                  type="number"
                                  min="1.0"
                                  max="5.0"
                                  step="0.25"
                                  value={student[term]}
                                  onChange={(e) =>
                                    handleChange(i, term, e.target.value)
                                  }
                                  className="border-2 border-gray-300 rounded-lg p-2 w-20 text-center font-medium focus:border-black"
                                  disabled={loading}
                                />
                              </td>
                            )
                          )}
                          <td className="p-4 text-center">
                            <span
                              className={`inline-block px-4 py-2 rounded-lg font-bold ${getGradeColor(
                                avg
                              )}`}
                            >
                              {avg}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex flex-wrap justify-end gap-4">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg font-medium disabled:opacity-50"
                  disabled={loading}
                >
                  💾 Save Grades
                </button>
                <button
                  onClick={handleAIReport}
                  className="px-6 py-3 bg-white text-black border-2 border-black rounded-xl hover:bg-black hover:text-white transition-all duration-300 shadow-lg font-medium disabled:opacity-50"
                  disabled={loading}
                >
                  🤖 Generate AI Analysis Report
                </button>
              </div>

              {/* PDF Viewer */}
              {aiReport && (
                <div className="mt-10 border-t pt-8">
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    AI Analysis Report
                  </h3>
                  <PDFViewer width="100%" height="600">
                    <StudentReportDocument report={aiReport} />
                  </PDFViewer>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
