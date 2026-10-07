import { get, send } from "../shared/services";
// TODO(Member 3): confirm catalog and notebook-by-ID endpoints. Demo data is isolated here.
const demoWords = [
  {
    id: 9001,
    word: "phở",
    meaning: "Vietnamese noodle soup",
    pronunciation: "fəː",
    example: "Tôi muốn một tô phở.",
  },
  {
    id: 9002,
    word: "một tô",
    meaning: "a bowl",
    pronunciation: "mot toh",
    example: "Cho tôi một tô phở.",
  },
  {
    id: 9003,
    word: "gọi món",
    meaning: "to order food",
    pronunciation: "goy mon",
    example: "Bạn muốn gọi món gì?",
  },
];
export const vocabularyIntegrationService = {
  demo: import.meta.env.VITE_DEMO_INTEGRATIONS === "true",
  async getByIds(ids) {
    if (this.demo) return demoWords.filter((w) => ids.includes(w.id));
    return get("/vocabularies", { ids: ids.join(",") });
  },
  async saveToNotebook(id) {
    if (this.demo) {
      const word = demoWords.find((w) => w.id === id);
      if (!word) throw new Error("Demo word not found.");
      return send("/me/vocabulary", {
        word: word.word,
        meaning: word.meaning,
        pronunciation: word.pronunciation,
        exampleSentence: word.example,
      });
    }
    return send(`/users/me/vocabulary/${id}`);
  },
};
