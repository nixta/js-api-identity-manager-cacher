# ArcGIS JS API Credential Caching

Caches ArcGIS JavaScript API credentials so you don't have to re-enter them on every refresh.

This repo encapuslates the ArcGIS JavaScript API's sample found [here](https://developers.arcgis.com/javascript/jssamples/widget_identitymanager_client_side.html) into a simple-to-integrate AMD Loadable Dojo component. The sample is part of the 3.x samples, but this component works with 4.x and 3.x APIs.

[Live Sample](http://nixta.github.io/js-api-identity-manager-cacher/samples/sample-4x.html)


## Usage
To use, simply add a `<script>` tag *before* you reference the JS API to let the Dojo loader know where to find the `cacher` component (or update any existing `dojoConfig` setup to include a packages array with an appropriate entry):

``` JavaScript
<script type="text/javascript">
var dojoConfig = {
  packages: [
  {
    name: "identity-manager-cacher",
    location: "http://nixta.github.io/js-api-identity-manager-cacher/js/4.x"
  }]
};
</script>

<script src="https://js.arcgis.com/4.0/"></script>
```

Then simple reference the `cacher` in your Dojo `require` call:

``` JavaScript
<script>
  require(["esri/Map",
          "esri/views/SceneView",
          "esri/layers/MapImageLayer",
          "identity-manager-cacher/cacher",
          "dojo/domReady!"],
    function(Map, SceneView, MapImageLayer) {
  ...
```

That's all you need to do by default.

### Hosting and Component Location
The above example references the component hosted on GitHub. Note that GitHub may rate limit you (or I might rename/move the repo) so it's better to host this yourself. To reference a file in a `js/4.x` folder at the same location as your HTML file, use something like this:

``` JavaScript
    location: location.pathname.replace(/\/[^/]+$/, "/") + "./js/4.x"
```


## Behavior
By default, the component will load any saved credentials during the `require` and automatically save any credentials when the page unloads. It makes use of the `esri/identity/IdentityManager` to do so (see [here](https://developers.arcgis.com/javascript/latest/api-reference/esri-identity-IdentityManager.html)).

If you need to control when the component loads and saves credentials, see the configuration overrides below.


## Configuration
Add an `esriIdCacher` property to your global dojoConfig variable:

```JavaScript
<script type="text/javascript">
var dojoConfig = {
  ...
  esriIdCacher: {
    autoLoad: false, // optional
    autoSave: false  // optional
  }
};
</script>
```

The following properties are supported:

| Property   | Default | Description |
| ---------- | ------- | ----------- |
| `autoLoad` | `true`  | Automatically find and load stored credentials during the `require` call. |
| `autoSave` | `true`  | Automatically save credentials to local storage (falling back to a cookie) when the page unloads. |

If you disabled `autoLoad` or `autoSave`, you can modify your `require` statement to get a handle to the IdCacher, which you'll need to hook up to for load and save functionality. The following functions are provided for manual control of credential storage.

| Function                 | Usage                                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| `loadCredentials()`      | Use this to initialize the singleton `IdentityManager` with cached credentials.          |
| `saveCredentials()`      | Use this to store `IdentityManager` state for rehydration later with `loadCredentials()` |
| `clearCredentials(bool)` | Use this to clear out stored credentials. Default behavior is to also call `destroyCredentials()` on the singleton IdentityManager. Pass `false` as the first parameter to leave IdentityManager state untouched. |

`loadCredentials()` returns a boolean describing whether any stored credentials were found.

The singleton `esri/IdentityManager` is also exposed via the `identityManager` property on the IdCacher.

Here's an example of explicitly loading credentials rather than relying on the auto-load.

```JavaScript
<script type="text/javascript">
var dojoConfig = {
  packages: [
  {
    name: "identity-manager-cacher",
    location: "http://nixta.github.io/js-api-identity-manager-cacher/js/4.x"
  }],
  esriIdCacher: {
    autoLoad: false
  }
};
</script>

<script src="https://js.arcgis.com/4.0/"></script>

<script>
  var map, view;
  require(["esri/Map",
          "esri/views/SceneView",
          "esri/layers/MapImageLayer",
          "identity-manager-cacher/cacher",
          "dojo/domReady!"],
    function(Map, SceneView, MapImageLayer) {

  	var credentialsFound = IdCacher.loadCredentials();
  	console.log("Found credentials? " + credentialsFound);
```


## 3.X JavaScript API
To use the component with the 3.x JavaScript API, simply modify the `location` property:

``` JavaScript
    location: "http://nixta.github.io/js-api-identity-manager-cacher/js/3.x"
```

[Live 3.x Sample](http://nixta.github.io/js-api-identity-manager-cacher/samples/sample-3x.html)

For the 3.x JavaScript API, it uses the `esri/IdentityManager` (see [here](https://developers.arcgis.com/javascript/jsapi/identitymanager-amd.html))


## Links & References

* [Original 3.x JS API Sample](https://developers.arcgis.com/javascript/jssamples/widget_identitymanager_client_side.html).
* `esri/identity/IdentityManager` [reference](https://developers.arcgis.com/javascript/latest/api-reference/esri-identity-IdentityManager.html)
* 3.x `esri/IdentityManager` [reference](https://developers.arcgis.com/javascript/jsapi/identitymanager-amd.html).
* [Live 4.x Sample](http://nixta.github.io/js-api-identity-manager-cacher/samples/sample-4x.html).
* [Live 3.x Sample](http://nixta.github.io/js-api-identity-manager-cacher/samples/sample-3x.html).


## Licensing
Copyright 2016 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt]( https://raw.github.com/Esri/arcgis-runtime-samples-ios/master/license.txt) file.
