'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

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

// Function that will render an error
const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  // countriesContainer.style.opacity = 1;
};

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
/*
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
const getCountryData = function (country) {
  fetch(`https://restcountries.eu/rest/v2/name/${country}`)
    .then(response => response.json())
    .then(data => renderCountry(data[0]));
};
getCountryData('Italy');


// CHAINING PROMISES:

// With arrow functions:
const getCountryData = function (country) {
  fetch(`https://restcountries.eu/rest/v2/name/${country}`)
    .then(response => {
      if (!response.ok) throw new Error('Country not found');
      return response.json();
    })
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders[0];

      if (!neighbour) return;
      // Country 2
      return fetch(`https://restcountries.eu/rest/v2/alpha/${neighbour}`);
    })
    .then(response => response.json())
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      // second method, global handler of errors in the chain
      console.error(`${err}`);
      renderError('Something went wrong');
    })
    .finally(() => {
      //Called in any case (useful for hiding charging spinner)
      countriesContainer.style.opacity = 1;
    });
};
*/

// HANDLING REJECTED PROMISES (catch the error)
// The only way in which the fetch promise rejects is when the user loses the internet connection

// Ways of handling rejections:
// 1. Pass a second callback function into the then method (the first callback is always for the fulfilled promise)
// 2. We can handle all the error globally instead of inserting the second callback everywhere. We add a CATCH METHOD at the end of the chain

// THROWING ERRORS MANUALLY
// REQUEST 404 ERROR - the API can't find any result, it doesn't reject the promise
// When the request goes well, the Response "ok" is true, when there is an error is false
// We can add (above):
/*
if(!response.ok)
throw new Error(...error message)
*/
/*
// Helper function:

const getJSON = function (url, errorMsg = 'Something went wrong!') {
  fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} ${response.status}`);
    return response.json();
  });
};

const getCountryData = function (country) {
  getJSON(
    `https://restcountries.eu/rest/v2/name/${country}`,
    'Country not found'
  )
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders[0];

      if (!neighbour) throw new Error('No neighbour found');
      // Country 2
      return getJSON(
        `https://restcountries.eu/rest/v2/alpha/${neighbour}`,
        'Country not found'
      );
    })
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      // second method, global handler of errors in the chain
      console.error(`${err}`);
      renderError('Something went wrong');
    })
    .finally(() => {
      //Called in any case (useful for hiding charging spinner)
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function () {
  getCountryData('Italy');
});
*/

///////////////////////////////////////
// Coding Challenge #1

/* 
In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates.

Here are your tasks:

PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.
The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.

PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)

TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474

GOOD LUCK 😀
*/

/*
const whereAmI = function (lat, lng) {
  fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
    .then(res => {
      if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log(`You are in ${data.city}, ${data.country}`);

      return fetch(`https://restcountries.eu/rest/v2/name/${data.country}`);
    })
    .then(res => {
      if (!res.ok) throw new Error('Country not found');
      return res.json();
    })
    .then(data => renderCountry(data[0]))
    .catch(err => console.error(`${err.message}`))
    .finally(() => {
      //Called in any case (useful for hiding charging spinner)
      countriesContainer.style.opacity = 1;
    });
};
whereAmI(52.508, 13.381);
whereAmI(19.037, 72.873);
whereAmI(-33.933, 18.474);
*/

// EVENT LOOP
// It sends callback from queue to call stack
// If the stack is empty (no code is executed at the moment), it takes the first callback from the callback queue and puts it in the call stack to be executed (EVENT LOOP TAKE)

// The web API environment, the callback queue and the event loop make possible that async code can be executed in a non-blocking way with only one thread of execution in the engine
// The PROMISE from a fetch goes in the MICROTASKS QUEUE, that has priority over the callback queue

/*
console.log('Test start'); // Primo
setTimeout(() => console.log('0 second timer'), 0); // Ultimo ad essere eseguito, è nella callback queue
Promise.resolve('Resolved promised 1').then(res => console.log(res)); // Promise che ha precedenza per la microtask
Promise.resolve('Resolved promised 2').then(res => {
  for (let i = 0; i < 100000; i++) {} // Really long time to be executed, so setTime doesn't work after 0 sec but only after this finishes
  console.log(res);
});

console.log('Test end'); // Secondo (fa parte della call stack principale)
*/

