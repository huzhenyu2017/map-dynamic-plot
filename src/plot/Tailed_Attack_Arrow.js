/**
 * @class L.Tailed_Attack_Arrow
 * @aka Tailed_Attack_Arrow
 * @inherits L.Attack_Arrow
 * 符号建模
 */

L.Tailed_Attack_Arrow = L.Attack_Arrow.extend({
    headHeightFactor : 0.18,
    headWidthFactor : 0.3,
    neckHeightFactor : 0.85,
    neckWidthFactor : 0.15,
    tailWidthFactor : 0.1,
    headTailFactor : 0.8,
    swallowTailFactor : 1,
    swallowTailPnt : null,
    
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
	    var tailLeft = pnts[0];
	    var tailRight = pnts[1];
	    if(L.PlotUtils.isClockWise(pnts[0], pnts[1], pnts[2])){
	        tailLeft = pnts[1];
	        tailRight = pnts[0];
	    }
	    var midTail = L.PlotUtils.mid(tailLeft, tailRight);
	    var bonePnts = [midTail].concat(pnts.slice(2));
	    var headPnts = this.getArrowHeadPoints(bonePnts, tailLeft, tailRight);
	    var neckLeft = headPnts[0];
	    var neckRight = headPnts[4];
	    var tailWidth = L.PlotUtils.distance(tailLeft, tailRight);
	    var allLen = L.PlotUtils.getBaseLength(bonePnts);
	    var len = allLen * this.tailWidthFactor * this.swallowTailFactor;
	    this.swallowTailPnt = L.PlotUtils.getThirdPoint(bonePnts[1], bonePnts[0], 0, len, true);
	    var factor = tailWidth/allLen;
	    var bodyPnts = this.getArrowBodyPoints(bonePnts, neckLeft, neckRight, factor);
	    var count = bodyPnts.length;
	    var leftPnts = [tailLeft].concat(bodyPnts.slice(0, count/2));
	    leftPnts.push(neckLeft);
	    var rightPnts = [tailRight].concat(bodyPnts.slice(count/2, count));
	    rightPnts.push(neckRight);
	
	    leftPnts = L.PlotUtils.getQBSplinePoints(leftPnts);
	    rightPnts = L.PlotUtils.getQBSplinePoints(rightPnts);
	    
		this.setLatLngs([leftPnts.concat(headPnts, rightPnts.reverse(), [this.swallowTailPnt, leftPnts[0]])]);
	}
})