/**
 * Created by win10 on 2016/7/29.
 */
UIActivity['capital-account-create']= {
    activityName: "capital-account-create",
    init: function () {
        var activitypoint=this;
        //用此法0728尝试,输入空格时没能报错||account_name.indexOf(" ")>=0
        //我的业务--资金管理--点击新建账户的弹出框中的确认提交按钮的方法
        Action.click("create_capital_account_check",function () {
            var account_name=J('newAccountName').getValue();
            var bank_name=J('newAccountBank').getValue();
            if(!account_name){
                document.getElementById("create_capital_account_tip").innerHTML="账户名不能为空";
            }
            else if(!bank_name){
                document.getElementById("create_capital_account_tip").innerHTML="银行名不能为空";
            }
            else{
                document.getElementById("create_capital_account_tip").innerHTML='';

                //将输入数据传给后台
                var create_capital_postdata={
                    account_name: J("newAccountName").getValue(),
                    // account_balan:'0',  未传给接口中的这个参数以任何值，后台已改；不然会报错
                    bank_deposit:J("newAccountBank").getValue(),
                };
                xhrSend("Account_control/insert_acc_info",create_capital_postdata,function (data) {
              
        
                    //成功
                    console.log(data);
                    AlertDel.delayDisappear("提交成功！", function () {
                        activitypoint.close();
                    });
                },function () {
                    //处理中
                    AlertDel.display("提交中...");
                },function () {
                    //提交错误
                    AlertDel.delayDisappear("提交错误！");
                

                });
            }
        });
        //我的业务--资金管理--弹出框的关闭方法
        Action.click("create-capital-close",function () {
            activitypoint.close();
        });
    }
}