/**
 * Created by hxpeng on 2016/5/9.
 */



//顶部加载条，插件：nprogress //
(function(root,factory){if(typeof define==="function"&&define.amd){define(factory)}else{if(typeof exports==="object"){module.exports=factory()}else{root.NProgress=factory()}}})(this,function(){var NProgress={};NProgress.version="0.2.0";var Settings=NProgress.settings={minimum:0.08,easing:"linear",positionUsing:"",speed:350,trickle:true,trickleSpeed:250,showSpinner:true,barSelector:'[role="bar"]',spinnerSelector:'[role="spinner"]',parent:"body",template:'<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'};NProgress.configure=function(options){var key,value;for(key in options){value=options[key];if(value!==undefined&&options.hasOwnProperty(key)){Settings[key]=value}}return this};NProgress.status=null;NProgress.set=function(n){var started=NProgress.isStarted();n=clamp(n,Settings.minimum,1);NProgress.status=(n===1?null:n);var progress=NProgress.render(!started),bar=progress.querySelector(Settings.barSelector),speed=Settings.speed,ease=Settings.easing;progress.offsetWidth;queue(function(next){if(Settings.positionUsing===""){Settings.positionUsing=NProgress.getPositioningCSS()}css(bar,barPositionCSS(n,speed,ease));if(n===1){css(progress,{transition:"none",opacity:1});progress.offsetWidth;setTimeout(function(){css(progress,{transition:"all "+speed+"ms linear",opacity:0});setTimeout(function(){NProgress.remove();next()},speed)},speed)}else{setTimeout(next,speed)}});return this};NProgress.isStarted=function(){return typeof NProgress.status==="number"};NProgress.start=function(){if(!NProgress.status){NProgress.set(0)}var work=function(){setTimeout(function(){if(!NProgress.status){return}NProgress.trickle();work()},Settings.trickleSpeed)};if(Settings.trickle){work()}return this};NProgress.done=function(force){if(!force&&!NProgress.status){return this}return NProgress.inc(0.3+0.5*Math.random()).set(1)};NProgress.inc=function(amount){var n=NProgress.status;if(!n){return NProgress.start()}else{if(n>1){return}else{if(typeof amount!=="number"){if(n>=0&&n<0.25){amount=(Math.random()*(5-3+1)+3)/100}else{if(n>=0.25&&n<0.65){amount=(Math.random()*3)/100}else{if(n>=0.65&&n<0.9){amount=(Math.random()*2)/100}else{if(n>=0.9&&n<0.99){amount=0.005}else{amount=0}}}}}n=clamp(n+amount,0,0.994);return NProgress.set(n)}}};NProgress.trickle=function(){return NProgress.inc()};(function(){var initial=0,current=0;NProgress.promise=function($promise){if(!$promise||$promise.state()==="resolved"){return this}if(current===0){NProgress.start()}initial++;current++;$promise.always(function(){current--;if(current===0){initial=0;NProgress.done()}else{NProgress.set((initial-current)/initial)}});return this}})();NProgress.render=function(fromStart){if(NProgress.isRendered()){return document.getElementById("nprogress")}addClass(document.documentElement,"nprogress-busy");var progress=document.createElement("div");progress.id="nprogress";progress.innerHTML=Settings.template;var bar=progress.querySelector(Settings.barSelector),perc=fromStart?"-100":toBarPerc(NProgress.status||0),parent=document.querySelector(Settings.parent),spinner;css(bar,{transition:"all 0 linear",transform:"translate3d("+perc+"%,0,0)"});if(!Settings.showSpinner){spinner=progress.querySelector(Settings.spinnerSelector);spinner&&removeElement(spinner)}if(parent!=document.body){addClass(parent,"nprogress-custom-parent")}parent.appendChild(progress);return progress};NProgress.remove=function(){removeClass(document.documentElement,"nprogress-busy");removeClass(document.querySelector(Settings.parent),"nprogress-custom-parent");var progress=document.getElementById("nprogress");progress&&removeElement(progress)};NProgress.isRendered=function(){return !!document.getElementById("nprogress")};NProgress.getPositioningCSS=function(){var bodyStyle=document.body.style;var vendorPrefix=("WebkitTransform" in bodyStyle)?"Webkit":("MozTransform" in bodyStyle)?"Moz":("msTransform" in bodyStyle)?"ms":("OTransform" in bodyStyle)?"O":"";if(vendorPrefix+"Perspective" in bodyStyle){return"translate3d"}else{if(vendorPrefix+"Transform" in bodyStyle){return"translate"}else{return"margin"}}};function clamp(n,min,max){if(n<min){return min}if(n>max){return max}return n}function toBarPerc(n){return(-1+n)*100}function barPositionCSS(n,speed,ease){var barCSS;if(Settings.positionUsing==="translate3d"){barCSS={transform:"translate3d("+toBarPerc(n)+"%,0,0)"}}else{if(Settings.positionUsing==="translate"){barCSS={transform:"translate("+toBarPerc(n)+"%,0)"}}else{barCSS={"margin-left":toBarPerc(n)+"%"}}}barCSS.transition="all "+speed+"ms "+ease;return barCSS}var queue=(function(){var pending=[];function next(){var fn=pending.shift();if(fn){fn(next)}}return function(fn){pending.push(fn);if(pending.length==1){next()}}})();var css=(function(){var cssPrefixes=["Webkit","O","Moz","ms"],cssProps={};function camelCase(string){return string.replace(/^-ms-/,"ms-").replace(/-([\da-z])/gi,function(match,letter){return letter.toUpperCase()})}function getVendorProp(name){var style=document.body.style;
    if(name in style){return name}var i=cssPrefixes.length,capName=name.charAt(0).toUpperCase()+name.slice(1),vendorName;while(i--){vendorName=cssPrefixes[i]+capName;if(vendorName in style){return vendorName}}return name}function getStyleProp(name){name=camelCase(name);return cssProps[name]||(cssProps[name]=getVendorProp(name))}function applyCss(element,prop,value){prop=getStyleProp(prop);element.style[prop]=value}return function(element,properties){var args=arguments,prop,value;if(args.length==2){for(prop in properties){value=properties[prop];if(value!==undefined&&properties.hasOwnProperty(prop)){applyCss(element,prop,value)}}}else{applyCss(element,args[1],args[2])}}})();function hasClass(element,name){var list=typeof element=="string"?element:classList(element);return list.indexOf(" "+name+" ")>=0}function addClass(element,name){var oldList=classList(element),newList=oldList+name;if(hasClass(oldList,name)){return}element.className=newList.substring(1)}function removeClass(element,name){var oldList=classList(element),newList;if(!hasClass(element,name)){return}newList=oldList.replace(" "+name+" "," ");element.className=newList.substring(1,newList.length-1)}function classList(element){return(" "+(element&&element.className||"")+" ").replace(/\s+/gi," ")}function removeElement(element){element&&element.parentNode&&element.parentNode.removeChild(element)}return NProgress});


