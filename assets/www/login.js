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


$('#page-login').live('pageinit', function(event){
    openid.init('openid_identifier');
        
    $('#openid_form')
    .ajaxForm({
        // url : serverUrl + '/openidAuth', 
        // dataType : 'json',
        // data: { key1: 'value1', key2: 'value2' }
        beforeSend : function(jqXHR, settings) {
            fadingMsg('Contacting OpenID Provider..');
        },
        cache : false,
        success : function (responseText, statusText) {
            console.log("PowerApp: openid_form statusText: " + statusText);
            if (responseText.indexOf('https://') === 0) {
                console.log("PowerApp: https:// response found: " + responseText);
                window.plugins.childBrowser.showWebPage(responseText, { showLocationBar : false });
                return true;
            } else if ((responseText.indexOf('http://') === 0) && responseText.indexOf('verify?') > 0) {
                console.log("PowerApp: openid_form Got a verify before auth" + responseText);
                //  General failure cases after this..
            } else {
                console.log("PowerApp: Failure in openid_form .ajaxform");
            }
            $('#fading_msg').remove();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("PowerApp: openid_form ajax error: " + textStatus + " : " + errorThrown);
            // If errorThrown === "" and textStatus === error
            // suggest checking Form action
            alert("OpenID Ajax Form error: " + textStatus + " : " + errorThrown);
            $('#fading_msg').remove();
        }
    });    
    
});

$('#page-login').live('pageshow', function(event){
    if (!isConnected()) {
        fadingMsg("Please check network connection. Can not login when offline.");
        console.log("Device not connected when viewing login page.");
    }
    $("div ul li a[href='#page-item']").removeClass('ui-btn-active');
    $("div ul li a[href='#page-list']").removeClass('ui-btn-active');
    $("div ul li a[href='#page-map']").removeClass('ui-btn-active');
});

function onLogin (btn) {
    if (btn === 1) {
        console.log("PowerApp: onLogin");
        $.mobile.changePage($('#page-login'), { changeHash : false });
    }
}
