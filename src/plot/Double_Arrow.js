/**
 * @class L.Double_Arrow
 * @aka Double_Arrow
 * @inherits L.Polygon
 * 符号建模
 */

L.Double_Arrow = L.Polygon.extend({
    includes : L.Plot,
    Plot:true,
    headHeightFactor : 0.25,
    headWidthFactor : 0.3,
    neckHeightFactor : 0.85,
    neckWidthFactor : 0.15,
    connPoint : null,
    tempPoint4 : null,
    
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
		var pnt1 = pnts[0].slice(0);
	    var pnt2 = pnts[1].slice(0);
	    var pnt3 = pnts[2].slice(0);
	    if(this._isDrawing){
	    	var count = this.getPointCount()+1;
	    }else{
	    	var count = this.getPointCount();
	    }
	    if(count == 3)
	        this.tempPoint4 = this.getTempPoint4(pnt1, pnt2, pnt3);
	    else
	        this.tempPoint4 = pnts[3];
	    if(count==3 || count==4)
	        this.connPoint = L.PlotUtils.mid(pnt1, pnt2);
	    else
	        this.connPoint = pnts[4].slice(0);
	    var leftArrowPnts, rightArrowPnts;
	    if(L.PlotUtils.isClockWise(pnt1, pnt2, pnt3)){
	        leftArrowPnts = this.getArrowPoints(pnt1, this.connPoint, this.tempPoint4, false);
	        rightArrowPnts = this.getArrowPoints(this.connPoint, pnt2, pnt3, true);
	    }else{
	        leftArrowPnts = this.getArrowPoints(pnt2, this.connPoint, pnt3, false);
	        rightArrowPnts = this.getArrowPoints(this.connPoint, pnt1, this.tempPoint4, true);
	    }
	    var m = leftArrowPnts.length;
	    var t = (m - 5) / 2;
	
	    var llBodyPnts = leftArrowPnts.slice(0 ,t);
	    var lArrowPnts = leftArrowPnts.slice(t, t+5);
	    var lrBodyPnts = leftArrowPnts.slice(t+5, m);
	
	    var rlBodyPnts = rightArrowPnts.slice(0 ,t);
	    var rArrowPnts = rightArrowPnts.slice(t, t+5);
	    var rrBodyPnts = rightArrowPnts.slice(t+5, m);
	
	    rlBodyPnts = L.PlotUtils.getBezierPoints(rlBodyPnts);
	    var bodyPnts = L.PlotUtils.getBezierPoints(rrBodyPnts.concat(llBodyPnts.slice(1)));
	    lrBodyPnts = L.PlotUtils.getBezierPoints(lrBodyPnts);
	
	    var ALLpnts = rlBodyPnts.concat(rArrowPnts, bodyPnts, lArrowPnts, lrBodyPnts);
	    this.setLatLngs([ALLpnts]);
	},
	getArrowPoints: function(pnt1, pnt2, pnt3, clockWise){
	    var midPnt=L.PlotUtils.mid(pnt1, pnt2);
	    var len=L.PlotUtils.distance(midPnt, pnt3);
	    var midPnt1=L.PlotUtils.getThirdPoint(pnt3, midPnt, 0, len * 0.3, true);
	    var midPnt2=L.PlotUtils.getThirdPoint(pnt3, midPnt, 0, len * 0.5, true);
	    //var midPnt3=PlotUtils.getThirdPoint(pnt3, midPnt, 0, len * 0.7, true);
	    midPnt1=L.PlotUtils.getThirdPoint(midPnt, midPnt1, 	L.Constants.HALF_PI, len / 5, clockWise);
	    midPnt2=L.PlotUtils.getThirdPoint(midPnt, midPnt2, L.Constants.HALF_PI, len / 4, clockWise);
	    //midPnt3=PlotUtils.getThirdPoint(midPnt, midPnt3, Constants.HALF_PI, len / 5, clockWise);
	
	    var points=[midPnt, midPnt1, midPnt2, pnt3];
	    // 计算箭头部分
	    var arrowPnts=this.getArrowHeadPoints(points, this.headHeightFactor, this.headWidthFactor, this.neckHeightFactor, this.neckWidthFactor);
	    var neckLeftPoint=arrowPnts[0];
	    var neckRightPoint=arrowPnts[4];
	    // 计算箭身部分
	    var tailWidthFactor=L.PlotUtils.distance(pnt1, pnt2) / L.PlotUtils.getBaseLength(points) / 2;
	    var bodyPnts=this.getArrowBodyPoints(points, neckLeftPoint, neckRightPoint, tailWidthFactor);
	    var n=bodyPnts.length;
	    var lPoints=bodyPnts.slice(0, n / 2);
	    var rPoints=bodyPnts.slice(n / 2, n);
	    lPoints.push(neckLeftPoint);
	    rPoints.push(neckRightPoint);
	    lPoints=lPoints.reverse();
	    lPoints.push(pnt2);
	    rPoints=rPoints.reverse();
	    rPoints.push(pnt1);
	    return lPoints.reverse().concat(arrowPnts, rPoints);
	},
	
	getArrowHeadPoints: function(points, tailLeft, tailRight){
	    var len = L.PlotUtils.getBaseLength(points);
	    var headHeight = len * this.headHeightFactor;
	    var headPnt = points[points.length-1];
	    var tailWidth = L.PlotUtils.distance(tailLeft, tailRight);
	    var headWidth = headHeight * this.headWidthFactor;
	    var neckWidth = headHeight * this.neckWidthFactor;
	    var neckHeight = headHeight * this.neckHeightFactor;
	    var headEndPnt = L.PlotUtils.getThirdPoint(points[points.length-2], headPnt, 0, headHeight, true);
	    var neckEndPnt = L.PlotUtils.getThirdPoint(points[points.length-2], headPnt, 0, neckHeight, true);
	    var headLeft = L.PlotUtils.getThirdPoint(headPnt, headEndPnt, L.Constants.HALF_PI, headWidth, false);
	    var headRight = L.PlotUtils.getThirdPoint(headPnt, headEndPnt, L.Constants.HALF_PI, headWidth, true);
	    var neckLeft = L.PlotUtils.getThirdPoint(headPnt, neckEndPnt, L.Constants.HALF_PI, neckWidth, false);
	    var neckRight = L.PlotUtils.getThirdPoint(headPnt, neckEndPnt, L.Constants.HALF_PI, neckWidth, true);
	    return [neckLeft, headLeft, headPnt, headRight, neckRight];
	},
	
	getArrowBodyPoints: function(points, neckLeft, neckRight, tailWidthFactor){
	    var allLen = L.PlotUtils.wholeDistance(points);
	    var len = L.PlotUtils.getBaseLength(points);
	    var tailWidth = len * tailWidthFactor;
	    var neckWidth = L.PlotUtils.distance(neckLeft, neckRight);
	    var widthDif = (tailWidth - neckWidth) / 2;
	    var tempLen = 0, leftBodyPnts=[], rightBodyPnts = [];
	    for(var i=1; i<points.length-1; i++){
	        var angle=L.PlotUtils.getAngleOfThreePoints(points[i-1], points[i], points[i+1]) / 2;
	        tempLen += L.PlotUtils.distance(points[i-1], points[i]);
	        var w = (tailWidth/2 - tempLen / allLen * widthDif) / Math.sin(angle);
	        var left = L.PlotUtils.getThirdPoint(points[i-1], points[i], Math.PI-angle, w, true);
	        var right = L.PlotUtils.getThirdPoint(points[i-1], points[i], angle, w, false);
	        leftBodyPnts.push(left);
	        rightBodyPnts.push(right);
	    }
	    return leftBodyPnts.concat(rightBodyPnts);
	},
	
	// 计算对称点
	getTempPoint4 : function(linePnt1, linePnt2, point){
	    var midPnt=L.PlotUtils.mid(linePnt1, linePnt2);
	    var len=L.PlotUtils.distance(midPnt, point);
	    var angle=L.PlotUtils.getAngleOfThreePoints(linePnt1, midPnt, point);
	    var symPnt, distance1, distance2, mid;
	    if (angle < L.Constants.HALF_PI)
	    {
	        distance1=len * Math.sin(angle);
	        distance2=len * Math.cos(angle);
	        mid=L.PlotUtils.getThirdPoint(linePnt1, midPnt, L.Constants.HALF_PI, distance1, false);
	        symPnt=L.PlotUtils.getThirdPoint(midPnt, mid, L.Constants.HALF_PI, distance2, true);
	    }
	    else if (angle >= L.Constants.HALF_PI && angle < Math.PI)
	    {
	        distance1=len * Math.sin(Math.PI - angle);
	        distance2=len * Math.cos(Math.PI - angle);
	        mid=L.PlotUtils.getThirdPoint(linePnt1, midPnt, L.Constants.HALF_PI, distance1, false);
	        symPnt=L.PlotUtils.getThirdPoint(midPnt, mid, L.Constants.HALF_PI, distance2, false);
	    }
	    else if (angle >= Math.PI && angle < Math.PI * 1.5)
	    {
	        distance1=len * Math.sin(angle - Math.PI);
	        distance2=len * Math.cos(angle - Math.PI);
	        mid=L.PlotUtils.getThirdPoint(linePnt1, midPnt, L.Constants.HALF_PI, distance1, true);
	        symPnt=L.PlotUtils.getThirdPoint(midPnt, mid, L.Constants.HALF_PI, distance2, true);
	    }
	    else
	    {
	        distance1=len * Math.sin(Math.PI * 2 - angle);
	        distance2=len * Math.cos(Math.PI * 2 - angle);
	        mid=L.PlotUtils.getThirdPoint(linePnt1, midPnt, L.Constants.HALF_PI, distance1, true);
	        symPnt=L.PlotUtils.getThirdPoint(midPnt, mid, L.Constants.HALF_PI, distance2, false);
	    }
	    return symPnt;
	}
	
})