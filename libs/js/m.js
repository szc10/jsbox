/**
 * [ActionSlots 对事物建立一个新的监听槽,可重复对象]
 * @param {[type]} dom        [description]
 * @param {[type]} actionType [description]
 */
ActionSlots = function (dom, actionType, point) {

    var domAction = [];
    var listener = dom;
    var eventType = actionType;
    var thisp = this;
    AddEvent(listener, eventType, function (ev) {
        var target = thisp.getDomTarget(ev.target);
        var actionArr = thisp.getDomActionArr(target);

        for (var i = 0; i < actionArr.length; i++) {
            dealAction.call(target, actionArr[i], target);
        }
    });

    function dealAction(action, target) {
        if (domAction[action]) {
            domAction[action].call(point, target);
        } else {
            return;
        }
    }

    this.addEvent = function (action, fn) {
        domAction[action] = fn;
    };
}

ActionSlots.prototype.getDomTarget = function (dom) {
    var target = dom;
    if (target.dataset.action || (target.nodeName == "CONTEXT" || target.nodeName == "BODY" || target.nodeName == "UIACTIVITY")) {
        return target;
    } else {
        return this.getDomTarget(target.parentNode);
    }
};

ActionSlots.prototype.getDomActionArr = function (target) {
    if (target.dataset.action) {
        return target.dataset.action.split(" ");
    } else {
        return [];
    }
}


var JTemplate = function (_OB) {
    var target = this.loadTar = _OB.target;
    var method = _OB.method || [];
    var data = _OB.data || [];
    var tmpl = new Jtmpl(_OB.html);
    var point = document.createElement('uitemplate');
    target.appendChild(point);
    for (var k in method) {
        this[k] = method[k];
    }
    this._setData = function (key, _data) {

        // var data = {};
        data[key] = _data;
        // console.log(data);
    };
    this._start = function () {
     
        var html = tmpl.getFunction().call(this, data, method);
        point.innerHTML = html;
    };
    this._sleep = function () {
        point.style.display = "none";
    };
    this._activite = function () {
        point.style.display = "block";
    };
    this._context = point;
};

JTemplate.prototype = {
    start: function (key, data) {
        if (key && data)
            this._setData(key, data);
        this._start();
        this._activite();
        return this;
    },
    setData: function (key, data) {
        if (key && data)
            this._setData(key, data);
        this._start();
        return this;
    },
    activite: function () {
        this._activite();
        return this;
    },
    sleep: function () {
        this._sleep();
        return this;
    },
    getContext: function () {
        return this._context;
    },
    destroy: function () {
        this.loadTar.removeChild(this._context);
    }
};



var JActivity = function (config) {
    this.config = config;
    this.action = config.config;
    this.context = null;
    this.actionArr = [];

    //如果模板不存在则创建一个空的队列
    this.action.template = this.action.template || [];
    /**
     * 初始化的时候的系统函数
     * @private
     */
    /**
     * [插件初始化所需要的方法,在类继承的时候所需要用到]
     * @return {[type]} [description]
     */
    this.plugInit = new Function("");

    for (var k in this.action) {
        if (isloadFn(k)) {
            this[k] = this.action[k];
        }
    }
    function isloadFn(action) {
        var checkFnArr = ["init", "activite", "sleep", "destroy", "name", "type"];
        for (var k in checkFnArr) {
            if (action == checkFnArr[k])
                return false;
        }
        return true;
    }

    this._init = function () {
        var uiactivity = document.createElement('uiactivity');
        this.config.loadTarget.appendChild(uiactivity);
        uiactivity.innerHTML = this.config.layout.data || this.action.layout.text;
        this.config.layout.point = uiactivity;
        this.context = this.getContext();
        if (this._preInit) {
            this._preInit();
        }
        if (this.action.init) {
            this.action.init.apply(this, arguments);
        }
        this.plugInit();
    }
    /**
     * 唤醒的时候的系统函数
     * @private
     */
    this._activite = function () {
        this.config.layout.point.style.display = "block";

        if (this.action.activite) {
            this.action.activite.apply(this, arguments);
        }
        // var uiactivity = this.config.layout.point;
    }
    /**
     * 睡眠的时候的系统函数
     * @private
     */
    this._sleep = function () {
        if (this.action.sleep) {
            this.action.sleep.apply(this, arguments);
        }
        this.config.layout.point.style.display = "none";

    }
    /**
     * 销毁的时候的系统函数
     * @private
     */
    this._destroy = function () {
        if (this.action.destroy) {
            this.action.destroy.apply(this, arguments);
        }
        APP.deleteJActivity(this.action.name);
    }
    /**
     * 更新当前activity的状态
     * @param newState
     * @private
     */
    this._updateState = function (newState) {
        this.config.state = newState;
    }
    /**
     * 获取当前Activity的状态
     * @returns {*}
     */
    this.getState = function () {
        return this.config.state;
    }
};

