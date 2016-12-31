// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.18/esri/copyright.txt for details.
//>>built
define("esri/PopupManager","./geometry/Extent ./geometry/ScreenPoint ./kernel ./layerUtils ./tasks/query dijit/registry dojo/_base/array dojo/_base/declare dojo/_base/Deferred dojo/_base/lang dojo/has dojo/on dojo/promise/all dojo/Stateful require".split(" "),function(E,x,F,D,G,H,g,t,u,w,I,J,K,L,M){var y;t=t(L,{declaredClass:"esri.PopupManager",enabled:!1,map:null,_mapClickHandle:null,_featureLayersCache:{},constructor:function(a){this._mapClickHandler=w.hitch(this,this._mapClickHandler)},setMap:function(a){if(this.map)if(a!==
this.map)this.unsetMap();else return;this.map=a;this._setupClickHandler()},unsetMap:function(){this.map&&(this.map=null);this._mapClickHandle&&(this._mapClickHandle.remove(),this._mapClickHandle=null)},getMapLayer:function(a){var c;if(a&&(c=a.getLayer()))if(a=c.id,this._featureLayersCache[a]){var b=a.lastIndexOf("_");-1<b&&(a=a.substring(0,b),c=this.map.getLayer(a))}return c},_enabledSetter:function(a){this.enabled=a;this._setupClickHandler()},_setupClickHandler:function(){this._mapClickHandle&&(this._mapClickHandle.remove(),
this._mapClickHandle=null);this.enabled&&this.map&&(this._mapClickHandle=this.map.on("click",this._mapClickHandler))},_mapClickHandler:function(a){var c=this.map.infoWindow,b=a.graphic;c&&this.map.loaded&&(c.clearFeatures&&c.setFeatures?this._showPopup(a):b&&b.getInfoTemplate()&&this._showInfoWindow(b,a.mapPoint))},_showPopup:function(a){var c=this.map,b=c.infoWindow,d=this,l=[],f=[c.graphics].concat(g.map(c.graphicsLayerIds,c.getLayer,c));g.forEach(f,function(a){a&&(a.loaded&&a.infoTemplate&&!a.suspended)&&
l.push(a)});var q=[];g.forEach(c.layerIds,function(a){(a=c.getLayer(a))&&(a.loaded&&!a.suspended)&&(d._isImageServiceLayer(a)&&a.infoTemplate?l.push(a):"esri.layers.WMSLayer"===a.declaredClass&&a.getFeatureInfoURL?l.push(a):("esri.layers.ArcGISDynamicMapServiceLayer"===a.declaredClass||"esri.layers.ArcGISTiledMapServiceLayer"===a.declaredClass)&&a.infoTemplates&&q.push(a))});this._getSubLayerFeatureLayers(q).then(function(f){l=l.concat(f);f=null;a.graphic&&(a.graphic.getInfoTemplate()&&!d._isImageServiceLayer(a.graphic._layer))&&
(f=a.graphic);if(l.length||f){var k=d._calculateClickTolerance(l),s=a.screenPoint,e=c.toMap(new x(s.x-k,s.y+k)),k=c.toMap(new x(s.x+k,s.y-k)),m=new E(e.x,e.y,k.x,k.y,c.spatialReference);if(m=m.intersects(c.extent)){var n=new G,p=!!f,q=!0,e=g.map(l,function(b){var e;n.timeExtent=b.useMapTime?c.timeExtent:null;if(d._isImageServiceLayer(b))n.geometry=a.mapPoint,q=!1,e=b.queryVisibleRasters(n,{rasterAttributeTableFieldPrefix:"Raster.",returnDomainValues:!0}),e.addCallback(function(){var a=b.getVisibleRasters();
p=p||0<a.length;return a});else if("esri.layers.WMSLayer"===b.declaredClass){e=new u;var f=b._getPopupGraphic(c,a.screenPoint);f?(e.resolve([f]),p=!0):e.resolve([])}else d._featureLayersCache[b.id]||"function"===typeof b.queryFeatures&&(0===b.currentMode||1===b.currentMode)?(n.geometry=m,e=b.queryFeatures(n),e.addCallback(function(a){a=a.features;a=g.filter(a,function(a){return a.visible});p=p||0<a.length;return a})):(e=new u,f=g.filter(b.graphics,function(a){return a&&a.visible&&m.intersects(a.geometry)}),
p=p||0<f.length,e.resolve(f));return e});f&&(k=new u,k.resolve([f]),e.unshift(k));!g.some(e,function(a){return!a.isFulfilled()})&&!p?(b.hide(),b.clearFeatures()):(b.setFeatures(e),b.show(a.mapPoint,{closestFirst:q}))}}})},_getSubLayerFeatureLayers:function(a,c){var b=c||new u,d=[],l=a.length,f=Math.floor(this.map.extent.getWidth()/this.map.width),q=this.map.getScale(),t=!1,k=this,s=0;a:for(;s<l;s++){var e=a[s],m=e.dynamicLayerInfos||e.layerInfos;if(m){var n=null;if(e._params&&(e._params.layers||e._params.dynamicLayers))n=
e.visibleLayers;for(var n=D._getVisibleLayers(m,n),p=D._getLayersForScale(q,m),x=m.length,A=0;A<x;A++){var z=m[A],r=z.id,v=e.infoTemplates[r];if(!z.subLayerIds&&v&&v.infoTemplate&&-1<g.indexOf(n,r)&&-1<g.indexOf(p,r)){if(!y){t=!0;break a}var B=e.id+"_"+r,h=this._featureLayersCache[B];if(!h||!h.loadError)h||((h=v.layerUrl)||(h=z.source?this._getLayerUrl(e.url,"/dynamicLayer"):this._getLayerUrl(e.url,r)),h=new y(h,{id:B,drawMode:!1,mode:y.MODE_SELECTION,outFields:this._getOutFields(v.infoTemplate),
resourceInfo:v.resourceInfo,source:z.source}),this._featureLayersCache[B]=h),h.setDefinitionExpression(e.layerDefinitions&&e.layerDefinitions[r]),h.setGDBVersion(e.gdbVersion),h.setInfoTemplate(v.infoTemplate),h.setMaxAllowableOffset(f),h.setUseMapTime(!!e.useMapTime),e.layerDrawingOptions&&(e.layerDrawingOptions[r]&&e.layerDrawingOptions[r].renderer)&&h.setRenderer(e.layerDrawingOptions[r].renderer),d.push(h)}}}}if(t){var w=new u;M(["./layers/FeatureLayer"],function(a){y=a;w.resolve()});w.then(function(){k._getSubLayerFeatureLayers(a,
b)})}else{var C=[];g.forEach(d,function(a){if(!a.loaded){var b=new u;J.once(a,"load, error",function(){b.resolve()});C.push(b.promise)}});C.length?K(C).then(function(){d=g.filter(d,function(a){return!a.loadError&&a.isVisibleAtScale(q)});b.resolve(d)}):(d=g.filter(d,function(a){return a.isVisibleAtScale(q)}),b.resolve(d))}return b.promise},_getLayerUrl:function(a,c){var b=a.indexOf("?");return-1===b?a+"/"+c:a.substring(0,b)+"/"+c+a.substring(b)},_getOutFields:function(a){var c;a.info&&"esri.dijit.PopupTemplate"===
a.declaredClass?(c=[],g.forEach(a.info.fieldInfos,function(a){var d=a.fieldName&&a.fieldName.toLowerCase();d&&("shape"!==d&&0!==d.indexOf("relationships/"))&&c.push(a.fieldName)})):c=["*"];return c},_calculateClickTolerance:function(a){var c=6,b,d;g.forEach(a,function(a){if(b=a.renderer)"esri.renderer.SimpleRenderer"===b.declaredClass?((d=b.symbol)&&d.xoffset&&(c=Math.max(c,Math.abs(d.xoffset))),d&&d.yoffset&&(c=Math.max(c,Math.abs(d.yoffset)))):("esri.renderer.UniqueValueRenderer"===b.declaredClass||
"esri.renderer.ClassBreaksRenderer"===b.declaredClass)&&g.forEach(b.infos,function(a){(d=a.symbol)&&d.xoffset&&(c=Math.max(c,Math.abs(d.xoffset)));d&&d.yoffset&&(c=Math.max(c,Math.abs(d.yoffset)))})});return c},_showInfoWindow:function(a,c){var b=this.map.infoWindow,d=a.geometry,d=d&&"point"===d.type?d:c,g=a.getContent();b.setTitle(a.getTitle());if(g&&w.isString(g.id)){var f=H.byId(g.id);f&&(f.set&&/_PopupRenderer/.test(f.declaredClass))&&f.set("showTitle",!1)}b.setContent(g);b.show(d)},_isImageServiceLayer:function(a){return"esri.layers.ArcGISImageServiceLayer"===
a.declaredClass||"esri.layers.ArcGISImageServiceVectorLayer"===a.declaredClass}});I("extend-esri")&&(F.PopupManager=t);return t});