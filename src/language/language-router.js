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
    const words = await LanguageService.getLanguageWords(
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
    const head = await LanguageService.getLanguageHead(
      req.app.get("db"),
      req.language.id
    );

    // Remove answer since when we post to the guess endpoint,
    // we're going to get the answer from the db again and compare it to the guess
    res.status(200).json({
      nextWord: head.original,
      totalScore: req.language.total_score,
      wordCorrectCount: head.correct_count,
      wordIncorrectCount: head.incorrect_count
      // answer : head.translation
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
    debugger;
    const words = await LanguageService.getLanguageWords(
      req.app.get("db"),
      req.language.id
    );

    let SLL = await LanguageService.createLinkedListFrom(req.language, words);
    const node = SLL.head;

    const answer = node.value.translation;
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
    debugger;
    // Re-position node in linked list and gets the 2 nodes that we made updates to
    const updatedNodes = await SLL.moveHeadBy(SLL.head.value.memory_value);

    // Updates the scores in database
    await LanguageService.persistLinkedList(req.app.get("db"), SLL);

    await LanguageService.updateStuff(req.app.get("db"), updatedNodes);

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
