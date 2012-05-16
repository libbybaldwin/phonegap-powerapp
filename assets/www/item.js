//    Copyright (C) 2012 by Mobile Developer Solutions http://www.mobiledevelopersolutions.com
//    
//    Permission is hereby granted, free of charge, to any person obtaining a copy
//    of this software and associated documentation files (the "Software"), to deal
//    in the Software without restriction, including without limitation the rights
//    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//    copies of the Software, and to permit persons to whom the Software is
//    furnished to do so, subject to the following conditions:
//    
//    The above copyright notice and this permission notice shall be included in
//    all copies or substantial portions of the Software.
//    
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//    THE SOFTWARE.
// 

var scannedItemsList = [];
var saveItemLocal = function(item) {
    localStorage.setItem("powerapp_item_" + item.scancode, JSON.stringify(item));
};
// var textFormats = "QR_CODE DATA_MATRIX";
var productFormats = "UPC_E UPC_A EAN_8 EAN_13";

var saveItemRemote = function(item) {
    var username = $('.username').text();
    if (username !== 'Not Logged In'){
        var contents = JSON.stringify(item);

        $.post(serverUrl + "/setItem", 
                { filename: item.scancode, saveas : false, contents : contents },
                function(r) {
                    if (r.success) {
                        console.log("setItem success");
                    } else {
                        console.log("setItem failure");
                    }
                });
        }
};

