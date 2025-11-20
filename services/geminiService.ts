import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question, Subject, Difficulty, PatternAnalysis, MockQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instructions for the general chat agent
const TUTOR_SYSTEM_INSTRUCTION = `
You are an elite Banking Exam Tutor specializing in IBPS RRB PO and Clerk exams.
Your goal is to help students clear these exams by providing detailed concepts, shortcuts, and strategies.
You have deep knowledge of:
- Quantitative Aptitude (Data Interpretation, Arithmetic, Simplification)
- Reasoning Ability (Puzzles, Seating Arrangement, Syllogism)
- General Awareness (Banking Awareness, Current Affairs)
- Computer Knowledge
- English/Hindi Language

Always be encouraging, precise, and focus on 'speed with accuracy'.
If asked for a study plan, create a structured timetable.
If asked about concepts, explain with examples relevant to banking exams.
`;

export const sendChatMessage = async (history: { role: string; parts: { text: string }[] }[], message: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: TUTOR_SYSTEM_INSTRUCTION,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Sorry, I encountered an error connecting to the AI service.";
  }
};

export const generatePracticeQuestions = async (subject: Subject, difficulty: Difficulty, topic: string, count: number = 5): Promise<Question[]> => {
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        questionText: { type: Type.STRING },
        options: { type: Type.ARRAY, items: { type: Type.STRING } },
        correctAnswerIndex: { type: Type.INTEGER, description: "Zero-based index of the correct option" },
        explanation: { type: Type.STRING },
        topic: { type: Type.STRING },
        difficulty: { type: Type.STRING },
      },
      required: ["questionText", "options", "correctAnswerIndex", "explanation", "topic", "difficulty"],
    },
  };

  const prompt = `Generate ${count} ${difficulty} level multiple-choice questions for IBPS RRB ${subject} specifically focusing on the topic: "${topic}".
  Ensure the questions match the actual exam pattern and difficulty of IBPS RRB PO/Clerk.
  Provide detailed explanations for the solutions.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as Question[];
  } catch (error) {
    console.error("Question Generation Error:", error);
    return [];
  }
};

export const analyzeExamPattern = async (examType: 'PO' | 'Clerk', year: string): Promise<PatternAnalysis | null> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      examYear: { type: Type.STRING },
      examType: { type: Type.STRING, enum: ['PO', 'Clerk'] },
      summary: { type: Type.STRING, description: "A comprehensive text summary of the exam pattern changes, difficulty level, and surprises for that year." },
      subjectData: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            weightage: { type: Type.NUMBER, description: "Approximate number of questions or percentage weightage" },
            trend: { type: Type.STRING, enum: ['UP', 'DOWN', 'STABLE'] }
          },
          required: ["topic", "weightage", "trend"]
        }
      }
    },
    required: ["examYear", "examType", "summary", "subjectData"]
  };

  const prompt = `Analyze the IBPS RRB ${examType} exam pattern for the year ${year} (or the most recent trend if exact year data is unavailable, but infer based on your knowledge base up to 2024/2025).
  Provide a breakdown of key topics, their weightage, and how the pattern shifted compared to previous years.
  Focus heavily on Quant and Reasoning as they are key for Prelims.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as PatternAnalysis;
  } catch (error) {
    console.error("Analysis Error:", error);
    return null;
  }
};

// --- New Mock Exam Functions ---

export const generateMockExam = async (type: 'PO' | 'Clerk'): Promise<MockQuestion[]> => {
  // Generating a mini-mock (e.g., 10 questions) to ensure speed, as full 80Q is too large for single prompt
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        questionText: { type: Type.STRING },
        options: { type: Type.ARRAY, items: { type: Type.STRING } },
        correctAnswerIndex: { type: Type.INTEGER },
        explanation: { type: Type.STRING },
        topic: { type: Type.STRING },
        difficulty: { type: Type.STRING },
        section: { type: Type.STRING, enum: ['Reasoning', 'Quantitative Aptitude'] }
      },
      required: ["questionText", "options", "correctAnswerIndex", "explanation", "topic", "difficulty", "section"]
    }
  };

  const prompt = `Generate a Mini-Mock Exam for IBPS RRB ${type} Prelims.
  Create exactly 10 questions: 5 for Reasoning and 5 for Quantitative Aptitude.
  The questions should mix different topics (e.g., Syllogism, Puzzles for Reasoning; DI, Series for Quant).
  Mark the 'section' field correctly for each question.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) return [];
    const questions = JSON.parse(text) as MockQuestion[];
    // Initialize status
    return questions.map(q => ({ ...q, status: 'not_visited' }));
  } catch (error) {
    console.error("Mock Generation Error:", error);
    return [];
  }
};

export const parseMockFromText = async (rawText: string): Promise<MockQuestion[]> => {
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        questionText: { type: Type.STRING },
        options: { type: Type.ARRAY, items: { type: Type.STRING } },
        correctAnswerIndex: { type: Type.INTEGER },
        explanation: { type: Type.STRING, description: "Generate a brief explanation if missing in text" },
        topic: { type: Type.STRING, description: "Infer topic" },
        difficulty: { type: Type.STRING, description: "Infer difficulty" },
        section: { type: Type.STRING, enum: ['Reasoning', 'Quantitative Aptitude'], description: "Infer section based on content" }
      },
      required: ["questionText", "options", "correctAnswerIndex", "section"]
    }
  };

  const prompt = `Analyze the following raw text which contains questions from a banking exam paper.
  Extract individual multiple-choice questions.
  Classify them into 'Reasoning' or 'Quantitative Aptitude'.
  If the correct answer is not explicitly marked, solve it yourself and set 'correctAnswerIndex'.
  
  RAW TEXT START:
  ${rawText.substring(0, 30000)} 
  RAW TEXT END
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) return [];
    const questions = JSON.parse(text) as MockQuestion[];
    return questions.map(q => ({ ...q, status: 'not_visited', explanation: q.explanation || "Derived from uploaded text." }));
  } catch (error) {
    console.error("Text Parse Error:", error);
    return [];
  }
};