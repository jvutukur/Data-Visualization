
//http://bl.ocks.org/mbostock/3883195
var data_time = [];
var fullData_time = [];
var nodeData_time = [];

function loadData_timeChart(rows){
    fullData_time = rows;

    var n = fullData_time.length;

    var groupedContent_time = d3.nest()
        .key(function(d) {return d.CreationDate;})
        .sortKeys(d3.ascending)
        .rollup(function(d) {
            return {
                count:Math.round(d3.sum(d,function(g) {return 1;})),
            };
        })
        .entries(fullData_time);

    nodeData_time = groupedContent_time.map(function (d) {
        return {
            timestamp : d.key,
            count: d.values.count,
        };
    })

    createTimeLine();
}

function readData_time(){

    d3.csv("QueryResults.csv", function(rows_time){
        loadData_timeChart(rows_time);
    });


}

function createTimeLine(){

    $("#timeLine").html("");


    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 950 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var svg = d3.select("#timeLine").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var maxValue;
    var minValue;
    var minTimeStamp;
    var maxTimeStamp;

    for(var i=0; i<nodeData_time.length; i++){
        if(maxValue == undefined){
            maxValue = nodeData_time[i].count;
        }

        else if(nodeData_time[i].count > maxValue){
            maxValue = nodeData_time[i].count;
        }

        if(minValue == undefined){
            minValue = nodeData_time[i].count;
        }
        else if(nodeData_time[i].count < minValue){
            minValue = nodeData_time[i].count;
        }

        if(minTimeStamp == undefined){
            minTimeStamp = nodeData_time[i].timestamp;
        }
        else if(nodeData_time[i].timestamp < minTimeStamp){
            minTimeStamp = nodeData_time[i].timestamp;
        }

        if(maxTimeStamp == undefined){
            maxTimeStamp = nodeData_time[i].timestamp;
        }
        else if(nodeData_time[i].timestamp > maxTimeStamp){
            maxTimeStamp = nodeData_time[i].timestamp;
        }
    }


    var x = d3.time.scale()
        .range([0, width])
        .domain([minTimeStamp,maxTimeStamp]);


    var y = d3.scale.linear()
        .rangeRound([0,height])
        .domain([maxValue+0.5, minValue-0.5]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Count");


    var area = d3.svg.area()
        .x(function(d) { return x(d.timestamp); })
        .y0(height)
        .y1(function(d) { return y(d.count); });


    svg.append("path")
        .datum(nodeData)
        .attr("class", "area")
        .attr("d", area);


    var div = d3.select(".mouseOverContent");
    svg.selectAll("circle").data(nodeData)
        .enter()
        .append("circle")
        .attr("cx",function(d){
            return x(d.timestamp);
        })
        .attr("cy",function(d){
            return y(d.count);
        })
        .attr("r",function(d){
            return 3;
        })
        .style("stroke", "black")
        .style("fill", "white")
        .style("fill-opacity","0.01")
        .on("mouseover", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div .html("<b><h5>Count: " + d.count + "<br>" + "Time: " + d.time + "<br></h5> </b>")
                .style("left", (d3.event.pageX - 100) + "px")
                .style("top", (d3.event.pageY - 75) + "px")
                .style("color","black");
        })
        .on("mouseout", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
        })


}
