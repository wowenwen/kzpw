/*from tccdn minify at 2013-12-27 9:20:04,file：/cn/c/s/2013/searchSelf.0.0.5.js?v=2013091001*/
fish.ready(function(){var h=-1;fish.all("#sous_btun").on("click",function(i){var j=fish.one("#zzy_search");fish.preventDefault(i);a();if(j.value!=""){fish.cookie.set({name:"selfName",value:j.value,domain:".17u.cn",path:"/"})}});var b;fish.all("#zzy_search").on("keyup",function(j){var k=fish.getEvent(j),i=k.keyCode?k.keyCode:j.which,l=this;if(i==13){a()}clearTimeout(b);b=setTimeout(function(){c.apply(l,[i])},300);g(j,"selfInfo_list","zzy_search")});function c(i){var k=this.id,l;if(k==="zzy_search"){l=fish.dom("#zzy_search")}if(l.value.length>0){if(i==13){var j=fish.all("#selfInfo_list");if(j.length!=0){j[0].style.display="none"}return}else{if(i!=38&&i!=40){e(2)}}}else{var j=fish.all("#selfInfo_list");if(j.length!=0){j[0].style.display="none"}}}function e(j){var i=fish.dom("#zzy_search");if(j==2&&i.value.length>0){soso_typeAjax=0;var k="/zizhuyou/Ajax/LineFirstAjaxCall.aspx?action=getSearchTipByKeyWord&keyword="+encodeURIComponent(i.value);fish.ajax({url:k,fn:function(m){if(m){h=-1;fish.one("#selfInfo_list").html(m);var l=fish.one("#zzy_search").offset();fish.dom("#selfInfo_list").style.display="block";fish.dom("#selfInfo_list").style.position="absolute";fish.all("#selfInfo_list li").each(function(n,o){fish.one(n).attr("data-num",o)});fish.all("#selfInfo_list li").hover(function(){fish.one(this).addClass("hover")},function(){fish.one(this).removeClass("hover")});fish.all("#selfInfo_list li").each(function(n){fish.one(this).on("click",function(){fish.dom("#zzy_search").value=fish.one(this).attr("data-value");h=fish.one(this).attr("data-num")})})}}})}}function g(l,i,n){try{var j;var k=fish.dom("#"+i);var o=fish.dom("#"+n);if(k.length!=0){var m=fish.all("li",k);if(k.style.display==""||k.style.display=="inline"||k.style.display=="block"){if(!l){var l=window.event}if(l.keyCode){j=l.keyCode}else{if(l.which){j=l.which}}if(j==9){return}if(j==40){if(h>=m.length-1){h=m.length-1}else{h++}}if(j==38){if(h<=0){h=0}else{h--}}if(j==38||j==40){f(m,o,j)}}}}catch(l){return}}function f(m,o,j){try{var n;for(var l=0;l<m.length;l++){if(m[l].className==="hover"||m[l].className===""||m[l].className==="selected"){m[l].className=""}}if(h>=0&&h<=m.length){if(m[h].className==""){m[h].className="selected";n=fish.one(m[h]).attr("data-value");o.value=n}}}catch(k){return}}function a(){var i=document.getElementById("zzy_search").value;url_str="http://www.17u.cn/zizhuyou/linesearchlist/"+encodeURIComponent(i);if(i.length>=25){fish.dom("#zzyMasErr").style.display="block";fish.dom("#zzyMasErr").innerHTML='<span class="lefSpan"></span><span class="rgtSpan">关键字需控制在25字以内</span>';return}if(i=="景点或城市名"||i==""){fish.dom("#zzyMasErr").style.display="block";fish.dom("#zzyMasErr").innerHTML='<span class="lefSpan"></span><span class="rgtSpan">请输入景点或城市名</span>';i=""}if(i!=""&&i.length<25&&i!="景点或城市名"){window.location.href=url_str}}fish.on("focus",function(){var i=document.getElementById("zzy_search");if(i.value=="景点或城市名"||i.value=="国庆预售"){i.value=""}i.style.color="#333";document.getElementById("zzyMasErr").style.display="none"},"#zzy_search");fish.on("blur",d,"#zzy_search");function d(){var i=document.getElementById("zzy_search");if(i.value.length==0||i.value=="景点或城市名"){i.value="景点或城市名";document.getElementById("zzy_search").style.color="#999"}}fish.on("click",function(i){var k=fish.getTarget(i),j=fish.dom("#selfInfo_list");if(fish.one(k).hasClass("atop_selftrip")){j.style.display="block";j.style.display="none"}else{j.style.display="none"}},document)});