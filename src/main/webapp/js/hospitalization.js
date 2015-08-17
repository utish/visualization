$(document).ready(
		function() {

			var numOfDays;
			var diagnosis;
			var program;
			var region;
			var numOfAdmissions;
			var costs;
			
			var dignosisData;
			var diagnosisMap = new Object();
			
			var programData;
			var programMap = new Object();
			
			var regionData;
			var regionMap = new Object();
			
			
			
			d3.json("/diagnosis", function(error, data) {
				diagnosisData = data;
				
				for(var i in diagnosisData) {
					diagnosisMap[diagnosisData[i].code] = diagnosisData[i].description;
				}
				
			});
			
			d3.json("/program", function(error, data) {
				programData = data;
				
				for(var i in programData) {
					programMap[programData[i].code] = programData[i].description;
				}
			});
			
			d3.json("/region", function(error, data) {
				regionData = data;
				
				for(var i in regionData) {
					regionMap[regionData[i].code] = regionData[i].description;
				}
			});
			
			function getDiagnosis(k) {
			    return diagnosisMap[k];
			}
			
			function getRegion(k) {
				return regionMap[k];
			}
			
			function getProgram(k) {
				return programMap[k];
			}

			
			d3.json("/data", function(error, data) {
				console.log('retrieved the data...');
				console.log(data);

				var parseDate = d3.time.format("%m/%d/%Y").parse;

				numOfDaysChart = dc.rowChart("#chart-numOfDays");
				diagnosisChart = dc.rowChart("#chart-diagnosis");
				programChart = dc.rowChart("#chart-program");
				regionChart = dc.rowChart("#chart-region");
				numOfAdmissionsChart = dc.rowChart("#chart-numOfAdmissions");
				costsChart = dc.rowChart("#chart-costs");

				// use cross filter to create the dimensions and grouping
				var ppr = crossfilter(data);
				
				// numOfDays
				var numOfDaysDim = ppr.dimension(function(d) {
					return d.numOfDays;
				});

				var numOfDaysCount = numOfDaysDim.group().reduceCount();
				
				// diagnosis
				var diagnosisDim = ppr.dimension(function(d) {
					console.log('diagnosis : ' + d.diagnosis);
					return d.diagnosis;
				});
				
				var diagnosisCount = diagnosisDim.group().reduceCount();
				
				// program
				
				var programDim = ppr.dimension(function(d) {
					return d.program;
				});
				
				var programCount = programDim.group().reduceCount();
				
				// region
				
				var regionDim = ppr.dimension(function(d) {
					return d.region;
				});
				
				var regionCount = regionDim.group().reduceCount();
				
				// numOfAdmissions
				
				var numOfAdmissionsDim = ppr.dimension(function(d) {
					return d.numOfAdmissions;
				});
				
				var numOfAdmissionsCount = numOfAdmissionsDim.group().reduceCount();
				
				// costs
				
				var costsDim = ppr.dimension(function(d) {
					return d.costs;
				});
				
				var costsCount = costsDim.group().reduceCount();
				
				//chart definitions....................................

				//numOfDays
				
				numOfDaysChart
				.width(300)
				.height(250)
				.x(d3.scale.linear().domain([1,25]))
				.dimension(numOfDaysDim)
				.group(numOfDaysCount)
				.colors(d3.scale.category10())
				.label(function (d) {
		            return d.key;
		        })
		        .title(function (d) {
		            return d.key + ' / ' + d.value;
		        })
		        .elasticX(true).xAxis().ticks(4);
				
				//diagnosis
				
				diagnosisChart
		        .width(300)
		        .height(250)
		        .dimension(diagnosisDim)
		        .group(diagnosisCount)
		        .colors(d3.scale.category10())
		        .label(function (d) {
		            return getDiagnosis(d.key);
		        })
		        .title(function (d) {
		            return getDiagnosis(d.key) + ' / ' + d.value;
		        })
		        .elasticX(true).xAxis().ticks(4);
				
				//program
				
				programChart
		        .width(300)
		        .height(250)
		        .dimension(programDim)
		        .group(programCount)
		        .colors(d3.scale.category10())
		        .label(function (d) {
		            return getProgram(d.key);
		        })
		        .title(function (d) {
		            return getProgram(d.key) + ' / ' + d.value;
		        })
		        .elasticX(true).xAxis().ticks(4);
				
				//region
				regionChart
		        .width(300)
		        .height(250)
		        .dimension(regionDim)
		        .group(regionCount)
		        .colors(d3.scale.category10())
		        .label(function (d) {
		            return getRegion(d.key);
		        })
		        .title(function (d) {
		            return getRegion(d.key) + ' / ' + d.value;
		        })
		        .elasticX(true).xAxis().ticks(4);
				
				//numOfAdmissions
				numOfAdmissionsChart
		        .width(300)
		        .height(250)
		        .dimension(numOfAdmissionsDim)
		        .group(numOfAdmissionsCount)
		        .colors(d3.scale.category10())
		        .label(function (d) {
		            return d.key;
		        })
		        .title(function (d) {
		            return d.key + ' / ' + d.value;
		        })
		        .elasticX(true).xAxis().ticks(4);
				
				//costs
				costsChart
		        .width(300)
		        .height(250)
		        .dimension(costsDim)
		        .group(costsCount)
		        .colors(d3.scale.category10())
		        .label(function (d) {
		            return d.key;
		        })
		        .title(function (d) {
		            return d.key + ' / ' + d.value;
		        })
		        .elasticX(true).xAxis().ticks(4);
				
   
				// hit it!
				dc.renderAll();

			});

		});