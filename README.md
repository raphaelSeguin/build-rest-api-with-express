# Build a course rating API with express.
### Treehouse Techdegree Project 11

## Project Instructions

### Set up a database connection.
* [x] Use npm to install Mongoose.
* [x] Using Mongoose, create a connection to your MongoDB database.
* [x] Write a message to the console if there's an error connecting to the database.
* [x] Write a message to the console once the connection has been successfully opened.

### Create your Mongoose schema and models. Your database schema should match the following requirements:
* User
    * [x] \_id (ObjectId, auto-generated)
    * [x] fullName (String, required)
    * [x] emailAddress (String, required, must be unique and in correct format)
    * [x] password (String, required)
* Course
    * [x] \_id (ObjectId, auto-generated)
    * [x] user (\_id from the users collection)
    * [x] title (String, required)
    * [x] description (String, required)
    * [x] estimatedTime (String)
    * [x] materialsNeeded (String)
    * [x] steps (Array of objects that include stepNumber (Number), title (String, required) and * description (String, required) properties)
    * [x] reviews (Array of ObjectId values, \_id values from the reviews collection)
* Review
    * [x] \_id (ObjectId, auto-generated)
    * [x] user (\_id from the users collection)
    * [x] postedOn (Date, defaults to “now”)
    * [x] rating (Number, required, must fall between “1” and “5”)
    * [x] review (String)
* Mongoose validation gives you a rich set of tools to validate user data. See [Mongoose Validation](http://mongoosejs.com/docs/validation.html) for more information.

### Create the user routes
* Set up the following routes (listed in the format HTTP VERB Route HTTP Status Code):
    * [x] GET /api/users 200 - Returns the currently authenticated user
    * [x] POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content

### Create the course routes
* Set up the following routes (listed in the format HTTP VERB Route HTTP Status Code):
    * [x] GET /api/courses 200 - Returns the Course "_id" and "title" properties
    * [x] GET /api/course/:courseId 200 - Returns all Course properties and related documents for the provided course ID
    * [x] When returning a single course for the GET /api/courses/:courseId route, use Mongoose population to load the related user and reviews documents.
    * [x] POST /api/courses 201 - Creates a course, sets the Location header, and returns no content
    * [x] PUT /api/courses/:courseId 204 - Updates a course and returns no content
    * [ ] POST /api/courses/:courseId/reviews 201 - Creates a review for the specified course ID, sets the Location header to the related course, and returns no content

### Update any POST and PUT routes to return Mongoose validation errors.
* [x] Use the next function in each route to pass any Mongoose validation errors to Express’s global error handler
* [x] Send the Mongoose validation error with a 400 status code to the user

### Update the User model to store the user's password as a hashed value.
* For security reasons, we don't want to store the password property in the database as clear text.
* [x] Create a pre save hook on the user schema that uses the bcrypt npm package to hash the user's password.
* See [bcrypt]https://github.com/ncb000gt/node.bcrypt.js/ for more information.

### Create an authentication method on the user model to return the user document based on their credentials
* [x] Create a static method on the user schema that takes an email, password, and callback
* [x] The method should attempt to get the user from the database that matches the email address given.
* [x] If a user was found for the provided email address, then check that user's password against the password given using bcrypt.
* [x] If they match, then return the user document that matched the email address
* [x] If they don't match or a user with the email given isn’t found, then pass an error object to the callback

### Set up permissions to require users to be signed in
* [x] Postman will set an Authorization header with each request when a user is signed in.
* [x] Add a middleware function that attempts to get the user credentials from Authorization header set on the request.
* [x] You can use the [basic-auth](https://www.npmjs.com/package/basic-auth) npm package to parse the `Authorization' header into the user's credentials.
* [x] Use the authenticate static method you built on the user schema to check the credentials against the database
* [x] If the authenticate method returns the user, then set the user document on the request so that each following middleware function has access to it.
* [x] If the authenticate method returns an error, then pass it to the next function
* Use this middleware in the following routes:
    * [x] POST /api/courses
    * [x] PUT /api/courses/:courseId
    * [x] GET /api/users
    * [x] POST /api/courses/:courseId/reviews


## Extra Credit

### Review model
* [ ] Validation added to prevent a user from reviewing their own course

### User routes
* Tests have been written for the following user stories:
    * [ ] When I make a request to the GET route with the correct credentials, the corresponding user document is returned
    * [ ] When I make a request to the GET /api/courses/:courseId route with the invalid credentials, a 401 status error is returned

### Course routes
* [x] When returning a single course for the GET /api/courses/:courseId route, use Mongoose deep population to return only the fullName of the related user on the course model and each review returned with the course model. This will hide other user’s private details, like passwords and emails, from other users.
* [x] Example user object returned: { "_id": "wiubfh3eiu23rh89hcwib", "fullName": "Sam Smith" } * See the Project Resources section for more information about deep population.