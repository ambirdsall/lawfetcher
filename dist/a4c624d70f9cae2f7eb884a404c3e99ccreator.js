!function(){"use strict";function t(t,n,e){return e=e||this,function(){return n.call(e,t.apply(e,arguments))}}$.each;var e=t(window.encodeURIComponent,function(t){return t.replace(/%20/g,"_")});t(window.decodeURIComponent,function(t){return t.replace(/_/g," ")});var o=window.location.href+"citation",r=$("#url-encoder__input"),u=$("#submit--input-validator-text");function n(t){t.preventDefault();var n=function(t){return/\u00a7{2}/.test(t)?t.replace(/\u00a7(\u00a7 ?[^,]+),.+/,"$1").replace(/\u00a7{2}/,"§"):t}($.trim(r.val()));n.length&&(!function(t){return/^[ \u00a0a-zA-Z\d-\u2010\u2011\u2012\u2013\u2014\u2015\u2212\uff0d\(\),\.:'\u2019\/\u00a7\u00b6&]*$/.test(t)}(n)?(r.parent().addClass("has-error"),u.show()):window.location.href=function(t){return o+"#"+e(t)}(n))}$("#url-encoder__form").submit(n),$("#submit").click(n),localStorage.getItem("autoforward",function(t,n){t?console.log(t):n&&$(".center-column").append($("<button></button>").addClass("btn btn-danger center-block").attr("id","autoforward-remover").html("Remove Autoforwarding").click(function(t){localStorage.removeItem("autoforward",function(t){t?console.log(t):$("#autoforward-remover").removeClass("btn-danger").addClass("btn-success").fadeOut()})}))})}();