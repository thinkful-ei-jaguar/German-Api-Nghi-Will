const LinkedList = require('./LinkedList');

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
        "word.id",
        "word.language_id",
        "word.original",
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


  
  convertLinkedList(words) {
    const linkedList = new LinkedList();
    words.forEach(word => linkedList.insertLast(word));
    return linkedList;
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
  }
};

module.exports = LanguageService;