JActivity.prototype = {
    init: function () {
        var state = "paused";
        this._updateState(state);
        this._init.apply(this, arguments);
        return this;
    },
    activite: function () {
        var state = "active";
        this._updateState(state);
        this._activite.apply(this, arguments);
    },
    sleep: function () {
        var state = "paused";
        this._updateState(state);
        this._sleep.apply(this, arguments);
    },
    destroy: function () {
        this._destroy.apply(this, arguments);
    },
    loadTemplate: function (name, target) {
        var _ob = APP.clone(this.action.template[name]);
        _ob.target = target;
        try {
            if (!this.config.layout.point.querySelector('script[data-name="' + name + '"]')) throw "act-name:" + name + " is not find";
            _ob.html = this.config.layout.point.querySelector('script[data-name="' + name + '"]').innerHTML;
        } catch (err) {
            console.log(err);
        }

        return new JTemplate(_ob);
    },
    findDom: function (name) {
        try {
            if (!this.context.querySelector('*[name="' + name + '"]')) throw "name:" + name + " is not find";
            return this.context.querySelector('*[name="' + name + '"]');
        } catch (err) {
            console.log(err);
        }

    },
    /**
     * 获取ui中的布局正文
     * @returns {*}
     */
    getContext: function () {
        var dom = this.config.layout.point;
        for (var i = 0; i < dom.childNodes.length; i++) {
            if (dom.childNodes[i].nodeName == "CONTEXT")
                return dom.childNodes[i];
        } return this.config.layout.point;
    },
    /**
     * 获取ui中的模板文件
     * @param name
     * @returns {*}
     */
    getTemplate: function () {
        var dom = this.config.layout.point;
        var templateArr = [];
        for (var i = 0; i < dom.childNodes.length; i++) {
            if (dom.childNodes[i].nodeName == "SCRIPT") {
                templateArr.push(dom.childNodes[i]);
                if (dom.childNodes[i].dataset.name) {
                    templateArr[dom.childNodes[i].dataset.name] = dom.childNodes[i];
                }
            }
        }
        return templateArr;
    },
    /**
     * 加载一个activity活动
     * @param modname
     * @param runname
     * @param targetLoadDom
     * @param type
     * @returns {*|JActivity}
     */
    loadActivity: function (modname, runname, targetLoadDom, type) {
        return APP.loadJActivity(this, modname, runname, targetLoadDom, type);
    },
    addEvent: function (actionType, actionName, fn) {
        if (this.actionArr[actionType]) {
            this.actionArr[actionType].addEvent(actionName, fn);
        } else {
            this.actionArr[actionType] = new ActionSlots(this.getContext(), actionType, this);
            this.actionArr[actionType].addEvent(actionName, fn);
        }
    }
}

/**
 * 选择弹窗
 * @param {*} title 
 * @param {*} okFn 
 * @param {*} errFn 
 */
function ConfirmAlert(title, okFn, errFn) {
    //  var content = document.getElementById('test');
    var content = document.createElement('div');
    content.className = "_maskUI confirm-alert";
    content.innerHTML = '<div class="_maskUI-msg"><h3></h3><ul><li class="_canle">取消</li><li class="_ok">确定</li></ul></div>';
    document.body.appendChild(content);
    var okBtn = content.getElementsByClassName('_ok')[0];
    var canleBtn = content.getElementsByClassName("_canle")[0];
    var titleH3 = content.getElementsByTagName("H3")[0];
    titleH3.innerHTML = title;

    J(okBtn).click(function () {
        !(okFn) || okFn();
        close();
    });

    J(canleBtn).click(function () {
        !(errFn) || errFn();
        close();
    });
    function close() {
        document.body.removeChild(content);
    }
}
