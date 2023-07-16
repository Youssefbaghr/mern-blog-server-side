export const notFound = (req, res, next) => {
    res.status(404).json(`Sorry, this page does not exist`);
};
