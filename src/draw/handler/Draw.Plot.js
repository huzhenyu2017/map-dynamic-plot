/**
 * @class L.Draw.Plot
 * @aka Draw.Plot
 * @inherits L.Draw.Polygon
 * 批量定义了一系列需要标绘的符号的方法，供标绘符号继承，便于统一管理。
 */
L.Draw.Plot = L.Draw.Polygon.extend({
	statics: {
		TYPE: 'plot'
	},
	
	Poly: null,
	//typeOfFather:L.Draw.Plot.TYPE,
	options: null,

	// @method initialize(): void
	initialize: function (map, options) {
		L.Draw.Polygon.prototype.initialize.call(this, map, options);
		// 为子类保存其所继承的父类类型 以便使得Draw.Polyline的384行生效
		this.typeOfFather=L.Draw.Plot.TYPE;

		//子类重写
		
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
		return;
/*		需要子类调用_drawShape2p（控制点有两个）或者_drawShape2pplus（控制点大于两个）
		固定控制点两个点的需要:
		var startPoint = this._poly.getLatLngs().slice(0,1);
		var a = startPoint.slice(0);
		var b = a.concat(latlng);
		//判断是否因用户鼠标运动过快或者过慢，导致传入的坐标为同一坐标
		 if(b[0].lat==b[1].lat&&b[0].lng==b[1].lng){
	    	return;
	    }
		if (!this._shape) {
			this._shape = new this.Poly(b, this.options.shapeOptions);
			this._map.addLayer(this._shape);
		} else {
			this._shape.setPoints(b);
		}
		
		固定控制点多于两个的需要:
		
		var startPoint = this._poly.getLatLngs().slice(0,1);
		var a = startPoint.slice(0);
		var b = a.concat(latlng);
		if(b[0].lat==b[1].lat&&b[0].lng==b[1].lng){
	    return;
	    }
		if(!this._shape){
			this._shape = new this.Poly(b,this.options.shapeOptions);
			this._map.addLayer(this._shape);
		}
		 else {
		 	 a = this.getPoints();
		 	 b = a.concat(latlng);
			this._shape.setPoints(b);
		}*/
	},
	_drawShape2p: function(latlng){
		var startPoint = this._poly.getLatLngs().slice(0,1);
		var a = startPoint.slice(0);
		var b = a.concat(latlng);
		//判断是否因用户鼠标运动过快或者过慢，导致传入的坐标为同一坐标
		 if(b[0].lat==b[1].lat&&b[0].lng==b[1].lng){
	    	return;
	    }
		if (!this._shape) {
			this._shape = new this.Poly(b, this.options.shapeOptions);
			this._map.addLayer(this._shape);
		} else {
			this._shape.setPoints(b);
		}
	},
	
	_drawShape2pplus:function(latlng){
		var startPoint = this._poly.getLatLngs().slice(0,1);
		var a = startPoint.slice(0);
		var b = a.concat(latlng);
		if(b[0].lat==b[1].lat&&b[0].lng==b[1].lng){
	    return;
	    }
		if(!this._shape){
			this._shape = new this.Poly(b,this.options.shapeOptions);
			this._map.addLayer(this._shape);
		}
		 else {
		 	 a = this.getPoints();
		 	 b = a.concat(latlng);
			this._shape.setPoints(b);
		}
		
	},
	
	_fireCreatedEvent: function () {
		pnt = this._poly.getLatLngs();
		if(pnt.length>=1){
	    this.setCoordinates(pnt);
		}
	},

	setCoordinates: function (LatLngs){
		var poly = new this.Poly(LatLngs, this.options.shapeOptions);
		L.Draw.Feature.prototype._fireCreatedEvent.call(this, poly);
	},	
});
