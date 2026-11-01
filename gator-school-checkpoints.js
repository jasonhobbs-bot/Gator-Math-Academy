
/*
 * GATOR MATH ACADEMY — GITHUB BRIDGE PART 3
 * Adds Apps Script-graded questions to the three platform-game checkpoints.
 * Requires gator-bridge.js to be loaded immediately before this file.
 * GitHub/local demo remains local-only when no enrolled student is connected.
 */
(() => {
  "use strict";

  // This add-on targets the side-scrolling game from Gator Math Academy v0.9.
  if (typeof window.showGameQuiz !== "function" ||
      typeof game === "undefined" ||
      typeof checkpoints === "undefined") {
    console.error("Gator checkpoint bridge: game v0.9 checkpoint functions not found.");
    return;
  }

  const localGameQuiz = window.showGameQuiz;
  const bridge = window.GatorMathBridge;
  if (!bridge || typeof bridge.askQuestion !== "function" ||
      typeof bridge.submitAnswer !== "function") {
    console.error("Gator checkpoint bridge: load gator-bridge.js first.");
    return;
  }

  // These are the pilot elements currently supported by the Apps Script server.
  // Other GitHub elements still work in local demo mode, not school scoring.
  const schoolCodes = new Set([
    "K.NR.4.1", "K.NR.4.2", "K.MDR.7.2",
    "1.NR.2.1", "1.NR.2.5",
    "2.NR.3.1", "2.NR.3.2",
    "3.NR.1.3", "3.PAR.3.2",
    "4.NR.2.1", "4.NR.2.3", "4.NR.2.4",
    "5.NR.3.1", "5.NR.3.2", "5.NR.3.4"
  ]);

  let requestVersion = 0;
  let savingAnswer = false;

  const el = id => document.getElementById(id);
  const isSchoolStudent = () => bridge.getMode() === "student";

  // Separate confirmed school coins from locally collected game coins.
  const schoolCoins = document.createElement("span");
  schoolCoins.id = "schoolCheckpointCoins";
  schoolCoins.textContent = "🏫 Saved school math coins: —";
  schoolCoins.style.cssText =
    "display:none; padding:9px 12px; border-radius:12px;" +
    "font-weight:750; background:#dff5e7; color:#13563b; font-size:13px;";
  (document.querySelector("header .top") || document.body)
    .appendChild(schoolCoins);

  function updateSchoolView() {
    schoolCoins.style.display = isSchoolStudent() ? "inline-block" : "none";
    // The original public, browser-only teacher demo isn't the real dashboard.
    const demoTab = document.querySelector('[data-tab="teacher"]');
    if (demoTab && isSchoolStudent()) demoTab.hidden = true;
  }

  function renderNotice(message, cp, retry) {
    el("gameQuiz").hidden = false;
    el("checkpointElement").textContent =
      "🏫 School-scored checkpoint";
    el("gameQuizText").textContent = message;
    el("gameQuizFeedback").textContent =
      "School answers are recorded only when the school connection works.";
    const choices = el("gameQuizChoices");
    choices.replaceChildren();
    const button = document.createElement("button");
    button.className = "action secondary";
    button.textContent = retry;
    button.onclick = () => {
      // Changing an element pauses the original game. Resume the checkpoint.
      game.paused = false;
      if (el("gamePause")) el("gamePause").textContent = "⏸ Pause";
      window.showGameQuiz(cp);
    };
    choices.appendChild(button);
  }

  function selectedSchoolCode() {
    const code = String(el("adventureElement")?.value || "").trim();
    const gradeValue = String(el("grade")?.value || "").trim();
    if (!schoolCodes.has(code) || code.split(".")[0] !== gradeValue) {
      return null;
    }
    return code;
  }

  function finishCheckpoint(cp) {
    game.quizDone.add(cp);
    game.quiz = false;
    el("gameQuiz").hidden = true;
    game.x = Math.max(game.x, checkpoints[cp].x + 35);
    renderWorldsStatus();
  }

  async function loadSchoolQuestion(cp, version) {
    const code = selectedSchoolCode();
    if (!code) {
      renderNotice(
        "Choose a supported math element in the Adventure Element dropdown " +
        "for your school grade, then choose Try Again. " +
        "This school pilot supports only a subset of the GitHub elements.",
        cp, "↻ Try Again"
      );
      return;
    }

    el("gameQuiz").hidden = false;
    el("checkpointElement").textContent = "🏫 School element: " + code;
    el("gameQuizText").textContent = "Loading your school math question…";
    el("gameQuizFeedback").textContent = "";
    el("gameQuizChoices").replaceChildren();

    let q;
    try {
      q = await bridge.askQuestion(code);
    } catch (error) {
      if (version !== requestVersion || !game.quiz) return;
      renderNotice(
        "Couldn't load a school question: " + error.message +
        ". Check your enrolled school account and grade selection.",
        cp, "↻ Retry School Question"
      );
      return;
    }
    if (version !== requestVersion || !game.quiz || !isSchoolStudent()) return;
    if (!q || !q.id || !Array.isArray(q.choices) || !q.choices.length) {
      renderNotice("The server returned an invalid question.", cp, "↻ Retry");
      return;
    }

    el("gameQuizText").textContent = String(q.prompt || "Math checkpoint");
    el("gameQuizFeedback").textContent =
      "Answer this question to open the path. Each answer is saved.";
    const choices = el("gameQuizChoices");
    choices.replaceChildren();

    q.choices.forEach(value => {
      const button = document.createElement("button");
      button.className = "choice";
      button.textContent = String(value);
      button.onclick = async () => {
        if (savingAnswer || version !== requestVersion || !game.quiz) return;
        savingAnswer = true;
        Array.from(choices.querySelectorAll("button"))
          .forEach(b => { b.disabled = true; });
        el("gameQuizFeedback").textContent = "Checking with your school…";

        try {
          const result = await bridge.submitAnswer(q.id, String(value));
          if (version !== requestVersion || !game.quiz) return;
          if (typeof result.coins === "number") {
            schoolCoins.textContent =
              "🏫 Saved school math coins: " + result.coins;
          }
          if (result.correct) {
            // The server has already saved this answer and awarded school coins.
            // Do NOT award local checkpoint coins or write a duplicate attempt.
            finishCheckpoint(cp);
          } else {
            el("gameQuizFeedback").textContent =
              "Not quite. Correct answer: " + String(result.answer ?? "") +
              ". " + String(result.hint || "") +
              " New question coming…";
            // The server consumes a question ID after one answer.
            // A wrong answer requires a NEW server question, not a retry.
            savingAnswer = false;
            await loadSchoolQuestion(cp, version);
          }
        } catch (error) {
          if (version === requestVersion && game.quiz) {
            renderNotice(
              "Your answer could not be confirmed: " + error.message +
              ". No reward was applied by this game. " +
              "Retry with a new question; the server may have recorded the last answer.",
              cp, "↻ Get New Question"
            );
          }
        } finally {
          savingAnswer = false;
        }
      };
      choices.appendChild(button);
    });
  }

  // Replace only the platform game's checkpoint UI.
  // Local demo still uses the original game questions and local coins.
  window.showGameQuiz = function (cp) {
    requestVersion++;
    if (!isSchoolStudent()) {
      return localGameQuiz(cp);
    }
    savingAnswer = false;
    void loadSchoolQuestion(cp, requestVersion);
  };

  window.addEventListener("gator-school-connected", () => {
    updateSchoolView();
    // A school connection may arrive after a local question was displayed.
    // Replace any in-progress checkpoint with the authenticated server version.
    if (isSchoolStudent() && game.quiz) {
      const active = checkpoints.find(cp =>
        game.x >= cp.x && !game.quizDone.has(cp.id)
      );
      if (active) window.showGameQuiz(active.id);
    }
  });

  updateSchoolView();
})();
