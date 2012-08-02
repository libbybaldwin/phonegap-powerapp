# PhoneGap PowerApp

## PhoneGap App for Android Project (Eclipse): PowerApp
Works as a Stand-alone App or with [PhoneGap PowerApp Node.js Server](https://github.com/libbybaldwin/phonegap-powerapp-nodejs)

I made a [short video](http://www.youtube.com/watch?v=cciO65NXCgI) which describes PowerApp and how to use it.

### This repo contains a complete Cordova App Eclipse Project, Including:

* **PhoneGap** - [phonegap.com](http://phonegap.com) - **PhoneGap/Cordova 1.8.0** .jar and .js files
* **jQuery Mobile** - [jquerymobile.com](http://jquerymobile.com)
* **Maps** - Google Maps [JavaScript API v3](https://developers.google.com/maps/documentation/javascript/reference)
* **PhoneGap Plugins** - ChildBrowser, Barcode Scanner
* **jQuery Plugins** - [jQuery Google Maps Plugin](http://code.google.com/p/jquery-ui-map/) : **Version [3.0-beta](http://code.google.com/p/jquery-ui-map/downloads/list)**,
[jQuery Star Raty](http://wbotelhos.com/raty/), [jQuery Form Plugin](http://jquery.malsup.com/form/)
* **OpenID Client** - [JavaScript OpenID Selector](http://code.google.com/p/openid-selector/)
* **Extra PhoneGap Plugin** - AccountList code installed, runtime code in comments in *assets/www/main.js*

### PowerApp Functionality Includes:

* *Data Collection/Display* - Example uses barcode scan as "item" data
* *Persistent Storage* - Item data saved using device local storage
* *Geolocation and Timestamp* - Saved with each item
* *User Rating* - User rates with star rating and comment, saved with each item
* *Social Aspect* - If logged in, users can share their item data anonymously and see other's data
* *Interactive Mapping* - Items, including shared items, shown as markers on map, tap marker to see info window

### Companion Node.js Server

* See [PhoneGap PowerApp Node.js Server](https://github.com/libbybaldwin/phonegap-powerapp-nodejs) to run PowerApp with server, however *__log in not required__* to use PowerApp 
* **App Configuration** required if using server:
  * **assets/www/index.html** - search for "Simple OpenID Selector", provide server url in form *action*
  * **assets/www/main.js** - provide server ip and port for var *serverUrl*
* *Authentication* uses [OpenID](http://openid.net/)
* *Storage of Data on Server* - Save data on server if user logs in
* *User-controlled Data Sharing* - Data stored anonymously, sharing controlled by user

### Usage

Instructions on installing Eclipse, Android SDK and the AppLaud Eclipse Plugin found [here](http://www.mobiledevelopersolutions.com/home/start). Recommend creating and running at least one demo app before using PowerApp, see [Getting Started Tutorial](http://www.mobiledevelopersolutions.com/home/start/twominutetutorials/tmt0). See also [AppLaud Getting Started Video](http://www.youtube.com/watch?v=mT02ytSSMII).

1. Add the Barcode Scanner Plugin Project to Eclipse
  * Complete **Steps 1** and **6** in the MDS [TMT3 Barcode Scanner Tutorial](http://www.mobiledevelopersolutions.com/home/start/twominutetutorials/tmt3). The PowerApp project has completed the other steps in the tutorial for you, except **Step 7** which is addressed below.
  * The resulting project will be an **Android Library** project in your Eclipse workspace
2. Download and unzip PowerApp from this page. Alternate: [Fork it](https://help.github.com/articles/fork-a-repo).
  * Run "File > Import...  Existing Projects Into Workspace" in Eclipse to create the PowerApp project
  * **OR** Run "File > New > Android > Android Project from Existing Code" (depends on your current ADT)
  * For "Select Root Directory" browse to the location of the unzipped PowerApp project and click *Finish*
  * *This project may have errors until you complete all steps!*
  * When completed correctly, this step will create a project in your workspace called **powerapp**
  * **OR** ..called **com.example.powerapp.PowerAppActivity**
3. Complete **Step 7** in the MDS [TMT3 Barcode Scanner Tutorial](http://www.mobiledevelopersolutions.com/home/start/twominutetutorials/tmt3)
  * This step adds the barcode scanner library to the PowerApp project. Errors may appear in the project until this step is completed due to the barcode scanner configuration in AndroidManifest.xml.
  * Note: The PowerApp project *already* includes the Barcode Scanner and Child Browser plugin Java, JavaScript and manifest configuration. After complete the three steps described here the app is ready to run.

------

Libby Baldwin, [Mobile Developer Solutions](http://www.mobiledevelopersolutions.com)

