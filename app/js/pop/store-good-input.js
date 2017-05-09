 UIActivity['store-good-input']= {
        activityName: "store-good-input",
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
           
        	//获取每一个li中的所有元素
        	function getAllElement(id) {
        		var store_good_item = document.getElementById(id);
        		var input = store_good_item.getElementsByTagName('input');
        		var select = store_good_item.getElementsByTagName('select');
        		var span = store_good_item.getElementsByTagName("span");
        		// var div = store_good_item.getElementsByTagName("div");
        		return {
        			procurement: input[0].value,
        			rate_select: select[0].value,
        			sale_pay: input[1].value,
        			taxs_pay: input[2],
        			taxs_in_pay: span[3]
        			// btn_delete: div[2]
        		}
        	}
            
            //当发票类型发生改变时，应交税金的状态也随之发生改变
        	Action.change("rate_select",function() {
        		var index = this.className.split("_")[1];
                var current_store_good = getAllElement("store_good_item_" + index);
                if(current_store_good.rate_select == "noTax") {
                	current_store_good.taxs_pay.setAttribute('readonly',"true");
                	J(current_store_good.taxs_in_pay).setcss("color","#ccc");
                }else{
                	current_store_good.taxs_pay.removeAttribute('readonly');
                	J(current_store_good.taxs_in_pay).setcss("color","#000");
                }
                current_store_good.taxs_pay.value = "";
        	});

        	Action.click("taxs_pay",function() {
        		//此处变量和计算税金总额有关
	            var currentName = this.className;
	            var taxs_total = document.getElementById("taxs_total");
	            taxs_total.innerText = '';
	            var store_good_list = document.getElementById("store_good_list");
	            var sum = 0;
	            var amount_total_input = store_good_list.getElementsByTagName('input');

                var index = this.className.split(" ")[1];
                var current_store_good = getAllElement("store_good_item_" + index);
                console.log(current_store_good);
                if(current_store_good.procurement == "" || current_store_good.rate_select == "" || current_store_good.sale_pay == "" ||current_store_good.rate_select == "noTax") {
                	current_store_good.taxs_pay.setAttribute('readonly',"true");
                	J(current_store_good.taxs_in_pay).setcss("color","#ccc");
                	current_store_good.taxs_pay.value = "";
                }else{
                	current_store_good.taxs_pay.removeAttribute('readonly');
                	J(current_store_good.taxs_in_pay).setcss("color","#000");
                	var rate = current_store_good.rate_select.split("_")[1];
                	var sale_pay_amount = Number(current_store_good.sale_pay);
                	current_store_good.taxs_pay.value = ((sale_pay_amount / (1 + (rate / 100))) * (rate / 100)).toFixed(2);
                }

                 /**
                *当税金的数值发生改变时，税金总计也随之改变
                */
	              var currentVal = this.value;
	              sum = computeTotal(amount_total_input,"inf_3",currentName) + Number(currentVal);
	              taxs_total.innerText = "￥" + sum.toFixed(2);
        	});
             
            var idIndex = 3;
        	Action.click("add_sale_item",function() {
        		var store_good_list = document.getElementById("store_good_list");
        		var add_item  = J("store_item").getHtml();
                var data = [];
                data.id=idIndex;

               //创建一个模板，并将数据传入
                var test=objectManager.create(Jtmpl,add_item).createHtml(data);

                var li = document.createElement("li");
                li.id = "store_good_item_" + data.id;

                //将新增的条目直接添加到列表中
                store_good_list.appendChild(li);
                //填充条目内容
                li.innerHTML = test;
                idIndex += 1;
        	});
              
             //点击关闭按钮时，从中移除一条录入单
        	Action.click("btn_delete",function() {
                var index = this.className.split(' ')[1];
                var current_store_good = getAllElement("store_good_item_" + index);
                console.log(current_store_good);
                var store_good = document.getElementById("store_good_item_" + index);
                var store_good_list = document.getElementById("store_good_list");
                store_good_list.removeChild(store_good);
                var procurement_total = document.getElementById("procurement_total");
                var taxs_total = document.getElementById("taxs_total");
                procurement_total.innerText = "￥" + (Number(procurement_total.innerText.split('￥')[1]) - Number(current_store_good.sale_pay)).toFixed(2);
                taxs_total.innerText = "￥" + (Number(taxs_total.innerText.split('￥')[1]) - Number(current_store_good.taxs_pay.value)).toFixed(2);

                console.log(procurement_total.innerText);
                if(Number(procurement_total.innerText.split('￥')[1]) <= 0) {
                  procurement_total.innerText = "￥" + 0;
                }
                if(Number(taxs_total.innerText.split('￥')[1]) <= 0) {
                  taxs_total.innerText = "￥" + 0;
                }
        	});
            

            //当销售金额发生改变时总得销售金额也发生改变
        	Action.change("sale_pay",function(){
                var procurement_total = document.getElementById("procurement_total");
                var currentName = this.className;
	            var currentVal = this.value;
	            procurement_total.innerText = '';
	            var store_good_list = document.getElementById("store_good_list");
	            var sum = 0;
	            var amount_total_input = store_good_list.getElementsByTagName('input');
	            sum = computeTotal(amount_total_input,"inf_2",currentName) + Number(currentVal);
	            procurement_total.innerText = "￥" + sum;
        	});
            
        	 /**
	        *用来计算当销售金额或者税金发生变化时，其余未发生变化的销售金额或者税金的值
	        */
	        function computeTotal(inputArr,dataType,currentClassName) {
	          var arr = [];
	          var sum = 0;
	          for(var i = 0; i < inputArr.length; i++) {
	            if(inputArr[i].dataset.type == dataType && inputArr[i].className != currentClassName) {
	                arr.push(inputArr[i]);
	            }
	          }
	          console.log(arr);
	          for(var j = 0; j < arr.length; j++) {
	                sum += Number(arr[j].value);
	          }
	          return sum;
	        }

             /**
	        *当选择客户的下拉列表的值发生改变时，前期余额也想应的发生改变
	        */
	         Action.change("supplier_select",function(){
	             var selectVal = this.value;
	             var loan = document.getElementById('loan');
	             for(var j in comData.out_link_list) {
	               if(comData.out_link_list[j].out_link_id == selectVal) {
	                  loan.innerText = "还欠该供应商" + comData.out_link_list[j].loan_amount + "元";
	               }
	             }
	        });

		    /**
	         *当开关的状态发生改变时，下面的文本哭框和下拉列表都没无法操作
	         */

	        Action.click("switch",function(){
	            J(this).toggleClass("switchOn");
	            var length = this.className.split(" ").length;
	            var className = this.className.split(" ")[length - 1];
	            var pay_amount = document.getElementById("pay_amount");
	            var pay_amount_output = document.getElementById("pay_amount_output");
	            if(className == "") {
	               J(pay_amount).setcss("color","#ccc");
	               pay_amount_output.setAttribute("readonly","true");
	            }else{
	              J(pay_amount).setcss("color","#000");
	              pay_amount_output.removeAttribute("readonly");
	            }
	        });
            
            /**
          *当选择账户的下拉列表的值发生改变时，可用余额也同时发生改变
          */

	       Action.change('account_select',function(){
	              var selectVal = this.value;
	              var available_balance = document.getElementById("available_balance");
	              for(var i in comData.account_list) {
	                  if(comData.account_list[i].account_id == selectVal) {
	                     available_balance.innerText = comData.account_list[i].account_balan;

	                  }
	              }
	        });
	        /**
	        *点击关闭的时候关闭销售单页面
	        */
	        Action.click("btn_close",function(){
	           activitypoint.close();
	        });

	        /**
	        *点击完成提交数据
	        */
	        Action.click('btn_finish',function(){
		           var postdata={};
		           var li = document.getElementById("store_good_list").getElementsByTagName('li');
		           var collection = document.getElementById("collection");
		           var data = {};
		          for(var i = 0; i < li.length; i++) {
		             //业务说明中的数据
		             data[i] = {};
		             var input = li[i].getElementsByTagName("input");
		             var select = li[i].getElementsByTagName("select");
		             data[i]['inf'] = input[0].value;
		             data[i]['storepur_price'] = input[1].value;
		             data[i]['tax_type'] = select[0].value;
		             data[i]['taxation'] = input[2].value;
		          }
		          //  //收款账户中的数据
		          var cl_input = collection.getElementsByTagName('input');
		          var cl_select = collection.getElementsByTagName("select");
		          var cl_span = collection.getElementsByTagName('span');
		          var is_cash = document.getElementById("is_cash");
		          var length = is_cash.className.split(" ").length;

		          postdata.contextData = JSON.stringify(data);
		          postdata.su_id = cl_select[0].value;
		          if(is_cash.className.split(" ")[length - 1] == "switchOn") {
		            postdata.is_cash = 1;
		          }else{
		            postdata.is_cash = 0;
		          }
		          postdata.pay_amount = cl_input[0].value;
		          var predict_pay = cl_input[1].value.split("-");
		          var datums  = new Date(Date.UTC(predict_pay[0], predict_pay[1] - 1, predict_pay[2]));  
		          var nowtime = datums.getTime(); 
		          postdata.predict_pay = nowtime;
		          postdata.account_id = cl_select[1].value;
		          console.log(postdata);

		          xhrSend("Storepurchase_control/boss_insert_storepur",postdata,function(data){
		              console.log(data);
		          });
       		});
        }

}