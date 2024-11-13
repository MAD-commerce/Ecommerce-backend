
import axios from 'axios';
import { expect } from 'chai';

const endpoints = [
//   'http://localhost:4004/api/products/productById/645a9872e46d7206d612ab70',
//   'http://localhost:4004/api/products/getCartById/64612f2e538d1f677139edda',
  'http://localhost:4004/api/products/allProducts',
];

const requestTimes = {};
const thresholds = {
  excellent: 200,
  good: 500,
  acceptable: 1000,
  regular: 2000,
};

function evaluateResponseTime(averageTime) {
  if (averageTime <= thresholds.excellent) {
    return 'Excelente (invisible para el usuario)';
  } else if (averageTime <= thresholds.good) {
    return 'Bueno (no interrumpe la experiencia)';
  } else if (averageTime <= thresholds.acceptable) {
    return 'Aceptable (posible interrupción leve)';
  } else if (averageTime <= thresholds.regular) {
    return 'Regular (molesto pero tolerable)';
  } else {
    return 'Inaceptable (afecta negativamente la experiencia de usuario)';
  }
}

describe('Medición del tiempo de respuesta de los endpoints', function () {
  this.timeout(60000); // Aumenta el tiempo de espera si es necesario

  before(async function () {
    for (const endpoint of endpoints) {
      requestTimes[endpoint] = [];
    }
  });

  it('Debe medir el tiempo de respuesta promedio de cada endpoint y evaluar su usabilidad', async function () {
    for (const endpoint of endpoints) {
      for (let i = 0; i < 5; i++) { // Realiza 5 solicitudes por endpoint
        const startTime = Date.now();
        try {
          await axios.get(endpoint);
        } catch (error) {
          console.error(`Error en ${endpoint}: ${error.response ? error.response.status : error.message}`);
          continue; // Si hay error, pasa a la siguiente iteración
        }
        const endTime = Date.now();
        const duration = endTime - startTime;
        requestTimes[endpoint].push(duration);
        console.log(`Tiempo de respuesta para ${endpoint} en la iteración ${i + 1}: ${duration} ms`);
      }
    }

    for (const endpoint in requestTimes) {
      const times = requestTimes[endpoint];
      if (times.length === 0) {
        console.log(`No se pudo medir el tiempo para ${endpoint} debido a errores.`);
        continue;
      }

      const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
      const evaluation = evaluateResponseTime(averageTime);

      console.log(`Tiempo de respuesta promedio para ${endpoint}: ${averageTime.toFixed(2)} ms`);
      console.log(`Evaluación de usabilidad para ${endpoint}: ${evaluation}`);

      // Puedes incluir un assert opcional para asegurarte que el tiempo promedio esté dentro de un umbral aceptable.
      expect(averageTime).to.be.below(2000, `El tiempo promedio para ${endpoint} es demasiado alto`);
    }
  });
});
