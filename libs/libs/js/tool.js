var Time = {
    /**
     * [时间戳转时间]
     * @param  {[type]} time [description]
     * @return {[type]}      [description]
     */
    timeTodate: function(time) {
        var date = new Date(time * 1000);
        return date.getFullYear() + "/" + parseInt(date.getMonth() + 1) + "/" + date.getDate();
    },
    /**
     * [时间转时间戳]
     * @param  {[type]} datestr [description]
     * @return {[type]}         [description]
     */
    dateTotime: function(datestr) {
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
    },
    getLocalTime: function(nS) {
        if (nS) {
            return (new Date(parseInt(nS) * 1000).toLocaleString("en-GB").replace(/:\d{1,2}$/, ' ')).split(' ')[1];
        } else {
            return "";
        }
    },
    getDaysInOneMonth: function(year, month) {
        month = parseInt(month, 10);
        var d = new Date(year, month, 0);
        return d.getDate();
    }
}


var amfn = {};
document.addEventListener("animationend", function(ev) {
    // alert("动画完成");
    console.log(ev.target);
    ev.target.style["-webkit-animation-name"] = null;
    J(ev.target).removeClass(ev.target.dataset.amfn);
    if (amfn[ev.target.dataset.amfn]) {
        amfn[ev.target.dataset.amfn].call(ev.target);
        delete amfn[ev.target.dataset.amfn];
    }
});

function amCtr(dom, con, fn) {

    J(dom).addClass(con);

    dom.dataset.amfn = con;

    dom.style["-webkit-animation-name"] = con;

    amfn[con] = fn;

}