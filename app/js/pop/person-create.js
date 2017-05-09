/**
 * Created by win10 on 2016/7/29.
 */
UIActivity['person-create']= {
    activityName: "person-create",
    init: function () {
        var activitypoint=this;
        
        xhrSend("Department_control/select_depart_info",{},function(data){
            activitypoint.setContext(data.depart_list);
        });  //从后台拉取部门信息使之展示在“所在部门”下拉框


        //我的业务--部门人员-点击新建部门的弹出框中的确认提交按钮的方法
        Action.click("create_person_check",function () {
            var person_name=J('newPersonName').getValue();
            var person_depart=J('personDepartType').getValue();
            var person_state=J('personState').getValue();
            if(!person_name){
                document.getElementById("create_person_tip").innerHTML="人员姓名不能为空";
            }
            else if(!person_depart){
                document.getElementById("create_person_tip").innerHTML="所在部门不能为空";
            }
            else if(!person_state){
                document.getElementById("create_person_tip").innerHTML="账号状态不能不空";
            }
            else{
                document.getElementById("create_person_tip").innerHTML='';
                //将输入数据传给后台
                var create_person_postdata={
                    name: J("newPersonName").getValue(),
                    depart_id:J("personDepartType").getValue(),
                    user_type:J("personState").getValue(),

                    user_name:J("personInitId").getValue(),
                    passwd :J("personInitPass").getValue(),
                };
                xhrSend("Staff_control/insert_staff_info",create_person_postdata,function (data) {
                    alert('ok!');
                    activitypoint.close();

                });
            }
        });
        //我的业务--资金管理--弹出框的关闭方法
        Action.click("create-person-close",function () {
            activitypoint.close();
        });

        //选择“账号类型” 对初始账号和初始密码的影响
        Action.change("create-select-option",function(){
           // isReadonly();

            var person_state=J("personState").getValue();
            if(person_state!='0') {
                J("personInitId").setValue("NjGi003");
                document.getElementById("personInitPass").removeAttribute("readonly");
                document.getElementById("initIdSpan").style.color = "black";
                document.getElementById("initPassSpan").style.color = "black";
            }
            else{
                J("personInitPass").setValue("");
                J("personInitId").setValue("");
                document.getElementById("personInitId").setAttribute("placeholder",'选择账号状态自动生成');
                document.getElementById("personInitPass").setAttribute("placeholder",'默认密码为123456');
                document.getElementById("personInitPass").setAttribute("readOnly",'true');
            }
        });
    }
}


