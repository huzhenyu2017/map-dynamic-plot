/**
 * @class L.Ellipse
 * @aka Ellipse
 * @inherits L.Polygon
 * 符号建模
 */

L.Ellipse = L.Polygon.extend({
	includes : L.Plot,
	Plot:true,
    
	symbolModeling: function(){
		
		var count = this.points.length;
	    if(count < 2) {
	        this._setLatLngs(this.points)
	        return;
	    }
	    
	    var pnts = this.points.slice(0);
	    Cpnts = [[pnts[0].lat,pnts[0].lng],[pnts[1].lat,pnts[1].lng]];
	    var pnt1 = Cpnts[0];
	    var pnt2 = Cpnts[1];
	    
	    //有时用户移动过快或者过慢，_onMouseMove捕获到的坐标会和onTouch捕获到的坐标一样。
	    //为了防止这种事情发生：
	    if(pnt1[0]==pnt2[0]&&pnt1[1]==pnt2[1]){
	    	return;
	    }
	    //根据用户在画布上点击的坐标点，进行符号建模，并为此对象设置坐标
	    var center = L.PlotUtils.mid(pnt1, pnt2);
	    var majorRadius = Math.abs((pnt1[0]-pnt2[0])/2);
	    var minorRadius = Math.abs((pnt1[1]-pnt2[1])/2);
	    this.setLatLngs([this.generatePoints(center, majorRadius, minorRadius)]);
	},
	
	generatePoints : function(center, majorRadius, minorRadius) {
    var x, y, angle, points = [];
    for (var i = 0; i <= L.Constants.FITTING_COUNT; i++) {
        angle = Math.PI * 2 * i / L.Constants.FITTING_COUNT;
        x = center[0] + majorRadius * Math.cos(angle);
        y = center[1] + minorRadius * Math.sin(angle);
        points.push([x, y]);
    }
    return points;
	}

})