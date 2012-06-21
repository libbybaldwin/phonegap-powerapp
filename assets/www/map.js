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

$('#page-map').live('pageinit', function(event){
    
    // Define a default location and create the map
    var defaultLoc = new google.maps.LatLng(37.802955, -122.139923);
    $('#map_canvas').gmap( { 'center': defaultLoc, 'zoom' : 14, 
        'streetViewControlOptions': {'position':google.maps.ControlPosition.TOP_CENTER},
        'zoomControlOptions': {'position':google.maps.ControlPosition.LEFT_TOP} }) 
    .bind('init', function(evt, map) {
        //fadingMsg("Getting map and current location.");
        // Try to get current location to center on, else stay at defaultLoc
        $('#map_canvas').gmap('getCurrentPosition', function(pos, status) {
            if (status === "OK") {
                var latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                $('#map_canvas').gmap('option', 'center', latLng);
            } else {
                $('#fading_msg').remove();
                fadingMsg ("<span style='color:#f33;'>Error</span> while getting location. Device GPS/location may be disabled.");
            }                    
        }, { timeout: 8000, enableHighAccuracy: true } );
                
        $('#map_canvas').gmap('addControl', 'controls', google.maps.ControlPosition.BOTTOM_CENTER);
        $('div#controls').css('display','inline').css('opacity', '0.7');
                
        $('div#controls #showminebtn').click(function() {
            if ($('div#controls div#showminebtn').hasClass('ui-btn-active')) {
                $('#map_canvas').gmap('find', 'markers', { 'property': 'tags', 'value': 'all' }, function(marker, isFound) {
                    if ( isFound ) {
                        marker.setVisible(false);
                    }
                });
                $('div#controls div#showminebtn').removeClass('ui-btn-active');
            } else {
                $('#map_canvas').gmap('find', 'markers', { 'property': 'tags', 'value': 'all' }, function(marker, isFound) {
                    if ( isFound ) {
                        marker.setVisible(true);
                    }
                });
                $('div#controls div#showminebtn').addClass('ui-btn-active');                
            }
        });

        $('div#controls div#showsharedbtn').click(function() {
            if ($('div#controls div#showsharedbtn').hasClass('ui-btn-active')) {           
                $('#map_canvas').gmap('find', 'markers', { 'property': 'tags', 'value': 'allShared' }, function(marker, isFound) {
                    if ( isFound ) {
                        marker.setVisible(false);
                    }
                });
                $('div#controls div#showsharedbtn').removeClass('ui-btn-active');
            } else {           
                $('#map_canvas').gmap('find', 'markers', { 'property': 'tags', 'value': 'allShared' }, function(marker, isFound) {
                    if ( isFound ) {
                        marker.setVisible(true);
                    }              
                });
                $('div#controls div#showsharedbtn').addClass('ui-btn-active');                
            }
        });
    }); // end .bind
});

$('#page-map').live("pageshow", function() {
    
    var id, scancode; 
    var location = null, comment, center, centerLatAndLang = [-1,-1]; 
            
    // Create markers for all shared items
    $('ul#shared_list li a').each(function(i) {
        var info; // needed HERE for each invocation
        id = $(this).attr('id');
        scancode = id.slice(id.indexOf("x") + 1);
        //console.log("found shared li id=" + id + " scancode=" + scancode);
        
        comment = $('a#' + id + ' p span#comment').text();                
        location = $('a#' + id + ' p span#loc').text();
        comment = (comment !== "") ? comment : "(no comment)";
        info = "Shared Item: <strong>" + scancode + "</strong><br/>" + 
            $('a#' + id + ' p span#rating').text() + "<br/>" + comment;
        $('#map_canvas').gmap('addMarker', { 'tags':'allShared', 
            'position': location, 'icon': gimage, 
            'shadow' : shadow, 'shape' : shadowShape, 'bounds': true })
            .click(function() { $('#map_canvas').gmap('openInfoWindow', {'content': info }, this);});
    });
    if (location) {
        $('div#controls div#showsharedbtn').addClass('ui-btn-active');
    } // else there are no shared markers
    location = null;
    
    // Create markers for all my items
    $('ul#item_list li[id!="li-placeholder"]').each(function(i) {
       var info; // needed HERE for each invocation
       id = $(this).attr('id');
       scancode = id.slice(id.indexOf("item") + 4);
       //console.log("found li id=" + id + " scancode=" + scancode); 
       
       comment = $('a#' + id + ' p span#comment').text();                
       location = $('a#' + id + ' p span#loc').text();
       comment = (comment !== "") ? comment : "(no comment)";
       info = "Item: <strong>" + scancode + "</strong><br/>" + $('a#' + id + ' p span#rating').text()
           + "<br/>" + comment; 
       $('#map_canvas').gmap('addMarker', { 'tags': 'all', 
           'position': location, 'icon': bimage, 
               'shadow' : shadow, 'shape' : shadowShape, 'bounds': true })
           .click(function() { $('#map_canvas').gmap('openInfoWindow', {'content': info }, this);
       });
    });
    $('div#controls div#showminebtn').addClass('ui-btn-active');
    
    // mapcenter will have prevpage center, if any
    center = $('#mapcenter').text();
    if (center !== "") {
        centerLatAndLang = center.split(',', 2);
    } else if (location) {
        centerLatAndLang = location.split(',', 2);
    } // else default location will do
          
    if (centerLatAndLang[0] !== -1) {
        $('#map_canvas').gmap('option', 'center', new google.maps.LatLng(centerLatAndLang[0], centerLatAndLang[1]));
    }
    $('#mapcenter').text("");
    $('#map_canvas').gmap('option', 'zoom', 8);
    $('#map_canvas').gmap('refresh');
});

$('#page-map').live("pagehide", function() {
    $('div#controls div#showminebtn').removeClass('ui-btn-active');
    $('div#controls div#showsharedbtn').removeClass('ui-btn-active');
        
    // Remove all markers when leaving map page - user may edit markers
    $('#map_canvas').gmap('clear', 'markers');
    //google.maps.event.clearInstanceListeners(marker);
});