# 🚀 PySparkle Quick Start Guide

## ⚡ 30-Second Setup

### 1. Start Backend
```bash
cd backend
npm install (if not done)
node server.js
```

### 2. Open Frontend
```
Open frontend/index.html in your browser
OR use Live Server extension
```

### 3. Start Learning
```
Click "Start Learning" → View 30 lessons organized by level
```

---

## 📚 Complete Lesson Map

### 🟢 **BEGINNER (Lessons 1-12)**
```
1.  Introduction to Python
2.  Variables & Data Types
3.  User Input & Type Casting
4.  Operators
5.  Conditional Statements
6.  Loops
7.  Functions
8.  Lists
9.  Tuples & Sets
10. Dictionaries
11. Strings (Basic)
12. PROJECT: Calculator / Guessing Game
```

### 🟡 **INTERMEDIATE (Lessons 13-22)**
```
13. File Handling
14. Exception Handling
15. Modules & Packages
16. Dates & Time
17. OOP (Classes & Objects)
18. OOP (Inheritance)
19. Strings (Advanced)
20. List Comprehensions
21. Lambda Functions
22. PROJECT: CLI To-Do App / File Manager
```

### 🔴 **ADVANCED (Lessons 23-30)**
```
23. OOP (Advanced)
24. Decorators
25. Generators & Iterators
26. Working with APIs
27. JSON Handling
28. Virtual Environments
29. Debugging & Optimization
30. PROJECT: Weather App / GitHub Viewer
```

---

## 🎮 How to Use Platform

### Dashboard Features
- **View all 30 lessons** grouped by difficulty level
- **See progress** - completed lessons show ✓ checkmark
- **Locked lessons** show 🔒 until you complete the previous one
- **Color-coded** by level (🟢 green, 🟡 yellow, 🔴 red)

### Lesson Page Features
- **Left Panel**: Theory & Task Description
- **Right Panel**: Code Editor + Output Console
- **Run Code**: Executes instantly in the cloud
- **Auto-Validation**: Checks if output matches expected result
- **Success Modal**: Shows when lesson is complete
- **Next Lesson**: Button to progress to next lesson

---

## 💡 Example Lesson Flow

```
User clicks Lesson 1: "Introduction to Python"
    ↓
Sees theory: "Learn print() function"
    ↓
Sees task: "Print 'Hello, World!'"
    ↓
Edits code in editor:
    print("Hello, World!")
    ↓
Clicks "Run Code"
    ↓
Code executes on Judge0 API
    ↓
Output shown: "Hello, World!"
    ↓
Matches expected output ✅
    ↓
Success modal appears
    ↓
Lesson marked complete in localStorage
    ↓
Lesson 2 now unlocks
```

---

## 📁 Where Each File Comes From

| File | Purpose | Status |
|------|---------|--------|
| `data/lessons.json` | All 30 lessons | ✅ Updated |
| `frontend/dashboard.html` | Roadmap page | ✅ Works |
| `frontend/js/dashboard.js` | Load & group lessons | ✅ Updated |
| `frontend/lesson.html` | Lesson viewer | ✅ Works |
| `frontend/js/lesson.js` | Editor & execution | ✅ Works |
| `backend/server.js` | API server | ✅ Configured |

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Error Loading Roadmap" | Start backend: `node server.js` |
| Code doesn't run | Check syntax, then click Run again |
| Lesson marked as wrong | Output must exactly match expected (case-sensitive) |
| Lesson locked incorrectly | Clear localStorage: Open DevTools → Storage → Clear |

---

## 📊 Progress Tracking

Your progress is saved in **browser localStorage** at:
```javascript
localStorage.pySparkleProgress = [1, 2, 3, ...]
```

**To reset progress:**
1. Open DevTools (F12)
2. Go to Storage → Local Storage
3. Find and delete `pySparkleProgress`
4. Reload page

---

## 🎯 Learning Tips

✅ **Complete lessons in order** - each builds on the previous
✅ **Read the theory first** - understand concepts before coding
✅ **Modify the code** - experiment, don't just run as-is
✅ **Mini projects are important** - integrate what you've learned
✅ **Take your time** - learning takes practice

---

## 🌟 Key Stats

- **30 Total Lessons** (12 beginner, 10 intermediate, 8 advanced)
- **3 Mini Projects** (Calculator, CLI app, Weather app)
- **Real Code Execution** via Judge0 API
- **Progress Persistence** with localStorage
- **Zero Setup Required** for learners

---

## 🚀 Going Live

When you're ready to deploy:

1. **Backend**: Deploy to Heroku, Railway, or AWS
2. **Frontend**: Deploy to Vercel, Netlify, or GitHub Pages
3. **Update API URL** in dashboard.js and lesson.js to production backend

---

**Made with 💙 for Python Learners**