//ie.js//
(function(window){function classReg(className){return new RegExp("(^|\\s+)"+className+"(\\s+|$)")}var hasClass,addClass,removeClass;if("classList" in document.documentElement){hasClass=function(elem,c){return elem.classList.contains(c)};addClass=function(elem,c){elem.classList.add(c)};removeClass=function(elem,c){elem.classList.remove(c)}}else{hasClass=function(elem,c){return classReg(c).test(elem.className)};addClass=function(elem,c){if(!hasClass(elem,c)){elem.className=elem.className+" "+c}};removeClass=function(elem,c){elem.className=elem.className.replace(classReg(c)," ")}}function toggleClass(elem,c){var fn=hasClass(elem,c)?removeClass:addClass;fn(elem,c)}window.classie={hasClass:hasClass,addClass:addClass,removeClass:removeClass,toggleClass:toggleClass,has:hasClass,add:addClass,remove:removeClass,toggle:toggleClass}})(window);


//侧边栏//
(function(){document.addEventListener("touchstart",touchSatrtFunc,false);document.addEventListener("touchmove",touchMoveFunc,false);var effect="st-effect-3";var container=document.getElementById("st-container");var eventtype=mobilecheck()?"touchstart":"click";function hasParentClass(e,classname){if(e===document){return false}if(classie.has(e,classname)){return true}return e.parentNode&&hasParentClass(e.parentNode,classname)}function mobilecheck(){var check=false;(function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))){check=true}})(navigator.userAgent||navigator.vendor||window.opera);return check}function resetMenu(){classie.remove(container,"st-menu-open")}function bodyClickFn(evt){if(!hasParentClass(evt.target,"st-menu")){resetMenu();document.removeEventListener(eventtype,bodyClickFn)}}function openMenu(ev){ev.stopPropagation();ev.preventDefault();container.className="st-container";classie.add(container,effect);setTimeout(function(){classie.add(container,"st-menu-open")},25);document.addEventListener(eventtype,bodyClickFn)}function init(){var buttons=Array.prototype.slice.call(document.querySelectorAll("#st-trigger-effects > button"));buttons.forEach(function(el,i){el.addEventListener(eventtype,function(ev){openMenu(ev)})})}init();function touchSatrtFunc(evt){try{var touch=evt.touches[0];var x=Number(touch.pageX);var y=Number(touch.pageY);startX=x;startY=y}catch(e){alert("touchSatrtFunc："+e.message)}}function touchMoveFunc(evt){try{var touch=evt.touches[0];var x=Number(touch.pageX);var y=Number(touch.pageY);if(x>startX&&(x-startX>120)){container.className="st-container";classie.add(container,effect);setTimeout(function(){classie.add(container,"st-menu-open")},25);document.addEventListener(eventtype,bodyClickFn)}}catch(e){alert("touchMoveFunc："+e.message)}}})();


