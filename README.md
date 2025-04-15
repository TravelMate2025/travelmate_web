# 🚀 TravelMate Git Workflow

🔧 1. Initial Setup
Create the development branch from main:

git checkout -b development
git push -u origin development


👨‍💻2. Daily Development Workflow
🔁 All day-to-day commits go to development.
📦 Create feature branches from development:

git checkout development
git pull origin development        # Always pull the latest
git checkout -b feature/something  # Create a new feature branch


🛠 Work on your feature:

# Make changes...
git add .
git commit -m "Add feature X"


🔄 3. Sync Your Feature with Latest Development
Before you open a pull request:


git checkout development
git pull origin development        # Get the latest development changes

git checkout feature/something
git merge development              # OR: git rebase development
# Resolve any merge conflicts
git push                           # Push updated feature branch


✅ Now your feature branch is up to date with development.

🚀 4. Push and Open a Pull Request

git push -u origin feature/something

Go to GitHub
Create a PR into development
Team leads can assign a different target branch if needed
Merge only after review and tests pass


✅ 5. Releasing to Production
When you're ready to release:


git checkout main
git pull origin main              # Ensure it's up to date
git merge development
git push origin main



# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
