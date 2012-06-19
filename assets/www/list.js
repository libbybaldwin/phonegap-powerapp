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

var deleteItemLocal = function(scancode) {
    localStorage.removeItem("powerapp_item_" + scancode);
};

$('#page-list').live('pageinit', function(event){
    
    /*$('#page-list').live("swiperight", function () {  // to add swipe navigation
        $.mobile.changePage($("#page-item"));
    });*/

    /*$('#page-list').live("swipeleft", function () {
        $.mobile.changePage($("#page-map"));
    });*/
   
    // init listview here so we can add to it and refresh
    $("ul#item_list").listview();
    $("ul#item_list").listview('refresh');
 
    // editstar is on dialog-edit page, but needs to be init'd here
    $('#editstar').raty({
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
                $('#editrating').text(" " + score + " star" + ((score > 1) ? "s": ""));
            } else {
                $('#editrating').text("Not Rated");
            }
          }
    });
    
    $('.showmap').live("click", function () {
        var id = $(this).attr('id');
        //var scancode = id.replace(/[^\d.]/g, ""); //remove 'item' or 'shared' prefix
        var scancode = id.slice(id.indexOf("item") + 1);
        var type = id.replace(/[0-9]/g, ""); //remove numbers
        var location, tagType, currentLatAndLang = []; 
        
        location = $('a#' + id + ' p span#loc').text();
        currentLatAndLang = location.split(',', 2);
        
        console.log("currentLatAndLang:" + currentLatAndLang[0] + "," + currentLatAndLang[1]);
        
        $('#new_map_center').text(location);
    });
    
    $('.showedit').live("click", function () {
        var id = $(this).attr('id');
        var scancode = id.replace(/[^\d.]/g, "");
        id = id.replace(/edit/g, "item");
                
        $('#editscancode').text(scancode);
        $('#edititemlocation').text($('a#' + id + ' p span#loc').text());
        $('#edititemtime').text($('a#' + id + ' p span#time').text());
        var ratetext = $('a#' + id + ' p span#rating').text();
        $('#editstar').raty('click', (ratetext.replace(/[^\d.]/g, "")));
        $('#editrating').text($('a#' + id + ' p span#rating').text());
        $('#editcomment').val($('a#' + id + ' p span#comment').text());        
        $.mobile.changePage($('#dialog-edit'), {role: 'dialog'});
    });
       
    $('div#item_list_container').live('expand',function(){
        $('span#item_cnt').html(""); 
        $('span#item_hint').html("Tap to See on Map; Gear to Edit");
        try {
            $("ul#item_list").listview('refresh');
        } catch(e) { }
    });
    $('div#item_list_container').live('collapse',function(){
        var i = $('ul#item_list').find('li').length;
        if (i > 1) {
            --i;
            $('span#item_cnt').html(i + " Item" + ((i>1)? "s" : ""));
        } else {
            $('span#item_cnt').html("0 Items");           
        }        
        $('span#item_hint').html("Expand to See Your Items");
    });
    
    $('div#shared_list_container').live('expand',function(){
        $('span#share_hint').html("Tap to See on Map");
    });
    $('div#shared_list_container').live('collapse',function(){       
        $('span#share_hint').html("Expand to View");
    });

    var buildSharedList = function(list) {        
        var i, id;
        for(i = 0 ; i < list.length; i++) {
            // make list[i].item unique by adding i to it when used as id
            id = (i + "x").concat(list[i].item);
            //console.log("buildSharedList id=" + id);
            $('<li><a href="#page-map" id="shared' + id + '" class="showmap"><h4>' 
                    + list[i].item
                    + '</h4><p><span id="loc">' + list[i].loc + '</span><br/>' 
                    //+ '<span id="time">' + list[i].time + '</span><br/>' 
                    + '<span id="rating">' + list[i].rating + '</span><br/>'
                    + '<span id="comment">' + list[i].comment  
                    + '</span></p></a></li>').appendTo('ul#shared_list');
        }
        $('span#shared_cnt').html(i + " Shared Item" + ((i>1)? "s" : ""));
        $('div#shared_list_container').removeClass('hidden');
        $('div#shared_list_container').trigger('expand');
        $("ul#shared_list").listview('refresh');
    };
    
    var onShareRefresh = function(btn) {
        if (btn === 1) {
            $.mobile.changePage($('#dialog-devmenu'), {role: 'dialog'});
            $('div#share_set').trigger('expand');
        }
    };
    
    $('a#get_shared_list').live('click', function() {
        var showedError = false;

        var username = $('.username').text();
        //console.log(username + "getting shared list");
        if (username === 'Not Logged In') {
            navigator.notification.confirm(
                    "You are currently not logged in. Log in now to share and get shared items?", 
                    function(btn) {
                        if (btn === 1) {
                            $.mobile.changePage($('#page-login'));
                        }
                    },  
                    'Share Item Refresh',
                    "To Login Page,No Thanks" 
                );
                return;           
        }
        
        var locStoreShare = localStorage.powerapp_share;
        if (locStoreShare === "false") {
            navigator.notification.confirm(
                "You are currently not sharing items. Would you like to?", 
                onShareRefresh,  
                'Share Item Refresh',
                "Yes I'll Share,No Thanks" 
            );
            return;
        }
        
        $.ajax({ url : serverUrl + "/getSharedItems", data : {}, cache : false, 
            beforeSend : function(jqXHR, settings) {
                    fadingMsg('Getting Shared List..');
                    $('ul#shared_list').empty();
            },            
            success : function(r, textStatus) {
                if (r.success) {
                    // Always means list has at least 1 item
                    buildSharedList(r.list);
                } else {
                    $('div#shared_list_container').addClass('hidden');
                    if (r.error === 'Authentication failed. Please re-login.') {
                        navigator.notification.confirm(
                            r.error, 
                            onLogin,  
                            'Project List Refresh',
                            'Login,Close' 
                        );
                    } else {
                        navigator.notification.alert(
                            r.error,
                            null, 
                            'Shared Item Refresh',           
                            'Close'                  
                        );
                    }
                }
            }, 
            error : function(jqXHR, textStatus, errorThrown) {
                $('div#shared_list_container').addClass('hidden');
                if (!showedError) {
                    var errormsg;
                    showedError = true;
                    if (errorThrown === '') {
                        errormsg = 'Check network connection.';
                    } else {
                        errormsg = errorThrown;
                    }
                    navigator.notification.alert(
                            errormsg,
                            null, 
                            'Shared Item Refresh', 
                            'Close' 
                          );
                    console.log('PowerApp: Get Shared Items returned with Error: ' + errormsg);
                    // no connection: error / blank                    
                }
            },
            complete : function(jqXHR, textStatus) {
                $('#fading_msg').remove();
                if ((!showedError) && textStatus === 'error') {
                    console.log('PowerApp: Get Shared Items completed with Error.');
                }
            }
        });
    }); 
});

$('#page-list').live('pageshow', function(event){
    //console.log("page-list pageshow and listview refresh");
    try {
        $("ul#item_list").listview('refresh');
    } catch(e) { }
    var i = $('ul#item_list').find('li').length;
    if (i > 1) {
        $('div#item_list_container').trigger('expand');
    }
    $("div ul li a[href='#page-list']").addClass('ui-btn-active');
    $("div ul li a[href!='#page-list']").removeClass('ui-btn-active');
    $("div ul li a[href='#page-map']").removeClass('ui-btn-active');
});
