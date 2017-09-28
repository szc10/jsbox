    /**
     * Created by szc on 16/9/11.
     */
    var AlertDel = (function() {

        var body = document.getElementsByTagName('body')[0];
        var Alert = document.createElement('div');
        J(Alert).click(function() {
            disappear();
        });
        Alert.id = "Alert";

        var str = ' <style>' +
            '        #Alert {' +
            '        width: 100%;' +
            '        height: 100%;' +
            '        display: none;' +
            '        z-index: 99;' +
            '        position: absolute;' +
            '        top: 0;' +
            '    }' +
            '    .context {' +
            '        margin: 0 auto;' +
            '        top: 40%;' +
            '        position: relative;' +
            '        will-change: transform;' +
            '        transition: all .5s ease-out;' +
            '        padding-top: 85px;' +
            '        padding-bottom: 15px;' +
            '        background: no-repeat center 25px;' +
            '        background-size: 15%;' +
            '        text-align: center;' +
            '        font-size: 14px !important;' +
            '        border: solid 1px #f3f3f3;' +
            '        width: 250px;' +
            '        color: rgb(150,150,150);' +
            '        box-shadow: 0 2px 4px rgba(0,0,0,0.15);' +
            '        background-color:#FFF;' +
            '    }' +
            '    </style>' +
            '    <div id="context" style="opacity: 1;" class="context">' +
            '        alert' +
            '    </div>';

        /**
         * 添加布局文件
         */
        body.appendChild(Alert);
        Alert.innerHTML = str;

        var context = document.getElementById("context");
        var callBack = null;

        var iconArr = [];
        var _url = "http://115.28.213.102/icon/";
        iconArr['_true'] = "icon/deal/ok.svg";
        iconArr['_false'] = "icon/deal/error.svg";
        iconArr['_deal'] = _url + "loading.gif";

        /**
         * [弹框显现]
         * @param  {[type]} htmlStr [弹框要显现的内容]
         * @return {[type]}         [description]
         */
        function display(htmlStr) {
            context.innerHTML = htmlStr;
            Alert.style.display = "block";
            J("Alert").getcss('display');
            context.style.opacity = 1;
        }


        /**
         * 更换弹框的上面的图标
         *
         **/
        function displayIcon(type) {
            context.style['background-image'] = "url(" + iconArr[type] + ")";
        }

        /**
         * [弹框消失]
         * @return {[type]} [description]
         */
        function disappear() {
            context.style.opacity = 0;
        }

        /**
         * [显示后延迟消失]
         * @param  {[type]}   htmlStr  [弹框要显现的内容]
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        function delayDisappear(htmlStr, callback) {
            display(htmlStr);
            callBack = callback;
            setTimeout(function() {
                disappear();
            }, 2500);
        }

        /**
         * [动画处理完毕以后的回调函数]
         * @param  {[type]} )     {                   if (context.style.opacity [description]
         * @param  {[type]} false [description]
         * @return {[type]}       [description]
         */
        context.addEventListener('webkitTransitionEnd', function() {
            //显示完成后的回调函数
            if (context.style.opacity == 1) {
                console.log("display");
                //消失以后的回调函数
            } else if (context.style.opacity == 0) {
                console.log("disappear");
                Alert.style.display = "none";
                context.innerHTML = "";

                if (jsBox.isFunction(callBack)) {
                    callBack();
                    callBack = null;
                }
            }
        }, false);

        return {
            /**
             * Alert.display();
             * 显示一个消息
             * @param htmlStr
             */
            display: function(htmlStr) {
                display(htmlStr);
            },
            /**
             * Alert.disappear();
             * 让一个消息显示以后消失
             */
            disappear: function() {
                disappear();
            },
            /**
             * Alert.delayDisappear
             * 显示一个消息后1s后自动消失
             * @param htmlStr
             * @param fn
             */
            delayDisappear: function(htmlStr, fn) {
                delayDisappear(htmlStr, fn);
            },
            /**
             * Alert.correctState();
             * 显示一个正确的消息,1s后自动消失
             * @param htmlStr
             * @param fn
             */
            correctState: function(htmlStr, fn) {
                displayIcon('_true');
                delayDisappear(htmlStr, fn);
            },
            /**
             * Alert.errorState();
             * 显示一个错误的消息,1s自动消失
             * @param htmlStr
             * @param fn
             */
            errorState: function(htmlStr, fn) {
                displayIcon('_false');
                delayDisappear(htmlStr, fn);
            },
            /**
             * Alert.dealState();
             * 显示一个正在处理中的消息
             * @param htmlStr
             */
            dealState: function(htmlStr) {
                displayIcon('_deal');
                display(htmlStr);
            }
        }
    }());


    function inf_notify(str) {
        // if (window.alert) {
        //     alert(str);
        // }
        AlertDel.errorState(str);
    }

    


