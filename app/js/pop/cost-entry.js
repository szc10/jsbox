 UIActivity['cost-entry']= {
        activityName: "cost-entry",
        init: function () {
           activitypoint = this;

           /**
           *向服务器的接口发送请求，请求成功后会返回请求的数据
           */
          
            activitypoint.setContext({});
            /**
	        *点击关闭的时候关闭销售单页面
	        */
	        Action.click("btn_close",function(){
	           activitypoint.close();
	        });

	        /**
          *获取每条成本金额，计算成本总额
          * */
	        Action.change("cost",function(){
               var value = this.value;
               var className = this.className;
               var cost_entry_list = document.getElementById("cost_entry_list");
               var cost_total = document.getElementById("cost_total");
               var input = cost_entry_list.getElementsByTagName("input");
               var arr = [];
               var sum = 0;
               /**
                * 获取除当前成本金额以外的所有成本金额，并存入arr数组
                */

               for(var i = 0; i < input.length; i++){
                   if(input[i].dataset.type == "inf_4" && input[i].className != className){
                   	  arr.push(input[i]);
                   }
               }

               for(var j = 0; j < arr.length; j++) {
                   sum += Number(arr[j].value);
               }

               sum += Number(value);
               cost_total.innerText = "￥" + sum;
	        });
      }
 }