// Interactive Function Grapher and Calculus Visualizer
document.addEventListener('DOMContentLoaded', function() {
    // Initialize graph functionality only if elements exist
    const canvas = document.getElementById('graph-canvas');
    const functionInput = document.getElementById('function-input');
    
    if (canvas && functionInput) {
        const ctx = canvas.getContext('2d');
        const graphBtn = document.getElementById('graph-btn');
        const showDerivative = document.getElementById('show-derivative');
        const showIntegral = document.getElementById('show-integral');
        const showTangent = document.getElementById('show-tangent');
        const xMinInput = document.getElementById('x-min');
        const xMaxInput = document.getElementById('x-max');
        const tangentXInput = document.getElementById('tangent-x');
        const graphInfo = document.getElementById('graph-info');
        const presetBtns = document.querySelectorAll('.preset-btn');

        // Set canvas size
        function resizeCanvas() {
            const container = canvas.parentElement;
            if (container) {
                canvas.width = container.clientWidth - 40;
                canvas.height = 500;
                drawGraph();
            }
        }

        if (window.addEventListener) {
            window.addEventListener('resize', resizeCanvas);
        }
        resizeCanvas();

    // Math function evaluator
    function evaluateFunction(funcStr, x) {
        try {
            // Replace function names
            let expr = funcStr.replace(/sin\(/g, 'Math.sin(')
                              .replace(/cos\(/g, 'Math.cos(')
                              .replace(/tan\(/g, 'Math.tan(')
                              .replace(/exp\(/g, 'Math.exp(')
                              .replace(/log\(/g, 'Math.log(')
                              .replace(/ln\(/g, 'Math.log(')
                              .replace(/sqrt\(/g, 'Math.sqrt(')
                              .replace(/abs\(/g, 'Math.abs(')
                              .replace(/\^/g, '**')
                              .replace(/pi/g, 'Math.PI')
                              .replace(/e\b/g, 'Math.E');
            
            // Replace x with actual value
            expr = expr.replace(/x/g, `(${x})`);
            
            // Evaluate safely
            return eval(expr);
        } catch (e) {
            return null;
        }
    }

    // Numerical derivative
    function derivative(funcStr, x, h = 0.0001) {
        const fxh = evaluateFunction(funcStr, x + h);
        const fx = evaluateFunction(funcStr, x);
        if (fxh === null || fx === null) return null;
        return (fxh - fx) / h;
    }

    // Numerical integral (Simpson's rule)
    function integral(funcStr, a, b, n = 1000) {
        const h = (b - a) / n;
        let sum = evaluateFunction(funcStr, a) + evaluateFunction(funcStr, b);
        
        for (let i = 1; i < n; i++) {
            const x = a + i * h;
            const fx = evaluateFunction(funcStr, x);
            if (fx === null) return null;
            sum += (i % 2 === 0) ? 2 * fx : 4 * fx;
        }
        
        return (h / 3) * sum;
    }

    // Convert screen coordinates to math coordinates
    function xToScreen(x, xMin, xMax, width) {
        return ((x - xMin) / (xMax - xMin)) * width;
    }

    function yToScreen(y, yMin, yMax, height) {
        return height - ((y - yMin) / (yMax - yMin)) * height;
    }

    function screenToX(screenX, xMin, xMax, width) {
        return xMin + (screenX / width) * (xMax - xMin);
    }

    // Draw coordinate system
    function drawAxes(xMin, xMax, yMin, yMax, width, height) {
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 1;

        // X-axis
        const yZero = yToScreen(0, yMin, yMax, height);
        if (yZero >= 0 && yZero <= height) {
            ctx.beginPath();
            ctx.moveTo(0, yZero);
            ctx.lineTo(width, yZero);
            ctx.stroke();
        }

        // Y-axis
        const xZero = xToScreen(0, xMin, xMax, width);
        if (xZero >= 0 && xZero <= width) {
            ctx.beginPath();
            ctx.moveTo(xZero, 0);
            ctx.lineTo(xZero, height);
            ctx.stroke();
        }

        // Grid lines
        ctx.strokeStyle = '#222';
        const xStep = (xMax - xMin) / 10;
        const yStep = (yMax - yMin) / 10;

        for (let i = 0; i <= 10; i++) {
            const x = xMin + i * xStep;
            const screenX = xToScreen(x, xMin, xMax, width);
            ctx.beginPath();
            ctx.moveTo(screenX, 0);
            ctx.lineTo(screenX, height);
            ctx.stroke();
        }

        for (let i = 0; i <= 10; i++) {
            const y = yMin + i * yStep;
            const screenY = yToScreen(y, yMin, yMax, height);
            ctx.beginPath();
            ctx.moveTo(0, screenY);
            ctx.lineTo(width, screenY);
            ctx.stroke();
        }
    }

    // Draw function graph
    function drawGraph() {
        const funcStr = functionInput.value.trim();
        if (!funcStr) return;

        const width = canvas.width;
        const height = canvas.height;
        const xMin = parseFloat(xMinInput.value) || -10;
        const xMax = parseFloat(xMaxInput.value) || 10;

        // Clear canvas
        ctx.fillStyle = '#0f1419';
        ctx.fillRect(0, 0, width, height);

        // Sample points and find y range
        const points = [];
        const numPoints = width * 2;
        let yMin = Infinity;
        let yMax = -Infinity;

        for (let i = 0; i < numPoints; i++) {
            const x = xMin + (i / (numPoints - 1)) * (xMax - xMin);
            const y = evaluateFunction(funcStr, x);
            if (y !== null && isFinite(y)) {
                points.push({ x, y });
                yMin = Math.min(yMin, y);
                yMax = Math.max(yMax, y);
            }
        }

        // Add padding
        const yRange = yMax - yMin;
        yMin -= yRange * 0.1;
        yMax += yRange * 0.1;
        if (yMin === yMax) {
            yMin -= 1;
            yMax += 1;
        }

        // Draw axes
        drawAxes(xMin, xMax, yMin, yMax, width, height);

        // Draw main function
        ctx.strokeStyle = '#ff4d4d';
        ctx.lineWidth = 2;
        ctx.beginPath();
        let firstPoint = true;

        for (const point of points) {
            const screenX = xToScreen(point.x, xMin, xMax, width);
            const screenY = yToScreen(point.y, yMin, yMax, height);
            if (firstPoint) {
                ctx.moveTo(screenX, screenY);
                firstPoint = false;
            } else {
                ctx.lineTo(screenX, screenY);
            }
        }
        ctx.stroke();

        // Draw derivative
        if (showDerivative.checked) {
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            firstPoint = true;

            for (let i = 0; i < numPoints; i++) {
                const x = xMin + (i / (numPoints - 1)) * (xMax - xMin);
                const y = derivative(funcStr, x);
                if (y !== null && isFinite(y)) {
                    const screenX = xToScreen(x, xMin, xMax, width);
                    const screenY = yToScreen(y, yMin, yMax, height);
                    if (firstPoint) {
                        ctx.moveTo(screenX, screenY);
                        firstPoint = false;
                    } else {
                        ctx.lineTo(screenX, screenY);
                    }
                }
            }
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Draw integral (area under curve)
        if (showIntegral.checked) {
            ctx.fillStyle = 'rgba(255, 77, 77, 0.2)';
            ctx.beginPath();
            const zeroY = yToScreen(0, yMin, yMax, height);
            ctx.moveTo(xToScreen(xMin, xMin, xMax, width), zeroY);

            for (const point of points) {
                const screenX = xToScreen(point.x, xMin, xMax, width);
                const screenY = yToScreen(point.y, yMin, yMax, height);
                ctx.lineTo(screenX, screenY);
            }

            ctx.lineTo(xToScreen(xMax, xMin, xMax, width), zeroY);
            ctx.closePath();
            ctx.fill();
        }

        // Draw tangent line
        if (showTangent.checked) {
            const tangentX = parseFloat(tangentXInput.value) || 0;
            const tangentY = evaluateFunction(funcStr, tangentX);
            const slope = derivative(funcStr, tangentX);

            if (tangentY !== null && slope !== null && isFinite(tangentY) && isFinite(slope)) {
                // Line: y = slope * (x - tangentX) + tangentY
                const x1 = xMin;
                const x2 = xMax;
                const y1 = slope * (x1 - tangentX) + tangentY;
                const y2 = slope * (x2 - tangentX) + tangentY;

                ctx.strokeStyle = '#ffff00';
                ctx.lineWidth = 2;
                ctx.setLineDash([3, 3]);
                ctx.beginPath();
                ctx.moveTo(xToScreen(x1, xMin, xMax, width), yToScreen(y1, yMin, yMax, height));
                ctx.lineTo(xToScreen(x2, xMin, xMax, width), yToScreen(y2, yMin, yMax, height));
                ctx.stroke();
                ctx.setLineDash([]);

                // Draw point
                ctx.fillStyle = '#ffff00';
                const pointX = xToScreen(tangentX, xMin, xMax, width);
                const pointY = yToScreen(tangentY, yMin, yMax, height);
                ctx.beginPath();
                ctx.arc(pointX, pointY, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Update info
        let infoHTML = `<div class="info-line"><span class="info-label">f(x):</span> ${funcStr}</div>`;
        
        if (showDerivative.checked) {
            const x = parseFloat(tangentXInput.value) || 0;
            const deriv = derivative(funcStr, x);
            if (deriv !== null) {
                infoHTML += `<div class="info-line"><span class="info-label">f'(${x.toFixed(2)}):</span> ${deriv.toFixed(4)}</div>`;
            }
        }

        if (showIntegral.checked) {
            const integralValue = integral(funcStr, xMin, xMax);
            if (integralValue !== null) {
                infoHTML += `<div class="info-line"><span class="info-label">∫[${xMin},${xMax}]:</span> ${integralValue.toFixed(4)}</div>`;
            }
        }

        graphInfo.innerHTML = infoHTML;
    }

    // Event listeners
    graphBtn.addEventListener('click', drawGraph);
    functionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') drawGraph();
    });
    
    showDerivative.addEventListener('change', drawGraph);
    showIntegral.addEventListener('change', drawGraph);
    showTangent.addEventListener('change', drawGraph);
    xMinInput.addEventListener('change', drawGraph);
    xMaxInput.addEventListener('change', drawGraph);
    tangentXInput.addEventListener('input', drawGraph);

    // Preset buttons
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            functionInput.value = btn.getAttribute('data-func');
            drawGraph();
        });
    });

        // Initial draw
        drawGraph();
    }

    // ============================================
    // EUCLIDEAN DISTANCE CALCULATOR
    // ============================================
    const euclideanBtn = document.getElementById('calc-euclidean');
    const euclideanResult = document.getElementById('euclidean-result');
    
    if (euclideanBtn && euclideanResult) {
        euclideanBtn.addEventListener('click', function() {
        const x1 = parseFloat(document.getElementById('euclidean-x1').value) || 0;
        const y1 = parseFloat(document.getElementById('euclidean-y1').value) || 0;
        const z1 = parseFloat(document.getElementById('euclidean-z1').value) || 0;
        const x2 = parseFloat(document.getElementById('euclidean-x2').value) || 0;
        const y2 = parseFloat(document.getElementById('euclidean-y2').value) || 0;
        const z2 = parseFloat(document.getElementById('euclidean-z2').value) || 0;

        let distance;
        if (z1 === 0 && z2 === 0) {
            // 2D distance
            distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        } else {
            // 3D distance
            distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
        }

            if (euclideanResult.querySelector('.result-value')) {
                euclideanResult.querySelector('.result-value').textContent = distance.toFixed(4) + ' units';
            }
        });

        // Initial calculation with default values (only runs once on page load)
        euclideanBtn.click();
    }

    // ============================================
    // HAVERSINE DISTANCE CALCULATOR
    // ============================================
    const EARTH_RADIUS_KM = 6371; // Earth's radius in kilometers
    const EARTH_RADIUS_MILES = 3959; // Earth's radius in miles

    function haversineDistance(lat1, lon1, lat2, lon2, unit = 'km') {
        // Convert latitude and longitude from degrees to radians
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        // Haversine formula
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        const radius = unit === 'km' ? EARTH_RADIUS_KM : EARTH_RADIUS_MILES;
        return radius * c;
    }

    const haversineBtn = document.getElementById('calc-haversine');
    const haversineResult = document.getElementById('haversine-result');
    const quickBtns = document.querySelectorAll('.quick-btn');
    
    if (haversineBtn && haversineResult) {

    // Quick location presets
    const locationPresets = {
        'jhb-cpt': {
            lat1: -26.2041, lon1: 28.0473, // Johannesburg
            lat2: -33.9249, lon2: 18.4241  // Cape Town
        },
        'jhb-dbn': {
            lat1: -26.2041, lon1: 28.0473, // Johannesburg
            lat2: -29.8587, lon2: 31.0218  // Durban
        },
        'cpt-dbn': {
            lat1: -33.9249, lon1: 18.4241, // Cape Town
            lat2: -29.8587, lon2: 31.0218  // Durban
        }
    };

        quickBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const preset = locationPresets[this.getAttribute('data-loc')];
                if (preset) {
                    const lat1Input = document.getElementById('haversine-lat1');
                    const lon1Input = document.getElementById('haversine-lon1');
                    const lat2Input = document.getElementById('haversine-lat2');
                    const lon2Input = document.getElementById('haversine-lon2');
                    if (lat1Input && lon1Input && lat2Input && lon2Input) {
                        lat1Input.value = preset.lat1;
                        lon1Input.value = preset.lon1;
                        lat2Input.value = preset.lat2;
                        lon2Input.value = preset.lon2;
                        haversineBtn.click();
                    }
                }
            });
        });

        haversineBtn.addEventListener('click', function() {
            const lat1Input = document.getElementById('haversine-lat1');
            const lon1Input = document.getElementById('haversine-lon1');
            const lat2Input = document.getElementById('haversine-lat2');
            const lon2Input = document.getElementById('haversine-lon2');
            
            if (!lat1Input || !lon1Input || !lat2Input || !lon2Input) {
                return;
            }
            
            const lat1 = parseFloat(lat1Input.value);
            const lon1 = parseFloat(lon1Input.value);
            const lat2 = parseFloat(lat2Input.value);
            const lon2 = parseFloat(lon2Input.value);

            if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
                const resultValue = haversineResult.querySelector('.result-value');
                if (resultValue) {
                    resultValue.textContent = 'Invalid input';
                }
                return;
            }

            const distanceKm = haversineDistance(lat1, lon1, lat2, lon2, 'km');
            const distanceMiles = haversineDistance(lat1, lon1, lat2, lon2, 'miles');
            const travelTime60 = (distanceKm / 60).toFixed(2); // Assuming 60 km/h average speed

            const resultValue = haversineResult.querySelector('.result-value');
            if (resultValue) {
                resultValue.innerHTML = 
                    `${distanceKm.toFixed(2)} km<br>` +
                    `<span style="font-size: 14px; color: #d4d4d4;">(${distanceMiles.toFixed(2)} miles | ~${travelTime60} hrs at 60km/h)</span>`;
            }
        });

        // Initial calculation with default values
        haversineBtn.click();
    }

    // ============================================
    // TAB SWITCHING
    // ============================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length > 0 && tabContents.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Update active tab content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `tab-${targetTab}`) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    // ============================================
    // BUS ROUTING SCENARIO
    // ============================================
    const stopsList = document.getElementById('stops-list');
    const addStopBtn = document.getElementById('add-stop');
    const calculateRouteBtn = document.getElementById('calculate-route');
    const distanceMatrixDiv = document.getElementById('distance-matrix');
    const routeSummaryDiv = document.getElementById('route-summary');
    
    if (stopsList && addStopBtn && calculateRouteBtn && distanceMatrixDiv && routeSummaryDiv) {
        // Initialize: Make Depot stop non-removable
        function initializeDepot() {
            const depotStop = stopsList.querySelector('.stop-item');
            if (depotStop) {
                const removeBtn = depotStop.querySelector('.remove-stop');
                if (removeBtn) {
                    removeBtn.style.display = 'none';
                }
            }
        }
        initializeDepot();

        function createStopElement(stopNum, stopType, pickupNumber) {
            const stopDiv = document.createElement('div');
            stopDiv.className = 'stop-item';
            stopDiv.setAttribute('data-type', stopType.toLowerCase());
            
            // Create name based on type
            let defaultName;
            if (stopType === 'Pickup') {
                defaultName = `Pickup ${pickupNumber}`;
            } else {
                defaultName = `Destination ${pickupNumber}`;
            }
            
            // Pickup stops have additional fields: Demand, TW Start, TW End
            const additionalFields = stopType === 'Pickup' ? `
                <input type="number" class="stop-demand" placeholder="Demand" value="0" min="0">
                <input type="number" class="stop-timewindow-start" placeholder="TW Start" value="0" min="0" max="1440">
                <input type="number" class="stop-timewindow-end" placeholder="TW End" value="1440" min="0" max="1440">
            ` : '';
            
            stopDiv.innerHTML = `
                <span class="stop-number">${stopNum}</span>
                <span class="stop-type-label ${stopType.toLowerCase()}">${stopType}</span>
                <input type="text" class="stop-name" placeholder="Stop Name" value="${defaultName}">
                <input type="number" class="stop-lat" placeholder="Lat" value="0" step="0.0001">
                <input type="number" class="stop-lon" placeholder="Lon" value="0" step="0.0001">
                ${additionalFields}
                <button class="remove-stop">×</button>
            `;

            // Add remove functionality
            stopDiv.querySelector('.remove-stop').addEventListener('click', function() {
                stopDiv.remove();
                updateStopNumbers();
                updateStopTypes();
            });

            return stopDiv;
        }

        function updateStopNumbers() {
            const stops = stopsList.querySelectorAll('.stop-item');
            stops.forEach((stop, index) => {
                stop.querySelector('.stop-number').textContent = index + 1;
            });
        }

        function updateStopTypes() {
            const stops = stopsList.querySelectorAll('.stop-item');
            let pickupCount = 0;
            let destinationCount = 0;
            
            // Skip depot (index 0), start from index 1
            for (let i = 1; i < stops.length; i++) {
                const stopType = (i % 2 === 1) ? 'Pickup' : 'Destination';
                const stop = stops[i];
                
                // Update numbering separately for Pickup and Destination
                if (stopType === 'Pickup') {
                    pickupCount++;
                    const nameInput = stop.querySelector('.stop-name');
                    if (nameInput) {
                        nameInput.value = `Pickup ${pickupCount}`;
                    }
                } else {
                    destinationCount++;
                    const nameInput = stop.querySelector('.stop-name');
                    if (nameInput) {
                        nameInput.value = `Destination ${destinationCount}`;
                    }
                }
            }
        }

        addStopBtn.addEventListener('click', function() {
            const stops = stopsList.querySelectorAll('.stop-item');
            const newStopNum = stops.length + 1;
            // Alternate between Pickup and Destination (first added stop after depot is Pickup)
            const stopType = (stops.length % 2 === 1) ? 'Pickup' : 'Destination';
            
            // Calculate number separately for Pickup and Destination
            let pickupCount = 0;
            let destinationCount = 0;
            for (let i = 1; i < stops.length; i++) {
                const stop = stops[i];
                if (stop.getAttribute('data-type') === 'pickup') {
                    pickupCount++;
                } else if (stop.getAttribute('data-type') === 'destination') {
                    destinationCount++;
                }
            }
            
            let stopNumber;
            if (stopType === 'Pickup') {
                pickupCount++;
                stopNumber = pickupCount;
            } else {
                destinationCount++;
                stopNumber = destinationCount;
            }
            
            const newStop = createStopElement(newStopNum, stopType, stopNumber);
            stopsList.appendChild(newStop);
            updateStopNumbers();
        });

        calculateRouteBtn.addEventListener('click', function() {
            const stops = stopsList.querySelectorAll('.stop-item');
            if (stops.length < 2) {
                alert('Please add at least 2 stops');
                return;
            }

            // Validate that the last stop is a Destination
            const lastStop = stops[stops.length - 1];
            const lastStopType = lastStop.getAttribute('data-type');
            if (lastStopType !== 'destination') {
                alert('The last stop must be a Destination. Please add a Destination stop or remove the last Pickup stop.');
                return;
            }

            // Get depot coordinates (first stop)
            const depotStop = stops[0];
            const depotLatInput = depotStop.querySelector('.stop-lat');
            const depotLonInput = depotStop.querySelector('.stop-lon');
            
            if (!depotLatInput || !depotLonInput) {
                alert('Depot stop must have latitude and longitude coordinates.');
                return;
            }
            
            const depotLat = parseFloat(depotLatInput.value);
            const depotLon = parseFloat(depotLonInput.value);
            
            if (isNaN(depotLat) || isNaN(depotLon)) {
                alert('Depot has invalid coordinates. Please enter valid latitude and longitude values.');
                return;
            }

            // Extract stop data - all stops have lat/lon, depot has no type, Pickup has demand/TW, Destination doesn't
            const stopData = [];
            for (let index = 0; index < stops.length; index++) {
                const stop = stops[index];
                const latInput = stop.querySelector('.stop-lat');
                const lonInput = stop.querySelector('.stop-lon');
                const stopType = stop.getAttribute('data-type') || '';
                
                if (!latInput || !lonInput) {
                    alert(`Stop ${index + 1} is missing coordinates. Please enter valid latitude and longitude values.`);
                    return;
                }
                
                const lat = parseFloat(latInput.value);
                const lon = parseFloat(lonInput.value);
                
                if (isNaN(lat) || isNaN(lon)) {
                    alert(`Stop ${index + 1} has invalid coordinates. Please enter valid latitude and longitude values.`);
                    return;
                }
                
                // Only Pickup stops have demand and time windows
                let demand = 0;
                let twStart = 0;
                let twEnd = 1440;
                
                if (stopType === 'pickup') {
                    const demandInput = stop.querySelector('.stop-demand');
                    const twStartInput = stop.querySelector('.stop-timewindow-start');
                    const twEndInput = stop.querySelector('.stop-timewindow-end');
                    
                    demand = demandInput ? parseInt(demandInput.value) || 0 : 0;
                    twStart = twStartInput ? parseInt(twStartInput.value) || 0 : 0;
                    twEnd = twEndInput ? parseInt(twEndInput.value) || 1440 : 1440;
                }
                
                stopData.push({
                    id: index + 1,
                    name: stop.querySelector('.stop-name').value || `Stop ${index + 1}`,
                    type: index === 0 ? 'Depot' : (stopType || ''),
                    lat: lat,
                    lon: lon,
                    demand: demand,
                    twStart: twStart,
                    twEnd: twEnd
                });
            }
            
            if (stopData.length < 2) {
                alert('Please add at least 2 stops');
                return;
            }

        // Calculate distance matrix
        const matrix = [];
        for (let i = 0; i < stopData.length; i++) {
            matrix[i] = [];
            for (let j = 0; j < stopData.length; j++) {
                if (i === j) {
                    matrix[i][j] = 0;
                } else {
                    const dist = haversineDistance(
                        stopData[i].lat, stopData[i].lon,
                        stopData[j].lat, stopData[j].lon, 'km'
                    );
                    matrix[i][j] = dist;
                }
            }
        }

        // Display distance matrix - only show Depot row
        let matrixHTML = '<table><thead><tr><th>From\\To</th>';
        stopData.forEach(stop => {
            const stopLabel = stop.type ? `${stop.name} (${stop.type})` : stop.name;
            matrixHTML += `<th>${stopLabel}</th>`;
        });
        matrixHTML += '</tr></thead><tbody>';

        // Only show the Depot row (row 0)
        const depotRow = matrix[0];
        const depotLabel = stopData[0].type ? `${stopData[0].name} (${stopData[0].type})` : stopData[0].name;
        matrixHTML += `<tr><th>${depotLabel}</th>`;
        depotRow.forEach(dist => {
            matrixHTML += `<td>${dist.toFixed(2)} km</td>`;
        });
        matrixHTML += '</tr>';
        matrixHTML += '</tbody></table>';

        distanceMatrixDiv.innerHTML = matrixHTML;

        // Calculate route summary
        const avgSpeed = parseInt(document.getElementById('avg-speed').value) || 60;
        let totalDistance = 0;

        // Simple nearest neighbor heuristic (for demonstration)
        const visited = new Set([0]); // Start at depot
        let current = 0;
        let route = [0];

        while (visited.size < stopData.length) {
            let nearest = -1;
            let nearestDist = Infinity;

            for (let i = 0; i < stopData.length; i++) {
                if (!visited.has(i) && matrix[current][i] < nearestDist) {
                    nearest = i;
                    nearestDist = matrix[current][i];
                }
            }

            if (nearest === -1) {
                break;
            }

            visited.add(nearest);
            route.push(nearest);
            totalDistance += nearestDist;
            current = nearest;
        }

        // Return to depot
        if (route.length > 1) {
            totalDistance += matrix[current][0];
        }

        // Calculate Deadrun: sum of distances from destinations to pickups (unpaid jobs)
        let deadrunDistance = 0;
        // Calculate Anti-Deadrun: sum of distances from pickups to destinations (paid jobs)
        let antiDeadrunDistance = 0;
        
        for (let i = 0; i < route.length - 1; i++) {
            const currentStopIndex = route[i];
            const nextStopIndex = route[i + 1];
            const currentStop = stopData[currentStopIndex];
            const nextStop = stopData[nextStopIndex];
            
            // If current stop is a destination and next stop is a pickup, add to deadrun (unpaid)
            if (currentStop.type === 'destination' && nextStop.type === 'pickup') {
                deadrunDistance += matrix[currentStopIndex][nextStopIndex];
            }
            
            // If current stop is a pickup and next stop is a destination, add to anti-deadrun (paid)
            if (currentStop.type === 'pickup' && nextStop.type === 'destination') {
                antiDeadrunDistance += matrix[currentStopIndex][nextStopIndex];
            }
        }

        const totalTimeHours = totalDistance / avgSpeed;
        const totalTimeMinutes = totalTimeHours * 60;

        let routeSequence = route.map(i => {
            const stop = stopData[i];
            return stop.type ? `${stop.name} (${stop.type})` : stop.name;
        }).join(' → ');
        
        let summaryHTML = `
            <h5>Route Optimization Summary</h5>
            <p><strong>Repositioning(Route Sequence):</strong> ${routeSequence} → ${stopData[0].name}</p>
            <p><strong>Deadhead(Total Distance):</strong> ${totalDistance.toFixed(2)} km</p>
            <p><strong>Deadrun(Total Inter-Job Distance):</strong> ${deadrunDistance.toFixed(2)} km</p>
            <p><strong>Anti-Deadrun(Total Paid-Jobs Distance):</strong> ${antiDeadrunDistance.toFixed(2)} km</p>
            <p><strong>Estimated Travel Time:</strong> ${totalTimeHours.toFixed(2)} hours (${totalTimeMinutes.toFixed(0)} minutes) at ${avgSpeed} km/h</p>
        `;

        routeSummaryDiv.innerHTML = summaryHTML;
        });
    }
});

