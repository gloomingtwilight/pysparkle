# 🚀 PySparkle Deployment & Setup Guide

## Quick Setup (Local Development)

### Prerequisites
- Node.js (v14+) and npm installed
- Modern web browser
- Text editor or IDE

### 1. Install & Start Backend

```bash
cd backend
npm install
node server.js
```

**Output:**
```
Server running on http://localhost:3000
```

### 2. Open Frontend

```bash
# Option A: Direct file
Open frontend/index.html in browser

# Option B: Live Server (VS Code)
Install "Live Server" extension
Right-click index.html → Open with Live Server
```

### 3. Access Platform

```
Homepage: http://localhost:5500 (or port shown)
Dashboard: http://localhost:5500/frontend/dashboard.html
Lesson: http://localhost:5500/frontend/lesson.html?id=1
```

---

## File Structure for Deployment

```
python-learning-platform/
├── backend/
│   ├── server.js              (Main Express server)
│   ├── package.json           (Dependencies)
│   └── node_modules/          (Installed packages)
│
├── frontend/
│   ├── index.html             (Home page)
│   ├── dashboard.html         (Roadmap)
│   ├── lesson.html            (Lesson viewer)
│   ├── css/
│   │   └── styles.css         (All styling)
│   └── js/
│       ├── dashboard.js       (Roadmap logic)
│       └── lesson.js          (Editor & execution)
│
├── data/
│   └── lessons.json           (30 lessons)
│
└── Documentation files
    ├── IMPLEMENTATION_SUMMARY.md
    ├── QUICK_START.md
    ├── LESSON_INDEX.md
    └── LESSON_VERIFICATION.md
```

---

## Production Deployment

### Option 1: Deploy to Heroku (Recommended)

#### Backend Deployment

1. **Create Heroku account** at heroku.com

2. **Install Heroku CLI**
```bash
# Windows: Download from heroku.com/download
# Or via npm:
npm install -g heroku
```

3. **Prepare backend**
```bash
cd backend
echo "web: node server.js" > Procfile
git init
git add .
git commit -m "Initial commit"
```

4. **Deploy**
```bash
heroku login
heroku create your-app-name
git push heroku main
```

5. **Get backend URL**
```bash
heroku apps:info -a your-app-name
# Use the URL provided
```

#### Frontend Deployment

1. **Update API URL** in frontend/js files:

In `frontend/js/dashboard.js`:
```javascript
// Change from:
const response = await fetch('http://localhost:3000/api/lessons');

// To:
const response = await fetch('https://your-app-name.herokuapp.com/api/lessons');
```

In `frontend/js/lesson.js`:
```javascript
// Change from:
const response = await fetch(`http://localhost:3000/api/lessons/${lessonId}`);

// To:
const response = await fetch(`https://your-app-name.herokuapp.com/api/lessons/${lessonId}`);

// Also update the execute endpoint:
const response = await fetch('https://your-app-name.herokuapp.com/api/execute', {
```

2. **Deploy to Vercel**

```bash
npm install -g vercel
cd frontend
vercel
```

3. **Follow prompts** and link to your GitHub

### Option 2: Deploy to Railway

**Backend:**
```bash
npm install -g railway
cd backend
railway init
railway up
```

**Frontend:**
```bash
cd frontend
npm install -g railway
railway init
railway up
```

### Option 3: Deploy to AWS

1. **Backend** → AWS Lambda + API Gateway
2. **Frontend** → Amazon S3 + CloudFront

---

## Environment Variables

### Backend (.env file)

```env
# backend/.env
PORT=3000
NODE_ENV=production
JUDGE0_API_URL=https://ce.judge0.com
```

### Update server.js

```javascript
const PORT = process.env.PORT || 3000;
const JUDGE0_URL = process.env.JUDGE0_API_URL || 'https://ce.judge0.com';
```

---

## Database Migration (Optional)

### Current (JSON Storage)
Lessons stored in `data/lessons.json`

### Future (MongoDB)

1. **Install MongoDB**
```bash
npm install mongoose
```

2. **Create models/lesson.js**
```javascript
const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  id: Number,
  level: String,
  title: String,
  description: String,
  theory: String,
  task: String,
  startingCode: String,
  expectedOutput: String
});

module.exports = mongoose.model('Lesson', lessonSchema);
```

3. **Update server.js**
```javascript
const mongoose = require('mongoose');
const Lesson = require('./models/lesson');

mongoose.connect(process.env.MONGODB_URI);

