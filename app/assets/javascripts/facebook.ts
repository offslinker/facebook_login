/// <reference path="typings/tsd.d.ts" />
interface FBAppUserInfo {
	id: string,
	email: string,
	name: string,
	picture: FBPicture
}
interface FBPicture {
	data: {
		url: string
	}
}
interface FBCustomUserInfo {
	name: string,
	picture: FBPicture
}
interface FBLoginStatus {
	status: string
}
interface FBFriendsData {
	data: Array<FBCustomUserInfo>
}
$(() => {
	$("a[data-facebook-login]").on('click', (event) => {
		event.preventDefault();
		FB.login(loginCallback, { scope: "public_profile,email,user_friends" });
	});

	function loginCallback(response: FBLoginStatus) {
		if (response.status === 'connected') {
			FB.api('/me?fields=id,name,email', 'get', (me_info: FBAppUserInfo) => {
				$.ajax('/users/'+ me_info.id, {
					type: "PUT",
					dataType: "json",
					data: { 
						user: { facebook_id: me_info.id, email: me_info.email, name: me_info.name } }
					}).
				done((post_response) => {});
			});
			loadFriendsData();
		}
	};
	function loadFriendsData() {
		var friend_in_app_object = $.Deferred();
		var friend_not_in_app_object = $.Deferred();
		$.when(friend_in_app_object, friend_not_in_app_object).done(renderFriendsData);
		//Big limit makes result close to real alphabetical order, but does not require several loads
		FB.api('/me/taggable_friends?fields=name,picture&sort=name&limit=500', 'get', renderFriendsData);
	}
	function renderFriendsData(unsorted_friends:FBFriendsData) {
		var friends = unsorted_friends.data.sort((a, b) => { return a.name.localeCompare(b.name); });
		var template = document.getElementById('friends_template').innerHTML;
		var result: string[] = [];
		for (var index = 0; index < friends.length && index < 10; index++) {
			var friend_info: FBCustomUserInfo = friends[index];
			result[index] = template.
				replace("%name%", friend_info.name).
				replace("%%picture_url%%", friend_info.picture.data.url);
		};
		var friends_div = document.getElementById('friends_data');
		if (result.length == 0) {
			friends_div.innerHTML = "<div class='warning'>Could not load your friends.</div>"
		} else {
			friends_div.innerHTML = result.join('');
		}
	};
	window.fbAsyncInit = function() {
		FB.init({
			appId: '1498228503823076',
			xfbml: true,
			version: 'v2.4'
		});
		FB.getLoginStatus((response: FBLoginStatus) => {
			if (response.status == "connected") {
				var friends_div = document.getElementById('friends_data');
				friends_div.innerHTML = "";
				loadFriendsData();
			}
		});
	};

});
