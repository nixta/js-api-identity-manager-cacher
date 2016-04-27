# ArcGIS JS API Credential Caching

This repo encapuslates the ArcGIS JavaScript API's sample found [here](https://developers.arcgis.com/javascript/jssamples/widget_identitymanager_client_side.html) into a simple-to-integrate AMD Loadable Dojo component.

[Live Sample](http://nixta.github.io/js-api-identity-manager-cacher/)


## Usage
To use, simply add a `<script>` tag *before* you reference the JS API to let the Dojo loader know where to find the `cacher` component (or update any existing `dojoConfig` setup to include a packages array with an appropriate entry):

``` JavaScript
<script type="text/javascript">
var dojoConfig = {
  packages: [
  {
    name: "identity-manager-cacher",
    location: "http://nixta.github.io/js-api-identity-manager-cacher/lib/dojo"
  }]
};
</script>
```

Then simple reference the `cacher` in your Dojo `require` call:

``` JavaScript
require(["esri/map",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "identity-manager-cacher/cacher",
        "dojo/domReady!"],
  function(Map, ArcGISDynamicMapServiceLayer) {
  ...
```

That's all you need to do by default.

### Hosting and Component Location
In the above example, the component hosted on GitHub is referenced. Note that GitHub may rate limit you (or I might rename/move the repo) so it's better to host this yourself. To reference a file in a `dojo/lib` folder at the same location as your HTML file, use something like this:

``` JavaScript
    location: location.pathname.replace(/\/[^/]+$/, "/") + "./lib/dojo"
```


## Behavior
By default, the component will load any saved credentials during the `require` and automatically save any credentials when the page unloads. It makes use of the `esri/IdentityManager` to do so (see [here](https://developers.arcgis.com/javascript/jsapi/identitymanager-amd.html)).

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
    location: "http://nixta.github.io/js-api-identity-manager-cacher/lib/dojo"
  }],
  esriIdCacher: {
    autoLoad: false
  }
};
</script>

<script src="http://js.arcgis.com/3.16compact/"></script>

<script>
var map;
require(["esri/map",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "identity-manager-cacher/cacher",
        "dojo/domReady!"],
  function(Map, ArcGISDynamicMapServiceLayer, IdCacher) {

  	var credentialsFound = IdCacher.loadCredentials();
  	console.log("Found credentials? " + credentialsFound);
```

## Links & References

* [Original JS API Sample](https://developers.arcgis.com/javascript/jssamples/widget_identitymanager_client_side.html).
* `esri/IdentityManager` [reference](https://developers.arcgis.com/javascript/jsapi/identitymanager-amd.html).
* [Live example](http://nixta.github.io/js-api-identity-manager-cacher/).


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
