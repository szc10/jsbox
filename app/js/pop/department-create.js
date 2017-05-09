/**
 * Created by win10 on 2016/7/29.
 */
UIActivity['department-create']= {
    activityName: "department-create",
    init: function () {
        var activitypoint=this;

        //我的业务--部门人员-点击新建部门的弹出框中的确认提交按钮的方法
        Action.click("create_depart_check",function () {
            var depart_name=J('newDepartName').getValue();
            var depart_type=J('newDepartType').getValue();
            if(!depart_name){
                document.getElementById("create_depart_tip").innerHTML="部门名称不能为空";
            }
            else if(!depart_type){
                document.getElementById("create_depart_tip").innerHTML="部门类型不能为空";
            }
            else{
                document.getElementById("create_depart_tip").innerHTML='';

                //将输入数据传给后台
                var create_depart_postdata={
                    depart_name: J("newDepartName").getValue(),
                    depart_type:J("newDepartType").getValue(),
                };
                xhrSend("Department_control/insert_depart_info",create_depart_postdata,function (data) {
                    alert('ok!');
                    activitypoint.close();

                });
            }
        });


        //我的业务--资金管理--弹出框的关闭方法
        Action.click("create-department-close",function () {
            activitypoint.close();
        });
    }
}
