/**
 * Created by win10 on 2016/7/30.
 */
UIActivity['depart-person-update']= {
    activityName: "depart-person-update",
    init: function (id) {
        var activitypoint=this;

        
        xhrSend("Staff_control/select_staff_info",id,function(data){
            activitypoint.setContext(data.staff_list);
        });  //从后台拉取部门信息,用以修改弹出框


        //我的业务--部门人员-点击修改的弹出框中的确认提交按钮的方法
        Action.click("update_depart_person_check",function () {
            var person_name=J('updatePersonName').getValue();
            var person_depart=J('updatePersonDepartType').getValue();
            var id_state=J('updateIdState').getValue();
            var person_state=J('updatePersonState').getValue();
            if(!person_name){
                document.getElementById("update_depart_person_tip").innerHTML="人员姓名不能为空";
            }
            else if(!person_depart){
                document.getElementById("update_depart_person_tip").innerHTML="所在部门不能为空";
            }
            else if(!person_state){
                document.getElementById("update_depart_person_tip").innerHTML="人员状态不能不空";
            }
            else if(!id_state){
                document.getElementById("update_depart_person_tip").innerHTML="账号状态不能为空";
            }
            else{
                document.getElementById("update_depart_person_tip").innerHTML='';
                //将输入数据传给后台
                var update_depart_person_postdata={
                    name: J("updatePersonName").getValue(),
                    depart_id:J("updatePersonDepartType").getValue(),
                    user_type:J("updateIdState").getValue(),
                    linshi:J("updatePersonState").getValue(),  //未改
                    user_name:J("updatePersonInitId").getValue(),
                    passwd :J("updatePersonInitPass").getValue(),
                };
                xhrSend("Staff_control/update_staff_info",update_depart_person_postdata,function (data) {
                    alert('ok!');
                    activitypoint.close();
                });
            }
        });
        //我的业务--资金管理--弹出框的关闭方法
        Action.click("update-depart-person-close",function () {
            activitypoint.close();
        });
    }
}





