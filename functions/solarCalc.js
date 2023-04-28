const axios = require('axios')

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
function getNextID(d, y) {
    let year = parseInt(y)
    let day = parseInt(d)
    if (year % 4 == 0 && day == 366) {
        return getID(0, year + 1)
    }

    if (day == 365) {
        return getID(0, year + 1)
    }

    return getID(day + 1, year)
}
function getNextDayAndYear(d, y) {
    let year = parseInt(y)
    let day = parseInt(d)
    if (year % 4 == 0 && day == 366) {
        return [1, year + 1]
    }

    if (day == 365) {
        return [1, year + 1]
    }

    return [day + 1, year]
}
function getPrevID(d, y) {
    let year = parseInt(y)
    let day = parseInt(d)
    if (day == 1 && (year - 1) % 4 == 0) {
        return getID(366, year - 1)
    }

    if (day == 1) {
        return getID(365, year - 1)
    }

    return getID(day - 1, year)
}


// Functions to convert database IDs to NOA IDs and vice versa
function convertIDtoString(id) {
    const year = parseInt(parseInt(id.slice(0, 2)) + 2000)
    let day = parseInt(id.slice(2, 5))
    if (day <= 31) {
        return "01-" + String(day).padStart(2, '0') + "-" + year
    }

    if (year % 4 == 0) {
        if (day <= 60) {
            return "02-" + String(day - 31).padStart(2, '0') + '-' + year
        }
        day -= 1;
    }

    day -= 31;
    months = [28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    for (let i = 0; i < months.length; i++) {
        if (day <= months[i]) {
            return String(i + 2).padStart(2, '0') + '-' + String(day).padStart(2, '0') + '-' + year
        }
        day -= months[i]
    }
}
function convertStringToID(date) {
    const year = date.split('-')[2]
    let dateObj = new Date(date);
    const key = year.substring(2) + String(Math.floor(
        (dateObj - new Date('1/1/' + year)) /
        (1000 * 60 * 60 * 24) + 1
    )).padStart(3, '0');
    return key
}


// Helper function to create a promise for 
function makePromise(day, year) {
    let id = getID(day, year)
    const url = 'https://gml.noaa.gov/aftp/data/radiation/solrad/msn/20' + year.toString() + '/msn' + id + '.dat';
    return axios.get(url, { timeout: 8000 });

}

/**
 * Computes irradiance values for a list of days in a year. Returns void, so use callback functions for control
 * @param {*} year 
 * @param {*} listofdays 
 * @param {*} beta 
 * @param {*} gamma 
 * @param {*} rho_g 
 * @param {*} arrayarea 
 * @param {*} onAllValsCalculated when all irradiance values are calculated: onAllValsCalculated(results)
 */
async function calcSolarValues(year, listofdays, beta, gamma, rho_g, arrayarea, onAllValsCalculated) {
    year = year.toString().slice(2);

    // requests made (to avoid making duplicates)
    let requests = {}

    // number of calculations remaining
    let remaining = 0;

    // resulting calculations
    let results = {};

    // stores promises
    let promises = []

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

        if (1366 * 24 < total) {
            return NaN
        }
        return total * arrayarea

    }

    // removing duplicate days
    listofdays = listofdays.filter((item,
        index) => listofdays.indexOf(item) === index);

    remaining = listofdays.length
    for (let i = 0; i < listofdays.length; i++) {
        const currID = getID(listofdays[i], year)
        let [nextDay, nextYear] = getNextDayAndYear(listofdays[i], year)
        const nextID = getID(nextDay, nextYear)

        promises.push([])
        if (!requests[currID]) {
            const p = makePromise(listofdays[i], year)

            requests[currID] = p;
            promises[i].push(p)
        } else {
            promises[i].push(requests[currID])
        }

        if (!requests[nextID]) {
            const p = makePromise(nextDay, nextYear)

            requests[nextID] = p;
            promises[i].push(p)
        } else {
            promises[i].push(requests[nextID])
        }
    }

    for (let i = 0; i < promises.length; i++) {
        const p = Promise.all(promises[i])

        p.then((values) => {

            if (values[0].data.length > 250000 && values[1].data.length > 250000) {
                results[convertIDtoString(getID(listofdays[i], year))] = getSolarVal(values[0].data, values[1].data, parseInt(listofdays[i]))
            } else {
                results[convertIDtoString(getID(listofdays[i], year))] = NaN
            }
            remaining -= 1
            if (remaining == 0) { onAllValsCalculated(results); }
        }).catch((err) => {
            results[convertIDtoString(getID(listofdays[i], year))] = NaN;
            remaining -= 1
            if (remaining == 0) { onAllValsCalculated(results) }
        })

    }
}

// const start = Date.now();
// function printExecutionTime(data) {
//     console.log(data)
//     const end = Date.now();
//     console.log(`Execution time: ${end - start} ms`);
// }

// function printVal(id, val) {
//     console.log("Calculated value: " + id + ", " + val)
// }

// function printRequest(id) {
//     console.log(`Request fulfilled: ${id}`)
// }

// function printError(err) {
//     console.log(`Request failed: ${err}`)
// }
// days = []//1, 6, 300, 200, 24, 100, 101, 103, 230, 230]
// for (let i = 0; i < 1; i++) {
//     days.push(i + 1)
// }

// calcSolarValues(2022, days, 10, 0, 0, 214, undefined, printExecutionTime, printError, printRequest)

// console.log(new Date(1661126400000))

// const p = axios.get('https://gml.noaa.gov/aftp/data/radiation/solrad/msn/2022/msn22165.dat')
// p.then(values => {
//     console.log(values.data.length)
// })
module.exports = { calcSolarValues, convertIDtoString, convertStringToID }