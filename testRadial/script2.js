var newData, newData2, data;

function renderGraph() {
  console.log('test2');
  console.log('This is not working?');

  var width = 860,
    height = 600,
    barHeight = height / 2 - 40;

  var formatNumber = d3.format("s");

  var color = d3.scaleOrdinal(d3.schemeCategory10)
    .range(["#009688", "pink"]);


  var svg = d3.select('body').append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");



  newData = [2701, 1751, 1076, 770, 830, 1633, 5536, 14802, 18675, 10563, 12109, 12894, 11935, 11766, 15301, 19206, 18755, 15947, 14013, 11341, 8452, 6688, 6162, 5654];
  newData2 = [1000, 1250, 712, 500, 1000, 1353, 4000, 13566, 20543, 12346, 10433, 12321, 10421, 12354, 17837, 22054, 13567, 15947, 14013, 11341, 8452, 6688, 6162, 5654];
  data = [];

  newData.map(function(d, i) {
    console.log(d);
    data.push({
      hour: i,
      value: [{
        value: d,
        color: "pink"
      }]
    })
  })

  newData2.map(function(d, i) {
    data[i].value.push({
      value: d,
      color: "#009688"
    })
  })

  console.log(data);

  var statesNames = data.map(function(d) {
    return d.hour;
  });
  var ageNames = ['Bicycles', 'Cars'];

  var barScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) {
      return d3.max(d.value, function(d) {
        return d.value;
      });
    })])
    .range([0, barHeight]);

  var numBarsStates = statesNames.length;
  var numBarsAges = ageNames.length;

  var x = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) {
      return d3.max(d.value, function(d) {
        return d.value;
      });
    })])
    .range([0, -barHeight]);

  var xAxis = d3.axisBottom(x)
    .ticks(5);

  var circles = svg.selectAll("circle")
    .data(x.ticks(5))
    .enter().append("circle")
    .attr("r", function(d) {
      return barScale(d);
    })
    .style("fill", "none")
    .style("stroke", "black")
    .style("stroke-dasharray", "2,2")
    .style("stroke-width", ".5px");

  var states = svg.selectAll(".state")
    .data(data)
    .enter().append("g")
    .attr("class", "state")
    .attr("transform", function(d, i) {
      return "rotate(" + (i * 360 / numBarsStates) + ")";
    });

  var arc = d3.arc()
    .startAngle(function(d, i) {
      return (i * 2 * Math.PI) / (numBarsAges * numBarsStates);
    })
    .endAngle(function(d, i) {
      return ((i + 1) * 2 * Math.PI) / (numBarsAges * numBarsStates);
    })
    .innerRadius(0);

  var segments = states.selectAll("path")
    .data(function(d) {
      return d.value;
    }).enter().append("path")
    .each(function(d) {
      d.outerRadius = 0;
    })
    .style("fill", function(d) {
      return d.color;
    })
    .attr("d", arc);

  segments.transition().duration(1200).delay(function(d, i) {
      return (25 - i);
    })
    .attrTween("d", function(d, index) {
      var i = d3.interpolate(d.outerRadius, barScale(d.value));
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

  states.selectAll("line")
    .data(function(d) {
      return d.value;
    })
    .enter().append("line")
    .attr("y2", function(d, i) {
      return i === 0 ? -barHeight - 20 : -barHeight;
    })
    .style("stroke", "black")
    .style("stroke-width", function(d, i) {
      return i === 0 ? "1px" : "0.2px";
    })
    .attr("transform", function(d, i) {
      return "rotate(" + (i * 360 / (numBarsAges * numBarsStates)) + ")";
    })

  svg.append("g")
    .attr("class", "x axis")
    .call(xAxis);

  var labelRadius = barHeight * 1.025;

  var labels = svg.append("g")
    .classed("labels", true);

  labels.append("def")
    .append("path")
    .attr("id", "label-path")
    .attr("d", "m0 " + -labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0");

  labels.selectAll("text")
    .data(statesNames)
    .enter().append("text")
    .style("text-anchor", "middle")
    .style("font-weight", "bold")
    .style("fill", function(d, i) {
      return "#3e3e3e";
    })
    .append("textPath")
    .attr("xlink:href", "#label-path")
    .attr("startOffset", function(d, i) {
      return i * 100 / numBarsStates + 50 / numBarsStates + '%';
    })
    .text(function(d) {
      if (d < 10) {
        return "0" + d + ":00";
      }
      return d + ":00";
    });

  // legend
  var legend = svg.selectAll(".legend")
    .data(ageNames.slice().reverse())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
      return "translate(" + -width / 2 + "," + (-(height / 2 - 20) + (i * 20)) + ")";
    });

  legend.append("rect")
    .attr("x", width - 33)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", "#009688");
  legend.append("rect")
    .attr("x", width - 33)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  legend.append("text")
    .attr("x", width - 39)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) {
      return d;
    });
}

function renderBarChart() {
  var margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 40
    },
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


  var x0 = d3.scaleBand()
    .rangeRound([0, width], .1);

  var x1 = d3.scaleBand();

  var y = d3.scaleLinear()
    .range([height, 0]);

  var xAxis = d3.axisBottom(x0)
    .tickSize(0)

  var yAxis = d3.axisLeft(y)


  var color = d3.scaleBand()
    .range(["#ca0020", "#f4a582", "#d5d5d5", "#92c5de", "#0571b0"]);

  var svg = d3.select('body').append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var hours = data.map(function(d) {
    return d.hour;
  });
  var rateNames = ['Bicycles', 'Cars'];

  x0.domain(hours);
  x1.domain(rateNames).rangeRound([0, x0.range()]);
  y.domain([0, d3.max(data, function(d) {
    return d3.max(d.value, function(d) {
      return d.value;
    });
  })]);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .style('opacity', '0')
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .style('font-weight', 'bold')
    .text("Value");

  svg.select('.y').transition().duration(500).delay(1300).style('opacity', '1');

  var slice = svg.selectAll(".slice")
    .data(data)
    .enter().append("g")
    .attr("class", "g")
    .attr("transform", function(d) {
      return "translate(" + x0(d.hour) + ",0)";
    });

  slice.selectAll("rect")
    .data(function(d) {
      return d.value;
    })
    .enter().append("rect")
    .attr("width", "10px")
    .attr("x", function(d) {
      if (d.color === "pink"){
        return 5;
      }
      return 20;
    })
    .style("fill", function(d) {
      return d.color
    })
    .attr("y", function(d) {
      return y(0);
    })
    .attr("height", function(d) {
      return height - y(0);
    })
    .on("mouseover", function(d) {
      d3.select(this).style("fill", d3.rgb(d.color).darker(2));
    })
    .on("mouseout", function(d) {
      d3.select(this).style("fill", d3.rgb(d.color));
    });

    slice.selectAll("rect")
      .transition()
      .delay(function (d) {return Math.random()*1000;})
      .duration(1000)
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });

  console.log(rateNames);
}
