Try-Lingual API
 ----
 * **Description**    
     
     Get languages and corresponding words for a user 
   
 * **URL**
 
   /api/language
 
 * **Method:**  
     
     `GET` 
   
 
 * **Success Response:**
     * **Code:** 200 OK <br />
     * **Content:** 
         
         ```
       { 
           language : 'german',  
           words: [ 
             {id: 1, language_id: 1, original: 'gluhbirne', next: 2},   
             {id: 2, language_id: 1, original: 'Lebensmude', next: 3}
           ]
       }
       ```
  
 * **Error Response:**
 
   * **Code:** 404 BAD REQUEST <br />
     **Content:** `{ error : "You dont have any languages" }`
 
  