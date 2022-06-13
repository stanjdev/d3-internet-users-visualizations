import { convertStrToNumber } from "../helpers/helpers.js";

export default async function internetPopulation(data) {
  const width = 600;
  const height = 600;
  const padding = 10;

  // Number formatter
  const num_f = d3.format('.2s');

  const top10 = data.slice(0, 10);
  
  const colorScale = d3
    .scaleSequential(d3.interpolateViridis)
    .domain(d3.extent(top10, (d) => convertStrToNumber(d.population)))


  const root = d3.hierarchy({ children: top10 })
    .sum((d) => convertStrToNumber(d.population)) // Must call sum before pack()
  
  const pack = d3.pack()
    .size([width, height]) // Set the size of the area
    .padding(padding) // define padding between circles

  // Create a root node for d3 to draw
  const rootNode = pack(root); // Must call sum() first!
  
  const svg = d3.select('#svg_population')

  svg
    .style('border', '1px solid')
    // Create a group for each element
    .selectAll('g')
    // Data is the leaves of the hierarchical root node
    .data(rootNode.leaves())
    .join('g') // Join your group
    // Position each node
    .attr('transform', (d) => `translate(${d.x}, ${d.y + padding})`)
    .append('circle')
    .attr('r', (d) => d.r)
    .attr('fill', (d) => {
      // Note! d is hierachy data and the source data is on the data property!
      return colorScale(convertStrToNumber(d.data.population))
    })

  svg
    .selectAll('g')
    .data(rootNode.leaves())
    .join('g')
    .append('text')
    .text((d) => `${d.data.country_or_area}`)
    .attr('font-family', 'Helvetica')
    .attr('font-size', '0.7em')
    .style('text-anchor', 'middle')
    .style('alignment-baseline', 'middle')
    .style('mix-blend-mode', 'difference')
    .style('fill', 'white')

  svg
    .selectAll('g')
    .data(rootNode.leaves())
    .join('g')
    .append('text')
    .text((d) => `${num_f(convertStrToNumber(d.data.population))}`)
    .attr('transform', (d) => `translate(${0}, ${padding * 1.5})`)
    .style('text-anchor', 'middle')
    .style('alignment-baseline', 'middle')
    .style('mix-blend-mode', 'difference')
    .style('fill', 'white')
    .attr('class', 'labelText')

  const title = svg
    .append('g')
  
  title
    .append('text')
    .text('Top 10 Countries By Highest Populations')
    .attr('transform', `translate(${width / 2 - 150}, 20)`)
    .attr('class', 'labelText')

};

