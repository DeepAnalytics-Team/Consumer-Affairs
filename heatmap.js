const data = [
    [34, 78, 29],
    [109, 280, 120],
    [144, 190, 36],
    [76, 69, 200],
  ];
  
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const width = 300 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;
  
  const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, 300]);
  
  const svg = d3.select("#heatmap")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  
  const rows = data.length;
  const cols = data[0].length;
  const cellWidth = width / cols;
  const cellHeight = height / rows;
  
  data.forEach((row, i) => {
    row.forEach((value, j) => {
      svg.append("rect")
        .attr("x", j * cellWidth)
        .attr("y", i * cellHeight)
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .attr("fill", colorScale(value));
    });
  });
  