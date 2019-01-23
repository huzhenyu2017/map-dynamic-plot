/**
 * @class L.Draw.Arc
 * @aka Draw.Arc
 * @inherits L.Draw.Plot
 */
L.Draw.Arc = L.Draw.Plot.extend({
	statics: {
		TYPE: 'arc'
	},
	
	Poly: L.Arc,

	options: {
		showArea: false,
		showLength: false,
		shapeOptions: {
			stroke: true,
			color: '#008000',
			weight: 1.5,
			opacity: 1,
			fill: false,
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
		precision: {},
		maxPoints: 3
	},

	// @method initialize(): void
	initialize: function (map, options) {
		L.Draw.Plot.prototype.initialize.call(this, map, options);
		// Save the type so super can fire, need to do this as cannot do this.TYPE :(
		this.type = L.Draw.Arc.TYPE;
		
	},
	
	_drawShape: function (latlng) {
		this._drawShape2pplus(latlng);
	}
	
});
