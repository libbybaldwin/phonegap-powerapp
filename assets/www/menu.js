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

function isConnected() {
    var networkState = navigator.network.connection.type;

    //console.log("isConnected network state: " + networkState);
    return (networkState !== Connection.NONE) && (networkState !== Connection.UNKNOWN);
}

(function($) {
    /* Changes the displayed text for a jquery mobile button.
     * Encapsulates the idiosyncracies of how jquery re-arranges the DOM
     * to display a button for either an <a>, <div or <input type="button">
     */
    $.fn.changeButtonText = function(newText) {
        return this.each(function() {
            $this = $(this);
            if( $this.is('div') ) {  // change if need 'a'
                $('span.ui-btn-text',$this).text(newText);
                return;
            }
            /*if( $this.is('input') ) { // example for input
                $this.val(newText);
                // go up the tree
                var ctx = $this.closest('.ui-btn');
                $('span.ui-btn-text',ctx).text(newText);
                return;
            }*/
        });
    };
    
    $.fn.getButtonText = function() {
            $this = $(this);
            if( $this.is('div') ) {  // change if need 'a'
                var text = $('span.ui-btn-text',$this).text();
                return text;              
            }
    };
}(jQuery));

$('#dialog-devmenu').live('pageinit', function(event){
    
    $('#dialog-devmenu').live('pagehide',function(event, ui){
        $('.allcollapse').trigger('collapse');
    });
    
    $('select#select-home-page').change( function() {
        localStorage.powerapp_homepage = $('select#select-home-page').val();
    });
    
    $('#go_to_homepage').click(function() {
        var home = $('select#select-home-page').val();
        $.mobile.changePage($("#" + home));
    });
    
    $('.goto_login').click(function() {
        $.mobile.changePage($('#page-login')); //, { changeHash : false });
        //console.log("PowerApp: using changePage to go to login");
        return false;
    });
    
    if ($('#sharestatus').text() === "Sharing"){
        $('#share_btn').changeButtonText("Unshare");
    }
    
    $('#share_btn').click(function() {
        if (!isConnected()) {
            fadingMsg("Please check network connection. Can not share when offline.");
            console.log("Device not connected when changing Share");
            return false;
        }
        
        // check for log in status
        var username = $('.username').text();
        if (username === 'Not Logged In') {
            navigator.notification.confirm(
                    "You must log in to change share settings. Log in now?", 
                    function(btn) {
                        if (btn === 1) {
                            $.mobile.changePage($('#page-login'), { changeHash : false});
                        }
                    },  
                    'Share Setting Change',
                    "To Login Page,No Thanks" 
                );
            return false;           
        }
        
        if ($(this).getButtonText() === "Share") {
            $.post(serverUrl + "/setShare", 
                { share : 'true' },
                function(r) {
                    if (r.success) {
                        //console.log("setShare success");
                        $('#share_btn').changeButtonText("Unshare");
                        $('#sharestatus').text("Sharing");
                        localStorage.powerapp_share = "true";
                    } else {
                        alert("Failed to Share. Check network settings.");
                        console.log("setShare failure");
                    }
            });
        } else {
            $.post(serverUrl + "/setShare", 
                { share : 'false' },
                function(r) {
                    if (r.success) {
                        //console.log("Unset Share success");
                        $('#share_btn').changeButtonText("Share");
                        $('#sharestatus').text("Not Sharing");
                        localStorage.powerapp_share = "false";
                        // Empty Share list and hide it
                        $('span#shared_cnt').html("0 Shared Items");
                        $("ul#shared_list").empty().listview('refresh');
                        $('div#shared_list_container').trigger('collapse').addClass('hidden');
                    } else {
                        alert("Failed to Unshare. Check log in status or network settings.");
                        console.log("Unset Share failure");
                    }
            });
        }
    });

    /*function clearLocalStorage() {
        delete localStorage.powerapp_openid;
        delete localStorage.powerapp_homepage;
        delete localStorage.powerapp_username;
        delete localStorage.powerapp_session;  
        delete localStorage.powerapp_email;
        delete localStorage.powerapp_share;
        var length = localStorage.length, i;
        for (i = 0 ; i < length ; i++) {
            keyName = localStorage.key(i);
            if (keyName.indexOf("powerapp_item_") === 0) {
                localStorage.removeItem(keyName);
            }
        }
    }
    
    $('#clear_dev_data').click(function() {
        clearLocalStorage();   
    });*/
    
    $('#logout').click(function() {
        if (!isConnected()) {
            fadingMsg("Check network connection. Can not logout when offline.");
            console.log("Device not connected when logging out.");
            return;
        }
        
        $.post(serverUrl + "/logout");
        var d = new Date();
        powerapp.logoutTime = d.getTime();
        delete localStorage.powerapp_username;
        delete localStorage.powerapp_session;
        setUser('Not Logged In');
    });
});
