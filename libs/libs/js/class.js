// 11-24 szc  company分文件
var TabActivity = function(newActivityAction) {
    TabActivity.superClass.constructor.call(this, newActivityAction); //调用父类的构造方法
/*
 * 展示当前页数
 */
//num判断是哪个服务器地址
this.loadData = function(url,data,fn,_url,tab_container,ul_menu,tab_container_index,ul_menu_index,page_ing,page_all){
    var point = this;
    console.log(_url);
    //获取模板队列
    var tmplArr = this.getTemplate();
    var currentMenu = null;
    var highCls = 'current-page';
    var ellipCls = 'ellip';

    var _page_ing = page_ing || this.findDom('page-ing');
    var _page_all = page_all || this.findDom('page-all');
    var _tab_container = tab_container || this.findDom('tab-container');
    var _ul_menu = ul_menu || this.findDom('ul-menu');
    // var _page_ing = this.findDom('page-ing') || page_ing;
    // var _page_all = this.findDom('page-all') || page_all;
    // var _tab_container = this.findDom('tab-container') || tab_container;
    // var _ul_menu = this.findDom('ul-menu') || ul_menu;
    var _tab_container_index = tab_container_index || 0;
    var _ul_menu_index = ul_menu_index || 1;

   /*
    *  设置标签页页码
    */
    this.setPageNum = function(pageIngNum,pageAllNum){
        J(_page_ing).setHtml(pageIngNum);
        J(_page_all).setHtml(pageAllNum);
    }
  /*  渲染数据
   */
   function loadDataList(url,data,fn){
        if(_url == 1){
            xhrSend({
                url: url,
                data:data,
                sucFn: function(data){
                    console.log(data);
                     fn(data);
                }
            });
        }else{
            xhrSend2({
                url: url,
                data:data,
                sucFn: function(data){
                    console.log(data);
                     fn(data);
                }
            }); 
        }
            
   }

   loadDataList(url,data,fn);
   //加载第page页的数据，所传page是this.dataset.target
   this.loadTable = function(data,page){
        var page = page || 1;
        var postData = {};
        postData.data = data;
        postData.page = page;
        console.log(postData)
        if(!postData.data) return;//如果数据为空，则不渲染列表
        var _htmlModel = objectManager.create(Jtmpl, tmplArr[_tab_container_index]).createHtml(postData);
        J(_tab_container).setHtml(_htmlModel);
   }

   function addHigh(obj){
        J(currentMenu).removeClass(highCls);
        currentMenu = obj;
        J(currentMenu).addClass(highCls);
    }

    //data为记录列表
    this.loadMenu = function(data){
        var page = 1;
        var postData = {};
        postData.data = data;
        postData.page = page;
        if(postData.data.length == 0) return;//如果数据为空，则不渲染模板按钮
        var _htmlModel = objectManager.create(Jtmpl, tmplArr[_ul_menu_index]).createHtml(postData);
        J(_ul_menu).setHtml(_htmlModel);
        var menu_list = _ul_menu.getElementsByTagName('li');
        currentMenu = menu_list[0];
        var _targetId = parseInt(menu_list[0].dataset.target);
        addHigh(currentMenu);
        var num = data.length;
        Action.click("switch-page",function(){
            var pageId = this.dataset.target;
            if(parseInt(pageId)){//是页数
                _targetId = parseInt(this.dataset.target);
                point.loadTable(data[parseInt(pageId) - 1],parseInt(pageId));
                point.setPageNum(pageId,num);
            }else{
                switch(pageId){
                    case 'first-page':
                        point.loadTable(data[0]);
                        point.setPageNum(1,num);
                        break;
                    case 'pre-page':
                        console.log(_targetId)
                        if(_targetId > 1){//是页数
                            point.loadTable(data[_targetId - 2],_targetId-1);
                            point.setPageNum(_targetId-1,num);
                            _targetId = _targetId - 1;
                            if(_targetId <= num - 6){
                                postData.page = _targetId;
                                var _htmlModel = objectManager.create(Jtmpl, tmplArr[_tab_container_index]).createHtml(postData);
                                J(_ul_menu).setHtml(_htmlModel);
                            }
                            console.log(_targetId)
                        }
                        break;
                    case 'next-page':
                        if(_targetId < num){//是页数
                            point.loadTable(data[_targetId],_targetId+1);
                            point.setPageNum(_targetId+1,num);
                            _targetId = _targetId + 1;
                            if(_targetId <= num - 6){console.log(_targetId)
                                postData.page = _targetId;
                                var _htmlModel = objectManager.create(Jtmpl, tmplArr[_ul_menu_index]).createHtml(postData);
                                J(_ul_menu).setHtml(_htmlModel);
                            }
                        }
                        break;
                    case 'last-page':
                        point.loadTable(data[num - 1],num);
                        point.setPageNum(num,num);
                        break;
                }
            }

            addHigh(this);
        });

        Action.click('ellip-page',function(){
            var firstId = parseInt(menu_list[0].dataset.target);
            if(firstId <= num - 6 - 1){//8页，把firstId重设为原来的+1
                firstId = firstId + 1;
                _targetId = parseInt(firstId);
                point.loadTable(data[firstId - 1],firstId);
                point.setPageNum(firstId,num);
                postData.page = firstId;console.log(postData.page)
                var _htmlModel = objectManager.create(Jtmpl, tmplArr[_ul_menu_index]).createHtml(postData);
                J(_ul_menu).setHtml(_htmlModel);
            }

            addHigh(menu_list[0]);
        });
   }
}

this.handleData = function(url,data){
    xhrSend({
        url: url,
        data:data,
        sucFn: function(data){
            console.log(data);
        }
    });
}

this.handleData2 = function(url,data,fn){
    xhrSend({
        url: url,
        data:data,
        sucFn: function(data){
            console.log(data);
            fn();
        }
    });
}

}
extend(TabActivity, JActivity);
