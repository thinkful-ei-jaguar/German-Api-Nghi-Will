const express = require("express");
const LanguageService = require("./language-service");
const { requireAuth } = require("../middleware/jwt-auth");

const languageRouter = express.Router();
const jsonParser = express.json();

languageRouter
  .use(requireAuth)
  .use(jsonParser)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get("db"),
        req.user.id
      );

      if (!language)
        return res.status(404).json({
          error: "You don't have any languages"
        });

      req.language = language;
      next();
    } catch (error) {
      next(error);
    }
  });

languageRouter.get("/", async (req, res, next) => {
  try {
    const words = await LanguageService.getWords(
      req.app.get("db"),
      req.language.id
    );

    res.json({
      language: req.language,
      words
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.use(jsonParser).get("/head", async (req, res, next) => {
  try {
    const head = await LanguageService.getNextWord(
      req.app.get("db"),
      req.language.head,
      req.language.user_id
    );

    res.status(200).json({
      nextWord: head.original,
      answer: head.translation,
      totalScore: req.language.total_score,
      wordCorrectCount: head.correct_count,
      wordIncorrectCount: head.incorrect_count
    });

    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.post("/guess", jsonParser, async (req, res, next) => {
  const { guess } = req.body;

  if (!guess)
    return res.status(400).json({
      error: `Missing 'guess' in request body`
    });

  try {
    // Get words from database
    const words = await LanguageService.getWords(
      req.app.get("db"),
      req.language.id
    );

    // Create linked list of words
    let SLL = await LanguageService.createLinkedList(req.language, words);

    // Update scores and double memory value if guess is correct
    const answer = SLL.head.value.translation;
    let isCorrect;
    if (guess === answer) {
      isCorrect = true;
      SLL.head.value.memory_value *= 2;
      SLL.head.value.correct_count++;
      SLL.total_score++;
    } else {
      isCorrect = false;
      SLL.head.value.memory_value = 1;
      SLL.head.value.incorrect_count++;
    }

    // Relocate current word in linked list and get the 2 relocated words
    const relocatedWords = await SLL.relocateHead(SLL.head.value.memory_value);

    // Update total score in database
    await LanguageService.updateTotalScore(req.app.get("db"), SLL);
    // Update 2 relocated words in database
    await LanguageService.updateWords(req.app.get("db"), relocatedWords);

    return res.status(200).json({
      nextWord: SLL.head.value.original,
      wordCorrectCount: SLL.head.value.correct_count,
      wordIncorrectCount: SLL.head.value.incorrect_count,
      totalScore: SLL.total_score,
      answer: answer,
      isCorrect: isCorrect
    });
  } catch (error) {
    next(error);
  }
});
module.exports = languageRouter;
