var currentTagName;
function createForceDirectedGraph(tagName){
        currentTagName = tagName;
        $("#ForceDirectedGraphContent").html("");
        var canvas = d3.select("#ForceDirectedGraphContent"),
            width = 600,
            height = 1000;

        var svg =canvas.append("svg")
            .attr("width", width)
            .attr("height", height);

        var color = d3.scaleOrdinal(d3.schemeCategory20);

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.id; }))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));

        var fileName = tagName+"-fsd.json";
        d3.json(fileName, function(error, graph) {
            if (error) throw error;

            var link = svg.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(graph.links)
                .enter().append("line")
                .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

            var node = svg.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(graph.nodes)
                .enter().append("circle")
                .attr("r", 5)
                .attr("fill", function(d) { return color(d.group); })
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));


            node.append("title")
                .text(function(d) { return d.id; });

            node.on("click", function(d){
                createWordCloud(d.id,tagName)
            });

            simulation
                .nodes(graph.nodes)
                .on("tick", ticked);

            simulation.force("link")
                .links(graph.links);

            function ticked() {
                link
                    .attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                node
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
            }
        });

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }


    }

// ###########################################################################################
// https://github.com/d3/d3/blob/master/CHANGES.md
//https://github.com/jasondavies/d3-cloud/tree/master/examples
    var fullData = [];
    var nodeData=[];
    var currentTagName;

    function loadData(){

        nodeData = fullData;
        function filterDataLogic(currentObject){
            var filterBoolValue = currentObject.source == currentTagName;
            return filterBoolValue;
        }

        nodeData =  nodeData.filter(filterDataLogic);

        nodeData = nodeData.map(function (d) {
            d = {
                tagName : d.target,
                count: d.value,
                color:"#"+ (Math.floor(100000 + Math.random() * 900000)).toString(),//color(d.values.count),
            };
            return d;
        })

        addWordCloud();
    }

    function createWordCloud(tagName,currentAnalysisTagName) {
        $(".loader").show();
        currentTagName = tagName;
         fullData = [];
        var fileName = currentAnalysisTagName+"-fsd.json";
        d3.json(fileName, function(error, graph) {
            if (error) throw error;
            fullData = graph.links;
            loadData();
        });
    }

    function addWordCloud() {

        $("#wordCloud").html("");
        var fill = d3.scaleOrdinal(d3.schemeCategory20);
        var data = nodeData; //node data is array of objects
        var data = data.map(function(d) {
            sizeFunction = d3.scaleLinear().domain([0,2]).range([10,15]);
            var sizeNew = sizeFunction(+d.count);
            return {text: d.tagName, size: sizeNew};
            });


        setTimeout(function(){
            d3.layout.cloud().size([300, 500])
                .words(data)
                .padding(5)
                .rotate(function() { return ~~(Math.random() * 2) * 0; })
                .font("Impact")
                .fontSize(function(d) { return d.size; })
                .on("end", draw)
                .start();
        },50)

        function draw(words) {
            console.log("in draw word cloud");
            d3.select("#wordCloud").append("svg")
                .attr("width", 300)
                .attr("height", 500)
                .attr("background",'antiquewhite')
                .append("g")
                .attr("transform", "translate(150,250)")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function(d) { return d.size + "px"; })
                .style("font-family", "Impact")
                .style("fill", function(d, i) { return fill(i); })
                .attr("text-anchor", "middle")
                .attr("transform", function(d) {

                    return "translate(" + [d.x, d.y] + ")rotate(" + 0 + ")";
                })
                .text(function(d) { return d.text; });

            $(".loader").hide();
        }
    }