# 🔐 GitHub Account Setup Guide

## ✅ Current Git Configuration

### What's Currently Configured:

**Name**: `Syed Danish Ali`  
**Email**: `danish.ali@purevpn.com`

This is your **Git identity** (shows in commits), but it's separate from your **GitHub account**.

---

## 🔍 How to Check Which GitHub Account You're Using

### Method 1: Check GitHub Website (Easiest)

1. Go to https://github.com and **sign in**
2. Check the **top-right corner** - it shows your username
3. Check **Settings → Profile** - shows your account details

### Method 2: Check SSH Keys

```bash
# List your SSH keys
cat ~/.ssh/id_rsa.pub
# or
cat ~/.ssh/id_ed25519.pub

# Then check which GitHub account it's added to:
# Go to https://github.com/settings/keys
# See which keys are registered
```

### Method 3: Check Stored Credentials

```bash
# Check credential helper
git config --global credential.helper

# Check stored credentials (Linux)
cat ~/.git-credentials 2>/dev/null

# Or check credential manager
git credential-manager list
```

### Method 4: Try Pushing (Shows Active Account)

When you push, GitHub will show which account is authenticated:

```bash
git push -u origin main
# It will show: "authenticated as YOUR_USERNAME"
```

---

## 🔄 How to Switch/Connect a Different GitHub Account

### Option 1: Change Git Config for This Project Only

If you want to use a **different account just for this project**:

```bash
cd /home/syed/Desktop/Assignment

# Set local (project-only) config
git config user.name "Your GitHub Username"
git config user.email "your.github@email.com"
```

### Option 2: Change Global Git Config

If you want to change for **all projects**:

```bash
# Change global username
git config --global user.name "Your New Name"

# Change global email
git config --global user.email "your.new@email.com"
```

**Note**: This changes your **Git identity**, not your **GitHub authentication**.

---

## 🔐 GitHub Authentication Methods

### Method 1: Personal Access Token (Recommended)

**Best for**: HTTPS authentication

