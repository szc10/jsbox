var head = document.getElementsByTagName("head")[0];
/**
 * [loadText 利用promise重新封装后的加载文本文件]
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
function loadText(url) {
    return new Promise(function(resolve, reject) {
        Jajax({
            url: url,
            type: "get",
            complete: function(data) {
                resolve(data);
            },
            error: function() {
                console.log(url + " is not exist");
                reject(url + " is not exist");
            }
        });
    });
}

function loadScript(url) {
    return new Promise(function(resolve, reject) {
        var script = document.createElement("script");
        script.src = url;
        script.onload = function() {
            resolve();
        }
        head.appendChild(script);
    });
}

/**
 * [loadScriptArr 加载脚本队列]
 * @param  {[type]} urlArr [description]
 * @return {[type]}        [description]
 */
function loadScriptArr(urlArr) {
  if(urlArr){
    var length = urlArr.length;
    return new Promise(function(resolve, reject) {
        _loadScript(0)

        function _loadScript(num) {
            if (num < length) {
                var url = urlArr[num];
                loadScript(url).then(function() {
                    num++;
                    _loadScript(num);
                });
            } else {
                resolve();
            }
        }
    });
  } else{
    return Promise.resolve();
  }
}

function loadCSS(url) {
    return new Promise(function(resolve, reject) {
        var linkTag = document.createElement('link');
        linkTag.href = url;
        linkTag.setAttribute('rel', 'stylesheet');
        linkTag.setAttribute('type', 'text/css');
        head.appendChild(linkTag);
        linkTag.onload = function() {
            resolve();
        }
    });
}

function loadCSSArr(urlArr) {
  if(urlArr){

    var pArr = [];
    for (var i = 1; i < urlArr.length; i++) {
        pArr.push(loadCSS(urlArr[i]));
    }
    return Promise.all(pArr);
  } else{
    return Promise.resolve();
  }

}


//加载activity文件
function loadActivity(name) {

    var activityInf = APP.getActivityInf(name);
    var promiseArr = [];

    if (activityInf.layout.url) {
        var promiseText = loadText(activityInf.layout.url);
        promiseText.then(function(data) {
            activityInf.layout.data = data;
        });
        promiseArr.push(promiseText);
    }

    if (activityInf.script) {
        var promiseScript = loadScript(activityInf.script);
        promiseScript.then(function() {

        });
        promiseArr.push(promiseScript);
    }
    if (activityInf.css) {
        var promiseCSS = loadCSS(activityInf.css);
        promiseCSS.then(function() {

        });
        promiseArr.push(promiseScript);
    }
    return Promise.all(promiseArr);
}

function preImgCache(url) {
    return new Promise(function(resolve, reject) {
        var img = new Image();
        img.src = url;
        img.onload = function() {
            resolve();
        };
    });
}

function preImgCacheArr(urlArr) {

    if (urlArr) {
        var pArr = [];
        for (var i = 1; i < urlArr.length; i++) {
            pArr.push(preImgCache(urlArr[i]));
        }
        return Promise.all(pArr);
    } else {
        return Promise.resolve();
    }
}



