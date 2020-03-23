Try-Lingual API
----
* **Description**
   Register new user and populate required fields for future access
  
* **URL**

  /api/user

* **Method:**
   *  `POST` 
  
* **Data Params** 
  * Required:  
      
     - `name=[string]`   
     - `username=[string]`  
     - `password=[string]`


* **Success Response:**
    * **Code:** 201 CREATED <br />
      **Content:** `{ id : 0012123, username: 'username', name: 'name'}`
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error : "Username already taken" }`

  OR

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error : "Password must contain one upper case, lower case, number and special character" }`  

  OR
    
  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error : "Password must not start or end with empty spaces" }`   
    
  OR

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error : "Password be less than 72 characters" }`  
    
  OR

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error : "Password be longer than 8 characters" }`  
    
  OR

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error : "Missing ${feild} in request body" }`
      
  