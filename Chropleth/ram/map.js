var map = {
	width: 960,
	height: 1160,
	};
	var color = d3.scale.linear().range(["#f7fcf5","00441b"]).interpolate(d3.interpolateRgb);
	function init()
    {
	map.svg = d3.select("#worldMapContainer").append("svg").attr("width",map.width).attr("height",map.height);
	d3.json("Data/countries.geo.json",function(error,countries_json)
	{
	if(error) return console.error("error");
	//map.countries = countries_json;
	draw_map(countries_json);
	});
	}
	function draw_map(countries_json)
	{
	d3.csv("Data/data2.csv",function(error,tags)
	{
	color.domain(d3.extent(tags,function(d) { return d.value;}));
	mergeTopo(tags,countries_json);
	var country_paths = map.svg.selectAll(".country").data(countries_json.features,function(d){return d.id;});
	country_paths.enter().insert("path",".country").attr("class","country").attr("d",d3.geo.path().projection(d3.geo.mercator())).style("stroke","steelblue");
	country_paths
	.style("fill",function(d){
	var val = d.properties.tag_value;
	if(val)
	{
	return color(val);
	}else
	{
	return "#fff";
	}
	});
	});
	}
	init();
	function mergeTopo(tags,countries_json)
	{
	console.log(countries_json.features);
	console.log(tags);
	tags.forEach(function(d)
	{
	var country_id = d.id;
	var tag_value = parseFloat(d.value);
	countries_json.features.some(function(geo_country)
	{
	//console.log(geo_country.properties.name);
	var geo_country_id = geo_country.properties.name;
	if(country_id==geo_country_id)
	{
	console.log(geo_country_id);
	geo_country.properties.tag_value = tag_value;
	return true ;
	}
	});
	});
	}