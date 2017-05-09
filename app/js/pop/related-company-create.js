/**
 * Created by win10 on 2016/7/30.
 */
UIActivity['related-company-create']= {
    activityName: "related-company-create",
    init: function () {
        var activitypoint=this;

        //我的业务--往来单位-点击新建往来关系的弹出框中的确认提交按钮的方法
        Action.click("create_related_company_check",function () {
            var comp_name=J('newCompanyName').getValue();
            var comp_type=J('newCompanyType').getValue();
            if(!comp_name){
                document.getElementById("create_related_company_tip").innerHTML="单位名称不能为空";
            }
            else if(!comp_type){
                document.getElementById("create_related_company_tip").innerHTML="单位类型不能为空";
            }
            else{
                document.getElementById("create_related_company_tip").innerHTML='';

                //将输入数据传给后台
                var create_comp_postdata={
                    out_name: J("newCompanyName").getValue(),
                    out_type:J("newCompanyType").getValue(),
                };
                // alert(J("newCompanyType").getValue());
                xhrSend("Out_link_control/insert_out_link_info",create_comp_postdata,function (data) {
                    alert('ok!');
                    activitypoint.close();
                });
            }
        });

        //我的业务--资金管理--弹出框的关闭方法
        Action.click("create-related-company-close",function () {
            activitypoint.close();
        });
    }
}