require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const multer = require("multer");
const pdf = require("pdf-parse");
const fs = require("fs");

const app = express();

// =====================================================
// Middleware
// =====================================================

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const upload = multer({
  dest: "uploads/",
});

// =====================================================
// OpenRouter Client
// =====================================================
if (!process.env.OPENROUTER_API_KEY) {
  console.error("❌ OPENROUTER_API_KEY not found in .env");
  process.exit(1);
}
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Lumora AI"
  }
});

// =====================================================
// AI Tutor
// =====================================================

app.post("/api/chat", async (req, res) => {
  console.log("✅ /api/chat endpoint was called");
  console.log(req.body);
  try {
    const { question } = req.body;

    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Lumora AI Tutor. Explain answers in simple language for students."
        },
        {
          role: "user",
          content: question
        }
      ]
    });

    res.json({
      answer: completion.choices[0].message.content
    });
  } catch (error) {
    console.error("❌ AI Chat Error:");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }

    console.error(error);

    res.status(500).json({
      answer: error.message || "AI Error"
    });
  }
});

// =====================================================
// AI Note Summarizer
// =====================================================

app.post("/api/summarize", async (req, res) => {

  try {

    const { notes } = req.body;

    const completion = await client.chat.completions.create({

      model: "openai/gpt-4o-mini",

      messages: [
        {
          role: "system",
          content:
            "Summarize these notes into short, easy-to-understand bullet points."
        },
        {
          role: "user",
          content: notes
        }
      ]

    });

    res.json({
      summary: completion.choices[0].message.content
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      summary: "Error generating summary."
    });

  }

});

// =====================================================
// AI Quiz Generator
// =====================================================
// =====================================================
// AI Quiz Generator
// =====================================================

app.post("/api/quiz", async (req, res) => {

  console.log("✅ /api/quiz endpoint was called");
  console.log(req.body);

  try {


    const { notes } = req.body;

    const completion = await client.chat.completions.create({

      model: "openai/gpt-4o-mini",

      messages: [
        {
          role: "system",
          content:
            "Generate 10 multiple-choice questions from these notes. Each question should have four options (A, B, C, D) and clearly indicate the correct answer."
        },
        {
          role: "user",
          content: notes
        }
      ]

    });
    console.log("✅ AI Response:");
console.log(JSON.stringify(completion, null, 2));

    res.json({
      quiz: completion.choices[0].message.content
    });

  } catch (error) {

    console.log("========== QUIZ ERROR ==========");
    console.dir(error, { depth: null });

    res.status(500).json({
      quiz: error.message || "Error generating quiz."
    });
  }
});

// =====================================================
// AI Flashcard Generator
// =====================================================

app.post("/api/flashcards", async (req, res) => {

  try {

    const { notes } = req.body;

    const completion = await client.chat.completions.create({

      model: "openai/gpt-4o-mini",

      messages: [
        {
          role: "system",
          content:
            "Create study flashcards from these notes. Format each flashcard exactly like this:\n\nQuestion: ...\nAnswer: ...\n\nKeep answers short and simple."
        },
        {
          role: "user",
          content: notes
        }
      ]

    });

    res.json({
      flashcards: completion.choices[0].message.content
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      flashcards: "Error generating flashcards."
    });

  }

});

// =====================================================
// AI Exam Generator
// =====================================================

app.post("/api/exam", async (req, res) => {

  try {

    const { notes } = req.body;

    const completion = await client.chat.completions.create({

      model: "openai/gpt-4o-mini",

      messages: [
        {
          role: "system",
          content: `
Generate a complete exam paper from the student's notes.

Include:

Part A: 10 Multiple Choice Questions
Part B: 5 True/False Questions
Part C: 5 Fill in the Blanks
Part D: 5 Short Answer Questions

Mention correct answers for objective questions.
`
        },
        {
          role: "user",
          content: notes
        }
      ]

    });

    res.json({
      exam: completion.choices[0].message.content
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      exam: "Error generating exam."
    });

  }

});

// =====================================================
// AI Study Planner
// =====================================================

app.post("/api/study-plan", async (req, res) => {

  try {

    const { subjects, examDate, hours } = req.body;

    const completion = await client.chat.completions.create({

      model: "openai/gpt-4o-mini",

      messages: [

        {
          role: "system",
          content: `
You are an AI Study Planner.

Create a personalized study timetable.

Rules:
- Divide study time evenly among all subjects.
- Assume the student studies the specified number of hours each day.
- Include revision days before the exam.
- Add short breaks.
- Use bullet points.
- Keep it motivating.
`
        },

        {
          role: "user",
          content: `
Subjects:
${subjects}

Exam Date:
${examDate}

Study Hours Per Day:
${hours}
`
        }

      ]

    });

    res.json({
      plan: completion.choices[0].message.content
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      plan: "Error generating study plan."
    });

  }

});
// =====================================================
// AI Mind Map Generator
// =====================================================

app.post("/api/mindmap", async (req, res) => {

  try {

    const { notes } = req.body;

    const completion = await client.chat.completions.create({

      model: "openai/gpt-4o-mini",

      messages: [

        {
          role: "system",
          content: `
You are an AI Mind Map Generator.

Convert the student's notes into a clean hierarchical mind map.

Rules:
- Use headings and bullet points.
- Show parent and child concepts.
- Keep it easy to read.
- Do not write paragraphs.
- Focus on the main concepts and their relationships.
`
        },

        {
          role: "user",
          content: notes
        }

      ]

    });

    res.json({
      mindmap: completion.choices[0].message.content
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mindmap: "Error generating mind map."
    });

  }

});
// =====================================================
// PDF Upload & AI Summary
// =====================================================

app.post("/api/upload-pdf", upload.single("pdf"), async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        summary: "Please upload a PDF."
      });
    }

    const buffer = fs.readFileSync(req.file.path);

    const pdfData = await pdf(buffer);

    const completion = await client.chat.completions.create({

      model: "openai/gpt-4o-mini",

      messages: [
        {
          role: "system",
          content:
            "Summarize the following PDF into clear, short bullet points for students."
        },
        {
          role: "user",
          content: pdfData.text
        }
      ]

    });

    fs.unlinkSync(req.file.path);

    res.json({
      summary: completion.choices[0].message.content
    });

  } catch (error) {

    console.error(error);
res.status(500).json({
  summary: error.message || "Error generating summary."
});
    
  }

});
// =====================================================
// AI Writing Assistant
// =====================================================

app.post("/api/writing", async (req, res) => {

  try {

    const { prompt } = req.body;
    console.log("=== WRITING REQUEST ===");
    console.log(req.body);

    const completion = await client.chat.completions.create({

      model: "openai/gpt-4o-mini",

      messages: [

        {
          role: "system",
          content:
            "You are a professional AI Writing Assistant. Write essays, stories, emails, reports, speeches, blogs, assignments and other content in a clear, professional and well-formatted style."
        },

        {
          role: "user",
          content: prompt
        }

      ]

    });

    res.json({
      writing: completion.choices[0].message.content
    });

  } catch (error) {

   console.dir(error, { depth: null });
  console.log(error);
    res.status(500).json({
      writing: error.message || "Error generating writing."
    });

  }

});

// =====================================================
// Home Page
// =====================================================

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// =====================================================
// Start Server
// =====================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log("========================================");
  console.log("🚀 Lumora AI Server Started Successfully");
  console.log(`🌐 http://localhost:${PORT}`);
  console.log("========================================");

});
