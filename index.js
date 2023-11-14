const canvas = document.getElementById('canvas');

function getNextPoint(x, y, direction, turnAngle, distance) {
    let radianDirection = direction * (Math.PI / 180);
    let radianTurn = (0-turnAngle) * (Math.PI / 180);
    let newDirection = radianDirection + radianTurn;
    let newX = x + distance * Math.cos(newDirection);
    let newY = y + distance * Math.sin(newDirection);
    return [newX, newY];
}

function getColorFromGradient(fraction) {
    let one = Math.round(255 * fraction);
    let two = Math.round(255 * (1 - fraction));
    return `rgb(${one}, 0, ${two})`;
}

function getSeries(min, max) {
    let result = [];
    for (let i = 0; i <= max-min; i++) {
        let n = min+i;
        result.push([n]);
        while (n != 1) {
            if (n % 2 == 0) {
                n /= 2;
            } else {
                n = n * 3 + 1;
            }
            result[i].push(n);
        }
    }
    return result;
}

function getPoints (numbersArray, turnOddAngle, turnEvenAngle) {
    let result = [];
    let x = 0, y = 0, currentAngle = -90;
    minX = Number.MAX_VALUE, maxX = Number.MIN_VALUE;
    minY = Number.MAX_VALUE, maxY = Number.MIN_VALUE;
    for (let i = 0; i < numbersArray.length; i++) {
        result.push([]); 
        x = 0; y = 0; currentAngle = -90;
        for (let j = 0; j < numbersArray[i].length; j++) {
            let turnAngle = numbersArray[i][j] % 2 === 0 ? turnEvenAngle : turnOddAngle;
            let newPoint = getNextPoint(x, y, currentAngle, turnAngle, 1);
            result[i].push(newPoint); 
            x = newPoint[0];
            y = newPoint[1];
            currentAngle += turnAngle;
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }
    }
    return result;
}

function drawTree(points) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.9;
    const xScale = canvas.width / (maxX - minX);
    const yScale = canvas.height / (maxY - minY);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    points.forEach(series => {
        let totalLength = 0;
        for (let j = 1; j < series.length; j++) {
            let dx = (series[j][0] - series[j - 1][0]) * xScale;
            let dy = (series[j][1] - series[j - 1][1]) * yScale;
            totalLength += Math.sqrt(dx * dx + dy * dy);
        }

        let accumulatedLength = 0;
        series.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo((point[0] - minX) * xScale, (point[1] - minY) * yScale);
            } else {
                let prevPoint = series[index - 1];
                let scaledX = (point[0] - minX) * xScale;
                let scaledY = (point[1] - minY) * yScale;
                let prevScaledX = (prevPoint[0] - minX) * xScale;
                let prevScaledY = (prevPoint[1] - minY) * yScale;

                let dx = scaledX - prevScaledX;
                let dy = scaledY - prevScaledY;
                let segmentLength = Math.sqrt(dx * dx + dy * dy);
                accumulatedLength += segmentLength;

                ctx.lineTo(scaledX, scaledY);
                ctx.strokeStyle = getColorFromGradient(accumulatedLength / totalLength);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(scaledX, scaledY);
            }
        });
    });
}



document.getElementById("submitBtn").addEventListener("click", function() {
    const turnOdd = parseInt(document.getElementById("oddRotation").value);
    const turnEven = parseInt(document.getElementById("evenRotation").value);
    const minNum = parseInt(document.getElementById("minNum").value);
    const maxNum = parseInt(document.getElementById("maxNum").value);
    const series = getSeries(minNum, maxNum);
    const points = getPoints(series, turnOdd, turnEven);
    drawTree(points);
    console.log("Odd Rotation:", turnOdd);
    console.log("Even Rotation:", turnEven);
    console.log("Starting Number:", minNum);
    console.log("Ending Number:", maxNum);
    console.log("Series:")
    console.log(series);
    console.log("points:");
    console.log(points);
    console.log("minX:", minX);
    console.log("minY:", minY);
    console.log("maxX:", maxX);
    console.log("maxY:", maxY);
    document.getElementById("inputDiv").style.display = 'none';
});

let minY, minX, maxY, maxX, maxLength, minLength;