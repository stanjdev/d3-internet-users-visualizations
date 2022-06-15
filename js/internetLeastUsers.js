import { convertStrToNumber } from '../helpers/helpers.js';

export default async function internetLeastUsers(data) {
  const width = 1000;
  const height = 450;
  const margin = 40;

  const cleanData = (data) => {
    const refinedData = [];
    for (const entry of data) {
      refinedData.push({
        country: entry.country_or_area,
        internet_users: convertStrToNumber(entry.internet_users),
        population: convertStrToNumber(entry.population),
        non_internet_users: convertStrToNumber(entry.population) - convertStrToNumber(entry.internet_users),
        rank: convertStrToNumber(entry.rank),
        rank_internet_users: convertStrToNumber(entry.rank_internet_users),
      })
    }
    return refinedData;
  };

  const cleanedData = cleanData(data);

  const sortCountriesByPercentage = (data) => {
    const sortedData = data.sort((a, b) => {
      const percentA = a.internet_users / a.population;
      const percentB = b.internet_users / b.population;
      return percentA - percentB;
    });
    return sortedData;
  };

  /*
    [
      {country: 'Eritrea', internet_users: 66402, population: 5068831, rank: 186, rank_internet_users: 209}
      {country: 'Somalia', internet_users: 294851, population: 14742523, rank: 166, rank_internet_users: 208}
      {country: 'Guinea-Bissau', internet_users: 73148, population: 1861283, rank: 180, rank_internet_users: 207}
      {country: 'Central African Rep.', internet_users: 202204, population: 4659080, rank: 173, rank_internet_users: 206}
      {country: 'Burundi', internet_users: 607311, population: 10864245, rank: 148, rank_internet_users: 205}
      {country: 'Chad', internet_users: 968500, population: 14899994, rank: 138, rank_internet_users: 204}
      {country: 'S. Sudan', internet_users: 1003542, population: 12575714, rank: 136, rank_internet_users: 202}
      {country: 'Liberia', internet_users: 377607, population: 4731906, rank: 159, rank_internet_users: 203}
      {country: 'Comoros', internet_users: 69020, population: 813912, rank: 184, rank_internet_users: 201}
    ]
  */


  const bottomNineCountries = sortCountriesByPercentage(cleanedData).slice(0, 9);

  console.log(bottomNineCountries);

  const subgroups = ['internet_users', 'non_internet_users'];
  
  const countryNames = bottomNineCountries.map((dataLine) => dataLine.country);

  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#39ff14', '#2B2D2F'])
  
  const xscale = d3.scaleBand()
    .domain(countryNames)
    .range([margin, width])
    .padding(0.05) // space between the bars

  const popExtent = d3.extent(bottomNineCountries, (d) => d.population);
  const yscale = d3.scaleLinear()
    .domain([0, 16000000])
    // .domain(popExtent)
    .range([height, margin])

  const svg = d3.select('#svg_least_users')
    .style('margin-top', margin)
    .style('border', 'solid 1px')

  const title = svg
    .append('g')
  
  title
    .append('text')
    .text('Top 9 Countries With the Lowest Ratio of Internet Users to Population')
    .attr('transform', `translate(${width / 4}, 20)`)
    .attr('class', 'labelText')

  const bottomAxis = d3.axisBottom(xscale)

  svg
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis)
  
  const num_f = d3.format('.2s');

  const leftAxis = d3.axisLeft(yscale)
    .tickFormat((d) => num_f(d))

  svg
    .append('g')
    .attr('transform', `translate(${margin}, 0)`)
    .call(leftAxis)

  const stackedData = d3.stack()
    .keys(subgroups)(bottomNineCountries)

  svg.append('g')
    .selectAll('g')
    .data(stackedData)
    .enter()
    .append('g')
      .attr('fill', (d, i) => color(i))
      .selectAll('rect')
      .data((d) => d)
      .enter().append('rect')
        .attr("x", (d) => xscale(d.data.country))
        .attr("y", (d) => yscale(d[1]))
        .attr('height', (d) => yscale(d[0]) - yscale(d[1]))
        .attr('width', xscale.bandwidth())

    const labels = svg
      .append('g')

    labels
      .selectAll('circle')
      .data(subgroups)
      .enter()
      .append('circle')
      .attr('r', '5')
      .attr('cx', 70)
      .attr('cy', (d, i) => (i * 20) + 25)
      .attr('fill', (d, i) => color(i))

    labels
      .selectAll('text')
      .data(subgroups)
      .enter()
      .append('text')
      .text((d) => `${d[0].toUpperCase() + d.slice(1)}`)
      .attr('x', 85)
      .attr('y', (d, i) => (i * 20) + 30)
      .attr('class', 'labelText')

};

    