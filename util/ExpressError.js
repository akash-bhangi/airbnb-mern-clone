// Custom Error Class (for handling errors)

class ExpressError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

module.exports = ExpressError;