const express = require("express");
const LanguageService = require("./language-service");
const { requireAuth } = require("../middleware/jwt-auth");

const languageRouter = express.Router();

languageRouter.use(requireAuth).use(async (req, res, next) => {
  // Retrieve the user's language from db
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get("db"),
      req.user.id
    );

    if (!language)
      return res.status(404).json({
        error: `You don't have any languages`
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

languageRouter.get("/head", async (req, res, next) => {
  try {
    const nextWord = await LanguageService.getLanguageHead(
      req.app.get("db"),
      req.language.id
    );
    res.json({ nextWord });
    next();
  } catch (err) {
    next(err);
  }
});

languageRouter.post("/guess", async (req, res, next) => {
  try {
    for (const field of ["guess", "original"]) {
      if (!req.body[field])
        return res.status(400).json({
          error: `You didn't make a guess.`
        });
    }
    // const answer = LanguageService.getAnswer(
    //   req.app.get("db"),
    //   original
    // ).toLowerCase();

    /**
    Given incorrect guess
      - responds with incorrect and moves head
      - moves the word 1 space and updates incorrect count
    Given correct guess
      - responds with correct and moves head
      - moves the word 2 spaces, increases score and correct count
    */

    // if (guess.toLowerCase() === answer) {
    //   LanguageService.updateTotalScore(req.app.get("db"), req.user.id);
    //   return res.status(200).json({
    //     message: `Correct`
    //   });
    // }

    return res.status(200).end();
  } catch (err) {
    next(err);
  }
});

module.exports = languageRouter;
