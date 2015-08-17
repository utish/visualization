$(document).ready(function(){

	var serviceCategory;
	var raceChart;
	var genderChart;
	var jurisdictionChart;
	var procedureCodeChart;
	var serviceCategoryCodeChart;
	
	d3.csv("/public/DataAnalysis.csv", function(error, data) {
		console.log('retrieved the data...');
		
		var parseDate = d3.time.format("%m/%d/%Y").parse;
		
		data.forEach(function(d) {
			d.PaymentDate = d.PaymentDate.split(" ")[0];
			console.log('>>' + d.PaymentDate);
			d.PaymentDate = parseDate(d.PaymentDate);
		});
		
		
		serviceCategoryCodeChart = dc.rowChart("#chart-serviceCategory");
		raceChart = dc.pieChart("#chart-race");
		genderChart = dc.pieChart("#chart-gender");
		//genderChart = dc.rowChart("#chart-gender");
		jurisdictionChart = dc.rowChart("#chart-jurisdiction");
		procedureCodeChart = dc.rowChart("#chart-procedureCode");
		
		
		// use cross filter to create the dimensions and grouping
        var ppr = crossfilter(data);
        
        //Service Category
        //Using ProgramType as per Chirag's email
        
        var serviceCategoryDim = ppr.dimension(function(d) {
        	return d.ProgramType;

        });
        
        var countPerServiceCategory = serviceCategoryDim.group().reduceCount();
		

        //Race Chart
        var raceDim = ppr.dimension(function (d) {
            return d.Race;
        });

        var countPerRace = raceDim.group().reduceCount();
        
        
        //Gender Chart
        var genderDim = ppr.dimension(function (d) {
            return d.Gender;
        });

        var countPerGender = genderDim.group().reduceCount();
        
        //Jurisdiction Chart
        var jurisdictionDim = ppr.dimension(function(d) {
        	return d.Jurisdiction;
        });
        
        var claimsPerJurisdiction = jurisdictionDim.group().reduceSum(function(d) {return d.TotalBilled;});
        
        //Procedure Chart
        var procedureCodeDim = ppr.dimension(function(d) {
        	return d.ProcCode;
        });
        
        var claimsPerProcedureCode = procedureCodeDim.group().reduceSum(function(d) {return d.TotalBilled;});
        
        
       //Configure the charts
       //Service Category (instead of drop down)
        
        serviceCategoryCodeChart
        .width(300)
        .height(250)
        .dimension(serviceCategoryDim)
        .group(countPerServiceCategory)
        .colors(d3.scale.category10())
        .label(function (d) {
            return d.key;
        })
        .title(function (d) {
            return d.key + ' / ' + d.value;
        })
        .elasticX(true).xAxis().ticks(4);
        
        
       //race
       raceChart
            .width(300)
            .height(250)
            .radius(100)
            .innerRadius(50)
            .dimension(raceDim)
            .group(countPerRace)
            .colors(d3.scale.category10())
            .label(function (d) {
                return d.key;
            })
            .title(function (d) {
                return d.key + ' / ' + d.value;
            })
            //.elasticX(true).xAxis().ticks(4);
       
        //gender
       
       	//pie chart is not showing labels i could not fucking figure it out.
        genderChart
            .width(300)
            .height(250)
            .radius(100)
            .dimension(genderDim)
            .group(countPerGender)
            .colors(d3.scale.category10())
            .label(function (d) {
                return d.key;
            })
            .title(function (d) {
                return d.key + ' / ' + d.value;
            });
       
       //gender
            /*
       genderChart
       .width(300)
       .height(250)
       .dimension(genderDim)
       .group(countPerGender)
       .colors(d3.scale.category10())
       .label(function (d) {
           return d.key;
       })
       .title(function (d) {
           return d.key + ' / ' + d.value;
       })
       .elasticX(true).xAxis().ticks(4);
       */
       
       //claims per jurisdiction
       jurisdictionChart
       .width(700)
       .height(700)
       .dimension(jurisdictionDim)
       .group(claimsPerJurisdiction)
       .colors(d3.scale.category10())
       .label(function (d) {
           return d.key;
       })
       .title(function (d) {
           return d.key + ' / $ ' + d.value;
       })
       .elasticX(true).xAxis().ticks(4);
       
       //ProcedureCode Chart
       procedureCodeChart
       .width(300)
       .height(250)
       .dimension(procedureCodeDim)
       .group(claimsPerProcedureCode)
       .colors(d3.scale.category10())
       .label(function (d) {
           return d.key;
       })
       .title(function (d) {
           return d.key + ' / $ ' + d.value;
       })
       .elasticX(true).xAxis().ticks(4);
       
       
      
     	// hit it!
     	dc.renderAll();
     
     
	});

});