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

function fetchPrecipData(startDate, endDate) {
    return new Promise((resolve, reject) => {
        const url = 'https://archive-api.open-meteo.com/v1/archive?latitude=43.07&longitude=-89.40&start_date=' + startDate + '&end_date=' + endDate + '&daily=precipitation_sum&timezone=America%2FChicago'

        const res = fetchWithTimeout(url);
        res.then(response => {
            data = response.json()
            data.then(vals => {
                resolve(vals['daily']['precipitation_sum'])
            })
        })

        res.catch(err => {
            reject(err)
        })

    });
}

let precipData = fetchPrecipData('2023-02-14', '2023-03-15')

precipData.then((value) => {
    console.log(value);
});