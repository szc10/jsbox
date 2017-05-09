/**
 * Created by win10 on 2016/8/5.
 */
Action.click('notice_icon',function(){

    var olink=document.getElementById("notice_icon");
    var odiv=document.getElementById("notice_show");

    // /*通过js获取icon图标的位置来确定弹出框的位置*/
    // // 有问题:当窗口大小变化但不刷新页面时消息框的位置不会随之改变，改用相对于icon定位，用z-index解决被覆盖问题*/
    // var left_distance=olink.getBoundingClientRect().left;
    // var top_distance=olink.getBoundingClientRect().top;
    // odiv.style.position='absolute';
    // odiv.style.left=Number(left_distance)-164+'px'; //注意：此处用parseInt()时在fireifox  ie上显示有问题，要加上单位px
    // // alert("left:"+left_distance+"top:"+top_distance);

    var mainActivity = objectManager.create(PopActivity, UIActivity['notice']);
    mainActivity.init();
    mainActivity.activite();
});


UIActivity['notice']= {
    activityName: "notice",
    init: function () {

        var UIthis=this;
        Action.click("notice_switch",function () {
            var target=this.dataset.target;
            J('notice1').toggleClass('active');
            J('notice2').toggleClass('active');
            if(target=="system"){
                J('system_notice').setcss('display',"block");
                J('person_notice').setcss('display','none');
            } else if(target=="person"){
                J('system_notice').setcss('display','none');
                J('person_notice').setcss('display','block');
            }
        });

        Action.click("notice-sleep",function(){
            UIthis.close();
        });

        Action.click("reverse_index",function(){
            // alert(this.dataset.reverse);
            var reverse=this.dataset.reverse;

            if(reverse.match("sell")){
                  var mainActivity = objectManager.create(PopActivity, UIActivity['sell-ticket-check']);
                  mainActivity.init(reverse);
                  mainActivity.activite();
            }

             if(reverse.match("storepur")){
                  var mainActivity = objectManager.create(PopActivity, UIActivity['store-good-check']);
                  mainActivity.init(reverse);
                  mainActivity.activite();
            }

            if(reverse.match("expense")){
                  var mainActivity = objectManager.create(PopActivity, UIActivity['cost-check']);
                  mainActivity.init(reverse);
                  mainActivity.activite();
            }

            if(reverse.match("assetpur")){
                  var mainActivity = objectManager.create(PopActivity, UIActivity['asset-purchase-check']);
                  mainActivity.init(reverse);
                  mainActivity.activite();
            }

            UIthis.close();  //关闭相关的弹窗栏
        });
        
    },
    activite:function(){
        var UIthis=this;
        xhrSend("Inf_list_control/select_inf",{},function(data){
            UIthis.setContext(data.inf_list);
        });
    }
}

// 将时间戳转换为年月日
function getYMD(timeStamp) {
    var t=new Date(parseInt(timeStamp)*1000);
    var year=t.getFullYear();
    var mon=t.getMonth()+1;
    var day=t.getDay();
    // var month=mon<10?'0'+mon:mon;
    return [year,mon,day].join('-');
    
}


