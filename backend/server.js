const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Load lessons
const lessonsPath = path.join(__dirname, '../data/lessons.json');

app.get('/api/lessons', (req, res) => {
    fs.readFile(lessonsPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read lessons data' });
        }
        res.json(JSON.parse(data));
    });
});

app.get('/api/lessons/:id', (req, res) => {
    fs.readFile(lessonsPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read lessons data' });
        }
        const lessons = JSON.parse(data);
        const lesson = lessons.find(l => l.id == req.params.id);
        if (lesson) {
            res.json(lesson);
        } else {
            res.status(404).json({ error: 'Lesson not found' });
        }
    });
});

// Code execution using Judge0 Free API (ce.judge0.com)
app.post('/api/execute', async (req, res) => {
    const { source_code, stdin } = req.body;
    
    try {
        const response = await fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=true', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                language_id: 71, // 71 is Python (3.8.1)
                source_code: source_code,
                stdin: stdin || "" // Support stdin input for interactive lessons
            })
        });

        if (!response.ok) {
            throw new Error(`Execution request failed with status ${response.status}`);
        }

        const data = await response.json();
        res.json({
            stdout: data.stdout,
            stderr: data.stderr,
            compile_output: data.compile_output,
            status: data.status,
            time: data.time
        });
    } catch (error) {
        console.error('Execution error:', error);
        res.status(500).json({ error: 'Code execution failed', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