// js cookie //
(function(factory){if(typeof define==="function"&&define.amd){define(["jquery"],factory)}else{if(typeof exports==="object"){module.exports=factory(require("jquery"))}else{factory(jQuery)}}}(function($){var pluses=/\+/g;function encode(s){return config.raw?s:encodeURIComponent(s)}function decode(s){return config.raw?s:decodeURIComponent(s)}function stringifyCookieValue(value){return encode(config.json?JSON.stringify(value):String(value))}function parseCookieValue(s){if(s.indexOf('"')===0){s=s.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\")}try{s=decodeURIComponent(s.replace(pluses," "));return config.json?JSON.parse(s):s}catch(e){}}function read(s,converter){var value=config.raw?s:parseCookieValue(s);return $.isFunction(converter)?converter(value):value}var config=$.cookie=function(key,value,options){if(arguments.length>1&&!$.isFunction(value)){options=$.extend({},config.defaults,options);if(typeof options.expires==="number"){var days=options.expires,t=options.expires=new Date();t.setMilliseconds(t.getMilliseconds()+days*86400000)}return(document.cookie=[encode(key),"=",stringifyCookieValue(value),options.expires?"; expires="+options.expires.toUTCString():"",options.path?"; path="+options.path:"",options.domain?"; domain="+options.domain:"",options.secure?"; secure":""].join(""))}var result=key?undefined:{},cookies=document.cookie?document.cookie.split("; "):[],i=0,l=cookies.length;for(;i<l;i++){var parts=cookies[i].split("="),name=decode(parts.shift()),cookie=parts.join("=");if(key===name){result=read(cookie,value);break}if(!key&&(cookie=read(cookie))!==undefined){result[name]=cookie}}return result};config.defaults={};$.removeCookie=function(key,options){$.cookie(key,"",$.extend({},options,{expires:-1}));return !$.cookie(key)}}));


// pjax.js //
(function($){function fnPjax(selector,container,options){var context=this;return this.on("click.pjax",selector,function(event){var opts=$.extend({},optionsFor(container,options));if(!opts.container){opts.container=$(this).attr("data-pjax")||context}handleClick(event,opts)})}function handleClick(event,container,options){options=optionsFor(container,options);var link=event.currentTarget;if(link.tagName.toUpperCase()!=="A"){throw"$.fn.pjax or $.pjax.click requires an anchor element"}if(event.which>1||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey){return}if(location.protocol!==link.protocol||location.hostname!==link.hostname){return}if(link.href.indexOf("#")>-1&&stripHash(link)==stripHash(location)){return}if(event.isDefaultPrevented()){return}var defaults={url:link.href,container:$(link).attr("data-pjax"),target:link};var opts=$.extend({},defaults,options);var clickEvent=$.Event("pjax:click");$(link).trigger(clickEvent,[opts]);if(!clickEvent.isDefaultPrevented()){pjax(opts);event.preventDefault();$(link).trigger("pjax:clicked",[opts])}}function handleSubmit(event,container,options){options=optionsFor(container,options);var form=event.currentTarget;if(form.tagName.toUpperCase()!=="FORM"){throw"$.pjax.submit requires a form element"}var defaults={type:form.method.toUpperCase(),url:form.action,container:$(form).attr("data-pjax"),target:form};if(defaults.type!=="GET"&&window.FormData!==undefined){defaults.data=new FormData(form);defaults.processData=false;defaults.contentType=false}else{if($(form).find(":file").length){return}defaults.data=$(form).serializeArray()}pjax($.extend({},defaults,options));event.preventDefault()}function pjax(options){options=$.extend(true,{},$.ajaxSettings,pjax.defaults,options);if($.isFunction(options.url)){options.url=options.url()}var target=options.target;var hash=parseURL(options.url).hash;var context=options.context=findContainerFor(options.container);if(!options.data){options.data={}}if($.isArray(options.data)){options.data.push({name:"_pjax",value:context.selector})}else{options.data._pjax=context.selector}function fire(type,args,props){if(!props){props={}}props.relatedTarget=target;var event=$.Event(type,props);context.trigger(event,args);return !event.isDefaultPrevented()}var timeoutTimer;options.beforeSend=function(xhr,settings){if(settings.type!=="GET"){settings.timeout=0}xhr.setRequestHeader("X-PJAX","true");xhr.setRequestHeader("X-PJAX-Container",context.selector);if(!fire("pjax:beforeSend",[xhr,settings])){return false}if(settings.timeout>0){timeoutTimer=setTimeout(function(){if(fire("pjax:timeout",[xhr,options])){xhr.abort("timeout")}},settings.timeout);settings.timeout=0}var url=parseURL(settings.url);if(hash){url.hash=hash}options.requestUrl=stripInternalParams(url)};options.complete=function(xhr,textStatus){if(timeoutTimer){clearTimeout(timeoutTimer)}fire("pjax:complete",[xhr,textStatus,options]);fire("pjax:end",[xhr,options])};options.error=function(xhr,textStatus,errorThrown){var container=extractContainer("",xhr,options);var allowed=fire("pjax:error",[xhr,textStatus,errorThrown,options]);if(options.type=="GET"&&textStatus!=="abort"&&allowed){locationReplace(container.url)}};options.success=function(data,status,xhr){var previousState=pjax.state;var currentVersion=(typeof $.pjax.defaults.version==="function")?$.pjax.defaults.version():$.pjax.defaults.version;var latestVersion=xhr.getResponseHeader("X-PJAX-Version");var container=extractContainer(data,xhr,options);var url=parseURL(container.url);if(hash){url.hash=hash;container.url=url.href}if(currentVersion&&latestVersion&&currentVersion!==latestVersion){locationReplace(container.url);return}if(!container.contents){locationReplace(container.url);return}pjax.state={id:options.id||uniqueId(),url:container.url,title:container.title,container:context.selector,fragment:options.fragment,timeout:options.timeout};if(options.push||options.replace){window.history.replaceState(pjax.state,container.title,container.url)}try{document.activeElement.blur()}catch(e){}if(container.title){document.title=container.title}fire("pjax:beforeReplace",[container.contents,options],{state:pjax.state,previousState:previousState});context.html(container.contents);var autofocusEl=context.find("input[autofocus], textarea[autofocus]").last()[0];if(autofocusEl&&document.activeElement!==autofocusEl){autofocusEl.focus()}executeScriptTags(container.scripts);var scrollTo=options.scrollTo;if(hash){var name=decodeURIComponent(hash.slice(1));var target=document.getElementById(name)||document.getElementsByName(name)[0];if(target){scrollTo=$(target).offset().top}}if(typeof scrollTo=="number"){$(window).scrollTop(scrollTo)}fire("pjax:success",[data,status,xhr,options])};if(!pjax.state){pjax.state={id:uniqueId(),url:window.location.href,title:document.title,container:context.selector,fragment:options.fragment,timeout:options.timeout};
    window.history.replaceState(pjax.state,document.title)}abortXHR(pjax.xhr);pjax.options=options;var xhr=pjax.xhr=$.ajax(options);if(xhr.readyState>0){if(options.push&&!options.replace){cachePush(pjax.state.id,cloneContents(context));window.history.pushState(null,"",options.requestUrl)}fire("pjax:start",[xhr,options]);fire("pjax:send",[xhr,options])}return pjax.xhr}function pjaxReload(container,options){var defaults={url:window.location.href,push:false,replace:true,scrollTo:false};return pjax($.extend(defaults,optionsFor(container,options)))}function locationReplace(url){window.history.replaceState(null,"",pjax.state.url);window.location.replace(url)}var initialPop=true;var initialURL=window.location.href;var initialState=window.history.state;if(initialState&&initialState.container){pjax.state=initialState}if("state" in window.history){initialPop=false}function onPjaxPopstate(event){if(!initialPop){abortXHR(pjax.xhr)}var previousState=pjax.state;var state=event.state;var direction;if(state&&state.container){if(initialPop&&initialURL==state.url){return}if(previousState){if(previousState.id===state.id){return}direction=previousState.id<state.id?"forward":"back"}var cache=cacheMapping[state.id]||[];var container=$(cache[0]||state.container),contents=cache[1];if(container.length){if(previousState){cachePop(direction,previousState.id,cloneContents(container))}var popstateEvent=$.Event("pjax:popstate",{state:state,direction:direction});container.trigger(popstateEvent);var options={id:state.id,url:state.url,container:container,push:false,fragment:state.fragment,timeout:state.timeout,scrollTo:false};if(contents){container.trigger("pjax:start",[null,options]);pjax.state=state;if(state.title){document.title=state.title}var beforeReplaceEvent=$.Event("pjax:beforeReplace",{state:state,previousState:previousState});container.trigger(beforeReplaceEvent,[contents,options]);container.html(contents);container.trigger("pjax:end",[null,options])}else{pjax(options)}container[0].offsetHeight}else{locationReplace(location.href)}}initialPop=false}function fallbackPjax(options){var url=$.isFunction(options.url)?options.url():options.url,method=options.type?options.type.toUpperCase():"GET";var form=$("<form>",{method:method==="GET"?"GET":"POST",action:url,style:"display:none"});if(method!=="GET"&&method!=="POST"){form.append($("<input>",{type:"hidden",name:"_method",value:method.toLowerCase()}))}var data=options.data;if(typeof data==="string"){$.each(data.split("&"),function(index,value){var pair=value.split("=");form.append($("<input>",{type:"hidden",name:pair[0],value:pair[1]}))})}else{if($.isArray(data)){$.each(data,function(index,value){form.append($("<input>",{type:"hidden",name:value.name,value:value.value}))})}else{if(typeof data==="object"){var key;for(key in data){form.append($("<input>",{type:"hidden",name:key,value:data[key]}))}}}}$(document.body).append(form);form.submit()}function abortXHR(xhr){if(xhr&&xhr.readyState<4){xhr.onreadystatechange=$.noop;xhr.abort()}}function uniqueId(){return(new Date).getTime()}function cloneContents(container){var cloned=container.clone();cloned.find("script").each(function(){if(!this.src){jQuery._data(this,"globalEval",false)}});return[container.selector,cloned.contents()]}function stripInternalParams(url){url.search=url.search.replace(/([?&])(_pjax|_)=[^&]*/g,"");return url.href.replace(/\?($|#)/,"$1")}function parseURL(url){var a=document.createElement("a");a.href=url;return a}function stripHash(location){return location.href.replace(/#.*/,"")}function optionsFor(container,options){if(container&&options){options.container=container}else{if($.isPlainObject(container)){options=container}else{options={container:container}}}if(options.container){options.container=findContainerFor(options.container)}return options}function findContainerFor(container){container=$(container);if(!container.length){throw"no pjax container for "+container.selector}else{if(container.selector!==""&&container.context===document){return container}else{if(container.attr("id")){return $("#"+container.attr("id"))}else{throw"cant get selector for pjax container!"}}}}function findAll(elems,selector){return elems.filter(selector).add(elems.find(selector))}function parseHTML(html){return $.parseHTML(html,document,true)}function extractContainer(data,xhr,options){var obj={},fullDocument=/<html/i.test(data);var serverUrl=xhr.getResponseHeader("X-PJAX-URL");obj.url=serverUrl?stripInternalParams(parseURL(serverUrl)):options.requestUrl;if(fullDocument){var $head=$(parseHTML(data.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0]));var $body=$(parseHTML(data.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0]))}else{var $head=$body=$(parseHTML(data))}if($body.length===0){return obj}obj.title=findAll($head,"title").last().text();if(options.fragment){if(options.fragment==="body"){var $fragment=$body}else{var $fragment=findAll($body,options.fragment).first()}if($fragment.length){obj.contents=options.fragment==="body"?$fragment:$fragment.contents();if(!obj.title){obj.title=$fragment.attr("title")||$fragment.data("title")
}}}else{if(!fullDocument){obj.contents=$body}}if(obj.contents){obj.contents=obj.contents.not(function(){return $(this).is("title")});obj.contents.find("title").remove();obj.scripts=findAll(obj.contents,"script[src]").remove();obj.contents=obj.contents.not(obj.scripts)}if(obj.title){obj.title=$.trim(obj.title)}return obj}function executeScriptTags(scripts){if(!scripts){return}var existingScripts=$("script[src]");scripts.each(function(){var src=this.src;var matchedScripts=existingScripts.filter(function(){return this.src===src});if(matchedScripts.length){return}var script=document.createElement("script");var type=$(this).attr("type");if(type){script.type=type}script.src=$(this).attr("src");document.head.appendChild(script)})}var cacheMapping={};var cacheForwardStack=[];var cacheBackStack=[];function cachePush(id,value){cacheMapping[id]=value;cacheBackStack.push(id);trimCacheStack(cacheForwardStack,0);trimCacheStack(cacheBackStack,pjax.defaults.maxCacheLength)}function cachePop(direction,id,value){var pushStack,popStack;cacheMapping[id]=value;if(direction==="forward"){pushStack=cacheBackStack;popStack=cacheForwardStack}else{pushStack=cacheForwardStack;popStack=cacheBackStack}pushStack.push(id);if(id=popStack.pop()){delete cacheMapping[id]}trimCacheStack(pushStack,pjax.defaults.maxCacheLength)}function trimCacheStack(stack,length){while(stack.length>length){delete cacheMapping[stack.shift()]}}function findVersion(){return $("meta").filter(function(){var name=$(this).attr("http-equiv");return name&&name.toUpperCase()==="X-PJAX-VERSION"}).attr("content")}function enable(){$.fn.pjax=fnPjax;$.pjax=pjax;$.pjax.enable=$.noop;$.pjax.disable=disable;$.pjax.click=handleClick;$.pjax.submit=handleSubmit;$.pjax.reload=pjaxReload;$.pjax.defaults={timeout:650,push:true,replace:false,type:"GET",dataType:"html",scrollTo:0,maxCacheLength:20,version:findVersion};$(window).on("popstate.pjax",onPjaxPopstate)}function disable(){$.fn.pjax=function(){return this};$.pjax=fallbackPjax;$.pjax.enable=enable;$.pjax.disable=$.noop;$.pjax.click=$.noop;$.pjax.submit=$.noop;$.pjax.reload=function(){window.location.reload()};$(window).off("popstate.pjax",onPjaxPopstate)}if($.inArray("state",$.event.props)<0){$.event.props.push("state")}$.support.pjax=window.history&&window.history.pushState&&window.history.replaceState&&!navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/);$.support.pjax?enable():disable()})(jQuery);


//动画
!function(){var a=0;$.fn.scrolled=function(i,n){"function"==typeof i&&(n=i,i=200);var t="scrollTimer"+a++;this.scroll(function(){var a=$(this),o=a.data(t);o&&clearTimeout(o),o=setTimeout(function(){a.removeData(t),n.call(a[0])},i),a.data(t,o)})},$.fn.AniView=function(a){function i(a){var i=$(a).offset(),t=i.top+$(a).position().top,o=(i.top+$(a).position().top+$(a).height(),$("#st-content").position().top+$("#st-content").height());if(t<o-n.animateThreshold){return !0}else{return !1}}var n=$.extend({animateThreshold:-600,scrollPollInterval:0},a),t=this;$(t).each(function(a,i){$(i).wrap('<div class="av-container"></div>'),$(i).css("opacity",0)}),$(t).each(function(a,n){var t=$(n).parent(".av-container");$(n).is("[av-animation]")&&!$(t).hasClass("av-visible")&&i(t)&&($(n).css("opacity",1),$(t).addClass("av-visible"),$(n).addClass("animated "+$(n).attr("av-animation")))}),$("#st-content").scrolled(n.scrollPollInterval,function(){$(t).each(function(a,n){var t=$(n).parent(".av-container");$(n).is("[av-animation]")&&!$(t).hasClass("av-visible")&&i(t)&&($(n).css("opacity",1),$(t).addClass("av-visible"),$(n).addClass("animated "+$(n).attr("av-animation")))})})}}();


