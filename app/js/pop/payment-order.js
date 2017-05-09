 UIActivity['payment-order'] = {
     activityName: "payment-order",
     init: function() {
         var comData = null;
         activitypoint = this;
         /**
          *向服务器的接口发送请求，请求成功后会返回请求的数据
          */
         xhrSend("Select_all_info/get_info", {}, function(data) {
             activitypoint.setContext(data);
             comData = data;
             console.log(comData);
         });

         /**
          *点击关闭的时候关闭销售单页面
          */
         Action.click("btn_close", function() {
             activitypoint.close();
         });


         //添加新的条目
         var idIndex = 3;
         Action.click('add_sale_item', function() {
             var payment_list = document.getElementById('payment_list');
             var add_item = J("payment_item").getHtml();
             var data = [];
             data.id = idIndex;

             //创建一个模板，并将数据传入
             var test = objectManager.create(Jtmpl, add_item).createHtml(data);

             var li = document.createElement("li");
             li.id = "payment_list_item_" + data.id;

             //将新增的条目直接添加到列表中
             payment_list.appendChild(li);
             //填充条目内容
             li.innerHTML = test;
             idIndex += 1;
         });

         //当有内容没填写的时候，弹出警告框
         Action.click("btn_finish", function() {
             var payment_list = document.getElementById("payment_list");
             var input = payment_list.getElementsByTagName('input');
             var select = payment_list.getElementsByTagName("select");
             var arr = []; //用于存放所有值为空到底元素

             //遍历所有的元素，将值为空的元素放在数组中，通过判断数组的长度来显示是否弹出警告框
             for (var i = 0; i < input.length; i++) {
                 if (input[i].value == "") {
                     arr.push(input[i]);
                 }
             }

             for (var j = 0; j < select.length; j++) {

                 if (select[j].value == "") {
                     arr.push(select[j]);
                 }
             }

             if (arr.length > 0) alertInf("所有的内容必须填写");
         });



         //删除每条记录
         Action.click("btn_delete", function() {
             var index = this.className.split(" ")[1];
             var payment_list_item = document.getElementById("payment_list_item_" + index);
             var payment_list = document.getElementById("payment_list");
             payment_list.removeChild(payment_list_item);
         });

         //当选择的来往单位改变时，相应的前期余额也发生改变
         Action.change("unit_select", function() {
             var index = this.className.split("_")[1];
             var value = this.value;
             var loan = document.getElementById("loan_" + index);
             //遍历所获取的数据，根据选择的值和数据中的值是否一致来改变余额
             for (var i in comData.out_link_list) {
                 if (comData.out_link_list[i].out_link_id == value) {
                     loan.innerText = "还欠该人" + comData.out_link_list[i].loan_amount + "元";
                 }
             }
         });


         //当选择的账户发生改变时，相应的可用余额也发生改变
         Action.change("account_select", function() {
             var index = this.className.split("_")[1];
             var value = this.value;
             var balance = document.getElementById("balance_" + index);
             for (var i in comData.account_list) {
                 if (comData.account_list[i].account_id == value) {
                     balance.innerText = comData.account_list[i].account_balan + "元";
                 }
             }
         });


         /**
          * 点击完成按钮的时候提交数据到服务器
          * @param  {Object}
          * @return {[type]}
          */
         Action.click('btn_finish', function() {
             var postdata = {};
             var li = document.getElementById("payment_list").getElementsByTagName('li');
             var collection = document.getElementById("collection");
             var data = {};
             for (var i = 0; i < li.length; i++) {
                 //业务说明中的数据
                 data[i] = {};
                 var input = li[i].getElementsByTagName("input");
                 var select = li[i].getElementsByTagName("select");
                 data[i]['amount'] = input[1].value;
                 data[i]['account_id'] = select[2].value;
                 data[i]['ry_id'] = select[1].value;
                 data[i]['context'] = input[0].value;
                 data[i]['payrece_type'] = select[0].value;
             }

             postdata.contextData = JSON.stringify(data);
             console.log(postdata);

             xhrSend("Rece_pay_control/insert_payrece", postdata, function(data) {
                 console.log(data);
             });
         });


     }

 }
  /**
   * [通用的函数，用于输出警告信息]
   * @param  {[type]} 
   * @return {[type]}     
   */
 function alertInf(msg) {
     alert(msg);
 }
