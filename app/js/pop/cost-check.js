 UIActivity['cost-check'] = {
     activityName: "cost-check",
     init: function(id) {
         var comData = null;
         activitypoint = this;
         /**
          * *向服务器的接口发送请求，请求成功后会返回请求的数据
          */

         xhrSend("Select_all_info/get_info", {}, function(data) {
             comData = data;
             /**
              * [向服务器拉取数据，这里的data包括comdata以及当前请求接口返回的数据]
              * @param  {[type]}    data.comData [基本数据接口请求返回的数据，通用的]
              * @return {[type]}    
              */
             xhrSend("Expenditure_control/select_expense", { expense_id: id}, function(data) {
                 data.comData = comData;
                 activitypoint.setContext(data);
                 console.log(data);
             });
         });

         /**
          *当选择税率的下拉列表选项发生变化时
          *应付税金的状态也相应发生改变
          */
         Action.change("rate_select", function() {
             var index = this.className.split("_")[1];
             var cost_list_item = document.getElementById("cost_list_item_" + index);
             var inputArr = cost_list_item.getElementsByTagName('input');
             var selectArr = cost_list_item.getElementsByTagName("select");
             var tax_in_pay = document.getElementById("taxs_in_pay_" + index);
             var inputPoint = [];
             var selectPoint = [];
             for (var i = 0; i < inputArr.length; i++) {
                 inputPoint[inputArr[i].dataset.type] = inputArr[i];
             }
             for (var j = 0; j < selectArr.length; j++) {
                 selectPoint[selectArr[j].dataset.action] = selectArr[j];
             }

             /**
              * [if 当发票类型为未开发票时，应付税金处于无法编辑状态]
              * @param  {[type]} selectPoint["rate_select"].value [description]
              * @return {[type]}                                  [description]
              */
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
             var cost_list = document.getElementById("cost_list");
             var sum = 0;
             var amount_total_input = cost_list.getElementsByTagName('input');

             //此处定义的变量和计算单个税金相关
             var index = currentName.split(' ')[1]; //获取当前点击的input的是第几个
             var cost_list_item = document.getElementById("cost_list_item_" + index);
             var inputArr = cost_list_item.getElementsByTagName('input');
             var selectArr = cost_list_item.getElementsByTagName("select");
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
             if (inputPoint["inf_1"].value == "" || inputPoint['inf_2'].value == "" || selectPoint["cost_select"].value == "" || selectPoint["rate_select"].value == "" || rate == undefined) {
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
             var cost_list = document.getElementById('cost_list');
             var add_item = J("cost_item").getHtml();
             var data = [];
             data.id = idIndex;

             //创建一个模板，并将数据传入
             var test = objectManager.create(Jtmpl, add_item).createHtml(data);

             var li = document.createElement("li");
             li.id = "cost_list_item_" + data.id;

             //将新增的条目直接添加到列表中
             cost_list.appendChild(li);
             //填充条目内容
             li.innerHTML = test;
             idIndex += 1;
         });


         /**
          *当销售金额的数值发生改变时，销售金额总计也随之改变
          */
         Action.change("cost_pay", function() {
             var currentName = this.className;
             var currentVal = this.value;
             var cost_amount_total = document.getElementById("cost_amount_total");
             cost_amount_total.innerText = '';
             var cost_list = document.getElementById("cost_list");
             var sum = 0;
             var cost_amount_total_input = cost_list.getElementsByTagName('input');
             sum = computeTotal(cost_amount_total_input, "inf_2", currentName) + Number(currentVal);
             cost_amount_total.innerText = "￥" + sum;
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
          *点击业务说明中的delete按钮就将这条业务说明从业务列表中删除
          */
         Action.click('btn_delete', function() {
             var index = this.className.split(' ')[1];
             var amount_input = Number(document.getElementById("cost_list_item_" + index).getElementsByTagName('input')[1].value);
             var taxs_input = Number(document.getElementById("cost_list_item_" + index).getElementsByTagName('input')[2].value);
             var cost_list_item = document.getElementById("cost_list_item_" + index);
             var cost_list = document.getElementById('cost_list');
             cost_list.removeChild(cost_list_item);
             var cost_amount_total = document.getElementById("cost_amount_total");
             var taxs_total = document.getElementById("taxs_total");
             cost_amount_total.innerText = "￥" + (Number(cost_amount_total.innerText.split('￥')[1]) - amount_input).toFixed(2);
             taxs_total.innerText = "￥" + (Number(taxs_total.innerText.split('￥')[1]) - taxs_input).toFixed(2);
             if (Number(cost_amount_total.innerText.split('￥')[1]) <= 0) {
                 cost_amount_total.innerText = "￥" + 0;
             }
             if (Number(taxs_total.innerText.split('￥')[1]) <= 0) {
                 taxs_total.innerText = "￥" + 0;
             }
         });


         /**
          *当开关的状态发生改变时，下面的文本哭框和下拉列表都没无法操作
          */

         Action.click("switch", function() {
             J(this).toggleClass("switchOn");
             var length = this.className.split(" ").length;
             var className = this.className.split(" ")[length - 1];
             var cost_amount = document.getElementById("cost_amount");
             var cost_amount_input = document.getElementById("cost_amount_input");
             if (className == "") {
                 J(cost_amount).setcss("color", "#ccc");
                 cost_amount_input.setAttribute("readonly", "true");
             } else {
                 J(cost_amount).setcss("color", "#000");
                 cost_amount_input.removeAttribute("readonly");
             }
         });


         /**
          *当选择账户的下拉列表的值发生改变时，可用余额也同时发生改变
          */

         Action.change('account_select', function() {
             var selectVal = this.value;
             var available_balance = document.getElementById("available_balance");
             for (var i in comData.account_list) {
                 if (comData.account_list[i].account_id == selectVal) {
                     available_balance.innerText = comData.account_list[i].account_balan;

                 }
             }
         });

         /**
          *当选择客户的下拉列表的值发生改变时，前期余额也想应的发生改变
          */
         Action.change("payee_select", function() {
             var selectVal = this.value;
             console.log(comData);
             var loan = document.getElementById('loan');
             for (var j in comData.staff_list) {
                 if (comData.staff_list[j].st_id == selectVal) {
                     loan.innerText = "还欠客户" + comData.staff_list[j].loan_amount + "元";
                 }
             }
         });

         /**
          *点击关闭的时候关闭销售单页面
          */
         Action.click("btn_close", function() {
             activitypoint.close();
         });


         /**
          *点击完成提交数据
          */
         Action.click('btn_finish',function(){
              var postdata={};
              var li = document.getElementById("cost_list").getElementsByTagName('li');
              var collection = document.getElementById("collection");
              var data = {};
             for(var i = 0; i < li.length; i++) {
                //业务说明中的数据
                data[i] = {};
                var input = li[i].getElementsByTagName("input");
                var select = li[i].getElementsByTagName("select");
                data[i]['inf'] = input[0].value;
                data[i]['expense_type'] = select[0].value;
                data[i]['expense_price'] = input[1].value;
                data[i]['tax_type'] = select[1].value;
                data[i]['taxation'] = input[2].value;
             }
             //  //收款账户中的数据
             var cl_input = collection.getElementsByTagName('input');
             var cl_select = collection.getElementsByTagName("select");
             var is_cash = document.getElementById("is_cash");
             var length = is_cash.className.split(" ").length;

             postdata.contextData = JSON.stringify(data);
             postdata.st_id = cl_select[0].value;
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
             postdata.expense_id=id;
             console.log(postdata);

             xhrSend("Expenditure_control/boss_check_expense",postdata,function(data){
                 console.log(data);
                 activitypoint.close();
             });
         });
     }
 }
