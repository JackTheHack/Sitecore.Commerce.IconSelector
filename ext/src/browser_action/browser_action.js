css = '';
classDictionary = [];


function init() {
  var fontIcons = document.getElementById("fontIcons");
  var inputField = document.getElementById("fontFilter");
  var inputFieldApply = document.getElementById("btnApplyFilter");
  var inputFieldClear = document.getElementById("btnClearFilter");

  inputFieldApply.addEventListener("click", onFilter);
  inputFieldClear.addEventListener("click", onFilterClear);

  var startIcon = parseInt("e900", 16);
  var endIcon = 60959;

  head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

  head.appendChild(style);
  var stylesContent = '';


  for (var i = startIcon; i < endIcon; i++) {
    stylesContent += '.si-' + i.toString() + ":before{content:'\\" + i.toString(16) + "'}";

    var element = document.createElement("li");
    element.setAttribute("data-id", i.toString());
    element.setAttribute("class", "si si-" + i.toString());
    
    element.addEventListener("click", onIconCLick);
    fontIcons.appendChild(element);

    var classIndex = css.indexOf("content:\"\\" + i.toString(16).toUpperCase());
      var className = '';
      for (var f = classIndex - 1; f >= 0; f--) {
        if (css[f] === '.') {
          break;
        }
        className = css[f] + className;
      }
      className = className.replace(":before", "");
      className = className.replace("{", "");
      className = className.trim();
      classDictionary[i]=className;

      element.setAttribute("data-class", className);
  }

  console.log(classDictionary);

  style.type = 'text/css';
  if (style.styleSheet) {
    // This is required for IE8 and below.
    style.styleSheet.cssText = stylesContent;
  } else {
    style.appendChild(document.createTextNode(stylesContent));
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const url = chrome.runtime.getURL('data/icons.css');

  fetch(url)
    .then((response) => response.text())
    .then((response) => {
      css = response;
      init();
    });
});

function onIconCLick(e) {

  if (!e)
    e = window.event;
  var sender = e.srcElement || e.target;

  //maybe some nested element.. find the actual table cell parent.
  while (sender && sender.nodeName.toLowerCase() != "li")
    sender = sender.parentNode;

  var id = sender.getAttribute("data-id");
  
  console.log(id);

  var name = classDictionary[id];
  var name = name.replace("si-", "");
  
  selectIcon(name);
}

function selectElementText(el, win) {
  win = win || window;
  var doc = win.document, sel, range;
  if (win.getSelection && doc.createRange) {
      sel = win.getSelection();
      range = doc.createRange();
      range.selectNodeContents(el);
      sel.removeAllRanges();
      sel.addRange(range);
  } else if (doc.body.createTextRange) {
      range = doc.body.createTextRange();
      range.moveToElementText(el);
      range.select();
  }
}

function selectIcon(name)
{
  var selectedIconContainer = document.getElementById("selectedIconContainer");
  selectedIconContainer.style = "display:block";

  setTimeout(function(){
    var selectedIconContainer = document.getElementById("selectedIconContainer");
  selectedIconContainer.style = "display:none";
  }, 15000)

  var iconName = document.getElementById("iconName");
  iconName.innerText = name;

  var copyButton = document.getElementById("copyButton");
  copyButton.addEventListener("click", function(){
     var iconName = document.getElementById("iconName");
     /* Select the text field */
     selectElementText(iconName);

     /* Copy the text inside the text field */
     document.execCommand("copy");

    var copyButton = document.getElementById("copyButton");
    copyButton.innerText = "Copied!";

    setTimeout(function(){
      var copyButton = document.getElementById("copyButton");
      copyButton.innerText = "Copy";
    }, 3000)
  });  
}

function applyFilter(value)
{
  var fontIconsContainer = document.getElementById("fontIcons");
  for(var i=0;i<fontIconsContainer.children.length;i++){
    var fontIcon = fontIconsContainer.children[i];
    var fontIconClass = fontIcon.getAttribute("data-class");
    if(value && value.length > 0 && fontIconClass.indexOf(value) === -1)
    {
        fontIcon.style = "display:none";
    }else{
      fontIcon.style = "";
    }
  }
}

function onFilterClear(e)
{
  if (!e)
  e = window.event;

  var inputField = document.getElementById("fontFilter");
  inputField.value = "";

  applyFilter("");
}

function onFilter(e){
  if (!e)
    e = window.event;
  
  var sender = e.srcElement || e.target;

  var value = sender.value;

  var inputField = document.getElementById("fontFilter");

  var value = inputField.value;
  

  applyFilter(value);
}