 UIActivity['asset-purchase'] = {
     activityName: "asset-purchase",
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
          * 当资产类型发生改变时，折扣年限也随之发生改变，但是折扣年限本身也是可以写修改的
          */

         Action.change('asset_select', function() {
             var index = this.className.split("_")[1];
             var value = parseInt(this.value / 10);
             var discount_year = document.getElementById('discount_year_' + index);
             discount_year.value = value;
         });
         
        /**
         * 当选择的税率类型发生改变时，应交税金的状态也随之发生改变
         */

         Action.change("rate_select", function() {
             var index = this.className.split("_")[1];
             var asset_list_item = document.getElementById("asset_list_item_" + index);
             var inputArr = asset_list_item.getElementsByTagName('input');
             var selectArr = asset_list_item.getElementsByTagName("select");
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
                 inputPoint["inf_4"].setAttribute("readonly", "true"); //设置文本框处于无法编辑状态
                 J(tax_in_pay).setcss('color', '#ccc'); //设置字体颜色
             } else {
                 inputPoint["inf_4"].setAttribute("readonly", "false");
                 J(tax_in_pay).setcss('color', '#000');
             }
             inputPoint["inf_4"].value = '';
         });
         
         /**
          * [计算单个税金以及所有的税金之和]
          * @param  {[type]}                                  
          * @return {[type]}   
          */
         Action.click("taxs_pay", function() {
             //此处变量和计算税金总额有关
             var currentName = this.className;
             var taxs_total = document.getElementById("taxs_total");
             taxs_total.innerText = '';
             var asset_list = document.getElementById("asset_list");
             var sum = 0;
             var amount_total_input = asset_list.getElementsByTagName('input');

             //此处定义的变量和计算单个税金相关
             var index = currentName.split(' ')[1]; //获取当前点击的input的是第几个
             var asset_list_item = document.getElementById("asset_list_item_" + index);
             var inputArr = asset_list_item.getElementsByTagName('input');
             var selectArr = asset_list_item.getElementsByTagName("select");
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
             if (inputPoint["inf_1"].value == "" || inputPoint['inf_2'].value == "" || inputPoint['inf_3'].value == "" || selectPoint["asset_select"].value == "" || selectPoint["department_select"].value == "" || selectPoint["rate_select"].value == "" || rate == undefined) {
                 inputPoint["inf_4"].setAttribute("readonly", "true");
                 J(tax_in_pay).setcss('color', '#ccc');
                 inputPoint["inf_4"].value = '';
             } else {
                 inputPoint["inf_4"].removeAttribute("readonly");
                 J(tax_in_pay).setcss('color', '#000');
                 var taxs_pay = (Number(inputPoint["inf_2"].value) / (1 + (rate / 100)) * (rate / 100)).toFixed(2);
                 inputPoint["inf_4"].value = taxs_pay;
             }
             /**
              *当税金的数值发生改变时，税金总计也随之改变
              */
             var currentVal = this.value;
             sum = computeTotal(amount_total_input, "inf_4", currentName) + Number(currentVal);
             taxs_total.innerText = "￥" + sum.toFixed(2);
         });

         /**
          *点击添加条目按钮新增一条业务说明
          */
         var idIndex = 2;
         Action.click("add_sale_item", function() {
             var asset_list = document.getElementById('asset_list');
             var add_item = J("asset_item").getHtml();
             var data = [];
             data.id = idIndex;

             //创建一个模板，并将数据传入
             var test = objectManager.create(Jtmpl, add_item).createHtml(data);

             var li = document.createElement("li");
             li.id = "asset_list_item_" + data.id;

             //将新增的条目直接添加到列表中
             asset_list.appendChild(li);
             //填充条目内容
             li.innerHTML = test;
             idIndex += 1;
         });

         /**
          *点击业务说明中的delete按钮就将这条业务说明从业务列表中删除
          */
         Action.click('btn_delete', function() {
             var index = this.className.split(' ')[1];
             var amount_input = Number(document.getElementById("asset_list_item_" + index).getElementsByTagName('input')[1].value);
             var taxs_input = Number(document.getElementById("asset_list_item_" + index).getElementsByTagName('input')[3].value);
             var asset_list_item = document.getElementById("asset_list_item_" + index);
             var asset_list = document.getElementById('asset_list');
             asset_list.removeChild(asset_list_item);
             var asset_amount_total = document.getElementById("asset_amount_total");
             var taxs_total = document.getElementById("taxs_total");
             asset_amount_total.innerText = "￥" + (Number(asset_amount_total.innerText.split('￥')[1]) - amount_input).toFixed(2);
             taxs_total.innerText = "￥" + (Number(taxs_total.innerText.split('￥')[1]) - taxs_input).toFixed(2);
             if (Number(asset_amount_total.innerText.split('￥')[1]) <= 0) {
                 asset_amount_total.innerText = "￥" + 0;
             }
             if (Number(taxs_total.innerText.split('￥')[1]) <= 0) {
                 taxs_total.innerText = "￥" + 0;
             }
         });


         /**
          *当销售金额的数值发生改变时，销售金额总计也随之改变
          */
         Action.change("sale_pay", function() {
             var currentName = this.className;
             var currentVal = this.value;
             var asset_amount_total = document.getElementById("asset_amount_total");
             asset_amount_total.innerText = '';
             var asset_list = document.getElementById("asset_list");
             var sum = 0;
             var amount_total_input = asset_list.getElementsByTagName('input');
             sum = computeTotal(amount_total_input, "inf_2", currentName) + Number(currentVal);
             asset_amount_total.innerText = "￥" + sum;
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
          *当开关的状态发生改变时，下面的文本哭框和下拉列表都没无法操作
          */

         Action.click("switch", function() {
             J(this).toggleClass("switchOn");
             var length = this.className.split(" ").length;
             var className = this.className.split(" ")[length - 1];
             var cost_amount = document.getElementById("cost_amount");
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
             for (var j in comData.out_link_list) {
                 if (comData.out_link_list[j].out_link_id == selectVal) {
                     loan.innerText = "还欠客户" + comData.out_link_list[j].loan_amount + "元";
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
         Action.click('btn_finish', function() {
             var time = new Date();
             var timeSeconds = time.getTime();
             var postdata = {};
             var li = document.getElementById("asset_list").getElementsByTagName('li');
             var collection = document.getElementById("collection");
             var data = {};
             for (var i = 0; i < li.length; i++) {
                 //业务说明中的数据
                 data[i] = {};
                 var input = li[i].getElementsByTagName("input");
                 var select = li[i].getElementsByTagName("select");
                 data[i]['inf'] = input[0].value;
                 data[i]['purchase_amount'] = input[1].value;
                 data[i]['purchase_time'] = timeSeconds;
                 data[i]['purchase_type'] = select[1].value;
                 data[i]['purchase_year'] = input[2].value;
                 data[i]['remain_value'] = select[3].value;
                 data[i]['depart_id'] = select[0].value;
                 data[i]['tax_type'] = select[2].value;
                 data[i]['taxation'] = input[3].value;
             }
             //  //收款账户中的数据
             var cl_input = collection.getElementsByTagName('input');
             var cl_select = collection.getElementsByTagName("select");
             var is_cash = document.getElementById("is_cash");
             var length = is_cash.className.split(" ").length;

             postdata.contextData = JSON.stringify(data);
             console.log(postdata.contextData);
             postdata.su_id = cl_select[0].value;
             if (is_cash.className.split(" ")[length - 1] == "switchOn") {
                 postdata.is_cash = 1;
             } else {
                 postdata.is_cash = 0;
             }
             postdata.pay_amount = cl_input[0].value;
             var predict_pay = cl_input[1].value.split("-");
             var datums = new Date(Date.UTC(predict_pay[0], predict_pay[1] - 1, predict_pay[2]));
             var nowtime = datums.getTime();
             postdata.predict_pay = nowtime;
             postdata.account_id = cl_select[1].value;
             console.log(postdata);

             xhrSend("Assetpurchase_control/boss_insert_assetpur", postdata, function(data) {
                 console.log(data);
             });
         });


     }
 }
