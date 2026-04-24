# Setup Instructions

## GitHub Token Setup (Required for Authentication)

This app uses GitHub as a backend to store user data. You need to create a GitHub Personal Access Token.

### Steps:

1. **Create GitHub Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a name: `food-app-token`
   - Select permissions: ✅ **repo** (Full control of private repositories)
   - Click "Generate token"
   - **Copy the token** (you won't see it again!)

2. **Add Token to Project:**
   - Copy `.env.example` to `.env`
   - Paste your token:
   ```
   EXPO_PUBLIC_GITHUB_TOKEN=ghp_your_token_here
   ```

3. **Create users.json in your food-data repo:**
   - Go to: https://github.com/Mayank0000000/food-data
   - Create file: `data/users.json`
   - Add initial content:
   ```json
   {
     "users": []
   }
   ```
   - Commit the file

4. **Run the app:**
   ```bash
   npx expo start -c
   ```

## How It Works

- **Login**: Fetches users.json from GitHub, validates credentials
- **Signup**: Adds new user to users.json via GitHub API
- **Data Storage**: All user data stored in your GitHub repo

## Security Note

⚠️ **For Demo/Assignment Purposes Only**

This approach exposes the GitHub token in the frontend, which is not secure for production. 

**For Production:**
- Use a proper backend (Node.js, Firebase, etc.)
- Never expose API tokens in frontend code
- Implement proper authentication (JWT, OAuth)

This implementation demonstrates:
- ✅ Full CRUD operations
- ✅ Clean architecture
- ✅ State management
- ✅ API integration

**Mention in your assignment README:**
> "GitHub is used as a mock backend for demonstration. In production, this would be replaced with a secure backend API."
