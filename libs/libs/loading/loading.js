;var loading = (function(){
   var body = document.getElementsByTagName('body')[0];
   var load = document.createElement("div");
   var timer = 0;
   load.id = "loading";
   var str = ["<style>",
        "    #loading{",
        "        width: 50px;",
        "        height: 50px;",
        "        display: block;",
        "        z-index: 999;",
        "        position: absolute;",
        "        background: url(../libs/loading/loading.gif) no-repeat;",
        "        background-size: cover;",
        "        left: 50%;",
        "        top: 50%;",
        "    }",
        "</style>"
    ].join("");
    body.appendChild(load);
    load.innerHTML += str;
    document.onreadystatechange = function(){
    	if (document.readyState == "complete") {
    		completeLoading(); 
    	}
    };

    function loadMask(ele){
      timer = setTimeout(function(){
         ele.appendChild(load);
         load.innerHTML += str;
      }, 700);
    }

	//加载状态为complete时移除loading效果
	function completeLoading() {
     clearTimeout(timer);
     if(document.getElementById('loading')){
	     var loadingMask = document.getElementById('loading');
	     loadingMask.parentNode.removeChild(loadingMask);
    }
	}
    
	return {
    loadMask: loadMask,
		completeLoading: completeLoading
	}
})();

// loading.loadMask(document.getElementsByTagName('body')[0]);