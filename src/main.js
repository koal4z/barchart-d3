const getData = async () => {
  const res = await fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
  );
  const datas = await res.json();
  const { column_names, data, description, name } = await datas;
  return { column_names, data, description, name };
};

const run = async () => {
  const { column_names, data, description, name } = await getData();
  console.log(data);
  const w = 800;
  const h = 800;
  const barWidth = 5;
  const padding = 20;
  const maxDate = d3.max(data.map((d) => new Date(d[0])));
  const minDate = d3.min(data.map((d) => new Date(d[0])));
  const maxVal = d3.max(data.map((d) => d[1]));

  const scaleY = d3
    .scaleLinear()
    .domain([maxVal, 0])
    .range([padding, h - padding]);

  const scaleX = d3
    .scaleTime()
    .domain([minDate, maxDate])
    .range([padding, w - padding * 2]);

  d3.select('#bar-chart').append('h1').attr('id', 'title');

  d3.select('#bar-chart').append('svg').attr('width', w).attr('height', h);
  // .selectAll('rect')
  // .data(data)
  // .enter()
  // .append('rect')
  // .attr('fill', 'orangered')
  // .attr('width', barWidth)
  // .attr('height', (data) => data[1])
  // .attr('x', (data, i) => i * barWidth)
  // .attr('y', (data) => h - data[1]);

  d3.select('svg').append('g').attr('id', 'x-axis');
  d3.select('svg').append('g').attr('id', 'y-axis');

  const axisX = d3.axisBottom(scaleX);
  const axisY = d3.axisLeft(scaleY);

  d3.select('#x-axis')
    .call(axisX)
    .attr('transform', `translate(${padding}, ${h - padding})`);
  d3.select('#y-axis').call(axisY).attr('transform', `translate(${padding * 2}, 0)`);
};
run();
