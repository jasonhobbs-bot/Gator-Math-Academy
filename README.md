# 🐊 Gator Math Academy — v0.9 (Teacher Demo)

A GitHub Pages-ready **offline/local-only demonstration** of Gilbert Elementary's K–5 math practice and side-scrolling adventure website.

## New in v0.9

- **Teacher Demo** tab to create fictional classes by grade, add fictional student aliases, and assign pilot Georgia math elements with 5–20 practice attempts and optional due dates.
- **Practice as** dropdown to switch between guest progress and mock student profiles on the **same browser**.
- **My demo assignments** on the Math Practice screen. Clicking an assignment opens its exact pilot element practice.
- Teacher roster dashboard shows attempts, correct answers, recent accuracy, and instructional practice milestones. Download a sample class report CSV.
- In-browser class, alias, and assignment deletion, with confirmations for destructive actions.
- All existing v0.8 student practice, element generators, adventure worlds, coins, checkpoints, and standards browser retained.
- Guest mode keeps legacy saved data under `gator-math-demo-v1`; new demo class data saves under `gator-math-teacher-demo-v09`.

## IMPORTANT: Not suitable for real student use

**Do not enter real student names, IDs, assessment records, or personally identifiable information.**

- Teacher tab is public to anyone with the URL, without a login.
- This is a **single-browser prototype**. A student's work on another Chromebook/iPad is **not** available to a teacher device.
- All data is stored in `localStorage` in that browser; students can change or delete their own sample progress. It is not a secure report card or a validated gradebook.
- Class assignments are not actually delivered to other devices, and dates are informational only.
- Practice milestone: for an assignment of 10+ attempts, at least the target number of answers and 85% accuracy in the latest 10. For 5-attempt assignments, the latest five answers must all be correct. It is a **practice milestone**, not evidence of official mastery.
- Only 31 pilot element codes are present; the official K–5 catalog is still incomplete. Question generators are not validated assessments.

**Before any schoolwide use:** implement district-approved identity/sign-in, authenticated teacher authorization with roster access controls, a protected server-side database and APIs, FERPA-aware data retention/deletion, accessibility and device testing, completed standards review, and adequate question-validation/assessment design. Do not use Google Sheets exposed publicly or GitHub Pages localStorage as the official student database.

## Try it

1. Open `index.html` in Chrome, or deploy the full folder to GitHub Pages (Settings → Pages → Deploy from branch, `main` and `/root`).
2. Open **Teacher Demo** to see a fictional Grade 3 class with Gator A and Gator B and a sample element assignment.
3. Add a fictional alias or create another sample class; assign a grade-matched element.
4. Under **Practice as**, choose the fictional gator. Click **Practice this element** to answer questions; return to **Teacher Demo** to see the updated attempts.
5. Download demo CSV reports as needed. Clear browser storage to reset all demo data.

## Files

- `index.html` - complete website and demo teacher dashboard, no external JS dependencies.
- `standards-elements.json`, `standards-elements.csv` - pilot standards-element catalog (NOT a complete official catalog).
- `catalog-schema.csv` - data structure reference.

## QA

- JavaScript syntax check and browser smoke test should be completed after release build.