$('#page-item').live('pageinit', function(event){
    /*$('#page-item').live("swipeleft", function () { // add swipe navigation
        $.mobile.changePage($("#page-list"));
    });*/
       
    var saveItemToList = function(item) {
        var scancode = item.scancode; 
        $('<li id="itemx' + scancode + '"><a class="showmap" id="itemx' + scancode + '" href="#page-map"><h4>' 
                + scancode 
                + '</h4><p><span id="loc' + scancode + '">' + item.loc + '</span><br/>' 
                + '<span id="time' + scancode + '">' + item.time + '</span><br/>' 
                + '<span id="rating' + scancode + '">' + item.rating + '</span><br/>'
                + '<span id="comment' + scancode + '">' + item.comment  
                + '</span></p></a>'
                + '<a class="showedit" id="edit' + scancode + '">Edit</a></li>').appendTo('ul#item_list');
        // Could also scroll to new item
        $('div#item_list_container').trigger('expand');
    };
    
    // Populate list from localStorage
    var locStoreHome = null, locStoreUsername = null, locStoreSession = null, locStoreEmail = null;
    var locStoreShare = null, rawData, keyName, item, length = localStorage.length, i, itemCount = 0; 
    for (i = 0 ; i < length ; i++) {
        keyName = localStorage.key(i);
        // all item keys start with "powerapp_item_"
        if (keyName.indexOf("powerapp_item_") === 0) {
            itemCount++;
            rawData = localStorage.getItem(keyName);
            item = JSON.parse(rawData);  
            scannedItemsList.push(item.scancode);
            saveItemToList(item);
        } else if (keyName === "powerapp_homepage") {
            locStoreHome = localStorage.getItem(keyName);
        } else if (keyName === "powerapp_username") {
            locStoreUsername = localStorage.getItem(keyName);
        } else if (keyName === "powerapp_session") {
            locStoreSession = localStorage.getItem(keyName);
        } else if (keyName === "powerapp_email") {
            locStoreEmail = localStorage.getItem(keyName);
        } else if (keyName === "powerapp_share") {
            locStoreShare = localStorage.getItem(keyName);
        }
    }
    if (!locStoreShare) {
        localStorage.powerapp_share = "false";
    } else if (locStoreShare === "true") {
        fadingMsg("You are currently sharing item data.");
        $('#share_btn').changeButtonText("Unshare");
        $('#sharestatus').text("Sharing");
    }
    if (itemCount > 0) {
        $('#li-placeholder').css('display', 'none');
        fadingMsg("Added " + itemCount + " items to list.");
    }
    if (locStoreUsername && locStoreSession) { 
        $.post(serverUrl + "/setSession", { user : locStoreUsername, session : locStoreSession }, function(r) {
            if (r.loggedOut) {
                delete localStorage.powerapp_username;
                delete localStorage.powerapp_session;
                delete localStorage.powerapp_email;
                setUser('Not Logged In');
                $.mobile.changePage($('#page-login'), { changeHash : false});
            } else {
                if (r.newSession) {
                    localStorage.powerapp_session = r.newSession;
                }
                setUser(locStoreEmail);
            }
        });
        $('div#scanarea').removeClass('hidden');
        $('div[id="page-item"] > div[data-role="footer"]').removeClass('hidden');
    } else if (!locStoreEmail) { // !== 'Guest') 
        // This is the first time the app has run on this device
        $('div#new-user').removeClass('hidden');       
    } else { 
        $('div#scanarea').removeClass('hidden');
        $('div[id="page-item"] > div[data-role="footer"]').removeClass('hidden');
        $('div#new-user').remove();
    }

    if (locStoreHome && (locStoreHome !== "page-item")) { 
        var myselect = $("select#select-home-page");
        myselect.selectmenu();
        if (locStoreHome === 'page-list') {
            myselect[0].selectedIndex = 1;
            myselect.selectmenu("refresh");
            $.mobile.changePage($('#' + locStoreHome ), { changeHash : false });
        } else {
            myselect[0].selectedIndex = 2;
            myselect.selectmenu("refresh");
            $.mobile.changePage($('#' + locStoreHome ), { changeHash : false });
        }
    } else if (!locStoreHome) {
            localStorage.powerapp_homepage = 'page-item';
    }
   
    $('#savebtn').addClass('ui-disabled');
    $('#star').raty({
        cancel:    true,
        cancelPlace: 'right',
        width:     180,
        cancelOff: 'cancel-off-big.png',
        cancelOn:  'cancel-on-big.png',
        //half:      true,
        size:      24,
        starHalf:  'star-half-big.png',
        starOff:   'star-off-big.png',
        starOn:    'star-on-big.png',
        click: function(score, evt) {
            if (score !== null) {
                $('#rating').text(" " + score + " star" + ((score > 1) ? "s" : ""));
            } else {
                $('#rating').text("Not Rated");
            }
        }
      });
    
    $('#close-new-user').live('click', function() {
        $('div#new-user').remove();
        $('div#scanarea').removeClass('hidden');
        $('div[id="page-item"] > div[data-role="footer"]').removeClass('hidden');
        localStorage.powerapp_email = "Guest";
        setUser("Not Logged In");
    });
        
    var duplicateConfirm = function(btn) {
        if (btn === 1) {
            $.mobile.changePage($("#page-list"), {changeHash : false}); // , {transition: 'slide'}
            $('.showedit#edit' + scannedItemsList[i]).trigger("click");
        }
        $('#clearfields').trigger('click');
        $('#scanstatus').removeClass('successtxt').addClass('errortxt').html('Duplicate');
    };
    
    var scanSuccess = function(result) {
        //alert("scanSuccess: " + result.text + ". Format: " + result.format + ". Cancelled: " + result.cancelled);
        if (!result.cancelled) {
            var scancode = result.text;
            
            // Check if scanned item is a supported format
            if (!productFormats.match(result.format)) {
                console.log("scanSuccess: format not supported: " + result.format);
                navigator.notification.alert(
                        "Scan Format: " + result.format +
                        " is not supported. Please scan a product code (UPC or EAN).",
                        null, 
                        'Item: ' + scancode,           
                        'Close'                  
                    );
                $('#scanstatus').addClass('errortxt').removeClass('successtxt').html("Unsupported format");
                return;
            } 
            
            // Check if this item is already in database, i will be index of it
            if ((i = $.inArray(scancode, scannedItemsList)) !== -1) {
                navigator.notification.confirm(
                    'Item ' + scancode + ' already scanned and saved.',
                    duplicateConfirm,  
                    'Duplicate Item Found!',
                    'Edit Existing, Cancel Scan'
                );                
            } else {   
                //fadingMsg("Scan successful. Getting location and time..");
                scannedItemsList.push(result.text);
                
                $('#scancode').text(result.text);
                $('#scanstatus').addClass('successtxt').removeClass('errortxt').html('Success');
                
                var options = { enableHighAccuracy: true, timeout: 8000 };
                navigator.geolocation.getCurrentPosition(geolocSuccess, geolocError, options);                
            }
        } else {
            $('#scanstatus').addClass('errortxt').removeClass('successtxt').html("Cancelled");
        }        
    };

    var scanError = function(error) {
        alert("Scan failed: " + error);
        $('#scanstatus').addClass('errortxt').removeClass('successtxt').html("Error: " + error);
    };
    
    $('a#scan_btn').live('click', function() {
        $('#clearfields').trigger('click');
        window.plugins.barcodeScanner.scan(scanSuccess, scanError);
    });
    
    var geolocSuccess = function(position) {
        $('#itemlocation').html(position.coords.latitude.toFixed(10) + 
                "," + position.coords.longitude.toFixed(10));
        //console.log("PowerApp: geolocSuccess");
        $('#itemtime').html(position.timestamp.toString());  // getTime()); // toString()
        /*alert('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + new Date(position.timestamp)      + '\n');*/
        $('#fading_msg').remove();
        $('#savebtn').removeClass('ui-disabled');
    };

    function geolocError(error) {
        $('#itemlocation').html("Error:" + error.code);
        $('#itemtime').html("Error");
        //console.log('geolocError: ' + error.code + ', message: ' + error.message);
        $('#fading_msg').remove();
        fadingMsg("Error: " + error.code + "\nCheck device GPS or network connectivity.");
        $('#savebtn').removeClass('ui-disabled');
    }
        
    $('#savebtn').live('click', function() {
        var item = {}, scancode;
        item.scancode = scancode = $('#scancode').text();
        item.loc = $('#itemlocation').text();
        item.time = $('#itemtime').text();
        item.comment = $('#comment').val();
        item.rating = $('#rating').text();
                
        $('#new_map_center').text(item.loc);
        // Put item info in ul#item_list on page-list
        $('#li-placeholder').css('display', 'none');
        saveItemToList(item);            
        // Save item to localStorage
        saveItemLocal(item);
        // Save item on server if logged in
        saveItemRemote(item);

        //fadingMsg("Saved item: " + scancode);
        $('#clearfields').trigger('click');
        $.mobile.changePage($('#page-list'));
    });
 
    $('#clearfields').live('click', function() {
        $('#scancode').text("");
        $('#scanstatus').removeClass('errortxt').removeClass('successtxt').html("Not Started");        
        $('#itemlocation').text("");
        $('#itemtime').text("");
        $('#star').raty("cancel");
        $('#rating').text("Not Rated");
        $('#comment').val("");
        $('#savebtn').addClass('ui-disabled');
    });

    $('#page-map').trigger('pageinit');
});

$('#page-item').live('pageshow', function(event){
    $('#comment').css('height', '3.5em').css('width', '90%');
    $("div ul li a[href='#page-item']").addClass('ui-btn-active');
    $("div ul li a[href!='#page-item']").removeClass('ui-btn-active');
    $("div ul li a[href='#page-map']").removeClass('ui-btn-active');
});