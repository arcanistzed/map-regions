!function(e){function o(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,o),r.l=!0,r.exports}var t={};o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,function(o){return e[o]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,o){return Object.prototype.hasOwnProperty.call(e,o)},o.p="./",o(o.s=0)}([function(){var e,o,t=!0,n=[],r=[],i=!1,a="",l=0,c=null;$(window).load((function(){s.initCanvas(),$("#create-polygon").click((function(){s.polygon.drawPolygon()})),$("#set-prefix").click((function(){a=window.prompt("Input an area label prefix (e.g. 'A'):")})),$("#set-increment").click((function(){l=window.prompt("Input a value to incrementate by (e.g. '1' or '-1'):"),c=window.prompt("Input an integer start value (e.g. '5'):")})),$("#export").click((function(){for(var e={mapRegions:[]},t=o.toJSON().objects,n=0;n<t.length;n++)e.mapRegions.push({area:"",points:[]}),t[n].objects[0].points.forEach((function(o){e.mapRegions[n].points.push([o.x,o.y])})),e.mapRegions[n].area=t[n].objects[1].text;window.prompt("Copy this to your clipboard",JSON.stringify(e))}))}));var s=new function(){this.initCanvas=function(){(o=window._canvas=new fabric.Canvas("c")).selection=!1,o.on("mouse:down",(function(e){e.target&&e.target.id==n[0].id&&s.polygon.generatePolygon(n),t&&s.polygon.addPoint(e)})),o.on("mouse:move",(function(t){if(e&&"line"==e.class){var r=o.getPointer(t.e);e.set({x2:r.x,y2:r.y});var a=i.get("points");a[n.length]={x:r.x,y:r.y},i.set({points:a}),o.renderAll()}o.renderAll()}))}};s.polygon={drawPolygon:function(){t=!0,n=[],r=[]},addPoint:function(t){var a=Math.floor(999901*Math.random())+99,l=(new Date).getTime()+a,c=new fabric.Circle({radius:5,fill:"#ffffff",stroke:"#333333",strokeWidth:.5,left:t.e.layerX/o.getZoom(),top:t.e.layerY/o.getZoom(),selectable:!1,hasBorders:!1,hasControls:!1,originX:"center",originY:"center",id:l,objectCaching:!1});0==n.length&&c.set({fill:"red"});var s=[t.e.layerX/o.getZoom(),t.e.layerY/o.getZoom(),t.e.layerX/o.getZoom(),t.e.layerY/o.getZoom()],f=new fabric.Line(s,{strokeWidth:2,fill:"#999999",stroke:"#999999",class:"line",originX:"center",originY:"center",selectable:!1,hasBorders:!1,hasControls:!1,evented:!1,objectCaching:!1});if(i){var u=o.getPointer(t.e);(s=i.get("points")).push({x:u.x,y:u.y});var d=new fabric.Polygon(s,{stroke:"#333333",strokeWidth:1,fill:"#cccccc",opacity:.3,selectable:!1,hasBorders:!1,hasControls:!1,evented:!1,objectCaching:!1});o.remove(i),o.add(d),i=d,o.renderAll()}else{var p=[{x:t.e.layerX/o.getZoom(),y:t.e.layerY/o.getZoom()}];d=new fabric.Polygon(p,{stroke:"#337ab7",strokeWidth:2,fill:"#337ab760",opacity:.5,selectable:!1,hasBorders:!1,hasControls:!1,evented:!1,objectCaching:!1});i=d,o.add(d)}e=f,n.push(c),r.push(f),o.add(f),o.add(c),o.selection=!1},generatePolygon:function(n){var s=[];$.each(n,(function(e,t){s.push({x:t.left,y:t.top}),o.remove(t)})),$.each(r,(function(e,t){o.remove(t)})),o.remove(i).remove(e);var f,u=new fabric.Polygon(s,{stroke:"#337ab7",strokeWidth:2,fill:"#337ab760",opacity:1,hasBorders:!0,hasControls:!0});0===l?f=a+window.prompt("What area is this?"):(f=a+c,c+=l);var d=new fabric.Text(f,{left:u.left+u.width/2,top:u.top+u.height/2}),p=new fabric.Group([u,d],{});o.add(p),e=null,i=null,t=!1,o.selection=!0}}}]);
//# sourceMappingURL=app.js.map