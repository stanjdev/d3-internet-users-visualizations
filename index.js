import internetPopulation from './js/internetPopulation.js';
import internetUsers from './js/internetUsers.js';
import internetLeastUsers from './js/internetLeastUsers.js';

async function handleData() {
  const data = await d3.csv('countries-internet-users.csv');
  internetPopulation(data);
  internetUsers(data);
  internetLeastUsers(data);
};

handleData();
