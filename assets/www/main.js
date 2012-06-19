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

var serverUrl = 'http://192.168.0.107:8012';

var powerapp = {};
powerapp.networkState = -1;
powerapp.logoutTime = null;

function showMenu() {
    $.mobile.changePage($('#dialog-devmenu'), { role: 'dialog' });
}

function fadingMsg (locMsg, delayTime) {
    var dtime = (delayTime === 'short') ? 1800 : 2800;
        $("<div class='ui-overlay-shadow ui-body-a ui-corner-all dkgreen' id='fading_msg'>" 
            + locMsg + "</div>")
        .css({ "display": "block", "z-index" : 99999999, "opacity": 0.99, "background-color" : "#bbf3db" })
        .appendTo( $.mobile.pageContainer )
        .delay(dtime)
        .fadeOut(1400);
}

function setUser(user) {
    $('.username').text(user); 
}

function onlineCallback() {
    if (powerapp.networkState === -1) {
        powerapp.networkState = 1;
        //console.log("onlineCallBack: online");
    } else if (powerapp.networkState === 0) {
        // came back after being disconnected
        powerapp.networkState = 1;
        //console.log("onlineCallBack: back online");
    }  else if (powerapp.networkState === 1) {
        // came back after being disconnected
        console.log("onlineCallBack: when already online");
    } 
}

function offlineCallback() {
    poweraapp.networkState = 0;
    //console.log("offlineCallback: gone offline");
}

/*function pauseCallback() {
    console.log("pauseCallback");
}*/

/*function resumeCallback() {
    console.log("resumeCallback");
}*/

function go() {
    console.log("PowerApp: go"); // and userAgent: " + navigator.userAgent);
    document.addEventListener("menubutton", showMenu, false);

    document.addEventListener("online", onlineCallback, false);
    document.addEventListener("offline", offlineCallback, false);
    //document.addEventListener("pause", pauseCallback, false);
    //document.addEventListener("resume", resumeCallback, false);

    // AccountList plugin
   /* window.plugins.AccountList.get(
            { type: 'com.google'}, // if not specified, gets all accounts
            function (result) {
                var i;
                console.log(result.length);
                for (i in result) {
                    alert(i + "  " + result[i]);
                }
            },
            function (error) {
                console.log(error);
            }
        );*/
    
    if (typeof window.plugins.childBrowser.onLocationChange !== "function") {
        window.plugins.childBrowser.onLocationChange = function(loc){
            //console.log("PowerApp: onLocationChange : " + loc);
            
            if (loc.indexOf('/loginresult.html?email') > 0) {
                
                window.plugins.childBrowser.close();
                
                var email = loc.substring(loc.indexOf("=")+1);
                localStorage.powerapp_email = email;
                setUser(email);

                $.get(serverUrl + "/getConnection", { }, function(r) {
                    if (r.user && r.session) { 
                        var shareStr = "Sharing.", locStoreShare = localStorage.powerapp_share, noItems = true;
                        
                        $('#new-user').remove();
                        $('div#scanarea').removeClass('hidden');
                        $('div[id="page-item"] > div[data-role="footer"]').removeClass('hidden');
                        
                        // Maybe check if exists prevPage and go there
                        $.mobile.changePage($("#page-item"));
                        
                        //console.log("PowerApp: setting username: " + r.user);
                        localStorage.powerapp_username = r.user;
                        localStorage.powerapp_session = r.session;
                        
                        if (locStoreShare === "false") {
                            shareStr = "Not Sharing.";                               
                        }
                        
                        // If items since last logout/in save them now
                        $('ul#item_list li[id!="li-placeholder"]').each(function(i) {
                            var id, scancode, item = {}, itemdate; 
                            id = $(this).attr('id');
                            scancode = id.slice(id.indexOf("item") + 1);
                            
                            itemdate = new Date($('a#' + id + ' p span#time').text());
                            
                            if (itemdate.getTime() > powerapp.logoutTime) {                                                                                      
                                navigator.notification.alert("Unsaved Item:\n" + scancode + "\nsaved on server.",
                                    null, 
                                    'PowerApp Login Success',           
                                    'Close');
                                item.scancode = scancode;
                                item.loc = $('a#' + id + ' p span#loc').text();
                                item.time = $('a#' + id + ' p span#time').text();
                                item.comment = $('a#' + id + ' p span#comment').text();
                                item.rating = $('a#' + id + ' p span#rating').text();
                                saveItemRemote(item);  
                            }
                            noItems = false;
                        });
                        
                        if (noItems) {
                            navigator.notification.confirm(
                                'Your data will be saved on the server and locally.\n\n' + 
                                'Current Share Status:\n' + shareStr + '\n\n' +
                                'Would you like to adjust share settings?', 
                                function(btn) {
                                    if (btn === 1) {
                                        $.mobile.changePage($('#dialog-devmenu'), {role: 'dialog'});
                                        $('div#share_set').trigger('expand');
                                    }
                                },  
                                'Registered with Powerapp!',
                                "To Share Settings,No Thanks" 
                            );
                        }
                        
                    } else {   // Probably never get here
                        // Show alert about unsuccessful login
                        $('#new-user').remove();
                        $('div#scanarea').removeClass('hidden');
                        $('div[id="page-item"] > div[data-role="footer"]').removeClass('hidden');
                        $.mobile.changePage($("#page-item"));
                    }
                });
           
            } else if (/\/loginresult.html$/.test(loc) ) {
                window.plugins.childBrowser.close();
                // Check if server returns this in any case
                // Use to show alert about unsuccessful login
                // Remove saved openid provider from locstore and $('span#useropenid').html();
                $('#new-user').remove();
                $('div#scanarea').removeClass('hidden');
                $('div[id="page-item"] > div[data-role="footer"]').removeClass('hidden');
                $.mobile.changePage($("#page-item"));
             } else {
                // The other loc changes are part of openid.. so ignore them
                // console.log("PowerApp: " + loc);
            }
        };
    }
}

