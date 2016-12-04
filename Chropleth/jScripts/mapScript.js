
function fetch(path, toggle,tagName) {
    var series = [];
    d3.csv(path, function (error, data) {
        data.forEach(function (d) {
            var temp = [];
            temp.push(d.id);
            temp.push(+d.value);
            series.push(temp);
        });
        format(series, toggle, tagName);
    });
}
/*var series = [
 ["BLR",75],["BLZ",43],["RUS",99],["RWA",88],["SRB",21],["TLS",43],
 ["REU",21],["TKM",19],["TJK",60],["ROU",4],["TKL",44],["GNB",38],
 ["GUM",67],["GTM",2],["SGS",95],["GRC",60],["GNQ",57],["GLP",53],
 ["JPN",59],["GUY",24],["GGY",4],["GUF",21],["GEO",42],["GRD",65],
 ["GBR",14],["GAB",47],["SLV",15],["GIN",19],["GMB",63],["GRL",56],
 ["ERI",57],["MNE",93],["MDA",39],["MDG",71],["MAF",16],["MAR",8],
 ["MCO",25],["UZB",81],["MMR",21],["MLI",95],["MAC",33],["MNG",93],
 ["MHL",15],["MKD",52],["MUS",19],["MLT",69],["MWI",37],["MDV",44],
 ["MTQ",13],["MNP",21],["MSR",89],["MRT",20],["IMN",72],["UGA",59],
 ["TZA",62],["MYS",75],["MEX",80],["ISR",77],["FRA",54],["IOT",56],
 ["SHN",91],["FIN",51],["FJI",22],["FLK",4],["FSM",69],["FRO",70],
 ["NIC",66],["NLD",53],["NOR",7],["NAM",63],["VUT",15],["NCL",66],
 ["NER",34],["NFK",33],["NGA",45],["NZL",96],["NPL",21],["NRU",13],
 ["NIU",6],["COK",19],["XKX",32],["CIV",27],["CHE",65],["COL",64],
 ["CHN",16],["CMR",70],["CHL",15],["CCK",85],["CAN",76],["COG",20],
 ["CAF",93],["COD",36],["CZE",77],["CYP",65],["CXR",14],["CRI",31],
 ["CUW",67],["CPV",63],["CUB",40],["SWZ",58],["SYR",96],["SXM",31],["USA",59], ["ZAF",88]
 ];
 console.log(series);*/
//var series = [[""]];
// Datamaps expect data in format:
// { "USA": { "fillColor": "#42a844", numberOfWhatever: 75},
//   "FRA": { "fillColor": "#8dc386", numberOfWhatever: 43 } }
function format(series, toggle, tagName) {
    var dataset = {};
    // We need to colorize every country based on "numberOfWhatever"
    // colors should be uniq for every value.
    // For this purpose we create palette(using min/max series-value)
    var onlyValues = series.map(function (obj) {
        return obj[1];
    });
    //console.log(series);
    var minValue = Math.min.apply(null, onlyValues),
        maxValue = Math.max.apply(null, onlyValues);
    var sum = 0;

    for( var i = 0; i < onlyValues.length; i++ ){
        sum += onlyValues[i]; //don't forget to add the base
    }

    var avg = sum/onlyValues.length;
    // create color palette function
    // color can be whatever you wish  12571622, 8929693
    var paletteScale = d3.scale.linear()
        .domain([minValue, avg, maxValue])
        .range(["#BFE6E6","#66B97D","#66B80D"]);
    // fill dataset in appropriate format
    series.forEach(function (item) { //
        // item example value ["USA", 70]
        var iso = item[0],
            value = item[1];
        dataset[iso] = {numberOfThings: value, fillColor: paletteScale(value)};
    });
    drawMap(dataset, toggle,tagName);
}
function drawMap(dataset, toggle, tagName) {
    // render map
    var container;
    if(toggle == 'world'){
        $('#worldMapContainer').html("");
        $('#worldMapHeading').html("World Map Choropleth for "+ tagName );
        container = document.getElementById('worldMapContainer');
    }
    else{
        $('#usaMapContainer').html("");
        $('#usaMapHeading').html("USA Map Choropleth for "+ tagName);
        container = document.getElementById('usaMapContainer');
    }

    new Datamap({
        scope: toggle,
        element: container,
        projection: 'mercator', // big world map
        // countries don't listed in dataset will be painted with this color
        fills: {defaultFill: '#F5F5F5'},
        data: dataset,
        geographyConfig: {
            borderColor: '#DEDEDE',
            highlightBorderWidth: 2,
            // don't change color on mouse hover
            highlightFillColor: function (geo) {
                return geo['fillColor'] || '#F5F5F5';
            },

            // only change border
            highlightBorderColor: '#B7B7B7',
            // show desired information in tooltip
            popupTemplate: function (geo, data) {
                // don't show tooltip if country don't present in dataset
                if (!data) {
                    return;
                }
                // tooltip content
                return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>User Count: <strong>', data.numberOfThings, '</strong>',
                    '</div>'].join('');
            }
        },
        done: function (datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function (geography) {
                alert(geography.properties.name);
            });
        }
    });
}

function toggleMap(){
    var jsonDataString = localStorage.getItem('myStorage');
    var jsonData = JSON.parse(jsonDataString);

        let fileName = "tags"+jsonData.currentTagName + ".csv";
        fetch(fileName, "world" , jsonData.currentTagName);

        fileName = "tags-usa"+jsonData.currentTagName + ".csv";
        fetch(fileName, "usa", jsonData.currentTagName);

}