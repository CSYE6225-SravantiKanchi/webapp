/**
 * Adding a custom middleware to add the remove/headers based on the provided assignment.
 * @public
 */
const handler = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
};

exports.handler= handler;