 UIActivity['payroll-input'] = {
     activityName: "payroll-input",
     init: function() {
         var comData = null;
         activitypoint = this;

         /**
          *向服务器的接口发送请求，请求成功后会返回请求的数据
          */
         xhrSend("Select_all_info/get_info", {}, function(data) {
             activitypoint.setContext(data);
             console.log(data);
             comData = data;
         });


         /**
          *点击关闭的时候关闭销售单页面
          */
         Action.click("btn_close", function() {
             activitypoint.close();
         });

         /**点击计算实发工资
         *如果前几个文本框或者下拉列表的值有为空的则使实发工资的文本框处于无法编辑状态
         *否则获取前几个文本框内id数据并将其数据相加赋值给实发工资
         *同时将该实发工资和其他列表的实发工资相加计入总的实发工资
         * */
         Action.click('payroll_pay', function() {
             var className = this.className;
             var index = this.className.split(" ")[1];
             var payroll_list_item = document.getElementById("payroll_list_item_" + index);
             var payroll_in_act = document.getElementById('payroll_in_act_' + index);
             var input = payroll_list_item.getElementsByTagName('input');
             var select = payroll_list_item.getElementsByTagName("select");
             console.log(select[0].value);
             if (input[0].value == "" || input[1].value == "" || input[2].value == "" || input[3].value == "" || select[0].value == '') {
                 J(payroll_in_act).setcss("color", "#ccc");
             } else {
                 J(payroll_in_act).setcss("color", "#000");
             }
             this.value = Number(input[0].value) + Number(input[1].value) + Number(input[2].value) + Number(input[3].value);
             var value = Number(this.value);
             var payroll_list = document.getElementById("payroll_list").getElementsByTagName('input');
             var payroll_act = document.getElementById("payroll_act");
             payroll_act.value = "";
             var arr = [];
             var sum = 0;

             /**
              * [获取不是当前实发工资的其余所有实发工资存入arr数组]
              * @param  {[type]} 
              * @return {[type]}   
              */
             for (var i = 0; i < payroll_list.length; i++) {
                 if (payroll_list[i].dataset.type == "inf_5" && payroll_list[i].className != className) {
                     arr.push(payroll_list[i]);
                 }
             }

             /**
              * [计算arr数组中所有实发工资的值的和]
              * @param  {[type]} 
              * @return {[type]}    
              */
             for (var j = 0; j < arr.length; j++) {
                 sum += Number(arr[j].value);
             }
             payroll_act.value = value + sum;

         });
        
         /**
         * 计算所有应付工资的和
         */

         Action.change("payrolls_pay", function() {
             var className = this.className;
             var value = Number(this.value);
             var payroll_list = document.getElementById("payroll_list").getElementsByTagName('input');
             var payroll_total = document.getElementById("payroll_total");
             payroll_total.value = "";
             var arr = [];
             var sum = 0;
             for (var i = 0; i < payroll_list.length; i++) {
                 if (payroll_list[i].dataset.type == "inf_1" && payroll_list[i].className != className) {
                     arr.push(payroll_list[i]);
                 }
             }
             for (var j = 0; j < arr.length; j++) {
                 sum += Number(arr[j].value);
             }
             payroll_total.value = value + sum;
         });
         

         /**
          * 计算所有社保的和
          */

         Action.change("social_pay", function() {
             var className = this.className;
             var value = Number(this.value);
             var payroll_list = document.getElementById("payroll_list").getElementsByTagName('input');
             var social_total = document.getElementById("social_total");
             social_total.value = "";
             var arr = [];
             var sum = 0;
             for (var i = 0; i < payroll_list.length; i++) {
                 if (payroll_list[i].dataset.type == "inf_2" && payroll_list[i].className != className) {
                     arr.push(payroll_list[i]);
                 }
             }
             for (var j = 0; j < arr.length; j++) {
                 sum += Number(arr[j].value);
             }
             social_total.value = value + sum;
         });
         

         /**
          * 计算所有公积金到底和
          */

         Action.change("public_pay", function() {
             var className = this.className;
             var value = Number(this.value);
             var payroll_list = document.getElementById("payroll_list").getElementsByTagName('input');
             var public_total = document.getElementById("public_total");
             public_total.value = "";
             var arr = [];
             var sum = 0;
             for (var i = 0; i < payroll_list.length; i++) {
                 if (payroll_list[i].dataset.type == "inf_3" && payroll_list[i].className != className) {
                     arr.push(payroll_list[i]);
                 }
             }
             for (var j = 0; j < arr.length; j++) {
                 sum += Number(arr[j].value);
             }
             public_total.value = value + sum;
         });
         
        /**
         * 计算所有所得税的和
         */

         Action.change("rate_pay", function() {
             var className = this.className;
             var value = Number(this.value);
             var payroll_list = document.getElementById("payroll_list").getElementsByTagName('input');
             var rate_total = document.getElementById("rate_total");
             rate_total.value = "";
             var arr = [];
             var sum = 0;
             for (var i = 0; i < payroll_list.length; i++) {
                 if (payroll_list[i].dataset.type == "inf_4" && payroll_list[i].className != className) {
                     arr.push(payroll_list[i]);
                 }
             }
             for (var j = 0; j < arr.length; j++) {
                 sum += Number(arr[j].value);
             }
             rate_total.value = value + sum;
         });
         
        /**
         * 添加新的工资说明
         */

         var idIndex = 3;
         Action.click("add_sale_item", function() {
             var payroll_list = document.getElementById('payroll_list');
             var add_item = J("payroll_item").getHtml();
             var data = [];
             data.id = idIndex;

             //创建一个模板，并将数据传入
             var test = objectManager.create(Jtmpl, add_item).createHtml(data);

             var li = document.createElement("li");
             li.id = "payroll_list_item_" + data.id;

             //将新增的条目直接添加到列表中
             payroll_list.appendChild(li);
             //填充条目内容
             li.innerHTML = test;
             idIndex += 1;
         });



         /**
          *点击业务说明中的delete按钮就将这条工资说明从工资说明列表中删除
          *同时获取这条要删除的goon工资说明的所有数据，在总的工资中减去相应的数据
          */
         Action.click('btn_delete', function() {
             var index = this.className.split(' ')[1];
             var payroll_list_item = document.getElementById("payroll_list_item_" + index);
             var payrolls_pay = Number(payroll_list_item.getElementsByTagName('input')[0].value);
             var social_pay = Number(payroll_list_item.getElementsByTagName('input')[1].value);
             var public_pay = Number(payroll_list_item.getElementsByTagName('input')[2].value);
             var rate_pay = Number(payroll_list_item.getElementsByTagName('input')[3].value);
             var payroll_pay = Number(payroll_list_item.getElementsByTagName('input')[4].value);
             console.log(payrolls_pay, social_pay, public_pay, rate_pay, payroll_pay);

             var payroll_list = document.getElementById('payroll_list');
             payroll_list.removeChild(payroll_list_item);

             var payroll_total = document.getElementById("payroll_total");
             var social_total = document.getElementById("social_total");
             var public_total = document.getElementById("public_total");
             var rate_total = document.getElementById("rate_total");
             var payroll_act = document.getElementById("payroll_act");

             payroll_total.value = (Number(payroll_total.value) - payrolls_pay);
             social_total.value = (Number(social_total.value) - social_pay);
             public_total.value = (Number(public_total.value) - public_pay);
             rate_total.value = (Number(rate_total.value) - rate_pay);
             payroll_act.value = (Number(payroll_act.value) - payroll_pay);
             if (Number(payroll_total.value) <= 0) {
                 payroll_total.value = 0;
             }
             if (Number(social_total.value) <= 0) {
                 social_total.value = 0;
             }
             if (Number(public_total.value) <= 0) {
                 public_total.value = 0;
             }
             if (Number(rate_total.value) <= 0) {
                 rate_total.value = 0;
             }
             if (Number(payroll_act.value) <= 0) {
                 payroll_act.value = 0;
             }
         });

         /**
          * 当选中的账户发生改变时，可用余额相应发生改变
          */

         Action.change("account_select", function() {
             var currentVal = this.value;
             var balance = document.getElementById("balance");
             balance.innerText = "";
             for (var i in comData.account_list) {
                 if (comData.account_list[i].account_id == currentVal) {
                     balance.innerText = comData.account_list[i].account_balan + "元";
                 }
             }
         });

         /**
          **点击完成提交数据
          */
         Action.click("btn_finish", function() {
             var postdata = {};
             var li = document.getElementById("payroll_list").getElementsByTagName("li");
             var collection = document.getElementById("collection");
             var data = {};
             for (var i = 0; i < li.length; i++) {
                 //业务说明中的数据
                 data[i] = {};
                 var input = li[i].getElementsByTagName("input");
                 var select = li[i].getElementsByTagName("select");
                 data[i]['depart_id'] = select[0].value;
                 data[i]['total_salary'] = input[0].value;
                 data[i]['social_security'] = input[1].value;
                 data[i]['public_amount'] = input[2].value;
                 data[i]['indi_tax'] = input[3].value;
                 data[i]['final_salary'] = input[4].value;
             }
             //收款账户中的数据
             var cl_input = collection.getElementsByTagName("input");
             var cl_select = collection.getElementsByTagName("select");

             postdata.contextData = JSON.stringify(data);
             postdata.account_id = cl_select[0].value;
             postdata.actual_pay = cl_input[0].value;
             console.log(postdata);

             xhrSend("Salary_control/insert_salary", postdata, function(data) {
                 console.log(data);
             });

         });

     }

 }
