class DataFunction {
    constructor (options) {
        this.clickArea = options || {};
    }

    init() {
        let flag = false;
        let _this = this;
        $(document).addClass('test').on('touchstart touchmove touchend', function (ev) {//给document添加点击事件代理
            switch (event.type) {
                case 'touchstart':
                    flag = false;
                    break;
                case 'touchmove':
                    flag = true;
                    break;
                case 'touchend':
                    if (!flag) {
                        let fun = $(ev.target).data('function');
                        if( fun &&  _this.clickArea[fun]){
                            _this.clickArea[fun]($(ev.target), ev);
                        }
                    }
                    break;
            }
        });
    };
}
