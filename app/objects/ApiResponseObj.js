function ApiResponseObj(statusCode, dataToSend, messageToSend){
    this.status  = statusCode;
    this.data    = dataToSend;
    this.message = messageToSend;
}

module.exports = ApiResponseObj;

