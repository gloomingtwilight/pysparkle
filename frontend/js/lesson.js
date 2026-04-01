let editor;
let currentLesson;

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const lessonId = urlParams.get('id') || 1;

    try {
        const response = await fetch(`http://localhost:3000/api/lessons/${lessonId}`);
        if (!response.ok) throw new Error('Lesson not found');
        currentLesson = await response.json();
        
        renderLesson(currentLesson);
        initEditor(currentLesson.startingCode);
    } catch (error) {
        document.getElementById('theory-content').innerHTML = `
            <h2 style="color: #ff4757;">Error</h2>
            <p>Could not load lesson data. Is the backend running?</p>
            <p>${error.message}</p>
        `;
    }

    document.getElementById('run-btn').addEventListener('click', executeCode);
});

function renderLesson(lesson) {
    document.getElementById('lesson-nav-title').textContent = `${lesson.id}. ${lesson.title}`;
    
    // Using simple parsed replacement for markdown-like syntax
    // (We included marked.js in HTML to handle robust Markdown if needed, let's use it)
    let theoryHtml = marked.parse(lesson.theory);
    
    document.getElementById('theory-content').innerHTML = `
        <h2>${lesson.title}</h2>
        <p style="color: var(--text-muted); font-style: italic; margin-bottom: 20px;">${lesson.description}</p>
        <div class="theory-markdown">${theoryHtml}</div>
    `;
    
    document.getElementById('task-content').textContent = lesson.task;
    document.getElementById('expected-output').textContent = lesson.expectedOutput;
}

function initEditor(defaultCode) {
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.38.0/min/vs' }});
    require(['vs/editor/editor.main'], function() {
        editor = monaco.editor.create(document.getElementById('editor-container'), {
            value: defaultCode,
            language: 'python',
            theme: 'vs-dark',
            automaticLayout: true,
            fontSize: 16,
            minimap: { enabled: false },
            padding: { top: 20, bottom: 20 },
            scrollBeyondLastLine: false,
            roundedSelection: true,
            scrollbar: {
                useShadows: false,
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10
            }
        });
        
        // Custom theme override matching our UI
        monaco.editor.defineTheme('pySparkleTheme', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'keyword', foreground: '00f0ff' },
                { token: 'string', foreground: '00ffa3' },
                { token: 'number', foreground: '7000ff' },
            ],
            colors: {
                'editor.background': '#1a1a24',
                'editor.lineHighlightBackground': '#2a2a35'
            }
        });
        monaco.editor.setTheme('pySparkleTheme');
    });
}

async function executeCode() {
    const runBtn = document.getElementById('run-btn');
    const outputEl = document.getElementById('output');
    const statusEl = document.getElementById('exec-status');
    const sourceCode = editor.getValue();

    runBtn.disabled = true;
    runBtn.innerHTML = 'Running... <span class="loading-pulse">⚪</span>';
    outputEl.className = 'output-content';
    outputEl.innerHTML = '<span class="loading-pulse">Executing in cloud...</span>';
    statusEl.textContent = 'Executing...';

    try {
        const response = await fetch('http://localhost:3000/api/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ source_code: sourceCode })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        let outText = '';
        if (data.stderr || data.compile_output) {
            outText = data.stderr || data.compile_output;
            outputEl.className = 'output-content error';
            statusEl.textContent = 'Error';
            statusEl.style.color = '#ff4757';
        } else {
            outText = data.stdout || '';
            outputEl.className = 'output-content success';
            statusEl.textContent = `Success (${data.time || '<0.1'}s)`;
            statusEl.style.color = 'var(--success)';
            
            // Check if solution is correct
            checkSolution(outText);
        }

        outputEl.textContent = outText || 'Program completed with no output.';

    } catch (error) {
        outputEl.className = 'output-content error';
        outputEl.textContent = `System Error: ${error.message}`;
        statusEl.textContent = 'Failed';
        statusEl.style.color = '#ff4757';
    } finally {
        runBtn.disabled = false;
        runBtn.innerHTML = 'Run Code ▶';
    }
}

function checkSolution(actualOutput) {
    if (!currentLesson || !currentLesson.expectedOutput) return;
    
    const expected = currentLesson.expectedOutput.trim();
    const actual = actualOutput.trim();
    
    if (expected === actual) {
        // Correct! Mark as completed.
        let progress = JSON.parse(localStorage.getItem('pySparkleProgress')) || [];
        if (!progress.includes(currentLesson.id)) {
            progress.push(currentLesson.id);
            localStorage.setItem('pySparkleProgress', JSON.stringify(progress));
        }
        
        showSuccessModal();
    }
}

function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    modal.classList.add('active');
    
    const nextBtn = document.getElementById('next-lesson-btn');
    nextBtn.onclick = (e) => {
        e.preventDefault();
        window.location.href = `lesson.html?id=${currentLesson.id + 1}`;
    };
}
