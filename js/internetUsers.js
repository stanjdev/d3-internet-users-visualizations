import { convertStrToNumber } from '../helpers/helpers.js';

export default async function internetUsers(data) {
  const width = 950;
  const height = 500;
  const margin = 40;

  const projection = d3.geoMercator()
    // .scale(80)
    // .rotate([0, 0]);

  const svg = d3.select('#svg_internet_users')
    .attr('width', width)
    .attr('height', height)
    .style('border', '1px solid')
    .style('margin-top', margin)

  const path = d3.geoPath()
    .projection(projection);

  // group to hold the map path
  const g = svg.append('g');

  const colorScale = d3.scaleSequential()
    .interpolator(d3.interpolateRainbow)
    .domain([0, 176])

  const countryData = (data) => {
    const obj = {};
    for (const entry of data) {
      obj[entry.country_or_area] = entry;
    }
    return obj;
  };

  const dataByCountry = countryData(data);

  async function loadMap() {
    let maxPercent = 0;
    let minPercent = 100;
    // load and display the World
    const topology = await d3.json('countries-50m.json')
    // console.log(topology)
    g.selectAll('path')
      .data(topojson.feature(topology, topology.objects.countries).features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', (d, i) => {
        const countryMatch = dataByCountry[d.properties.name];
        // console.log(dataByCountry);
        // console.log(d.properties.name);
        if (countryMatch) {
          const internetUsers = convertStrToNumber(countryMatch.internet_users);
          const population = convertStrToNumber(countryMatch.population);
          const percent = (internetUsers / population) * 100;
          if (percent > maxPercent) maxPercent = percent;
          if (percent < minPercent) minPercent = percent;
          // return colorScale(percent)
          return `hsl(${360 / 176 * percent}, 70%, 50%)`
        }
      })
      // .attr('fill', (d, i) => colorScale(i))
      // .attr('fill', (d, i) => `hsl(${360 / 176 * i}, 70%, 50%)`)
      .attr('stroke', 'white')
      .attr('stroke-width', 0.45)
      return [maxPercent, minPercent];
  }

  const percentages = loadMap();

  const title = svg
  .append('g')

  title
    .append('text')
    .text('Percentage of Internet Users per Population by Country')
    .attr('transform', `translate(${width / 1.8}, ${height - 40})`)
    .attr('class', 'labelText')


  const labels = svg
    .append('g')

  percentages.then((percent) => {
    labels
      .selectAll('circle')
      .data(percent)
      .enter()
      .append('circle')
      .attr('r', '5')
      .attr('cx', 25)
      .attr('cy', (d, i) => (i * 20) + (height / 1.2))
      .attr('fill', (d, i) => `hsl(${360 / 176 * d}, 70%, 50%)`)

    labels
      .selectAll('text')
      .data(percent)
      .enter()
      .append('text')
      .text((d) => `${d.toFixed(2)}% of Population use Internet`)
      .attr('x', 45)
      .attr('y', (d, i) => (i * 20) + 5 + (height / 1.2))
      .attr('class', 'labelText')
  })

};

    