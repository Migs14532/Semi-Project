import { useState } from "react";
import { Link } from "react-router-dom";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ code: "", title: "" });
  const [editingIndex, setEditingIndex] = useState(null);

  const handleOpenModal = (index = null) => {
    setEditingIndex(index);
    if (index !== null) setFormData(subjects[index]);
    else setFormData({ code: "", title: "" });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updated = [...subjects];
      updated[editingIndex] = formData;
      setSubjects(updated);
    } else {
      setSubjects([...subjects, formData]);
    }
    handleCloseModal();
  };

  const handleDelete = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-black text-white p-8 rounded-t-3xl shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Subject Management</h1>
              <p className="text-gray-300 text-sm">Organize and manage course subjects</p>
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
          <button
            onClick={() => handleOpenModal()}
            className="mb-6 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-0.5 font-medium"
          >
            + Add New Subject
          </button>

          {subjects.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              <p className="text-gray-500 text-lg">No subjects added yet</p>
              <p className="text-gray-400 text-sm mt-2">Click "Add New Subject" to get started</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
              <table className="w-full">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="p-4 text-left font-semibold">Subject Code</th>
                    <th className="p-4 text-left font-semibold">Subject Title</th>
                    <th className="p-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {subjects.map((subject, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-black">{subject.code}</td>
                      <td className="p-4 text-gray-700">{subject.title}</td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleOpenModal(i)}
                            className="px-4 py-2 bg-white text-black border-2 border-black rounded-lg hover:bg-black hover:text-white transition-all duration-300 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(i)}
                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-red-600 transition-all duration-300 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all">
            <form onSubmit={handleSubmit}>
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-gray-900 to-black text-white p-6 rounded-t-3xl">
                <h2 className="text-2xl font-bold">
                  {editingIndex !== null ? "Edit Subject" : "Add New Subject"}
                </h2>
                <p className="text-gray-300 text-sm mt-1">
                  {editingIndex !== null ? "Update subject information" : "Enter subject details below"}
                </p>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject Code</label>
                  <input
                    type="text"
                    name="code"
                    placeholder="e.g., IT101"
                    value={formData.code}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none transition-colors font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject Title</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g., Introduction to Programming"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 p-6 bg-gray-50 rounded-b-3xl">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-white text-black border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg font-medium"
                >
                  {editingIndex !== null ? "Update" : "Add Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}