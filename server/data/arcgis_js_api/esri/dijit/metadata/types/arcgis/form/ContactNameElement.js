// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.18/esri/copyright.txt for details.
//>>built
define("esri/dijit/metadata/types/arcgis/form/ContactNameElement","dojo/_base/declare dojo/_base/lang dojo/has ../../../../../kernel ../../../base/etc/docUtil ../../../form/OpenElement dojo/i18n!../../../nls/i18nArcGIS".split(" "),function(a,f,g,m,k,n,h){a=a([n],{postCreate:function(){this.inherited(arguments)},beforeValidateValue:function(a,e,g){a=this.gxeDocument;if(!("rpOrgName"!==this.target||a.isAgsItemDescription))if(!a.isAgsINSPIRE||!(0===this.gxePath.indexOf("/metadata/mdContact/")||0===this.gxePath.indexOf("/metadata/dataIdInfo/idPoC/"))){var c=
!0,d=!0,b=!0,b=d=c=!0,b=this.parentElement.gxePath+"/",l=this.domNode.parentNode,c=g,c=null===c||0===f.trim(c).length,d=k.findInputWidget(b+"rpIndName",l).getInputValue(),d=null===d||0===f.trim(d).length;e.label=h.contact.conditionalName.caption;a.isAgsFGDC?c&&d&&(e.isValid=!1,e.message=h.contact.conditionalName.msg_fgdc):(b=k.findInputWidget(b+"rpPosName",l).getInputValue(),b=null===b||0===f.trim(b).length,c&&(d&&b)&&(e.isValid=!1,e.message=h.contact.conditionalName.msg))}}});g("extend-esri")&&f.setObject("dijit.metadata.types.arcgis.form.ContactNameElement",
a,m);return a});