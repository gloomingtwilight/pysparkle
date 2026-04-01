document.addEventListener('DOMContentLoaded', async () => {
    const roadmapContainer = document.getElementById('roadmap');
    const completedCountEl = document.getElementById('completed-count');
    const totalCountEl = document.getElementById('total-count');

    // Load progress from localStorage
    let progress = JSON.parse(localStorage.getItem('pySparkleProgress')) || [];
    
    try {
        const response = await fetch('http://localhost:3000/api/lessons');
        if (!response.ok) throw new Error('API unreachable');
        const lessons = await response.json();
        
        // Update stats
        totalCountEl.textContent = lessons.length;
        completedCountEl.textContent = progress.length;

        roadmapContainer.innerHTML = '<div class="roadmap-line"></div>';

        // Group lessons by level
        const levels = { beginner: [], intermediate: [], advanced: [] };
        lessons.forEach(lesson => {
            if (levels[lesson.level]) {
                levels[lesson.level].push(lesson);
            }
        });

        // Display each level with header
        const levelInfo = {
            beginner: { emoji: '🟢', title: 'Beginner Level (Foundation)', color: '#2ecc71' },
            intermediate: { emoji: '🟡', title: 'Intermediate Level (Core Skills)', color: '#f39c12' },
            advanced: { emoji: '🔴', title: 'Advanced Level (Practical Focus)', color: '#e74c3c' }
        };

        Object.keys(levels).forEach(level => {
            if (levels[level].length > 0) {
                const info = levelInfo[level];
                const levelHeaderHtml = `
                    <div class="level-header" style="margin: 40px 0 20px 0; text-align: center;">
                        <span style="font-size: 2.5rem; margin-right: 10px;">${info.emoji}</span>
                        <h2 style="display: inline; color: var(--text-gradient); font-size: 1.8rem;">${info.title}</h2>
                        <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 5px;">
                            ${levels[level].length} lessons
                        </div>
                    </div>
                `;
                roadmapContainer.innerHTML += levelHeaderHtml;

                // Render lessons for this level
                levels[level].forEach((lesson, index) => {
                    const absoluteIndex = lessons.findIndex(l => l.id === lesson.id);
                    const isCompleted = progress.includes(lesson.id);
                    const isUnlocked = absoluteIndex === 0 || progress.includes(lessons[absoluteIndex - 1].id);
                    
                    let cardClass = 'lesson-card glass-panel';
                    if (isCompleted) cardClass += ' completed';
                    else if (!isUnlocked) cardClass += ' locked';

                    let linkAttr = isUnlocked ? `href="lesson.html?id=${lesson.id}"` : '';
                    let cursorStyle = isUnlocked ? 'pointer' : 'not-allowed';

                    const cardHtml = `
                        <a ${linkAttr} class="${cardClass}" style="margin-left: ${index % 2 === 0 ? '-150px' : '150px'}; cursor: ${cursorStyle};">
                            <div class="lesson-number" style="background: ${info.color};">${lesson.id}</div>
                            <h3 class="lesson-title">${lesson.title}</h3>
                            <p class="lesson-desc">${lesson.description}</p>
                            <div class="lesson-level-badge" style="background: ${info.color}30; color: ${info.color}; margin-top: 10px; padding: 5px 10px; border-radius: 8px; font-size: 0.85rem; display: inline-block;">
                                ${level.charAt(0).toUpperCase() + level.slice(1)}
                            </div>
                            ${isCompleted ? '<div style="color: var(--success); margin-top: 10px; font-weight: 600;">✓ Completed</div>' : ''}
                            ${!isUnlocked && !isCompleted ? '<div style="color: var(--text-muted); margin-top: 10px; font-weight: 600;">🔒 Locked</div>' : ''}
                        </a>
                    `;
                    
                    roadmapContainer.innerHTML += cardHtml;
                });
            }
        });
        
    } catch (error) {
        roadmapContainer.innerHTML = `
            <div style="text-align: center; color: #ff4757; padding: 50px;">
                <h3>Error Loading Roadmap</h3>
                <p>Ensure the backend server is running on localhost:3000</p>
                <p>${error.message}</p>
            </div>
        `;
    }
});
