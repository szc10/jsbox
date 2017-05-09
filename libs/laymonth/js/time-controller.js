;
var TimerController = (function() {
    var body = getTag("body")[0];
    var timerController = document.createElement("div");
    timerController.id = "time_controller";
    var str = ["<style>",
        "    #time_controller{",
        "        width: 160px;",
        "        height: 210px;",
        "        display: none;",
        "        z-index: 999;",
        "        position: absolute;",
        "        border:1px solid #ccc;",
        "        font-size:14px;",
        "        background: #fff;",
        "    }",
        "</style>",
        "<div class='header' id='time'>",
        "<div class='direct left' id='left'>&lt;</div>",
        "<div class='direct right' id='right'>&gt;</div>",
        "<div class='content' id='content'>2016年</div>",
        "</div>",
        "<ul id='month_select'><li>01月</li><li>02月</li><li>03月</li><li>04月</li><li>05月</li><li>06月</li><li>07月</li><li>08月</li><li>09月</li><li>10月</li><li>11月</li><li>12月</li></ul><div class='button_group'><button id='confirm'>确定</button></div>",
    ].join("");
    body.appendChild(timerController);

    timerController.innerHTML += str;

    var time_controller = getId("time_controller");
    var time = getId("time");
    var left = getId("left");
    var right = getId("right");
    var content = getId("content");
    var month_select = getId("month_select");
    var confirm = getId("confirm");

    //初始化时间
    function inittime() {
        var li = getTag("li", month_select);
        content.innerText = (new Date()).getFullYear() + "年";
        for (var i = 0; i < li.length; i++) {
            J(li[i]).removeClass("on");
        }
    }
    //删选时间(_year:传入的年份,_month传入的月份)
    function selectYear(_year, _month) {
        var li = getTag("li", month_select);
        var year = parseInt(content.innerText);
        left.onclick = function() {
            if (year > _year) {
                year -= 1;
            }
            for (var i = 0; i < li.length; i++) {
                if (year == _year && parseFloat(li[i].innerText) < _month) {
                    J(li[i]).setcss("color", "#ccc");
                }
            }
            content.innerText = year + "年";
        }
        right.onclick = function() {
            year += 1;
            for (var i = 0; i < li.length; i++) {
                J(li[i]).setcss("color", "#000");
            }
            content.innerText = year + "年";
        }
    }
    /**
     * [selectMonth 选择当前月份，并给之添加一个背景元素]
     */
    function selectMonth() {
        var li = getTag("li", month_select);
        for (var i = 0; i < li.length; i++) {
            li[i].onclick = function() {
                if (J(this).getcss("color") != "rgb(204, 204, 204)") {
                    J(this).addClass("on");
                }
                var arr = siblings(month_select, this);
                for (var j = 0; j < arr.length; j++) {
                    J(arr[j]).removeClass("on");
                }
            }
        }
    }


    /**
     * 设置日期控件的位置
     */

    function getPosition(ev) {
        var date_input = ev;
        var left = date_input.getBoundingClientRect().left;
        var top = date_input.getBoundingClientRect().top;
        var width = date_input.offsetWidth;
        var height = date_input.offsetHeight;
        var innerHeight = getHeight().height;
        var innerWidth = getHeight().width;
        time_controller.style.display = "block";
        //如果当前input的下面的距离小于日期控件的距离，就显示在input上面
        if (innerWidth - left < time_controller.offsetWidth) {
            time_controller.style.left = (left - time_controller.offsetWidth / 2) + "px";
        } else {
            time_controller.style.left = left + "px";
        }
        if ((innerHeight - top - height) < time_controller.offsetHeight) {
            // time_controller.style.left = left + "px";
            time_controller.style.top = (top - time_controller.offsetHeight - height) + "px";
        } else {
            // time_controller.style.left = left + "px";
            time_controller.style.top = (top + height) + "px";
        }
    }

    /**
     * [confirmTime 点击确认按钮后获取当前时间]
     * @param  {[type]} year  [description]
     * @param  {[type]} month [description]
     * @return {[type]}       [description]
     */
    function confirmTime(year, month) {
        var year = year.innerText.split("年")[0];
        var li = getTag("li", month_select);
        var month = 0;
        for (var i = 0; i < li.length; i++) {
            if (hasclass(li[i], "on")) {
                month = li[i].innerText.split("月")[0];
            }
        }
        time_controller.style.display = "none";
        if (month == 0) return;
        return year + "-" + month;
    }

    /**
     * [getHeight 获取浏览器窗口的高度]
     * @return {[type]} [description]
     */
    function getHeight() {
        var height = 0;
        var width = 0;
        if (window.innerHeight) {
            height = window.innerHeight;
            width = window.innerWidth;
        } else if (document.body.clientHeight) {
            height = document.body.clientHeight;
            widdth = document.body.clientWidth;
        }
        return {
            width: width,
            height: height
        }
    }
    /**
     * [getId 获取id值的当前元素]
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    function getId(id) {
        return document.getElementById(id);
    }

    /**
     * [getTag 获取指定元素下的所有名为tagname的节点]
     * @param  {[type]} tagName    [description]
     * @param  {[type]} parentNode [description]
     * @return {[type]}            [description]
     */
    function getTag(tagName, parentNode) {
        var node = null;
        if (arguments.length == 1) {
            node = document;
        } else {
            node = parentNode;
        }
        return node.getElementsByTagName(tagName);
    }
    /**
     * [siblings 获取所有相邻兄弟节点]
     * @param  {[type]} parent  [description]
     * @param  {[type]} curNode [description]
     * @return {[type]}         [description]
     */
    function siblings(parent, curNode) {
        var allNodes = getTag("*", parent);
        var arr = [];
        for (var i = 0; i < allNodes.length; i++) {
            if (allNodes[i].nodeType == 1 && allNodes[i] != curNode) {
                arr.push(allNodes[i]);
            }
        }

        return arr;
    }


    /**
     * [laydate 输入时间的点击事件]
     * @param  {[type]} ev [description]
     * @return {[type]}    [description]
     */
    var laymonth = null;
    window.laymonth = function(ev) {
        var li = getTag("li", month_select);
        inittime(); //初始化时间
        var initTime = global_param_time;
        var cur_year = parseFloat(initTime.split("-")[0]);
        var cur_month = parseFloat(initTime.split("-")[1]);
        for (var i = 0; i < li.length; i++) {
            if (cur_year == parseFloat(content.innerText) && parseFloat(li[i].innerText) < cur_month) {
                J(li[i]).setcss("color", "#ccc");
            } else {
                J(li[i]).setcss("color", "#000");
            }
        }
        selectYear(cur_year, cur_month);
        selectMonth();
        // }

        getPosition(ev);
        confirm.onclick = function() {
            ev.value = confirmTime(content, month_select) == undefined ? ev.value : confirmTime(content, month_select);
        }
        var id = ev.id;
        preventArr[id] = function() {
            time_controller.style.display = "none";
        }
    }

    return {
        getTag: getTag,

    }
})();


