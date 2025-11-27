// highscore-service.js
// Centrale laag voor highscores (nu alleen lokaal via localStorage).
// Later kun je hier eenvoudig een online backend (Supabase/Firebase/API) koppelen.

const HighscoreService = (() => {
  const MODE = "local"; // toekomst: "remote"

  const GAME_IDS = {
    CLICK: "click",
    HARBOR: "harbor",
  };

  function storageKey(gameId) {
    return `hs_${gameId}`;
  }

  function submitScore(gameId, name, score) {
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
    console.warn("Remote highscore backend nog niet ingesteld");
  }

  function fetchTopScores(gameId, limit = 10) {
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

    console.warn("Remote highscore backend nog niet ingesteld");
    return [];
  }

  return {
    submitScore,
    fetchTopScores,
    GAME_IDS,
  };
})();