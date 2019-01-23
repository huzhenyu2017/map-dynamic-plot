/**
 * @class L.Gathering_Place
 * @aka Gathering_Place
 * @inherits L.Polygon.
 * 符号建模
 */

L.Gathering_Place = L.Polygon.extend({
	includes : L.Plot,
	Plot:true,
	t : 0.4,
    
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
	        var d = L.PlotUtils.distance(pnts[0], mid)/0.9;
	        var pnt = L.PlotUtils.getThirdPoint(pnts[0], mid, L.Constants.HALF_PI, d, true);
	        pnts = [pnts[0], pnt, pnts[1]];
	    }
	    var mid = L.PlotUtils.mid(pnts[0], pnts[2]);
	    pnts.push(mid, pnts[0], pnts[1]);
	
	    var normals = [];
	    for(var i=0; i<pnts.length-2; i++){
	        var pnt1 = pnts[i];
	        var pnt2 = pnts[i+1];
	        var pnt3 = pnts[i+2];
	        var normalPoints = L.PlotUtils.getBisectorNormals(this.t, pnt1, pnt2, pnt3);
	        normals = normals.concat(normalPoints);
	    }
	    var count = normals.length;
	    normals = [normals[count-1]].concat(normals.slice(0, count-1));
	    var pList = [];
	    for(i=0; i<pnts.length-2; i++){
	        pnt1 = pnts[i];
	        pnt2 = pnts[i+1];
	        pList.push(pnt1);
	        for(var t=0; t<=L.Constants.FITTING_COUNT; t++){
	            var pnt = L.PlotUtils.getCubicValue(t/L.Constants.FITTING_COUNT, pnt1, normals[i*2], normals[i*2+1], pnt2);
	            pList.push(pnt);
	        }
	        pList.push(pnt2);
	    }
	    this.setLatLngs([pList]);
	}
	
})