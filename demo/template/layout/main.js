APP.define({
    name: "main",
    type: JActivity,
    init: function () {

        var context_list = this.findDom("context");
        var template = this.loadTemplate("context_list", context_list);

        // var arr = {
        //     : "oatitle",
        //     b: "obitle",
        //     c: "octitle",
        //     d: "odtitle"
        // };


var arr = [1,2,3,4];


        template.start("str", arr);

        //
        this.addEvent("click","update",function(){
            template.destroy();
            var te = this.loadTemplate("up_context_list", context_list);
            te.start();
        });


    },
    activite: function () {

    },
    sleep: function () {

    },
    template: {
        up_context_list: {
            data: {
                str:{
                    a: "atitle",
                    b: "btitle",
                    c: "ctitle",
                    d: "dtitle"
                }
            },
            method: {
                changeText: function(str) {
                   return str+1;
                }
            }
        }
    }
});
