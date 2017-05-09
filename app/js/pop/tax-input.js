 UIActivity['tax-input']= {
        activityName: "tax-input",
        init: function () {
        	var comData = null;
            activitypoint = this;
            /**
          *向服务器的接口发送请求，请求成功后会返回请求的数据
          */
            xhrSend("Select_all_info/get_info",{},function(data){
               activitypoint.setContext(data);
               comData = data;
               console.log(comData);
           });
           /**
	        *点击关闭的时候关闭销售单页面
	        */
	        Action.click("btn_close",function(){
	           activitypoint.close();
	        });
          
          /**
           * 当账户选择发生改变时，可用余额也随之发生改变
           */

          Action.change("account_select",function(){
             var value = this.value;
             var balance = document.getElementById("balance");
             for(var i in comData.account_list){
                if(comData.account_list[i].account_id == value){
                   balance.innerText = comData.account_list[i].account_balan + "元";
                }
             }
          });

           /**
          *点击完成提交数据
          */
          Action.click('btn_finish',function(){
              var postdata = {};
              var tax_input = document.getElementById("tax_input");
              var data = {};
              //业务说明中的数据
              data[0] = {};
              var input = tax_input.getElementsByTagName("input");
              data[0]['add_value_tax'] = input[0].value;
              data[0]['city_develop_tax'] = input[1].value;
              data[0]['educate_tax'] = input[2].value;
              data[0]['local_educate_tax'] = input[3].value;
              data[0]['business_tax'] = input[4].value;
              data[0]['indi_tax'] = input[5].value;
              data[0]['stamp_tax'] = input[6].value;
              data[0]['water_con_fund'] = input[7].value;
              data[0]['endowment_bus'] = input[8].value;
              data[0]['unemploy_bus'] = input[10].value;
              data[0]['medical_bas'] = input[9].value;
              data[0]['medical_out'] = input[11].value;
              data[0]['em_injury_insur'] = input[12].value;
              data[0]['maternity_insur'] = input[13].value;
              data[0]['public_amount_bus'] = input[14].value;
              data[0]['endowment_ind'] = input[15].value;
              data[0]['medical_ind'] = input[16].value;
              data[0]['unemploy_ind'] = input[17].value;
              data[0]['public_ind'] = input[18].value;
              //收款账户中的数据
              var account = document.getElementById("account");
              data[0]['account_id'] = account.value;
              postdata.contextData = JSON.stringify(data);
              console.log(postdata.contextData);

              xhrSend("Endmonth_tax_control/insert_taxt", postdata, function(data) {
              console.log(data);
              });
         });


      }
}