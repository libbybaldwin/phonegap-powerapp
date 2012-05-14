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
* *Interactive Mapping* - Items (including shared) shown as clickable markers on map (click to see item data)

### Companion Server

* See [PhoneGap PowerApp Node.js Server](https://github.com/libbybaldwin/phonegap-powerapp-nodejs), however *__log in not required__* to use PowerApp 
* **App Configuration** required if using server:
  * *assets/www/index.html* - search for "Simple OpenID Selector", provide server url in form **action**
  * *assets/www/main.js* - provide server ip and port for var **serverUrl**
* *Authentication* uses [OpenID](http://openid.net/)
* *Secure Storage of Data on Server* - Save data on server if user logs in
* *Secure User ID for Data Store* - Unique user ID from authentication holds user-uploaded data
* *User-controlled Data Sharing* - Data stored anonymously, sharing controlled by user

------

Libby Baldwin, [Mobile Developer Solutions](http://www.mobiledevelopersolutions.com)

