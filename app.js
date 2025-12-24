// 4D Devotional App - Main Logic
// Supabase Configuration
const SUPABASE_URL = 'https://dckctxdcxblpsbewsnda.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRja2N0eGRjeGJscHNiZXdzbmRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MDE5NjQsImV4cCI6MjA4MjA3Nzk2NH0.OPpUCNyoiihkmqnBy4fBpurZ2amIfTmWDuldr1401AI';
let supabase;

// App State
let currentUser = null;
let currentDay = 1;
let completionData = {};
let notesData = {};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Check if user already selected
    const savedUser = localStorage.getItem('4d-user');
    if (savedUser) {
        currentUser = savedUser;
    } else {
        // Default to "Dad" if no one selected yet
        currentUser = 'Dad';
        localStorage.setItem('4d-user', 'Dad');
    }
    
    // Go straight to app
    showScreen('app-screen');
    initializeApp();
});

// Authentication - REMOVED (no password needed)

function selectUser(user) {
    currentUser = user;
    localStorage.setItem('4d-user', user);
    showScreen('app-screen');
    initializeApp();
}

function logout() {
    localStorage.removeItem('4d-user');
    currentUser = null;
    showScreen('name-screen');
}

function showScreen(screenId) {
    console.log('Switching to screen:', screenId);
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
        console.log('Removed active from:', s.id);
    });
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        console.log('Added active to:', screenId);
    } else {
        console.error('Screen not found:', screenId);
    }
}

// Initialize Supabase (if configured)
async function initializeApp() {
    document.getElementById('current-user').textContent = currentUser;
    
    // Initialize Supabase if configured
    if (SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        await loadCompletionData();
        await loadNotesData();
    }
    
    // Show today's devotion
    const today = new Date();
    const december = today.getMonth() === 11; // December is month 11
    if (december && today.getDate() <= 31) {
        // Calculate which day based on date (simplified - adjust as needed)
        currentDay = Math.min(20, Math.max(1, Math.floor((today.getDate() - 1) / 1.5)));
    }
    
    loadDevotion(currentDay);
    updateCalendar();
    updateProgress();
}

