import internetPopulation from './js/internetPopulation.js';
import internetUsers from './js/internetUsers.js';
// import passengersPClass from './js/passengersPClass.js';

async function handleData() {
  const data = await d3.csv('countries-internet-users.csv');
  internetPopulation(data);
  internetUsers(data);
  // passengersPClass(data);
};

handleData();
