// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.18/esri/copyright.txt for details.
//>>built
define("esri/dijit/metadata/types/arcgis/base/conditionals/ISO19139A1_ROW18","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/topic dojo/has ../../../../../../kernel dojo/i18n!../../../../nls/i18nArcGIS ../../../../base/Conditional".split(" "),function(c,f,m,d,g,h,k,l){c=c(l,{key:"ISO19139A1_ROW18",postCreate:function(){this.inherited(arguments);var e=this;this.own(d.subscribe("gxe/optional-content-toggled",function(a){try{if(e.parentXNode&&a&&a.src&&a.src.target){var b=a.src.target;("distFormat"===
b||"distributor"===b||"distorFormat"===b)&&e.emitInteractionOccurred()}}catch(c){console.error(c)}}));this.own(d.subscribe("gxe/xnode-destroyed",function(a){try{e.parentXNode&&a&&a.xnode&&"/metadata/distInfo/distributor"===a.xnode.gxePath&&e.emitInteractionOccurred()}catch(b){console.error(b)}}))},validateConditionals:function(c){var a=this.newStatus({message:k.conditionals[this.key]}),b=!0,d=this.parentXNode.domNode;this.isXNodeOff(this.parentXNode)||(b=!1,this.forActiveXNodes("/metadata/distInfo/distFormat,/metadata/distInfo/distributor/distorFormat",
d,function(a){return b=!0}));a.isValid=b;this.track(a,c);return a}});g("extend-esri")&&f.setObject("dijit.metadata.types.arcgis.base.conditionals.ISO19139A1_ROW18",c,h);return c});