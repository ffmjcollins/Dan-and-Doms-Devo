# 🚀 Deployment Guide for 4D Devo

## Quick Start (5 Minutes)

### Option 1: Deploy Without Shared Notes (Fastest)

1. **Create GitHub Repository**
   - Go to [github.com](https://github.com) and login
   - Click the **+** in top right → **New repository**
   - Name it: `4d-devo`
   - Make it **Public**
   - Click **Create repository**

2. **Upload Files**
   - Click **uploading an existing file**
   - Drag ALL files from the `4d-devo-app` folder
   - Click **Commit changes**

3. **Enable GitHub Pages**
   - Go to **Settings** → **Pages**
   - Under "Source", select **main** branch
   - Click **Save**
   - Wait 2 minutes

4. **Visit Your Site!**
   - URL will be: `https://[your-username].github.io/4d-devo/`
   - Password: `John15:13`

✅ **Done!** App works now, but notes only save on each device (not shared).

---

### Option 2: Full Setup With Shared Notes (15 Minutes)

Follow **Option 1** first, then:

#### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" (FREE)
3. Sign up with GitHub
4. Create new project:
   - Name: `4d-devo`
   - Password: (create strong password and SAVE IT)
   - Region: Choose closest to you
   - Click "Create"

#### Step 2: Create Database Tables
1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Copy/paste this entire code block:

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

-- Allow all access (app is password protected)
CREATE POLICY "Allow all access to notes" ON notes
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to completions" ON completions
  FOR ALL USING (true) WITH CHECK (true);
```

4. Click **Run** (bottom right)
5. You should see "Success. No rows returned"

#### Step 3: Get API Keys
1. In Supabase, click **Settings** (gear icon) → **API**
2. Copy these two values (keep them safe!):
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string under "Project API keys")

#### Step 4: Update Your App
1. In your GitHub repo, click on `app.js`
2. Click the **pencil icon** (Edit)
3. Find lines 2-3:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

4. Replace with YOUR actual values:
```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_KEY = 'your-actual-long-anon-key-paste-here';
```

5. Scroll down and click **Commit changes**

#### Step 5: Test It!
1. Wait 1 minute for GitHub to redeploy
2. Visit your site: `https://[your-username].github.io/4d-devo/`
3. Login as "Dad", write a note
4. Open site on another device/browser
5. Login as "Dom" - you should see Dad's note!

🎉 **Success!** Notes now sync between devices!

---

## 📱 Testing the App

1. **Login**: Enter `John15:13`
2. **Choose User**: Click "Dad" or "Dom"
3. **Check Navigation**:
   - Today tab shows devotion
   - Calendar tab shows all 20 days
   - Progress tab shows stats
4. **Test Video**: Should auto-play YouTube embed
5. **Test Notes**: Write note, refresh page - should still be there
6. **Mark Complete**: Button should change to "Completed"

---

## 🎥 YouTube Video IDs

The app includes placeholder YouTube videos. To add better ones:

1. Find a good 1-3 min video on YouTube
2. Copy the video ID from URL:
   - URL: `youtube.com/watch?v=ABC123`
   - ID: `ABC123`
3. Edit `devotions.js` on GitHub
4. Find the day you want to update
5. Change `youtubeId: "old-id"` to `youtubeId: "new-id"`
6. Commit changes

### Suggested Christian YouTube Channels:
- **The Bible Project** - Animated Bible stories
- **Jefferson Bethke** - Short faith messages
- **David Platt** - Quick devotionals
- **Francis Chan** - Bite-sized sermons
- **Elevation Worship** - Worship + messages

---

## 🔧 Common Issues

### "Site not found" after deploying
- Wait 5 minutes for GitHub Pages to build
- Check Settings → Pages shows "Your site is live"
- Make sure repository is **public**

### Notes not syncing
- Check Supabase keys are correct in `app.js`
- Open browser console (F12) and look for errors
- Verify SQL tables were created successfully

### Password not working
- It's case-sensitive: `John15:13` (capital J)
- Try both: `John15:13` and `john15:13`

### Video won't play
- Some videos restrict embedding
- Try a different video ID
- Check video is not private/unlisted

---

## 📝 Next Steps

1. **Add Days 6-20**: Currently only Week 1 is fully built
   - Open `devotions.js`
   - Copy the structure from Days 1-5
   - Add content from your Word document

2. **Find Better Videos**: Replace placeholder YouTube IDs

3. **Customize Design**: Edit `styles.css` to change colors

4. **Share With Dom**: Send him the link!

---

## 💡 Tips

- **Do it together when possible** - The shared notes work great, but nothing beats face-to-face conversation
- **Set a regular time** - Morning before school works great
- **Keep phones nearby** - If you're apart, you can still both complete it and see each other's notes
- **Check the Progress tab** - Celebrate streaks together!

---

## ❤️ Need Help?

If you get stuck:
1. Check the main `README.md`
2. Look at browser console (F12) for errors
3. Re-read this guide carefully
4. Double-check Supabase keys are correct

---

Made with love for Dad and Dom's faith journey 🙏
