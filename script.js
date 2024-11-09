d3.csv("updated_combined_data_with_russia.csv").then(data => {
  
  const width = 960;
  const height = 600;

  // Red-to-green color scale for stability levels
  const colorScale = d3.scaleLinear().domain([1, 8]).range(["#d73027", "#1a9850"]); // Red to green

  const svg = d3.select("#map")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

  d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(geoData => {
    
    svg.selectAll("path")
       .data(geoData.features)
       .enter()
       .append("path")
       .attr("d", d3.geoPath().projection(d3.geoMercator().scale(130).translate([width / 2, height / 1.5])))
       .attr("fill", d => {
         const countryData = data.find(row => row.Country === d.properties.name);
         return countryData && countryData.StabilityEstimate !== ".." ? colorScale(countryData.StabilityEstimate) : "#D3D3D3"; // Gray for no data
       })
       .attr("stroke", "#fff")
       .on("click", (event, d) => showCountryData(d.properties.name));
  });

  function showCountryData(country) {
    const countryData = data.filter(row => row.Country === country);
    
    if (countryData.length === 0) {
      alert("Data not available for " + country);
      return;
    }
    
    const years = countryData.map(row => +row.Year);
    const stability = countryData.map(row => +row.StabilityEstimate);
    const armsDeliveries = countryData.map(row => +row.ArmsDeliveries);

    const trace1 = {
      x: years,
      y: stability,
      mode: 'lines+markers',
      name: 'Political Stability',
      line: { color: 'green' }
    };

    const trace2 = {
      x: years,
      y: armsDeliveries,
      mode: 'lines+markers',
      name: 'Arms Export',
      line: { color: 'red' }
    };

    const layout = {
      title: `${country} - Stability and Arms Export Over Time`,
      xaxis: { title: 'Year' },
      yaxis: { title: 'Value' }
    };

    Plotly.newPlot("chart", [trace1, trace2], layout);
  }
});