// Load devotion content
function loadDevotion(dayNum) {
    currentDay = dayNum;
    const devotion = DEVOTIONS[dayNum - 1];
    
    if (!devotion) {
        alert('Devotion not yet available!');
        return;
    }
    
    // Update week badge
    const weekBadge = document.getElementById('week-badge');
    weekBadge.textContent = devotion.weekTitle;
    weekBadge.style.background = devotion.weekColor;
    
    // Update title and subtitle
    document.getElementById('devotion-title').textContent = devotion.title;
    document.getElementById('devotion-subtitle').textContent = devotion.subtitle;
    
    // Load YouTube video
    const videoSection = document.getElementById('video-section');
    if (devotion.youtubeId) {
        videoSection.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${devotion.youtubeId}" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
    } else {
        videoSection.innerHTML = '';
    }
    
    // Load scripture
    document.getElementById('scripture-context').textContent = devotion.context;
    const scriptureBox = document.getElementById('scripture-box');
    scriptureBox.innerHTML = `
        <div class="scripture-ref">${devotion.scriptureRef}</div>
        ${devotion.scripture.map(text => `<p>${text}</p>`).join('')}
    `;
    
    // Load reflection
    const reflectionContent = document.getElementById('reflection-content');
    reflectionContent.innerHTML = devotion.reflection.map(para => `<p>${para}</p>`).join('');
    
    // Load questions
    const questionsContent = document.getElementById('questions-content');
    questionsContent.innerHTML = devotion.questions.map((q, i) => 
        `<p class="question"><strong>${i + 1}.</strong> ${q}</p>`
    ).join('');
    
    // Update complete button
    const isCompleted = checkIfCompleted(dayNum, currentUser);
    const completeBtn = document.getElementById('complete-btn');
    if (isCompleted) {
        completeBtn.textContent = '✓ Completed';
        completeBtn.classList.add('completed');
    } else {
        completeBtn.textContent = '✓ Mark Complete';
        completeBtn.classList.remove('completed');
    }
    
    // Update day indicator
    document.getElementById('day-indicator').textContent = `Day ${dayNum} of 20`;
    
    // Update navigation buttons
    document.getElementById('prev-btn').disabled = dayNum === 1;
    document.getElementById('next-btn').disabled = dayNum === DEVOTIONS.length;
    
    // Load notes for this day
    loadNotes(dayNum);
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Notes functionality
async function loadNotes(dayNum) {
    const journalEntries = document.getElementById('journal-entries');
    
    if (!supabase) {
        // Fallback to localStorage if Supabase not configured
        const localNotes = JSON.parse(localStorage.getItem(`notes-day-${dayNum}`) || '{}');
        displayNotes(localNotes);
        return;
    }
    
    try {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('day', dayNum)
            .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        const notesObj = {};
        data.forEach(note => {
            notesObj[note.user] = {
                content: note.content,
                timestamp: new Date(note.created_at).toLocaleString()
            };
        });
        
        displayNotes(notesObj);
    } catch (error) {
        console.error('Error loading notes:', error);
        journalEntries.innerHTML = '<div class="loading">Could not load notes</div>';
    }
}

function displayNotes(notes) {
    const journalEntries = document.getElementById('journal-entries');
    
    if (Object.keys(notes).length === 0) {
        journalEntries.innerHTML = '<div class="loading">No notes yet. Be the first to write!</div>';
        return;
    }
    
    journalEntries.innerHTML = '';
    
    ['Dad', 'Dom'].forEach(user => {
        if (notes[user]) {
            const entry = document.createElement('div');
            entry.className = 'journal-entry';
            entry.innerHTML = `
                <div class="entry-header">
                    <span class="entry-author">${user}'s Note</span>
                    <span class="entry-time">${notes[user].timestamp}</span>
                </div>
                <div class="entry-content">${notes[user].content}</div>
            `;
            journalEntries.appendChild(entry);
        }
    });
}

async function saveNote() {
    const noteText = document.getElementById('my-note').value.trim();
    
    if (!noteText) {
        alert('Please write something first!');
        return;
    }
    
    if (!supabase) {
        // Fallback to localStorage
        const localNotes = JSON.parse(localStorage.getItem(`notes-day-${currentDay}`) || '{}');
        localNotes[currentUser] = {
            content: noteText,
            timestamp: new Date().toLocaleString()
        };
        localStorage.setItem(`notes-day-${currentDay}`, JSON.stringify(localNotes));
        displayNotes(localNotes);
        document.getElementById('my-note').value = '';
        alert('Note saved!');
        return;
    }
    
    try {
        // Check if note exists
        const { data: existing } = await supabase
            .from('notes')
            .select('id')
            .eq('day', currentDay)
            .eq('user', currentUser)
            .single();
        
        if (existing) {
            // Update existing note
            await supabase
                .from('notes')
                .update({ content: noteText, created_at: new Date().toISOString() })
                .eq('id', existing.id);
        } else {
            // Insert new note
            await supabase
                .from('notes')
                .insert([
                    { day: currentDay, user: currentUser, content: noteText }
                ]);
        }
        
        document.getElementById('my-note').value = '';
        loadNotes(currentDay);
        alert('Note saved!');
    } catch (error) {
        console.error('Error saving note:', error);
        alert('Could not save note. Check your connection.');
    }
}

// Completion tracking
function checkIfCompleted(dayNum, user) {
    if (!supabase) {
        const localCompletions = JSON.parse(localStorage.getItem('completions') || '{}');
        return localCompletions[`day${dayNum}-${user}`] === true;
    }
    return completionData[`day${dayNum}-${user}`] === true;
}

async function markComplete() {
    const isCompleted = checkIfCompleted(currentDay, currentUser);
    
    if (isCompleted) {
        alert('Already marked as complete!');
        return;
    }
    
    if (!supabase) {
        // Fallback to localStorage
        const localCompletions = JSON.parse(localStorage.getItem('completions') || '{}');
        localCompletions[`day${currentDay}-${currentUser}`] = true;
        localStorage.setItem('completions', JSON.stringify(localCompletions));
        completionData = localCompletions;
    } else {
        try {
            await supabase
                .from('completions')
                .insert([
                    { day: currentDay, user: currentUser }
                ]);
            await loadCompletionData();
        } catch (error) {
            console.error('Error marking complete:', error);
        }
    }
    
    loadDevotion(currentDay);
    updateCalendar();
    updateProgress();
    alert('Great job! Devotion marked complete! 🎉');
}

async function loadCompletionData() {
    if (!supabase) return;
    
    try {
        const { data, error } = await supabase
            .from('completions')
            .select('*');
        
        if (error) throw error;
        
        completionData = {};
        data.forEach(comp => {
            completionData[`day${comp.day}-${comp.user}`] = true;
        });
    } catch (error) {
        console.error('Error loading completion data:', error);
    }
}

async function loadNotesData() {
    // Already handled in loadNotes
}

// Navigation
function previousDay() {
    if (currentDay > 1) {
        loadDevotion(currentDay - 1);
    }
}

function nextDay() {
    if (currentDay < DEVOTIONS.length) {
        loadDevotion(currentDay + 1);
    }
}

// Tab navigation
function showTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    if (tabName === 'calendar') {
        updateCalendar();
    } else if (tabName === 'progress') {
        updateProgress();
    }
}

