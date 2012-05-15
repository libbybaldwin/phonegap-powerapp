# PhoneGap PowerApp

## PhoneGap App for Android Project (Eclipse): PowerApp
Works as a Stand-alone App or with [PhoneGap PowerApp Node.js Server](https://github.com/libbybaldwin/phonegap-powerapp-nodejs)

### The App Includes:

* **PhoneGap** - [phonegap.com](phonegap.com)
* **jQuery Mobile** - [jquerymobile.com](jquerymobile.com)
* **Maps** - Google Maps [JavaScript API v3](https://developers.google.com/maps/documentation/javascript/reference)
* **PhoneGap Plugins** - ChildBrowser, Barcode Scanner
* **jQuery Plugins** - [jQuery Google Maps Plugin](http://code.google.com/p/jquery-ui-map/),
[jQuery Star Raty](http://wbotelhos.com/raty/), [jQuery Form Plugin](http://jquery.malsup.com/form/)
* **OpenID Client** - [JavaScript OpenID Selector](http://code.google.com/p/openid-selector/)

### Functionality Includes:

* *Data Collection/Display* - Example uses barcode scan as "item" data
* *Persistent Storage* - Item data saved using device local storage
* *Geolocation and Timestamp* - Saved with each item
* *User Rating* - User rates with star rating and comment, saved with each item
* *Social Aspect* - If logged in, users can share their item data anonymously and see other's data
* *Interactive Mapping* - Items, including shared items, shown as markers on map (tap marker to see item data)

### Companion Server

* See [PhoneGap PowerApp Node.js Server](https://github.com/libbybaldwin/phonegap-powerapp-nodejs), however *__log in not required__* to use PowerApp 
* **App Configuration** required if using server:
  * **assets/www/index.html** - search for "Simple OpenID Selector", provide server url in form **action**
  * **assets/www/main.js** - provide server ip and port for var **serverUrl**
* *Authentication* uses [OpenID](http://openid.net/)
* *Storage of Data on Server* - Save data on server if user logs in
* *User-controlled Data Sharing* - Data stored anonymously, sharing controlled by user

### Usage

Instructions on installing Eclipse, Android SDK and the AppLaud Eclipse Plugin found [here](http://www.mobiledevelopersolutions.com/home/start).

1. Add the Barcode Scanner Plugin Library to Eclipse
  * Complete **Steps 1** and **6** in the MDS [TMT3 Barcode Scanner Tutorial](http://www.mobiledevelopersolutions.com/home/start/twominutetutorials/tmt3)
  * **Important** Use the version of the plugin for PhoneGap 1.4.1 as mention in the **Prep** step in the above tutorial
2. "Import Project.." in Eclipse - This project may initially have errors!
  * Set "Java Build Path" to your Android jar location
  * See the next step to include the Barcode Scanner Library in PowerApp project
3. Complete **Step 7** in the above tutorial
  * This steps "adds" the barcode scanner library to the PowerApp project - errors may appear in the project until this step is completed due to the configuration in AndroidManifest.xml
  * Note: The PowerApp project *already* includes the Barcode Scanner and Child Browser plugin Java, JavaScript and project configuration

------

Libby Baldwin, [Mobile Developer Solutions](http://www.mobiledevelopersolutions.com)

