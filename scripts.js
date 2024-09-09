// Set the dimensions and margins of the graph
var margin = { top: 30, right: 30, bottom: 100, left: 100 },
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

// Append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Manually defined labels
var manualXLabels = ["Rice", "Wheat", "Atta (Wheat)", "Gram Dal", "Tur/Arhar Dal", "Urad Dal", "Moong Dal", "Masoor Dal", "Sugar", "Milk", "Groundnut Oil (Packed)", "Vanaspati (Packed)", "Soya Oil (Packed)", "Palm Oil (Packed)", "Gur", "Tea Loose", "Salt Pack (Iodised)", "Potato", "Onion", "Tomato"];
var manualYLabels = ["West Bengal", "Uttar Pradesh", "Tripura", "Telangana", "Tamil Nadu", "Sikkim", "Rajasthan", "Punjab", "Puducherry", "Odisha", "Mizoram", "Meghalaya", "Maharashtra", "Madhya Pradesh", "Karnataka", "Jharkhand", "Jammu and Kashmir", "Himachal Pradesh", "Haryana", "Gujarat", "Delhi", "Bihar", "Assam", "Andhra Pradesh"];

// Read the data from CSV
d3.csv("sample(1).csv").then(function(data) {

    // Extract unique groups and variables from the data
    var xLabels = d3.map(data, function(d) { return d.variable; }).keys();
    var yLabels = d3.map(data, function(d) { return d.group; }).keys();

    // Use manual labels if the extracted labels are empty
    xLabels = xLabels.length > 0 ? xLabels : manualXLabels;
    yLabels = yLabels.length > 0 ? yLabels : manualYLabels;

    // Ensure all combinations of xLabels and yLabels are represented
    var allCombinations = [];
    yLabels.forEach(function(y) {
        xLabels.forEach(function(x) {
            var existing = data.find(d => d.group === y && d.variable === x);
            allCombinations.push({
                group: y,
                variable: x,
                value: existing ? +existing.value : 0 // default value if missing
            });
        });
    });

    // Build X scales and axis
    var x = d3.scaleBand()
        .range([0, width])
        .domain(xLabels)
        .padding(0.05);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-65)")  // Rotate labels
        .style("text-anchor", "end");

    // Build Y scales and axis
    var y = d3.scaleBand()
        .range([height, 0])
        .domain(yLabels)
        .padding(0.05);

    svg.append("g")
        .style("font-size", 15)
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain").remove();

    // Build color scale
    var myColor = d3.scaleSequential()
        .interpolator(d3.interpolateInferno)
        .domain([0, 100]); // Adjust domain based on your data


   
      // Add the squares
      svg.selectAll()
      .data(allCombinations, function(d) { return d.group + ':' + d.variable; })
      .enter()
      .append("rect")
      .attr("x", function(d) { return x(d.variable); })
      .attr("y", function(d) { return y(d.group); })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", function(d) { return myColor(d.value); })
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      });

       
    // Create a tooltip
    var tooltip = d3.select("body")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "2px solid")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute");

// Three functions that change the tooltip when user hover / move / leave a cell
var mouseover = function(event, d) {
    tooltip
        .style("opacity", 1);
    d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1);
};

var mousemove = function(event, d) {
    tooltip
        .html("Value: " + d.value)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
};

var mouseleave = function(event, d) {
    tooltip
        .style("opacity", 0);
    d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8);
};

  