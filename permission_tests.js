/*
Permissions tests for verifying that a page actually has a permission by calls to the relevant API

List of permissions originally came from AllPossiblePermissions variable in
https://mxr.mozilla.org/mozilla-central/source/dom/apps/src/PermissionsInstaller.jsm

Not all permissions are able to be tested, consuming code must check for existence
of a test (i.e. permissionsTests.hasOwnProperty(name) ) before attempting to call.

Known permission name which are do not have tests yet are commented below.
*/

// Use SpecialPowers for testing or Components.interfaces, until it is removed, then use fake object



if (typeof SpecialPowers == 'undefined') {
	SpecialPowers = {}
	if (Components && Components.interfaces) {
		SpecialPowers.Ci = Components.interfaces
	} else {
		SpecialPowers.Ci = new Proxy(Object, handler)
	}
}

//If we can't access Components.interfaces, we change the checks just to be instanceof Object.
var handler = {
  get : function(target, name) {
    return name in Object;
  }
};

var permissionTests = {
  'alarms' : {
    verify : function(success, fail) {
      try {
        if(window.navigator.mozAlarms instanceof SpecialPowers.Ci.nsIDOMMozAlarmsManager) {
          success("navigator.mozAlarms is nsIDOMMozAlarmsManager");
        } else {
          fail('navigator.mozAlarms is ' + navigator.mozAlarms);
        }
      } catch (e) {
        fail(e.name);
      }
    }
  },
  /*
   'attentionscreen': {}, // gaia permission to put content in attention screen window, not testable automatically?
   'background-sensors': {}, // allows page to listen to proximity events, probably not testable unless events can be faked.
   'backgroundservice': {}, gaiapermission to allow background service. Could install an app as a service maybe and see check to see if service is running... not sure how to do with mochitest.
   * */
  'bluetooth' : {
    verify : function(success, fail) {
      try {
        if(window.navigator.mozBluetooth instanceof SpecialPowers.Ci.nsIDOMBluetoothManager) {
          success("navigator.mozBluetooth is " + navigator.mozBluetooth);
        } else {
          fail("navigator.mozBluetooth is " + navigator.mozBluetooth);
        }
      } catch (e) {
        fail("Error:" + e.name);
      }
    }
  },
  'browser' : {
    verify : function(success, fail) {

      try {
        var iframe = document.createElement('iframe');
        iframe.mozbrowser = true;
        var element = document.body.appendChild(iframe);
        iframe.src = 'data:text/html,<html>' + '<body>testbrowserpermissionframe</body></html>';
        var hasPermission = ( typeof iframe.getScreenshot) == 'function';
        document.body.removeChild(element);
        if(hasPermission) {
          success('iframe.getScreenshot is:' + iframe.getScreenshot);
        } else {
          fail('iframe.getScreenshot is:' + iframe.getScreenshot);
        }
      } catch (e) {
        fail("Error:" + e.name);
      }
    }
  },
  'camera' : {
    verify : function(success, fail) {

      try {
        if(window.navigator.mozCameras instanceof SpecialPowers.Ci.nsIDOMCameraManager) {
          success("navigator.mozCameras is " + navigator.mozCameras);
        } else {
          fail("navigator.mozCameras is " + navigator.mozCameras);
        }
      } catch (e) {
        fail("Error:" + e.name);
      }
    }
  },
  'contacts' : {
    verify : function(success, fail) {
      try {
        req = navigator.mozContacts.find({});
        req.onsuccess = success;
        req.onerror = fail;
      } catch (e) {
        console.log('Contacts API Error:' + e);
        fail();
      }
    }
  },
  'contacts-create' : {
    verify : function(success, fail) {
      try {

        var properties1 = {
          name : "Testname1",
          familyName : ["TestFamilyName", "Wagner"],
          givenName : ["Test1", "Test2"],
          nickname : "nicktest",
          tel : [{
            type : ["work"],
            value : "123456",
            carrier : "testCarrier"
          }, {
            type : ["home", "fax"],
            value : "+9-876-5432"
          }],
          email : [{
            type : ["work"],
            value : "x@y.com"
          }]
        };

        var createResult1 = new mozContact();
        createResult1.init(properties1);
        req = navigator.mozContacts.save(createResult1)
        req.onsuccess = function(e) {
          var remReq = navigator.mozContacts.remove(createResult1);
          remReq.onsuccess = function() {
            dump('cleaned up created contact')
          };
          remReq.onsuccess = function() {
            dump('cleaned up created contact')
          };
          success("created contact");
        }
        req.onerror = fail;
      } catch (e) {
        log('Contacts API Error:' + e.name);
        fail();
      }
    }
  },
  'contacts-read' : {
    verify : function(success, fail) {
      try {
        req = navigator.mozContacts.find({});
        req.onsuccess = function(e) {
          success('called navigator.mozContacts.find({})')
        };
        req.onerror = function(e) {
          fail('error calling navigator.mozContacts.find({}):' + e.target.error.name)
        };
        ;
      } catch (e) {
        console.log('Contacts API Error:' + e);
        fail("Error:" + e.name);
      }
    }
  },
  /* // test broken, faisl on creating contact.
  'contacts-write' : {
    
    verify : function(success, fail) {
      try {
        
        var properties1 = {
          name : "Testname2"+Math.random(),
          familyName : ["TestFamilyName", "Wagner"],
          givenName : ["Test1", "Test2"],
          nickname : "nicktest",
          tel : [{
            type : ["work"],
            value : "123456",
            carrier : "testCarrier"
          }, {
            type : ["home", "fax"],
            value : "+9-876-5432"
          }],
          email : [{
            type : ["work"],
            value : "x@y.com"
          }]
        };

        var createResult1 = new mozContact();
        createResult1.init(properties1);
        createReq = navigator.mozContacts.save(createResult1)
        createReq.onsuccess = function(e) {
          dump('created ' + createResult1.id)
          createResult1.givenName = ["xxxx", "yyyy"];
          var saveReq = navigator.mozContacts.save(createResult1);
          saveReq.onsuccess = function(e) {
            //remove temp contact
            dump('saved ' + success)
            var remReq = navigator.mozContacts.remove(createResult1);
            remReq.onsuccess = function() {
              dump('cleaned up created contact')
            };
            remReq.onerror = function() {
              dump('failed to delete modified')
            };
            success("modified contact");
          }
          saveReq.onerror = function(e) {
            dump('cant create ')
            //remove temp contact
            var remReq = navigator.mozContacts.remove(createResult1);
            remReq.onsuccess = function() {
              dump('cleaned up created contact')
            };
            remReq.onerror = function(e) {
              dump('Failed to delete modified'+e.name)
            };
            fail("Failed to modify contact..."+e.name);
          }
          dump('after save;')
        }
        createReq.onerror = function() {
          fail('Cant create contact to modify.')
        }
      } catch (e) {
        fail('Error in contacts API test:' + error.name);
      }
    }
  },

  // this permission is a hack, and doesnt need a test. It wont be used by thirdparty apps.
   deprecated-hwvideo
   */
  /* can't detect succes in an automated fashion.
  'desktop-notification' : {
    verify : function(success, fail) {
      try {
        var notify = window.navigator.mozNotification;
        var notification = notify.createNotification("text", "desc");
        notification.show();
        fail('No way to test automatically, check the notification tray.')
      } catch(e) {
        fail('Error:' + error.name);
      }
    }
  },
  */
  'device-storage:apps' : {
    verify : function(success, fail) {

      try {
        req = navigator.getDeviceStorage('apps').enumerate();
        req.onsuccess = success;
        req.onerror = fail;
      } catch (e) {
        fail("Error:" + e.name);
      }
    }
  },
  /*
   device-storage:apps-create
   */

  'device-storage:apps-read' : {
    verify : function(success, fail) {

      try {
        req = navigator.getDeviceStorage('apps').enumerate();
        req.onsuccess = success;
        req.onerror = fail;
      } catch (e) {
        fail("Error:" + e.name);
      }
    }
  },
  /*
   device-storage:apps-write
   */
  'device-storage:music' : {
    verify : function(success, fail) {

      try {
        req = navigator.getDeviceStorage('music').enumerate();
        req.onsuccess = success;
        req.onerror = fail;
      } catch (e) {
        fail("Error:" + e.name);
      }
    }
  },
  /*
   device-storage:music-create
   */
  'device-storage:music-read' : {
    verify : function(success, fail) {

      try {
        req = navigator.getDeviceStorage('music').enumerate();
        req.onsuccess = success;
        req.onerror = fail;
      } catch (e) {
        fail("Error:" + e.name);
      }
    }
  },

  /*
   device-storage:music-write
   */
  'device-storage:pictures' : {
    verify : function(success, fail) {
      try {
        req = navigator.getDeviceStorage('pictures').enumerate();
        req.onsuccess = success;
        req.onerror = fail;
      } catch (e) {
        fail("Error:" + e.name);
      }

    }
  },
  /*
   device-storage:pictures-create
   */
  'device-storage:pictures-read' : {
    verify : function(success, fail) {
      try {
        req = navigator.getDeviceStorage('pictures').enumerate();
        req.onsuccess = success;
        req.onerror = fail;
      } catch (e) {
        fail("Error:" + e.name);
      }

    }
  },
  /*
   device-storage:pictures-write
   */
  'device-storage:sdcard' : {
    verify : function(success, fail) {
      try {
        req = navigator.getDeviceStorage('sdcard').enumerate();
        req.onsuccess = success;
        req.onerror = fail;
      } catch (e) {
        fail("Error:" + e.name);
      }

    }
  },
  /*
   device-storage:sdcard-create
   */
  'device-storage:sdcard-read' : {
    verify : function(success, fail) {
      try {
        req = navigator.getDeviceStorage('sdcard').enumerate();
        req.onsuccess = success;
        req.onerror = fail;
      } catch (e) {
        fail("Error:" + e.name);
      }
    }
  },
  /*
   device-storage:sdcard-write
   */
  'device-storage:videos-read' : {
    verify : function(success, fail) {
      try {
        req = navigator.getDeviceStorage('videos').enumerate();
        req.onsuccess = success;
        req.onerror = fail;
      } catch (e) {
        fail("Error:" + e.name);
      }

    }
  },
  /*
   device-storage:videos-create
   */
  'device-storage:videos-read' : {
    verify : function(success, fail) {
      try {
        req = navigator.getDeviceStorage('videos').enumerate();
        req.onsuccess = success;
        req.onerror = fail;
      } catch (e) {
        fail("Error:" + e.name);
      }

    }
  },

  /*
   device-storage:videos-write
*/
   // this test doesnt work yet, titlechange event isnt caught...
   
  'embed-apps': { verify: function(success,fail) {
      try {
        var iframe = document.createElement('iframe');
        iframe.mozbrowser = true;
        iframe.mozapp = 'http://clock.gaiamobile.org';
        var element = document.body.appendChild(iframe);

        var isMozBrowser = ( typeof iframe.getScreenshot) == 'function';
        if(!isMozBrowser) {
          fail("App doesnt have mozbrowser permission, so can't embed apps");
          document.body.removeChild(element);
          return;
        }
        // this is a hack: there must be a better way for child -> parent communication from an mozbrowser iframe
        iframe.addEventListener('mozbrowsertitlechange', function(e) {
          for(i in e){
            dump(i+":"+e[i])
          }
          document.body.removeChild(element);
          success("getSelf returns an app"+e.detail);
        });
        iframe.addEventListener('mozbrowsererror', function(e) {
          document.body.removeChild(element);
          fail(e.name);
        });
        
        var script = 'var request = window.navigator.mozApps.getSelf(); request.onsuccess=function(e){if(request.result){document.title=true} else {document.title=false}};request.onerror=function(e){new Error(123)};'
        iframe.src = 'data:text/html,<html><script>' + script + '</script><body>testbrowserpermissionframe</body></html>';
      } catch (e) {
        fail("Error:" + e.name);
      }
    }

  },
  'fmradio' : {
    verify : function(success, fail) {
      try {
        if(window.navigator.mozFMRadio instanceof SpecialPowers.Ci.nsIDOMFMRadio) {
          success();
        } else {
          fail();
        }
      } catch (e) {
        fail("Error:" + e.name);
      }

    }
  },
 
   /*
   'geolocation': {
   verify: function(success, fail) {
   try {

   //note this test might not call either success() or fail()
   window.gotGeo = false;
   navigator.geolocation.getCurrentPosition(function(e) {
   success("got "+e);
   }, function(e) {
   
   fail("Error:"+e.name);
   });
   
   } catch (e) {
   fail("Error:"+e.name);
   }

   }
   },
   
   idle
   indexedDB-chrome-settings
   indexedDB-chrome-settings-read
   indexedDB-chrome-settings-write
   indexedDB-unlimited
   keyboard
   */
  'mobileconnection' : {
    verify : function(success, fail) {
      try {
        if(window.navigator.mozMobileConnection instanceof SpecialPowers.Ci.nsIDOMMozMobileConnection) {
          success();
        } else {
          fail();
        }
      } catch (e) {
        fail("Error:" + e.name);
      }
    }
  },
  /*
'network-events' : {
    verify : function(success, fail) {
       var element;
      try {
        
        //we just test one since this is enough to prove the permission is present
        addEventListener('moznetworkupload', function(e){
          document.body.removeChild(Error.target)
          success('caught moznetworkupload event'+e.name)
        });
      const TEST_URL = "http://www.mozilla.org";
        var iframe = document.createElement('iframe');
        iframe.src = TEST_URL
        element = document.body.appendChild(iframe);
             
        
      } catch (e) {
        fail("Error:" + e.name);
      }

    }
  },
  */
  'networkstats-manage' : {
    verify : function(success, fail) {

      try {
        if(window.navigator.mozNetworkStats instanceof SpecialPowers.Ci.nsIDOMMozNetworkStatsManager) {
          success();
        } else {
          fail();
        }
      } catch (e) {
        fail("Error:" + e.name);
      }

    }
  },
  /*
   offline-app
   */
  'permissions' : {
    verify : function(success, fail) {

      try {
        if(window.navigator.mozPermissionSettings instanceof SpecialPowers.Ci.nsIDOMPermissionSettings) {
          success();
        } else {
          fail();
        }
      } catch (e) {
        fail("Error:" + e.name);
      }

    }
  },
  /*
   pin-app
   */
  'power' : {
    verify : function(success, fail) {

      try {
        if(window.navigator.mozPower instanceof SpecialPowers.Ci.nsIDOMMozPowerManager) {
          success();
        } else {
          fail();
        }
      } catch (e) {
        fail("Error:" + e.name);
      }

    }
  },
  /*
   push //afaict this is never used
   resource-lock //afaict this is never used
   */
  'settings' : {
    verify : function(success, fail) {
      try {
        var lock = navigator.mozSettings.createLock();
        req = lock.get('screen.automatic-brightness');
        req.onsuccess = success;
        req.onerror = fail;
      } catch (e) {
        fail("Error:" + e.name);
      }
    }
  },
  'settings-read' : {
    verify : function(success, fail) {
      try {
        var lock = navigator.mozSettings.createLock();
        req = lock.get('screen.automatic-brightness');
        req.onsuccess = success;
        req.onerror = fail;
      } catch (e) {
        fail("Error:" + e.name);
      }
    }
  },
  'settings-write' : {
    verify : function(success, fail) {
      try {
        var lock = navigator.mozSettings.createLock();
        req = lock.set({'screen.automatic-brightness':1.0});
        req.onsuccess = success;
        req.onerror = fail;
      } catch (e) {
        fail("Error:" + e.name);
      }
    }
  },
  'sms' : {
    verify : function(success, fail) {
      try {
        if(window.navigator.mozSms instanceof SpecialPowers.Ci.nsIDOMMozSmsManager) {
          success();
        } else {
          fail();
        }
      } catch (e) {
        fail("Error:" + e.name);
      }

    }
  },
  'systemXHR' : {
    verify : function(success, fail) {
      const TEST_URL = "http://example.com/tests/content/base/test/test_XHR_system.html";
      var xhr = new XMLHttpRequest({
        mozSystem : true
      });

      xhr.open("GET", TEST_URL);
      xhr.onload = function onload() {
        if(xhr.status == 200)
          success('made cross-domain XHR request');
        else
          fail('XHR request returned something other than 200')
      };
      xhr.onerror = function onerror() {
        fail('couldnt make cross-domain XHR request');
      }
      xhr.send();

    }
  },
  'tcp-socket' : {
    verify : function(success, fail) {

      try {
        var sock=navigator.mozTCPSocket.open('www.mozilla.org', 80);
        sock.onopen = function(e) {
          success('connected to port 80')
        }
        sock.onclose = function(e) {
          fail('port was closed, but open was attempted')
        }
        sock.onerror = function(e) {
          fail('error occured opening socket' + e.name)
        }
      } catch (e) {
        fail("Error occured:" + e.name);
      }

    }
  },
  'telephony' : {
    verify : function(success, fail) {

      try {
        if(window.navigator.mozTelephony instanceof SpecialPowers.Ci.nsIDOMTelephony) {
          success(window.navigator.mozTelephony);
        } else {
          fail(window.navigator.mozTelephony);
        }
      } catch (e) {
        fail("Error:" + e.name);
      }

    }
  },
  'time' : {
    verify : function(success, fail) {

      try {
        if(window.navigator.mozTime instanceof SpecialPowers.Ci.nsIDOMMozTimeManager) {
          success();
        } else {
          fail();
        }
      } catch (e) {
        fail("Error:" + e.name);
      }

    }
  },
  'voicemail' : {
    verify : function(success, fail) {

      try {
        if(window.navigator.mozVoicemail instanceof SpecialPowers.Ci.nsIDOMMozVoicemail) {
          success();
        } else {
          fail();
        }
      } catch (e) {
        fail("Error:" + e.name);
      }
    }
  },
  'webapps-manage' : {
    verify : function(success, fail) {

      try {
        req = navigator.mozApps.mgmt.getAll();
        req.onsuccess = success;
        req.onerror = fail;
      } catch (e) {
        console.log('WebApps manage API Error:' + e);
        fail();
      }

    }
  },
  'wifi-manage' : {
    verify : function(success, fail) {
      if ('mozWifiManager' in window.navigator) {
        try {
          if(window.navigator.mozWifiManager instanceof SpecialPowers.Ci.nsIDOMWifiManager) {
            success();
          } else {
            fail();
          }
        } catch (e) {
          fail("Error:" + e.name);
        }
    }
    else {
            fail("No wifi available on your device");
    }
    }
  },
  /*
   wifi // this is being removed
   */
};


