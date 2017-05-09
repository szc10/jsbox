APP.define({
    name: "main",
    type: JActivity,
    init: function() {
        var point = this;
        var mask = this.findDom('mask');
        var slide = this.findDom('slide');

        var slideTran = new Transition(slide);
        // slideTran.setTimefunction("ease-in");
        var maskTran = new Transition(mask);
        var speed = .25;

        slideTran.setDuration(speed);
        maskTran.setDuration(speed);

        Action.click('ok',function(){
            maskTran.setOpacity(0).getDisplay().setOpacity(1);
            slideTran.set3dCoordinate({
                x:"-"+J(slide).getcss('width')
            }).getDisplay().set3dCoordinate({
                x:0
            }).then(function(){

                Action.click('close-slide',function(){
                   maskTran.setOpacity(0);
                    slideTran.set3dCoordinate({
                        x:"-"+J(slide).getcss('width')
                    }).then(function(){
                        J(mask).setcss('display','none');
                        J(slide).setcss('display','none');
                    });
                });


            });

        });

        Action.click('close-slide',function(){});

        /**
         * 从右侧弹出相关的应用
         */

        Action.click('right-from',function(){
            var ok= point.loadActivity('right','right').init();
                ok.activite();
        });

        Action.click('buttom-from',function(){
            point.loadActivity('buttom','buttom').init().activite();
        });

    },
    activite:function(){

    },
    sleep:function(){
        console.log("sleep");
    }
});
