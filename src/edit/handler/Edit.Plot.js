L.Edit = L.Edit || {};
/**
 * @class L.Edit.Plot
 * @aka Edit.Plot
 * @inherits L.Edit.SimpleShape
 */
L.Edit.Plot = L.Edit.SimpleShape.extend({
	_createMoveMarker: function () {
		var bounds = this._shape.getBounds(),
			center = bounds.getCenter();

		this._moveMarker = this._createMarker(center, this.options.moveIcon);
	},

	_createResizeMarker: function () {
		var points = this._shape.getPoints();

		this._resizeMarkers = [];

		for (var i = 0, l = points.length; i < l; i++) {
			this._resizeMarkers.push(this._createMarker(points[i], this.options.resizeIcon));
			// Monkey in the corner index as we will need to know this for dragging
			this._resizeMarkers[i]._pointIndex = i;
		}
	},

	_onMarkerDragStart: function (e) {
		L.Edit.SimpleShape.prototype._onMarkerDragStart.call(this, e);

		// Save a reference to the opposite point
		//var corners = this._getCorners(),
			marker = e.target,
			currentPointIndex = marker._pointIndex;

		this._DragingPoint = currentPointIndex;

		this._togglePointMarkers(0, currentPointIndex);
	},

	_onMarkerDragEnd: function (e) {
		var marker = e.target,
			bounds, center;

		// Reset move marker position to the center
		if (marker === this._moveMarker) {
			bounds = this._shape.getBounds();
			center = bounds.getCenter();

			marker.setLatLng(center);
		}

		this._togglePointMarkers(1);

		this._repositionPointMarkers();

		L.Edit.SimpleShape.prototype._onMarkerDragEnd.call(this, e);
	},

	_move: function (newCenter) {
		var latlngs =  this._shape.getPoints(),
			bounds = this._shape.getBounds(),
			center = bounds.getCenter(),
			offset, newLatLngs= [];
		// Offset the latlngs to the new center
		for (var i = 0, l = latlngs.length; i < l; i++) {
			offset = [latlngs[i].lat - center.lat, latlngs[i].lng - center.lng];
			newLatLngs.push(L.latLng(newCenter.lat + offset[0], newCenter.lng + offset[1]));
		}

		this._shape.setPoints(newLatLngs);
		this._Rec.setBounds(bounds);
		// Reposition the resize markers
		this._repositionPointMarkers();

		this._map.fire(L.Draw.Event.EDITMOVE, {layer: this._shape});
	},

	_resize: function (latlng) {
		/*//var bounds;
		this.points[this._DragingPoint]=latlng;
		// Update the shape based on the current position of this corner and the opposite point
		this._shape.setPoints(L.latLngBounds(latlng, this._oppositeCorner));*/
		if(this._DragingPoint>=0 && this._DragingPoint<this._shape.points.length){
            this._shape.points[this._DragingPoint] = latlng;
            this._shape.symbolModeling();
        }
		// Reposition the move marker
		bounds = this._shape.getBounds();
		this._moveMarker.setLatLng(bounds.getCenter());
		this._Rec.setBounds(bounds);
		this._map.fire(L.Draw.Event.EDITRESIZE, {layer: this._shape});
	},

	_getCorners: function () {
		var bounds = this._shape.getBounds(),
			nw = bounds.getNorthWest(),
			ne = bounds.getNorthEast(),
			se = bounds.getSouthEast(),
			sw = bounds.getSouthWest();

		return [nw, ne, se, sw];
	},

	_togglePointMarkers: function (opacity) {
		for (var i = 0, l = this._resizeMarkers.length; i < l; i++) {
			this._resizeMarkers[i].setOpacity(opacity);
		}
	},

	_repositionPointMarkers: function () {
		var points = this._shape.getPoints();

		for (var i = 0, l = this._resizeMarkers.length; i < l; i++) {
			this._resizeMarkers[i].setLatLng(points[i]);
		}
	}
});

L.Polygon.addInitHook(function () {
	if (L.Edit.Plot&&this.Plot) {
		this.editing = new L.Edit.Plot(this);

		if (this.options.editable) {
			this.editing.enable();
		}
	}
});
L.Polyline.addInitHook(function () {
	if (L.Edit.Plot&&this.Plot) {
		this.editing = new L.Edit.Plot(this);

		if (this.options.editable) {
			this.editing.enable();
		}
	}
});