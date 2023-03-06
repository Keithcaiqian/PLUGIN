(function(root){
    class Cal_date {
        constructor(options){
            this.el = options.el;
            this.calendarDom = null;
            this.date = options.date || new Date();
            this.isDateCenter =  options.date;//是否显示在屏幕中间
            this.scrollFlag = true;
            this.clickDomMap = new Map();//存储点击的dom
            this.position = {
                dateDomH:0,//每个日期dom的高度
                contentH:0,//滚动内容实际的高度
            };
            this.eventCache = [];//储存自身事件
            this.cache = {
                'confirm':null,
                'close':null,
                'destroy':null
            };//存储派发事件

            this.showFuture = ('showFuture' in options) ? options.showFuture : null; //是否显示未来或以前的时间
            this.tipWord = options.tipWord || false;//提示文字
            this.activeArr = options.activeArr || ['',''];//能选中的日期数(1或2个)，根据length判断

            this.init();
        }

        // 渲染页面
        render() {
            this.calendarDom = this.el.getElementsByClassName('cal_body')[0];
            this.renderDateStr(this.dateArray,true);
            this.getPosionData();
            this.initScrollStartPosition();
        }
        //初始化日期范围
        initDateRange(){
            //0代表本月
            if(this.isDateCenter || this.showFuture === null){
                this.dateArray = [-14,14];//默认显示本月前14个月和本月后14个月的范围
            }else if(this.showFuture){
                this.dateArray = [0,28];//显示本月及后28个月
            }else{
                this.dateArray = [-28,0];//显示本月及前28个月
            }
        }
        //初始化滚动条起始位置
        initScrollStartPosition(){
            if(this.isDateCenter || this.showFuture === null){
                this.position.startY = this.position.dateDomH * 15
                    -this.getDomStyle(this.el.getElementsByClassName('cal_body')[0],'height');
            }else if(this.showFuture){
                this.position.startY = 0;
            }else{ //显示本月及后28个月
                this.position.startY = this.position.dateDomH * 29
                    -this.getDomStyle(this.el.getElementsByClassName('cal_body')[0],'height');
            }

            this.calendarDom.scrollTop = this.position.startY;
        }
        // 获取每段日期内的str
        renderDateStr(arr,sort){
            if(!this.scrollFlag){
                return;
            }
            this.scrollFlag = false;
            if(sort){
                for(let i = arr[0]; i <= arr[1]; i++){
                    this.calendarDom.appendChild(this.getMonthDom(new Date(this.date.getFullYear(),this.date.getMonth() + i)));
                }
            }else {
                for(let i = arr[1]; i >= arr[0]; i--){
                    let firstChildDom = this.calendarDom.getElementsByClassName('cal_Wrapper')[0];
                    this.calendarDom.insertBefore(this.getMonthDom(new Date(this.date.getFullYear(),this.date.getMonth() + i)),firstChildDom);
                }
            }
            this.scrollFlag = true;
        }
        // 获取position相关数据
        getPosionData(){
            this.position.dateDomH = this.getDomStyle(this.el.getElementsByClassName('cal_Wrapper')[0],'height');
            this.position.contentH = this.getDomStyle(this.el.getElementsByClassName('cal_body')[0],'height');
        }
        // 获取每个月的dom
        getMonthDom(date){
            let nowMonth = date.getMonth(), //当前月
                nowYear = date.getFullYear(), //当前年
                monthStartDate = new Date(nowYear, nowMonth, 1), //本月的开始时间
                monthEndDate = new Date(nowYear, nowMonth+1, 0),//本月的结束时间
                lastMonthEndDay = new Date(nowYear, nowMonth, 0).getDate(),// 上个月最后一天
                curMonthEndDay = monthEndDate.getDate(), // 这个月最后一天
                curMonthWeek = monthStartDate.getDay() || 7; // 这个月第一天是星期几,0的话转化为7即第七天
            let dom = document.createElement('div');
            dom.classList.add('cal_Wrapper');
            let str = `<div class="cal_dayTitle">${nowYear} 年 ${nowMonth + 1} 月</div>
                       <ul class="cal_dayBox">`;
            for(let i = 1; i <= 35; i++){
                if(i < curMonthWeek){  //上个月
                    let day = lastMonthEndDay - (curMonthWeek - i - 1);
                    // str += `<li class="cal_item last" data-time="${new Date(nowYear, nowMonth-1, day).getTime()}">${day}</li>`;
                    str += `<li class="cal_item last" data-time="${new Date(nowYear, nowMonth-1, day).getTime()}"></li>`;
                }else if(i >= curMonthWeek && i <curMonthWeek + curMonthEndDay){ //本月
                    let todayTime = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).getTime(),//今日0点时间戳
                        day = i - curMonthWeek + 1,
                        nowTime = new Date(nowYear, nowMonth, day).getTime(),//当前这一天0点时间戳
                        activeStr = '<div class="cal_tip"></div>',
                        statusClass = '';
                    //今天
                    if(nowTime === todayTime){
                        activeStr = `<div class="cal_tip">今天</div>`;
                    }

                    for(let i = 0; i < this.activeArr.length; i++){
                        if(nowTime === this.activeArr[i]){
                            statusClass = 'active';
                        }
                    }

                    if(this.showFuture === null){

                    }else if(this.showFuture){
                        if(nowTime < todayTime){
                            statusClass = 'inactive';
                        }
                    }else {
                        if(nowTime > todayTime){
                            statusClass = 'inactive';
                        }
                    }

                    str += `<li class="cal_item now ${statusClass}" data-time="${new Date(nowYear, nowMonth, day).getTime()}">
                                ${activeStr}
                                <div class="cal_day">${day}</div>
                            </li>`;
                }else{ //下个月
                    let day = i - (curMonthWeek + curMonthEndDay - 1);
                    // str += `<li class="cal_item next" data-time="${new Date(nowYear, nowMonth+1, day).getTime()}">${day}</li>`;
                    str += `<li class="cal_item next" data-time="${new Date(nowYear, nowMonth+1, day).getTime()}"></li>`;
                }
            }
            str += '</ul>';
            dom.innerHTML = str;
            return dom;
        }

        // 初始化dom
        initDateDom(){
            this.el.innerHTML = `<div class="cal_header">
                <div class="cal_title">
                    请选择时间
                    <div class="cal_closeBtn">取消</div>
                </div>
                <ul class="cal_dayTitle">
                    <li class="cal_item">一</li>
                    <li class="cal_item">二</li>
                    <li class="cal_item">三</li>
                    <li class="cal_item">四</li>
                    <li class="cal_item">五</li>
                    <li class="cal_item">六</li>
                    <li class="cal_item">日</li>
                </ul>
            </div>
            <div class="cal_body">
                
            </div>
            <div class="cal_footer">
                <div class="cal_btn">确定</div>
            </div>
            <div id="cal_tip">${this.tipWord}</div>`;
            this.cal_tip = document.getElementById('cal_tip');
        }

        // 获取dom的样式
        getDomStyle(el,style){
            return parseFloat(window.getComputedStyle(el).getPropertyValue(style));
        }

        // 绑定事件
        addEvent(){
            let flag = false;
            let _this = this;
            let eventCache =  this.eventCache;
            let touchstartFun = function (ev) {
                    flag = false
                },
                touchmoveFun = function (ev) {
                    flag = true;
                },
                touchendFun = function (ev) {
                    if(!flag){
                        let targetDom = ev.target,
                            parentDom = targetDom.parentElement;

                        //每一天的点击
                        if(targetDom.classList.contains('inactive') || parentDom.classList.contains('inactive')){
                            return;
                        }
                        if(targetDom.classList.contains('now') && targetDom.classList.contains('cal_item')){
                            _this.renderClickDomStyle(targetDom);
                            _this.clickDomMapDataToActiveArrData();
                        }else if(parentDom.classList.contains('now') && parentDom.classList.contains('cal_item')){
                            _this.renderClickDomStyle(parentDom);
                            _this.clickDomMapDataToActiveArrData();
                        }

                        //确定按钮点击
                        if(targetDom.classList.contains('cal_btn') && targetDom.classList.contains('active')){
                            let startTime = _this.activeArr[0],
                                endTime = _this.activeArr[1];
                            _this.emmit('confirm',{
                                startTime,
                                endTime
                            })
                        }

                        // 取消按钮点击
                        if(targetDom.classList.contains('cal_closeBtn')){
                            _this.emmit('close');
                        }
                    }
                },
                scrollFun = function (ev) {
                    _this.renderTipDom();
                    let sH = _this.calendarDom.scrollHeight, //滚动内容的高度
                        sT = _this.calendarDom.scrollTop;//滚动条的高度

                    if(_this.showFuture === null){
                        if(sT < 2058){
                            let tempDate = _this.dateArray[0];
                            _this.dateArray[0] -= 30;
                            _this.renderDateStr([_this.dateArray[0],tempDate],false);
                        }else if(sT > (sH - 2058)){
                            let tempDate = _this.dateArray[1];
                            _this.dateArray[1] += 30;
                            _this.renderDateStr([tempDate,_this.dateArray[1]],true);
                        }
                    }else if(_this.showFuture){
                        if(sT > (sH - 2058)){
                            let tempDate = _this.dateArray[1];
                            _this.dateArray[1] += 30;
                            _this.renderDateStr([tempDate,_this.dateArray[1]],true);
                        }
                    }else {
                        if(sT < 2058){
                            let tempDate = _this.dateArray[0];
                            _this.dateArray[0] -= 30;
                            _this.renderDateStr([_this.dateArray[0],tempDate],false);
                        }
                    }
                };


            eventCache.push([this.el,'touchstart',touchstartFun]);
            eventCache.push([this.el,'touchmove',touchmoveFun]);
            eventCache.push([this.el,'touchend',touchendFun]);
            eventCache.push([this.calendarDom,'scroll',scrollFun]);

            for(let i = 0; i < eventCache.length; i++){
                let item = eventCache[i];
                item[0].addEventListener(item[1],item[2]);
            }
        }
        //解绑事件
        removeEvent(){
            let eventCache = this.eventCache;
            for(let i = 0; i < eventCache.length; i++){
                let item = eventCache[i];
                item[0].removeEventListener(item[1],item[2]);
            }
            eventCache.length = 0;
        }

        //渲染点击选中的样式
        renderClickDomStyle(dom){
            let size = this.clickDomMap.size,
                length = this.activeArr.length;
            switch (size){
                case 2:
                    this.clickDomMap.get('start').classList.remove('active');
                    this.clickDomMap.get('end').classList.remove('active');
                    this.clickDomMap.clear();
                case 0:
                    this.clickDomMap.set('start',dom);
                    dom.classList.add('active');

                    //小黑条提示
                    this.renderTipDom(dom);
                    //确定按钮切换样式
                    this.renderConfirmBtnStyle();

                    let domArr = this.calendarDom.querySelectorAll('.cal_item.now.lightActive');
                    for(let i = 0; i < domArr.length; i++){
                        domArr[i].classList.remove('lightActive');
                    }

                    break;
                case 1:
                    let startDom = this.clickDomMap.get('start'),
                        time1 = startDom.dataset.time,
                        time2 = dom.dataset.time;
                    if(length === 2 && time2 > time1){
                        this.clickDomMap.set('end',dom);
                        this.renderLightActiveDom(startDom,dom,startDom.parentElement.parentElement,false,false);
                    }else {
                        this.clickDomMap.set('start',dom);
                        startDom.classList.remove('active');
                    }
                    dom.classList.add('active');
                    this.renderTipDom(dom);
                    this.renderConfirmBtnStyle();
                    break;
            }
        }
        //渲染选中的两个dom中间dom的颜色
        renderLightActiveDom(startDom,endDom,parentDom,start,end){
            let domArr = parentDom.querySelectorAll('.cal_item.now'),
                startFlag = start,
                endFlag = end;
            for(let i = 0; i < domArr.length; i++){
                if(domArr[i] === startDom){
                    startFlag = true;
                    continue;
                }
                if(startFlag){
                    if(domArr[i] === endDom){
                        endFlag = true;
                        return;
                    }
                    domArr[i].classList.add('lightActive');
                }
            }
            if(!endFlag){
                this.renderLightActiveDom(startDom,endDom,parentDom.nextElementSibling,startFlag,endFlag);
            }
        };
        //渲染小黑条
        renderTipDom(dom){
            if(!this.tipWord || !this.cal_tip){
                return;
            }
            if(this.activeArr.length === this.clickDomMap.size || !dom){
                this.cal_tip.style.display = 'none';
                return;
            }
            this.cal_tip.style.display = 'block';
            this.cal_tip.style.top = dom.offsetTop - this.calendarDom.scrollTop + this.getDomStyle(this.el.getElementsByClassName('cal_header')[0],'height') - 40 + 'px';
            this.cal_tip.style.left = dom.offsetLeft - (this.getDomStyle(this.cal_tip,'width') - this.getDomStyle(dom,'width'))/2 + 'px';
        }
        //渲染确定按钮
        renderConfirmBtnStyle(){
            let cal_btn = this.el.getElementsByClassName('cal_btn')[0];
            if(this.activeArr.length === this.clickDomMap.size){
                cal_btn.classList.add('active');
            }else {
                cal_btn.classList.remove('active');
            }
        }
        //同步this.activeArr与this.clickDomMap的数据关系
        activeArrToClickDomMapData(){
            let activeArr = this.activeArr,
                length = activeArr.length,
                time1 = activeArr[0],
                time2 = activeArr[1],
                startDom = null,
                endDom = null,
                activeDomArr = this.calendarDom.getElementsByClassName('cal_item now active');
            if(time1){
                startDom = activeDomArr[0];
                if(startDom && startDom.dataset.time == time1){
                    this.clickDomMap.set('start',startDom);
                }

                if(time2){
                    endDom = activeDomArr[1];
                    if(endDom && endDom.dataset.time == time2){
                        this.clickDomMap.set('end',endDom);
                        //渲染两个选中dom间的颜色
                        this.renderLightActiveDom(startDom,endDom,startDom.parentElement.parentElement,false,false);
                    }
                }else if(length === 2){
                    // 渲染提示小黑条
                    setTimeout(()=>{
                        this.renderTipDom(startDom);
                    },0);
                }
            }
        }
        clickDomMapDataToActiveArrData(){
            let activeArr = this.activeArr,
                clickDomMap = this.clickDomMap,
                length = activeArr.length,
                startDom = clickDomMap.get('start'),
                endDom = clickDomMap.get('end');
            if(startDom){
                activeArr[0] = startDom.dataset.time;
            }
            if(length === 2 && endDom){
                activeArr[1] = endDom.dataset.time;
            }
        }

        // 初始化
        init(){
            this.initDateDom();
            this.initDateRange();
            this.render(this.date);
            this.activeArrToClickDomMapData();
            this.renderConfirmBtnStyle();
            this.addEvent();
        }

        //销毁
        destroy(){
            let arg = [].slice.call(arguments);
            arg.unshift('destroy');
            this.emmit.apply(this,arg);
            this.removeEvent();
            this.el.innerHTML = '';
        }
        // 监听事件
        on(type,handle){
            if( type in this.cache ){
                this.cache[type] = handle;
            }
        }
        //派发事件
        emmit(){
            let type = arguments[0],
                arg = [].slice.call(arguments,1);
            this.cache[type].apply(this,arg);
        }
    }

    root.Cal_date = Cal_date;
})(this);
