/**
 * Created by szc on 16/7/20.
 */
var selectObj = function(name, callback) {
    //var flag;
    function selectItem(name, callback) {
        Action.click(name, function() {
            var _this = this;
            //console.log(_this);
            var select = nextElementSibling(_this);
            if (select.nodeType != 1) { //全局的select
                select = document.getElementById("account-entry-select"); //获取当前input下的ul
                var top = _this.getBoundingClientRect().top + 50;
                J(select).setcss("top", top + "px");
                var left = _this.getBoundingClientRect().left;
                J(select).setcss("left", left + "px");
            } else { //特定的select
                var left = _this.offsetLeft; //给下拉框设置位置
                J(select).setcss("left", left + "px");
            }
            //console.log(select);
            //update by zhudan 12/22
            if (J(select).getcss("display") == "none") {
                getSelectValue(select, _this, name, callback);
            } else {
                hideSelect(select);
            }

            //flag = !flag;
        });

        /*
         *获取下拉列表的值
         */
        function getSelectValue(select, _this, type, callback) {
            showSelect(select);
            preventArr[type] = hideSelect;
            select.onclick = function(e) { //事件委托
                if (e.target.nodeName.toLowerCase() == "li") {
                    var oldValue = _this.value;
                    _this.value = e.target.innerText;
                    //console.log(_this.value);
                    _this.dataset.value = e.target.dataset.value;
                    if (callback && _this.value != oldValue) {
                        callback.apply(_this);
                    }
                    // set(_this); //设置特定的事件及样式操作
                    hideSelect(select);
                }
            }
        }

        function showSelect(select) {
            select.style.display = "block";
        }

        function hideSelect(select) {
            select.style.display = "none";
        }

    }

    selectItem(name, callback);

};

var Time = {
    /**
     * [时间戳转时间]
     * @param  {[type]} time [description]
     * @return {[type]}      [description]
     */
    timeTodate: function(time) {
        if(!time) return;
        var date = new Date(time * 1000);
        return date.getFullYear() + "-" + changetime(parseInt(date.getMonth() + 1)) + "-" + changetime(date.getDate());
    },
    /**
     * [时间转时间戳]
     * @param  {[type]} datestr [description]
     * @return {[type]}         [description]
     */
    dateTotime: function(datestr) {
        if(datestr == '') return datestr;
        var date = new Date();
        var datestr = datestr.split("-");
        date.setFullYear(datestr[0], datestr[1] - 1, datestr[2]);
        return parseInt(date.getTime() / 1000) - date.getHours() * 3600 - date.getMinutes() * 60 - date.getSeconds();
    },
    getNowTime: function() {
        return parseInt(new Date().getTime() / 1000);
    },
    getNowDate: function() {
        var date = new Date();
        return date.getFullYear() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate();
    }
}



/**
 * [nextPage 切换到下一个页面]
 * @param  {[type]} currentPage [description]
 * @param  {[type]} nextPage    [description]
 * @return {[type]}             [description]
 */
function nextPage(currentPage, nextPage) {
    currentPage.style.display = "none";
    nextPage.style.display = "block";
}


/**
 * [changeRateStyle 改变税金和税率的样式]
 * @param  {[type]} _this             [判断条件]
 * @param  {[type]} rate              [税率的文字描述]
 * @param  {[type]} rate_type         [税率的选择]
 * @param  {[type]} rate_amount       [税金的文字描述]
 * @param  {[type]} rate_amount_value [税金的计算]
 * @return {[type]}                   [description]
 */
function changeRateStyle(_this, rate, rate_type, rate_amount, rate_amount_value) {
    if (arguments.length == 5) {
        if (_this) {
            J(rate).setcss("color", "#9B9B9B");
            rate_type.dataset.flag = "0";
            rate_amount_value.setAttribute("readonly", "readonly");
            rate_type.value = "";
            J(rate_amount).setcss("color", "#9B9B9B");
            rate_amount_value.value = "";
        } else {
            J(rate).setcss("color", "#4A4A4A");
            J(rate_amount).setcss("color", "#4A4A4A");
            rate_amount_value.removeAttribute("readonly");
            rate_type.dataset.flag = "1";
        }
    } else {
        if (_this) {
            J(arguments[1]).setcss("color", "#9B9B9B");
            arguments[2].value = "";
            arguments[2].setAttribute("readonly", "readonly");
        } else {
            J(arguments[1]).setcss("color", "#4A4A4A");
            arguments[2].removeAttribute("readonly");
        }
    }
}


