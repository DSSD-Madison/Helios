const https = require('node:https');

/**
 * Computes irradiance values for a list of days in a year. Returns void, so use callback functions for control
 * @param {*} year 
 * @param {*} listofdays 
 * @param {*} beta 
 * @param {*} gamma 
 * @param {*} rho_g 
 * @param {*} arrayarea 
 * @param {*} onValCalculated when an irradiance value is calculated: onValCalculated(id, val)
 * @param {*} onAllValsCalculated when all irradiance values are calculated: onAllValsCalculated(results)
 * @param {*} onError error found when fetching data: onError(err)
 * @param {*} onRequestFulfilled a single https request was fulfilled: onRequestFulfilled(id)
 */
async function calcSolarValues(year, listofdays, beta, gamma, rho_g, arrayarea, onValCalculated, onAllValsCalculated, onError, onRequestFulfilled) {
    year = year.toString().slice(2);

    // fetched data
    let storage = {}

    // requests made (to avoid making duplicates)
    let requests = {}

    // days that need to be calculated
    let todo = {}

    // number of calculations remaining
    let remaining = 0;

    // resulting calculations
    let results = {};

    // Helper math functions
    function toRadians(angle) {
        return angle * (Math.PI / 180);
    }
    function sind(angle) {
        return Math.sin(toRadians(angle));
    }
    function cosd(angle) {
        return Math.cos(toRadians(angle));
    }
    function acosd(n) {
        return toDegrees(Math.acos(n))
    }
    function toDegrees(radians) {
        var pi = Math.PI;
        return radians * (180 / pi);
    }

    // Helper ID functions
    function getID(day, year) {
        return year.toString() + day.toString().padStart(3, '0');
    }
    function getNextID(day, year) {
        if (year % 4 == 0 && day == 366) {
            return getID(0, year + 1)
        }

        if (day == 365) {
            return getID(0, year + 1)
        }

        return getID(day + 1, year)
    }
    function getNextDayAndYear(day, year) {
        if (year % 4 == 0 && day == 366) {
            return [0, year + 1]
        }

        if (day == 365) {
            return [0, year + 1]
        }

        return [day + 1, year]
    }
    function getPrevID(day, year) {
        if (day == 1 && (year - 1) % 4 == 0) {
            return getID(366, year - 1)
        }

        if (day == 1) {
            return getID(365, year - 1)
        }

        return getID(day - 1, year)
    }


    // downloads data and calls calculate function
    function downloadData(day, year) {
        let id = getID(day, year)
        const url = 'https://gml.noaa.gov/aftp/data/radiation/solrad/msn/20' + year.toString() + '/msn' + id + '.dat';
        https.get(url, (resp) => {
            let data = '';

            // A chunk of data has been received
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received
            resp.on('end', () => {
                storage[id] = data;
                if (onRequestFulfilled) {
                    onRequestFulfilled(id)
                }
                let nextId = getNextID(day, year)
                let prevId = getPrevID(day, year)
                if (todo[id]) {
                    if (storage[id] && storage[nextId]) {
                        todo[id] = false
                        let val = getSolarVal(storage[id], storage[nextId], parseInt(day))
                        if (onValCalculated) {
                            onValCalculated(id, val)
                        }
                        results[id] = val
                        remaining -= 1
                    }
                }
                if (todo[prevId]) {
                    if (storage[prevId] && storage[id]) {
                        todo[prevId] = false
                        let val = getSolarVal(storage[prevId], storage[id], parseInt(day))
                        if (onValCalculated) {
                            onValCalculated(prevId, val)
                        }
                        results[prevId] = val
                        remaining -= 1
                    }
                }

                if (remaining == 0) {
                    if (onAllValsCalculated) {
                        onAllValsCalculated(results)
                    }
                }



            });

            resp.on('error', (err) => {
                if (onError) {
                    onError(err)
                }
            });
        })
    }

    // Calculates solar irradiance value
    function getSolarVal(f1, f2, n) {
        let lat_deg = 43.0725
        let decimaltime = []
        let zenith = []
        let dw_psp = []
        let direct = []
        let diffuse = []
        const allContents = f1
        let count = 0
        allContents.split(/\r?\n/).forEach((text) => {
            const arr = text.trim().split(/\s+/);
            count++
            if (count > 362 && arr.length == 31) {
                decimaltime.push(arr[6] - 6)
                zenith.push(arr[7])
                dw_psp.push(arr[8])
                direct.push(arr[10])
                diffuse.push(arr[12])
            }
        });

        const allContents2 = f2
        count = 0
        allContents2.split(/\r?\n/).forEach((text) => {
            const arr = text.trim().split(/\s+/);
            count++
            if (count <= 362 && arr.length == 31) {
                decimaltime.push(arr[6])
                zenith.push(arr[7])
                dw_psp.push(arr[8])
                direct.push(arr[10])
                diffuse.push(arr[12])
            }
        });

        // Solving for lost direct solar data (when direct = -9999.9)
        for (let i = 0; i < dw_psp.length; i++) {
            if (dw_psp[i] < 0 && direct[i] <= -9000) {
                direct[i] = 0
            }
            if (direct[i] <= -9000) {
                direct[i] = (dw_psp[i] - diffuse[i]) / Math.cos(toRadians(zenith[i]))
            }
        }

        // Replaces all negative radiation values with 0
        // Replace all zenith angles over 90 to 0 (avoid 90 because of divide by 0 error in Rb equation) to prevent a negative Rb
        for (let i = 0; i < decimaltime.length; i++) {
            direct[i] = Math.max(direct[i], 0)
            dw_psp[i] = Math.max(dw_psp[i], 0)
            diffuse[i] = Math.max(diffuse[i], 0)

            if (zenith[i] >= 90) {
                zenith[i] = 0;
            }

            if (decimaltime[0] < 0) {
                decimaltime[i] += 24
            }
        }

        delta = 23.45 * sind(360 * ((284 + n) / 365));
        L_st = 90;
        L_loc = 89.4;
        B = ((n - 1) * 360) / 365;
        E = 229.2 * (0.000075 + 0.001868 * cosd(B) - 0.032077 * sind(B) - 0.014615 * cosd(2 * B) - 0.04089 * sind(2 * B))

        let omega = []

        for (let i = 0; i < decimaltime.length; i++) {
            omega.push((decimaltime[i] * 60 + 4 * (L_st - L_loc) + E) / 60 * 15 - 180)
        }

        let inc_angle = []

        for (let i = 0; i < omega.length; i++) {
            inc_angle.push(acosd((sind(delta) * sind(lat_deg) * cosd(beta)) - (sind(delta) *
                cosd(lat_deg) * sind(beta) * cosd(gamma)) + (cosd(delta) * cosd(lat_deg) * cosd(beta) *
                    cosd(omega[i])) + (cosd(delta) * sind(lat_deg) * sind(beta) * cosd(gamma) * cosd(omega[i])) +
                (cosd(delta) * sind(beta) * sind(gamma) * sind(omega[i]))));
        }

        for (let i = 0; i < inc_angle.length; i++) {
            if (inc_angle[i] >= 90) {
                inc_angle[i] = 89.999;
            }
        }

        let Rb = []
        for (let i = 0; i < inc_angle.length; i++) {
            Rb.push(cosd(inc_angle[i]) / cosd(zenith[i]))
        }

        let direct_hz = []
        for (let i = 0; i < inc_angle.length; i++) {
            direct_hz.push(direct[i] * cosd(zenith[i]))
        }

        let minute_energy = []
        for (let i = 0; i < inc_angle.length; i++) {
            minute_energy.push((direct_hz[i] * Rb[i] + diffuse[i] * ((1 + cosd(beta)) / 2) + rho_g * (direct_hz[i] + diffuse[i]) * (1 - cosd(beta)) / 2) / 60)
        }

        total = 0
        for (let i = 0; i < minute_energy.length; i++) {
            total += minute_energy[i];
        }

        return total * arrayarea / 1000



    }

    // removing duplicate days
    listofdays = listofdays.filter((item,
        index) => listofdays.indexOf(item) === index);

    remaining = listofdays.length
    for (let i = 0; i < listofdays.length; i++) {
        todo[getID(listofdays[i], year)] = true
        if (!requests[getID(listofdays[i], year)]) {
            requests[getID(listofdays[i], year)] = true;
            downloadData(listofdays[i], year)
        }

        let [nextDay, nextYear] = getNextDayAndYear(listofdays[i], year)

        if (!requests[getNextID(listofdays[i], year)]) {
            requests[getNextID(listofdays[i], year)] = true;
            downloadData(nextDay, nextYear)
        }
    }
}

const start = Date.now();
function printExecutionTime(data) {
    console.log(data)
    const end = Date.now();
    console.log(`Execution time: ${end - start} ms`);
}

function printVal(id, val) {
    console.log("Calculated value: " + id + ", " + val)
}

function printRequest(id) {
    console.log(`Request fulfilled: ${id}`)
}

function printError(err) {
    console.log(`Request failed: ${err}`)
}
days = []//1, 6, 300, 200, 24, 100, 101, 103, 230, 230]
for (let i = 0; i < 3; i++) {
    days.push(i + 1)
}

// calcSolarValues(2022, days, 1, 1, 1, 1, printVal, printExecutionTime, printError, printRequest)
// calcSolarValues(21, days, 10, 0, 0, 214.3)

module.exports = calcSolarValues