
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API = "http://localhost:3001/students";

  // Fetch students
  const fetchStudents = async () => {
    try {
      const res = await axios.get(API);
      setStudents(res.data);
      setError("");
    } catch (err) {
      setError("Error loading students. Check the backend.");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Add or Update student
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.name.trim() || !form.email.trim()) {
      setError("Please enter both name and email.");
      return;
    }

    try {
      if (editId) {
        const res = await axios.put(`${API}/${editId}`, form);
        setMessage(res.data.message);
        setEditId(null);
      } else {
        const res = await axios.post(API, form);
        setMessage(res.data.message);
      }

      setForm({ name: "", email: "" });
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed.");
    }
  };

  // Select student for editing
  const handleEdit = (student) => {
    setForm({
      name: student.name,
      email: student.email
    });
    setEditId(student.id);
    setMessage("");
    setError("");
  };

  // Delete student
  const handleDelete = async (id) => {
    setMessage("");
    setError("");

    try {
      const res = await axios.delete(`${API}/${id}`);
      setMessage(res.data.message);
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting student.");
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditId(null);
    setForm({ name: "", email: "" });
    setMessage("");
    setError("");
  };

  return (
    <div className="App">
      <h1>Student Registration System</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Student Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Enter Student Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <button type="submit">
          {editId ? "Update Student" : "Add Student"}
        </button>

        {editId && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <h2>Student List</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>
                <button onClick={() => handleEdit(student)}>
                  Edit
                </button>

                <button onClick={() => handleDelete(student.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
