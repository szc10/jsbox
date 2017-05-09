APP.define({
    name: "child",  //当前的活动的名字
    init: function () {
          //  活动创建后初始化是调用的方法
        
    },
    activite: function () {
          // 活动激活时调用的方法
    },
    sleep: function () {
          // 活动休眠时调用的方法
    },
    destroy:function(){
          // 活动销毁时调用的方法
    },
    template: {      //模板队列的相关对象
        demo_template: {
            data: {
              //  模板的初始的数据源
            },
            method: {
              //   模板的方法
            }
        }
    }
});
