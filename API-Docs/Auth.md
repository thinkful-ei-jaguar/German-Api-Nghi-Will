Try-Lingual API
----
* **Description**
   
   Get JSON web token for user login
  
* **URL**

  /api/auth/token

* **Method:**
   *  `POST` 
  
* **Data Params**  
   `username=[string]`  
   `password=[string]`


* **Success Response:**
    * **Code:** 200 <br />
      **Content:** `{ authToken : 'sdg$RG#@%BWQ#Rfnsgldks345ew' }`
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error : "Incorrect username or password" }`

  OR

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error : "MISSING ${feild} in request body" }`

* 