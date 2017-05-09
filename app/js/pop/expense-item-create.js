/**
 * Created by win10 on 2016/7/30.
 */
UIActivity['expense-item-create']= {
    activityName: "expense-item-create",
    init: function () {
        var activitypoint=this;
        //我的业务--费用项目--点击新建的弹出框中的确认提交按钮的方法
        Action.click("create_expense_item_check",function () {
            var exp_name=J('newExpenseName').getValue();
            var exp_info=J('newExpenseInf').getValue();
            if(!exp_name){
                document.getElementById("create_expense_item_tip").innerHTML="费用项目不能为空";
            }
            // else if(!exp_info){
            //     document.getElementById("create_expense_item_tip").innerHTML="费用项目不能为空";
            // }
            else{
                document.getElementById("create_expense_item_tip").innerHTML='';

                //将输入数据传给后台
                var create_exp_postdata={
                    item_name: J("newExpenseName").getValue(),
                    cost_info:J("newExpenseInf").getValue(),
                };
                xhrSend("Cost_control/insert_cost_info",create_exp_postdata,function (data) {
                    alert('ok!');
                    activitypoint.close();

                });
            }
        });
        //我的业务--资金管理--弹出框的关闭方法
        Action.click("create-expense-item-close",function () {
            activitypoint.close();
        });
    }
}