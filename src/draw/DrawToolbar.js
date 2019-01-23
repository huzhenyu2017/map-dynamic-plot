/**
 * @class L.DrawToolbar
 * @aka Toolbar
 */
L.DrawToolbar = L.Toolbar.extend({

	statics: {
		TYPE: 'draw'
	},

	options: {
		polyline: {},
		straight_arrow:{},
		arc:{},
		curve:{},
		polygon: {},
		rectangle: {},
		circle: {},
		marker: {},
		circlemarker: {},
		closed_curve:{},
		gathering_place:{},
		lune:{},
		eclipse:{},
		fine_arrow: {},
		attack_arrow:{},
		double_arrow:{},
		assault_arrow:{},
		sector:{},
		squad_arrow:{},
		tailed_attack_arrow:{},
		tailed_squad_arrow:{},
		flowline:{}
	},

	// @method initialize(): void
	initialize: function (options) {
		// Ensure that the options are merged correctly since L.extend is only shallow
		for (var type in this.options) {
			if (this.options.hasOwnProperty(type)) {
				if (options[type]) {
					options[type] = L.extend({}, this.options[type], options[type]);
				}
			}
		}

		this._toolbarClass = 'leaflet-draw-draw';
		L.Toolbar.prototype.initialize.call(this, options);
	},

	// @method getModeHandlers(): object
	// Get mode handlers information
	getModeHandlers: function (map) {
		return [
			{
				enabled: this.options.polyline,
				handler: new L.Draw.Polyline(map, this.options.polyline),
				title: L.drawLocal.draw.toolbar.buttons.polyline
			},
			
			{
				enabled: this.options.polygon,
				handler: new L.Draw.Polygon(map, this.options.polygon),
				title: L.drawLocal.draw.toolbar.buttons.polygon
			},
			{
				enabled: this.options.rectangle,
				handler: new L.Draw.Rectangle(map, this.options.rectangle),
				title: L.drawLocal.draw.toolbar.buttons.rectangle
			},
			{
				enabled: this.options.circle,
				handler: new L.Draw.Circle(map, this.options.circle),
				title: L.drawLocal.draw.toolbar.buttons.circle
			},
			{
				enabled: this.options.marker,
				handler: new L.Draw.Marker(map, this.options.marker),
				title: L.drawLocal.draw.toolbar.buttons.marker
			},
			{
				enabled: this.options.circlemarker,
				handler: new L.Draw.CircleMarker(map, this.options.circlemarker),
				title: L.drawLocal.draw.toolbar.buttons.circlemarker
			},
			{
				enabled: this.options.fine_arrow,
				handler: new L.Draw.Fine_Arrow(map, this.options.fine_arrow),
				title: L.drawLocal.draw.toolbar.buttons.fine_arrow
			},
			{
				enabled: this.options.attack_arrow,
				handler: new L.Draw.Attack_Arrow(map, this.options.attack_arrow),
				title: L.drawLocal.draw.toolbar.buttons.attack_arrow
			},
			{
				enabled: this.options.double_arrow,
				handler: new L.Draw.Double_Arrow(map, this.options.double_arrow),
				title: L.drawLocal.draw.toolbar.buttons.double_arrow
			},
			{
				enabled: this.options.arc,
				handler: new L.Draw.Arc(map, this.options.arc),
				title: L.drawLocal.draw.toolbar.buttons.arc
			},
			{
				enabled: this.options.assault_arrow,
				handler: new L.Draw.Assault_Arrow(map, this.options.assault_arrow),
				title: L.drawLocal.draw.toolbar.buttons.assault_arrow
			},
			{
				enabled: this.options.closed_curve,
				handler: new L.Draw.Closed_Curve(map, this.options.closed_curve),
				title: L.drawLocal.draw.toolbar.buttons.closed_curve
			},
			{
				enabled: this.options.curve,
				handler: new L.Draw.Curve(map, this.options.curve),
				title: L.drawLocal.draw.toolbar.buttons.curve
			},
			{
				enabled: this.options.ellipse,
				handler: new L.Draw.Ellipse(map, this.options.ellipse),
				title: L.drawLocal.draw.toolbar.buttons.ellipse
			},
			{
				enabled: this.options.gathering_place,
				handler: new L.Draw.Gathering_Place(map, this.options.gathering_place),
				title: L.drawLocal.draw.toolbar.buttons.gathering_place
			},
			{
				enabled: this.options.lune,
				handler: new L.Draw.Lune(map, this.options.lune),
				title: L.drawLocal.draw.toolbar.buttons.lune
			},
			{
				enabled: this.options.sector,
				handler: new L.Draw.Sector(map, this.options.sector),
				title: L.drawLocal.draw.toolbar.buttons.sector
			},
			{
				enabled: this.options.squad_arrow,
				handler: new L.Draw.Squad_Arrow(map, this.options.squad_arrow),
				title: L.drawLocal.draw.toolbar.buttons.squad_arrow
			},
			{
				enabled: this.options.straight_arrow,
				handler: new L.Draw.Straight_Arrow(map, this.options.straight_arrow),
				title: L.drawLocal.draw.toolbar.buttons.straight_arrow
			},
			{
				enabled: this.options.tailed_attack_arrow,
				handler: new L.Draw.Tailed_Attack_Arrow(map, this.options.tailed_attack_arrow),
				title: L.drawLocal.draw.toolbar.buttons.tailed_attack_arrow
			},
			{
				enabled: this.options.tailed_squad_arrow,
				handler: new L.Draw.Tailed_Squad_Arrow(map, this.options.tailed_squad_arrow),
				title: L.drawLocal.draw.toolbar.buttons.tailed_squad_arrow
			},
			{
				enabled: this.options.flowline,
				handler: new L.Draw.FlowLine(map, this.options.flowline),
				title: L.drawLocal.draw.toolbar.buttons.flowline
			},
		];
	},

	// @method getActions(): object
	// Get action information
	getActions: function (handler) {
		return [
			{
				enabled: handler.completeShape,
				title: L.drawLocal.draw.toolbar.finish.title,
				text: L.drawLocal.draw.toolbar.finish.text,
				callback: handler.completeShape,
				context: handler
			},
			{
				enabled: handler.deleteLastVertex,
				title: L.drawLocal.draw.toolbar.undo.title,
				text: L.drawLocal.draw.toolbar.undo.text,
				callback: handler.deleteLastVertex,
				context: handler
			},
			{
				title: L.drawLocal.draw.toolbar.actions.title,
				text: L.drawLocal.draw.toolbar.actions.text,
				callback: this.disable,
				context: this
			}
		];
	},

	// @method setOptions(): void
	// Sets the options to the toolbar
	setOptions: function (options) {
		L.setOptions(this, options);

		for (var type in this._modes) {
			if (this._modes.hasOwnProperty(type) && options.hasOwnProperty(type)) {
				this._modes[type].handler.setOptions(options[type]);
			}
		}
	}
});
