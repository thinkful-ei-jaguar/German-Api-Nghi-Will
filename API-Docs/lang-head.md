Try-Lingual API
----
* **Description**    
    
    Get the current head of the words list for the user. This is done
    instead of simply getting the object from the next index on the 
    words array so spaced repetition can be apploed which means the 
    order the next word will always depend on the users previous answers.
 
* **URL**

  /api/language/head

* **Method:**  
    
    `GET` 
  

* **Success Response:**
    * **Code:** 200 OK <br />
    * **Content:** 
        
        ```
      {   
      nexttWord : 'Handschuschenschneeballwerfer',   
        totalScore: 12,  
        wordCorrectCount: 2,  
        wordIncorrectCount: 3  
      } 
      ```  
          
     
 