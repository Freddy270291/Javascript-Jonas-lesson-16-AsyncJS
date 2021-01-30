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
getCountryData('hungary');