var YearSelect = (function() {
    var strVar = "";
    strVar += "    <div class=\"_year_select_header\"><span class=\"_left\" data-target=\"_before\">上一页<\/span>{{=data.start}}-{{=data.end}}<span class=\"_right\" data-target=\"_next\">下一页<\/span><\/div>";
    strVar += "    <div class=\"_year_select_wapper\">";
    strVar += "        <ul>";
    strVar += "            <li class=\"no_select\">{{=data.start-1}}<\/li>";
    strVar += "            {{ for(var i = data.start; i < data.start+3; i++)  { }}";
    strVar += "            <li class=\"select\" data-val=\"{{=i}}\">{{=i}}<\/li>";
    strVar += "            {{ } }}";
    strVar += "        <\/ul>";
    strVar += "        <ul>";
    strVar += "            {{ for(var i = data.start+3; i < data.start+7; i++)  { }}";
    strVar += "            <li class=\"select\" data-val=\"{{=i}}\">{{=i}}<\/li>";
    strVar += "            {{ } }}";
    strVar += "        <\/ul>";
    strVar += "        <ul>";
    strVar += "            <li class=\"select\" data-val=\"{{=data.end-2}}\">{{=data.end-2}}<\/li>";
    strVar += "            <li class=\"select\" data-val=\"{{=data.end-1}}\">{{=data.end-1}}<\/li>";
    strVar += "            <li class=\"select\" data-val=\"{{=data.end}}\">{{=data.end}}<\/li>";
    strVar += "            <li class=\"no_select\">{{=data.end+1}}<\/li>";
    strVar += "        <\/ul>";
    strVar += "    <\/div>";
    var year_t = new Jtmpl(strVar);
    strVar = "";
    strVar += " <style>";
    strVar += "        ._no_display{";
    strVar += "            display: none !important;";
    strVar += "        }";
    strVar += "        ._year_select_container{";
    strVar += "            position: absolute;";
    strVar += "            font-size: 16px;";
    strVar += "            background: #FFF;";
    strVar += "            border-radius: 3px;";
    strVar += "            z-index: 22;";
    strVar += "            border: 1px solid #d4d4d4;box-shadow: 0 2px 10px rgba(0,0,0,.2);";
    strVar += "        }";
    strVar += "        ._year_select_header {";
    strVar += "            text-align: center;";
    strVar += "            font-weight: 900;";
    strVar += "            padding-top: 10px;";
    strVar += "            padding-bottom: 10px;";
    strVar += "        }";
    strVar += "        ._year_select_container ul{";
    strVar += "            display: flex;";
    strVar += "            width: 100%;";
    strVar += "        }";
    strVar += "";
    strVar += "";
    strVar += "        ._year_select_container li{";
    strVar += "            text-align: center;";
    strVar += "            padding: 20px 10px 20px 10px;";
    strVar += "            border-radius: 2px;";
    strVar += "        }";
    strVar += "";
    strVar += "";
    strVar += "        ._year_select_container li.active{";
    strVar += "            background: #1EAAF1;";
    strVar += "            color: #fff;";
    strVar += "        }";
    strVar += "        ._year_select_container li.no_select{";
    strVar += "            color: #7c7c7c;";
    strVar += "        }";
    strVar += "";
    strVar += "        ._year_select_container li.select{";
    strVar += "            cursor: pointer;";
    strVar += "        }";
    strVar += "        ._year_select_container li.select:hover{";
    strVar += "            background: rgb(240,240,240);";
    strVar += "        }";
    strVar += "        ._year_select_container  li.select:active{";
    strVar += "            background: #1EAAF1;";
    strVar += "            color: #fff;";
    strVar += "        }";
    strVar += "";
    strVar += "        ._year_select_container ._left,._right{";
    strVar += "            font-size: 12px;";
    strVar += "            line-height: 17px;";
    strVar += "            cursor: pointer;";
    strVar += "        }";
    strVar += "        ._year_select_container ._left{";
    strVar += "            float: left;";
    strVar += "            padding-left: 13px;";
    strVar += "        }";
    strVar += "        ._year_select_container ._right{";
    strVar += "            float: right;";
    strVar += "            padding-right: 13px;";
    strVar += "        }";
    strVar += "    <\/style>";
    strVar += "    <div class=\"_year_select_container _no_display\" id=\"_year_select_container\">";
    strVar += "";
    strVar += "    <\/div>";


    var openDiv = document.createElement("div");
    openDiv.innerHTML = strVar;
    document.body.appendChild(openDiv);
    var _year_select_container = document.getElementById('_year_select_container');
    var currentYear = new Date().getFullYear();
    var currentM = parseInt(currentYear / 10);
    var targetDom = null;
    var _callBack = function() {};

    //initLoadYear(currentM,currentYear);


    AddEvent(document.body,'click',function(){
        J(_year_select_container).addClass('_no_display');
    });


    _year_select_container.addEventListener('click', function(ev) {
        var target = ev.target;
        if (target.dataset.val) {
            clearActive();
            target.className = "active";
            J(targetDom).setValue(target.dataset.val);
            J(_year_select_container).addClass('_no_display');
            _callBack(target.dataset.val);
        }
        if (target.dataset.target == "_before") {
            currentM--;
            initLoadYear(currentM, currentYear);
        }
        if (target.dataset.target == "_next") {
            currentM++;
            initLoadYear(currentM, currentYear);
        }

        stopBubble(ev);
    }, false);

    function getSreen() {
        var height = 0;
        var width = 0;
        if (window.innerHeight) {
            height = window.innerHeight;
            width = window.innerWidth;
        } else if (document.body.clientHeight) {
            height = document.body.clientHeight;
            widdth = document.body.clientWidth;
        }
        return {
            width: width,
            height: height
        }
    }

    function clearActive() {
        if (J(_year_select_container).domFirst('.active'))
            J(_year_select_container).domFirst('.active').className = "select";
    }

    function initLoadYear(currentM, currentYear) {
        J(_year_select_container).removeClass('_no_display');
        var startYear = currentM * 10;
        var endYear = startYear + 9;
        var currentYear = currentYear || 'xx';
        var data = [];
        data.start = startYear;
        data.end = endYear;
        _year_select_container.innerHTML = year_t.createHtml(data);
        if (currentYear <= endYear && currentYear >= startYear) {
            J(_year_select_container).domFirst('*[data-val="' + currentYear + '"]').className = "active";
        }
    }

    /**
     * 设置日期控件的位置
     */
    function getPosition(ev) {
        var date_input = ev;
        var left = date_input.getBoundingClientRect().left;
        var top = date_input.getBoundingClientRect().top;
        var width = date_input.offsetWidth;
        var height = date_input.offsetHeight;
        var innerHeight = getSreen().height;
        var innerWidth = getSreen().width;
        _year_select_container.style.display = "block";
        //如果当前input的下面的距离小于日期控件的距离，就显示在input上面
        if (innerWidth - left < _year_select_container.offsetWidth) {
            _year_select_container.style.left = (left - _year_select_container.offsetWidth / 2) + "px";
        } else {
            _year_select_container.style.left = left + "px";
        }
        if ((innerHeight - top - height) < _year_select_container.offsetHeight) {
            // _year_select_container.style.left = left + "px";
            _year_select_container.style.top = (top - _year_select_container.offsetHeight - height) + "px";
        } else {
            // _year_select_container.style.left = left + "px";
            _year_select_container.style.top = (top + height) + "px";
        }
    }
    var fn = {
        layYear: function(dom) {
            currentYear = dom.value || new Date().getFullYear();
            targetDom = dom;
            currentM = parseInt(currentYear / 10);
            getPosition(dom);
            initLoadYear(currentM, currentYear);
            return fn;
        },
        then: function(callBack) {
            _callBack = callBack;
        },
        closeControl:function(){
            J(_year_select_container).addClass('_no_display');
        }
    }
    return fn;
}());


