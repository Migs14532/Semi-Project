import { GoogleGenAI } from "@google/genai";
import supabase from "./supabase";

// ✅ Initialize Gemini AI using @google/genai
const ai = new GoogleGenAI({ apiKey: "", });

/**
 * Analyzes student performance for a specific subject using Gemini AI
 * @param {string} subjectId - The UUID of the subject to analyze
 * @returns {Promise<Object>} - Analysis result with passed/failed students
 */
export async function studentsAnalyzer(subjectId) {
  try {
    // 1️⃣ Fetch subject details
    const { data: subjectData, error: subjectError } = await supabase
      .from("subjects")
      .select("*")
      .eq("id", subjectId)
      .single();

    if (subjectError) throw subjectError;

    // 2️⃣ Fetch grades for this subject
    const { data: gradesData, error: gradesError } = await supabase
      .from("grades")
      .select(`
        *,
        students (
          id,
          student_number,
          first_name,
          last_name,
          course,
          year_level
        )
      `)
      .eq("subject_id", subjectId);

    if (gradesError) throw gradesError;

    if (!gradesData || gradesData.length === 0) {
      return {
        success: true,
        analysis: "No grades available for this subject.",
        passedStudents: [],
        failedStudents: [],
      };
    }

    // 3️⃣ Format student data (college grading: 1.0–5.0, passing ≤ 3.0)
    const studentsWithGrades = gradesData.map((grade) => {
      const student = grade.students;
      const scores = {
        prelim: grade.prelim || 0,
        midterm: grade.midterm || 0,
        semifinal: grade.semifinal || 0,
        final: grade.final || 0,
      };

      const validScores = Object.values(scores).filter((s) => s > 0);
      const average =
        validScores.length > 0
          ? validScores.reduce((a, b) => a + b, 0) / validScores.length
          : 0;

      return {
        studentNumber: student.student_number,
        name: `${student.first_name} ${student.last_name}`,
        course: student.course,
        yearLevel: student.year_level,
        scores,
        average: average.toFixed(2),
        status: average <= 3.0 ? "PASSED" : "FAILED",
      };
    });

    // 4️⃣ Prepare data string
    const dataString = `
Subject: ${subjectData.subject_code} - ${subjectData.subject_name}
Instructor: ${subjectData.instructor || "N/A"}
Total Students: ${studentsWithGrades.length}

Student Performance Data:
${studentsWithGrades
  .map(
    (s, i) => `
${i + 1}. ${s.name} (${s.studentNumber})
   Course: ${s.course}, Year: ${s.yearLevel}
   Prelim: ${s.scores.prelim}, Midterm: ${s.scores.midterm}, Semifinal: ${s.scores.semifinal}, Final: ${s.scores.final}
   Average: ${s.average} - ${s.status}`
  )
  .join("\n")}

Passing Grade: ≤ 3.0 (College Grading System)
1.0 = Excellent | 3.0 = Passing | 5.0 = Failed
`;

    // 5️⃣ Generate AI analysis using @google/genai
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are an educational data analyst. Analyze the following student grade data using the **college grading scale (1.0–5.0)** where **1.0 = highest** and **3.0 = passing**.

${dataString}

Please respond ONLY in valid JSON using this structure:
{
  "analysis": "Detailed summary of performance, strengths, weaknesses, and trends.",
  "passedStudents": ["Names of students who passed (average ≤ 3.0)"],
  "failedStudents": ["Names of students who failed (average > 3.0)"],
  "classStatistics": {
    "classAverage": "Overall class average (1.0–5.0 scale)",
    "highestScore": "Lowest numeric average (best student)",
    "lowestScore": "Highest numeric average (lowest performer)",
    "passRate": "Percentage of students who passed"
  },
  "recommendations": ["3–5 concrete recommendations for the instructor"]
}
Return ONLY valid JSON — no markdown, explanations, or extra text.
              `,
            },
          ],
        },
      ],
    });

    // 6️⃣ Extract and clean AI response
    const text = response.output_text || response.text || "";
    const cleaned = text.replace(/```json|```/g, "").trim();

    let aiAnalysis;
    try {
      aiAnalysis = JSON.parse(cleaned);
    } catch {
      console.warn("⚠️ AI returned invalid JSON, using fallback analysis.");
      aiAnalysis = createFallbackAnalysis(studentsWithGrades, subjectData);
    }

    // 7️⃣ Return final structured result
    return {
      success: true,
      subject: {
        code: subjectData.subject_code,
        name: subjectData.subject_name,
        instructor: subjectData.instructor || "N/A",
      },
      ...aiAnalysis,
    };
  } catch (error) {
    console.error("❌ Error in studentsAnalyzer:", error);
    return {
      success: false,
      analysis: "Failed to generate analysis. Please try again.",
      passedStudents: [],
      failedStudents: [],
    };
  }
}

/**
 * 🧩 Fallback analysis when Gemini returns invalid JSON
 */
function createFallbackAnalysis(studentsWithGrades, subjectData) {
  const passed = studentsWithGrades.filter((s) => parseFloat(s.average) <= 3.0);
  const failed = studentsWithGrades.filter((s) => parseFloat(s.average) > 3.0);

  const averages = studentsWithGrades.map((s) => parseFloat(s.average));
  const classAverage =
    averages.reduce((a, b) => a + b, 0) / averages.length || 0;
  const highestScore = Math.min(...averages); // best (lowest)
  const lowestScore = Math.max(...averages); // worst (highest)
  const passRate = (passed.length / studentsWithGrades.length) * 100;

  return {
    analysis: `For ${subjectData.subject_code}, ${studentsWithGrades.length} students were analyzed. The class average is ${classAverage.toFixed(
      2
    )}. ${passed.length} passed (${passRate.toFixed(
      1
    )}%), while ${failed.length} did not meet the passing requirement (3.0).`,
    passedStudents: passed.map((s) => s.name),
    failedStudents: failed.map((s) => s.name),
    classStatistics: {
      classAverage: classAverage.toFixed(2),
      highestScore: highestScore.toFixed(2),
      lowestScore: lowestScore.toFixed(2),
      passRate: passRate.toFixed(1) + "%",
    },
    recommendations: [
      "Offer remedial classes for students near the failing mark.",
      "Highlight best-performing students to encourage motivation.",
      "Review teaching strategies for topics with low performance.",
      "Encourage consistent study habits and attendance.",
    ],
  };
}

