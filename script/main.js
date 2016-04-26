var map,mapLocationJSON,routeQueryLength,routeFinalResults=[];require(["dojo/parser","esri/map","esri/layers/FeatureLayer","esri/tasks/query","esri/tasks/QueryTask","esri/geometry/Point","esri/SpatialReference","esri/symbols/SimpleMarkerSymbol","esri/symbols/SimpleLineSymbol","esri/Color","esri/graphic","esri/geometry/webMercatorUtils","esri/arcgis/utils","esri/dijit/HomeButton","esri/arcgis/Portal","esri/arcgis/OAuthInfo","esri/IdentityManager","esri/tasks/FeatureSet","esri/tasks/RouteParameters","esri/tasks/RouteTask","esri/tasks/query","esri/tasks/QueryTask","dojo/_base/array","dojo/promise/all","dojo/domReady!"],function(e,t,o,r,a,s,l,u,n,i,c,p,m,h,d,g,f,w,y,b,r,a,S,v){e.parse();var R=new g({appId:"ewAC3wwim6e9Y8eQ",popup:!0});f.registerOAuthInfos([R]),f.getCredential(R.portalUrl+"/sharing",{oAuthPopupConfirmation:!1}),new d.Portal(R.portalUrl).signIn().then(function(e){console.log("Signed in to the portal: ",e)}).otherwise(function(e){console.log("Error occurred while signing in: ",e)}),m.createMap("e42824673a25414c902435038656b2bc","map").then(function(e){map=e.map,map.on("click",function(e){map.graphics.clear(),$("#autocomplete").val(""),$("#summary").hide(),$("#results").hide();var t={x:e.mapPoint.x,y:e.mapPoint.y,spatialReference:{wkid:e.mapPoint.spatialReference.wkid}};d(t)});var t=new h({map:map},"HomeButton");t.startup(),$("#locate").click(function(){navigator.geolocation&&navigator.geolocation.getCurrentPosition(o,m)});var o=function(e){map.graphics.clear(),$("#autocomplete").val("");var t=p.geographicToWebMercator(new s(e.coords.longitude,e.coords.latitude)),o={x:t.x,y:t.y,spatialReference:{wkid:102100}};f(o)},m=function(e){switch(e.code){case e.PERMISSION_DENIED:alert("Location not provided");break;case e.POSITION_UNAVAILABLE:alert("Current location not available");break;case e.TIMEOUT:alert("Timeout");break;default:alert("unknown error")}},d=function(e){$(".searching").show(),$.ajax({url:"http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode",dataType:"json",data:{f:"json",location:JSON.stringify(e),outSR:102100}}).complete(function(t){if(void 0!==t.responseJSON.address){console.log(t.responseJSON.address.Match_addr),$(".searching").hide();try{$("#autocomplete").val(t.responseJSON.address.Match_addr),f(e)}catch(o){O("Cannot match your address")}}else O("Could not geocode this location, try again")})};$(function(){$("#autocomplete").autocomplete({serviceUrl:"https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&countryCode=CAN&category=Address,Postal,Populated Place",paramName:"text",dataType:"json",transformResult:function(e){return{suggestions:$.map(e.suggestions,function(e){return{value:e.text,data:e.magicKey}})}},onSelect:function(e){g(e)}})});var g=function(e){$(".searching").show(),$.ajax({url:"http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find",dataType:"json",data:{f:"json",sourceCountry:"CAN",text:e.value,magicKey:e.data,outSR:102100}}).done(function(e){$(".searching").hide(),0==e.locations.length?O("Cannot not find address"):($("#autocomplete").val(e.locations[0].name),e.locations[0].feature.geometry.spatialReference=e.spatialReference,f(e.locations[0].feature.geometry))})},f=function(e){mapLocationJSON=C(e);var t=new r,o=new a("https://services6.arcgis.com/pa1Cq6oWdHMnIo28/arcgis/rest/services/associations/FeatureServer/1");t.geometry=new s([e.x,e.y],new l({wkid:102100})),t.spatialRelationship=r.SPATIAL_REL_INTERSECTS,t.outFields=["boundaryid","adjacent","shared","Name"],j(t.geometry),o.execute(t,v,O)},v=function(e){0==e.features.length?O("You are not in a mapped zone"):($("#autocomplete").val()?$("#location").html("You were located at <b>"+$("#autocomplete").val()+"</b>"):$("#location").html("You were located at the displayed point"),"no"==e.features[0].attributes.shared?R(e.features[0].attributes):k(e.features[0].attributes),$("#autocomplete").val(""),$("#refresh").show(),$("#results").show())},R=function(e){console.log("DEFINED"),$("#results").html("Your association is: <p><a target='_blank' href='https://www.google.ca/#q="+e.Name+"'>"+e.Name+"</a></p>")},k=function(e){if(console.log("SHARED"),console.log(e),JSON.parse(e.adjacent).length>1)P(JSON.parse(e.adjacent));else{var t=new r,o=new a("https://services6.arcgis.com/pa1Cq6oWdHMnIo28/arcgis/rest/services/associations/FeatureServer/0");whereShared="boundaryid="+JSON.parse(e.adjacent)[0],t.where=whereShared,t.outFields=["*"],t.returnGeometry=!1,o.execute(t,N)}},N=function(e){$("#results").html("Your association is: <p><a target='_blank' href='https://www.google.ca/#q="+e.features[0].attributes.Name+"'>"+e.features[0].attributes.Name+"</a></p>")},C=function(e){console.log("BUILD GEOM"),incidentLocation={geometry:{type:"point",y:e.y,x:e.x,spatialReference:e.spatialReference},attributes:{OBJECTID:9999,Name:"User Address"}};var t=new c(incidentLocation),o=[];return o.push(t),queryFeatureSet=new w,queryFeatureSet.features=o,queryFeatureSet},P=function(e){console.log("QUERY");var t=new r,o=new a("https://services6.arcgis.com/pa1Cq6oWdHMnIo28/arcgis/rest/services/associations/FeatureServer/0");where="",S.forEach(e,function(e,t){where?where+=" or boundaryid="+e:where+="boundaryid="+e}),console.log(where),t.where=where,t.outFields=["*"],t.spatialReference={wkid:102100},t.returnGeometry=!0,o.execute(t,E)},E=function(e){console.log("ROUTE"),console.log(e),routeQueryLength=e.features.length,routeFinalResults=[],S.forEach(e.features,function(e,t){routeTask=new b("https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World"),routeTask.on("solve-complete",_),routeTask.on("error",A),routeParams=new y,routeParams.stops=new w,routeParams.returnStops=!0,routeParams.outSpatialReference={wkid:102100},routeParams.attributeParameterValues=[{attributeName:"boundaryid",parameterName:"BID",value:e.attributes.boundaryid}],routeParams.stops.features.push(mapLocationJSON.features[0]),routeParams.stops.features.push(e),routeTask.solve(routeParams)})},_=function(e){console.log("ROUTE SOLVE"),console.log(e),routeFinalResults.push(e),routeFinalResults.length==routeQueryLength?(console.log("all routes done"),T(routeFinalResults)):console.log("more routes to generate")},T=function(e){console.log("CALCULATION");var t=[],o=[];if(S.forEach(e,function(e){var r=e.result.routeResults[0].stops[1].attributes.Cumul_Kilometers,a=e.result.routeResults[0].stops[1].attributes.Name;t.push([r,a]),o.push("<p>"+a+" = <b>"+Math.round(100*r)/100+"</b> <span style='font-size:10px'> km</span></p>"),console.log(a+" = "+r)}),$("#summary").html(o.join("")),console.log(t),routeSymbol=(new n).setColor(new dojo.Color([0,0,255,.5])).setWidth(5),routeSymbol2=(new n).setColor(new dojo.Color([0,255,0,.5])).setWidth(5),routeSymbol3=(new n).setColor(new dojo.Color([255,255,0,.5])).setWidth(5),2==t.length){var r=t[0][0]-t[1][0];console.log(r),0>r?-8>r?($("#results").html("Your association is: <p><a target='_blank' href='https://www.google.ca/#q="+t[0][1]+"'>"+t[0][1]+"</a></p>"),map.graphics.add(e[0].result.routeResults[0].route.setSymbol(routeSymbol))):($("#results").html("You have choice of: <p><a target='_blank' href='https://www.google.ca/#q="+t[0][1]+"'>"+t[0][1]+"</a></p><p><a target='_blank' href='https://www.google.ca/#q="+t[1][1]+"'>"+t[1][1]+"</a></p>"),map.graphics.add(e[0].result.routeResults[0].route.setSymbol(routeSymbol)),map.graphics.add(e[1].result.routeResults[0].route.setSymbol(routeSymbol2))):r>8?($("#results").html("Your association is: <p><a target='_blank' href='https://www.google.ca/#q="+t[1][1]+"'>"+t[1][1]+"</a></p>"),map.graphics.add(e[0].result.routeResults[0].route.setSymbol(routeSymbol))):($("#results").html("You have choice of: <p><a target='_blank' href='https://www.google.ca/#q="+t[0][1]+"'>"+t[0][1]+"</a></p><p><a target='_blank' href='https://www.google.ca/#q="+t[1][1]+"'>"+t[1][1]+"</a></p>"),map.graphics.add(e[0].result.routeResults[0].route.setSymbol(routeSymbol)),map.graphics.add(e[1].result.routeResults[0].route.setSymbol(routeSymbol2)))}else{console.log("Three routes possible");var a=[t[0][0],t[1][0],t[2][0]].sort();if(console.log(a),a[0]-a[1]<-8)console.log("only using first"),S.forEach(e,function(e){e.result.routeResults[0].stops[1].attributes.Cumul_Kilometers==a[0]&&("<a target='_blank' href='https://www.google.ca/#q="+e.result.routeResults[0].stops[1].attributes.Name+"'>"+e.result.routeResults[0].stops[1].attributes.Name+"</a>",map.graphics.add(e.result.routeResults[0].route.setSymbol(routeSymbol)))});else if(a[0]-a[2]<-8){console.log("using first and second");var s=[];S.forEach(e,function(e){e.result.routeResults[0].stops[1].attributes.Cumul_Kilometers==a[0]&&(s.push(e.result.routeResults[0].stops[1].attributes.Name),map.graphics.add(e.result.routeResults[0].route.setSymbol(routeSymbol))),e.result.routeResults[0].stops[1].attributes.Cumul_Kilometers==a[1]&&(s.push(e.result.routeResults[0].stops[1].attributes.Name),map.graphics.add(e.result.routeResults[0].route.setSymbol(routeSymbol2))),$("#results").html("You have choice of: <p><a target='_blank' href='https://www.google.ca/#q="+s[0]+"'>"+s[0]+"</a></p><p><a target='_blank' href='https://www.google.ca/#q="+s[1]+"'>"+s[1]+"</a></p>")})}else{console.log("using first, second, third");var s=[];[routeSymbol,routeSymbol2,routeSymbol3];S.forEach(e,function(e){s.push(e.result.routeResults[0].stops[1].attributes.Name),1==s.length&&map.graphics.add(e.result.routeResults[0].route.setSymbol(routeSymbol)),2==s.length&&map.graphics.add(e.result.routeResults[0].route.setSymbol(routeSymbol2)),3==s.length&&map.graphics.add(e.result.routeResults[0].route.setSymbol(routeSymbol3))}),$("#results").html("You have choice of: <p><a target='_blank' href='https://www.google.ca/#q="+s[0]+"'>"+s[0]+"</a></p><p><a target='_blank' href='https://www.google.ca/#q="+s[1]+"'>"+s[1]+"</a></p><p><a target='_blank' href='https://www.google.ca/#q="+s[2]+"'>"+s[2]+"</a></p>")}}$("#summary").show()},A=function(e){console.log(e)},O=function(e){$("#autocomplete").hide(),$("#autocomplete").val()?$("#location").html("Located you at <b>"+$("#autocomplete").val()+"</b>"):$("#location").html("Located you at a <b>map click</b>"),$("#results").html(e),$("#refresh").show()},j=function(e){var t=new n;t.setColor(new i([36,36,36,1]));var o=new u;o.setOutline(t),o.setAngle(0),o.setColor(new i([255,0,0,.48])),o.setSize(40),o.setPath("M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z"),o.setStyle(u.STYLE_PATH),$("#autocomplete").hide(),map.graphics.add(new c(e,o)),map.centerAndZoom(e,13)};$("#autocomplete").keypress(function(e){(e.which&&13==e.which||e.keyCode&&13==e.keyCode)&&g({value:$("#autocomplete").val(),data:""})}),$(document).on("keydown",function(e){27==e.keyCode&&(map.graphics.clear(),$("#autocomplete").val(""),$("#autocomplete").show(),$("#autocomplete").focus(),$("#location").html(""),$("#results").html(""),$("#refresh").hide(),$("#summary").hide())}),$("#refresh").click(function(){var e=jQuery.Event("keydown");e.which=27,e.keyCode=27,$(document).trigger(e)})})});
