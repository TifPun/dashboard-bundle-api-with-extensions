// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.18/esri/copyright.txt for details.
//>>built
define("esri/arcade/arcade",["require","exports","./arcadeRuntime","./parser","./Feature"],function(g,a,e,d,f){a.constructFeature=function(b){return f.fromFeature(b)};a.parseScript=function(b){return d.parseScript(b)};a.validateScript=function(b,c){return d.validateScript(b,c,"simple")};a.scriptCheck=function(b,c,a){return d.scriptCheck(b,c,a,"full")};a.parseAndExecuteScript=function(b,c,a){return e.executeScript(d.parseScript(b),c,a)};a.executeScript=function(b,c,a){return e.executeScript(b,c,a)};
a.referencesMember=function(b,a){return e.referencesMember(b,a)};a.referencesFunction=function(a,c){return e.referencesFunction(a,c)};a.extractFieldLiterals=function(a,c){void 0===c&&(c=!1);return d.extractFieldLiterals(a,c)}});