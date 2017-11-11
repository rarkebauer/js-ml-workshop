var randomPoints = require('../lib/rand');

//Start off with what passes the first test.
function KNN(kSize){
	this.kSize = kSize;
	this.points = [];
}

KNN.prototype.train = function(data){
  this.points = this.points.concat(data);
}

KNN.prototype.predict = function(arr){
	var t = this;
	return arr.map(function(vector){
		return t.predictSingle(vector);
	});
}

KNN.prototype.predictSingle = function(vector){
	var result = this._distances(vector, this.points) //distance arr
	result = KNN.prototype._sorted(result);
	result = KNN.prototype._majority(this.kSize, result);
	return result;
}

KNN.prototype._distance = function(vectorA, vectorB){
	var distance = 0;
	for (var i = 0; i < vectorA.length; i++){
		distance += Math.abs(vectorA[i] - vectorB[i]);
	}
	return distance;
}

KNN.prototype._distances = function(vector, data){
	//vector example [1,0]
	//distance(vector, nth sub array)
	//data example [[[1,2,3],0], [ [1,2,4],0]]]

	//distances should be [[x,y], [x,y]]
	//distances should be [  [distance(vector, data[nth sub array), nth sub array])] ]
	data = data.map(function(datum){
	 return	[KNN.prototype._distance(vector, datum[0]), datum[1]];
	});
	return data;
}

KNN.prototype._sorted = function(data){
  data = data.sort(function(a, b){
		return a[0] - b[0];
	})
	return data.map(function(datum){
		return datum[1];
	})
}

KNN.prototype._majority = function(num, arr){
	arr = arr.slice(0, num);
	return KNN.prototype.mode(arr);
}

KNN.prototype.mode = function(arr) {
	var numMapping = {};
	var greatestFreq = 0;
	var mode;
	arr.forEach(function findMode(number) {
			numMapping[number] = (numMapping[number] || 0) + 1;

			if (greatestFreq < numMapping[number]) {
					greatestFreq = numMapping[number];
					mode = number;
			}
	});
	return +mode;
}

KNN.prototype.score = function(dataB){
	var classificationB = dataB.map(data => data[1]).reduce(function(sum, value){
		return sum + value;
	});
	// var dataA = this.points
	// console.log(this);
	// var classificationA = dataA.map(data => data[1]).reduce(function(sum, value){

	var vectors = this.predict(dataB.map(arr => arr[0])).reduce(function(sum, value){
		return sum + value;
	});
	return (classificationB > vectors) ? vectors / classificationB : classificationB / vectors;
}

module.exports = KNN;

