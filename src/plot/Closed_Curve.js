/**
 * @class L.Closed_Curve
 * @aka Closed_Curve
 * @inherits L.Polygon
 * 符号建模
 */

L.Closed_Curve = L.Polygon.extend({
	includes : L.Plot,
    Plot : true,
	t : 0.3,
    
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
		//var pnts = this.getPoints();
	    // 计算箭尾
		pnts.push(pnts[0], pnts[1]);
        var normals = [];
        for(var i=0; i<pnts.length-2; i++){
            var normalPoints = L.PlotUtils.getBisectorNormals(this.t, pnts[i], pnts[i+1], pnts[i+2]);
            normals = normals.concat(normalPoints);
        }
        var count = normals.length;
        normals = [normals[count-1]].concat(normals.slice(0, count-1));

        var pList = [];
        for(i=0; i<pnts.length-2; i++){
            var pnt1 = pnts[i];
            var pnt2 = pnts[i+1];
            pList.push(pnt1);
            for(var t=0; t<= L.Constants.FITTING_COUNT; t++){
                var pnt = L.PlotUtils.getCubicValue(t/ L.Constants.FITTING_COUNT, pnt1, normals[i*2], normals[i*2+1], pnt2);
                pList.push(pnt);
            }
            pList.push(pnt2);
        }

		this.setLatLngs([pList]);
	}
})