/**
 * [isEmpty d检测输入的值是否为空]
 * @param  {[type]}  elem [description]
 * @return {Boolean}      [description]
 */
function isEmpty(elem) {
    var value = elem.value || elem.innerText;
    if (value == "" || value == "-1") {
        return true;
    } else {
        return false;
    }
}

/**
 * [isNumber d检测值是否是数字]
 * @param  {[type]}  elem [description]
 * @return {Boolean}      [description]
 */
function isNumber(elem) {
    var value = elem.value;
    var re = new RegExp("^[1-9][0-9.]{0,20}$");
    if (re.test(value)) {
        return true;
    } else {
        return false;
    }
}


/**
 * [testAllElem 获取所有没有填写的或者填写错误的数据]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
function testAllElem(id) {
    var all_elements = document.getElementById(id);
    var all = all_elements.getElementsByTagName("*");
    var arr = [];
    var numArr = [];
    for (var i = 0; i < all.length; i++) {
        if ((all[i].nodeName.toLowerCase() == "input" && isEmpty(all[i])) && (all[i].getAttribute("readonly") != "readonly") && all[i].dataset.cost != "0" && all[i].getAttribute("isNull")!='1' || all[i].dataset.flag == "1") {
            arr.push(all[i]);
        } else if ((all[i].nodeName.toLowerCase() == "input" && !isEmpty(all[i]))) {
            all[i].style.border = "1px solid #d4d4d4";
        }

        if (all[i].nodeName.toLowerCase() == "input" && all[i].dataset.num == "1" && !isNumber(all[i]) && !isEmpty(all[i]) && all[i].dataset.cost != "0") {
            numArr.push(all[i]);
        } else if (all[i].nodeName.toLowerCase() == "input" && all[i].dataset.num == "1" && isNumber(all[i]) && !isEmpty(all[i])) {
            all[i].style.border = "1px solid #d4d4d4";
        }
    }
    if (arr.length != 0) {
        arr[0].style.border = "1px solid #f00";
    }

    if (numArr.length != 0) {
        numArr[0].style.border = "1px solid #f00";
    }

    console.log(arr, numArr);
    return { arr: arr, numArr: numArr }
}



function setDataFlag(_this) {
    if (_this.value == "") {
        _this.dataset.flag = "1"; //下拉框的值为空
    } else {
        _this.dataset.flag = "0"; //下拉框的值不为空或者是处于不可编辑状态
    }
}




/**
 * [changetime 月份转换]
 * @param  {[type]} t [月份]
 * @return {[type]}
 */
function changetime(t) {
    if (t < 10) {
        return "0" + t;
    }
    return t;
}

//获取初始化时间格式
function getInitDate() {
    var time = new Date();
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    month = changetime(month);
    var time_format = year + "-" + month;
    var timesec = time.getTime();
    var last_month = month - 1;
    last_month = changetime(last_month);
    var last_time_format = year + "-" + last_month;
    return {
        // last: last_time_format,
        current: time_format,
        last:time_format
    }
}

