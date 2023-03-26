async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 8000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);
    return response;

}

/**
 * fetches precipitation data
 * @param {Date[]} dates 
 * @returns 
 */
function fetchPrecipData(dates) {
    let early = dates[0]
    let late = dates[0]
    let storage = {}

    function convertDateToString(date) {
        return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`
    }

    for (let i = 0; i < dates.length; i++) {
        if (dates[i].getTime() < early.getTime()) {
            early = dates[i]
        }

        if (dates[i].getTime() > late.getTime()) {
            late = dates[i]
        }

        // console.log(dates[i])
        // console.log(convertDateToString(dates[i]))

        storage[convertDateToString(dates[i])] = 0;
    }

    let fEarly = convertDateToString(early)
    let fLate = convertDateToString(late)
    // console.log(`${fEarly}, ${fLate}`)

    return new Promise((resolve, reject) => {
        const url = 'https://archive-api.open-meteo.com/v1/archive?latitude=43.07&longitude=-89.40&start_date=' + fEarly + '&end_date=' + fLate + '&daily=precipitation_sum&timezone=America%2FChicago'

        const res = fetchWithTimeout(url);
        res.then(response => {
            let data = response.json()
            data.then(resp => {
                let retval = []
                let vals = resp['daily']['precipitation_sum']
                let curr = early
                for (let i = 0; i < vals.length; i++) {
                    let dateString = convertDateToString(curr)
                    if (dateString in storage) {
                        retval.push(vals[i] / 10)
                    }
                    curr = new Date(curr.getTime() + 1000 * 60 * 60 * 24)
                }

                resolve(retval)
            })
        })

        res.catch(err => {
            reject(err)
        })

    });
}

// console.log(new Date('2023-03-15'))
// let precipData = fetchPrecipData([new Date('2023-02-15'), new Date('2023-03-15')])

// precipData.then((value) => {
//     console.log(value);
// });
