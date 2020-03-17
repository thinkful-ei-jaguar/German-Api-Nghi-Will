const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },
  
  
  getLanguageHead(db, language_id) {
    return db
        .from('word')
        .select(
            'id',
            'language_id',
            'original',
            'translation',
            'next',
            'memory_value',
            'correct_count',
            'incorrect_count',
        )
        .where({ language_id })
        .first()
  },
  
  getNextWord(db, wordId) {
    return db
        .from('word')
        .select(
            'id',
            'language_id',
            'original',
            'translation',
            'next',
            'memory_value',
            'correct_count',
            'incorrect_count',
        )
        .where({ id: wordId })
        .first()
  },
  

  
  updateWord(db, id, data) {
    return db('word')
        .where({ id })
        .update({ ...data });
  },
  
  updateTotalScore(db, id, total) {
    return db('language')
        .where({ id })
        .update({ total_score: total });
  },
}

module.exports = LanguageService;