//获取初始化时间
function getInitTime() {
    var time = new Date();
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var current_time = Time.dateTotime(year + "-" + month + "-01");
    var last_month = month - 1;
    var last_time_format = year + "-" + last_month + "-01";
    var last_time = Time.dateTotime(last_time_format);
    var next_time = Time.dateTotime(year + "-" + (month + 1) + "-01");

    return {
        current_time: current_time,
        // last_time: last_time,
        last_time: current_time,
        next_time: next_time
    }
}
//绘制折线对象
var candata = [];
var canvasObj = function(ctx, data, pointX, max, min, origin, maxObj, color, can) {
    /**
     * [drawLine 绘制折线]
     * @param  {[type]} data  [重新设置过的数据]
     * @param  {[type]} ctx   [canvas画笔]
     * @param  {[type]} color [直线颜色]
     * @return {[type]}
     */
    function drawLine(data, ctx, color) {
        candata.push(data);
        for (var i = 0; i < data.length; i++) {
            if (i == data.length - 1) {
                drawCircle(ctx, data[i].x, data[i].y, color);
                // ctx.fillText(data[i].value, data[i].x, data[i].y);
                return;
            }
            strokeLine(ctx, data[i].x, data[i].y, data[i + 1].x, data[i + 1].y, color);
            drawCircle(ctx, data[i].x, data[i].y, color);
            // ctx.fillText(data[i].value, data[i].x, data[i].y);
        }

    }
    //绘制折线端的圆
    function drawCircle(ctx, x, y, color) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    }
    /**
     * [setData 设置折点的位置]
     * @param {[type]} data   [最初的数据点]
     * @param {[type]} pointX [每个月的位置]
     * @param {[type]} max    [最大的数据]
     * @param {[type]} min    [最小的数据]
     * @param {[type]} origin [原点位置]
     * @param {[type]} maxObj [最大值的位置]
     */
    function setData(data, pointX, max, min, origin, maxObj) {
        for (var i = 0; i < data.length; i++) {
            var value = data[i];
            data[i] = {};
            data[i].value = value;
            data[i].x = parseInt(pointX[i] + 11);
            value = parseInt(-parseFloat(data[i].value) + (max - min) / 2);

            data[i].y = parseInt((origin.y - maxObj.y) * (value / (max - min)) + 45);
        }
        return data;
    }

    //绘制直线
    function strokeLine(context, x1, y1, x2, y2, color) {
        context.save();
        context.strokeStyle = color;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        context.restore();
    }

    drawLine(setData(data, pointX, max, min, origin, maxObj), ctx, color); //执行绘制
    window.showData = function(e) {
        var ctx2 = document.getElementById("showText").getContext("2d");
        ctx2.clearRect(0, 0, 640, 280);
        var x = e.clientX - 190;
        // console.log(candata)
        if (x > 79 && x < 569) {
            strokeLine(ctx2, x, 230, x, 45, "red");
            ctx2.save();
            ctx2.fillStyle = "#d4d4d4";
            ctx2.fillRect(x, 0, 100, 45);
            ctx2.restore();
            // ctx2.fillText("1月收入:",x + 5,18);
            // ctx2.fillText("1月利润:",x + 5,32);
            var firstData = candata[0];
            var secondData = candata[1];
            for (var i = 0; i < firstData.length; i++) {
                if (i == firstData.length - 1) return;
                if (x > firstData[i].x && x < firstData[i + 1].x) {
                    drawText(ctx2, i, x);
                }
            }
        } else {
            ctx2.clearRect(0, 0, 640, 280);
        }

        function drawText(ctx2, index, x) {
            console.log(i)
            ctx2.fillText(index + 1 + "月收入:" + firstData[index].value, x + 5, 18);
            ctx2.fillText(index + 1 + "月利润:" + secondData[index].value, x + 5, 32);
        }
    }
}

//获取一个元素的下一个元素节点的兼容写法
function nextElementSibling(ele) {
    if (ele.nextElementSibling) {
        return ele.nextElementSibling;
    } else {
        do {
            ele = ele.nextSibling;
        } while (ele && ele.nodeType == 1);
        return ele;
    }
}
//获取一个元素的前一个元素节点的兼容写法
function previousElementSibling(ele) {
    if (ele.previousElementSibling) {
        return ele.previousElementSibling;
    } else {
        do {
            ele = ele.previousSibling;
        } while (ele && ele.nodeType == 1);
        return ele;
    }
}

//获取一个元素的所有兄弟节点
function getAllSiblings(currentEle) {
    var arr = [];
    var all = currentEle.parentNode.children;
    for (var i = 0; i < all.length; i++) {
        if (all[i] != currentEle) {
            arr.push(all[i]);
        }
    }
    return arr;
}

