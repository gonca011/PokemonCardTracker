Hello, dear pokemon fans.


This is just a small project I did to spend time during summer.

## Updating card images

Whenever you add new card pictures inside a folder under `cards/`, follow these steps before pushing to GitHub:

1. Put the new image files in the correct expansion folder inside `cards/`.
2. Make sure the image type is tracked by Git LFS. This repository already tracks `.jpg` and `.webp` files. If you plan to use another extension, add it to `.gitattributes` first so Git LFS will pick it up.
3. Regenerate every per-expansion `cards.json` file by running:

```bash
python generate_cards_json.py
```

4. Regenerate the global `cards/all_cards.json` file by running:

```bash
node scripts/generateAllCards.js
```

5. Check the result before committing:

```bash
git status
```

6. Commit the new images together with the updated JSON files, then push the branch to GitHub. Git LFS will upload the image files as long as they are tracked by the LFS rules.

If you add a brand new expansion folder, also add its name to `sets.json` so it is included when `all_cards.json` is rebuilt.
