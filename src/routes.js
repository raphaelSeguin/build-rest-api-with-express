const router   = require('express').Router();

const auth     = require('basic-auth');

const User     = require('./models').User;
const Course   = require('./models').Course;
const Review   = require('./models').Review;

const authentication = (req, res, next) => {
    User.authenticate(
        req.user.name,
        req.user.pass,
        (err, user) => {
            if (err) {
                //console.log('bop', err);
                return next(err);
            }
            req.user = user;
            next();
        }
    )
}

router.route('/users')
    .get( 
        authentication,
        (req, res, next) => {
            return res.json(req.user);
        }
    )
    .post( (req, res, next) => {
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
        res.status(200);
        res.json(response);
    })
});

router.get('/course/:courseId', (req, res, next) => {
    
    // GET /api/course/:courseId 200 - Returns all Course properties and related documents for the provided course ID

    Course.findById( req.params.courseId )
        .populate('user')
        //.populate('reviews')
        .exec( (err, course)  => {
            if (err) {
                return next(err);
            } else {
                res.status(200);
                res.json(course);
            }
        })
});

router.post('/courses', 
    authentication,
    (req, res, next) => {
    const user = auth(req);
    User.find({email: user.email})
        .then()
    // => { name: 'something', pass: 'whatever' }

    Course.create( req.body )
        .then()
            res.status(201)
            res.setHeader('Location', '/');

    // POST /api/courses 201 - Creates a course, sets the Location header, and returns no content

});

router.put('/courses/:courseId',
    authentication,
    (req, res, next) => {
        if (req.user) {
            Course.findOne({ _id: req.params.courseId })
                .then( course => res.json(course) )
        } else {
            
        }
    // PUT /api/courses/:courseId 204 - Updates a course and returns no content
    }
);
router.post('/courses/:courseId/reviews', 
    authentication,
    (req, res, next) => {
        Course.find({ _id: req.params.courseId}, (err, course) => {

            course.reviews.push
            course.save()

            res.status(201)
            res.setHeader('Location', `/courses/${ course._id }`);
            res.send();
        }
    )
    // 201 - Creates a review for the specified course ID, sets the Location header to the related course, and returns no content

});


    // * Set up the following routes (listed in the format HTTP VERB Route HTTP Status Code):

    // * [ ] GET /api/courses 200 - Returns the Course "\_id" and "title" properties
    // * [ ] GET /api/course/:courseId 200 - Returns all Course properties and related documents for the provided course ID
    // * [ ] When returning a single course for the GET /api/courses/:courseId route, use Mongoose population to load the related user and reviews documents.
    // * [ ] POST /api/courses 201 - Creates a course, sets the Location header, and returns no content
    // * [ ] PUT /api/courses/:courseId 204 - Updates a course and returns no content
    // * [ ] POST /api/courses/:courseId/reviews 201 - Creates a review for the specified course ID, sets the Location header to the related course, and returns no content


    // authenticate :
    // * Use this middleware in the following routes:
    // * [ ] POST /api/courses
    // * [ ] PUT /api/courses/:courseId
    // * [ ] GET /api/users
    // * [ ] POST /api/courses/:courseId/reviews


module.exports = router;