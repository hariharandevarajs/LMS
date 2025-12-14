# How to Upload to GitHub

Your code is ready to push! You just need to authenticate with GitHub.

## 🔐 Authentication Required

GitHub no longer accepts passwords. You need to use a **Personal Access Token**.

### Step 1: Create a Personal Access Token

1. Go to GitHub.com and sign in
2. Click your profile picture → **Settings**
3. Scroll down to **Developer settings** (bottom left)
4. Click **Personal access tokens** → **Tokens (classic)**
5. Click **Generate new token** → **Generate new token (classic)**
6. Give it a name like "LMS Project"
7. Select scopes: Check **repo** (this gives full repository access)
8. Click **Generate token**
9. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)

### Step 2: Push Your Code

Run this command in your terminal:

```bash
git push -u origin main
```

When prompted:
- **Username:** Enter your GitHub username (`hariharandevarajs`)
- **Password:** Paste your Personal Access Token (NOT your GitHub password)

---

## Alternative: Use SSH (More Secure)

If you prefer SSH authentication:

### Step 1: Generate SSH Key (if you don't have one)

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Press Enter to accept default location. You can skip the passphrase or set one.

### Step 2: Add SSH Key to GitHub

1. Copy your public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
   (On Windows: `type C:\Users\YourUsername\.ssh\id_ed25519.pub`)

2. Go to GitHub → Settings → SSH and GPG keys
3. Click **New SSH key**
4. Paste your key and save

### Step 3: Change Remote to SSH

```bash
git remote set-url origin git@github.com:hariharandevarajs/LMS.git
git push -u origin main
```

---

## ✅ Quick Commands Summary

**Using HTTPS with Token:**
```bash
git push -u origin main
# Enter username: hariharandevarajs
# Enter password: [paste your token]
```

**Using SSH:**
```bash
git remote set-url origin git@github.com:hariharandevarajs/LMS.git
git push -u origin main
```

---

## 🎯 What's Already Done

✅ Git repository initialized  
✅ All files committed  
✅ Remote repository added  
✅ Branch renamed to `main`  
✅ `.gitignore` configured (`.env` files excluded)

You just need to authenticate and push!

---

## 📝 Future Updates

After the initial push, you can update your code with:

```bash
git add .
git commit -m "Your commit message"
git push
```

