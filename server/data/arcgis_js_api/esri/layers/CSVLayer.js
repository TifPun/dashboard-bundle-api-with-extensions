// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.18/esri/copyright.txt for details.
//>>built
require({cache:{"esri/arcgis/csv":function(){define("dojo/_base/lang dojo/_base/array dojo/_base/Deferred dojo/sniff dojo/number dojox/data/CsvStore ../kernel ../config ../request ../SpatialReference ../geometry/jsonUtils ../geometry/webMercatorUtils".split(" "),function(m,c,h,p,l,g,a,e,f,b,d,n){function k(a){var b=0,d="";c.forEach([","," ",";","|","\t"],function(e){var f=a.split(e).length;f>b&&(b=f,d=e)});return d}function C(a,b){if(!a||"[object Date]"!==Object.prototype.toString.call(a)||isNaN(a.getTime()))return!1;
var d=!0;if(p("chrome")&&/\d+\W*$/.test(b)){var e=b.match(/[a-zA-Z]{2,}/);if(e){for(var d=!1,f=0,c=e.length,k=/^((jan(uary)?)|(feb(ruary)?)|(mar(ch)?)|(apr(il)?)|(may)|(jun(e)?)|(jul(y)?)|(aug(ust)?)|(sep(tember)?)|(oct(ober)?)|(nov(ember)?)|(dec(ember)?)|(am)|(pm)|(gmt)|(utc))$/i;!d&&f<=c&&!(d=!k.test(e[f]));)f++;d=!d}}return d}function y(a,b,d){var e=a.indexOf("\n"),e=m.trim(a.substr(0,e)),f=b.columnDelimiter;f||(f=k(e));var n=new g({data:a,separator:f});n.fetch({onComplete:function(a,e){var f=
0,k={layerDefinition:b.layerDefinition,featureSet:{features:[],geometryType:"esriGeometryPoint"}},x=k.layerDefinition.objectIdField,g=k.layerDefinition.fields;!x&&!c.some(g,function(a){return"esriFieldTypeOID"===a.type?(x=a.name,!0):!1})&&(g.push({name:"__OBJECTID",alias:"__OBJECTID",type:"esriFieldTypeOID",editable:!1}),x="__OBJECTID");var q,h,v=n._attributes,p=[],w=[];c.forEach(g,function(a){"esriFieldTypeDate"===a.type?p.push(a.name):("esriFieldTypeDouble"===a.type||"esriFieldTypeInteger"===a.type)&&
w.push(a.name)});b.locationInfo&&"coordinates"===b.locationInfo.locationType?(q=b.locationInfo.latitudeFieldName,h=b.locationInfo.longitudeFieldName):c.forEach(v,function(a){var b;b=c.indexOf(z,a.toLowerCase());-1!==b&&(q=a);b=c.indexOf(A,a.toLowerCase());-1!==b&&(h=a)});if(!q||!h)setTimeout(function(){console.error("File does not seem to contain fields with point coordinates.")},1),d&&d(null,Error("File does not seem to contain fields with point coordinates."));else{-1===c.indexOf(w,q)&&w.push(q);
-1===c.indexOf(w,h)&&w.push(h);var t;m.isArray(b.outFields)&&-1===c.indexOf(b.outFields,"*")&&(t=b.outFields);c.forEach(v,function(a){c.some(g,function(b){return a===b.name})||g.push({name:a,alias:a,type:a===q||a===h?"esriFieldTypeDouble":"esriFieldTypeString"})});var v=0,y=a.length;for(v;v<y;v++){var r=a[v],u=n.getAttributes(r),s={};c.forEach(u,function(a){if(a&&(a===q||a===h||!t||-1<c.indexOf(t,a))){var b=a;0===a.length&&c.forEach(g,function(b,d){b.name==="attribute_"+(d-1)&&(a="attribute_"+(d-
1))});if(-1<c.indexOf(p,a)){var b=n.getValue(r,b),d=new Date(b);s[a]=C(d,b)?d.getTime():null}else if(-1<c.indexOf(w,a)){d=l.parse(n.getValue(r,b));if((a===q||a===h)&&(isNaN(d)||181<Math.abs(d)))d=parseFloat(n.getValue(r,b));isNaN(d)?s[a]=null:s[a]=d}else s[a]=n.getValue(r,b)}});s[x]=f;f++;var u=s[q],B=s[h];null==B||(null==u||isNaN(u)||isNaN(B))||(t&&-1===c.indexOf(t,q)&&delete s[q],t&&-1===c.indexOf(t,h)&&delete s[h],k.featureSet.features.push({geometry:{x:B,y:u,spatialReference:{wkid:4326}},attributes:s}))}k.layerDefinition.name=
"csv";d&&d(k)}},onError:function(a){console.error("Error fetching items from CSV store: ",a);d&&d(null,a)}});return!0}function q(a,b,f,k,g,q){0===a.length&&g(null);var l=d.getGeometryType(b),h=[];c.forEach(a,function(a){a=new l(a);a.spatialReference=f;h.push(a)},this);b=[102113,102100,3857];f.wkid&&4326===f.wkid&&k.wkid&&-1<c.indexOf(b,k.wkid)?(c.forEach(h,function(a){a.xmin?(a.xmin=Math.max(a.xmin,-180),a.xmax=Math.min(a.xmax,180),a.ymin=Math.max(a.ymin,-89.99),a.ymax=Math.min(a.ymax,89.99)):a.rings?
c.forEach(a.rings,function(a){c.forEach(a,function(a){a[0]=Math.min(Math.max(a[0],-180),180);a[1]=Math.min(Math.max(a[1],-89.99),89.99)},this)},this):a.paths?c.forEach(a.paths,function(a){c.forEach(a,function(a){a[0]=Math.min(Math.max(a[0],-180),180);a[1]=Math.min(Math.max(a[1],-89.99),89.99)},this)},this):a.x&&(a.x=Math.min(Math.max(a.x,-180),180),a.y=Math.min(Math.max(a.y,-89.99),89.99))},this),a=[],c.forEach(h,function(b){b=n.geographicToWebMercator(b);102100!==k.wkid&&(b.spatialReference=k);a.push(b.toJson())},
this),g(a)):null!==f.wkid&&-1<c.indexOf(b,f.wkid)&&null!==k.wkid&&4326===k.wkid?(a=[],c.forEach(h,function(b){a.push(n.webMercatorToGeographic(b).toJson())},this),g(a)):(b=function(b,d){b&&b.length===a.length?(a=[],c.forEach(b,function(b){b&&(b.rings&&0<b.rings.length&&0<b.rings[0].length&&0<b.rings[0][0].length&&!isNaN(b.rings[0][0][0])&&!isNaN(b.rings[0][0][1])||b.paths&&0<b.paths.length&&0<b.paths[0].length&&0<b.paths[0][0].length&&!isNaN(b.paths[0][0][0])&&!isNaN(b.paths[0][0][1])||b.xmin&&!isNaN(b.xmin)&&
b.ymin&&!isNaN(b.ymin)||b.x&&!isNaN(b.x)&&b.y&&!isNaN(b.y))?a.push(b.toJson()):a.push(null)},this),g(a)):q(b,d)},e.defaults.geometryService?e.defaults.geometryService.project(h,k,m.hitch(this,b),q):g(null))}function t(a,b){var d=[102113,102100,3857];return a&&b&&a.wkid===b.wkid&&a.wkt===b.wkt||a&&b&&a.wkid&&b.wkid&&-1<c.indexOf(d,a.wkid)&&-1<c.indexOf(d,b.wkid)?!0:!1}function r(a,e,f,k){if(a.featureSet&&0!==a.featureSet.features.length)if(t(f,e))k(a);else{var g,n=function(b){var d=[];c.forEach(a.featureSet.features,
function(a,e){b[e]&&(a.geometry=b[e],d.push(a))},this);k(a)},l=function(b,d){console.error("error projecting featureSet ("+a.layerDefinition.name+"). Final try.");k(a)},h=function(b,d){console.error("error projecting featureSet ("+a.layerDefinition.name+"). Try one more time.");q(g,a.featureSet.geometryType,e,f,m.hitch(this,n),m.hitch(this,l))};a.featureSet.features&&0<a.featureSet.features.length?(g=[],c.forEach(a.featureSet.features,function(b){if(b.geometry.toJson)g.push(b.geometry);else{var e=
d.getGeometryType(a.featureSet.geometryType);g.push(new e(b.geometry))}}),e.toJson||(e=new b(e)),f.toJson||(f=new b(f)),q(g,a.featureSet.geometryType,e,f,m.hitch(this,n),m.hitch(this,h))):k(a)}}var z="lat latitude y ycenter latitude83 latdecdeg point-y lat_dd".split(" "),A="lon lng long longitude x xcenter longitude83 longdecdeg point-x long_dd".split(" "),u={latFieldStrings:z,longFieldStrings:A,buildCSVFeatureCollection:function(a){var b=new h,d=function(a,d){d?b.errback(d):b.callback(a)},e={url:a.url,
handleAs:"text",load:function(b){y(b,a,m.hitch(this,d))},error:function(a){b.errback(a);console.error("error: "+a)}};-1<a.url.indexOf("arcgis.com")&&(-1<a.url.indexOf("/content/items")&&-1<a.url.indexOf("/data"))&&(e.headers={"Content-Type":""});f(e,{usePost:!1});return b},projectFeatureCollection:function(a,d,e){var f=new h;e||(e=new b({wkid:4326}));r(a,e,d,m.hitch(this,function(a){f.callback(a)}));return f},generateDefaultPopupInfo:function(a){var b={esriFieldTypeDouble:1,esriFieldTypeSingle:1},
d={esriFieldTypeInteger:1,esriFieldTypeSmallInteger:1},e={esriFieldTypeDate:1},f=null;a=c.map(a.layerDefinition.fields,m.hitch(this,function(a){"NAME"===a.name.toUpperCase()&&(f=a.name);var k="esriFieldTypeOID"!==a.type&&"esriFieldTypeGlobalID"!==a.type&&"esriFieldTypeGeometry"!==a.type,g=null;if(k){var c=a.name.toLowerCase();if(-1<",stretched value,fnode_,tnode_,lpoly_,rpoly_,poly_,subclass,subclass_,rings_ok,rings_nok,".indexOf(","+c+",")||-1<c.indexOf("area")||-1<c.indexOf("length")||-1<c.indexOf("shape")||
-1<c.indexOf("perimeter")||-1<c.indexOf("objectid")||c.indexOf("_")===c.length-1||c.indexOf("_i")===c.length-2&&1<c.length)k=!1;a.type in d?g={places:0,digitSeparator:!0}:a.type in b?g={places:2,digitSeparator:!0}:a.type in e&&(g={dateFormat:"shortDateShortTime"})}return m.mixin({},{fieldName:a.name,label:a.alias,isEditable:!0,tooltip:"",visible:k,format:g,stringFieldOption:"textbox"})}));return{title:f?"{"+f+"}":"",fieldInfos:a,description:null,showAttachments:!1,mediaInfos:[]}},_getSeparator:k,
_isValidDate:C,_processCsvData:y,_projectGeometries:q,_sameSpatialReference:t,_projectFeatureSet:r};p("extend-esri")&&m.setObject("arcgis.csv",u,a);return u})},"dojox/data/CsvStore":function(){define("dojo/_base/lang dojo/_base/declare dojo/_base/xhr dojo/_base/kernel dojo/data/util/filter dojo/data/util/simpleFetch".split(" "),function(m,c,h,p,l,g){c=c("dojox.data.CsvStore",null,{constructor:function(a){this._attributes=[];this._attributeIndexes={};this._dataArray=[];this._arrayOfAllItems=[];this._loadFinished=
!1;a.url&&(this.url=a.url);this._csvData=a.data;a.label?this.label=a.label:""===this.label&&(this.label=void 0);this._storeProp="_csvStore";this._idProp="_csvId";this._features={"dojo.data.api.Read":!0,"dojo.data.api.Identity":!0};this._loadInProgress=!1;this._queuedFetches=[];this.identifier=a.identifier;""===this.identifier?delete this.identifier:this._idMap={};"separator"in a&&(this.separator=a.separator);"urlPreventCache"in a&&(this.urlPreventCache=a.urlPreventCache?!0:!1)},url:"",label:"",identifier:"",
separator:",",urlPreventCache:!1,_assertIsItem:function(a){if(!this.isItem(a))throw Error(this.declaredClass+": a function was passed an item argument that was not an item");},_getIndex:function(a){a=this.getIdentity(a);this.identifier&&(a=this._idMap[a]);return a},getValue:function(a,e,f){this._assertIsItem(a);var b=f;if("string"===typeof e)e=this._attributeIndexes[e],null!=e&&(b=this._dataArray[this._getIndex(a)][e]||f);else throw Error(this.declaredClass+": a function was passed an attribute argument that was not a string");
return b},getValues:function(a,e){var f=this.getValue(a,e);return f?[f]:[]},getAttributes:function(a){this._assertIsItem(a);var e=[];a=this._dataArray[this._getIndex(a)];for(var f=0;f<a.length;f++)""!==a[f]&&e.push(this._attributes[f]);return e},hasAttribute:function(a,e){this._assertIsItem(a);if("string"===typeof e){var f=this._attributeIndexes[e],b=this._dataArray[this._getIndex(a)];return"undefined"!==typeof f&&f<b.length&&""!==b[f]}throw Error(this.declaredClass+": a function was passed an attribute argument that was not a string");
},containsValue:function(a,e,f){var b=void 0;"string"===typeof f&&(b=l.patternToRegExp(f,!1));return this._containsValue(a,e,f,b)},_containsValue:function(a,e,f,b){a=this.getValues(a,e);for(e=0;e<a.length;++e){var d=a[e];if("string"===typeof d&&b)return null!==d.match(b);if(f===d)return!0}return!1},isItem:function(a){if(a&&a[this._storeProp]===this)if(a=a[this._idProp],this.identifier){if(this._dataArray[this._idMap[a]])return!0}else if(0<=a&&a<this._dataArray.length)return!0;return!1},isItemLoaded:function(a){return this.isItem(a)},
loadItem:function(a){},getFeatures:function(){return this._features},getLabel:function(a){if(this.label&&this.isItem(a))return this.getValue(a,this.label)},getLabelAttributes:function(a){return this.label?[this.label]:null},_fetchItems:function(a,e,f){var b=this,d=function(a,d){var f=null;if(a.query){var c,k,f=[],g=a.queryOptions?a.queryOptions.ignoreCase:!1,n={};for(c in a.query)k=a.query[c],"string"===typeof k&&(n[c]=l.patternToRegExp(k,g));for(g=0;g<d.length;++g){var h=!0,m=d[g];for(c in a.query)k=
a.query[c],b._containsValue(m,c,k,n[c])||(h=!1);h&&f.push(m)}}else f=d.slice(0,d.length);e(f,a)};if(this._loadFinished)d(a,this._arrayOfAllItems);else if(""!==this.url)if(this._loadInProgress)this._queuedFetches.push({args:a,filter:d});else{this._loadInProgress=!0;var c=h.get({url:b.url,handleAs:"text",preventCache:b.urlPreventCache});c.addCallback(function(e){try{b._processData(e),d(a,b._arrayOfAllItems),b._handleQueuedFetches()}catch(c){f(c,a)}});c.addErrback(function(d){b._loadInProgress=!1;if(f)f(d,
a);else throw d;});var k=null;a.abort&&(k=a.abort);a.abort=function(){c&&-1===c.fired&&c.cancel();k&&k.call(a)}}else if(this._csvData)try{this._processData(this._csvData),this._csvData=null,d(a,this._arrayOfAllItems)}catch(g){f(g,a)}else{var m=Error(this.declaredClass+": No CSV source data was provided as either URL or String data input.");if(f)f(m,a);else throw m;}},close:function(a){},_getArrayOfArraysFromCsvFileContents:function(a){if(m.isString(a)){var e=RegExp("^\\s+","g"),f=RegExp("\\s+$","g"),
b=RegExp('""',"g"),d=[],c=this._splitLines(a);for(a=0;a<c.length;++a){var k=c[a];if(0<k.length){for(var k=k.split(this.separator),g=0;g<k.length;){var l=k[g].replace(e,""),h=l.replace(f,""),p=h.charAt(0),r=h.charAt(h.length-1),z=h.charAt(h.length-2),A=h.charAt(h.length-3);if(2===h.length&&'""'==h)k[g]="";else if('"'==p&&('"'!=r||'"'==r&&'"'==z&&'"'!=A)){if(g+1===k.length)return;k[g]=l+this.separator+k[g+1];k.splice(g+1,1)}else'"'==p&&'"'==r&&(h=h.slice(1,h.length-1),h=h.replace(b,'"')),k[g]=h,g+=
1}d.push(k)}}this._attributes=d.shift();for(a=0;a<this._attributes.length;a++)this._attributeIndexes[this._attributes[a]]=a;this._dataArray=d}},_splitLines:function(a){var e=[],f,b="",d=!1;for(f=0;f<a.length;f++){var c=a.charAt(f);switch(c){case '"':d=!d;b+=c;break;case "\r":d?b+=c:(e.push(b),b="",f<a.length-1&&"\n"==a.charAt(f+1)&&f++);break;case "\n":d?b+=c:(e.push(b),b="");break;default:b+=c}}""!==b&&e.push(b);return e},_processData:function(a){this._getArrayOfArraysFromCsvFileContents(a);this._arrayOfAllItems=
[];if(this.identifier&&void 0===this._attributeIndexes[this.identifier])throw Error(this.declaredClass+": Identity specified is not a column header in the data set.");for(a=0;a<this._dataArray.length;a++){var e=a;this.identifier&&(e=this._dataArray[a][this._attributeIndexes[this.identifier]],this._idMap[e]=a);this._arrayOfAllItems.push(this._createItemFromIdentity(e))}this._loadFinished=!0;this._loadInProgress=!1},_createItemFromIdentity:function(a){var e={};e[this._storeProp]=this;e[this._idProp]=
a;return e},getIdentity:function(a){return this.isItem(a)?a[this._idProp]:null},fetchItemByIdentity:function(a){var e,f=a.scope?a.scope:p.global;if(this._loadFinished)e=this._createItemFromIdentity(a.identity),this.isItem(e)||(e=null),a.onItem&&a.onItem.call(f,e);else{var b=this;if(""!==this.url)this._loadInProgress?this._queuedFetches.push({args:a}):(this._loadInProgress=!0,e=h.get({url:b.url,handleAs:"text"}),e.addCallback(function(d){try{b._processData(d);var e=b._createItemFromIdentity(a.identity);
b.isItem(e)||(e=null);a.onItem&&a.onItem.call(f,e);b._handleQueuedFetches()}catch(c){a.onError&&a.onError.call(f,c)}}),e.addErrback(function(b){this._loadInProgress=!1;a.onError&&a.onError.call(f,b)}));else if(this._csvData)try{b._processData(b._csvData),b._csvData=null,e=b._createItemFromIdentity(a.identity),b.isItem(e)||(e=null),a.onItem&&a.onItem.call(f,e)}catch(d){a.onError&&a.onError.call(f,d)}}},getIdentityAttributes:function(a){return this.identifier?[this.identifier]:null},_handleQueuedFetches:function(){if(0<
this._queuedFetches.length){for(var a=0;a<this._queuedFetches.length;a++){var e=this._queuedFetches[a],c=e.filter,b=e.args;c?c(b,this._arrayOfAllItems):this.fetchItemByIdentity(e.args)}this._queuedFetches=[]}}});m.extend(c,g);return c})},"dojo/data/util/filter":function(){define(["../../_base/lang"],function(m){var c={};m.setObject("dojo.data.util.filter",c);c.patternToRegExp=function(c,m){for(var l="^",g=null,a=0;a<c.length;a++)switch(g=c.charAt(a),g){case "\\":l+=g;a++;l+=c.charAt(a);break;case "*":l+=
".*";break;case "?":l+=".";break;case "$":case "^":case "/":case "+":case ".":case "|":case "(":case ")":case "{":case "}":case "[":case "]":l+="\\";default:l+=g}l+="$";return m?RegExp(l,"mi"):RegExp(l,"m")};return c})},"dojo/data/util/simpleFetch":function(){define(["../../_base/lang","../../_base/kernel","./sorter"],function(m,c,h){var p={};m.setObject("dojo.data.util.simpleFetch",p);p.errorHandler=function(h,g){g.onError&&g.onError.call(g.scope||c.global,h,g)};p.fetchHandler=function(l,g){var a=
g.abort||null,e=!1,f=g.start?g.start:0,b=g.count&&Infinity!==g.count?f+g.count:l.length;g.abort=function(){e=!0;a&&a.call(g)};var d=g.scope||c.global;g.store||(g.store=this);g.onBegin&&g.onBegin.call(d,l.length,g);g.sort&&l.sort(h.createSortFunction(g.sort,this));if(g.onItem)for(var n=f;n<l.length&&n<b;++n){var k=l[n];e||g.onItem.call(d,k,g)}g.onComplete&&!e&&(n=null,g.onItem||(n=l.slice(f,b)),g.onComplete.call(d,n,g))};p.fetch=function(c){c=c||{};c.store||(c.store=this);this._fetchItems(c,m.hitch(this,
"fetchHandler"),m.hitch(this,"errorHandler"));return c};return p})},"dojo/data/util/sorter":function(){define(["../../_base/lang"],function(m){var c={};m.setObject("dojo.data.util.sorter",c);c.basicComparator=function(c,m){var l=-1;null===c&&(c=void 0);null===m&&(m=void 0);if(c==m)l=0;else if(c>m||null==c)l=1;return l};c.createSortFunction=function(h,m){function l(a,b,d,c){return function(e,f){var g=c.getValue(e,a),h=c.getValue(f,a);return b*d(g,h)}}for(var g=[],a,e=m.comparatorMap,f=c.basicComparator,
b=0;b<h.length;b++){a=h[b];var d=a.attribute;if(d){a=a.descending?-1:1;var n=f;e&&("string"!==typeof d&&"toString"in d&&(d=d.toString()),n=e[d]||f);g.push(l(d,a,n,m))}}return function(a,b){for(var d=0;d<g.length;){var c=g[d++](a,b);if(0!==c)return c}return 0}};return c})},"*noref":1}});
define("esri/layers/CSVLayer","dojo/_base/array dojo/_base/declare dojo/_base/lang dojo/has ../kernel ../arcgis/csv ./FeatureLayer ../geometry/Extent ../tasks/FeatureSet".split(" "),function(m,c,h,p,l,g,a,e,f){c=c(a,{declaredClass:"esri.layers.CSVLayer",_preventInit:!0,_fieldTypeMap:{Date:"esriFieldTypeDate",Number:"esriFieldTypeDouble",String:"esriFieldTypeString"},constructor:function(a,d){this.url=a;d=h.mixin({},d);this.columnDelimiter=d.columnDelimiter;this.latitudeFieldName=d.latitudeFieldName;
this.longitudeFieldName=d.longitudeFieldName;var c=d.layerDefinition;c||(c={fields:d.fields||[],geometryType:"esriGeometryPoint",copyrightText:d.copyright},d.fields&&m.forEach(d.fields,function(a){a.type=this._fieldTypeMap[a.type||"String"];a.alias||(a.alias=a.name)},this));this._buildCsvFcParam={url:this.url,columnDelimiter:this.columnDelimiter,layerDefinition:c,outFields:d.outFields};this.latitudeFieldName&&this.longitudeFieldName&&(this._buildCsvFcParam.locationInfo={locationType:"coordinates",
latitudeFieldName:this.latitudeFieldName,longitudeFieldName:this.longitudeFieldName});this._projectFeatures=h.hitch(this,this._projectFeatures);this._addFeatures=h.hitch(this,this._addFeatures);this._initCSVLayer(d)},refresh:function(){this._fireUpdateStart();this.applyEdits(null,null,this.graphics);this._loadFeatures()},_setMap:function(a){var d=this.inherited(arguments);this._fireUpdateStart();this._projectFeatures(this._csvFC).then(this._addFeatures).otherwise(this._errorHandler);this._csvFC=null;
return d},_initCSVLayer:function(a){var d=this;g.buildCSVFeatureCollection(this._buildCsvFcParam).then(function(c){d._csvFC=c;var e=c.layerDefinition;e.extent=d._getFCExtent(c);a.outFields||(a.outFields=["*"]);d._initFeatureLayer({layerDefinition:e},a)}).otherwise(this._errorHandler)},_loadFeatures:function(){g.buildCSVFeatureCollection(this._buildCsvFcParam).then(this._projectFeatures).then(this._addFeatures).otherwise(this._errorHandler)},_projectFeatures:function(a){return g.projectFeatureCollection(a,
this._map.spatialReference)},_addFeatures:function(a){a=new f(a.featureSet);this.applyEdits(a.features,null,null);this._fireUpdateEnd()},_getFCExtent:function(a){var c;if(a&&a.featureSet&&a.featureSet.features){a=a.featureSet.features;var f=a.length;if(1<f){var g=a[0].geometry;c=new e(g.x,g.y,g.x,g.y);for(f-=1;0<f;f--)g=a[f].geometry,c.xmin=Math.min(c.xmin,g.x),c.ymin=Math.min(c.ymin,g.y),c.xmax=Math.max(c.xmax,g.x),c.ymax=Math.max(c.ymax,g.y);0>=c.getWidth()&&0>=c.getHeight()&&(c=null)}}return c}});
p("extend-esri")&&h.setObject("layers.CSVLayer",c,l);return c});