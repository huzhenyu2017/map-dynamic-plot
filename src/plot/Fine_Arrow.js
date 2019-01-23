/**
 * @class L.Fine_Arrow
 * @aka Fine_Arrow
 * @inherits L.Polygon
 * 符号建模
 */

L.Fine_Arrow = L.Polygon.extend({
	includes : L.Plot,
	Plot:true,
	tailWidthFactor : 0.15,
    neckWidthFactor : 0.2,
    headWidthFactor : 0.25,
    headAngle : Math.PI / 8.5,
    neckAngle : Math.PI / 13,
    
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
	    this.setLatLngs(pList);
	}

})