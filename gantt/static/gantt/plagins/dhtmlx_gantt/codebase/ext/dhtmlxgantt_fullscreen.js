/*
@license

dhtmlxGantt v.6.3.4 Professional Evaluation
This software is covered by DHTMLX Evaluation License. Contact sales@dhtmlx.com to get Commercial or Enterprise license. Usage without proper license is prohibited.

(c) XB Software Ltd.

*/
Gantt.plugin(function(e){!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define("ext/dhtmlxgantt_fullscreen",[],n):"object"==typeof exports?exports["ext/dhtmlxgantt_fullscreen"]=n():e["ext/dhtmlxgantt_fullscreen"]=n()}(window,function(){return function(e){var n={};function t(l){if(n[l])return n[l].exports;var o=n[l]={i:l,l:!1,exports:{}};return e[l].call(o.exports,o,o.exports,t),o.l=!0,o.exports}return t.m=e,t.c=n,t.d=function(e,n,l){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:l})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var l=Object.create(null);if(t.r(l),Object.defineProperty(l,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(l,o,function(n){return e[n]}.bind(null,o));return l},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="/codebase/",t(t.s=258)}({258:function(n,t){function l(){var e=document.fullscreenElement||document.mozFullScreenElement||document.webkitFullscreenElement||document.msFullscreenElement;return!(!e||e!==document.body)}e.$services.getService("state").registerProvider("fullscreen",function(){return{fullscreen:l()}});var o={overflow:null,padding:null,paddingTop:null,paddingRight:null,paddingBottom:null,paddingLeft:null},d={width:null,height:null,top:null,left:null,position:null,zIndex:null,modified:!1},i=null;function u(e,n){n.width=e.width,n.height=e.height,n.top=e.top,n.left=e.left,n.position=e.position,n.zIndex=e.zIndex}var r=!1;function s(){var n;e.$container&&(l()?r&&(n="onExpand",function(){var n=e.ext.fullscreen.getFullscreenElement(),t=document.body;u(n.style,d),o={overflow:t.style.overflow,padding:t.style.padding?t.style.padding:null,paddingTop:t.style.paddingTop?t.style.paddingTop:null,paddingRight:t.style.paddingRight?t.style.paddingRight:null,paddingBottom:t.style.paddingBottom?t.style.paddingBottom:null,paddingLeft:t.style.paddingLeft?t.style.paddingLeft:null},t.style.padding&&(t.style.padding="0"),t.style.paddingTop&&(t.style.paddingTop="0"),t.style.paddingRight&&(t.style.paddingRight="0"),t.style.paddingBottom&&(t.style.paddingBottom="0"),t.style.paddingLeft&&(t.style.paddingLeft="0"),t.style.overflow="hidden",n.style.width="100vw",n.style.height="100vh",n.style.top="0px",n.style.left="0px",n.style.position="absolute",n.style.zIndex=1,d.modified=!0,i=function(e){for(var n=e.parentNode,t=[];n&&n.style;)t.push({element:n,originalPositioning:n.style.position}),n.style.position="static",n=n.parentNode;return t}(n)}()):r&&(r=!1,n="onCollapse",function(){var n=e.ext.fullscreen.getFullscreenElement(),t=document.body;d.modified&&(o.padding&&(t.style.padding=o.padding),o.paddingTop&&(t.style.paddingTop=o.paddingTop),o.paddingRight&&(t.style.paddingRight=o.paddingRight),o.paddingBottom&&(t.style.paddingBottom=o.paddingBottom),o.paddingLeft&&(t.style.paddingLeft=o.paddingLeft),t.style.overflow=o.overflow,o={overflow:null,padding:null,paddingTop:null,paddingRight:null,paddingBottom:null,paddingLeft:null},u(d,n.style),d.modified=!1),function(e){e.forEach(function(e){e.element.style.position=e.originalPositioning})}(i),i=null}()),setTimeout(function(){e.render()}),setTimeout(function(){e.callEvent(n,[e.ext.fullscreen.getFullscreenElement()])}))}function c(){return!e.$container||(!e.ext.fullscreen.getFullscreenElement()||!(document.fullscreenEnabled||document.webkitFullscreenEnabled||document.mozFullScreenEnabled||document.msFullscreenEnabled)&&((console.warning||console.log)("The `fullscreen` feature not being allowed, or full-screen mode not being supported"),!0))}e.ext.fullscreen={expand:function(){if(!c()&&!l()&&e.callEvent("onBeforeExpand",[this.getFullscreenElement()])){r=!0;var n=document.body,t=n.webkitRequestFullscreen?[Element.ALLOW_KEYBOARD_INPUT]:[],o=n.msRequestFullscreen||n.mozRequestFullScreen||n.webkitRequestFullscreen||n.requestFullscreen;o&&o.apply(n,t)}},collapse:function(){if(!c()&&l()&&e.callEvent("onBeforeCollapse",[this.getFullscreenElement()])){var n=document.msExitFullscreen||document.mozCancelFullScreen||document.webkitExitFullscreen||document.exitFullscreen;n&&n.apply(document)}},toggle:function(){c()||(l()?this.collapse():this.expand())},getFullscreenElement:function(){return e.$root}},e.expand=function(){e.ext.fullscreen.expand()},e.collapse=function(){e.ext.fullscreen.collapse()},e.attachEvent("onGanttReady",function(){e.event(document,"webkitfullscreenchange",s),e.event(document,"mozfullscreenchange",s),e.event(document,"MSFullscreenChange",s),e.event(document,"fullscreenChange",s),e.event(document,"fullscreenchange",s)})}})})});