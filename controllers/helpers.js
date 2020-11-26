

const jsonFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(json)$/)) {
        req.fileValidationError = 'Only json files are allowed!';
        return cb(new Error('Only json files are allowed!'), false);
    }
    cb(null, true);
};
exports.jsonFilter = jsonFilter;