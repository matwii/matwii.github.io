function renderGraph() {
  console.log('test2');
  console.log('This is not working?');
  var width = 960,
    height = 500,
    barHeight = height / 2 - 40;

  var color = d3.scaleQuantize()
        .range(["#84e184", "#5ad75a", "#32cd32", "#28a428", "#1e7b1e"]);

  var svg = d3.select('body').append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var newData = [2701, 1751, 1076, 770, 830, 1633, 5536, 14802, 18675, 10563, 12109, 12894, 11935, 11766, 15301, 19206, 18755, 15947, 14013, 11341, 8452, 6688, 6162, 5654];
    var newData2 = [2701, 1751, 1076, 770, 830, 1633, 5536, 14802, 18675, 10563, 12109, 12894, 11935, 11766, 15301, 19206, 18755, 15947, 14013, 11341, 8452, 6688, 6162, 5654];
    var newArray = [];

    newData.map(function(d, i){
      newArray.push({
        name: i,
        value: d
      })
    })

  d3.csv("data.csv", function(error, data) {
    console.log(newArray)
    color.domain([d3.min(newArray.map(function(d){return d.value})), d3.max(newArray.map(function(d){return d.value}))])
    console.log('min: ' + d3.min(newArray.map(function(d){return d.value})), 'max: ' + d3.max(newArray.map(function(d){return d.value})))

    var extent = d3.extent(newArray, function(d) {
      return d.value;
    });

    console.log('extent: ' + extent);

    var barScale = d3.scaleLinear()
      .domain(extent)
      .range([0, barHeight]);

    var keys = newArray.map(function(d, i) {
      return d.name;
    });
    console.log('keys: ' + keys);
    var numBars = keys.length;

    var x = d3.scaleLinear()
      .domain(extent)
      .range([0, -barHeight]);

    var xAxis = d3.axisBottom(x)
      .ticks(3)

    var circles = svg.selectAll("circle")
      .data(x.ticks(3))
      .enter().append("circle")
      .attr("r", function(d) {
        return barScale(d);
      })
      .style("fill", "none")
      .style("stroke", "black")
      .style("stroke-dasharray", "2,2")
      .style("stroke-width", ".5px");

    var arc = d3.arc()
      .startAngle(function(d, i) {
        return (i * 2 * Math.PI) / numBars;
      })
      .endAngle(function(d, i) {
        return ((i + 1) * 2 * Math.PI) / numBars;
      })
      .innerRadius(0);

    var segments = svg.selectAll("path")
      .data(newArray)
      .enter().append("path")
      .each(function(d) {
        d.outerRadius = 0;
      })
      .style("fill", function(d) {
        return color(d.value);
      })
      .attr("d", arc);

    segments.transition().duration(1000).delay(function(d, i) {
        return (25 - i) * 100;
      })
    .attrTween("d", function(d, index) {
        var i = d3.interpolate(d.outerRadius, barScale(+d.value));
        return function(t) {
          d.outerRadius = i(t);
          return arc(d, index);
        };
      });

    svg.append("circle")
      .attr("r", barHeight)
      .classed("outer", true)
      .style("fill", "none")
      .style("stroke", "black")
      .style("stroke-width", "1.5px");

    var lines = svg.selectAll("line")
      .data(keys)
      .enter().append("line")
      .attr("y2", -barHeight - 20)
      .style("stroke", "black")
      .style("stroke-width", ".5px")
      .attr("transform", function(d, i) {
        return "rotate(" + (i * 360 / numBars) + ")";
      });

    svg.append("g")
      .attr("class", "x axis")
      .call(xAxis);

    // Labels
    var labelRadius = barHeight * 1.025;

    var labels = svg.append("g")
      .classed("labels", true);

    labels.append("def")
      .append("path")
      .attr("id", "label-path")
      .attr("d", "m0 " + -labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0");

    labels.selectAll("text")
      .data(keys)
      .enter().append("text")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .style("fill", function(d, i) {
        return "#3e3e3e";
      })
      .append("textPath")
      .attr("xlink:href", "#label-path")
      .attr("startOffset", function(d, i) {
        return i * 100 / numBars + 50 / numBars + '%';
      })
      .text(function(d) {
        return d;
      });
  });
}
