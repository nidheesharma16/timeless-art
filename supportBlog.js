$("#accordion").accordion();

const addCSS = css => document.head.appendChild(document.createElement("style")).innerHTML = css;
// var content = '\2304';
var customCss = ".heading-10.ui-accordion-header:after {    content: '\u2303';  font-weight: bold;  float: right;  margin-left: 5px; }" +
    ".heading-10.ui-accordion-header-active:after {    content: '\u2304';  }";
addCSS(customCss);