/*
// BUILDING A SIMPLE PROMISE - to wrap old code based functions into Promises (PROMISIFY)
// We create the new Promise using the Promise constructor
// It takes only one argument: the EXECUTER FUNCTION, that takes 2 arguments, the resolve and reject
// The executer function is the function that contains the asynchronise behaviour that we will try tohandle with the promise

const lotteryPromise = new Promise(function (resolve, reject) {
  console.log('Lottery draw is happening');

  setTimeout(function () {
    if (Math.random() >= 0.5) {
      resolve('You Win'); // the Promise is fulfilled, we pass the function to handle with the Then method
    } else {
      reject(new Error('You Lose')); // We pass the error message that we want to handle in the catch method
    }
  }, 2000);
});

lotteryPromise.then(res => console.log(res)).catch(err => console.error(err));

// We Promisify the setTimeOut function:
const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

wait(2)
  .then(() => {
    console.log('I waited for 2 seconds');
    return wait(1);
  })
  .then(() => console.log('I waited for 1 second'));

// Create a fulfilled or rejected promise immediately:
Promise.resolve('You win').then(x => console.log(x));
Promise.reject('You lose').catch(x => console.error(x));
*/

/*
// Promisifying the Geolocation API

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    //navigator.geolocation.getCurrentPosition(
    //  position => resolve(position),
    //  err => reject(err)
    //);

    // THis is the same:
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

// getPosition().then(pos => console.log(pos));

const whereAmI = function () {
  getPosition()
    .then(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;

      return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    })
    .then(res => {
      if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log(`You are in ${data.city}, ${data.country}`);

      return fetch(`https://restcountries.eu/rest/v2/name/${data.country}`);
    })
    .then(res => {
      if (!res.ok) throw new Error('Country not found');
      return res.json();
    })
    .then(data => renderCountry(data[0]))
    .catch(err => console.error(`${err.message}`))
    .finally(() => {
      //Called in any case (useful for hiding charging spinner)
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', whereAmI);
*/

///////////////////////////////////////
// Coding Challenge #2

/* 
Build the image loading functionality that I just showed you on the screen.

Tasks are not super-descriptive this time, so that you can figure out some stuff on your own. Pretend you're working on your own 😉

PART 1
1. Create a function 'createImage' which receives imgPath as an input. This function returns a promise which creates a new image (use document.createElement('img')) and sets the .src attribute to the provided image path. When the image is done loading, append it to the DOM element with the 'images' class, and resolve the promise. The fulfilled value should be the image element itself. In case there is an error loading the image ('error' event), reject the promise.

If this part is too tricky for you, just watch the first part of the solution.

PART 2
2. Consume the promise using .then and also add an error handler;
3. After the image has loaded, pause execution for 2 seconds using the wait function we created earlier;
4. After the 2 seconds have passed, hide the current image (set display to 'none'), and load a second image (HINT: Use the image element returned by the createImage promise to hide the current image. You will need a global variable for that 😉);
5. After the second image has loaded, pause execution for 2 seconds again;
6. After the 2 seconds have passed, hide the current image.

TEST DATA: Images in the img folder. Test the error handler by passing a wrong image path. Set the network speed to 'Fast 3G' in the dev tools Network tab, otherwise images load too fast.

GOOD LUCK 😀
*/

/*
const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

const imgContainer = document.querySelector('.images');

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = imgPath;

    img.addEventListener('load', function () {
      imgContainer.append(img);
      resolve(img);
    });

    img.addEventListener('error', function () {
      reject(new Error('Image not found'));
    });
  });
};

let currentImg;

createImage('img/img-1.jpg')
  .then(img => {
    currentImg = img;
    console.log('Image 1 loaded');
    return wait(2);
  })
  .then(() => {
    currentImg.style.display = 'none';
    return createImage('img/img-2.jpg');
  })
  .then(img => {
    currentImg = img;
    console.log('Image 2 loaded');
    return wait(2);
  })
  .then(() => {
    currentImg.style.display = 'none';
  })
  .catch(err => console.error(err));
*/

// CONSUMING PROMISES WITH ASYNC/AWAIT (Syntetic sugar over Consuming Promises)
// async function: Function that keeps running in the background while performing the code that is inside of it. Then, when the function is done, it automatically returns a Promise
// Inside the async function we can have one or more AWAIT STATEMENTS: they will stop the code execution until the Promise is fulfilled
// it doesn't stop the execution of the call stack, but only the code in the async function

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = async function () {
  // Geolocation
  const pos = await getPosition();
  const { latitude: lat, longitude: lng } = pos.coords;

  // Reverse geocoding
  const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
  const dataGeo = await resGeo.json();

  // Country data
  const res = await fetch(
    `https://restcountries.eu/rest/v2/name/${dataGeo.country}`
  );
  const data = await res.json();
  renderCountry(data[0]);
};

whereAmI();