1. **Generate Token**:

    - Go to: https://github.com/settings/tokens
    - Click "Generate new token" → "Generate new token (classic)"
    - Name: `Runtime Heatmap Project`
    - Expiration: `90 days` or `No expiration`
    - Select scopes: ✅ **`repo`** (full control of private repositories)
    - Click "Generate token"
    - **COPY THE TOKEN** (you won't see it again!)

2. **Use Token When Pushing**:

    ```bash
    git push -u origin main
    # Username: YOUR_GITHUB_USERNAME
    # Password: PASTE_YOUR_TOKEN_HERE (not your GitHub password!)
    ```

3. **Store Token Securely**:
    ```bash
    # Use credential helper to store
    git config --global credential.helper store
    # Or use cache (expires after timeout)
    git config --global credential.helper 'cache --timeout=3600'
    ```

### Method 2: SSH Keys (Most Secure)

**Best for**: Multiple accounts or professional use

1. **Check if you have SSH key**:

    ```bash
    ls -la ~/.ssh/id_*.pub
    ```

2. **Generate SSH key** (if needed):

    ```bash
    ssh-keygen -t ed25519 -C "your.github@email.com"
    # Press Enter to accept default location
    # Set a passphrase (optional but recommended)
    ```

3. **Add SSH key to GitHub**:

    ```bash
    # Copy your public key
    cat ~/.ssh/id_ed25519.pub
    # Copy the output

    # Then go to: https://github.com/settings/keys
    # Click "New SSH key"
    # Paste your key and save
    ```

4. **Test SSH connection**:

    ```bash
    ssh -T git@github.com
    # Should see: "Hi YOUR_USERNAME! You've successfully authenticated..."
    ```

5. **Use SSH URL for remote**:
    ```bash
    git remote set-url origin git@github.com:YOUR_USERNAME/runtime-heatmap.git
    ```

### Method 3: GitHub CLI (gh) - Easiest

**Best for**: Quick setup and authentication

1. **Install GitHub CLI**:

    ```bash
    # Ubuntu/Debian
    sudo apt install gh

    # Or download from: https://cli.github.com/
    ```

2. **Login**:

    ```bash
    gh auth login
    # Follow prompts - it will open browser for authentication
    ```

3. **Check logged-in account**:
    ```bash
    gh auth status
    ```

---

## 📝 Quick Setup for Your Project

### Step 1: Decide Which Account to Use

Ask yourself:

-   Is this for **work/company**? → Use work GitHub account
-   Is this for **personal portfolio**? → Use personal GitHub account
-   Is this for **assessment/submission**? → Use the account you want to showcase

### Step 2: Set Git Config (Project-Specific)

```bash
cd /home/syed/Desktop/Assignment

# Set for this project only
git config user.name "Your GitHub Username"
git config user.email "your.github.account@email.com"

# Verify
git config user.name
git config user.email
```

### Step 3: Create Repository on GitHub

1. Go to: https://github.com/new
2. **Repository name**: `runtime-heatmap-visualization`
3. **Description**: `Interactive runtime heatmap visualization with React and ECharts`
4. **Public** ✅
5. **DON'T** initialize with README
6. Click "Create repository"

### Step 4: Add Remote and Push

```bash
# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/runtime-heatmap-visualization.git

# Push (will prompt for credentials)
git push -u origin main
```

**When prompted**:

-   **Username**: Your GitHub username
-   **Password**: Your Personal Access Token (NOT your GitHub password!)

---

## 🔍 Check Active GitHub Account After Setup

### After First Push:

```bash
git push -u origin main
# Will show: "authenticated as YOUR_USERNAME"
```

### Check Remote URL:

```bash
git remote -v
# Shows which GitHub account the remote points to
```

### Check GitHub CLI (if installed):

```bash
gh auth status
# Shows logged-in account
```

---

## 🆘 Troubleshooting

### Issue: "Permission denied" or "Authentication failed"

**Solution**: Use Personal Access Token instead of password

1. Generate token: https://github.com/settings/tokens
2. Use token as password when pushing

### Issue: "Wrong account authenticated"

**Solution**: Clear stored credentials and re-authenticate

```bash
# Clear stored credentials
git credential-manager erase
# Or
rm ~/.git-credentials

# Try pushing again - will prompt for fresh credentials
```

### Issue: Want to use different account for different projects

**Solution**: Use local Git config per project

```bash
cd /project1
git config user.email "account1@email.com"

cd /project2
git config user.email "account2@email.com"
```

---

## ✅ Quick Commands Reference

```bash
# Check current Git config
git config --global user.name
git config --global user.email

# Change Git config (global)
git config --global user.name "New Name"
git config --global user.email "new@email.com"

# Change Git config (project-only)
cd /your/project
git config user.name "Project Name"
git config user.email "project@email.com"

# Check which GitHub account is authenticated
gh auth status

# Check remote URL
git remote -v

# Update remote URL (if wrong account)
git remote set-url origin https://github.com/CORRECT_USERNAME/repo.git
```

---

## 🎯 Recommendation

**For Your Assessment Project**:

1. **Use Personal Access Token** (easiest)
2. **Set project-specific Git config** (if different from global)
3. **Push to your preferred GitHub account**

**Quick Setup**:

```bash
cd /home/syed/Desktop/Assignment

# 1. Set your preferred account for this project
git config user.name "Your GitHub Username"
git config user.email "your.github@email.com"

# 2. Initialize and commit (if not done)
git init
git add .
git commit -m "Initial commit: Runtime Heatmap Visualization"

# 3. Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/runtime-heatmap.git
git branch -M main

# 4. Push (use Personal Access Token as password)
git push -u origin main
```

---

## 📝 Summary

-   **Current Git Config**: `Syed Danish Ali` / `danish.ali@purevpn.com`
-   **This is separate from GitHub authentication**
-   **You can use any GitHub account** - just authenticate when pushing
-   **Recommended**: Use Personal Access Token for HTTPS
-   **Alternative**: Use SSH keys for better security

**Ready to push!** Just create the repo on GitHub and authenticate when pushing. 🚀
