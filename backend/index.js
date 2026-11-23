const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "student_db"
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err);
        return;
    }
    console.log("MySQL Connected!");
});

// 1. GET - Display all students
app.get("/students", (req, res) => {
    db.query("SELECT * FROM students", (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching students" });
        }
        res.json(results);
    });
});

// 2. POST - Add a student
app.post("/students", (req, res) => {
    const { name, email } = req.body;

    db.query(
        "INSERT INTO students (name, email) VALUES (?, ?)",
        [name, email],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Error adding student" });
            }
            res.json({ message: "Student added successfully!", id: result.insertId });
        }
    );
});

// 3. PUT - Update a student
app.put("/students/:id", (req, res) => {
    const { name, email } = req.body;
    const { id } = req.params;

    db.query(
        "UPDATE students SET name = ?, email = ? WHERE id = ?",
        [name, email, id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Error updating student" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Student not found" });
            }

            res.json({ message: "Student updated successfully!" });
        }
    );
});

// 4. DELETE - Delete a student
app.delete("/students/:id", (req, res) => {
    const { id } = req.params;

    db.query(
        "DELETE FROM students WHERE id = ?",
        [id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Error deleting student" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Student not found" });
            }

            res.json({ message: "Student deleted successfully!" });
        }
    );
});

// Start Server
app.listen(3001, () => {
    console.log("Server running on port 3001");
});
