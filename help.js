if (!this.myPlugin) {
    this.myPlugin = {};
}
/**
 * 继承
 * @son 字类
 * @father 父类
 */
this.myPlugin.inherit = (function () {
    var Temp = function () { }
    return function (son, father) {
        Temp.prototype = father.prototype;
        son.prototype = new Temp();
        son.prototype.constructor = son;
        son.prototype.uber = father.prototype;
    }
}());

/**
 * 根据文字生成图片
 * options参数
 * text:文字  backColor:背景颜色 size：canvas尺寸  font：文字大小及样式
 */
this.myPlugin.drawLogo = function(options){

    // options参数 
    // text:文字  backColor:背景颜色 size：canvas尺寸  font：文字大小及样式

    // 创建画布
    let canvas = document.createElement('canvas');
    // 绘制文字环境
    let context = canvas.getContext('2d');
    // 设置字体
    context.font = options.font;
    // 获取字体宽度
    let width = context.measureText(options.text).width;
    // 如果宽度不够 240
    if (width < 240) {
        width = 240;
    } else {
        width = width + 30;
    }
    // 画布宽度
    canvas.width = options.size || 100;
    // 画布高度
    canvas.height = options.size || 100;
    // 填充白色
    context.fillStyle = options.backColor || '#f40';
    // 绘制文字之前填充白色
    context.fillRect(0, 0, canvas.width, canvas.height);
    // 设置字体
    context.font = options.font || "48px serif";
    // 设置水平对齐方式
    context.textAlign = 'center';
    // 设置垂直对齐方式
    context.textBaseline = 'middle';
    // 设置字体颜色
    context.fillStyle = '#fff';
    // 绘制文字（参数：要写的字，x坐标，y坐标）
    context.fillText(options.text, canvas.width / 2, canvas.height / 2);
    // 生成图片信息
    let dataUrl = canvas.toDataURL('image/png');
    return dataUrl;
}

/**
 * FileReader（上传图片）
 * file 要上传的文件
 * fun 回调函数
 */
this.myPlugin.getImgUrl = (file,fun) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadstart = function (ev) {
        console.log('图片正在上传中');
    }
    reader.onload = function (ev) {
       if(fun){
       	 fun(reader.result)
       }
    }
}

/**
 * 时间格式化--年月日
 * @param {time} date 时间戳
 */
this.myPlugin.formatDate = date => {
    var date = new Date(date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].join('-') + ' ' + hour.toString().padStart(2,'0') + ':'
     + minute.toString().padStart(2,'0') + ':' + second.toString().padStart(2,'0')
}
/**
 * 时间格式化--几月几日 几时几分
 * @param {time} date 时间戳
 */
this.myPlugin.formatTime = (time) => {
    let date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    let formatNumber = n => {
        n = n.toString();
        return n[1] ? n : '0' + n
    };

    return month + '月' + formatNumber(day) + '日' + '' + [hour, minute].map(formatNumber).join(':');
}

/**
 * 给日期加减天数
 * @param {time} time 时间戳
 * @param {Number} day 要加减的天数
 * 返回时间戳
 */
this.myPlugin.addDeDateDay = (time,day) => {
    let date = new Date(time);
    let dateTime = date.setDate(date.getDate()+day);
    return dateTime;
};

/**
 * obj2混合到obj1产生新的对象
 */
this.myPlugin.mixin = function (obj1, obj2) {
    return Object.assign({}, obj1, obj2);
    // var newObj = {};
    // //复制obj2的属性
    // for (var prop in obj2) {
    //     newObj[prop] = obj2[prop];
    // }
    // //找到obj1中有但是obj2中没有的属性
    // for (var prop in obj1) {
    //     if (!(prop in obj2)) {
    //         newObj[prop] = obj1[prop];
    //     }
    // }
    // return newObj;
}

/**
 * 克隆一个对象
 * @param {boolean} deep 是否深度克隆
 */
this.myPlugin.clone = function (obj, deep) {
    if (Array.isArray(obj)) {
        if (deep) {
            //深度克隆
            var newArr = [];
            for (var i = 0; i < obj.length; i++) {
                newArr.push(this.clone(obj[i], deep));
            }
            return newArr;
        }
        else {
            return obj.slice(); //复制数组
        }
    }
    else if (typeof obj === "object") {
        var newObj = {};
        for (var prop in obj) {
            if (deep) {
                //深度克隆
                newObj[prop] = this.clone(obj[prop], deep);
            }
            else {
                newObj[prop] = obj[prop];
            }
        }
        return newObj;
    }
    else {
        //函数、原始类型
        return obj; //递归的终止条件
    }
}

/**
 * 函数防抖
 */
this.myPlugin.debounce = function (callback, time) {
    var timer;
    return function () {
        clearTimeout(timer);//清除之前的计时
        var args = arguments; //利用闭包保存参数数组
        timer = setTimeout(function () {
            callback.apply(null, args);
        }, time);
    }
}

/**
 * 函数节流
 */
this.myPlugin.throttle = function (callback, time, immediately) {
    if (immediately === undefined) {
        immediately = true;
    }
    if (immediately) {
        var t;
        return function () {
            if (immediately) {
                if (!t || Date.now() - t >= time) { //之前没有计时 或 距离上次执行的时间已超过规定的值
                    callback.apply(null, arguments);
                    t = Date.now(); //得到的当前时间戳
                }
            }
        }
    }
    else {
        var timer;
        return function () {
            if (timer) {
                return;
            }
            var args = arguments; //利用闭包保存参数数组
            timer = setTimeout(function () {
                callback.apply(null, args);
                timer = null;
            }, time);
        }
    }
}

/**
 * 函数管道
 */
this.myPlugin.pipe = function () {
    var args = Array.from(arguments);
    return function (val) {
        return args.reduce(function (result, func) {
            return func(result);
        }, val);
        // for (var i = 0; i < args.length; i++) {
        //     var func = args[i];
        //     val = func(val);
        // }
        // return val;
    }
}  
/**
 * 判断字符串char，是32位，还是16位
 * @param {*} char 
 */
this.myPlugin.is32bit = (char, i) => {
    //如果码点大于了16位二进制的最大值，则其是32位的
    return char.codePointAt(i) > 0xffff;
}

/**
 * 得到一个字符串码点的真实长度
 * @param {*} str 
 */
this.myPlugin.getLengthOfCodePoint = (str) => {
    var len = 0;
    for (let i = 0; i < str.length; i++) {
        //i在索引码元
        if (is32bit(str, i)) {
            //当前字符串，在i这个位置，占用了两个码元
            i++;
        }
        len++;
    }
    return len;
}