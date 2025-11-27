// highscore-service.js
// Centrale laag voor highscores.
// Nu: lokaal via localStorage
// Toekomst: hier kun je eenvoudig een online backend (Supabase/Firebase/API) koppelen.

const HighscoreService = (() => {
  const MODE = "local"; // later kun je hier "remote" van maken

  const GAME_IDS = {
    CLICK: "click",
    HARBOR: "harbor",
  };

  function storageKey(gameId) {
    return `hs_${gameId}`;
  }

  async function submitScore(gameId, name, score) {
    if (!name || !name.trim()) name = "Kapitein";
    if (typeof score !== "number" || isNaN(score)) return;

    if (MODE === "local") {
      const key = storageKey(gameId);
      let list;
      try {
        list = JSON.parse(localStorage.getItem(key) || "[]");
        if (!Array.isArray(list)) list = [];
      } catch {
        list = [];
      }

      list.push({
        name: name.trim(),
        score,
        date: new Date().toISOString(),
      });

      list.sort((a, b) => b.score - a.score);
      list = list.slice(0, 50); // max 50 bewaren

      localStorage.setItem(key, JSON.stringify(list));
      return;
    }

    // === TOEKOMST: REMOTE BACKEND ===
    // Hier later bijvoorbeeld:
    // await fetch("https://jouw-api/score", { method: "POST", body: JSON.stringify({ gameId, name, score }) });
    console.warn("Remote highscore backend nog niet ingesteld");
  }

  async function fetchTopScores(gameId, limit = 10) {
    if (MODE === "local") {
      const key = storageKey(gameId);
      try {
        const list = JSON.parse(localStorage.getItem(key) || "[]");
        if (!Array.isArray(list)) return [];
        return list.slice(0, limit);
      } catch {
        return [];
      }
    }

    // === TOEKOMST: REMOTE BACKEND ===
    console.warn("Remote highscore backend nog niet ingesteld");
    return [];
  }

  return {
    submitScore,
    fetchTopScores,
    GAME_IDS,
  };
})();