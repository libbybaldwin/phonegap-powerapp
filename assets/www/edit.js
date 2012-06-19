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

var deleteItemRemote = function (scancode) {
    var username = $('.username').text();
    //alert(username);
    if (username !== 'Not Logged In'){        
        $.post(serverUrl + "/removeItem", 
                { filename: scancode },
                function(r) {
                    if (r.success) {
                        console.log("removeItem success");
                        fadingMsg("Item " + scancode + " Deleted.", "short");
                    } else {
                        navigator.notification.alert(
                                "Error Removing: " + scancode ,
                                null, 
                                'Delete Item Status',           
                                'Close'                  
                            );
                        console.log("deleteItemRemote failed, item: "+ scancode);
                    }
                });
    } else {
        fadingMsg("Item " + scancode + " Deleted.");
    }   
};

$('#dialog-edit').live('pageinit', function(){
    
    var addSkew = false;
    
    //$('#editcomment').css('height', '3.5em').css('width', '90%');

    var editGeolocSuccess = function(position) {
        if (addSkew) {
            var skewterLat, skewLng, skew = Math.random();
            if (skew > 0.5) {
                skewLat = position.coords.latitude + Math.random();
                skewLng = position.coords.longitude - (0.6*(Math.random()));
            } else {
                skewLat = position.coords.latitude - (0.8*(Math.random()));
                skewLng = position.coords.longitude + Math.random();           
            }
            $('#edititemlocation').html(skewLat.toFixed(10) + "," + skewLng.toFixed(10));
            addSkew = false;
        } else {
            $('#edititemlocation').html(position.coords.latitude.toFixed(10) + "," + position.coords.longitude.toFixed(10));
        }
        $('#edititemtime').html(position.timestamp.toString()); //new Date(position.timestamp));
        $('#fading_msg').remove();
    };

    function editGeolocError(error) {
        //alert("getCurrentPosition Error:" + error.code);
        // Keep old location and time if can't get new
        $('#fading_msg').remove();
        fadingMsg("Unable to get new location and time");
        addSkew = false;
    }
   
    function editLocConfirm(button) {
        if (button === 3) {
            return;
        }
        if (button === 1) {
            addSkew = true;
        } 
        fadingMsg("Getting new location and time.. ");
        var options = { enableHighAccuracy: true, timeout: 8000 };
        navigator.geolocation.getCurrentPosition(editGeolocSuccess, editGeolocError, options);        
    }
    
    $('#edit_loc_time').live('click', function() {
        // Offer user skewed location, good for getting nearby but different locations
        navigator.notification.confirm(
                'Add Skew to location?\n(useful for development)\nNo Skew gets true location\nCancel returns to Edit.',
                editLocConfirm, 
                'New Location and Time',
                'Add Skew,No Skew, Cancel'
            );
    });

   $('#edit_save').live('click', function() {
       var item = {}, scancode;
       item.scancode = scancode = $('#editscancode').text();
       item.loc = $('#edititemlocation').text();
       item.time = $('#edititemtime').text();
       item.rating = $('#editrating').text();
       item.comment = $('#editcomment').val();

       $('a#item' + scancode).html('<h4>' + scancode 
               + '</h4><p><span id="loc">' + item.loc + '</span><br/>' 
               + '<span id="time">' + item.time + '</span><br/>' 
               + '<span id="rating">' + item.rating + '</span><br/>'
               + '<span id="comment">' + item.comment  
               + '</span></p>');
       try {
           $("ul#item_list").listview('refresh');
       } catch(e) { }
       
       // save new info to map marker??
       saveItemLocal(item);
       saveItemRemote(item);
   });
   
   //$('#edit_cancel').live('click', function() {
   //    fadingMsg("Edit cancelled.", "short");      
   //});
   
   $('#edit_delete').live('click', function() {
       var scancode = $('#editscancode').text();
       scannedItemsList.splice($.inArray(scancode, scannedItemsList), 1);
       $('li#item' + scancode).remove();
       //alert("list length: " + $('ul#item_list').find('li').length);
       if ($('ul#item_list').find('li').length === 1) {
           $('#li-placeholder').css('display', 'block');
       }
       try {
           $("ul#item_list").listview('refresh');
       } catch(e) { }
       deleteItemLocal(scancode);
       deleteItemRemote(scancode);
   });
});

/*$('#page-edit').live('pageshow', function() {
    $('#editstar').raty("cancel");
    $('#editrating').text("Not Rated");
});*/