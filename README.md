# 4D - Dad and Dom's Daily Devo 📖

A shared devotional web app for father-son faith growth. Features daily devotions, shared journaling, progress tracking, and embedded YouTube content.

## 🌟 Features

- **Daily Devotions**: 20 days covering 4 biblical characters (David, Joseph, Gideon, Peter)
- **Shared Journal**: Dad and Dom can both write notes and see each other's thoughts
- **Progress Tracking**: Visual calendar showing completion status for both users
- **YouTube Videos**: Short (1-3 min) inspirational content embedded with each devotion
- **Password Protection**: Family code "John15:13" keeps it private
- **Mobile Responsive**: Works great on phones, tablets, and desktop

## 🚀 Quick Start (GitHub Pages - No Backend)

This version works immediately with NO setup. Uses browser localStorage for notes (notes stay on each device only).

1. **Fork this repository** to your GitHub account
2. Go to **Settings** → **Pages**
3. Set Source to **main branch**
4. Save and wait 1-2 minutes
5. Visit your site at: `https://[your-username].github.io/4d-devo/`

### Password
**Family Code**: `John15:13`

## 🔄 Full Setup (With Shared Notes - Recommended)

To enable shared notes between Dad and Dom's devices:

### Step 1: Create Free Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" (100% free forever)
3. Sign up with GitHub or email
4. Create a new project:
   - **Name**: 4D Devo
   - **Database Password**: (create a strong password - save it!)
   - **Region**: Choose closest to you
   - Click "Create new project"

### Step 2: Create Database Tables

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Paste this code:

```sql
-- Notes table
CREATE TABLE notes (
  id BIGSERIAL PRIMARY KEY,
  day INTEGER NOT NULL,
  user TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(day, user)
);

-- Completions table
CREATE TABLE completions (
  id BIGSERIAL PRIMARY KEY,
  day INTEGER NOT NULL,
  user TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(day, user)
);

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE completions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read/write (since we're password protecting the app itself)
CREATE POLICY "Allow all access to notes" ON notes
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to completions" ON completions
  FOR ALL USING (true) WITH CHECK (true);
```

4. Click **Run** (bottom right)

### Step 3: Get Your API Keys

1. In Supabase, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL**
   - **anon public** key (under "Project API keys")

### Step 4: Add Keys to Your App

1. Open `app.js` in your code editor
2. Find lines 2-3 at the top:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

3. Replace with your actual values:
```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_KEY = 'your-long-anon-key-here';
```

4. Save the file
5. Commit and push to GitHub

Done! Now notes and completions sync between devices! 🎉

## 📱 How to Use

1. **Login**: Enter family code `John15:13`
2. **Select User**: Choose "Dad" or "Dom"
3. **Read Daily Devotion**: 
   - Watch the short video
   - Read Scripture
   - Read "The Real Talk" reflection
   - Discuss the questions
4. **Write Notes**: Both can write thoughts in the shared journal
5. **Mark Complete**: Click the complete button when done
6. **Track Progress**: See calendar and stats in other tabs

## 📂 File Structure

```
4d-devo/
├── index.html          # Main app structure
├── styles.css          # All styling
├── app.js              # App logic & Supabase integration
├── devotions.js        # All 20 devotions with content
└── README.md           # This file
```

## 🎥 Adding More YouTube Videos

To customize the videos for each day:

1. Find a short (1-3 min) YouTube video
2. Get the video ID from the URL:
   - URL: `https://www.youtube.com/watch?v=ABC123`
   - Video ID: `ABC123`
3. In `devotions.js`, update the `youtubeId` field for that day
4. Save and push to GitHub

## 🔐 Changing the Password

To change the family code:

1. Open `app.js`
2. Find the `login()` function (around line 20)
3. Change `'John15:13'` to your new password
4. Save and push

## 📝 Adding Days 6-20

Currently only Week 1 (Days 1-5) are fully implemented. To add the remaining weeks:

1. Open `devotions.js`
2. Follow the structure of Days 1-5
3. Add Days 6-10 (Joseph week)
4. Add Days 11-15 (Gideon week)
5. Add Days 16-20 (Peter week)

Use the Word document content provided separately.

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css` (lines 11-24) to change week colors

### Names
Replace "Dad" and "Dom" throughout the code with your preferred names

## ❓ Troubleshooting

**Notes not syncing?**
- Check that Supabase keys are correct in `app.js`
- Check browser console for errors (F12)
- Verify database tables were created

**Can't login?**
- Password is case-sensitive
- Try: `John15:13` or `john15:13`

**Videos not loading?**
- Check that YouTube video IDs are correct
- Some videos may be restricted from embedding

## 💝 John 15:13

> "Greater love has no one than this: to lay down one's life for one's friends."

Made with ❤️ for Dad and Dom's faith journey together.
