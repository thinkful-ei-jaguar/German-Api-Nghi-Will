Try-Lingual API
----
* **Description**    
    
   Submit user guess to check against correct answer and generate next word for evaluation 
  
* **URL**

  /api/language/guess

* **Method:**  
    
    `POST`
    
* **Data Params**  
   `guess=[string]`  
 
  

* **Success Response:**
    * **Code:** 200 OK <br />
    * **Content:** 
        
        ```
      { 
         nextWord: 'next word',
         totalScore: 1,
         wordCorrectCount: 0,
         wordIncorrectCount: 0,
         answer: 'answer check guess against',
         isCorrect: true
      }
      ```
      
      OR 
      
        * **Code:** 200 OK <br />
        * **Content:** 
              
            ```
            { 
               nextWord: 'next word',
               totalScore: 1,
               wordCorrectCount: 0,
               wordIncorrectCount: 0,
               answer: 'answer check guess against',
               isCorrect: false
            }
            ```
       
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error : "Missing 'guess' in request body" }`

