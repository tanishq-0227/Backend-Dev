const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    gpa: Number
});

module.exports = mongoose.model("Student", studentSchema);