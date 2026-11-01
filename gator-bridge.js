
/*
 GATOR MATH ACADEMY
 GITHUB BRIDGE — PART 1 OF 3
 Connects the GitHub game to the school portal.
*/

(() => {
  "use strict";

  const APP = "GATOR_MATH_BRIDGE_V1";

  const pending = new Map();

  let schoolOrigin = null;
  let mode = "local";
  let serial = 0;

  // Show the current connection status.
  const badge = document.createElement("span");

  badge.id = "schoolBridgeStatus";

  badge.style.cssText =
    "display:inline-block;" +
    "padding:9px 12px;" +
    "border-radius:12px;" +
    "background:#fff3cf;" +
    "color:#563e0c;" +
    "font-weight:700;" +
    "font-size:13px;";

  badge.textContent =
    "🟡 Local demo — scores stay on this device";

  (
    document.querySelector("header .top") ||
    document.body
  ).appendChild(badge);

  // Accept responses only from Google Apps Script.
  function allowedSchoolOrigin(origin) {
    try {
      const url = new URL(origin);

      return url.protocol === "https:" && (
        url.hostname === "script.google.com" ||
        url.hostname === "script.googleusercontent.com" ||
        url.hostname.endsWith(".googleusercontent.com")
      );

    } catch (_) {
      return false;
    }
  }

  // Receive messages from the school portal.
  window.addEventListener("message", event => {

    if (
      event.source !== window.parent ||
      !allowedSchoolOrigin(event.origin)
    ) return;

    const msg = event.data;

    if (!msg || msg.app !== APP) return;

    // Connection established.
    if (
      msg.type === "CONNECTED" &&
      ["student", "preview"].includes(msg.mode)
    ) {

      schoolOrigin = event.origin;
      mode = msg.mode;

      badge.textContent = mode === "student"
        ? "🟢 School connected — answers can be saved"
        : "🟠 Teacher preview — scores are not saved";

      window.dispatchEvent(
        new CustomEvent("gator-school-connected", {
          detail: { mode }
        })
      );
    }

    // Receive a server-graded question result.
    if (
      msg.type === "RESPONSE" &&
      event.origin === schoolOrigin
    ) {

      const job = pending.get(msg.requestId);

      if (!job) return;

      pending.delete(msg.requestId);

      clearTimeout(job.timer);

      if (msg.ok) {
        job.resolve(msg.data);
      } else {
        job.reject(
          new Error(
            String(msg.error || "School request failed")
          )
        );
      }
    }
  });

  // Request information through Google Apps Script.
  function request(type, values) {

    if (mode !== "student" || !schoolOrigin) {
      return Promise.reject(
        new Error(
          "School scoring requires an enrolled " +
          "student account in the school portal."
        )
      );
    }

    const requestId =
      "gator-" + Date.now() + "-" + (++serial);

    return new Promise((resolve, reject) => {

      const timer = setTimeout(() => {

        pending.delete(requestId);

        reject(
          new Error(
            "School connection timed out. Try again."
          )
        );

      }, 25000);

      pending.set(requestId, {
        resolve,
        reject,
        timer
      });

      window.parent.postMessage({
        app: APP,
        type,
        requestId,
        ...values
      }, schoolOrigin);

    });
  }

  // Functions the adventure will use later.
  window.GatorMathBridge = Object.freeze({

    getMode: () => mode,

    askQuestion: code =>
      request("QUESTION_REQUEST", { code }),

    submitAnswer: (id, answer) =>
      request("ANSWER_SUBMIT", { id, answer })

  });

  // Announce that the GitHub game is ready.
  // No student information is sent.
  if (window.parent !== window) {

    window.parent.postMessage({
      app: APP,
      type: "READY",
      version: 1
    }, "*");

  }

})();
