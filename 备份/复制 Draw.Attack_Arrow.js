/**
 * @class L.Draw.Attack_arrow
 * @aka Draw.Attack_Arrow
 * @inherits L.Draw.Polygon
 */
L.Draw.Attack_Arrow = L.Draw.Polygon.extend({
	statics: {
		TYPE: 'attack_arrow'
	},
	
	Poly: L.Polygon,
    headHeightFactor : 0.18,
    headWidthFactor : 0.3,
    neckHeightFactor : 0.85,
    neckWidthFactor : 0.15,
    headTailFactor : 0.8,
    //fixPointCount : 3,
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
			clickable: true
		},
		// Whether to use the metric measurement system (truthy) or not (falsy).
		// Also defines the units to use for the metric system as an array of
		// strings (e.g. `['ha', 'm']`).
		metric: true,
		feet: true, // When not metric, to use feet instead of yards for display.
		nautic: false, // When not metric, not feet use nautic mile for display
		// Defines the precision for each type of unit (e.g. {km: 2, ft: 0}
		precision: {}
	},

	// @method initialize(): void
	initialize: function (map, options) {
		L.Draw.Polygon.prototype.initialize.call(this, map, options);
		// Save the type so super can fire, need to do this as cannot do this.TYPE :(
		this.type = L.Draw.Attack_Arrow.TYPE;
		
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
    },

	//获取鼠标在屏幕上点了几下
    getPointCount: function(){
        return this._poly.getLatLngs().length;
    },
	
	_onMouseMove: function (e) {
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
		var l = e.latlng;
		if(this._isDrawing) {
			this._drawShape(l);
		}
	},
	
	// @method addVertex(): void
	// Add a vertex to the end of the polyline
	addVertex: function (latlng) {
		console.log("addVertex");
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

		this._vertexChanged(latlng, true);
	},
	_vertexChanged: function (latlng, added) {
		this._map.fire(L.Draw.Event.DRAWVERTEX, {layers: this._markerGroup});
		this._updateFinishHandler();

		this._updateRunningMeasure(latlng, added);

		this._clearGuides();

		this._updateTooltip();
	},
	_updateFinishHandler: function () {
	var markerCount = this._markers.length;
	// The last marker should have a click handler to close the polyline
	if (markerCount > 1) {
		this._markers[markerCount - 1].on('click', this._finishShape, this);
		console.log("AttackArrowMarker's_onMouseDown_Logged");
	}

	// Remove the old marker click handler (as only the last point should close the polyline)
	if (markerCount > 2) {
		this._markers[markerCount - 2].off('click', this._finishShape, this);
	}
	},
	
	_drawShape: function (latlng) {

		var startPoint = this._poly.getLatLngs().slice(0,1);
		var a = startPoint.slice(0);
		
		var b = a.concat(latlng);
		if(!this._shape){
			this._shape = new L.Polygon([],this.options.shapeOptions);
			this._map.addLayer(this._shape);
		}
		if(this.getPointCount()==1)
		{
			this._shape.setLatLngs(b);
			return;
		}
		 else {
		 	 a = this.getPoints();
		 	 b = a.concat(latlng);
			var p = this.symbolModeling(b);
			if(!p){
				return;
			}
			this._shape.setLatLngs(p);
		}
	},
	
	_fireCreatedEvent: function () {
		this._isDrawing = false;
		if (this.getPointCount() < 2){
	        return;
	    }
	    if (this.getPointCount() == 2) {
	        this.setCoordinates(this._poly.getLatLngs());
	        return;
	    }
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
	    };
	    var pnts=[];
	    for (i in value){
	    	pnts[i]=[];
	    	pnts[i][0]=value[i].lat;
	    	pnts[i][1]=value[i].lng;
	    }; 
	    //有时用户移动过快或者过慢，_onMouseMove捕获到的坐标会和onTouch捕获到的坐标一样。
	    //为了防止这种事情发生：
	    if(pnts[pnts.length-1][1]==pnts[pnts.length-2][1]&&pnts[pnts.length-1][2]==pnts[pnts.length-2][2])
	    {
	    	return false;
	    }
		//var pnts = this.getPoints();
	    // 计算箭尾
	    var tailLeft = pnts[0];
	    var tailRight = pnts[1];
	    if (L.PlotUtils.isClockWise(pnts[0], pnts[1], pnts[2])) {
	        tailLeft = pnts[1];
	        tailRight = pnts[0];
	    }
	    var midTail = L.PlotUtils.mid(tailLeft, tailRight);
	    var bonePnts = [midTail].concat(pnts.slice(2));
	    // 计算箭头
	    var headPnts = this.getArrowHeadPoints(bonePnts, tailLeft, tailRight);
	    var neckLeft = headPnts[0];
	    var neckRight = headPnts[4];
	    var tailWidthFactor = L.PlotUtils.distance(tailLeft, tailRight) / L.PlotUtils.getBaseLength(bonePnts);
	    // 计算箭身
	    var bodyPnts = this.getArrowBodyPoints(bonePnts, neckLeft, neckRight, tailWidthFactor);
	    // 整合
	    var count = bodyPnts.length;
	    var leftPnts = [tailLeft].concat(bodyPnts.slice(0, count / 2));
	    leftPnts.push(neckLeft);
	    var rightPnts = [tailRight].concat(bodyPnts.slice(count / 2, count));
	    rightPnts.push(neckRight);
	
	    leftPnts = L.PlotUtils.getQBSplinePoints(leftPnts);
	    rightPnts = L.PlotUtils.getQBSplinePoints(rightPnts);
	
	    return(leftPnts.concat(headPnts, rightPnts.reverse()));
	}
	,

	getArrowHeadPoints:function (points, tailLeft, tailRight) {
	    var len = L.PlotUtils.getBaseLength(points);
	    var headHeight = len * this.headHeightFactor;
	    var headPnt = points[points.length - 1];
	    len = L.PlotUtils.distance(headPnt, points[points.length - 2]);
	    var tailWidth = L.PlotUtils.distance(tailLeft, tailRight);
	    if (headHeight > tailWidth * this.headTailFactor) {
	        headHeight = tailWidth * this.headTailFactor;
	    }
	    var headWidth = headHeight * this.headWidthFactor;
	    var neckWidth = headHeight * this.neckWidthFactor;
	    headHeight = headHeight > len ? len : headHeight;
	    var neckHeight = headHeight * this.neckHeightFactor;
	    var headEndPnt = L.PlotUtils.getThirdPoint(points[points.length - 2], headPnt, 0, headHeight, true);
	    var neckEndPnt = L.PlotUtils.getThirdPoint(points[points.length - 2], headPnt, 0, neckHeight, true);
	    var headLeft = L.PlotUtils.getThirdPoint(headPnt, headEndPnt, L.Constants.HALF_PI, headWidth, false);
	    var headRight = L.PlotUtils.getThirdPoint(headPnt, headEndPnt, L.Constants.HALF_PI, headWidth, true);
	    var neckLeft = L.PlotUtils.getThirdPoint(headPnt, neckEndPnt, L.Constants.HALF_PI, neckWidth, false);
	    var neckRight = L.PlotUtils.getThirdPoint(headPnt, neckEndPnt, L.Constants.HALF_PI, neckWidth, true);
	    return [neckLeft, headLeft, headPnt, headRight, neckRight];
	},

	getArrowBodyPoints : function (points, neckLeft, neckRight, tailWidthFactor) {
	    var allLen = L.PlotUtils.wholeDistance(points);
	    var len = L.PlotUtils.getBaseLength(points);
	    var tailWidth = len * tailWidthFactor;
	    var neckWidth = L.PlotUtils.distance(neckLeft, neckRight);
	    var widthDif = (tailWidth - neckWidth) / 2;
	    var tempLen = 0, leftBodyPnts = [], rightBodyPnts = [];
	    for (var i = 1; i < points.length - 1; i++) {
	        var angle = L.PlotUtils.getAngleOfThreePoints(points[i - 1], points[i], points[i + 1]) / 2;
	        tempLen += L.PlotUtils.distance(points[i - 1], points[i]);
	        var w = (tailWidth / 2 - tempLen / allLen * widthDif) / Math.sin(angle);
	        var left = L.PlotUtils.getThirdPoint(points[i - 1], points[i], Math.PI - angle, w, true);
	        var right = L.PlotUtils.getThirdPoint(points[i - 1], points[i], angle, w, false);
	        leftBodyPnts.push(left);
	        rightBodyPnts.push(right);
	    }
	    return leftBodyPnts.concat(rightBodyPnts);
	},
	
	setCoordinates: function (LatLngs){
		var poly = new this.Poly(LatLngs, this.options.shapeOptions);
		L.Draw.Feature.prototype._fireCreatedEvent.call(this, poly);
	},	
});
