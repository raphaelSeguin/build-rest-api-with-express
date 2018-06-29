const router = require('express').Router();

const User   = require('./models').User;
const Course = require('./models').Course;
const Review = require('./models').Review;

router.route('/users')
    .get( (req, res, next) => {
        console.log(req.session)
        User.find({}, (err, user) => {
            if (err) {
                return next(err);
            }

            res.json()
        })
        
        console.log(req.session)
        // GET /api/users 200 - Returns the currently authenticated user
    })
    .post( (req, res, next) => {
        console.log('users post');
        // 201 - 
        //Creates a user
        //sets the Location header to "/"
        //and returns no content
        const newUser = new User( req.body );
        newUser.save( (err, user) => {
            if (err) {
                err.status = 400;
                return next(err);
            }
            res.status(201);
            res.setHeader('Location', '/');
            res.send();
        })
    })

router.get('/courses', (req, res, next) => {
    //GET /api/courses 200 - Returns the Course "\_id" and "title" properties

    Course.find({}, (err, courses) => {
        if (err) {
            return next(err);
        }
        const response = courses.map( course => {
            const { _id, title} = course;
            return { _id, title}
        });
        console.log('query result : ', courses.length);
        res.status(200);
        res.json( response );
    })
});

router.get('/course/:courseId', (req, res, next) => {
    
    // GET /api/course/:courseId 200 - Returns all Course properties and related documents for the provided course ID

    Course.find({ id: req.params.courseId }, (err, course)  => {
        if (err) {
            return next(err);
        }
        else {
            res.status(200);
            res.json(course)
        }
    })
});
router.post('/courses', (req, res, next) => {


    // POST /api/courses 201 - Creates a course, sets the Location header, and returns no content

});

router.put('/courses/:courseId', (req, res, next) => {
    
    // PUT /api/courses/:courseId 204 - Updates a course and returns no content

});
router.post('/courses/:courseId/reviews', (req, res, next) => {
    
    // 201 - Creates a review for the specified course ID, sets the Location header to the related course, and returns no content

});


    // * Set up the following routes (listed in the format HTTP VERB Route HTTP Status Code):

    // * [ ] GET /api/courses 200 - Returns the Course "\_id" and "title" properties
    // * [ ] GET /api/course/:courseId 200 - Returns all Course properties and related documents for the provided course ID
    // * [ ] When returning a single course for the GET /api/courses/:courseId route, use Mongoose population to load the related user and reviews documents.
    // * [ ] POST /api/courses 201 - Creates a course, sets the Location header, and returns no content
    // * [ ] PUT /api/courses/:courseId 204 - Updates a course and returns no content
    // * [ ] POST /api/courses/:courseId/reviews 201 - Creates a review for the specified course ID, sets the Location header to the related course, and returns no content

module.exports = router;