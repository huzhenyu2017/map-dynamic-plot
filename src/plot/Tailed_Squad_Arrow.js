/**
 * @class L.Tailed_Squad_Arrow
 * @aka Tailed_Squad_Arrow
 * @inherits L.Attack_Arrow
 * 符号建模
 */

L.Tailed_Squad_Arrow = L.Attack_Arrow.extend({
    headHeightFactor : 0.18,
    headWidthFactor : 0.3,
    neckHeightFactor : 0.85,
    neckWidthFactor : 0.15,
    tailWidthFactor : 0.1,
    swallowTailFactor : 1,
    swallowTailPnt : null,
    
	symbolModeling: function(){
		var count = this.points.length;
	    if(count < 2) {
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
		var tailPnts = this.getTailPoints(pnts);
	    var headPnts = this.getArrowHeadPoints(pnts, tailPnts[0], tailPnts[2]);
	    var neckLeft = headPnts[0];
	    var neckRight = headPnts[4];
	    var bodyPnts = this.getArrowBodyPoints(pnts, neckLeft, neckRight, this.tailWidthFactor);
	    var count = bodyPnts.length;
	    var leftPnts = [tailPnts[0]].concat(bodyPnts.slice(0, count / 2));
	    leftPnts.push(neckLeft);
	    var rightPnts = [tailPnts[2]].concat(bodyPnts.slice(count / 2, count));
	    rightPnts.push(neckRight);
	
	    leftPnts = L.PlotUtils.getQBSplinePoints(leftPnts);
	    rightPnts = L.PlotUtils.getQBSplinePoints(rightPnts);
	
		this.setLatLngs([leftPnts.concat(headPnts, rightPnts.reverse(), [tailPnts[1], leftPnts[0]])]);
	},
	
	getTailPoints : function (points) {
	    var allLen = L.PlotUtils.getBaseLength(points);
	    var tailWidth = allLen * this.tailWidthFactor;
	    var tailLeft = L.PlotUtils.getThirdPoint(points[1], points[0], L.Constants.HALF_PI, tailWidth, false);
	    var tailRight = L.PlotUtils.getThirdPoint(points[1], points[0], L.Constants.HALF_PI, tailWidth, true);
	    var len = tailWidth * this.swallowTailFactor;
	    var swallowTailPnt = L.PlotUtils.getThirdPoint(points[1], points[0], 0, len, true);
	    return [tailLeft, swallowTailPnt, tailRight];
	}
})