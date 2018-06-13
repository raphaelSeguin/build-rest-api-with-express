# Build a course rating API with express.

## Project Instructions

### Set up a database connection.
* Use npm to install Mongoose.
* Using Mongoose, create a connection to your MongoDB database.
* Write a message to the console if there's an error connecting to the database.
* Write a message to the console once the connection has been successfully opened.

### Create your Mongoose schema and models. Your database schema should match the following requirements:
* User
    * \_id (ObjectId, auto-generated)
    * fullName (String, required)
    * emailAddress (String, required, must be unique and in correct format)
    * password (String, required)
* Course
    * \_id (ObjectId, auto-generated)
    * user (\_id from the users collection)
    * title (String, required)
    * description (String, required)
    * estimatedTime (String)
    * materialsNeeded (String)
    * steps (Array of objects that include stepNumber (Number), title (String, required) and * description (String, required) properties)
    * reviews (Array of ObjectId values, \_id values from the reviews collection)
* Review
    * \_id (ObjectId, auto-generated)
    * user (\_id from the users collection)
    * postedOn (Date, defaults to “now”)
    * rating (Number, required, must fall between “1” and “5”)
    * review (String)
* Mongoose validation gives you a rich set of tools to validate user data. See [Mongoose Validation](http://mongoosejs.com/docs/validation.html) for more information.

### Seed your database with data.
* We've provided you with seed data in JSON format (see the src/data/data.json file) to work with the mongoose-seeder npm package.
* See [Mongoose Seeder](https://github.com/SamVerschueren/mongoose-seeder) for documentation on how to use mongoose-seeder.
* Important: mongoose-seeder requires an open connection to the database to be available, so be sure to not call your database seed code until Mongoose has successfully opened a connection to the database.

### Create the user routes
* Set up the following routes (listed in the format HTTP VERB Route HTTP Status Code):
    * GET /api/users 200 - Returns the currently authenticated user
    * POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content

### Create the course routes
* Set up the following routes (listed in the format HTTP VERB Route HTTP Status Code):
    * GET /api/courses 200 - Returns the Course "\_id" and "title" properties
    * GET /api/course/:courseId 200 - Returns all Course properties and related documents for the provided course ID
    * When returning a single course for the GET /api/courses/:courseId route, use Mongoose population to load the related user and reviews documents.
    * POST /api/courses 201 - Creates a course, sets the Location header, and returns no content
    * PUT /api/courses/:courseId 204 - Updates a course and returns no content
    * POST /api/courses/:courseId/reviews 201 - Creates a review for the specified course ID, sets the Location header to the related course, and returns no content

### Update any POST and PUT routes to return Mongoose validation errors.
* Use the next function in each route to pass any Mongoose validation errors to Express’s global error handler
* Send the Mongoose validation error with a400 status code to the user

### Update the User model to store the user's password as a hashed value.
* For security reasons, we don't want to store the password property in the database as clear text.
* Create a pre save hook on the user schema that uses the bcrypt npm package to hash the user's password.
* See [Bcrypt](https://github.com/ncb000gt/node.bcrypt.js/) for more information.

### Create an authentication method on the user model to return the user document based on their credentials
* Create a static method on the user schema that takes an email, password, and callback
* The method should attempt to get the user from the database that matches the email address given.
* If a user was found for the provided email address, then check that user's password against the password given using bcrypt.
* If they match, then return the user document that matched the email address
* If they don't match or a user with the email given isn’t found, then pass an error object to the callback

### Set up permissions to require users to be signed in
* Postman will set an Authorization header with each request when a user is signed in.
* Add a middleware function that attempts to get the user credentials from Authorization header set on the request.
* You can use the basic-auth npm package to parse the \`Authorization' header into the user's credentials.
* Use the authenticate static method you built on the user schema to check the credentials against the database
* If the authenticate method returns the user, then set the user document on the request so that each following middleware function has access to it.
If the authenticate method returns an error, then pass it to the next function
* Use this middleware in the following routes:
    * POST /api/courses
    * PUT /api/courses/:courseId
    * GET /api/users
    * POST /api/courses/:courseId/reviews

## Extra Credit

### Review model
* Validation added to prevent a user from reviewing their own course

### User routes
* Tests have been written for the following user stories:
    * When I make a request to the GET /api/users route with the correct credentials, the corresponding user document is returned
    * When I make a request to the GET /api/users route with the invalid credentials, a 401 status error is returned

### Course routes
* When returning a single course for the GET /api/courses/:courseId route, use Mongoose deep population to return only the fullName of the related user on the course model and each review returned with the course model.
* Example user object returned: { "\_id": "wiubfh3eiu23rh89hcwib", "fullName": "Sam Smith" } \*See the Project Resources section for more information about deep population.
