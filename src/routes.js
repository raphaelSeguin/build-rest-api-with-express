const router = require('express').Router();


router.route('/users')
    .get( (req, res, next) => res.send('users get') )
    .post( (req, res, next) => res.send('users post') )

router.get('/courses', (req, res, next) => res.send('GET /api/courses') );
router.get('/course/:courseId', (req, res, next) => res.send('GET /api/course/:courseId ') );
router.post('/courses', (req, res, next) => res.send('POST /api/courses ') );

router.put('/courses/:courseId', (req, res, next) => res.send('PUT /api/courses/:courseId'));
router.post('courses/:courseId/reviews', (req, res, next) => res.send('POST /api/courses/:courseId'));

    // * Set up the following routes (listed in the format HTTP VERB Route HTTP Status Code):

    // * [ ] GET /api/courses 200 - Returns the Course "\_id" and "title" properties
    // * [ ] GET /api/course/:courseId 200 - Returns all Course properties and related documents for the provided course ID
    // * [ ] When returning a single course for the GET /api/courses/:courseId route, use Mongoose population to load the related user and reviews documents.
    // * [ ] POST /api/courses 201 - Creates a course, sets the Location header, and returns no content
    // * [ ] PUT /api/courses/:courseId 204 - Updates a course and returns no content
    // * [ ] POST /api/courses/:courseId/reviews 201 - Creates a review for the specified course ID, sets the Location header to the related course, and returns no content

module.exports = router;