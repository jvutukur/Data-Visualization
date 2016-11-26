function createTimeLine(tagname,year){
// set the dimensions and margins of the graph


  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

// set the ranges
  var x = d3.scaleTime().rangeRound([0, width]);
  var y = d3.scaleLinear().rangeRound([height, 0]);

// define the area


// define the line
  var valueline = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.PostCount); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
  $("#TimeLineContent").html('');
  var svg = d3.select("#TimeLineContent").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
  var filename=tagname+"-tsd.csv";
  d3.csv(filename, function(error, data) {
    if (error) throw error;

    // format the data
    data.forEach(function(d) {
      d.date = new Date(d.date);
      d.PostCount = +d.PostCount;
    });
    var length=data.length;
    data[length-1].PostCount=data[length-2].PostCount-4;
    function tofilter(datefrom){
      return datefrom.date.getTime()>min.getTime();
    }
    var min;
    // scale the range of the data
    if(year=='3months'){
      var p=d3.extent(data, function(d) { return d.date; });
      var date=new Date();
      date=p[1];
      min=d3.timeDay.offset(date,-90);
      max=d3.timeDay.offset(p[1],+2);
      data=data.filter(tofilter);
      console.log(p[1]+" "+max);
      x.domain([min,max]);}
    else if(year=='6months'){
      var p=d3.extent(data, function(d) { return d.date; });
      var date=new Date();
      date=p[1];
      min=d3.timeDay.offset(date,-180);
      max=d3.timeDay.offset(p[1],+2);
      data=data.filter(tofilter);
      //console.log(p+" "+date+"new"+min);
      x.domain([min,max]);
    }
    else if(year=='1year'){
      var p=d3.extent(data, function(d) { return d.date; });
      var date=new Date();
      date=p[1];
      min=d3.timeDay.offset(date,-365);
      max=d3.timeDay.offset(p[1],+2);
      data=data.filter(tofilter);
      //console.log(p+" "+date+"new"+min);
      x.domain([min,max]);
    }
    else
    {	var p=d3.extent(data, function(d) { return d.date; });
      max=d3.timeDay.offset(p[1],+2);
      x.domain([p[0],max]);}
    y.domain([d3.min(data,function(d){return d.PostCount;}), d3.max(data, function(d) { return d.PostCount; })]);
    // add the area
    var div = d3.select(".mouseOverContent");

    if(year=='3months'||year=='6months'||year=='1year')
    {svg.selectAll("circle").data(data)
        .enter()
        .append("circle")
        .attr("cx",function(d){
          return x(d.date);
        })
        .attr("cy",function(d){
          return y(d.PostCount);
        })
        .attr("r",function(d){
          return 3;
        }).style("stroke", "black")
        .style("fill", "white")
        .style("fill-opacity","0.01")
        .on("mouseover", function (d) {
          div.transition()
              .duration(200)
              .style("opacity", .9);
          div .html("<b><h5>Timeline: " + d.date+ "<br>" + "Count: " + d.PostCount + "<br></h5> </b>")
              .style("left", (d3.event.pageX - 100) + "px")
              .style("top", (d3.event.pageY - 75) + "px")
              .style("color","black");
        })
        .on("mouseout", function (d) {
          div.transition()
              .duration(200)
              .style("opacity", 0);
        });}
    else{
      svg.selectAll("circle").data(data)
          .enter()
          .append("circle")
          .attr("cx",function(d){
            return x(d.date);
          })
          .attr("cy",function(d){
            return y(d.PostCount);
          })
          .attr("r",function(d){
            return 50;
          }).style("fill", "white")
          .style("fill-opacity","0.01")
          .on("mouseover", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div .html("<b><h5>Timeline: " + d.date+ "<br>" + "count: " + d.PostCount + "<br></h5> </b>")
                .style("left", (d3.event.pageX - 100) + "px")
                .style("top", (d3.event.pageY - 75) + "px")
                .style("color","black");
          })
          .on("mouseout", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
          });
    }
    // add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);

    // add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

  });
}