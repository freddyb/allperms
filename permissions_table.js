const UNKNOWN_ACTION = 0;
// Ci.nsIPermissionManager.UNKNOWN_ACTION;
const ALLOW_ACTION = 1;
//Ci.nsIPermissionManager.ALLOW_ACTION;
const DENY_ACTION = 2;
// Ci.nsIPermissionManager.DENY_ACTION;
const PROMPT_ACTION = 3;
//Ci.nsIPermissionManager.PROMPT_ACTION;

// Permission access flags
const READONLY = "readonly";
const CREATEONLY = "createonly";
const READCREATE = "readcreate";
const READWRITE = "readwrite";

// list of all expanded permissions
const ALLPERMS = ["alarms", "attention", "background-sensors", "backgroundservice", "bluetooth", "browser", "camera", "contacts", "contacts-create", "contacts-read", "contacts-write", "deprecated-hwvideo", "desktop-notification", "device-storage:apps", "device-storage:apps-create", "device-storage:apps-read", "device-storage:apps-write", "device-storage:music", "device-storage:music-create", "device-storage:music-read", "device-storage:music-write", "device-storage:pictures", "device-storage:pictures-create", "device-storage:pictures-read", "device-storage:pictures-write", "device-storage:sdcard", "device-storage:sdcard-create", "device-storage:sdcard-read", "device-storage:sdcard-write", "device-storage:videos", "device-storage:videos-create", "device-storage:videos-read", "device-storage:videos-write", "embed-apps", "fmradio", "geolocation", "idle", "indexedDB-chrome-settings", "indexedDB-chrome-settings-read", "indexedDB-chrome-settings-write", "indexedDB-unlimited", "keyboard", "mobileconnection", "network-events", "networkstats-manage", "offline-app", "permissions", "pin-app", "power", "settings", "settings-read", "settings-write", "sms", "systemXHR", "tcp-socket", "telephony", "time", "voicemail", "webapps-manage", "wifi-manage"];
//table which shows which permissions are allowed at each level
var PermissionsTable = {
  "resource-lock" : {
    app : ALLOW_ACTION,
    privileged : ALLOW_ACTION,
    certified : ALLOW_ACTION
  },
  geolocation : {
    app : PROMPT_ACTION,
    privileged : PROMPT_ACTION,
    certified : ALLOW_ACTION
  },
  camera : {
    app : DENY_ACTION,
    privileged : PROMPT_ACTION,
    certified : ALLOW_ACTION
  },
  alarms : {
    app : ALLOW_ACTION,
    privileged : ALLOW_ACTION,
    certified : ALLOW_ACTION
  },
  "tcp-socket" : {
    app : DENY_ACTION,
    privileged : ALLOW_ACTION,
    certified : ALLOW_ACTION
  },
  "network-events" : {
    app : DENY_ACTION,
    privileged : DENY_ACTION,
    certified : ALLOW_ACTION
  },
  contacts : {
    app : DENY_ACTION,
    privileged : PROMPT_ACTION,
    certified : ALLOW_ACTION,
    access : ["read", "write", "create"]
  },
  "device-storage:apps" : {
    app : DENY_ACTION,
    privileged : PROMPT_ACTION,
    certified : ALLOW_ACTION,
    access : ["read", "write", "create"]
  },
  "device-storage:pictures" : {
    app : DENY_ACTION,
    privileged : PROMPT_ACTION,
    certified : ALLOW_ACTION,
    access : ["read", "write", "create"]
  },
  "device-storage:videos" : {
    app : DENY_ACTION,
    privileged : PROMPT_ACTION,
    certified : ALLOW_ACTION,
    access : ["read", "write", "create"]
  },
  "device-storage:music" : {
    app : DENY_ACTION,
    privileged : PROMPT_ACTION,
    certified : ALLOW_ACTION,
    access : ["read", "write", "create"]
  },
  "device-storage:sdcard" : {
    app : DENY_ACTION,
    privileged : PROMPT_ACTION,
    certified : ALLOW_ACTION,
    access : ["read", "write", "create"]
  },
  sms : {
    app : DENY_ACTION,
    privileged : DENY_ACTION,
    certified : ALLOW_ACTION
  },
  telephony : {
    app : DENY_ACTION,
    privileged : DENY_ACTION,
    certified : ALLOW_ACTION
  },
  browser : {
    app : DENY_ACTION,
    privileged : ALLOW_ACTION,
    certified : ALLOW_ACTION
  },
  bluetooth : {
    app : DENY_ACTION,
    privileged : DENY_ACTION,
    certified : ALLOW_ACTION
  },
  wifi : {
    app : DENY_ACTION,
    privileged : PROMPT_ACTION,
    certified : ALLOW_ACTION
  },
  keyboard : {
    app : DENY_ACTION,
    privileged : DENY_ACTION,
    certified : ALLOW_ACTION
  },
  mobileconnection : {
    app : DENY_ACTION,
    privileged : DENY_ACTION,
    certified : ALLOW_ACTION
  },
  power : {
    app : DENY_ACTION,
    privileged : DENY_ACTION,
    certified : ALLOW_ACTION
  },
  push : {
    app : DENY_ACTION,
    privileged : DENY_ACTION,
    certified : ALLOW_ACTION
  },
  settings : {
    app : DENY_ACTION,
    privileged : DENY_ACTION,
    certified : ALLOW_ACTION,
    access : ["read", "write"],
    additional : ["indexedDB-chrome-settings"]
  },
  permissions : {
    app : DENY_ACTION,
    privileged : DENY_ACTION,
    certified : ALLOW_ACTION
  },
  fmradio : {
    app : ALLOW_ACTION,
    // Matrix indicates '?'
    privileged : ALLOW_ACTION,
    certified : ALLOW_ACTION
  },
  attention : {
    app : DENY_ACTION,
    privileged : DENY_ACTION,
    certified : ALLOW_ACTION
  },
  "webapps-manage" : {
    app : DENY_ACTION,
    privileged : DENY_ACTION,
    certified : ALLOW_ACTION
  },
  "backgroundservice" : {
    app : DENY_ACTION,
    privileged : DENY_ACTION,
    certified : ALLOW_ACTION
  },
  "desktop-notification" : {
    app : DENY_ACTION,
    privileged : DENY_ACTION,
    certified : ALLOW_ACTION
  },
  "networkstats-manage" : {
    app : DENY_ACTION,
    privileged : DENY_ACTION,
    certified : ALLOW_ACTION
  },
  "mozBluetooth" : {
    app : DENY_ACTION,
    privileged : DENY_ACTION,
    certified : ALLOW_ACTION
  },
  "wifi-manage" : {
    app : DENY_ACTION,
    privileged : DENY_ACTION,
    certified : ALLOW_ACTION
  },
  "systemXHR" : {
    app : DENY_ACTION,
    privileged : ALLOW_ACTION,
    certified : ALLOW_ACTION
  },
  "voicemail" : {
    app : DENY_ACTION,
    privileged : DENY_ACTION,
    certified : ALLOW_ACTION
  },
  "deprecated-hwvideo" : {
    app : DENY_ACTION,
    privileged : DENY_ACTION,
    certified : ALLOW_ACTION
  },
  "idle" : {
    app : DENY_ACTION,
    privileged : DENY_ACTION,
    certified : ALLOW_ACTION
  },
  "time" : {
    app : DENY_ACTION,
    privileged : DENY_ACTION,
    certified : ALLOW_ACTION
  },
  "embed-apps" : {
    app : DENY_ACTION,
    privileged : DENY_ACTION,
    certified : ALLOW_ACTION
  },
  "storage" : {
    app : DENY_ACTION,
    privileged : DENY_ACTION,
    certified : ALLOW_ACTION,
    substitute : ["indexedDB-unlimited", "offline-app", "pin-app"]
  },
  "background-sensors" : {
    app : DENY_ACTION,
    privileged : DENY_ACTION,
    certified : ALLOW_ACTION
  },
};
