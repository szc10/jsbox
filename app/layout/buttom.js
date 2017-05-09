// APP.define({
//     name: "buttom",
//     type: JActivity,
//     init: function() {
//         var context = this.getContext();
//         var point = this;
//         this.tran = new Transition(context);
//         this.tran.set3dCoordinate({
//             x:J(context).getcss('width')
//         });
//
//         //关闭
//         Action.click('b_return',function(){
//             point.transfer.activite();
//
//             point.tran.getDisplay().set3dCoordinate({
//                 x:J(context).getcss('width')
//             }).then(function(){
//                 // point.transfer.sleep();
//
//                 point.destroy();
//             });
//
//
//         });
//
//     },
//     activite:function(){
//         var point = this;
//         var text = this.findDom('text');
//
//         //启动的时候
//
//         this.tran.getDisplay().set3dCoordinate({
//             x:"0"
//         }).then(function(){
//             point.transfer.sleep();
//             text.focus();
//         });
//
//     },
//     sleep:function(){
//
//     }
// });


APP.define({
    name: "buttom",
    type: JActivity,
    init: function() {
        var context = this.getContext();
        var point = this;
        this.tran = new Transition(context);
        this.tran.set3dCoordinate({
            y:J(context).getcss('height')
        });

        //关闭
        Action.click('b_return',function(){
            point.transfer.activite();

            point.tran.getDisplay().set3dCoordinate({
                y:J(context).getcss('height')
            }).then(function(){
                // point.transfer.sleep();

                point.destroy();
            });


        });

    },
    activite:function(){
        var point = this;
        var text = this.findDom('text');

        //启动的时候

        this.tran.getDisplay().set3dCoordinate({
            y:"0"
        }).then(function(){
            point.transfer.sleep();
            text.focus();
        });

    },
    sleep:function(){

    }
});
