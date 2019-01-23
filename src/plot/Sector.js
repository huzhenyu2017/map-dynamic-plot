/**
 * @class L.Sector
 * @aka Sector
 * @inherits L.Polygon.
 * 符号建模
 */

L.Sector = L.Polygon.extend({
	includes : L.Plot,
	Plot:true,
    
	symbolModeling: function(){
		
		var value = this.points;
		var count = value.length;
	    if(count <= 2) {
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
		var center = pnts[0];
        var pnt2 = pnts[1];
        var pnt3 = pnts[2];
        var radius = L.PlotUtils.distance(pnt2, center);
        var startAngle = L.PlotUtils.getAzimuth(pnt2, center);
        var endAngle = L.PlotUtils.getAzimuth(pnt3, center);
        var pList = L.PlotUtils.getArcPoints(center, radius, startAngle, endAngle);
        pList.push(center, pList[0]);
        this.setLatLngs([pList]);
	}
	
})