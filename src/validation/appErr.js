export class appErr extends Error {
    constructor(message, statusCode, field) {
        super(message)
        this.statusCode = statusCode
        this.name = 'appErr'
        this.field = field;
    }
}