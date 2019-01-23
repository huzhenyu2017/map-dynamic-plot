/**
 * @class L.Draw.Fine_arrow
 * @aka Draw.Fine_Arrow
 * @inherits L.Draw.Polygon
 */
L.Draw.Fine_Arrow = L.Draw.Polygon.extend({
	statics: {
		TYPE: 'fine_arrow'
	},
	
	Poly: L.Polygon,
    tailWidthFactor : 0.15,
    neckWidthFactor : 0.2,
    headWidthFactor : 0.25,
    headAngle : Math.PI / 8.5,
    neckAngle : Math.PI / 13,
    points : [],

	options: {
		showArea: false,
		showLength: false,
		shapeOptions: {
			stroke: true,
			color: '#3388ff',
			weight: 4,
			opacity: 0.5,
			fill: true,
			fillColor: null, //same as color by default
			fillOpacity: 0.2,
			clickable: true,
			polyType:'Fine_Arrow'
		},
		// Whether to use the metric measurement system (truthy) or not (falsy).
		// Also defines the units to use for the metric system as an array of
		// strings (e.g. `['ha', 'm']`).
		metric: true,
		feet: true, // When not metric, to use feet instead of yards for display.
		nautic: false, // When not metric, not feet use nautic mile for display
		// Defines the precision for each type of unit (e.g. {km: 2, ft: 0}
		precision: {},
		maxPoints: 2 //在画布上点击两下，绘图就结束
	},

	// @method initialize(): void
	initialize: function (map, options) {
		L.Draw.Polygon.prototype.initialize.call(this, map, options);
		// Save the type so super can fire, need to do this as cannot do this.TYPE :(
		this.type = L.Draw.Fine_Arrow.TYPE;
		
	},
	addHooks: function () {
		L.Draw.Polygon.prototype.addHooks.call(this);
		if (this._map) {
			this._mapDraggable = this._map.dragging.enabled();

			if (this._mapDraggable) {
				this._map.dragging.disable();
			}

			//TODO refactor: move cursor to styles
			this._container.style.cursor = 'crosshair';

			// we should prevent default, otherwise default behavior (scrolling) will fire,
			// and that will cause document.touchend to fire and will stop the drawing
			// (circle, rectangle) in touch mode.
			// (update): we have to send passive now to prevent scroll, because by default it is {passive: true} now, which means,
			// handler can't event.preventDefault
			// check the news https://developers.google.com/web/updates/2016/06/passive-event-listeners
			document.addEventListener('touchstart', L.DomEvent.preventDefault, {passive: false});
			this.startPoint=[];
		}
	},
	
	removeHooks: function () {
		L.Draw.Polygon.prototype.removeHooks.call(this);
		if (this._map) {
			if (this._mapDraggable) {
				this._map.dragging.enable();
			}

			//TODO refactor: move cursor to styles
			this._container.style.cursor = '';

			L.DomEvent.off(document, 'mouseup', this._onMouseUp, this);
			L.DomEvent.off(document, 'touchend', this._onMouseUp, this);

			document.removeEventListener('touchstart', L.DomEvent.preventDefault);

			// If the box element doesn't exist they must not have moved the mouse, so don't need to destroy/return
			if (this._shape) {
				this._map.removeLayer(this._shape);
				delete this._shape;
			}
		}
		this._isDrawing = false;	
	},
	
	//获取点坐标串的copy
	getPoints: function(){
		return this._poly.getLatLngs();
        //return this.points.slice(0);
    },

	//获取鼠标在屏幕上点了几下
    getPointCount: function(){
        var a = this._poly.getLatLngs()
        return a.length;
        //return this.points.length;
    },
	
	_onMouseMove: function (e) {
		//L.Draw.Polyline.prototype._onMouseMove.call(this,e);
		var newPos = this._map.mouseEventToLayerPoint(e.originalEvent);
		var latlng = this._map.layerPointToLatLng(newPos);

		// Save latlng
		// should this be moved to _updateGuide() ?
		this._currentLatLng = latlng;

		this._updateTooltip(latlng);

		// Update the guide line
		//this._updateGuide(newPos);

		// Update the mouse marker position
		this._mouseMarker.setLatLng(latlng);

		L.DomEvent.preventDefault(e.originalEvent);
		//this._updateGuide(null);
		var l = e.latlng;
		if(this._isDrawing) {
			this._drawShape(l);
		}
	},
	
	// @method addVertex(): void
	// Add a vertex to the end of the polyline
	addVertex: function (latlng) {
		var markersLength = this._markers.length;
		// markersLength must be greater than or equal to 2 before intersections can occur
		if (markersLength >= 2 && !this.options.allowIntersection && this._poly.newLatLngIntersects(latlng)) {
			this._showErrorTooltip();
			return;
		}
		else if (this._errorShown) {
			this._hideErrorTooltip();
		}

		this._markers.push(this._createMarker(latlng));

		this._poly.addLatLng(latlng);

		/*if (this._poly.getLatLngs().length === 2) {
			this._map.addLayer(this._poly);
		}*/

		this._vertexChanged(latlng, true);
	},
	
	_drawShape: function (latlng) {
		// Calculate the distance based on the version
	/*	if (L.GeometryUtil.isVersion07x()) {
			var distance = this._startLatLng.distanceTo(latlng);
		} else {
			var distance = this._map.distance(this._startLatLng, latlng);
		}*/
		var startPoint = this._poly.getLatLngs().slice(0,1);
		var a = startPoint.slice(0);
		var b = a.concat(latlng);
		if (!this._shape) {
			var p1 = this.symbolModeling(b);
			console.log(p1);
			if(!p1){
				return;
			}
			this._shape = new L.Polygon(p1,this.options.shapeOptions);
			this._map.addLayer(this._shape);
		} else {
			var p2 = this.symbolModeling(b);
			//var p2latLag = L.latLng(p2);
			this._shape.setLatLngs(p2);
			/*var p = this.symbolModeling(b);
			this._shape = new L.Polygon(p,this.options.shapeOptions);
			this._map.addLayer(this._shape);*/
			//alert("有问题");
			//this._shape.setRadius(distance);
		}
	},
	
	_fireCreatedEvent: function () {
		pnt = this._poly.getLatLngs();
		if(pnt.length>=1){
			var p = this.symbolModeling(pnt);
	    	this.setCoordinates(p);
		}
		this.points=[];
	},

	symbolModeling: function(value){
		var count = value.length;
	    if(count < 2) {
	        return;
	    }
	    var pnts = value.slice(0);
	    Cpnts = [[pnts[0].lat,pnts[0].lng],[pnts[1].lat,pnts[1].lng]];
	    var pnt1 = Cpnts[0];
	    var pnt2 = Cpnts[1];
	    //有时用户移动过快或者过慢，_onMouseMove捕获到的坐标会和onTouch捕获到的坐标一样。
	    //为了防止这种事情发生：
	    if(pnt1[1]==pnt2[1]&&pnt1[2]==pnt2[2]){
	    	return false;
	    }
	    var len = L.PlotUtils.getBaseLength(Cpnts);
	    var tailWidth = len * this.tailWidthFactor;
	    var neckWidth = len * this.neckWidthFactor;
	    var headWidth = len * this.headWidthFactor;
	    var tailLeft = L.PlotUtils.getThirdPoint(pnt2, pnt1, L.Constants.HALF_PI, tailWidth, true);
	    var tailRight = L.PlotUtils.getThirdPoint(pnt2, pnt1, L.Constants.HALF_PI, tailWidth, false);
	    var headLeft = L.PlotUtils.getThirdPoint(pnt1, pnt2, this.headAngle, headWidth, false);
	    var headRight = L.PlotUtils.getThirdPoint(pnt1, pnt2, this.headAngle, headWidth, true);
	    var neckLeft = L.PlotUtils.getThirdPoint(pnt1, pnt2, this.neckAngle, neckWidth, false);
	    var neckRight = L.PlotUtils.getThirdPoint(pnt1, pnt2, this.neckAngle, neckWidth, true);
	    var pList = [tailLeft, neckLeft, headLeft, pnt2, headRight, neckRight, tailRight];
	    return(pList);
	},

	setCoordinates: function (LatLngs){
		var poly = new this.Poly(LatLngs, this.options.shapeOptions);
		L.Draw.Feature.prototype._fireCreatedEvent.call(this, poly);
	},	
});
