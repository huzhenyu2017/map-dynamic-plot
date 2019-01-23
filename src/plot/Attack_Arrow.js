/**
 * @class L.Attack_Arrow
 * @aka Attack_Arrow
 * @inherits L.Polygon
 * 符号建模
 */

L.Attack_Arrow = L.Polygon.extend({
    includes : L.Plot,
    Plot:true,
    headHeightFactor : 0.18,
    headWidthFactor : 0.3,
    neckHeightFactor : 0.85,
    neckWidthFactor : 0.15,
    headTailFactor : 0.8,
    
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
	    if (L.PlotUtils.isClockWise(pnts[0], pnts[1], pnts[2])) {
	        tailLeft = pnts[1];
	        tailRight = pnts[0];
	    }
	    var midTail = L.PlotUtils.mid(tailLeft, tailRight);
	    var bonePnts = [midTail].concat(pnts.slice(2));
	    // 计算箭头
	    var headPnts = this.getArrowHeadPoints(bonePnts, tailLeft, tailRight);
	    var neckLeft = headPnts[0];
	    var neckRight = headPnts[4];
	    var tailWidthFactor = L.PlotUtils.distance(tailLeft, tailRight) / L.PlotUtils.getBaseLength(bonePnts);
	    // 计算箭身
	    var bodyPnts = this.getArrowBodyPoints(bonePnts, neckLeft, neckRight, tailWidthFactor);
	    // 整合
	    var count = bodyPnts.length;
	    var leftPnts = [tailLeft].concat(bodyPnts.slice(0, count / 2));
	    leftPnts.push(neckLeft);
	    var rightPnts = [tailRight].concat(bodyPnts.slice(count / 2, count));
	    rightPnts.push(neckRight);
	
	    leftPnts = L.PlotUtils.getQBSplinePoints(leftPnts);
	    rightPnts = L.PlotUtils.getQBSplinePoints(rightPnts);
		this.setLatLngs(leftPnts.concat(headPnts, rightPnts.reverse()));
	}
	,

	getArrowHeadPoints:function (points, tailLeft, tailRight) {
	    var len = L.PlotUtils.getBaseLength(points);
	    var headHeight = len * this.headHeightFactor;
	    var headPnt = points[points.length - 1];
	    len = L.PlotUtils.distance(headPnt, points[points.length - 2]);
	    var tailWidth = L.PlotUtils.distance(tailLeft, tailRight);
	    if (headHeight > tailWidth * this.headTailFactor) {
	        headHeight = tailWidth * this.headTailFactor;
	    }
	    var headWidth = headHeight * this.headWidthFactor;
	    var neckWidth = headHeight * this.neckWidthFactor;
	    headHeight = headHeight > len ? len : headHeight;
	    var neckHeight = headHeight * this.neckHeightFactor;
	    var headEndPnt = L.PlotUtils.getThirdPoint(points[points.length - 2], headPnt, 0, headHeight, true);
	    var neckEndPnt = L.PlotUtils.getThirdPoint(points[points.length - 2], headPnt, 0, neckHeight, true);
	    var headLeft = L.PlotUtils.getThirdPoint(headPnt, headEndPnt, L.Constants.HALF_PI, headWidth, false);
	    var headRight = L.PlotUtils.getThirdPoint(headPnt, headEndPnt, L.Constants.HALF_PI, headWidth, true);
	    var neckLeft = L.PlotUtils.getThirdPoint(headPnt, neckEndPnt, L.Constants.HALF_PI, neckWidth, false);
	    var neckRight = L.PlotUtils.getThirdPoint(headPnt, neckEndPnt, L.Constants.HALF_PI, neckWidth, true);
	    return [neckLeft, headLeft, headPnt, headRight, neckRight];
	},

	getArrowBodyPoints : function (points, neckLeft, neckRight, tailWidthFactor) {
	    var allLen = L.PlotUtils.wholeDistance(points);
	    var len = L.PlotUtils.getBaseLength(points);
	    var tailWidth = len * tailWidthFactor;
	    var neckWidth = L.PlotUtils.distance(neckLeft, neckRight);
	    var widthDif = (tailWidth - neckWidth) / 2;
	    var tempLen = 0, leftBodyPnts = [], rightBodyPnts = [];
	    for (var i = 1; i < points.length - 1; i++) {
	        var angle = L.PlotUtils.getAngleOfThreePoints(points[i - 1], points[i], points[i + 1]) / 2;
	        tempLen += L.PlotUtils.distance(points[i - 1], points[i]);
	        var w = (tailWidth / 2 - tempLen / allLen * widthDif) / Math.sin(angle);
	        var left = L.PlotUtils.getThirdPoint(points[i - 1], points[i], Math.PI - angle, w, true);
	        var right = L.PlotUtils.getThirdPoint(points[i - 1], points[i], angle, w, false);
	        leftBodyPnts.push(left);
	        rightBodyPnts.push(right);
	    }
	    return leftBodyPnts.concat(rightBodyPnts);
	}
	
})