// Calendar
function updateCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = '';
    
    DEVOTIONS.forEach((devotion, index) => {
        const dayNum = index + 1;
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        
        const dadCompleted = checkIfCompleted(dayNum, 'Dad');
        const domCompleted = checkIfCompleted(dayNum, 'Dom');
        
        if (dadCompleted && domCompleted) {
            dayCard.classList.add('completed');
        }
        
        if (dayNum === currentDay) {
            dayCard.classList.add('current');
        }
        
        dayCard.innerHTML = `
            <div class="day-number">Day ${dayNum}</div>
            <div class="day-title">${devotion.title.replace(/DAY \d+ .+ /, '')}</div>
            <div class="completion-badges">
                ${dadCompleted ? '<span class="badge" style="background: var(--week1-main)">👨</span>' : ''}
                ${domCompleted ? '<span class="badge" style="background: var(--week3-main)">🎣</span>' : ''}
            </div>
        `;
        
        dayCard.onclick = () => {
            loadDevotion(dayNum);
            showTab('today');
        };
        
        calendarGrid.appendChild(dayCard);
    });
}

// Progress tracking
function updateProgress() {
    let dadCount = 0;
    let domCount = 0;
    let togetherCount = 0;
    
    for (let i = 1; i <= DEVOTIONS.length; i++) {
        const dadDone = checkIfCompleted(i, 'Dad');
        const domDone = checkIfCompleted(i, 'Dom');
        
        if (dadDone) dadCount++;
        if (domDone) domCount++;
        if (dadDone && domDone) togetherCount++;
    }
    
    document.getElementById('dad-completed').textContent = dadCount;
    document.getElementById('dom-completed').textContent = domCount;
    document.getElementById('together-count').textContent = togetherCount;
    
    // Calculate streak (consecutive days both completed)
    let streak = 0;
    for (let i = DEVOTIONS.length; i >= 1; i--) {
        if (checkIfCompleted(i, 'Dad') && checkIfCompleted(i, 'Dom')) {
            streak++;
        } else {
            break;
        }
    }
    document.getElementById('streak-count').textContent = streak;
    
    // Week progress bars
    const weekProgress = document.getElementById('week-progress');
    weekProgress.innerHTML = '';
    
    WEEKS.forEach(week => {
        const weekDays = DEVOTIONS.filter(d => d.week === week.number);
        const completed = weekDays.filter((d, i) => {
            const dayNum = DEVOTIONS.indexOf(d) + 1;
            return checkIfCompleted(dayNum, currentUser);
        }).length;
        const percentage = (completed / weekDays.length) * 100;
        
        const weekRow = document.createElement('div');
        weekRow.className = 'week-row';
        weekRow.innerHTML = `
            <div class="week-title">${week.title}</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%">
                    ${completed}/${weekDays.length}
                </div>
            </div>
        `;
        weekProgress.appendChild(weekRow);
    });
}
