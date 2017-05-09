APP.define({
    name: "right",
    type: JActivity,
    init: function() {
    var context = this.getContext();
        var point = this;
        this.tran = new Transition(context);
        this.tran.set3dCoordinate({
            x:J(context).getcss('width')
        });

        //关闭
        Action.click('r_return',function(){
            point.transfer.activite();

            point.tran.getDisplay().set3dCoordinate({
                x:J(context).getcss('width')
            }).then(function(){

                point.destroy();
            });
        });
    },
    activite:function(){
        var point = this;
      //启动的时候
        this.tran.getDisplay().set3dCoordinate({
            x:"0"
        }).then(function(){
             point.transfer.sleep();
        });

    },
    sleep:function(){

    }
});
