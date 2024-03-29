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
 * 时间格式化--几月几日 几时几分
 * @param {time} date 时间戳
 */
this.myPlugin.dateFormat = (date,fmt) => {
    if(!date){
        return '';
    }
    if(!fmt){
        fmt = "YYYY-mm-dd";
    }
    var date = new Date(date);
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;

    // 用法
    // let date = new Date()
    // dateFormat(date,"YYYY-mm-dd HH:MM")
    // dateFormat(date,"YYYY-mm-dd HH")
    // dateFormat(date,"YYYY年mm月dd日")
}

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

//地址输入框自适应高度
var autoTextarea = function (ele,initPx) {
    
};

/**
 * 文本框高度自适应
 * @param {initPx} 元素初始高度
 */
this.myPlugin.autoTextarea = function (ele, initPx) {
    ele.style.height = initPx + 'px';
    let scrollHeight = ele.scrollHeight;
    ele.style.height = scrollHeight + 'px';
    return scrollHeight;
};
// 调用
// var text = document.getElementById("textarea");
// autoTextarea(text);

/**
 *截取url的参数 
 *@param {name} str
 */
this.myPlugin.getQueryString = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};

/**
 * 复制文字 
 *@param {text} str 要复制的文本
 */
this.myPlugin.copyText = function(text) {
    var textarea = document.createElement('input');
    textarea.value = text;
    textarea.style.position = 'fixed';
    var currentFocus = document.activeElement;//当前获得焦点的元素
    document.getElementsByTagName('body')[0].append(textarea);
    textarea.focus();
    textarea.select();
    var flag = document.execCommand("copy");//执行复制
    textarea.remove();
    currentFocus.focus();
    return flag;
};

/**
 * 使一个非单例的函数变成一个单例的函数 
 *@param {func} 函数
 */
this.myPlugin.getSingleFunc = function (func) {
    var result = null;
    return function () {
        if (!result) {
            result = func.apply(this, arguments);
        }
        return result;
    }
};

/*
* str 文字 
* w 盒子宽度 
* h 盒子高度 
* fontSize 字体大小 
* 根据文字多少生成等比例缩放生成的元素 
* */ 
var createDomFromFont = function (str,w,h,fontSize) { 
    let area = w * h;//外层盒子面积 

    $('body').append($(``)); 
    let dom = $('#getBoxSizeFromFont'); 
    let domArea = dom[0].offsetWidth * dom[0].offsetHeight; //获得文字所占面积 
    dom.remove(); 

    let itemStyle = `display: inline-block;word-break: break-all;font-size: ${fontSize}px`; 
    if(domArea > area){ 
        var itemW = Math.sqrt(domArea * w / h);//要缩放盒子的宽度 
        var scale = w / itemW;//缩放比例 
        itemStyle += `width:${itemW}px;transform-origin: left center;transform:scale(${scale})`; 
    } 
    return `<div style="${itemStyle}">${str}</div>`; 
};