const router   = require('express').Router();

const auth     = require('basic-auth');

const User     = require('./models').User;
const Course   = require('./models').Course;
const Review   = require('./models').Review;

// Middleware function causes error if credentials are wrong or absent and attach user document to req.user otherwise
const authentication = (req, res, next) => {
    if (req.user) {
        User.authenticate(
            req.user.name,
            req.user.pass,
            (err, user) => {
                if (err) {
                    err.status = 401;
                    return next(err);
                }
                req.user = user;
                next();
            }
        )
    } else {
        const err = Error('Sorry! You must be logged in to access this route.');
        err.status = 401;
        next( err );
    }
}
router.route('/users')
    // GET /api/users 200 - Returns the currently authenticated user
    .get( 
        authentication,
        (req, res, next) => {
            return res.json(req.user.fullName);
        }
    )
    // POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
    .post( 
        (req, res, next) => {
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
        }
    )

//GET /api/courses 200 - Returns the Course "\_id" and "title" properties
router.get('/courses', (req, res, next) => {
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

// GET /api/course/:courseId 200 - Returns all Course properties and related documents for the provided course ID
router.get('/course/:courseId',
    authentication,
    (req, res, next) => {
        Course
        .findById( req.params.courseId )
        .populate('user', 'fullName')
        .populate('reviews')
        .exec( (err, course)  => {
            if (err) {
                return next(err);
            } else {
                res.status(200);
                res.json(course);
            }
        }
    )
});

// POST /api/courses 201 - Creates a course, sets the Location header, and returns no content
router.post('/courses',
    authentication,
    (req, res, next) => {
        console.log(req.body);
        Course.create( req.body, (err, course) => {
            if (err) {
                err.status = 400;
                next( err );
            } else {
                res.status(201)
                res.setHeader('Location', '/');
                res.send();
            }
        });
    }
);

// PUT /api/courses/:courseId 204 - Updates a course and returns no content
router.put('/courses/:courseId',
    authentication,
    (req, res, next) => {
        Course.findById(req.params.courseId, (err, course) => {
            if ( err ) {
                err.status = 400;
                next(err);
            } else {
                if (course) {
                    for ( let property in req.body ) {
                        course[property] = req.body[property];
                    }
                    course.save( (err, course) => {
                        if (err) {
                            next(err);
                        } else {
                            res.status(204);
                            res.send();
                        }
                    })
                } else {
                    const err = Error(`Course ${req.params.courseId} not found`);
                    next(err);
                }
            }
        });
    }
);

// POST /api/courses/:courseId/reviews 201 - Creates a review for the specified course ID, sets the Location header to the related course, and returns no content
router.post('/courses/:courseId/reviews', 
    authentication,
    (req, res, next) => {
        Course.findById(
            req.params.courseId,
            (err, course) => {
                if (err) {
                    err.status = 400;
                    next( err );
                }
                if ( req.user.id == course.user._id ) {
                    const err = Error('You can\'t review your own course !')
                    return next(err);
                }
                const newReview = new Review({
                    ...req.body, user: req.user
                });
                newReview.save( (err, savedReview) => {
                    if (err) {
                        next(err);
                    } else {
                        course.reviews.push( savedReview );
                        course.save( (err, updatedCourse) => {
                            console.log(updatedCourse);
                            if (err){
                                next(err);
                            } else {
                                res.status(201);
                                res.setHeader('Location', `/courses/${ course._id }`);
                                res.send();
                            }
                        })
                    }
                })
            }
        )
    }
);

// DELETE course. This could be useful after creating a lot of dumb courses :)
router.delete('/course/:courseId',
    authentication,
    (req, res, next) => {
        Course.findByIdAndDelete( req.params.courseId, (err, course) => {
            if(err) {
                err.message = 'Sorry, could not delete';
                next(err);
            } else {
                if(course) {
                    res.send(`course ${req.params.courseId} deleted`);
                } else {
                    res.send(`no course ${req.params.courseId} to delete`);
                }
                
            }
        })
    }
);

module.exports = router;