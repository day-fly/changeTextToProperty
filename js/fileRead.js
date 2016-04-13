 'use strict';
 window.$ = window.jQuery = require('jquery');
 //import extractText.js
 //document.write("<script src='js/extractText.js'></script>");
 //document.write("<script src='js/domTreeWalker.js'></script>");



 var remote = require('remote'),
   dialog = remote.require('dialog'),
   walk = require('walk'),
   fs = require('fs'),
   options, walker;

 options = {
   followLinks: false
     // directories with these keys will be skipped
     ,
   filters: ["Temp", "_Temp"]
 };

 function openFile() {

   $('#results').html("");

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

 var temp = [];

 function readFiles(filesNames) {
   if (filesNames === undefined) return;
   filesNames.forEach(
     function(fileName) {
       fs.readFile(fileName, 'utf-8', function(err, data) {
         //var RegExpDS = /<!--[^>](.*?)-->/g; //주석
         //var RegExpServerside = /<%[^>](.*?)%>/g; //서버사이드
         //var RegExpServerside2 = /<%@.*%>/g; //서버사이드
         //var RegExpServersideVars = /\${.*}/g; //서버사이드 variable
         //temp = data.replace(RegExpDS,"").replace(RegExpServerside,"").replace(RegExpServerside2,"").replace(RegExpServersideVars,"");

         $('#results').append("<div id='" + fileName + "'>" + data + "</div>");

         var walker = document.createTreeWalker(document.getElementById(fileName), NodeFilter.SHOW_TEXT, null, false)
         while (walker.nextNode()) {
           if(walker.currentNode.nodeType == 3 && $.trim(walker.currentNode.nodeValue) != ''){
             //console.log(document.createRange().selectNodeContents(walker.currentNode.parentNode));

             temp.push(walker.currentNode);
             //walker.currentNode.nodeValue = "<spring:message>" + walker.currentNode.nodeValue + "</spring:message>";
             //console.log("###:" + walker.currentNode.nodeValue);
           }
           //console.log(walker.currentNode);
           //console.log("###" + walker.currentNode.nodeValue) //alerts P, SPAN, and B.
           //console.log(walker.currentNode.parentNode) //alerts P, SPAN, and B.
         }

         for(var i=0 ; i < temp.length ; i++){
           temp[i].nodeValue = "<spring:message>" +  temp[i].nodeValue+ "</spring:message>";
         }

         console.log($('#' + fileName).html());
         /*
         tour(
           function complte() {
             document.getElementById('results').innerHTML += 'completed!';
           },
           document.getElementById(fileName),
           function action(el) {
             console.log("@@@" + el.nodeType + "@@@");
             console.log(el);
             if (el.nodeType == 3)
               document.getElementById('results').innerHTML += el.nodeValue + '<br>';
           }
         );
         */


         //document.getElementById("editor").value = data;
       });
     }
   );
 }

 //확장기능을 위한 구현부 (현재 보류)
 /*
  function callWalker(fileNames) {
    walker = walk.walk(fileNames, options);

    walker.on("names", function(root, nodeNamesArray) {
      nodeNamesArray.sort(function(a, b) {
        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
      });
    });

    walker.on("directories", function(root, dirStatsArray, next) {
      // dirStatsArray is an array of `stat` objects with the additional attributes
      // * type
      // * error
      // * name
      next();
    });

    walker.on("file", function(root, fileStats, next) {
      fs.readFile(fileStats.name, function() {
        // doStuff
        next();
      });
    });

    walker.on("errors", function(root, nodeStatsArray, next) {
      next();
    });

    walker.on("end", function() {
      console.log("all done");
    });
  }
  */