/**
 * [flashData 刷新数据]
 * @param  {[type]}   url       [请求接口地址]
 * @param  {[type]}   condition [请求条件]
 * @param  {Function} fn        [请求完成后要执行的函数]
 * @return {[type]}             [description]
 */
function flashData(url, condition, fn) {
    xhrSend(url, condition, function(data) {
        if (fn && typeof fn == "function") {
            fn(data);
        }
    });
}

//公共信息获取
function reSend(ele, parent, fn) {
    xhrSend("Select_all_info/get_info", {}, function(data) {
        comInfo = data;
        comInfo.TYPE = flagArr;
        var htmlDate = objectManager.create(Jtmpl, ele).createHtml(data);
        J(parent).setHtml(htmlDate);
        if (fn && typeof fn == "function") {
            fn(data);
        }
    });
}

//新增账户后显示当前账户的名字以及相关信息
/**
 * [showCurrentAccount description]
 * @param  {[type]} id1 [当前账户的id]
 * @param  {[type]} id2 [显示前期情况的id]
 * @param {[type]}  data [新的数据]
 * @return {[type]}     [description]
 */
function showCurrentAccount(arg) {
    var ac = document.getElementById(arg.id1);
    ac.value = arg.name;
    setDataFlag(ac);
    for (var i in arg.data.account_list) {
        if (arg.data.account_list[i].account_name == arg.name) {
            ac.dataset.value = arg.data.account_list[i].account_id;
            var account_balan = parseFloat(arg.data.account_list[i].account_balan);
            document.getElementById(arg.id2).innerText = "该帐户还有余额" + account_balan + "元";
        }
    }
}

//显时其他往来单位,客户或供应商
function showCurrentRy(arg) {
    var de = document.getElementById(arg.id1);
    var tag = (arg.type == "rent" || arg.type == "decoration" || arg.type == "ry") ? "其他往来单位" : (arg.type == "client" || arg.type == "cl") ? "客户" : (arg.type == "su") ? "供应商" : "人员";
    de.value = arg.name + "(" + tag + ")";
    setDataFlag(de);
    if(arg.type == "person"){
        for(var i in arg.data.staff_list){
            if(arg.data.staff_list[i].name == arg.name){
                if (arg.id3) {
                var client_name = document.getElementById(arg.id3);
                client_name.innerText = arg.name;
                client_name.dataset.value = arg.data.staff_list[i].st_id;
            }
            de.dataset.value = arg.data.staff_list[i].st_id;
            var loan_amount = parseFloat(arg.data.staff_list[i].loan_amount);
            document.getElementById(arg.id2).innerText = loan_amount < 0 ? "公司还欠该人员" + (-loan_amount) + "元" : "该人员还欠公司" + loan_amount + "元";
            }
        }
    }
    for (var i in arg.data.out_link_list) {
        if (arg.data.out_link_list[i].name == arg.name) {
            if (arg.id3) {
                var client_name = document.getElementById(arg.id3);
                client_name.innerText = arg.name;
                client_name.dataset.value = arg.data.out_link_list[i].st_id;
            }
            de.dataset.value = arg.data.out_link_list[i].st_id;
            var loan_amount = parseFloat(arg.data.out_link_list[i].loan_amount);
            if (arg.id2) {
                if (arg.type == "rent") {
                    document.getElementById(arg.id2).innerText = loan_amount < 0 ? "公司还欠该出租方" + (-loan_amount) + "元" : "该出租方还欠公司" + loan_amount + "元";
                } else if (arg.type == "decoration") {
                    document.getElementById(arg.id2).innerText = loan_amount < 0 ? "公司还欠该装修方" + (-loan_amount) + "元" : "该装修方还欠公司" + loan_amount + "元";
                } else if (arg.type == "client" || arg.type == "cl") {
                    document.getElementById(arg.id2).innerText = loan_amount < 0 ? "公司还欠该客户" + (-loan_amount) + "元" : "该客户还欠公司" + loan_amount + "元";
                } else if (arg.type == "su") {
                    document.getElementById(arg.id2).innerText = loan_amount < 0 ? "公司还欠该供应商" + (-loan_amount) + "元" : "该供应商还欠公司" + loan_amount + "元";
                } else if (arg.type == "ry") {
                    document.getElementById(arg.id2).innerText = loan_amount < 0 ? "公司还欠该单位" + (-loan_amount) + "元" : "该单位还欠公司" + loan_amount + "元";
                }
            }
        }
    }
}

