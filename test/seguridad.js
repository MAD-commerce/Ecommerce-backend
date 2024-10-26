const request = require('request');
const throttledRequest = require('throttled-request')(request);

// Limitar el número de solicitudes por segundo
throttledRequest.configure({
  requests: 1000,  // 1000 solicitudes por segundo
  milliseconds: 1000
});

for (let i = 0; i < 10000; i++) {
  throttledRequest({
    url: 'http://localhost:4004/api/products/allProducts',
    method: 'GET'
  }, (err, response, body) => {
    if (err) {
      console.error(err);
    } else {
      console.log(response.statusCode);
    }
  });
}
