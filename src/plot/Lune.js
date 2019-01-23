/**
 * @class L.Lune
 * @aka Lune
 * @inherits L.Polygon.
 * 符号建模
 */

L.Lune = L.Polygon.extend({
	includes : L.Plot,
	Plot:true,
    
	symbolModeling: function(){
		
		var value = this.points;
		var count = value.length;
	    if(count < 2) {
	    	this.setLatLngs(this.points);
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
	    if(this.getPointCount()==2){
        var mid = L.PlotUtils.mid(pnts[0], pnts[1]);
        var d = L.PlotUtils.distance(pnts[0], mid);
        var pnt = L.PlotUtils.getThirdPoint(pnts[0], mid, L.Constants.HALF_PI, d);
        pnts.push(pnt);
    	}
		var pnt1 = pnts[0].slice(0);
	    var pnt2 = pnts[1].slice(0);
	    var pnt3 = pnts[2].slice(0);
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
	    var pnts = L.PlotUtils.getArcPoints(center, radius, startAngle, endAngle);
	    pnts.push(pnts[0]);
	    this.setLatLngs([pnts]);
	}
	
})