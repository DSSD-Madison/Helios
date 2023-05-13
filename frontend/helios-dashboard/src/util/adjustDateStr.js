/**
 * returns a date object for the provided date. Necessary because MM-DD-YYYY
 * date format is not supported on all browsers
 * @param {*} dateStr date string of format MM-DD-YYYY
 */
export function keyToDateObj(dateStr) {
    let args = dateStr.split("-");
    args.unshift(args.pop());
    args[1] -= 1;
    return new Date(...args);
}