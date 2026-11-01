# Gator Math Academy — prototype v0.1

## What works
- Kindergarten through Grade 5 selection
- Multiple-choice problem generation in sample practice categories
- Immediate correction and hints
- Local-browser persistence for nicknames, practice counts, and coins
- Adventure world selector that launches practice
- Accuracy report and CSV export
- Searchable *starter* standards catalog
- Works in a browser, including touch-oriented iPads and Chromebooks

## Important standards alignment limitation
This is **NOT** the complete K–5 standards/elements catalog. Verified top-level identifiers in this prototype were checked against the Georgia Department of Education CASE standards listing for K, Grade 2 and part of Grade 5. Other grade-level topics are **provisional**, deliberately without made-up standard identifiers. Individual element identifiers (such as K.NR.1.1) are not yet included. A full, verified export and review of *every* K–5 standard and numbered element is still required before using it to track standards mastery.

Official sources:
- https://gadoe.org/learning/mathematics/
- https://case.georgiastandards.org/e9dd7229-3558-4df2-85c6-57b8938f6180/46bd1149-f034-4eca-a8f9-35174a68c0f8

Practice question generators demonstrate concepts but have not been formally reviewed against each standards element. Accuracy is not a validated mastery metric.

## Deploy with GitHub Pages
1. Create a GitHub repository named `gator-math-academy` (or another name).
2. Upload `index.html` to the repository root.
3. Go to **Settings → Pages → Build and deployment**.
4. Select **Deploy from a branch**, `main`, and `/ (root)`; save.
5. Visit the Pages URL shown by GitHub.

For a first preview, open `index.html` in a browser.

## Student privacy and school launch
All progress is kept in localStorage in the current browser. It is not shared across devices, cannot support classwide reporting, and may be erased when browser data is cleared. **Do not collect real student identifying information in the prototype.** A real deployment needs district-approved login, storage, access controls, FERPA review, teacher roster management, and an auditable student record system.

## Next milestone
1. Acquire authoritative Georgia K–5 standards with individual elements from current GaDOE CASE/grade-level documents.
2. Create normalized `standards.json` with grade, strand, parent code, element code, wording, source, version, verification status.
3. Manually quality-check all codes and wording before declaring catalog complete.
4. Map multiple question generators and accessible visual models to every applicable element; verify correctness and grade-level constraints.
5. Add teacher assignment UI, authenticated users and secure database.
6. Expand adventure into a world map with levels, characters, and rewards tied to validated evidence of skill proficiency.
