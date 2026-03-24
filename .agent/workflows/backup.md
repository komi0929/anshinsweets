---
description: How to backup (commit & push) changes to GitHub
---

# Backup Workflow

Run this workflow after completing any significant changes to ensure all work is saved to GitHub.

## Steps

// turbo-all

1. Run the backup script with a descriptive commit message:
```
powershell -File scripts/backup.ps1 "feat: description of changes"
```

2. If the backup script is not available, run these commands manually:
```
git add -A
git commit -m "feat: description of changes"
git push
```

3. Verify the push succeeded by checking git status:
```
git status
```

## Commit Message Convention

- `feat:` — new features
- `fix:` — bug fixes  
- `refactor:` — code restructuring
- `style:` — CSS/formatting changes
- `docs:` — documentation
- `backup:` — auto-save backups

## Important Rules

- **Always backup after completing a task** — never leave uncommitted changes
- **Use descriptive commit messages** — not just "backup"
- **Check for build errors BEFORE committing** when possible
