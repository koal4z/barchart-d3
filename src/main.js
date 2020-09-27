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
  console.log({ column_names, data, description, name });
  const w = 1000;
  const h = 600;
  const padding = 20;
  const barWidth = (w - padding * 2) / (data.length + 2);
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

  d3.select('#bar-chart')
    .append('h1')
    .style('text-align', 'center')
    .style('font-size', '4.8rem')
    .attr('id', 'title')
    .append('text')
    .text('United States GDP');

  let bar = d3.select('#bar-chart').append('svg').attr('width', w).attr('height', h);

  let tootip = d3
    .select('svg')
    .append('text')
    .attr('id', 'tooltip')
    .attr('x', 2 * padding + barWidth + 2)
    .attr('y', h / 2)
    .attr('fill', '#1aa6b7')
    .attr('font-size', ' 2rem')
    .attr('opacity', '0');

  bar
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('transform', `translate(${padding},0)`)
    .attr('class', 'bar')
    .attr('fill', '#ff414d')
    .attr('width', barWidth)
    .attr('height', (d) => h - scaleY(d[1]) - padding)
    .attr('x', (d) => scaleX(new Date(d[0])))
    .attr('y', (d) => scaleY(d[1]))
    .attr('data-date', (d) => d[0])
    .attr('data-gdp', (d) => d[1])
    .on('mouseover', function (d, i) {
      this.style.opacity = 0.6;
      tootip
        .attr('opacity', '1')
        .text(d[0] + ': $' + d[1] + ' Billions of Dollars')
        .attr('data-date', d[0]);
    })
    .on('mouseout', function () {
      this.style.opacity = 1;
      tootip.attr('opacity', '0');
    });

  d3.select('svg').append('g').attr('id', 'x-axis');
  d3.select('svg').append('g').attr('id', 'y-axis');

  const axisX = d3.axisBottom(scaleX);
  const axisY = d3.axisLeft(scaleY);

  d3.select('#x-axis')
    .call(axisX)
    .attr('transform', `translate(${padding}, ${h - padding})`);
  d3.select('#y-axis')
    .call(axisY)
    .attr('transform', `translate(${padding * 2}, 0)`);
};
run();
