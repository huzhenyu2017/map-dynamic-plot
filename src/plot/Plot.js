/**
作为一个方法集 供其他Poly来merge
 */

L.Plot = {
	points:null,
	
	initialize: function (points, options) {
		L.setOptions(this, options);
		//this._points=latlngs;
		this.setPoints(points);
	},
	
	//根据用户点击的点，进行符号建模，并设置坐标
	setPoints: function(value){
        this.points = value ? value : [];
        if(this.points.length>=1)
            this.symbolModeling();
    },

    getPoints: function(){
        return this.points.slice(0);
    },

    getPointCount: function(){
        return this.points.length;
    },

    updatePoint: function(point, index){
        if(index>=0 && index<this.points.length){
            this.points[index] = point;
            this.generate();
        }
    },

    updateLastPoint: function(point){
        this.updatePoint(point, this.points.length-1);
    },

    finishDrawing: function(){
	return;
	//子类重写
    },
    
	symbolModeling: function(){
		//子类重写
	}

}