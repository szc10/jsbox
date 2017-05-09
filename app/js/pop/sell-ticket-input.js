 UIActivity['sell-ticket-input'] = {
     activityName: "sell-ticket-input",
     init: function() {

         var comData = null;
         activitypoint = this;

         /**
          *向服务器的接口发送请求，请求成功后会返回请求的数据
          */
         xhrSend("Select_all_info/get_info", {}, function(data) {
             activitypoint.setContext(data);
             comData = data;
         });

         /**
          *当选择税率的下拉列表选项发生变化时
          *应付税金的状态也相应发生改变
          */
         Action.change("rate_select", function() {
             var index = this.className.split("_")[1];
             var sale_list_item = document.getElementById("sale_list_item_" + index);
             var inputArr = sale_list_item.getElementsByTagName('input');
             var selectArr = sale_list_item.getElementsByTagName("select");
             var tax_in_pay = document.getElementById("taxs_in_pay_" + index);
             var inputPoint = [];
             var selectPoint = [];
             for (var i = 0; i < inputArr.length; i++) {
                 inputPoint[inputArr[i].dataset.type] = inputArr[i];
             }
             for (var j = 0; j < selectArr.length; j++) {
                 selectPoint[selectArr[j].dataset.action] = selectArr[j];
             }
             if (selectPoint["rate_select"].value == "noTax") {
                 inputPoint["inf_3"].setAttribute("readonly", "true"); //设置文本框处于无法编辑状态
                 J(tax_in_pay).setcss('color', '#ccc'); //设置字体颜色
             } else {
                 inputPoint["inf_3"].setAttribute("readonly", "false");
                 J(tax_in_pay).setcss('color', '#000');
             }
             inputPoint["inf_3"].value = '';
         });
 
         /**
          *当应付税金文本框被点击的时候，如果前面
          *的几个选项填写不完整则使之处于无法编辑状态
          *否则获取销售金额和税率，计算相应的税金被显示在
          *该文本框中
          */
         Action.click('taxs_pay', function() {

             //此处变量和计算税金总额有关
             var currentName = this.className;
             var taxs_total = document.getElementById("taxs_total");
             taxs_total.innerText = '';
             var sale_list = document.getElementById("sale_list");
             var sum = 0;
             var amount_total_input = sale_list.getElementsByTagName('input');

             //此处定义的变量和计算单个税金相关
             var index = currentName.split(' ')[1]; //获取当前点击的input的是第几个
             var sale_list_item = document.getElementById("sale_list_item_" + index);
             var inputArr = sale_list_item.getElementsByTagName('input');
             var selectArr = sale_list_item.getElementsByTagName("select");
             var tax_in_pay = document.getElementById("taxs_in_pay_" + index);

             //指针数组，分别指向inputArr和selectArr
             var inputPoint = [];
             var selectPoint = [];
             for (var i = 0; i < inputArr.length; i++) {
                 inputPoint[inputArr[i].dataset.type] = inputArr[i];
             }
             for (var j = 0; j < selectArr.length; j++) {
                 selectPoint[selectArr[j].dataset.action] = selectArr[j];
             }

             //获取利率值
             var rate = selectPoint["rate_select"].value.split("_")[1];

             //判断前几个文本框或下拉框的value是否为空
             if (inputPoint["inf_1"].value == "" || inputPoint['inf_2'].value == "" || selectPoint["income_select"].value == "" || selectPoint["rate_select"].value == "" || rate == undefined) {
                 inputPoint["inf_3"].setAttribute("readonly", "true");
                 J(tax_in_pay).setcss('color', '#ccc');
                 inputPoint["inf_3"].value = '';
             } else {
                 inputPoint["inf_3"].removeAttribute("readonly");
                 J(tax_in_pay).setcss('color', '#000');
                 var taxs_pay = (Number(inputPoint["inf_2"].value) / (1 + (rate / 100)) * (rate / 100)).toFixed(2);
                 inputPoint["inf_3"].value = taxs_pay;
             }
             /**
              *当税金的数值发生改变时，税金总计也随之改变
              */
             var currentVal = this.value;
             sum = computeTotal(amount_total_input, "inf_3", currentName) + Number(currentVal);
             taxs_total.innerText = "￥" + sum.toFixed(2);
         });

         /**
          *点击添加条目按钮新增一条业务说明
          */
         var idIndex = 3;
         Action.click("add_sale_item", function() {
             var sale_list = document.getElementById('sale_list');
             var add_item = J("sale_item").getHtml();
             var data = [];
             data.id = idIndex;

             //创建一个模板，并将数据传入
             var test = objectManager.create(Jtmpl, add_item).createHtml(data);

             var li = document.createElement("li");
             li.id = "sale_list_item_" + data.id;

             //将新增的条目直接添加到列表中
             sale_list.appendChild(li);
             //填充条目内容
             li.innerHTML = test;
             idIndex += 1;
         });


         /**
          *点击业务说明中的delete按钮就将这条业务说明从业务列表中删除
          *同时获取要删除订单这条记录中的数据用于计算总的金额
          */
         Action.click('btn_delete', function() {
             var index = this.className.split(' ')[1];
             var amount_input = Number(document.getElementById("sale_list_item_" + index).getElementsByTagName('input')[1].value);
             var taxs_input = Number(document.getElementById("sale_list_item_" + index).getElementsByTagName('input')[2].value);
             var sale_list_item = document.getElementById("sale_list_item_" + index);
             var sale_list = document.getElementById('sale_list');
             sale_list.removeChild(sale_list_item);
             var amount_total = document.getElementById("amount_total");
             var taxs_total = document.getElementById("taxs_total");
             amount_total.innerText = "￥" + (Number(amount_total.innerText.split('￥')[1]) - amount_input).toFixed(2);
             taxs_total.innerText = "￥" + (Number(taxs_total.innerText.split('￥')[1]) - taxs_input).toFixed(2);

             /**
              * [删除一条记录。同时将税金在总到底税金上减去，当总的税金为0 时，默认为0]
              * @param  {Number} 
              * @return {[type]}   
              */
             if (Number(amount_total.innerText.split('￥')[1]) <= 0) {
                 amount_total.innerText = "￥" + 0;
             }
             if (Number(taxs_total.innerText.split('￥')[1]) <= 0) {
                 taxs_total.innerText = "￥" + 0;
             }
         });

         /**
          *当选择账户的下拉列表的值发生改变时，可用余额也同时发生改变
          */

         Action.change('account_select', function() {
             var selectVal = this.value;
             var available_balance = document.getElementById("available_balance");
             /**
              * [查找当前所选中账户的可用余额并赋值给可用金额]
              * @param  {[type]} 
              * @return {[type]}  
              */
             for (var i in comData.account_list) {
                 if (comData.account_list[i].account_id == selectVal) {
                     available_balance.innerText = comData.account_list[i].account_balan;

                 }
             }
         });

         /**
          *当选择客户的下拉列表的值发生改变时，前期余额也想应的发生改变
          */
         Action.change("client_select", function() {
             var selectVal = this.value;
             console.log(comData);
             var loan = document.getElementById('loan');
             /**
              * [查找所选中的客户的前期余额并将其赋值给前期余额]
              * @param  {[type]} 
              * @return {[type]} 
              */
             for (var j in comData.out_link_list) {
                 if (comData.out_link_list[j].out_link_id == selectVal) {
                     loan.innerText = "还欠客户" + comData.out_link_list[j].loan_amount + "元";
                 }
             }
         });


         /**
          *当开关的状态发生改变时，下面的文本框和下拉列表都没无法操作
          */

         Action.click("switch", function() {
             J(this).toggleClass("switchOn");
             var length = this.className.split(" ").length;
             var className = this.className.split(" ")[length - 1];
             var pay_amount = document.getElementById("pay_amount");
             var pay_amount_input = document.getElementById("pay_amount_input");
             if (className == "") {
                 J(pay_amount).setcss("color", "#ccc");
                 pay_amount_input.setAttribute("readonly", "true");
             } else {
                 J(pay_amount).setcss("color", "#000");
                 pay_amount_input.removeAttribute("readonly");
             }
         });


         /**
          *点击关闭的时候关闭销售单页面
          */
         Action.click("btn_close", function() {
             activitypoint.close();
         });

         /**
          *当销售金额的数值发生改变时，销售金额总计也随之改变
          */
         Action.change("sale_pay", function() {
             var currentName = this.className;
             var currentVal = this.value;
             var amount_total = document.getElementById("amount_total");
             amount_total.innerText = '';
             var sale_list = document.getElementById("sale_list");
             var sum = 0;
             var amount_total_input = sale_list.getElementsByTagName('input');
             sum = computeTotal(amount_total_input, "inf_2", currentName) + Number(currentVal);
             amount_total.innerText = "￥" + sum;
         });

         /**
          *用来计算当销售金额或者税金发生变化时，其余未发生变化的销售金额或者税金的值
          */
         function computeTotal(inputArr, dataType, currentClassName) {
             var arr = [];
             var sum = 0;
             for (var i = 0; i < inputArr.length; i++) {
                 if (inputArr[i].dataset.type == dataType && inputArr[i].className != currentClassName) {
                     arr.push(inputArr[i]);
                 }
             }
             console.log(arr);
             for (var j = 0; j < arr.length; j++) {
                 sum += Number(arr[j].value);
             }
             return sum;
         }


         /**
          **点击完成提交数据
          */
         Action.click('btn_finish', function() {
             var postdata = {};
             var li = document.getElementById("sale_list").getElementsByTagName('li');
             var collection = document.getElementById("collection");
             var data = {};
             //获取每个里的所有数据，并存入data[i]中
             for (var i = 0; i < li.length; i++) {
                 //业务说明中的数据
                 data[i] = {};
                 var input = li[i].getElementsByTagName("input");
                 var select = li[i].getElementsByTagName("select");
                 data[i]['inf'] = input[0].value;
                 data[i]['income_type'] = select[0].value;
                 data[i]['sell_price'] = input[1].value;
                 data[i]['tax_type'] = select[1].value;
                 data[i]['taxation'] = input[2].value;
             }
             //收款账户中的数据
             var cl_input = collection.getElementsByTagName('input');
             var cl_select = collection.getElementsByTagName("select");
             var cl_span = collection.getElementsByTagName('span');
             var is_cash = document.getElementById("is_cash");
             var length = is_cash.className.split(" ").length;

             postdata.contextData = JSON.stringify(data);//将获取的data数组转化成json字符串格式
             postdata.client_id = cl_select[0].value;
             if (is_cash.className.split(" ")[length - 1] == "switchOn") {
                 postdata.is_cash = 1;
             } else {
                 postdata.is_cash = 0;
             }
             postdata.re_amount = cl_input[0].value;
             var predict_pay_time = cl_input[1].value.split("-");
             var datums = new Date(Date.UTC(predict_pay_time[0], predict_pay_time[1] - 1, predict_pay_time[2]));
             var nowtime = datums.getTime();
             postdata.predict_pay = nowtime;
             postdata.account_id = cl_select[1].value;
             console.log(postdata);
          
             xhrSend("Sell_list_control/boss_insert_sell", postdata, function(data) {
                 console.log(data);
             });
         });
     }
 }
