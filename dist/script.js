const requestURL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json',
w = 1300,
h = 500,
padding = 60;

// Let's retrieve the dataset

var req = new XMLHttpRequest();
req.open('GET', requestURL, true);
req.send();
req.onload = function () {
  var json = JSON.parse(req.response);
  let dataset = json.data;

  // Build the svg object

  const svg = d3.select('.SVGChart').
  append('svg').
  attr('width', w).
  attr('height', h);

  // Draw and display the bar chart in the svg object

  // i) Prepare the scales

  const minDate = new Date(d3.min(dataset, d => d[0]));
  const maxDate = new Date(d3.max(dataset, d => d[0]));
  const minGDP = d3.min(dataset, d => d[1]);
  const maxGDP = d3.max(dataset, d => d[1]);

  const xScale = d3.scaleTime().
  domain([minDate, maxDate]).
  range([padding, w - padding]);

  const yScale = d3.scaleLinear().
  domain([0, maxGDP]).
  range([h - padding, padding]);

  // ii) Define a correctly dimensioned bar width (important for adjustment between bars and tick labels)

  const barWidth = (w - 2 * padding) / (dataset.length - 1);

  // iii) Declare the tooltip and its id

  const tooltip = d3.select(".SVGChart").
  append("div").
  attr("id", "tooltip").
  style("opacity", 0);

  // iv) And let's build our chart !  

  svg.selectAll("rect").
  data(dataset).
  enter().
  append("rect").
  attr("x", (d, i) => padding + i * barWidth).
  attr("y", d => yScale(d[1])).
  attr("class", "bar").
  attr("width", barWidth).
  attr("height", d => h - padding - yScale(d[1])).
  attr("data-date", d => d[0]).
  attr("data-gdp", d => d[1]).
  on("mouseover", handleMouseOver).
  on("mouseout", handleMouseOut);

  // Let's build the two functions to manage hover and tooltips

  function handleMouseOver(d, i) {
    d3.select(this).
    style("fill", "#0e4d44");
    tooltip.style("opacity", 1).
    attr("id", "tooltip").
    style("fill", "#0e4d44").
    attr("data-date", d[0]).
    html(function () {
      let toolTip = '<b>Date</b>: ' + d[0] + '<br/><b>GDP</b>: $';
      let unit = ' billion';
      let GDPstring = Math.round(d[1]).toString();
      let l = GDPstring.length;
      if (l > 3) {
        toolTip += GDPstring.substring(0, l - 3) + ',' + GDPstring.substring(l - 3);
        if ((l == 4 && GDPstring[0] != 1) | l > 4)
        {unit += 's';}
      } else
      {
        toolTip += GDPstring;
      }
      return toolTip + unit;
    }).
    style("left", i * barWidth + 20 + "px").
    style("top", yScale(d[1]) + 30 + "px");
  };

  function handleMouseOut(d, i) {
    d3.select(this).
    transition().
    duration(50).
    style("fill", "#519e94");
    tooltip.style("opacity", 0);
  };

  // And now, the axes and we're done !

  var xAxis = d3.axisBottom().
  scale(xScale);
  var yAxis = d3.axisLeft().
  scale(yScale);

  svg.append("g").
  attr("id", "x-axis").
  attr("transform", "translate(0," + (h - padding) + ")").
  call(xAxis);

  svg.append("g").
  attr("id", "y-axis").
  attr("transform", "translate(" + padding + ",0)").
  call(yAxis);
};