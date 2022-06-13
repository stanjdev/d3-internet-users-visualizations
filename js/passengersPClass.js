export default async function passengersPClass(data) {
  const width = 600;
  const height = 300;
  const margin = 40;

  const getPassengersByPClass = (data) => {
    const pclassData = [];
    const pclasses = data.map((passenger) => passenger.fields.pclass);
    const numBuckets = Math.max(...pclasses);

    for (let i = 1; i <= numBuckets; i++) {
      pclassData.push({
        pclass: i,
        survived: 0,
        notSurvived: 0,
        total: 0
      })
    }

    for (const passenger of data) {
      const pclass = passenger.fields.pclass;
      const index = pclassData.findIndex((object) => object.pclass === pclass)
      pclassData[index].total += 1;
      passenger.fields.survived === "Yes" ? pclassData[index].survived += 1 : pclassData[index].notSurvived += 1;
    }
    return pclassData;
  };
  
  const pclassData = getPassengersByPClass(data);
  console.log(pclassData);

  /* 
    [
      {pclass: 1, survived: 136, notSurvived: 80, total: 216},
      {pclass: 2, survived: 87, notSurvived: 97, total: 184},
      {pclass: 3, survived: 119, notSurvived: 372, total: 491},
    ]
  */

  const subgroups = ['survived', 'notSurvived'];

  const pclasses = pclassData.map((obj) => obj.pclass)

  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#87cefa', '#800000'])
  
  const xscale = d3.scaleBand()
    .domain(pclasses)
    .range([margin, width])
    .padding(0.05) // space between bars

  // yscale
  const popExtent = d3.extent(pclassData, d => d.total)
  const yscale = d3.scaleLinear()
    // .domain(popExtent)
    .domain([0, 500])
    .range([height, margin])


  const svg = d3.select('#svg_pclass');

  const title = svg
    .append('g')

  title
    .append('text')
    .text('Survivors and Casualties Grouped By Passenger Class')
    .attr('transform', `translate(${width / 2 - 185}, 20)`)
    .attr('class', 'labelText')

  // axis generator using the xscale to configure it
  const bottomAxis = d3.axisBottom(xscale)
    .tickFormat((d) => `${d === 1 ? `${d}st` : d === 2 ? `${d}nd` : `${d}rd`} Class`)

  svg
    .append('g')
    .attr('transform', `translate(${0}, ${height})`)
    .call(bottomAxis)

  const leftAxis = d3.axisLeft(yscale)

  svg
    .append('g')
    .attr('transform', `translate(${margin}, 0)`)
    .call(leftAxis)


    const stackedData = d3.stack()
      .keys(subgroups)(pclassData)

    svg.append('g')
      .selectAll('g')
      .data(stackedData)
      .enter()
      .append('g')
        .attr('fill', (d, i) => color(i))
        .selectAll('rect')
        .data((d) => d)
        .enter().append('rect')
          .attr("x", (d) => xscale(d.data.pclass))
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
      .attr('cy', (d, i) => (i * 20) + 55)
      .attr('fill', (d, i) => color(i))
      // .attr('fill', (d, i) => colorScale(i))

    labels
      .selectAll('text')
      .data(subgroups)
      .enter()
      .append('text')
      .text((d) => `${d[0].toUpperCase() + d.slice(1)}`)
      .attr('x', 85)
      .attr('y', (d, i) => (i * 20) + 60)
      .attr('class', 'labelText')


  // const barGroupSurvived = svg.append('g')
  
  // barGroupSurvived
  //   .selectAll('rect')
  //   .data(ageData)
  //   .enter()
  //   .append('rect')
  //   .attr('class', 'bar')
  //   .attr('x', (d) => xscale(d.ageRange))
  //   .attr('y', (d) => yscale(d.survived))
  //   .attr('width', xscale.bandwidth())
  //   .attr('height', (d) => height - yscale(d.survived))
  //   .attr('fill', (d, i) => color(i))


};

    