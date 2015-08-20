$(document).ready(
		function() {

			//var numOfDays;
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
			
			d3.json("/public/us-states.json", function(error, data) {
				statesJson = data;
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
				//console.log('retrieved the data...');
				//console.log(data);

				var parseDate = d3.time.format("%m/%d/%Y").parse;

				numOfDaysChart = dc.barChart("#chart-numOfDays");
				diagnosisChart = dc.pieChart("#chart-diagnosis");
				programChart = dc.pieChart("#chart-program");
				regionChart = dc.geoChoroplethChart("#chart-region");
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
					//console.log('diagnosis : ' + d.diagnosis);
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
					// TODO: this needs to be optimized...
					return getRegion(d.region);
				});
				
				var regionCount = regionDim.group().reduceCount();
				
				// numOfAdmissions
				
				var numOfAdmissionsDim = ppr.dimension(function(d) {
					return parseInt(d.numOfAdmissions);
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
				.width(600)
				.height(250)
				.margins({top: 10, right: 50, bottom: 30, left: 50})
				
				.dimension(numOfDaysDim)
				.group(numOfDaysCount)
				.transitionDuration(500)
				.x(d3.scale.linear().domain([0, 100]))
				.yAxisLabel("Number of people")
				.xAxisLabel("Number of days")
				.elasticY(true);
				
				
				//diagnosis
				
				diagnosisChart
		        .width(300)
		        .height(250)
		        .radius(120)
		        .dimension(diagnosisDim)
		        .group(diagnosisCount)
		        .colors(d3.scale.category10())
		        .label(function (d) {
		            return getDiagnosis(d.key);
		        })
		        .title(function (d) {
		            return "Diagnosis: " + getDiagnosis(d.key) + "\n" + "Number of people: " + d.value;
		        });
		        
				
				//program
				
				programChart
		        .width(300)
		        .height(250)
		        .radius(120)
		        .innerRadius(50)
		        .dimension(programDim)
		        .group(programCount)
		        .colors(d3.scale.category10())
		        .label(function (d) {
		            return getProgram(d.key);
		        })
		        .title(function (d) {
		            return "Programs: " + getProgram(d.key )+ "\n" + "Number of people: " + d.value;
		        });
		        
				
				//region
				regionChart.width(1000)
				.height(330)
				.dimension(regionDim)
				.group(regionCount)
				.colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
				.colorDomain([0, 200])
				.colorCalculator(function (d) { return d ? regionChart.colors()(d) : '#ccc'; })
				.overlayGeoJson(statesJson["features"], "state", function (d) {
					return d.properties.name;
				})
				.projection(d3.geo.albersUsa()
		    				.scale(600)
		    				.translate([340, 150]))
				.title(function (p) {
					return "State: " + p["key"]
							+ "\n"
							+ "Number of people: " + p["value"];
				})
				
				
				
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
		            return "Number of admissions: " + d.key + "\n" + "Number of people: " + d.value;
		        })
		        //.ordering(function(d) { return parseInt(d.key) })
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
		            return "Costs: " + d.key + "\n" + "Number of people: " + d.value;
		        })
		        .elasticX(true).xAxis().ticks(4);
				
   
				// hit it!
				dc.renderAll();

			});

		});