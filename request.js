var requestJS = function () {
    let debug = false;
    let ip = 'http://192.168.1.122';
    if (window.location.origin) {
        ip = window.location.origin;
    }
    let homePath = ip + '/test/public/index.php';//网络请求的路径
    let HomePath = ip + '/test_file/'; //下载的文件的路径
    let ajax = function (url, params, successData, errorData) {
        try {
            showLoadingPage();
            $.ajax({
                url: homePath + url,
                type: 'post',
                data: params,
                dataType:'json',
                success: function (res) {
                    hideLoadingPage();
                    if (successData) {
                        successData(res);
                    }
                },
                error: function (res) {
                    hideLoadingPage();
                    if (errorData) {
                        errorData(res.responseJSON.message);
                        return
                    }
                    if (res.status === 500) {
                        if (debug) {
                            // console.log(res);
                        }
                        return
                    }
                    setTimeout(function () {
                        if (debug) {
                            // console.log(res.responseText || res.statusText);
                        }
                    }, 400)
                }
            })
        } catch (e) {
            if (debug) {
                console.log(e);
            }
        }
    };
    let request = function (options) {
        return new Promise((resolve, reject) => {
            let isLoading = options.isLoading === 'undefined' ? true : options.isLoading; //是否显示loading
            isLoading && showLoadingPage();
            $.ajax({
                url: homePath + options.url,
                type: options.type || 'post',
                data: options.params || {},
                dataType: options.dataType || 'json',
                headers: options.headers || {},
                success: function (res) {
                    isLoading && hideLoadingPage();
                    if(options.success){
                        options.success(resolve, reject, res);
                    }else {
                        resolve(res);
                    }
                },
                error: function (err) {
                    isLoading && hideLoadingPage();
                    if(options.error){
                        options.error(resolve, reject, err);
                    }else {
                        reject(err);
                    }
                }
            })
        });
    };


    return {
        getHomePath: function () {
            return homePath
        },
        GetHomePath: function () {
            return HomePath
        },
        ajax: function (url, params, successData, errorData, token) {
            ajax(url, params, successData, errorData, token);
        },
        request
    }
}();






