google.maps.event.addDomListener(window, 'load', function() {
	var map = new google.maps.Map(document.getElementById('map-canvas'), {
		center: new google.maps.LatLng(37.78, -122.40),
		zoom: 14,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	var panelDiv = document.getElementById('panel');

	/* features */
	var feature_map = new Array();
	var icon_map = new Array();
	var feature_arg = new Array();
	for (var i = 0; i < features.length; i++) {
		var entry = features[i];
		var feature = new storeLocator.Feature(entry[0], entry[1]);
		feature_arg.push(feature);
		feature_map[entry[0]] = new storeLocator.FeatureSet(feature);
		icon_map[entry[0]] = new google.maps.MarkerImage('icons/' + entry[2]);
	}
	function FeatureSet() {
		return storeLocator.FeatureSet.apply(this, feature_arg);
	}
	FeatureSet.prototype = storeLocator.FeatureSet.prototype;
	var featureSet = new FeatureSet();

	var infoPanelFunc = function() {
			var details = this.getDetails();
			return '<div class="store"><div class="title">' + details.title
					+ '</div><div class="address">' + details.address + '</div></div>';
	};

	/* stores */
	function toHTML(str) {
		str = str.replace(/(http\S+)/g, '<a href="$1" target="_blank">$1</a>');
		str = str.replace(/>https:\/\/en.wikipedia.org[^<]+</g, '>Wikipedia<');
		str = str.replace(/\n/g, '<br/>');
		return str;
	}
	var stores = new Array();
	for (var i = 0; i < venues.length; i++) {
		var venue = venues[i];
		var store = new storeLocator.Store(venue[0],
				new google.maps.LatLng({ lat: venue[1], lng: venue[2] }),
				feature_map[venue[3]],
				{ title: venue[4], address: venue[5], web: toHTML(venue[6]) });
		store.getInfoPanelContent = infoPanelFunc;
		stores.push(store);
	}

	var data = new storeLocator.StaticDataFeed();
	data.setStores(stores);

	var view = new storeLocator.View(map, data, {
		geolocation: false,
		features: featureSet
	});
	view.createMarker = function(store) {
		var markerOptions = {
			position: store.getLocation(),
			icon: icon_map[store.getFeatures().asList()[0].id_],
			title: store.getDetails().title
		};
		return new google.maps.Marker(markerOptions);
	}

	new storeLocator.Panel(panelDiv, {
		view: view
	});
});

