'use strict';
//window.$ = window.jQuery = require('jquery');
//import extractText.js
//document.write("<script src='js/extractText.js'></script>");
//document.write("<script src='js/domTreeWalker.js'></script>");

const RegExpURL = /<(script|link|img)\s[^>]*?(href|src)\s*=\s*['\"]([^'\"]*?)['\"][^>]*?>/g //link-css
const RegExpScript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi //script
const RegExpDS = /<!--[^>](.*?)-->/g //주석
const RegExpServerside = /<%[^>](.*?)%>/g //서버사이드
const RegExpServerside2 = /<%@.*%>/g //서버사이드
const RegExpServersideVars = /\${.*}/g //서버사이드 variable
const {
  dialog
} = require('electron').remote

const $code = document.getElementById('code')
let $_code = document.getElementById('_code')

let fs = require('fs'),
  textNodeArray = [],
  openFileName,
  walker,
  regExpInfoArr = [];

//init regExpInfoArr
regExpInfoArr.push(RegExpURL)
regExpInfoArr.push(RegExpScript)
regExpInfoArr.push(RegExpDS)
regExpInfoArr.push(RegExpServerside)
regExpInfoArr.push(RegExpServerside2)
regExpInfoArr.push(RegExpServersideVars)


function openFile() {
  dialog.showOpenDialog({
    filters: [{
      name: 'html&jsp',
      extensions: ['html', 'jsp', 'htm']
    }],
    properties: ['openFile', 'multiSelections']
  }, function(fileNames) {
    readFiles(fileNames)
  });
}

function readFiles(filesNames) {
  if (filesNames === undefined) return;

  $_code.innerHTML = ''
  $code.innerHTML = ''
  textNodeArray = []

  filesNames.forEach(
    function(fileName) {
      fs.readFile(fileName, 'utf-8', function(err, data) {
        openFileName = fileName
        let replaceData = data
        regExpInfoArr.forEach(function(regExpInfo) {
          replaceData = replaceData.replace(regExpInfo, "")
        })
        $_code.innerHTML = replaceData
        $code.innerHTML = '<xmp>' + data + '</xmp>'
        walkInFile();
      });
    }
  );
}

function walkInFile() {
  var walker = document.createTreeWalker($_code, NodeFilter.SHOW_TEXT, null, false)
  while (walker.nextNode()) {
    var nodeType = walker.currentNode.nodeType;
    var nodeValue = walker.currentNode.nodeValue.trim()
    if (nodeType == 3 && nodeValue != '') {
      let checked = false
      console.log(nodeValue)
      for (let i = 0, item; item = regExpInfoArr[i]; i++) {
        if (item.test(nodeValue)) {
          checked = true
        }
      }
      if (!checked) {
        console.log("if : " + nodeValue);
        textNodeArray.push(walker.currentNode);
      }
    } //end if
  } // end while
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
}
