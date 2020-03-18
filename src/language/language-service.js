const LinkedList = require("./LinkedList");

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from("language")
      .select(
        "language.id",
        "language.name",
        "language.user_id",
        "language.head",
        "language.total_score"
      )
      .where("language.user_id", user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from("word")
      .select(
        "id",
        "language_id",
        "original",
        "translation",
        "next",
        "memory_value",
        "correct_count",
        "incorrect_count"
      )
      .where({ language_id });
  },

  getLanguageHead(db, language_id) {
    return db
      .from("word")
      .select(
        "id",
        "language_id",
        "original",
        "translation",
        "next",
        "memory_value",
        "correct_count",
        "incorrect_count"
      )
      .where({ language_id })
      .first();
  },

  getNextWord(db, wordId) {
    return db
      .from("word")
      .select(
        "id",
        "language_id",
        "original",
        "translation",
        "next",
        "memory_value",
        "correct_count",
        "incorrect_count"
      )
      .where({ id: wordId })
      .first();
  },
  updateWord(db, id, data) {
    return db
      .from("word")
      .where({ id })
      .update({ ...data });
  },

  updateTotalScore(db, user_id) {
    // Get current score and increment 1
    const total_score =
      db
        .from("language")
        .select("total_score")
        .where({ user_id }) + 1;

    return db
      .from("language")
      .where({ user_id })
      .update({ total_score });
  },

  getAnswer(db, original) {
    return db
      .from("word")
      .select("translation")
      .where({ original });
  },

  createLinkedList(head, words) {
    let wordList = this.createMap(words);
    let LL = new LinkedList();
    let currNode = head;

    while (currNode !== null) {
      const word = wordList.get(currNode);
      LL.insertLast(word.original);
      currNode = word.next;
    }

    return LL;
  },
  // Store words in map for easier lookup
  createMap(words) {
    let wordsList = new Map();
    for (const index of words) {
      wordsList.set(index.id, { original: index.original, next: index.next });
    }
    return wordsList;
  }
};

module.exports = LanguageService;
