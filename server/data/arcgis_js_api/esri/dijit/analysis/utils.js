// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.18/esri/copyright.txt for details.
//>>built
define("esri/dijit/analysis/utils","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/_base/event dojo/_base/json dojo/dom-attr dojo/has dojo/i18n dojo/io-query dojo/i18n!../../nls/jsapi dojo/json dojo/string dojo/query dojo/date/locale dojo/dom-style dojo/dom-class dojo/dom-construct dojo/Deferred dojo/number dojo/_base/window dojo/when dojo/dom dojo/on dojo/data/ItemFileWriteStore dojo/topic dijit/registry dijit/Dialog dijit/form/CheckBox ../../kernel ../../lang ../../units ../../request ./HelpWindow ../../tasks/query ../../dijit/BrowseItems ../../layers/FeatureLayer ./PluginAnalysisLayers ../../tasks/Geoprocessor ../../dijit/SingleFilter ./FeatureRecordSetLayer ./PluginLayers ../../layers/ArcGISImageServiceLayer".split(" "),
function(x,g,p,$,I,J,B,K,aa,L,r,A,l,t,C,u,M,q,D,y,N,E,ba,O,P,ca,Q,R,F,S,k,e,G,T,U,V,W,da,X,ea,Y,fa,Z){x={};g.mixin(x,{_helpDialog:null,i18n:null,UNITSMAP:{Feet:"esriFeet",Yards:"esriYards",Miles:"esriMiles",Meters:"esriMeters",Kilometers:"esriKilometers",NauticalMiles:"esriNauticalMiles"},initHelpLinks:function(a,b,d){this._helpDialog||(this._helpDialog=new T);if(a){var c=Q.byNode(a),f=c?c.get("helpFileName"):d&&d.helpFileName?d.helpFileName:null,h=c?c.get("isSingleTenant"):d&&d.isSingleTenant?d.isSingleTenant:
!1,s="standard";c&&(c.showGeoAnalyticsParams||c.showBigData)||d&&d.analysisMode&&"bigdata"===d.analysisMode?(f+="_bd",s="bigdata"):d&&(d.analysisMode&&"raster"===d.analysisMode)&&(f+="_ra",s="raster");t("[esriHelpTopic]",a).forEach(function(c,e,n){c&&(u.set(c,"display",!k.isDefined(b)||!0===b?"":"none"),k.isDefined(c._helpClickHandler)&&(c._helpClickHandler.remove(),c._helpClickHandler=null),c._helpClickHandler=O(c,"click",g.hitch(this,function(b){I.stop(b);this._helpDialog.show(b,{helpId:B.get(c,
"esriHelpTopic"),helpFileName:f,analysisGpServer:d&&d.analysisGpServer?d.analysisGpServer:null,helpParentNode:a,isPortal:h,analysisMode:s})})))},this)}},constructAnalysisFeatColl:function(a){var b={},d;b.featureCollection=a.layerDefinition;for(d in b.featureCollection)b.featureCollection.hasOwnProperty(d)&&"objectIdField"===d&&(b.featureCollection.objectIdFieldName=g.clone(b.featureCollection.objectIdField),delete b.featureCollection.objectIdField);b.featureCollection.features=a.featureSet.features;
return b},constructAnalysisInputLyrObj:function(a,b){var d={},c,f,h;a.getMap?f=a.getMap():a._map&&(f=a._map);if(a.url&&!a._collection){d={url:a.url};c=this.isHostedService(a.url);h=10.2<=a.version&&a._useStandardizedQueries;a.getDefinitionExpression&&a.getDefinitionExpression()?d.filter=a.getDefinitionExpression():k.isDefined(a.definitionExpression)&&""!==a.definitionExpression&&(d.filter=a.definitionExpression);if(a.useMapTime&&a.timeInfo&&f&&f.timeExtent&&(h||c||10.2<=a.version)&&!b)h="",a.timeInfo.startTimeField&&
!a.timeInfo.endTimeField?(f.timeExtent.startTime&&(h=a.timeInfo.startTimeField+" \x3e "+(c?"":"timestamp ")+"'"+this.formatDate(f.timeExtent.startTime)+"'"),f.timeExtent.endTime&&(f.timeExtent.startTime&&(h+=" AND "),h+=a.timeInfo.startTimeField+" \x3c "+(c?"":"timestamp ")+"'"+this.formatDate(f.timeExtent.endTime)+"'")):!a.timeInfo.startTimeField&&a.timeInfo.endTimeField?(f.timeExtent.startTime&&(h=a.timeInfo.endTimeField+" \x3e "+(c?"":"timestamp ")+"'"+this.formatDate(f.timeExtent.startTime)+"'"),
f.timeExtent.endTime&&(f.timeExtent.startTime&&(h+=" AND "),h+=a.timeInfo.endTimeField+" \x3c "+(c?"":"timestamp ")+"'"+this.formatDate(f.timeExtent.endTime)+"'")):a.timeInfo.startTimeField&&a.timeInfo.endTimeField&&(f.timeExtent.startTime&&(h=a.timeInfo.startTimeField+" \x3e "+(c?"":"timestamp ")+"'"+this.formatDate(f.timeExtent.startTime)+"'"),f.timeExtent.endTime&&(f.timeExtent.startTime&&(h+=" AND "),h+=a.timeInfo.endTimeField+" \x3c "+(c?"":"timestamp ")+"'"+this.formatDate(f.timeExtent.endTime)+
"'")),d.filter=d.filter?d.filter+(" AND "+h):h;a.credential&&(d.serviceToken=a.credential.token);-1!==d.url.indexOf("?")&&(c=d.url.substring(d.url.indexOf("?")+1,d.url.length),c=L.queryToObject(c),g.mixin(d,c),d.url=d.url.substring(0,d.url.indexOf("?")))}else if(!a.url||a._collection)try{d=a.toJson()}catch(s){a._json=A.parse(a._json),d=a.toJson()}b&&(d=new Y(d));return d},formatDate:function(a){return C.format(a,{datePattern:"yyyy-MM-dd",selector:"date"})+" "+C.format(a,{selector:"time",timePattern:"HH:mm:ss"})},
isHostedService:function(a){if(!a)return!1;var b=-1!==a.indexOf(".arcgis.com/");a=-1!==a.indexOf("//services")||-1!==a.indexOf("//tiles")||-1!==a.indexOf("//features");return b&&a},isTimeEnabled:function(a){var b=10.2<=a.version&&a._useStandardizedQueries;return a.useMapTime&&a.timeInfo&&(b||10.2<=a.version)||k.isDefined(a.time)},isTimeInstantLayer:function(a){return k.isDefined(a.timeInfo)&&k.isDefined(a.timeInfo.startTimeField)&&!k.isDefined(a.timeInfo.endTimeField)||k.isDefined(a.time)&&k.isDefined(a.time.timeType)&&
"instant"===a.time.timeType},buildReport:function(a,b){var d="";b||(b={},g.mixin(b,r.analysisMsgCodes));p.forEach(a,function(a,f){var h,s,e;"string"===typeof a.message?(h=k.isDefined(b[a.messageCode])?b[a.messageCode]:a.message,d+=a.style.substring(0,a.style.indexOf("\x3c/"))+(!this._isEmptyObject(a.params)?l.substitute(h,a.params):h)+a.style.substring(a.style.indexOf("\x3c/"))):g.isArray(a.message)&&(e=[],s=g.clone(a.style),p.forEach(a.message,function(d,f){s=s.replace(/<\//,"${"+f+"}");h=k.isDefined(b[a.messageCode+
"_"+f])?b[a.messageCode+"_"+f]:d;h=!this._isEmptyObject(a.params)?l.substitute(h,a.params):h;e.push(h+"\x3c/")},this),s=l.substitute(s,e),d+=s)},this);return d},getLayerFeatureCount:function(a,b){var d=new U;d.geometry=b.geometry||"";d.where=b.where||"1\x3d1";d.geometryType=b.geometryType||"esriGeometryEnvelope";return a.queryCount(d)},createPolygonFeatureCollection:function(a){var b;b={layerDefinition:null,featureSet:{features:[],geometryType:"esriGeometryPolygon"}};b.layerDefinition={currentVersion:10.2,
copyrightText:"",defaultVisibility:!0,relationships:[],isDataVersioned:!1,supportsRollbackOnFailureParameter:!0,supportsStatistics:!0,supportsAdvancedQueries:!0,geometryType:"esriGeometryPolygon",minScale:0,maxScale:0,objectIdField:"OBJECTID",templates:[],type:"Feature Layer",displayField:"TITLE",visibilityField:"VISIBLE",name:a,hasAttachments:!1,typeIdField:"TYPEID",capabilities:"Query",allowGeometryUpdates:!0,htmlPopupType:"",hasM:!1,hasZ:!1,globalIdField:"",supportedQueryFormats:"JSON",hasStaticData:!1,
maxRecordCount:-1,indexes:[],types:[],drawingInfo:{renderer:{type:"simple",symbol:{color:[0,0,0,255],outline:{color:[0,0,0,255],width:3,type:"esriSLS",style:"esriSLSSolid"},type:"esriSFS",style:"esriSFSNull"},label:"",description:""},transparency:0,labelingInfo:null,fixedSymbols:!0},fields:[{alias:"OBJECTID",name:"OBJECTID",type:"esriFieldTypeOID",editable:!1},{alias:"Title",name:"TITLE",length:50,type:"esriFieldTypeString",editable:!0},{alias:"Visible",name:"VISIBLE",type:"esriFieldTypeInteger",
editable:!0},{alias:"Description",name:"DESCRIPTION",length:1073741822,type:"esriFieldTypeString",editable:!0},{alias:"Type ID",name:"TYPEID",type:"esriFieldTypeInteger",editable:!0}]};return b},createPointFeatureCollection:function(a){var b;b={layerDefinition:null,featureSet:{features:[],geometryType:"esriGeometryPoint"}};b.layerDefinition={objectIdField:"OBJECTID",templates:[],type:"Feature Layer",drawingInfo:{renderer:{field1:"TYPEID",type:"simple",symbol:{height:24,xoffset:0,yoffset:12,width:24,
contentType:"image/png",type:"esriPMS",url:"http://static.arcgis.com/images/Symbols/Basic/GreenStickpin.png"},description:"",value:"0",label:"Stickpin"}},displayField:"TITLE",visibilityField:"VISIBLE",name:a,hasAttachments:!1,typeIdField:"TYPEID",capabilities:"Query",types:[],geometryType:"esriGeometryPoint",fields:[{alias:"OBJECTID",name:"OBJECTID",type:"esriFieldTypeOID",editable:!1},{alias:"Title",name:"TITLE",length:50,type:"esriFieldTypeString",editable:!0},{alias:"Visible",name:"VISIBLE",type:"esriFieldTypeInteger",
editable:!0},{alias:"Description",name:"DESCRIPTION",length:1073741822,type:"esriFieldTypeString",editable:!0},{alias:"Type ID",name:"TYPEID",type:"esriFieldTypeInteger",editable:!0}]};return b},createFolderStore:function(a,b){var d=new P({data:{identifier:"id",label:"name",items:[]}});d.newItem({name:b,id:""});p.forEach(a,function(a){d.newItem({name:a.title,id:a.id})});return d},setupFoldersUI:function(a){a.folderSelect.set("store",a.folderStore);a.folderSelect.set("required",!0);a.folderSelect.set("searchAttr",
"name");k.isDefined(a.folderId)?a.folderStore.get(a.folderId).then(g.hitch(this,function(b){k.isDefined(b)?a.folderSelect.set("item",b):a.folderStore.get("").then(function(b){a.folderSelect.set("item",b)},this)})):a.folderName?a.folderStore.fetch({query:{name:a.folderName},onComplete:g.hitch(this,function(b){k.isDefined(b)&&0<b.length?a.folderSelect.set("item",b[0]):a.folderStore.get("").then(function(b){a.folderSelect.set("item",b)},this)})}):a.username?a.folderSelect.set("displayedValue",a.username):
a.folderStore.get("").then(function(b){a.folderSelect.set("item",b)},this)},_isEmptyObject:function(a){for(var b in a)if(a.hasOwnProperty(b))return!1;return!0},validateServiceName:function(a,b){var d=/(:|&|<|>|%|#|\?|\\|\"|\/|\+)/.test(a),c=!0,f,h;k.isDefined(b)&&b.textInput&&(h=b.textInput);this.initI18n();0===a.length||0===l.trim(a).length?(f=this.i18n.requiredValue,c=!1):d?(f=this.i18n.invalidServiceName,c=!1):98<a.length?(f=this.i18n.invalidServiceNameLength,c=!1):170<encodeURIComponent(a).length&&
(f=this.i18n.invalidEncodedServiceNameLength,c=!1);h&&!c&&h.set("invalidMessage",f);return c},getStepNumber:function(a){t(".esriAnalysisNumberLabel",a).forEach(function(a,d){var c=this._getNumberLabel(d);B.set(a,"innerHTML",c)},this)},_getNumberLabel:function(a){var b="";this.initI18n();switch(a){case 0:b=this.i18n.oneLabel;break;case 1:b=this.i18n.twoLabel;break;case 2:b=this.i18n.threeLabel;break;case 3:b=this.i18n.fourLabel;break;case 4:b=this.i18n.fiveLabel;break;case 5:b=this.i18n.sixLabel;break;
case 6:b=this.i18n.sevenLabel;break;case 7:b=this.i18n.eightLabel;break;case 8:b=this.i18n.nineLabel}return b},populateAnalysisLayers:function(a,b,d,c){if(a){var f=[],h=a.get(b);a._titleRow&&u.set(a._titleRow,"display","none");a._analysisLabelRow&&u.set(a._analysisLabelRow,"display","table-row");a._selectAnalysisRow&&(u.set(a._selectAnalysisRow,"display","table-row"),M.add(a._analysisSelect.domNode,"esriTrailingMargin3"),u.set(a._analysisSelect.domNode.parentNode,"padding-bottom","1em"));a.domNode&&
this.getStepNumber(a.domNode);k.isDefined(c)&&c.chooseLabel&&f.push({value:-1,label:this.i18n.chooseLabel});if(!k.isDefined(c)||!k.isDefined(c.posIncrement))k.isDefined(c)||(c={}),c.posIncrement=0;p.forEach(a.get(d),function(a,b){b+=c.posIncrement;var d={value:k.isDefined(c)&&c.chooseLabel?b+1:b,label:a.name};h&&a.name===h.name&&(d.selected=!0);f.push(d)},this);a._analysisSelect.addOption(f);a._analysisSelect.set("required",!0)}},isValidAnalysisLayer:function(a){var b,d,c,f,h,e,g,m="",n=!0;b={isValid:n,
validationMessage:m};var w,v,z=0,H=0,q=0,r,t,u;if(!k.isDefined(a)||!k.isDefined(a.toolName))return b;this.initI18n();k.isDefined(this.i18n.cblPointMsg)||(this.i18n.cblPointMsg="You need to have at least one point feature layer to run ${toolName}.");b=a.toolName;d=a.featureLayers;c=a.analysisLayer;f=b.charAt(0).toLowerCase()+b.substring(1);g=this.i18n;a=a.showReadyToUseLayers||!1;p.forEach(d,function(a){a instanceof Z&&(r=!0);r&&1<a.bandCount&&(t=!0);r&&1===a.bandCount&&(u=!0);"esriGeometryPoint"===
a.geometryType&&(e=!0,z++);if("esriGeometryPoint"===a.geometryType||"esriGeometryMultipoint"===a.geometryType)w=!0;"esriGeometryPolyline"===a.geometryType&&(v=!0,q++);"esriGeometryPolygon"===a.geometryType&&(h=!0,H++)},this);-1!==p.indexOf(["CreateDriveTimeAreas","PlanRoutes","ConnectOriginsToDestinations"],b)&&(!e||c&&"esriGeometryPoint"!==c.geometryType)?(m=l.substitute(this.i18n.selectPointLayer,{toolName:g[f]}),n=!1):("AggregatePoints"===b||"InterpolatePoints"===b)&&(c&&!("esriGeometryPoint"===
c.geometryType||"esriGeometryMultipoint"===c.geometryType)||!w)?(m=l.substitute(this.i18n.selectPointLayer,{toolName:g[f]}),n=!1):"CalculateDensity"===b&&(!w&&!v||c&&!("esriGeometryPoint"===c.geometryType||"esriGeometryMultipoint"===c.geometryType||"esriGeometryPolyline"===c.geometryType))?(m=l.substitute(this.i18n.areaFeatureInvalidMsg,{toolName:g[f]}),n=!1):"FindHotSpots"===b&&(!w&&!h||c&&!("esriGeometryPoint"===c.geometryType||"esriGeometryMultipoint"===c.geometryType||"esriGeometryPolygon"===
c.geometryType))?(m=l.substitute(this.i18n.hotspotsLineFeatureMsg,{toolName:g[f]}),n=!1):("OverlayLayers"===b||"AggregatePoints"===b||"SummarizeWithin"===b||"SummarizeNearby"===b||"FindNearest"===b||"MergeLayers"===b)&&!a&&(0===d.length||1===d.length&&(d[0]===c||!k.isDefined(c)))?(m=l.substitute(this.i18n.overlayValidationMsg,{toolName:g[f]}),n=!1):"ConnectOriginsToDestinations"===b&&!a&&(0===d.length||2>z)?(m=l.substitute(this.i18n.odPointMsg,{toolName:g[f]}),n=!1):"ChooseBestFacilities"===b&&(0===
d.length||0===z)?(m=l.substitute(this.i18n.cblPointMsg,{toolName:g[f]}),n=!1):"AggregatePoints"===b&&!a&&1<d.length?(h=p.some(d,function(a){return"esriGeometryPolygon"===a.geometryType}),h||(m=l.substitute(this.i18n.aggregatePolyMsg,{toolName:g[f]}),n=!1)):"MergeLayers"===b&&!a&&1<d.length?1<z||(1<q||1<H)||(m=this.i18n.mergeValidationMsg,n=!1):("SummarizeWithin"===b||"DissolveBoundaries"===b)&&(c&&"esriGeometryPolygon"!==c.geometryType||!h)?(m=l.substitute(this.i18n.selectPolyLayer,{toolName:g[f]}),
n=!1):"ExtractData"===b?(n=p.some(d,function(a){return-1!==a.capabilities.indexOf("Extract")}))||(m=l.substitute(this.i18n.extractValidationMsg)):("ConnectOriginsToDestinations"===b||"ChooseBestFacilities"===b)&&1<d.length?(e=p.some(d,function(a){var b=k.isDefined(c)&&c.id===a.id;return"esriGeometryPoint"===a.geometryType&&!b}),e||(m=l.substitute("ChooseBestFacilities"===b?this.i18n.cblPointMsg:this.i18n.odPointMsg,{toolName:g[f]}),n=!1)):"CalculateSlope"===b||"DeriveAspect"===b||"RemapValues"===
b?r?u||(n=!1,m=l.substitute(this.i18n.noSingleBandISMsg,{toolName:g[f]})):(n=!1,m=l.substitute(this.i18n.noImageServiceMsg,{toolName:g[f]})):"ExtractRaster"===b?r||(n=!1,m=l.substitute(this.i18n.noImageServiceMsg,{toolName:g[f]})):"MonitorVegetation"===b&&(r?t||(n=!1,m=l.substitute(this.i18n.noMultiBandISMsg,{toolName:g[f]})):(n=!1,m=l.substitute(this.i18n.noImageServiceMsg,{toolName:g[f]})));return b={isValid:n,validationMessage:m}},initI18n:function(){this.i18n||(this.i18n={},g.mixin(this.i18n,
r.common),g.mixin(this.i18n,r.analysisTools),g.mixin(this.i18n,r.analysisMsgCodes),g.mixin(this.i18n,r.browseLayersDlg),g.mixin(this.i18n,r.driveTimes))},addBrowseAnalysisDialog:function(a){if(a&&a.widget){this.i18n||this.initI18n();var b="esri/dijit/analysis/PluginAnalysisLayers",d=function(a){return"\x3cimg class\x3d'grid-item galleryThumbnail' width\x3d'120px' height\x3d'80px' alt\x3d'' src\x3d'"+(a.thumbnailUrl||this._portal.staticImagesUrl+"/desktopapp.png")+"'\x3e"},c=function(a){return'\x3cdiv class\x3d"galleryLabelContainer"\x3e\x3cspan alt\x3d\''+
(a.title||a.name||"\x3cNo Title\x3e")+"'\x3e"+(a.title.replace(/_/g," ")||a.name.replace(/_/g," ")||"\x3cNo Title\x3e")+"\x3c/span\x3e\x3c/div\x3e"},f=function(a){return"\x3cimg class\x3d'grid-item-thumb' width\x3d'16px' height\x3d'16px' alt\x3d'' src\x3d'"+a.iconUrl+"'/\x3e"},h=function(a){return"\x3cimg class\x3d'grid-item-thumb' width\x3d'16px' height\x3d'16px' alt\x3d'' src\x3d'"+a.iconUrl+"'/\x3e"},e=N.doc.createDocumentFragment(),e=q.create("div",{style:"width:100%;height:100%;"},e),k=q.create("div",
{style:"width:100%;height:10%;","class":""}),m=q.create("div",{style:"width:100%"},e),n,w,v,l=this._isCustomAnalysisQuery(a.widget);1===a.browseType?(b="esri/dijit/analysis/PluginLayers",b={portalUrl:a.widget.get("portalUrl"),message:"",plugin:b,sortDescending:!0,sort:"title",self:a.widget.get("portalSelf"),itemsPerPage:100,demandList:!0,extent:a.widget.get("map").extent,useExtent:!1,fetchTimeout:600,galleryTemplate:"\x3cdiv class\x3d'listServiceTitle'\x3e\x3ctable cellpadding\x3d'0' cellspacing\x3d'0' width\x3d'100%'\x3e\x3ctr width\x3d'100%'\x3e\x3ctd nowrap\x3d'nowrap'\x3e  \x3cdiv  style\x3d\"position:absolute;left:80px; top:10px; width:1px; height:1px; background: transparent;\"\x3e\x3c/div\x3e\x3cdiv style\x3d'overflow:hidden;'\x3e\x3ca style\x3d\"height:16px;\"\x3e${item.title}\x3c/a\x3e\x3c/div\x3e\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e\x3ctable cellpadding\x3d'0' cellspacing\x3d'0' width\x3d'100%'\x3e\x3ctr width\x3d'100%' class\x3d'bottomRowTable'\x3e\x3ctd width\x3d'20'\x3e  \x3cspan class\x3d'esriAlignLeading'\x3e${item:_formatThumbnail}\x3c/span\x3e\x3c/td\x3e\x3ctd nowrap\x3d'nowrap'\x3e  \x3cspan class\x3d'esriAlignLeading' style\x3d'color:#656565;'\x3e${item.owner}\x3c/span\x3e\x3c/td\x3e\x3ctd style\x3d'padding-right:5px;padding-left:3px;'\x3e\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e\x3c/div\x3e",
showInfoPanel:!0,isAutoClose:!1,formatThumbnail:h,formatInfoPanelImage:f,"class":"esriAnalysisLayersItems"}):b={portalUrl:a.widget.get("portalUrl"),message:"",plugin:b,sortDescending:!0,sort:"title",self:a.widget.get("portalSelf"),pagingLinks:3,rowsPerPage:6,"class":"esriBrowseAnalysisLayers itemsGallery esriFloatLeading",extent:a.widget.get("map").extent,useExtent:!l,fetchTimeout:600,galleryTemplate:'\x3cdiv style\x3d\'opacity:1;\' class\x3d\'grid-item gallery-view galleryNode\'\x3e${item:_formatItemTitle}${item:_formatThumbnail}\x3cdiv class\x3d"linksDiv" style\x3d\'display:none;\'\x3e\x3cdiv class\x3d"esriItemLinks"\x3e\x3cdiv class\x3d"esriFloatLeading"\x3e\x3ca style\x3d"text-decoration: none;"\x3e\x3cspan\x3eAdd layer to analysis\x3c/span\x3e\x3cdiv class\x3d"dijitReset dijitInline esriArrows"\x3e\x3c/div\x3e\x3c/a\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e',
formatItemTitle:c,showInfoPanel:!1,showTooltip:!0,formatThumbnail:d,style:"width:48em;height:100%;clear:both;"};c=q.toDom('\x3cdiv class\x3d"esriBrowseOptions"\x3e');q.place(c,k);d=q.create("div",{"class":"esriBrowseOption"},c);if(!a.browseType||1!==a.browseType)c=q.create("div",{"class":"esriBrowseOption"},c),w=new F({name:"addlayer",id:a.widget.id+(a.browseType?a.browseType:"")+"_addlayercheck","class":"",value:!1,checked:!1},q.create("input",{},c)),q.create("label",{"for":a.widget.id+"_addlayercheck",
"class":"esriBrowseOption_label",innerHTML:this.i18n.addLayer},c);c=!0;a.browseType&&1===a.browseType?c=!1:l&&(c=!1);c=new F({name:"extentcheck",id:a.widget.id+(a.browseType?a.browseType:"")+"_addextentcheck","class":"",value:c,checked:c},q.create("input",{},d));q.create("label",{"for":a.widget.id+(a.browseType?a.browseType:"")+"_addextentcheck","class":"esriBrowseOption_label",innerHTML:this.i18n.withinMapArea},d);b.messageRight=k;n=new V(b,m);c.on("change",g.hitch(this,function(a){n.set("useExtent",
a)}));v=new R({title:1===a.browseType?this.i18n.browseLayers:l?this.i18n.browseAnalysisLayers:this.i18n.browseAnalysisTitle,content:e,browseItems:n,addlayerCheckBox:w,style:a.browseType&&1===a.browseType?"":"padding:.75em 0;background-color: #fff;width:50em;"});a.widget.own(a.widget.get("map").on("extent-change",g.hitch(a.widget,function(b){n.set("extent",a.widget.get("map").extent)})),v.on("hide",g.hitch(v,function(a){v.browseItems.reset()})));return v}},addAnalysisReadyLayer:function(a){function b(b){var d,
f,e;"Feature Service"===c.type&&(e=new W(c.url,{outFields:["*"]}),g.mixin(c,e));g.mixin(c,b);c.id=c.title+"_"+b.id;c.title=a.item.selectedLayer?c.title+"-"+b.name:c.title.replace(/_/g," ");c.name=c.title;c.version=c.currentVersion;d=a.layersSelect.getOptions();if(a.widget.showBrowseLayers&&a.widget.showReadyToUseLayers)f=3;else if(a.widget.showBrowseLayers||a.widget.showReadyToUseLayers)f=2;d=d.splice(d.length-f,f);a.layersSelect.removeOption(d);f=a.layers.length;a.posIncrement&&(f+=a.posIncrement);
d.unshift({value:f,label:c.title,selected:!0});a.layersSelect.addOption(d);a.layersSelect.set("value",f);e&&(c.lyr=e,e.name=c.name);c.linfo=b;a.layers.push(c);var h;t(".js-add-layer-checkbox",a.browseDialog.browseItems.infoPanel).forEach(function(a){h=a.checked});if(a.browseDialog.addlayerCheckBox&&a.browseDialog.addlayerCheckBox.get("checked")||h)this._addLayerHandle&&this._addLayerHandle.remove(),this._addLayerHandle=a.widget.map.on("layer-add",g.hitch(this,function(d){this._addLayerHandle.remove();
a.widget.emit("add-ready-to-use-layer",{layer:d.layer,layerInfo:b,item:c})})),a.widget.map.addLayer(e);a.browseDialog.browseItems.clear()}if(k.isDefined(a)&&k.isDefined(a.item)&&k.isDefined(a.layersSelect)&&k.isDefined(a.layers)&&k.isDefined(a.browseDialog)){a.browseDialog.hide();var d,c,f,h,e,l;d=!a.item.selectedLayer&&a.item.url?a.item.url+"/0":a.item.selectedLayer.url;-1!==window.location.protocol.indexOf("https:")&&(d=d.replace("http:","https:"));c={url:d,itemId:a.item.id,title:a.item.title,type:a.item.type,
analysisReady:!0};d=p.some(a.layers,function(b,d){var e=b.analysisReady&&c.analysisReady&&b.itemId===c.itemId;a.item.selectedLayer&&a.item.selectedLayer.url&&(e=b.itemId===c.itemId&&b.url===c.url);e&&(f=d);return e});h=new D;l="sync";if(d){a.posIncrement&&(f+=a.posIncrement);var m;t(".js-add-layer-checkbox",a.browseDialog.browseItems.infoPanel).forEach(function(a){m=a.checked});if(a.browseDialog.addlayerCheckBox&&a.browseDialog.addlayerCheckBox.get("checked")||m)a.posIncrement||(a.posIncrement=0),
e=a.layers[f-a.posIncrement],a.widget.map.getLayer(e.lyr.id)||(this._addLayerHandle&&this._addLayerHandle.remove(),this._addLayerHandle=a.widget.map.on("layer-add",g.hitch(this,function(b){this._addLayerHandle.remove();a.widget.emit("add-ready-to-use-layer",{layer:b.layer,layerInfo:e.linfo,item:e})})),a.widget.map.addLayer(e.lyr));a.layersSelect.set("value",f);a.browseDialog.browseItems.clear();h.resolve()}else a.item.selectedLayer?(c.url=a.item.selectedLayer.url,h.then(g.hitch(this,b)),setTimeout(h.resolve(a.item.selectedLayer),
500)):(l=a.item.itemDataUrl?G({url:a.item.itemDataUrl,content:{f:"json"}}):"sync",E(l,g.hitch(this,function(a){a&&(a.layers&&a.layers[0].id)&&(c.url=c.url.replace("/0","/"+a.layers[0].id));h=G({url:c.url,content:{f:"json"}});h.then(g.hitch(this,b))})));return h.promise}},addReadyToUseLayerOption:function(a,b){if(a&&(a.showReadyToUseLayers||a.showBrowseLayers))b||(b=[]),a.signInPromise.then(g.hitch(this,function(){p.forEach(b,function(b){(a.showReadyToUseLayers||a.showBrowseLayers)&&b.addOption({type:"separator",
value:""});if(a.showReadyToUseLayers){var c=a.i18n.browseAnalysisTitle;this._isCustomAnalysisQuery(a)&&(c=a.i18n.browseAnalysisLayers);b.addOption({value:"browse",label:c})}a.showBrowseLayers&&b.addOption({value:"browselayers",label:a.i18n.browseLayers})},this);a.showReadyToUseLayers&&!k.isDefined(a._browsedlg)&&(a._browsedlg=this.addBrowseAnalysisDialog({widget:a}),a.own(a._browsedlg.browseItems.on("select-change",g.hitch(a,a._handleBrowseItemsSelect)),a._browsedlg.on("hide",g.hitch(a,function(){p.forEach(b,
function(a){"browse"===a.get("value")&&a.reset()})}))));a.showBrowseLayers&&!k.isDefined(a._browseLyrsdlg)&&(a._browseLyrsdlg=this.addBrowseAnalysisDialog({widget:a,browseType:1}),a.own(a._browseLyrsdlg.on("browseitems-close",g.hitch(this,function(b){"add-layer"===b.action&&(a._browseLyrsdlg.browseItems.plugIn._grid&&(b.selection.selectedLayer=a._browseLyrsdlg.browseItems.plugIn._selectedLayer,a._handleBrowseItemsSelect({dialog:a._browseLyrsdlg,selection:b.selection})),a._browseLyrsdlg.browseItems.closeInfoPanel())})),
a._browseLyrsdlg.on("hide",g.hitch(a,function(){p.forEach(b,function(a){"browselayers"===a.get("value")&&a.reset()})}))))}))},_isCustomAnalysisQuery:function(a){var b='title:"Living Atlas Analysis Layers" AND owner:esri',d=!1;a&&a.isSingleTenant&&(b='title:"Living Atlas Analysis Layers" AND owner:esri_livingatlas');a.portalSelf&&a.portalSelf.analysisLayersGroupQuery&&a.portalSelf.analysisLayersGroupQuery!==b?d=!0:a._portal&&(a._portal.analysisLayersGroupQuery&&a._portal.analysisLayersGroupQuery!==
b)&&(d=!0);return d},getMaxInputByMode:function(a){var b;if(a&&a.units&&a.type){if("StraightLine"===a.type)"Miles"===a.units?b=1E3:"Yards"===a.units?b=176E4:"Kilometers"===a.units?b=y.format(1609.34,{places:2}):"Meters"===a.units?b=y.format(1609340,{places:2}):"Feet"===a.units&&(b=528E4);else if("DrivingDistance"===a.type||"TruckingDistance"===a.type||"WalkingDistance"===a.type)"Miles"===a.units?b=300:"Yards"===a.units?b=528E3:"Kilometers"===a.units?b=y.format(482.802,{places:2}):"Meters"===a.units?
b=y.format(482802,{places:2}):"Feet"===a.units&&(b=1584E3);else if("DrivingTime"===a.type||"TruckingTime"===a.type||"WalkingTime"===a.type)"Minutes"===a.units?b=300:"Seconds"===a.units?b=18E3:"Hours"===a.units&&(b=5);return b}},updateModeConstraints:function(a){var b;a&&(a.validateWidget&&a.units&&a.type)&&(b=a.validateWidget.get("constraints"),b.max=this.getMaxInputByMode(a),a.validateWidget.set(b))},getTravelModes:function(a){var b=new D,d,c,f,e;k.isDefined(this.travelModes)&&0<this.travelModes.length?
b.resolve(this.travelModes):!a||!a.widget?b.reject(Error("Missing parameter: params.widget required parameter")):a.widget.signInPromise.then(g.hitch(this,function(s){(e=a.widget.get("helperServices"))&&e.routingUtilities?(f=e.routingUtilities.url,d="sync"):d=a.widget._getSelf(a.widget.portalUrl);E(d,g.hitch(this,function(a){var d={};a&&(a.helperServices&&a.helperServices.routingUtilities)&&(f=a.helperServices.routingUtilities.url);k.isDefined(f)?(c=new X(f+"/GetTravelModes"),c.execute(d).then(g.hitch(this,
function(a){this.travelModes=p.map(a[0].value&&a[0].value.features,function(a){return J.fromJson(a.attributes.TravelMode)});a[1]&&(a[1].paramName&&"defaultTravelMode"===a[1].paramName)&&(this.defaultTravelModeId=a[1].value);b.resolve(this.travelModes)}),g.hitch(this,function(a){b.reject(a)}))):b.reject(Error("Missing Routing Utility Service to get Travel Modes"))}),function(a){b.reject(a)})}));return b.promise},populateTravelModes:function(a){if(a&&a.selectWidget&&a.widget){var b=[],d=a.allowmode||
"all";this.initI18n();a.addStraightLine&&b.push({value:"StraightLine",label:'\x3cdiv class\x3d"esriFloatLeading bufferIcon esriStraightLineDistanceIcon"\x3e\x3c/div\x3e\x3cdiv class\x3d"esriLeadingMargin4" style\x3d"height:20px;margin-top:10px;"\x3e'+this.i18n.straightLineDistance+"\x3c/div\x3e"});this.getTravelModes({widget:a.widget}).then(g.hitch(this,function(c){p.forEach(c,function(c,e){var g=c.name,l=g.replace(/\s/g,a.separator||""),m="AUTOMOBILE"===c.type?"Driving":"TRUCK"===c.type?"Trucking":
"WALK"===c.type?"Walking":"Other",n=m.toLowerCase(),p=c.units||g.split(/\s/)[1],q=k.isDefined(a.enableTravelModes)&&!a.enableTravelModes,p=c.impedanceAttributeName===c.timeAttributeName?"Time":c.impedanceAttributeName===c.distanceAttributeName?"Distance":"Other",g={label:'\x3cdiv class\x3d"esriFloatLeading bufferIcon esri'+m+p+'Icon"\x3e\x3c/div\x3e\x3cdiv class\x3d"esriLeadingMargin4" style\x3d"height:20px;margin-top:10px;"\x3e'+g+"\x3c/div\x3e",value:l,travelMode:c,disabled:q,modei18nKey:n,units:p};
if("all"===d||d===p.toLowerCase())"all"!==d&&(g.value=g.value.replace(p,"")),a.selectDefaultMode&&(this.defaultTravelModeId&&this.defaultTravelModeId===c.id)&&(g.selected=!0),b.push(g)},this);a.selectWidget.removeOption();a.selectWidget.addOption(b);a.selectWidget.set("value",a.value);a.widget.emit("travelmodes-added",{travelOptions:b})}),g.hitch(this,function(c){b&&0<b.length&&(a.selectWidget.removeOption(),a.selectWidget.addOption(b),a.selectWidget.set("value",a.value),a.widget.emit("travelmodes-added",
{travelOptions:b}))}))}},updateDisplay:function(a,b,d){(new t.NodeList(a)).style("display",b?d?d:"block":"none")},isGreaterThanZero:function(){return 0<this.get("value")},addAttributeOptions:function(a){this.initI18n();k.isDefined(a.allowSelectLabel)||(a.allowSelectLabel=!0);var b,d,c,f=["esriFieldTypeSmallInteger","esriFieldTypeInteger","esriFieldTypeSingle","esriFieldTypeDouble"];b=a.layer;d=a.selectWidget;c=b?b.fields:[];d.removeOption(d.getOptions());a.allowSelectLabel&&d.addOption({value:"",
label:this.i18n.attribute});a.allowStringType&&f.push("esriFieldTypeString");var e=[];p.forEach(c,function(a){-1!==p.indexOf(f,a.type)&&a.name!==b.objectIdField&&e.push({value:a.name,label:k.isDefined(a.alias)&&""!==a.alias?a.alias:a.name,type:"esriFieldTypeString"===a.type?"string":"number"})},this);d.addOption(e);d.set("value","0");d.set("disabled",!b||0===b.fields.length)},addStatisticsOptions:function(a){this.initI18n();var b=a.selectWidget,d=[{value:"SUM",label:this.i18n.sum},{value:"MIN",label:this.i18n.minimum},
{value:"MAX",label:this.i18n.maximum},{value:"MEAN",label:this.i18n.average},{value:"STDDEV",label:this.i18n.standardDev}];b.removeOption(b.getOptions());b.addOption([{value:"0",label:this.i18n.statistic}]);a.showGeoAnalyticsParams&&(b.addOption({value:"COUNT",label:this.i18n.count}),d.push({value:"VARIANCE",label:this.i18n.variance}),d.splice(4,0,{value:"RANGE",label:this.i18n.range}));!a.type||"number"===a.type?b.addOption(d):a.type&&"string"===a.type&&b.addOption({value:"ANY",label:this.i18n.any});
b.set("value","0")},addFillOptions:function(a){var b=a.selectWidget,d=[{value:"ZEROES",label:this.i18n.zeroes},{value:"SPATIAL_NEIGHBORS",label:this.i18n.spatialneighbhors},{value:"SPACE_TIME_NEIGHBORS",label:this.i18n.spacetimeneighbors},{value:"TEMPORAL_TREND",label:this.i18n.temporaltrend}];b.removeOption(b.getOptions());b.addOption([{value:"0",label:this.i18n.fill}]);(!a.type||"number"===a.type)&&b.addOption(d)},perMeter:function(a){var b=1;switch(a){case e.MILLIMETERS:b=1E3;break;case e.CENTIMETERS:b=
100;break;case e.DECIMETERS:b=10;break;case e.METERS:b=1;break;case e.KILOMETERS:b=0.0010;break;case e.INCHES:b=39.370079;break;case e.FEET:b=3.2808399;break;case e.YARDS:b=1.0936133;break;case e.MILES:b=6.2137119E-4;break;case e.NAUTICAL_MILES:b=5.399568E-4;break;case e.ACRES:b=2.4710538E-4;break;case e.ARES:b=0.01;break;case e.HECTARES:b=1E-4;break;case e.SQUARE_INCHES:b=1550.0031;break;case e.SQUARE_FEET:b=10.7639104;break;case e.SQUARE_YARDS:b=1.19599005;break;case e.SQUARE_MILES:b=3.86102159E-7;
break;case e.SQUARE_NAUTICAL_MILES:b=2.9155335E-7;break;case e.SQUARE_MILLIMETERS:b=1E6;break;case e.SQUARE_CENTIMETERS:b=1E4;break;case e.SQUARE_DECIMETERS:b=100;break;case e.SQUARE_METERS:b=1;break;case e.SQUARE_KILOMETERS:b=1E-6}return b},getType:function(a){var b=null;switch(a){case e.ACRES:b=2;break;case e.ARES:b=2;break;case e.CENTIMETERS:b=1;break;case e.DECIMETERS:b=1;break;case e.FEET:b=1;break;case e.HECTARES:b=2;break;case e.INCHES:b=1;break;case e.KILOMETERS:b=1;break;case e.METERS:b=
1;break;case e.MILES:b=1;break;case e.MILLIMETERS:b=1;break;case e.NAUTICAL_MILES:b=1;break;case e.SQUARE_CENTIMETERS:b=2;break;case e.SQUARE_DECIMETERS:b=2;break;case e.SQUARE_FEET:b=2;break;case e.SQUARE_INCHES:b=2;break;case e.SQUARE_KILOMETERS:b=2;break;case e.SQUARE_METERS:b=2;break;case e.SQUARE_MILES:b=2;break;case e.SQUARE_MILLIMETERS:b=2;break;case e.SQUARE_NAUTICAL_MILES:b=2;break;case e.SQUARE_YARDS:b=2;break;case e.YARDS:b=1;break;default:b=0}return b},unitConversion:function(a,b,d){var c=
!0;k.isDefined(a)||(this.emitError("The 'From' Value must be a valid numeric value: "+a),c=!1);k.isDefined(b)||(this.emitError("The 'From' Units must be defined: "+b),c=!1);k.isDefined(d)||(this.emitError("The 'To' Units must be defined: "+d),c=!1);a instanceof Array&&(this.emitError("Only single 'From' Value supported: "+a),c=!1);b instanceof Array&&(this.emitError("Only single 'From' Units supported: "+b),c=!1);d instanceof Array&&(this.emitError("Only single 'To' Units supported: "+d),c=!1);var e=
this.getType(b),g=this.getType(d);0===e&&(this.emitError("Unsupported 'From' Units: "+b),c=!1);0===g&&(this.emitError("Unsupported 'To' Units: "+d),c=!1);e!==g&&(this.emitError("Incompatible 'From' and 'To' Units: "+b+" and "+d),c=!1);return c?b===d?+a:+a/this.perMeter(b)*this.perMeter(d):Number.NaN},emitError:function(a){console.log("error",Error(a))},isEmpty:function(a){for(var b in a)if(a.hasOwnProperty(b))return!1;return A.stringify(a)===A.stringify({})}});K("extend-esri")&&g.setObject("dijit.analysis.utils",
x,S);return x});