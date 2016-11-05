var fullData = [];
var partData = [];
var nodeData;

function createBubbleChart() {
    $("#bubbleHeading").html("");
    d3.select("#bubbleSvg").selectAll("*").remove();
    d3.select("#cirlceMapping").selectAll("*").remove();
    fullData = [];


    $("#bubbleHeading").html("Chart Heading ");
    d3.csv("Data/ml_relatedTags.csv", function (rows) {
        loadData(rows);
        addBubbles(fullData);
    })
}

function loadData(rows){
    fullData = rows;

    var margin = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        },
        width = 350 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    var n = fullData.length,
        m = 1,
        padding = 6,
        radius1 = d3.scale.sqrt().range([0, 10]),
        color = d3.scale.linear().domain([0,50]).range(['#000000','#F0F0F0']),
        x = d3.scale.ordinal().domain(d3.range(m)).rangePoints([0, width], 1);

    var groupedContent = d3.nest()
        .key(function(d) {return d.tagName;})
        .sortKeys(d3.ascending)
        .rollup(function(d) {
            return {
                count:Math.round(d3.mean(d,function(g) {return +g.count;})),
            };
        })
        .entries(fullData);

    nodeData = groupedContent.map(function (d) {
        var i = Math.floor(Math.random() * m);
        return {
            tagName : d.key,
            count: d.values.count,
            radius: radius1(d.values.count),
            color:"#"+ (Math.floor(100000 + Math.random() * 900000)).toString(),//color(d.values.count),
            cx: x(i),
            cy: height / 2,
        };
    })


    function compare(a,b){
        if(a.count < b.count)
            return -1;
        if(a.count > b.count)
            return 1;
        else
            return 0;
    }
    nodeData.sort(compare);

}

function addBubbles(){

    var margin = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        },
        width = 350 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    var n = fullData.length,
        m = 1,
        padding = 6,
        radius = d3.scale.sqrt().range([0, 7]),
        x = d3.scale.ordinal().domain(d3.range(m)).rangePoints([0, width], 1);

    var force = d3.layout.force()
        .nodes(nodeData)
        .size([width, height])
        .gravity(0)
        .charge(0)
        .on("tick", tick)
        .start();

    var svg = d3.select("#bubbleSvg")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var div = d3.select(".mouseOverContent");

    var circle = svg.selectAll("circle")
        .data(nodeData)
        .enter().append("g")
        .append("circle")
        .attr("r", function (d) {return d.radius;})
        .style("fill", function (d) {return d.color;})
        .attr("stroke", "black")
        .on("mouseover", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div .html("<b>Country Name: " + d.countryName + "<br>" + "WinCount: " + d.winCount + "<br>"+"Avg Aces: "+d.avgWinnerAces+"</b>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .style("color","black");
        })
        .on("mouseout", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
        })
        .on("click", function (d){
            addClickedCircle(d.countryName);
        });


    var svgMapping = d3.select("#cirlceMapping");

    var svgMappingRects = svgMapping.selectAll("rect")
        .data(nodeData)
        .enter().append("g")
        .append("rect")
        .attr("width",13)
        .attr("height",13)
        .attr("y",function(d,i){
            return i*17;
        })
        .style("fill",function(d){
            return d.color;
        })

    svgMapping.selectAll("g")
        .data(nodeData)
        .append("text")
        .attr("y", function(d,i){
            return i*17 + 9;
        })
        .attr("x",25)
        .text(function(d){
            return d.countryName+" "+d.winCount;
        })
        .style("font-size","9px")


    function tick(e) {
        circle.each(gravity(.2 * e.alpha))
            .each(collide(.4))
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            })
    }



// Move nodes toward cluster focus.
    function gravity(alpha) {
        return function (d) {
            d.y += (d.cy - d.y) * alpha;
            d.x += (d.cx - d.x) * alpha;
        };
    }

// Resolve collisions between nodes.
    function collide(alpha) {
        var quadtree = d3.geom.quadtree(nodeData);
        return function (d) {
            var r = d.radius + radius.domain()[1] + padding,
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
            quadtree.visit(function (quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== d)) {
                    var x = d.x - quad.point.x,
                        y = d.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
                    if (l < r) {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        quad.point.x += x;
                        quad.point.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        };
    }
}
