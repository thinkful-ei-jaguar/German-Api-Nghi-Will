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
                req.app.get('db'),
                req.user.id,
            );
            
            if (!language)
                return res.status(404).json({
                    error: 'You don\'t have any languages',
                });
            
            req.language = language;
            next();
        } catch (error) {
            next(error);
        }
    });

languageRouter
    .get('/', async (req, res, next) => {
        try {
            const words = await LanguageService.getLanguageWords(
                req.app.get('db'),
                req.language.id,
            );
            
            res.json({
                language: req.language,
                words,
            });
            next();
        } catch (error) {
            next(error);
        }
    });

languageRouter
    .use(jsonParser)
    .get("/head", async (req, res, next) => {
        try {
            const head = await LanguageService.getLanguageHead(
                req.app.get("db"), req.language.id
    );
            
    res.status(200).json({
      currentWord: head.original,
      totalScore: req.language.total_score,
      wordCorrectCount: head.correct_count,
      wordIncorrectCount: head.incorrect_count,
      answer : head.translation
            });
            
            next();
        } catch(error) {
            next(error);
        }
    });

languageRouter.post("/guess", jsonParser, async (req, res, next) => {
    const { guess } = req.body;
    if (!req.body) {
        return res.status(400).json({
            error: "Missing request body"
        });
    }
    if (!guess)
        return res.status(400).json({
            error: `Missing 'guess' in request body`
        });
    
    try {
        const words = await LanguageService.getLanguageWords(
            req.app.get("db"),
            req.language.id
        );
        
        let SLL = LanguageService.populateLinkedList(req.language, words);
        
        const node = SLL.head;
        const answer = node.value.translation;
        let isCorrect;
        
        if (guess === answer) {
            isCorrect = true;
            SLL.head.value.memory_value = node.value.memory_value * 2;
            SLL.head.value.correct_count = SLL.head.value.correct_count + 1;
            SLL.total_score = SLL.total_score + 1;
        } else {
            isCorrect = false;
            SLL.head.value.memory_value = 1;
            SLL.head.value.incorrect_count = SLL.head.value.incorrect_count + 1;
        }
        
        SLL.moveHeadBy(SLL.head.value.memory_value);
        
        await LanguageService.persistLinkedList(req.app.get("db"), SLL);
        
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
