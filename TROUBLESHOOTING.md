# 🔧 TROUBLESHOOTING LOGIN ISSUES

## If Password Doesn't Work:

### **Step 1: Open Browser Console**

**On Chrome/Edge:**
- Press **F12** or **Ctrl+Shift+J** (Windows)
- Press **F12** or **Cmd+Option+J** (Mac)

**On Firefox:**
- Press **F12** or **Ctrl+Shift+K** (Windows)
- Press **F12** or **Cmd+Option+K** (Mac)

**On Safari:**
- Press **Cmd+Option+C**

### **Step 2: Check for Errors**

When you open the console, you'll see messages. Look for:
- **Red text** = errors
- **Blue text** = info messages

### **Step 3: Test the Login**

1. Type the password: `John15:13`
2. Click the Enter button
3. Watch the console

You should see messages like:
```
Login function called
Password entered: John15:13
Password length: 9
Password correct! Logging in...
Switching to screen: name-screen
```

### **Common Issues:**

#### **"Login function called" doesn't appear**
- JavaScript isn't loading
- Try refreshing the page (Ctrl+F5)
- Make sure all 6 files uploaded correctly

#### **"Password incorrect" even with right password**
- Check for extra spaces
- Try copy/paste: `John15:13`
- Make sure it's exactly: Capital J, lowercase rest, colon (not period)

#### **"Screen not found: name-screen"**
- HTML file is corrupted
- Re-upload the files

#### **Nothing appears in console at all**
- JavaScript is blocked
- Try different browser
- Check if JavaScript is enabled in browser settings

---

## Quick Test Files

### **TEST_LOGIN.html**
- A simple test page to verify password works
- Open this file directly in browser (no GitHub needed)
- Will tell you exactly what you're typing

---

## Still Not Working?

### **Try This:**

1. **Open the test file** (`TEST_LOGIN.html`)
2. **Type the password** exactly: `John15:13`
3. **Click Test Login**
4. **See if it says** "✅ CORRECT!"

If the test file works but the main app doesn't:
- The main app files may be corrupted
- Try re-downloading and re-uploading all 6 files

---

## The Correct Password:

**`John15:13`**

Must be:
- Capital **J**
- Lowercase **ohn**
- Number **15**
- Colon **:**
- Number **13**
- **NO SPACES**

Copy this exactly: `John15:13`

---

## Emergency Contact

If you're stuck, take a screenshot of:
1. The login screen
2. The browser console (after pressing F12)
3. Any error messages

This will help debug what's happening!