app.get('/api/lessons', async (req, res) => {
  const lessons = await Lesson.find();
  res.json(lessons);
});
```

---

## Scaling Considerations

### Current Limitations
- ✅ Handles ~100 concurrent users
- ✅ Judge0 free tier: 50 requests/day
- ✅ localStorage limited to ~5MB per browser

### Scaling Solutions

1. **Increase Judge0 Limits**
   - Upgrade Judge0 plan (paid)
   - Or self-host Judge0

2. **Add Caching**
   ```javascript
   const redis = require('redis');
   const client = redis.createClient();
   ```

3. **Database Optimization**
   - Add indexes on `id`, `level`
   - Use pagination for large queries

4. **CDN for Frontend**
   - Cloudflare (free)
   - CloudFront (AWS)

---

## Monitoring & Logging

### Frontend Errors
```javascript
// Add to frontend/js/dashboard.js
console.error('API Error:', error);
// Send to logging service:
fetch('https://your-logger.com/log', {
  method: 'POST',
  body: JSON.stringify({ error: error.message })
});
```

### Backend Monitoring
```bash
# Install PM2 for process management
npm install -g pm2
pm2 start server.js
pm2 logs
```

---

## Testing Before Launch

### Frontend Testing
```bash
# Test all lessons load
# Check responsive design (mobile, tablet, desktop)
# Verify editor works
# Test code execution
# Check progress persistence
```

### Backend Testing
```bash
# Test API endpoints
curl http://localhost:3000/api/lessons
curl http://localhost:3000/api/lessons/1

# Test code execution
curl -X POST http://localhost:3000/api/execute \
  -H "Content-Type: application/json" \
  -d '{"source_code":"print(\"Hello\")"}'
```

### Browser Compatibility
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

---

## Security Checklist

- [ ] Enable CORS only for trusted domains
- [ ] Use HTTPS in production
- [ ] Validate/sanitize code execution input
- [ ] Rate limit API endpoints
- [ ] Hide sensitive credentials
- [ ] Enable CSP headers
- [ ] Sanitize user input
- [ ] Update dependencies regularly

### CORS Configuration (Secure)
```javascript
const cors = require('cors');

app.use(cors({
  origin: ['https://yourdomain.com', 'https://app.yourdomain.com'],
  credentials: true
}));
```

---

## Performance Optimization

### Frontend
```javascript
// Lazy load Monaco Editor
// Minify CSS/JS
// Enable service workers for offline support
```

### Backend
```javascript
// Add compression
const compression = require('compression');
app.use(compression());

// Add rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

---

## Backup & Recovery

### Daily Backup
```bash
# Backup lessons.json
cp data/lessons.json backups/lessons_$(date +%Y%m%d).json

# Backup MongoDB
mongodump --uri="mongodb://..." --archive=backup.archive
```

### Disaster Recovery Plan
1. Keep 30-day backup history
2. Test restore procedure weekly
3. Document all configurations
4. Store credentials in secure vault

---

## Analytics Setup (Optional)

### Track User Progress
```javascript
// Add to lesson.js
fetch('https://your-analytics.com/track', {
  method: 'POST',
  body: JSON.stringify({
    lesson_id: currentLesson.id,
    time_spent: timeInSeconds,
    completed: true
  })
});
```

### Popular Services
- Google Analytics
- Mixpanel
- Plausible (privacy-focused)
- Segment

---

## Update & Maintenance

### Adding New Lessons
1. Add to `data/lessons.json`
2. Increment lesson count in dashboard
3. Test progression logic
4. Deploy changes

### Updating Judge0
```bash
# Keep Judge0 API URL updated
# Monitor API status at judge0.com
# Have fallback execution service
```

### Security Updates
```bash
cd backend
npm audit
npm audit fix
npm update
```

---

## Post-Launch Checklist

- [ ] All 30 lessons load correctly
- [ ] Progress persists across sessions
- [ ] Code execution works
- [ ] Mobile responsive
- [ ] Load time under 3 seconds
- [ ] No console errors
- [ ] Analytics working
- [ ] Monitoring active
- [ ] Backups running
- [ ] Documentation updated

---

## Support & Troubleshooting

### Common Issues

**"Cannot fetch lessons"**
- Check backend is running
- Verify API URL in JavaScript files
- Check CORS settings

**"Code won't execute"**
- Verify Judge0 API is accessible
- Check syntax errors in code
- Verify language_id is 71 (Python)

**"Progress not saving"**
- Check localStorage is enabled
- Clear browser cache
- Check browser storage quota

**"Editor not loading"**
- Verify Monaco CDN is accessible
- Check internet connection
- Try different browser

---

## Contact & Support

For deployment issues:
1. Check error logs: `heroku logs -a your-app-name`
2. Review GitHub issues
3. Contact support team

---

## Additional Resources

- [Express.js Documentation](https://expressjs.com)
- [Monaco Editor Docs](https://microsoft.github.io/monaco-editor)
- [Judge0 API Docs](https://rapidapi.com/judge0-official/api/judge0)
- [Heroku Deployment Guide](https://devcenter.heroku.com)

---

**Last Updated**: April 1, 2026
**Status**: Ready for Production 🚀