var objectManager = APP = ((function() {
    appInf = [];
    appRunStack = {};


    appInf['activity'] = [];


    return {
        create: function(_class) {
            var _object = {}
            _object.__proto__ = _class.prototype;
            _object.__proto__.constructor = _class;
            var args = Array.prototype.slice.call(arguments);
            args = args.slice(1, args.length);
            _class.apply(_object, args);
            return _object;
        },
        clone: function(object) {
            function F() {}
            F.prototype = object;
            return new F();
        },
        storeActivtyConfig: function(config) {

            try {
                if (!appInf["activity"][config.name]) throw config.name + " is not find";
                appInf["activity"][config.name].config = config;
            } catch (err) {
                console.log(err);
            }
        },
        getActivityInf: function(name) {
            return appInf.activity[name];
        },
        getRunActivityInf: function(name) {
            return appRunStack[name];
        },
        loadActivityArray: function(loadName) {
            var loadName = loadName;
            var pArr = [];
            for (var k in appInf[loadName]) {
                pArr.push(loadActivity(k));
            }
            return Promise.all(pArr);
        },
        getActivity: function(name) {
            try {
                if (!appRunStack[name]) throw new Error("The Activity named " + name + " is not runstack");
                return appRunStack[name].point;
            } catch (e) {
                console.log(e);
                return false;
            }

        },
        /**
         * 将模块加载到内存中
         * @param transferActivity
         * @param modname
         * @param runname
         * @param targetLoadDom
         * @param type
         * @returns {Jtype|*}
         */
        loadJActivity: function(transferActivity, modname, runname, targetLoadDom, type) {
            var targetLoadDom = targetLoadDom || document.querySelector('viewport');

            if(J(targetLoadDom).getcss("position")=="static") {
                J(targetLoadDom).setcss("position","relative");
            }

            var Jtype = type || JActivity;
            var activity = {};
            appRunStack[runname] = activity;
            activity.name = runname;
            activity.transfer = transferActivity || "root";
            activity.layout = this.clone(appInf.activity[modname].layout);
            activity.Jtype = Jtype;
            activity.config = this.clone(appInf.activity[modname].config);
            activity.config.name = runname;
            activity.loadTarget = targetLoadDom;
            activity.point = this.create(Jtype, activity);
            activity.state = 'unload';
            activity.point.transfer = activity.transfer;  //指明当前的调用者
            return activity.point;
        },
        /**
         * @param modname 要加载活动的名称
         * @param runname 加载活动对象的名称
         * @param type 加载活动的类型 可以为空 默认为JActivity
         * @returns {*|JActivity}
         */
        loadGlobalJActivity:function(modname, runname, type){
            return this.loadJActivity(null,modname,runname,null,type);
        },
        /**
         * [删除一个已经加载的activity的资源]
         * @param  {[type]} name [description]
         * @return {[type]}      [description]
         */
        deleteJActivity: function(name) {
            var activity = appRunStack[name];
            activity.loadTarget.removeChild(activity.layout.point);
            delete appRunStack[name];
        },

        /**
         * 定义一个activity或者是model
         * @param config
         */
        define: function(config) {
            if (config.name) {
                this.storeActivtyConfig(config);
                var temp = this.getActivityInf(config.name);
                if (!config.type) config.type = JActivity;
            }
        },
        /**
         * 初始化一个资源项目
         * @param name
         * @param url
         * @param fn
         * @returns {{then: then}}
         */
        initLoad: function(name, url, fn) {

        },

        /**
         * 加载一个新的资源项目
         * @param name
         * @param url
         * @param fn
         * @returns {{then: then}}
         */
        loadManifest: function(name, url) {
            var loadName = name || new Date().getTime();
            var pArr = [];
            return loadText(url).then(function(json) {
                var data = eval("(" + json + ")");
                // appInf = data;
                var activityArray = data["activity"];
                var cssArr = data["CSS"];
                var scriptArr = data["script"];

                appInf[loadName] = [];
                // 遍历处理Activity的数据
                for (var k in activityArray) {
                    var layout_url = activityArray[k].layout;
                    var temp = activityArray[k];
                    temp.layout = [];
                    temp.layout.url = layout_url;
                    appInf.activity[activityArray[k].name] = temp;
                    appInf[loadName][activityArray[k].name] = temp;
                }

                pArr.push(APP.loadActivityArray(loadName));
                !cssArr || pArr.push(loadCSSArr(cssArr));
                !scriptArr || pArr.push(loadScriptArr(scriptArr));
                return Promise.all(pArr);
            });
        },
        preCache:function(url){
          var pArr = [];
            return loadText(url).then(function(json){
                var data = eval("(" + json + ")");
                var imgArr = data.img;
                pArr.push(APP.preImgCacheArr(imgArr));
                return Promise.all(pArr);
            })
        }
    };
})());
