/* ========================================================================
 * Identity Manager Cache: identify-manager-cache.js v0.1 (dojo)
 * ========================================================================
 * Encapsulation of idendity manager cache sample
 * https://developers.arcgis.com/javascript/jssamples/widget_identitymanager_client_side.html
 *
 * ======================================================================== */

define([ 
    "dojo/_base/unload",
    "dojo/cookie",
    "dojo/json",
    "esri/IdentityManager",
    "dojo/domReady!"
], function(baseUnload,
    cookie,
    JSON,
    esriId) {

    var cred = "esri_jsapi_id_manager_data";

    var autoLoad = true,
        autoSave = true;

    if (dojoConfig !== undefined) {
      var cacherConfig = dojoConfig["esriIdCacher"];
      if (cacherConfig !== undefined) {
        if (cacherConfig.hasOwnProperty("autoLoad") && 
            cacherConfig["autoLoad"] !== true) {
          autoLoad = false;
        }
        if (cacherConfig.hasOwnProperty("autoSave") && 
            cacherConfig["autoSave"] !== true) {
          autoSave = false;
        }
      }
    }

    if (autoLoad) {
      _loadCredentials();
    }

    // store credentials/serverInfos before the page unloads
    if (autoSave) {
      baseUnload.addOnUnload(_saveCredentials);      
    }

    function _loadCredentials() {
      var idJson, idObject;

      if (supports_local_storage()) {
        // read from local storage
        idJson = window.localStorage.getItem(cred);
      }
      else {
        // read from a cookie
        idJson = cookie(cred);
      }

      if (idJson && idJson != "null" && idJson.length > 4) {
        idObject = JSON.parse(idJson);
        esriId.initialize(idObject);
        return true;
      }

      // console.log("didn't find anything to load :(");
      return false;
    }

    function _saveCredentials() {
      // make sure there are some credentials to persist
      if (esriId.credentials.length === 0) {
        return;
      }

      // serialize the ID manager state to a string
      var idString = JSON.stringify(esriId.toJson());
      // store it client side
      if (supports_local_storage()) {
        // use local storage
        window.localStorage.setItem(cred, idString);
        console.log("wrote credential to local storage");
      }
      else {
        // use a cookie
        cookie(cred, idString, {expires: 1});
        console.log("wrote a credential cookie :-/");
      }
    }

    function _clearCredentials(skipIdentityManager) {
      if (supports_local_storage()) {
        window.localStorage.removeItem(cred);
      }
      else {
        cookie(cred, "", {expires: -1});
      }
      if (!skipIdentityManager) {
        esriId.destroyCredentials();
      }
    }

    function supports_local_storage() {
      try {
        return "localStorage" in window && window["localStorage"] !== null;
      } catch (e) {
        return false;
      }
    }

    return {
      loadCredentials: function() {
        return _loadCredentials();
      },
      saveCredentials: function() {
        return _saveCredentials();
      },
      clearCredentials: function(skipIdentityManager) {
        if (skipIdentityManager !== true) {
          skipIdentityManager = false;
        }
        return _clearCredentials(skipIdentityManager);
      },
      identityManager: esriId
    };
  }
);