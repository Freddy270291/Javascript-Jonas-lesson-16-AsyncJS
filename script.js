'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
// ASYNCHRONOUS JS, AJAX AND APIS
// The most important use is to make AJAX calls to APIs
// SYNCHRONOUS CODE: it is executed line by line, each line of code always waits the previous one to be executed
// It's a problem when a line of code takes a lot of time to run (example: alert, it blocks the code execution)

// ASYNCHRONOUS CODE: it is executed AFTER a task that runs in the background finishes
// The main code is not blocked and execution does not wait for an async task to finish its work
// The callback runs after all the other code (Callback does NOT automatically make code asynchronous)

///// AJAX CALLS (Asynchronous Javascript And XML):
// Allows us to communicate with remote web services in an asynchronous way. With AJAX calls, we can REQUEST DATA from web servers dynamically (without reloading the page)

///// API (Application Programming Interface):
// Piece of software that can be used by another piece of software, in order to allow APPLICATIONS TO TALK EACH OTHER
// "ONLINE" API: Application running on a server, that receives requests for data, and sends data back as response
// We can build OUR OWN web APIs (requires back-end development, e.g. with node.JS) or use 3rd-Party APIs.

// XML is a data format that was used to transmit data, now it is not used anymore.
// Instead, most API use the JSON data format - it's just a JS object converted to a string

///// XMLHTTPREQUEST FUNCTION
// It is the old way to make AJAX Calls
/*
const getCountryData = function (country) {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`); // We open the request (GET)
  request.send(); // It sends the request to the URL - it fetches the data in the background

  // Register a callback for the request on the load event
  request.addEventListener('load', function () {
    // Convert the JSON to a string:
    const [data] = JSON.parse(this.responseText);

    const html = `
  <article class="country">
      <img class="country__img" src="${data.flag}" />
        <div class="country__data">
          <h3 class="country__name">${data.name}</h3>
          <h4 class="country__region">${data.region}</h4>
          <p class="country__row"><span>👫</span>${(
            +data.population / 1000000
          ).toFixed(1)}</p>
          <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
          <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
        </div>
  </article>
        `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
  });
};

getCountryData('Italy');
*/

// CALLBACK HELL: second AJAX Call to look for the first neighbour country

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
      <img class="country__img" src="${data.flag}" />
        <div class="country__data">
          <h3 class="country__name">${data.name}</h3>
          <h4 class="country__region">${data.region}</h4>
          <p class="country__row"><span>👫</span>${(
            +data.population / 1000000
          ).toFixed(1)}</p>
          <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
          <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
        </div>
  </article>
        `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};
/*
const getCountryAndNeighbour = function (country) {
  // AJAX Call country 1
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`); // We open the request (GET)
  request.send(); // It sends the request to the URL - it fetches the data in the background

  // Register a callback for the request on the load event
  request.addEventListener('load', function () {
    // Convert the JSON to a string:
    const [data] = JSON.parse(this.responseText);

    //Render Country
    renderCountry(data);

    // Get the neighobour country 2
    const [neighbour] = data.borders;

    // Return in case there are no neighbour counstries
    if (!neighbour) return;

    // AJAX Call country 2 (dependent on the first one)
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.eu/rest/v2/alpha/${neighbour}`); // We open the request (GET)
    request2.send(); // It sends the request to the URL - it fetches the data in the background

    request2.addEventListener('load', function () {
      const data2 = JSON.parse(this.responseText);

      renderCountry(data2, 'neighbour');
    });
  });
};

getCountryAndNeighbour('Italy');
*/

// PROMISES AND THE FETCH API

const request = fetch('https://restcountries.eu/rest/v2/name/Italy'); // This returns a Promise {<pending>}
// Promise: An object that is used as a placeholder for the future result of an asynchronous operation
// Advantages:
// a. we no longer need to rely on events and callback functions to handle async results
// b. Instead of nesting callbacks, we can CHAIN PROMISES for a sequence of async operations --> escaping callback hell!

// Lifecycle of a Promise:
// 0. Pending: Before the future value is available
// 1. Settled: When the async function finished and there is a result
// 1a. Fulfilled Promises - the value is now available
// 1b. Rejected Promises - an error happened

// The Promise is settled once, after that it is impossible to be changed
// we CONSUME A PROMISE when we already have a promise (before we have to build it)

// CONSUMING A PROMISE:
const getCountryData = function (country) {
  // fetch(`https://restcountries.eu/rest/v2/name/${country}`); // This returns a pending Promise
  fetch(`https://restcountries.eu/rest/v2/name/${country}`)
    .then(function (response) {
      return response.json(); // Method available to all the responses that are coming from a fetch function. It is also an async function
    })
    .then(function (data) {
      renderCountry(data[0]);
    });
};
getCountryData('Italy');

// With arrow functions:
const getCountryData2 = function (country) {
  fetch(`https://restcountries.eu/rest/v2/name/${country}`)
    .then(response => response.json())
    .then(data => renderCountry(data[0]));
};
getCountryData2('Italy');
