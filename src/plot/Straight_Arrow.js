/**
 * @class L.Straight_Arrow
 * @aka Straight_Arrow
 * @inherits L.Polyline
 * 符号建模
 */

L.Straight_Arrow = L.Polyline.extend({
	includes : L.Plot,
    Plot : true,
    maxArrowLength : 3000000,
    arrowLengthScale : 5,
    
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
	    var distance = L.PlotUtils.distance(pnt1, pnt2);
	    var len = distance / this.arrowLengthScale;
	    len = len > this.maxArrowLength ? this.maxArrowLength : len;
	    var leftPnt = L.PlotUtils.getThirdPoint(pnt1, pnt2, Math.PI/6, len, false);
	    var rightPnt = L.PlotUtils.getThirdPoint(pnt1, pnt2, Math.PI/6, len, true);
	    this.setLatLngs([[pnt1, pnt2, leftPnt], [pnt2, rightPnt]]);
	}

})