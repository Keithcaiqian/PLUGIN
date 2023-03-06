class Route {
    constructor (mainPage) {
        this.historyList = [];
        this.mainPage = $('.' + mainPage); //所有页面共同的class名
        //手机自带的返回按钮
        window.addEventListener('popstate', this.backFunction.bind(this));
    }


    //用来跳转显示某页
    showPage (dom,option) {
        let record = null;
        let id = dom.attr('id');
        if (option) {
            record = option.record
        }
        if (!record) {
            for (let i = this.historyList.length - 1; i >= 0; i--) {
                if (this.historyList[i] == id) {
                    this.historyList.splice(i, this.historyList.length - i);
                    break;
                }
            }
            this.historyList.push(id);
            history.pushState({label: id}, "");
        }
        this.mainPage.hide();
        dom.show();
    };

    //返回上一页
    backPage () {
        this.backFunction();
        history.back();
    };

    //返回方法
    backFunction () {
        if (this.historyList.length < 2) {
            return console.log('没有更早的记录了！');
        }else {
            this.historyList.pop();
            this.showPage($('#' + this.historyList[this.historyList.length - 1]), {record: true});
        }
    };

}
