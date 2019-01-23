/**
 * @class L.Curve
 * @aka Curve
 * @inherits L.Polyline.
 * 符号建模
 */

L.Curve = L.Polyline.extend({
	includes : L.Plot,
	Plot : true,
    t : 0.3,
    
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
		
	    this.setLatLngs(L.PlotUtils.getCurvePoints(this.t, pnts));
	}
	
})