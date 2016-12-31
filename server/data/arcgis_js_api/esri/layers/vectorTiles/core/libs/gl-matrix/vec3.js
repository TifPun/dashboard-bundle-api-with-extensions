// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.18/esri/copyright.txt for details.
//>>built
define("esri/layers/vectorTiles/core/libs/gl-matrix/vec3",["./common"],function(k){var d={create:function(){var a=new k.ARRAY_TYPE(3);a[0]=0;a[1]=0;a[2]=0;return a},clone:function(a){var b=new k.ARRAY_TYPE(3);b[0]=a[0];b[1]=a[1];b[2]=a[2];return b},fromValues:function(a,b,c){var e=new k.ARRAY_TYPE(3);e[0]=a;e[1]=b;e[2]=c;return e},copy:function(a,b){a[0]=b[0];a[1]=b[1];a[2]=b[2];return a},set:function(a,b,c,e){a[0]=b;a[1]=c;a[2]=e;return a},add:function(a,b,c){a[0]=b[0]+c[0];a[1]=b[1]+c[1];a[2]=b[2]+
c[2];return a},subtract:function(a,b,c){a[0]=b[0]-c[0];a[1]=b[1]-c[1];a[2]=b[2]-c[2];return a}};d.sub=d.subtract;d.multiply=function(a,b,c){a[0]=b[0]*c[0];a[1]=b[1]*c[1];a[2]=b[2]*c[2];return a};d.mul=d.multiply;d.divide=function(a,b,c){a[0]=b[0]/c[0];a[1]=b[1]/c[1];a[2]=b[2]/c[2];return a};d.div=d.divide;d.ceil=function(a,b){a[0]=Math.ceil(b[0]);a[1]=Math.ceil(b[1]);a[2]=Math.ceil(b[2]);return a};d.floor=function(a,b){a[0]=Math.floor(b[0]);a[1]=Math.floor(b[1]);a[2]=Math.floor(b[2]);return a};d.min=
function(a,b,c){a[0]=Math.min(b[0],c[0]);a[1]=Math.min(b[1],c[1]);a[2]=Math.min(b[2],c[2]);return a};d.max=function(a,b,c){a[0]=Math.max(b[0],c[0]);a[1]=Math.max(b[1],c[1]);a[2]=Math.max(b[2],c[2]);return a};d.round=function(a,b){a[0]=Math.round(b[0]);a[1]=Math.round(b[1]);a[2]=Math.round(b[2]);return a};d.scale=function(a,b,c){a[0]=b[0]*c;a[1]=b[1]*c;a[2]=b[2]*c;return a};d.scaleAndAdd=function(a,b,c,e){a[0]=b[0]+c[0]*e;a[1]=b[1]+c[1]*e;a[2]=b[2]+c[2]*e;return a};d.distance=function(a,b){var c=b[0]-
a[0],e=b[1]-a[1],g=b[2]-a[2];return Math.sqrt(c*c+e*e+g*g)};d.dist=d.distance;d.squaredDistance=function(a,b){var c=b[0]-a[0],e=b[1]-a[1],g=b[2]-a[2];return c*c+e*e+g*g};d.sqrDist=d.squaredDistance;d.length=function(a){var b=a[0],c=a[1];a=a[2];return Math.sqrt(b*b+c*c+a*a)};d.len=d.length;d.squaredLength=function(a){var b=a[0],c=a[1];a=a[2];return b*b+c*c+a*a};d.sqrLen=d.squaredLength;d.negate=function(a,b){a[0]=-b[0];a[1]=-b[1];a[2]=-b[2];return a};d.inverse=function(a,b){a[0]=1/b[0];a[1]=1/b[1];
a[2]=1/b[2];return a};d.normalize=function(a,b){var c=b[0],e=b[1],g=b[2],c=c*c+e*e+g*g;0<c&&(c=1/Math.sqrt(c),a[0]=b[0]*c,a[1]=b[1]*c,a[2]=b[2]*c);return a};d.dot=function(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]};d.cross=function(a,b,c){var e=b[0],g=b[1];b=b[2];var f=c[0],d=c[1];c=c[2];a[0]=g*c-b*d;a[1]=b*f-e*c;a[2]=e*d-g*f;return a};d.lerp=function(a,b,c,e){var g=b[0],f=b[1];b=b[2];a[0]=g+e*(c[0]-g);a[1]=f+e*(c[1]-f);a[2]=b+e*(c[2]-b);return a};d.hermite=function(a,b,c,e,g,f){var d=f*f,h=d*(2*
f-3)+1,m=d*(f-2)+f,l=d*(f-1);f=d*(3-2*f);a[0]=b[0]*h+c[0]*m+e[0]*l+g[0]*f;a[1]=b[1]*h+c[1]*m+e[1]*l+g[1]*f;a[2]=b[2]*h+c[2]*m+e[2]*l+g[2]*f;return a};d.bezier=function(a,b,c,e,g,f){var d=1-f,h=d*d,m=f*f,l=h*d,h=3*f*h,d=3*m*d;f*=m;a[0]=b[0]*l+c[0]*h+e[0]*d+g[0]*f;a[1]=b[1]*l+c[1]*h+e[1]*d+g[1]*f;a[2]=b[2]*l+c[2]*h+e[2]*d+g[2]*f;return a};d.random=function(a,b){b=b||1;var c=2*k.RANDOM()*Math.PI,e=2*k.RANDOM()-1,g=Math.sqrt(1-e*e)*b;a[0]=Math.cos(c)*g;a[1]=Math.sin(c)*g;a[2]=e*b;return a};d.transformMat4=
function(a,b,c){var e=b[0],g=b[1];b=b[2];var d=c[3]*e+c[7]*g+c[11]*b+c[15],d=d||1;a[0]=(c[0]*e+c[4]*g+c[8]*b+c[12])/d;a[1]=(c[1]*e+c[5]*g+c[9]*b+c[13])/d;a[2]=(c[2]*e+c[6]*g+c[10]*b+c[14])/d;return a};d.transformMat3=function(a,b,c){var e=b[0],d=b[1];b=b[2];a[0]=e*c[0]+d*c[3]+b*c[6];a[1]=e*c[1]+d*c[4]+b*c[7];a[2]=e*c[2]+d*c[5]+b*c[8];return a};d.transformQuat=function(a,b,c){var e=b[0],d=b[1],f=b[2];b=c[0];var n=c[1],h=c[2];c=c[3];var m=c*e+n*f-h*d,l=c*d+h*e-b*f,k=c*f+b*d-n*e,e=-b*e-n*d-h*f;a[0]=
m*c+e*-b+l*-h-k*-n;a[1]=l*c+e*-n+k*-b-m*-h;a[2]=k*c+e*-h+m*-n-l*-b;return a};d.rotateX=function(a,b,c,e){var d=[],f=[];d[0]=b[0]-c[0];d[1]=b[1]-c[1];d[2]=b[2]-c[2];f[0]=d[0];f[1]=d[1]*Math.cos(e)-d[2]*Math.sin(e);f[2]=d[1]*Math.sin(e)+d[2]*Math.cos(e);a[0]=f[0]+c[0];a[1]=f[1]+c[1];a[2]=f[2]+c[2];return a};d.rotateY=function(a,b,c,d){var g=[],f=[];g[0]=b[0]-c[0];g[1]=b[1]-c[1];g[2]=b[2]-c[2];f[0]=g[2]*Math.sin(d)+g[0]*Math.cos(d);f[1]=g[1];f[2]=g[2]*Math.cos(d)-g[0]*Math.sin(d);a[0]=f[0]+c[0];a[1]=
f[1]+c[1];a[2]=f[2]+c[2];return a};d.rotateZ=function(a,b,c,d){var g=[],f=[];g[0]=b[0]-c[0];g[1]=b[1]-c[1];g[2]=b[2]-c[2];f[0]=g[0]*Math.cos(d)-g[1]*Math.sin(d);f[1]=g[0]*Math.sin(d)+g[1]*Math.cos(d);f[2]=g[2];a[0]=f[0]+c[0];a[1]=f[1]+c[1];a[2]=f[2]+c[2];return a};d.forEach=function(){var a=d.create();return function(b,c,d,g,f,k){c||(c=3);d||(d=0);for(g=g?Math.min(g*c+d,b.length):b.length;d<g;d+=c)a[0]=b[d],a[1]=b[d+1],a[2]=b[d+2],f(a,a,k),b[d]=a[0],b[d+1]=a[1],b[d+2]=a[2];return b}}();d.angle=function(a,
b){var c=d.fromValues(a[0],a[1],a[2]),e=d.fromValues(b[0],b[1],b[2]);d.normalize(c,c);d.normalize(e,e);c=d.dot(c,e);return 1<c?0:Math.acos(c)};d.str=function(a){return"vec3("+a[0]+", "+a[1]+", "+a[2]+")"};d.exactEquals=function(a,b){return a[0]===b[0]&&a[1]===b[1]&&a[2]===b[2]};d.equals=function(a,b){var c=a[0],d=a[1],g=a[2],f=b[0],n=b[1],h=b[2];return Math.abs(c-f)<=k.EPSILON*Math.max(1,Math.abs(c),Math.abs(f))&&Math.abs(d-n)<=k.EPSILON*Math.max(1,Math.abs(d),Math.abs(n))&&Math.abs(g-h)<=k.EPSILON*
Math.max(1,Math.abs(g),Math.abs(h))};return d});