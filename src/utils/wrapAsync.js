// Wraps an async function to handle async errors like database operations
const wrapAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

export default wrapAsync;
