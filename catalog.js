const fs = require('fs');

function parseJSON(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return JSON.parse(data);
}

function decodeValue(value, base) {
    return parseInt(value, base);
}

function lagrangeInterpolation(points) {
    let constantTerm = 0;

    for (let i = 0; i < points.length; i++) {
        let [xi, yi] = points[i];
        let term = yi;

        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                let [xj, _] = points[j];
                term *= xj / (xj - xi);
            }
        }

        constantTerm += term;
    }

    return Math.round(constantTerm);
}

function findSecret(filename) {
    const data = parseJSON(filename);
    const n = data.keys.n;
    const k = data.keys.k;

    const points = [];
    for (let key in data) {
        if (key !== 'keys') {
            const x = parseInt(key);
            const base = parseInt(data[key].base);
            const yValue = data[key].value;
            const y = decodeValue(yValue, base);
            points.push([x, y]);
        }
    }

    const selectedPoints = points.slice(0, k);

    const constantTerm = lagrangeInterpolation(selectedPoints);

    console.log(`The constant term (secret) is: ${constantTerm}`);
}

findSecret('testcase1.json');
findSecret('testcase2.json');
