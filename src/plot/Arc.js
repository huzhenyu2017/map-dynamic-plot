/**
 * @class L.Arc
 * @aka Arc
 * @inherits L.Polygon
 * 符号建模
 */

L.Arc = L.Polyline.extend({
	includes : L.Plot,
    Plot : true,
    
	symbolModeling: function(){
		var count = this.points.length;
	    if(count <= 2) {
	        this.setLatLngs(this.points);
	        return;
	    };
	    var pnts=[];
	    for (i in this.points){
	    	pnts[i]=[];
	    	pnts[i][0]=this.points[i].lat;
	    	pnts[i][1]=this.points[i].lng;
	    }; 
	    //有时用户移动过快或者过慢，_onMouseMove捕获到的坐标会和onTouch捕获到的坐标一样。
	    //为了防止这种事情发生：
	    if(pnts[pnts.length-1][1]==pnts[pnts.length-2][1]&&pnts[pnts.length-1][2]==pnts[pnts.length-2][2])
	    {
	    	return;
	    }
		var pnt1 = pnts[0];
        var pnt2 = pnts[1];
        var pnt3 = pnts[2];
        var center = L.PlotUtils.getCircleCenterOfThreePoints(pnt1, pnt2, pnt3);
        var radius = L.PlotUtils.distance(pnt1, center);

        var angle1 = L.PlotUtils.getAzimuth(pnt1, center);
        var angle2 = L.PlotUtils.getAzimuth(pnt2, center);
        if(L.PlotUtils.isClockWise(pnt1, pnt2, pnt3)){
            var startAngle = angle2;
            var endAngle = angle1;
        }
        else{
            startAngle = angle1;
            endAngle = angle2;
        }
        this.setLatLngs(L.PlotUtils.getArcPoints(center, radius, startAngle, endAngle));
	}
})