function init() {
    document.addEventListener("deviceready", go, true);
}

// Create blue, green and shadow images for custom markers
var bimage = new google.maps.MarkerImage(
        'img/markers/bimage.png',
        new google.maps.Size(20,34),
        new google.maps.Point(0,0),
        new google.maps.Point(10,34)
);

var gimage = new google.maps.MarkerImage(
        'img/markers/gimage.png',
        new google.maps.Size(20,34),
        new google.maps.Point(0,0),
        new google.maps.Point(10,34)
);

var shadow = new google.maps.MarkerImage(
        'img/markers/shadow.png',
        new google.maps.Size(40,34),
        new google.maps.Point(0,0),
        new google.maps.Point(10,34)    
);

var shadowShape = {'type': 'poly', 'coords' : [13,0,15,1,16,2,17,3,18,4,18,5,19,6,19,7,19,8,19,9,19,10,19,11,19,12,19,13,18,14,18,15,17,16,16,17,15,
                                               18,14,19,14,20,13,21,13,22,12,23,12,24,12,25,12,26,11,27,11,28,11,29,11,30,11,31,11,32,11,33,8,33,8,32,8,31,
                                               8,30,8,29,8,28,8,27,8,26,7,25,7,24,7,23,6,22,6,21,5,20,5,19,4,18,3,17,2,16,1,15,1,14,0,13,0,12,0,11,0,10,0,9,
                                               0,8,0,7,0,6,1,5,1,4,2,3,3,2,4,1,6,0,13,0]};

$('div[data-role="page"]').live('pagebeforehide',function(event, ui){
    var nextPage = ui.nextPage;
    // If next page is page-map, suggest map center from current page
    if (nextPage.attr('id') === "page-map") {
        var center = $('#new_map_center').text();
        if (center !== "") {
            $('#mapcenter', nextPage).text(center);
        } else {
            $('#mapcenter', nextPage).text("");
        }       
    }
});
