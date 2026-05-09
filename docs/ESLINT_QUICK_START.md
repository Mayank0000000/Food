# ESLint Quick Start Guide

## ✅ Setup Complete!

ESLint has been successfully configured for your FooD project with:
- TypeScript support
- React & React Hooks rules
- Code style enforcement
- Prettier integration

## 🚀 Quick Commands

```bash
# Check for linting issues
npm run lint

# Auto-fix issues
npm run lint:fix

# Format code with Prettier
npm run format

# Type check
npm run type-check
```

## 📊 Current Status

After running `npm run lint:fix`, you have:
- **12 errors** (need manual fixing)
- **284 warnings** (mostly console.log statements and React Hook dependencies)

## 🔧 Common Fixes Needed

### 1. Console Statements
Replace `console.log()` with `console.warn()`, `console.error()`, or `console.info()`:

```typescript
// ❌ Bad
console.log('Debug info');

// ✅ Good
if (__DEV__) {
  console.info('Debug info');
}
```

### 2. React Hook Dependencies
Add missing dependencies to useEffect/useCallback/useMemo:

```typescript
// ❌ Bad
useEffect(() => {
  loadData();
}, []);

// ✅ Good
useEffect(() => {
  loadData();
}, [loadData]);
```

### 3. Unused Variables
Prefix unused variables with underscore:

```typescript
// ❌ Bad
const UPDATE_INTERVAL = 1000;

// ✅ Good
const _UPDATE_INTERVAL = 1000;
// or remove if truly unused
```

## 🎯 VS Code Integration

1. Install extensions:
   - **ESLint** (dbaeumer.vscode-eslint)
   - **Prettier** (esbenp.prettier-vscode)

2. Restart VS Code

3. Code will auto-format on save!

## 📝 Configuration Files

- `eslint.config.js` - ESLint rules
- `.prettierrc.js` - Prettier formatting
- `.vscode/settings.json` - VS Code integration

## 📚 Full Documentation

See `docs/ESLINT_SETUP.md` for complete documentation.

## 🐛 Troubleshooting

### ESLint not working?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### VS Code not auto-fixing?
1. Check if ESLint extension is installed
2. Restart VS Code
3. Check Output panel (View → Output → ESLint)

## 🎉 Next Steps

1. Run `npm run lint:fix` to auto-fix remaining issues
2. Manually fix the 12 errors
3. Review and fix warnings as needed
4. Commit your changes

---

**Happy Coding! 🚀**
