var content;
var tests = [];
var running=false;
var currentPerm = '';
var timeout;

function install(e) {
  var manifest=e.target.getAttribute('manifest')
  console.log(e);
  if(window.location.host.match('creativemisuse.com')){
    manifest=manifest.replace(".web/",".creativemisuse.com/");
  }
  try {
    var r = navigator.mozApps.install(manifest)
    r.onerror = function() {
      alert('Error installing:' + r.error.name)
    }
    r.onsuccess = function() {
      alert('App installed')
    }
  } catch(e) {
    alert("Error installing:" + e.name)
  }
}

function go() {
  //alert(1);
  content = document.getElementById('content');
  log('running all tests.\n')
 
  for(var idx = 0; idx < ALLPERMS.length; idx++) {
    if(permissionTests[ALLPERMS[idx]]) {
      tests.push(ALLPERMS[idx]);
    }
  }
  next();
}

function next(){
  running=true;
  
  currentPerm = tests.shift();
  dump(currentPerm+"\n");
  if(currentPerm){
    //timeout=setTimeout('report_fail("timeout")',1500);
    permissionTests[currentPerm].verify(report_success, report_fail);
  }
  else {
    log("All tests done.");
  }
}

function report_success(msg) {
  
  log("Testing " + currentPerm + ": has permission. (" + msg + ")");
  mark(currentPerm,true);     
  running=false;
  //clearTimeout(timeout);
  next();
}

//fail
function report_fail(msg) {

  log("Testing " + currentPerm + ": no permission. (" + msg + ")");
  mark(currentPerm,false);   
  running=false;
  //clearTimeout(timeout);
  next();
}


//for calling individual tests
function callTest(e) {
  var perm = e.target.textContent;
  
  permissionTests[perm].verify(function success(msg) {
    if( msg instanceof Event) {
      msg = "DomRequest onsuccess:" + msg.target.result;
    }
    log("Testing " + perm + ": has permission. (" + msg + ")");
    mark(perm, true);
  }, function fail(msg) {
    if( msg instanceof Event) {
      msg = "DomRequest onerror:" + msg.target.error.name
    }
    log("Testing " + perm + ": no permission. (" + msg + ")");
    mark(perm, false);
  });


}

// colorize the li to reflect the test result
function mark(perm , status) {
  color = status == true ? 'lightgreen' : 'pink'
  li = document.getElementById(perm);
  li.setAttribute('style', 'background-color:' + color);
}


//write to output panel
function log(message) {
  var output = document.getElementById('output');
  output.textContent += message + "\n";
}
function clearlog(){
  var output = document.getElementById('output');
  output.textContent='';
}
//creating buttons for individual tests
function addTest(perm) {
  //var html="<button onclick=permissionTests["+perm+"].verify>"+perm+"</button>";
  var list = document.getElementById('testlist');
  var li = document.createElement("li");
  li.setAttribute('id',perm);
  var button = document.createElement("a");
  button.setAttribute('href', '#panel3');
  button.addEventListener('click', callTest)
  button.textContent = perm;

  li.appendChild(button);
  list.appendChild(li)
}

function loadTests() {
  window.location.hash=window.location.hash?window.location.hash:"panel1";
 
  document.getElementById('installers').addEventListener('click',install)
  document.getElementById('alltests').addEventListener('click',go);
  document.getElementById('clearlog').addEventListener('click',clearlog);
  
  content = document.getElementById('content');
  dump('here')
  for(var idx = 0; idx < ALLPERMS.length; idx++) {
    if(permissionTests[ALLPERMS[idx]]) {
      //tests.push(ALLPERMS[idx]);
      addTest(ALLPERMS[idx]);
    }
  }
}

window.addEventListener('load',loadTests);



