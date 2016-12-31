//>>built
require({cache:{"url:dojox/layout/resources/FloatingPane.html":'\x3cdiv class\x3d"dojoxFloatingPane" id\x3d"${id}"\x3e\r\n\t\x3cdiv tabindex\x3d"0" role\x3d"button" class\x3d"dojoxFloatingPaneTitle" dojoAttachPoint\x3d"focusNode"\x3e\r\n\t\t\x3cspan dojoAttachPoint\x3d"closeNode" dojoAttachEvent\x3d"onclick: close" class\x3d"dojoxFloatingCloseIcon"\x3e\x3c/span\x3e\r\n\t\t\x3cspan dojoAttachPoint\x3d"maxNode" dojoAttachEvent\x3d"onclick: maximize" class\x3d"dojoxFloatingMaximizeIcon"\x3e\x26thinsp;\x3c/span\x3e\r\n\t\t\x3cspan dojoAttachPoint\x3d"restoreNode" dojoAttachEvent\x3d"onclick: _restore" class\x3d"dojoxFloatingRestoreIcon"\x3e\x26thinsp;\x3c/span\x3e\t\r\n\t\t\x3cspan dojoAttachPoint\x3d"dockNode" dojoAttachEvent\x3d"onclick: minimize" class\x3d"dojoxFloatingMinimizeIcon"\x3e\x26thinsp;\x3c/span\x3e\r\n\t\t\x3cspan dojoAttachPoint\x3d"titleNode" class\x3d"dijitInline dijitTitleNode"\x3e\x3c/span\x3e\r\n\t\x3c/div\x3e\r\n\t\x3cdiv dojoAttachPoint\x3d"canvas" class\x3d"dojoxFloatingPaneCanvas"\x3e\r\n\t\t\x3cdiv dojoAttachPoint\x3d"containerNode" role\x3d"region" tabindex\x3d"-1" class\x3d"${contentClass}"\x3e\r\n\t\t\x3c/div\x3e\r\n\t\t\x3cspan dojoAttachPoint\x3d"resizeHandle" class\x3d"dojoxFloatingResizeHandle"\x3e\x3c/span\x3e\r\n\t\x3c/div\x3e\r\n\x3c/div\x3e\r\n'}});
define("dojox/layout/FloatingPane","dojo/_base/kernel dojo/_base/lang dojo/_base/window dojo/_base/declare dojo/_base/fx dojo/_base/connect dojo/_base/array dojo/_base/sniff dojo/window dojo/dom dojo/dom-class dojo/dom-geometry dojo/dom-construct dojo/touch dijit/_TemplatedMixin dijit/_Widget dijit/BackgroundIframe dijit/registry dojo/dnd/Moveable ./ContentPane ./ResizeHandle dojo/text!./resources/FloatingPane.html ./Dock".split(" "),function(g,c,m,n,h,p,f,q,r,s,e,d,t,k,u,v,w,l,x,y,z,A,B){g.experimental("dojox.layout.FloatingPane");
return n("dojox.layout.FloatingPane",[y,u],{closable:!0,dockable:!0,resizable:!1,maxable:!1,resizeAxis:"xy",title:"",dockTo:"",duration:400,contentClass:"dojoxFloatingPaneContent",_showAnim:null,_hideAnim:null,_dockNode:null,_restoreState:{},_allFPs:[],_startZ:100,templateString:A,attributeMap:c.delegate(v.prototype.attributeMap,{title:{type:"innerHTML",node:"titleNode"}}),postCreate:function(){this.inherited(arguments);new x(this.domNode,{handle:this.focusNode});this.dockable||(this.dockNode.style.display=
"none");this.closable||(this.closeNode.style.display="none");this.maxable||(this.maxNode.style.display="none",this.restoreNode.style.display="none");this.resizable?this.domNode.style.width=d.getMarginBox(this.domNode).w+"px":this.resizeHandle.style.display="none";this._allFPs.push(this);this.domNode.style.position="absolute";this.bgIframe=new w(this.domNode);this._naturalState=d.position(this.domNode)},startup:function(){if(!this._started){this.inherited(arguments);this.resizable&&(q("ie")?this.canvas.style.overflow=
"auto":this.containerNode.style.overflow="auto",this._resizeHandle=new z({targetId:this.id,resizeAxis:this.resizeAxis},this.resizeHandle));if(this.dockable){var a=this.dockTo;this.dockTo=this.dockTo?l.byId(this.dockTo):l.byId("dojoxGlobalFloatingDock");if(!this.dockTo){var b;a?(b=a,a=s.byId(a)):(a=t.create("div",null,m.body()),e.add(a,"dojoxFloatingDockDefault"),b="dojoxGlobalFloatingDock");this.dockTo=new B({id:b,autoPosition:"south"},a);this.dockTo.startup()}("none"==this.domNode.style.display||
"hidden"==this.domNode.style.visibility)&&this.minimize()}this.connect(this.focusNode,k.press,"bringToTop");this.connect(this.domNode,k.press,"bringToTop");this.resize(d.position(this.domNode));this._started=!0}},setTitle:function(a){g.deprecated("pane.setTitle","Use pane.set('title', someTitle)","2.0");this.set("title",a)},close:function(){this.closable&&(p.unsubscribe(this._listener),this.hide(c.hitch(this,function(){this.destroyRecursive()})))},hide:function(a){h.fadeOut({node:this.domNode,duration:this.duration,
onEnd:c.hitch(this,function(){this.domNode.style.display="none";this.domNode.style.visibility="hidden";this.dockTo&&this.dockable&&this.dockTo._positionDock(null);a&&a()})}).play()},show:function(a){h.fadeIn({node:this.domNode,duration:this.duration,beforeBegin:c.hitch(this,function(){this.domNode.style.display="";this.domNode.style.visibility="visible";this.dockTo&&this.dockable&&this.dockTo._positionDock(null);"function"==typeof a&&a();this._isDocked=!1;this._dockNode&&(this._dockNode.destroy(),
this._dockNode=null)})}).play();var b=d.getContentBox(this.domNode);this.resize(c.mixin(d.position(this.domNode),{w:b.w,h:b.h}));this._onShow()},minimize:function(){this._isDocked||this.hide(c.hitch(this,"_dock"))},maximize:function(){this._maximized||(this._naturalState=d.position(this.domNode),this._isDocked&&(this.show(),setTimeout(c.hitch(this,"maximize"),this.duration)),e.add(this.focusNode,"floatingPaneMaximized"),this.resize(r.getBox()),this._maximized=!0)},_restore:function(){this._maximized&&
(this.resize(this._naturalState),e.remove(this.focusNode,"floatingPaneMaximized"),this._maximized=!1)},_dock:function(){!this._isDocked&&this.dockable&&(this._dockNode=this.dockTo.addNode(this),this._isDocked=!0)},resize:function(a){this._naturalState=a=a||this._naturalState;var b=this.domNode.style;"t"in a?b.top=a.t+"px":"y"in a&&(b.top=a.y+"px");"l"in a?b.left=a.l+"px":"x"in a&&(b.left=a.x+"px");b.width=a.w+"px";b.height=a.h+"px";a={l:0,t:0,w:a.w,h:a.h-this.focusNode.offsetHeight};d.setMarginBox(this.canvas,
a);this._checkIfSingleChild();this._singleChild&&this._singleChild.resize&&this._singleChild.resize(a)},bringToTop:function(){var a=f.filter(this._allFPs,function(a){return a!==this},this);a.sort(function(a,c){return a.domNode.style.zIndex-c.domNode.style.zIndex});a.push(this);f.forEach(a,function(a,c){a.domNode.style.zIndex=this._startZ+2*c;e.remove(a.domNode,"dojoxFloatingPaneFg")},this);e.add(this.domNode,"dojoxFloatingPaneFg")},destroy:function(){this._allFPs.splice(f.indexOf(this._allFPs,this),
1);this._resizeHandle&&this._resizeHandle.destroy();this.inherited(arguments)}})});