var PublicSocket = function (options) {
    this.socketCloseReconnection = true; //异常关闭或未连接成功后是否重连
    this.reconnectTimer = null; //重连timer
    //新建
    this.options = Object.assign({
        debug: false,
        url: "ws://" + document.domain + ":55550",
        isReconnect: true, //是否断线重连
        reconnectTime: 10000, //重连时间间隔
        open:function(){
            if (this.debug) {
                console.log('连接成功')
            }
        },
        message: function (data) {
            if (this.debug) {
                console.log('返回数据', data)
            }
        },
        close: function () {
            if (this.debug) {
                console.log('断开了')
            }
        },
        error:function (e) {
            console.log(e);
        },
        //断线重连前的回调
        beforeReconnect:function () {

        },
    },options) ;
    this.init();
};
//初始化websocket连接
PublicSocket.prototype.init = function () {
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    if (!window.WebSocket) { // 检测浏览器支持
        console.error('错误: 浏览器不支持websocket');
        return;
    }
    var _this = this;
    this.socket = new WebSocket(_this.options.url); // 创建连接并注册响应函数
    this.socket.onopen = function (e) {
        _this.options.loginData&&_this.login(_this.options.loginData);
        _this.options.open(e);
    };
    this.socket.onmessage = function (e) {
        _this.options.message(JSON.parse(e.data));
    };
    this.socket.onclose = function (e) {
        setTimeout(function(){
            _this.options.close(e);
        },5000);
    };
    this.socket.onerror = function (e) {
        _this.options.error(e);
    };

    //断线重连逻辑
    if(this.options.isReconnect){
        this.socketCloseReconnection = true;
        this.reconnect();
    }
};
//断线重连
PublicSocket.prototype.reconnect = function(){
    clearTimeout(this.reconnectTimer);
    //需要重连
    if(this.socketCloseReconnection){
        //断线
        if(this.socket && this.socket.readyState === 3){
            this.options.beforeReconnect();
            this.init();
        }else{
            this.reconnectTimer = setTimeout(() => {
                this.reconnect();
            },this.options.reconnectTime);
        }
    }
};
//发送消息
PublicSocket.prototype.send = function (data,callback) {
    var say_data = data;
    say_data = JSON.stringify(say_data);
    if (this.options.debug) {
        console.log('发消息', say_data);
    }

    this.waitForConnection(() => {
        this.socket.send('' + say_data);
        if (typeof callback !== 'undefined') {
            callback();
        }
    }, 1000);
};
//关闭socket
PublicSocket.prototype.close = function () {
    this.socketCloseReconnection = false;
    this.socket.close();
};
//延迟发送消息(开始连接socket时发送消息可能失败)
PublicSocket.prototype.waitForConnection = function (callback, interval) {
    if (this.socket.readyState === 1) {
        callback();
    } else {
        setTimeout(() => {
            this.waitForConnection(callback, interval);
        }, interval);
    }
};