var MonthSelect = (function() {
    var strVar = "";
    strVar += "    <div class=\"_month_select_header\"><span class=\"_left\" data-target=\"_before\">上一页<\/span>{{=data.year}}<span class=\"_right\" data-target=\"_next\">下一页<\/span><\/div>";
    strVar += "    <div class=\"_month_select_wapper\">";
    strVar += "        <ul>";
    strVar += "            <li class=\"select\" data-val=\"01\">1月<\/li>";
    strVar += "            <li class=\"select\" data-val=\"02\">2月<\/li>";
    strVar += "            <li class=\"select\" data-val=\"03\">3月<\/li>";
    strVar += "            <li class=\"select\" data-val=\"04\">4月<\/li>";
    strVar += "        <\/ul>";
    strVar += "        <ul>";
    strVar += "            <li class=\"select\" data-val=\"05\">5月<\/li>";
    strVar += "            <li class=\"select\" data-val=\"06\">6月<\/li>";
    strVar += "            <li class=\"select\" data-val=\"07\">7月<\/li>";
    strVar += "            <li class=\"select\" data-val=\"08\">8月<\/li>";
    strVar += "        <\/ul>";
    strVar += "        <ul>";
    strVar += "            <li class=\"select\" data-val=\"09\">9月<\/li>";
    strVar += "            <li class=\"select\" data-val=\"10\">10月<\/li>";
    strVar += "            <li class=\"select\" data-val=\"11\">11月<\/li>";
    strVar += "            <li class=\"select\" data-val=\"12\">12月<\/li>";
    strVar += "        <\/ul>";
    strVar += "    <\/div>";


    var year_t = new Jtmpl(strVar);
    strVar = "";
    strVar += " <style>";
    strVar += "        ._month_select_container{";
    strVar += "            position: absolute;";
    strVar += "            font-size: 16px;";
    strVar += "            background: #FFF;";
    strVar += "            border-radius: 3px;";
    strVar += "            z-index: 22;";
    strVar += "            border: 1px solid #d4d4d4;box-shadow: 0 2px 10px rgba(0,0,0,.2);";
    strVar += "        }";
    strVar += "        ._month_select_header {";
    strVar += "            text-align: center;";
    strVar += "            font-weight: 900;";
    strVar += "            padding-top: 10px;";
    strVar += "            padding-bottom: 10px;";
    strVar += "        }";
    strVar += "        ._month_select_container ul{";
    strVar += "            display: flex;";
    strVar += "            width: 100%;";
    strVar += "        }";
    strVar += "";
    strVar += "";
    strVar += "        ._month_select_container li{";
    strVar += "            text-align: center;";
    strVar += "            padding: 20px 10px 20px 10px;";
    strVar += "            border-radius: 2px;";
    strVar += "        }";
    strVar += "";
    strVar += "";
    strVar += "        ._month_select_container li.active{";
    strVar += "            background: #1EAAF1;";
    strVar += "            color: #fff;";
    strVar += "        }";
    strVar += "        ._month_select_container li.no_select{";
    strVar += "            color: #7c7c7c;";
    strVar += "        }";
    strVar += "";
    strVar += "        ._month_select_container li.select{";
    strVar += "            cursor: pointer;";
    strVar += "        }";
    strVar += "        ._month_select_container li.select:hover{";
    strVar += "            background: rgb(240,240,240);";
    strVar += "        }";
    strVar += "        ._month_select_container  li.select:active{";
    strVar += "            background: #1EAAF1;";
    strVar += "            color: #fff;";
    strVar += "        }";
    strVar += "";
    strVar += "        ._month_select_container ._left,._right{";
    strVar += "            font-size: 12px;";
    strVar += "            line-height: 17px;";
    strVar += "            cursor: pointer;";
    strVar += "        }";
    strVar += "        ._month_select_container ._left{";
    strVar += "            float: left;";
    strVar += "            padding-left: 13px;";
    strVar += "        }";
    strVar += "        ._month_select_container ._right{";
    strVar += "            float: right;";
    strVar += "            padding-right: 13px;";
    strVar += "        }";
    strVar += "    <\/style>";
    strVar += "    <div class=\"_month_select_container _no_display\" id=\"_month_select_container\">";
    strVar += "";
    strVar += "    <\/div>";


    var openDiv = document.createElement("div");
    openDiv.innerHTML = strVar;
    document.body.appendChild(openDiv);
    var _month_select_container = document.getElementById('_month_select_container');
    var currentYear = new Date().getFullYear();
    var currentMonth = parseInt(currentYear / 10);
    var targetDom = null;
    var _callBack = function() {};

    //initLoadYear(currentM,currentYear);


    /**
     * 将该控件关闭
     */
    AddEvent(document.body,'click',function(){
        J(_month_select_container).addClass('_no_display');
    });


    _month_select_container.addEventListener('click', function(ev) {
        var target = ev.target;
        if (target.dataset.val) {
            clearActive();
            target.className = "active";
            J(targetDom).setValue(currentYear+"-"+target.dataset.val);
            J(_month_select_container).addClass('_no_display');
            _callBack(currentYear+"-"+target.dataset.val);
        }
        if (target.dataset.target == "_before") {
            currentYear--;
            initLoadYear(currentYear, currentMonth);
        }
        if (target.dataset.target == "_next") {
            currentYear++;
            initLoadYear(currentYear, currentMonth);
        }

        stopBubble(ev);
    }, false);

    function getSreen() {
        var height = 0;
        var width = 0;
        if (window.innerHeight) {
            height = window.innerHeight;
            width = window.innerWidth;
        } else if (document.body.clientHeight) {
            height = document.body.clientHeight;
            widdth = document.body.clientWidth;
        }
        return {
            width: width,
            height: height
        }
    }

    function clearActive() {
        if (J(_month_select_container).domFirst('.active'))
            J(_month_select_container).domFirst('.active').className = "select";
    }

    function initLoadYear(currentYear, currentMonth) {
        J(_month_select_container).removeClass('_no_display');
        var data = [];
        data.year = currentYear;
        _month_select_container.innerHTML = year_t.createHtml(data);
            J(_month_select_container).domFirst('*[data-val="' + currentMonth + '"]').className = "active";
    }

    /**
     * 设置日期控件的位置
     */
    function getPosition(ev) {
        var date_input = ev;
        var left = date_input.getBoundingClientRect().left;
        var top = date_input.getBoundingClientRect().top;
        var width = date_input.offsetWidth;
        var height = date_input.offsetHeight;
        var innerHeight = getSreen().height;
        var innerWidth = getSreen().width;
        _month_select_container.style.display = "block";
        //如果当前input的下面的距离小于日期控件的距离，就显示在input上面
        if (innerWidth - left < _month_select_container.offsetWidth) {
            _month_select_container.style.left = (left - _month_select_container.offsetWidth / 2) + "px";
        } else {
            _month_select_container.style.left = left + "px";
        }
        if ((innerHeight - top - height) < _month_select_container.offsetHeight) {
            // _month_select_container.style.left = left + "px";
            _month_select_container.style.top = (top - _month_select_container.offsetHeight - height) + "px";
        } else {
            // _month_select_container.style.left = left + "px";
            _month_select_container.style.top = (top + height) + "px";
        }
    }
    var fn = {
        layonth: function(dom) {
            targetDom = dom;
            var value = dom.value;
            if(dom.value){
                var arr = dom.value.split("-");
                currentYear = arr[0] || new Date().getFullYear();
                currentMonth = arr[1] || new Date().getMonth()+1;
            } else{
                currentYear = new Date().getFullYear();
                currentMonth = new Date().getMonth()+1;
            }

            getPosition(dom);
            initLoadYear(currentYear, currentMonth);
            return fn;
        },
        then: function(callBack) {
            _callBack = callBack;
        },
        closeControl:function(){
            J(_month_select_container).addClass('_no_display');
        }
    }
    return fn;
}());