//获取对象的长度
function length(obj) {
    var count = 0;
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            count++;
        }
    }

    return count;
};
/**
 * [ticketDisappear 单据关闭动画]
 * @param  {[type]} id [单据id号]
 * @return {[type]}
 */
function ticketDisappear(id) {
    if(document.getElementById(id) != null && document.getElementById(id) != undefined){
        var ticket = document.getElementById(id);
        ticket.style.transform = "translate3d(0px,0px,0px)";
    }
}

// start起始时间, end结束时间
function focusOperate(start, end, fn) {
    var _s = start;
    var _e = end;
    var confirm = document.getElementById("confirm");
    confirm.addEventListener("click", selecttime, false);

    function selecttime() {
        var st = Time.dateTotime(_s.value + "-01");
        var et = Time.dateTotime(_e.value + "-01");
        if(fn && typeof fn == "function"){
            fn(st, et);
        }
        confirm.removeEventListener("click", selecttime, false);
    }
}



//yql 设置光标在某个input上
function setInputFocus(idName) {
    setTimeout( function(){
        try{
            var t = document.getElementById(idName);
            t.focus();
            //t.select();//全选input中原有的文字
        } catch(e){}
    }, 200);
}

//11-28 by zhudan
//获取当前事件源的兼容写法
function getTarget(e){
    var e = e || window.event;
    var target = e.target || e.srcElement;
    return target;
}

/**
 * [initSecondModelAnim 二季菜单初始化以及单据的动画] 11-30 by zhudan
 * @param  {[type]} flag [string 可以时data-action||data-target]
 * @return {[type]}      [description]
 */
function initSecondModelAnim(flag){
    var panelActivity = objectManager.create(SecondModel, secondModelAction[flag]);
    secondModelActivity[flag] = panelActivity;
    panelActivity.init();
    panelActivity.activite();
    var ticket = document.getElementById(flag + "-translate");
    J(ticket).getcss("display");
    ticket.style.transform = "translate3d(0px,-100%,0px)";
}


/**
 * 精度控制
 * @param num
 * @returns {number}
 */
function getFloat(num){
    num = parseInt(num * 100);
    return num / 100;
}

/**
 * [增加控制输入]
 * @param  {[type]} _ob [description]
 * @return {[type]}     [description]
 */
function controlInput(type){
    var dom = this;
    AddEvent(dom,'keypress',fn);
    /**
     * [小数，小数点后两位精度输入]
     * @param  {[type]}   event [description]
     * @return {Function}       [description]
     */
    function fn(event) {
    var dom = event.target;
    if (dom.getAttribute('type') == "float_2") {
        if ((event.keyCode < 48 || event.keyCode > 57) && event.keyCode != 46 || /\.\d\d$/.test(dom.value)) event.returnValue = false;
    }

    //输入范围大于等于0,且不能又小数点
    if (dom.getAttribute('type') == "number_0"){
            // 如果不是数字，就不允许输入
            if (event.keyCode < 48 || event.keyCode > 57 || /[\.]+/.test(dom.value)) {
              event.returnValue = false;
              //AlertDel.errorState("输入的必须是整数且大于等于0");
            }
    }
   }
}

/**
 * [显示新增的费用项目]
 * @param  {[id]}  [当前下拉框的id]
 * @param {[name]}     [新增费用的名称]
 * @param {[data]}     [新增费用后拉取的新数据]
*/
function showCurrentExpense(id, name, data){
    J(id).thisp.value = name;
       for(var i in data.cost_list){
            if(name == data.cost_list[i].item_name){
                J(id).thisp.dataset.value = data.cost_list[i].item_id;
            }
  }
}
