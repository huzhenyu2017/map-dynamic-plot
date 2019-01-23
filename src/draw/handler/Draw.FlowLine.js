/**
 * @class L.Draw.FlowLine
 * @aka Draw.FlowLine
 * @inherits L.Draw.Polyline
 */
L.Draw.FlowLine = L.Draw.Polyline.extend({
	statics: {
		TYPE: 'flowline'
	},

	Poly: L.migrationLayer,

	options: {
		allowIntersection: true,
		repeatMode: false,
		drawError: {
			color: '#b00b00',
			timeout: 2500
		},
		icon: new L.DivIcon({
			iconSize: new L.Point(8, 8),
			className: 'leaflet-div-icon leaflet-editing-icon'
		}),
		touchIcon: new L.DivIcon({
			iconSize: new L.Point(20, 20),
			className: 'leaflet-div-icon leaflet-editing-icon leaflet-touch-icon'
		}),
		guidelineDistance: 20,
		maxGuideLineLength: 4000,
		shapeOptions: {
			//renderer: L.Canvas.roughCanvas(),
			stroke: true,
			color: '#FF1493',
			weight: 4,
			opacity: 0,
			flow:true,
			clickable: true
		},
		// Whether to use the metric measurement system (truthy) or not (falsy).
		// Also defines the units to use for the metric system as an array of
		// strings (e.g. `['ha', 'm']`).
		metric: true,
		feet: true, // When not metric, to use feet instead of yards for display.
		nautic: false, // When not metric, not feet use nautic mile for display
		// Defines the precision for each type of unit (e.g. {km: 2, ft: 0}
		precision: {},
		maxPoints: 2
	},

	// @method initialize(): void
	initialize: function(map, options) {
		// if touch, switch to touch icon
		if (L.Browser.touch) {
			this.options.icon = this.options.touchIcon;
		}

		// Need to set this here to ensure the correct message is used.
		this.options.drawError.message = L.drawLocal.draw.handlers.polyline.error;

		// Merge default drawError options with custom options
		if (options && options.drawError) {
			options.drawError = L.Util.extend({}, this.options.drawError, options.drawError);
		}
		L.Draw.Polyline.prototype.initialize.call(this, map, options);

		// Save the type so super can fire, need to do this as cannot do this.TYPE :(
		this.type = L.Draw.FlowLine.TYPE;
	},

	_getTooltipText: function() {
		var text, subtext;

		if(this._markers.length === 0) {
			text = L.drawLocal.draw.handlers.polygon.tooltip.start;
		} else if(this._markers.length < 3) {
			text = L.drawLocal.draw.handlers.polygon.tooltip.cont;
			subtext = this._getMeasurementString();
		} else {
			text = L.drawLocal.draw.handlers.polygon.tooltip.end;
			subtext = this._getMeasurementString();
		}

		return {
			text: text,
			subtext: subtext
		};
	},
	_vertexChanged: function (latlng, added) {
		var latLngs;
		L.Draw.Polyline.prototype._vertexChanged.call(this, latlng, added);
	},
	_fireCreatedEvent: function() {
		pnt = this._poly.getLatLngs();
		var data = this.getData(pnt);
		drawnFlowline = new this.Poly({
			map: map,
			data: data
		},pnt);
		//poly.addTo(map);
		L.Draw.Feature.prototype._fireCreatedEvent.call(this, drawnFlowline);
	},
	//整理flowline data格式
	getData: function(value) {
		var latlngs = [];
		var data=[];
		for(var i = 0; i < value.length; i++) {
			var lat = value[i].lat;
			var lng = value[i].lng;

			latlngs.push([lng, lat]);
		};

		data.push({
			"from": latlngs[0],
			"to": latlngs[1],
			"color": "#ff3a31"
		});
		//latlngs.splice(0, latlngs.length);

		return data;
	}
});