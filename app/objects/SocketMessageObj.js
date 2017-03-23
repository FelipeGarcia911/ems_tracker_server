function SocketMessageObj(method, data,status){
    this.method = method;
    this.data   = data;
    this.status = status;
}

SocketMessageObj.prototype.setStatus = function(status){
    this.status = status;
};

SocketMessageObj.prototype.setMethod = function(method){
    this.method = method;
};

SocketMessageObj.prototype.setData = function(data){
    this.data = data;
};

module.exports = SocketMessageObj;