const express = require("express");
const LanguageService = require("./language-service");
const { requireAuth } = require("../middleware/jwt-auth");
const jsonBodyParser = express.json();
const LinkedList  =require('./LinkedList');

const languageRouter = express.Router();

languageRouter.use(requireAuth).use(async (req, res, next) => {
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

languageRouter.get("/head", jsonBodyParser, async (req, res, next) => {
  try {
    const head = await LanguageService.getLanguageHead(
      req.app.get("db"),
      req.language.id
    );

    res.status(200).json({
      currentWord: head.original,
      totalScore: req.language.total_score,
      wordCorrectCount: head.correct_count,
      wordIncorrectCount: head.incorrect_count,
      answer : head.translation,
      nextWord : head.next
    });
    next();
  } catch (error) {
    next(error);
  }
});


languageRouter.post('/guess', jsonBodyParser, async (req, res, next) => {
    try {
        const { guess } = req.body;
        
        if(!guess) {
            return res.status(400).json( {error: `Missing 'guess' in request body`} );
        }
        
        
        const DynamicWordList = new LinkedList();
        const db = req.app.get('db');
        
        //From language find and insert the head first into linked list DynamicWordList.
        let DynamicWordListHead = await LanguageService.getLanguageHead(db, req.language.head);
        console.log(DynamicWordList);
        console.log(DynamicWordListHead);
        let words = await LanguageService.getLanguageWords(db, req.language.id);
        DynamicWordList.insertFirst(DynamicWordListHead[0]);
        
        
        // Need to populate the rest of the linked DynamicWordList according to the "next" values
        while(DynamicWordListHead[0].next !== null) {
            let currNode = words.find(word => word.id === DynamicWordListHead[0].next);
            DynamicWordList.insertLast(currNode);
            DynamicWordListHead = [currNode];
        }
    
        console.log(DynamicWordList);
        console.log(DynamicWordListHead);
        let isCorrect;
        
        if(DynamicWordList.head.value.translation.toLowerCase() === guess.toLowerCase()) {
            isCorrect = true;
            DynamicWordList.head.value.memory_value *= 2;
            DynamicWordList.head.value.correct_count++;
            req.language.total_score++;
        } else {
            isCorrect = false;
            DynamicWordList.head.value.memory_value = 1;
            DynamicWordList.head.value.incorrect_count++;
        }
    
        console.log(DynamicWordList);
        console.log(DynamicWordListHead);
        //Store value of head then remove and dynamically insert based on memory_value
        const removedHead = DynamicWordList.head.value;
        DynamicWordList.remove(DynamicWordList.head.value);
        DynamicWordList.insertAt(removedHead, removedHead.memory_value);
    
    
        console.log(DynamicWordList);
        console.log(DynamicWordListHead);
        //Now that we removed the previous head, we are storing the value of the new head
        let tempNode = DynamicWordList.head;
        let newHead = tempNode.value.id;
    
        console.log(DynamicWordList);
        console.log(DynamicWordListHead);
        //The following loop keeps the original order of the data by updating each
        while(tempNode !== null) {
            await LanguageService.updateWord(
                db,
                tempNode.value.id,
                {
                    memory_value: tempNode.value.memory_value,
                    correct_count: tempNode.value.correct_count,
                    incorrect_count: tempNode.value.incorrect_count,
                    next: tempNode.next !== null ? tempNode.next.value.id : null
                }
            );
            tempNode = tempNode.next;
        }
        
        //Updating the Language table so that the new HEAD is reflected and total score is updated
        await LanguageService.updateLanguage(
            db,
            req.user.id,
            {
                total_score: req.language.total_score,
                head : newHead
            }
        );
        console.log(DynamicWordList.head.value.original);
        const response = {
            nextWord: DynamicWordList.head.value.original,
            wordCorrectCount: DynamicWordList.head.value.correct_count,
            wordIncorrectCount: DynamicWordList.head.value.incorrect_count,
            totalScore: req.language.total_score,
            answer: removedHead.translation,
            isCorrect
        };
        
        
        return res.status(200).json(response);
    } catch(error) {
        next(error);
    }
});

module.exports = languageRouter;