var AccountList = function() {};
			
AccountList.prototype.get = function(params, success, fail) {
	return PhoneGap.exec( function(args) {
		success(args);
	}, function(args) {
		fail(args);
	}, 'AccountList', '', [params]);
};

cordova.addConstructor(function() {
	cordova.addPlugin('AccountList', new AccountList());
});