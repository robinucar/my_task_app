# 🧷 Git Hooks — Husky Setup

This project uses [Husky](https://typicode.github.io/husky) to enforce code quality, commit message standards, testing, and security checks before allowing commits.

---

## 📦 Tools Used

| Tool             | Purpose                                  |
| ---------------- | ---------------------------------------- |
| **Husky**        | Git hook manager                         |
| **commitlint**   | Validates conventional commit messages   |
| **ESLint**       | Lints TypeScript/JavaScript code         |
| **Prettier**     | Formats code consistently                |
| **pretty-quick** | Formats only staged files                |
| **Jest**         | Runs tests before commit                 |
| **npm audit**    | Checks for known vulnerabilities (high+) |

---

## 🪝 Git Hooks Overview

### 🔸 `commit-msg`

Runs `commitlint` to ensure all commit messages follow the conventional format.

#### 📄 Config: `commitlint.config.js`

```
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore'],
    ],
  },
};
```

#### ✅ Allowed commit types:

- feat: A new feature
- fix: A bug fix
- docs: Documentation only changes
- style: Changes that do not affect the meaning of the code (e.g. formatting)
- refactor: Code changes that neither fix a bug nor add a feature
- perf: Performance improvement
- test: Adding or updating tests
- chore: Maintenance (e.g. tooling, build tasks)

### 🔸 pre-commit

Runs several checks before allowing a commit:

1. ✅ Linting — runs npm run lint
2. ✅ Formatting — formats only staged files via pretty-quick
3. ✅ Testing — runs full test suite using npm test
4. ✅ Security Audit — runs npm audit with high severity check

## 🛠 Setup Notes

- If Git hooks are not triggering after cloning:

```
npx husky install
```

- To ensure automatic setup, add this to root package.json:

```
"scripts": {
  "prepare": "husky install"
}
```
