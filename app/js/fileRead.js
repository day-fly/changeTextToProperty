 'use strict';
 window.$ = window.jQuery = require('jquery');
 //import extractText.js
 //document.write("<script src='js/extractText.js'></script>");
 //document.write("<script src='js/domTreeWalker.js'></script>");

 const RegExpDS = /<!--[^>](.*?)-->/g; //주석
 const RegExpServerside = /<%[^>](.*?)%>/g; //서버사이드
 const RegExpServerside2 = /<%@.*%>/g; //서버사이드
 const RegExpServersideVars = /\${.*}/g; //서버사이드 variable

 var remote = require('remote'),
   dialog = remote.require('dialog'),
   fs = require('fs'),
   hljs = require('highlight.js'),
   textNodeArray = [],
   openFileName,
   walker;

   hljs.configure({
     tabReplace: '  '
   });

 function openFile() {
   dialog.showOpenDialog({
     filters: [{
       name: 'html&jsp',
       extensions: ['html', 'jsp', 'htm']
     }],
     properties: ['openFile', 'multiSelections']
   }, function(fileNames) {
     readFiles(fileNames);
   });
 }

 function readFiles(filesNames) {
   if (filesNames === undefined) return;

   $('#results').html("");
   textNodeArray = [];

   filesNames.forEach(
     function(fileName) {
       fs.readFile(fileName, 'utf-8', function(err, data) {

         //temp = data.replace(RegExpDS,"").replace(RegExpServerside,"").replace(RegExpServerside2,"").replace(RegExpServersideVars,"");
         openFileName = fileName;
         try{
           $('#results').append("<div id='" + fileName + "_origin' style='display:none;'>" + data + "</div>");
           $('#results').append("<div id='" + fileName + "'><xmp>" + data + "</xmp></div>");
           //$('#results').append("<div id='" + fileName + "'><pre class='hljs'><code class='html'>" + hljs.highlight("html", data).value + "</code></pre></div>");
           //hljs.initHighlighting();
         }catch(e){
           //nothing
         }
         console.log("###############");
         var walker = document.createTreeWalker(document.getElementById(fileName + "_origin"), NodeFilter.SHOW_TEXT, null, false)
         while (walker.nextNode()) {
           var nodeType = walker.currentNode.nodeType;
           var nodeValue = walker.currentNode.nodeValue;

           if (nodeType == 3 && $.trim(nodeValue) != '') {
             if(RegExpDS.test(nodeValue) || RegExpServerside.test(nodeValue) || RegExpServerside2.test(nodeValue) || RegExpServersideVars.test(nodeValue)){
               //nothing
             }
             else{
                textNodeArray.push(walker.currentNode);
             }
           }  //end if
         } // end while
       });
     }
   );
 }

 function changeText() {
   var prefix = "<spring:message code='";
   var postfix = "'/>";

   textNodeArray.forEach(function addPreAndPost(node) {
     node.nodeValue = prefix + node.nodeValue + postfix;
     //node.nodeValue = "<spring:message code='test.code'/>";
     console.log(node.nodeType + "," + node.nodeValue);
     //node.innerHTML = "<b>" + node.nodeValue + "</b>";
     //console.log(node.nodeValue);
   });

   var changeContent = $(jqId(openFileName + "_origin")).html();
   //var changeContent = "<b>abcd</b>";
   try {
     $(jqId(openFileName)).html("<xmp>" + changeContent.replace(/&lt;/g, '<').replace(/&gt;/g, '>')  + "</xmp>");
     //$(jqId(openFileName)).html("<pre class='hljs'><code class='html'>" + hljs.highlight("html", changeContent).value + "</code></pre>");
     //hljs.initHighlighting();
   } catch (e) {
     console.log(e);
   }
 }

 function jqId(str) {
   return '#' + jqSelector(str);
 }

 function jqSelector(str) {
   return str.replace(/[!"#$%&'()*+,.\/:;<=>?@\[\\\]^`{|}~]/g, '\\$&');
 }
