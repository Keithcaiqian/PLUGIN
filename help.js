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