/*
	Simple OpenID Plugin
	http://code.google.com/p/openid-selector/
	
	This code is licensed under the New BSD License.
*/

var applaud_providers;
var openid;
(function ($) {
openid = {
	version : '1.3', // version constant
//	demo : false,
//	demo_text : null,
	
	img_path : 'openid/images/',
	locale : null, // is set in openid-<locale>.js
	sprite : null, // usually equals to locale, is set in
	                // openid-<locale>.js
	signin_text : null, // text on submit button on the form
	all_small : false, // output large providers w/ small icons
	no_sprite : false, // don't use sprite image

	input_id : null,
	provider_url : null,
	provider_id : null,

	/**
	 * Class constructor
	 * 
	 * @return {Void}
	 */
	init : function(input_id) {
		applaud_providers = $.extend({}, providers_large, null);
		var openid_btns = $('#openid_btns');
		this.input_id = input_id;
		$('#openid_choice').show();
//		$('#openid_input_area').empty();
		var i = 0;
		// add box for each provider
		for (id in providers_large) {
			box = this.getBoxHTML(id, providers_large[id], (this.all_small ? 'small' : 'large'), i++);
			openid_btns.append(box);
		}
/*		if (providers_small) {
			openid_btns.append('<br/>');
			for (id in providers_small) {
				box = this.getBoxHTML(id, providers_small[id], 'small', i++);
				openid_btns.append(box);
			}
		}*/
		$('#openid_form').submit(this.submit);
		
		//var box_id = this.readId();
		
		//if (box_id) {
		//	this.signin(box_id, true);
		//}
	},

	/**
	 * @return {String}
	 * 
	 * MDS: no title needed for mobile
	 */
	getBoxHTML : function(box_id, provider, box_size, index) {
		if (this.no_sprite) {
			var image_ext = box_size == 'small' ? '.ico.gif' : '.gif';
			return '<a href="javascript:openid.signin(\'' + box_id + '\');"'
					+ ' style="background: #FFF url(' + this.img_path + '../images.' + box_size + '/' + box_id + image_ext + ') no-repeat center center" '
					+ 'class="' + box_id + ' openid_' + box_size + '_btn"></a>';
		}
		var x = box_size == 'small' ? -index * 24 : -index * 100;
		var y = box_size == 'small' ? -60 : 0;
		return '<a href="javascript:openid.signin(\'' + box_id + '\');"'
				+ ' style="background: #FFF url(' + this.img_path + 'openid-providers-' + this.sprite + '.png); background-position: ' + x + 'px ' + y + 'px" '
				+ 'class="' + box_id + ' openid_' + box_size + '_btn"></a>';
	},

	/**
	 * Provider image click
	 * 
	 * @return {Void}
	 */
	signin : function(box_id, onload) {
		var provider = applaud_providers[box_id];
		if (!provider) {
			return;
		}
		this.highlight(box_id);
		this.saveId(box_id);
		this.provider_id = box_id;
		this.provider_url = provider['url'];
				
//		if (provider['label']) {
//			this.useInputBox(provider);
//		} else {
//			$('#openid_input_area').empty();
		    $('#devmenu_openid_choice').html('<h4>' + provider.name + '</h4>');
			if (!onload) {
				$('#openid_form').submit();
			}
//		}
	},

	/**
	 * Sign-in button click
	 * 
	 * @return {Boolean}
	 */
	submit : function() {
		var url = openid.provider_url;
		if (url) {
            url = url.replace('{username}', $('#openid_username').val());
			openid.setOpenIdUrl(url);
		}
//		if (openid.demo) {
//			alert(openid.demo_text + "\r\n" + document.getElementById(openid.input_id).value);
//			return false;
//		}
		if (url.indexOf("javascript:") == 0) {
			url = url.substr("javascript:".length);

			eval(url);
			return false;
		}
        return true;
	},

	/**
	 * @return {Void}
	 */
	setOpenIdUrl : function(url) {
		var hidden = document.getElementById(this.input_id);
		if (hidden != null) {
			hidden.value = url;
		} else {
			$('#openid_form').append('<input type="hidden" id="' + this.input_id + '" name="' + this.input_id + '" value="' + url + '"/>');
		}
	},

	/**
	 * @return {Void}
	 */
	highlight : function(box_id) {
		// remove previous highlight.
		var highlight = $('#openid_highlight');
		if (highlight) {
			highlight.replaceWith($('#openid_highlight a')[0]);
		}
		// add new highlight.
		$('.' + box_id).wrap('<div id="openid_highlight"></div>');
	},

	saveId : function(value) {
	    localStorage.powerapp_openid = value;
	    //$('span#useropenid').html(value);
	},

	readId : function() {
	   //var id = $('span#useropenid').html();
	   if (id == "(Not Set)")
	       id = localStorage.powerapp_openid;
	   return id;
	},

	/**
	 * @return {Void}
	 */
	useInputBox : function(provider) {
//		var input_area = $('#openid_input_area');
		var html = '';
		var id = 'openid_username';
		var value = '';
//		var label = provider['label'];
		var style = '';
//		if (label) {
//			html = '<p>' + label + '</p>';
//		}
		if (provider['name'] == 'OpenID') {
			id = this.input_id;
			value = 'http://';
			style = 'background: #FFF url(' + this.img_path + 'openid-inputicon.gif) no-repeat scroll 0 50%; padding-left:18px;';
		}
		html += '<input id="' + id + '" type="text" style="' + style + '" name="' + id + '" value="' + value + '" />'
				+ '<input id="openid_submit" type="submit" value="' + this.signin_text + '"/>';
//		input_area.empty();
//		input_area.append(html);
		$('#' + id).focus();
	},

//	setDemoMode : function(demoMode) {
//		this.demo = demoMode;
//	}
};
})(jQuery);
