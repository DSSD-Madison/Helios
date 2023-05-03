const getDateRange = (data, selectedIds, latestAggregateDate) => {
  if (selectedIds && selectedIds[0]) {
    let latestSelectedDate = new Date(0);

    for (const id of selectedIds) {
      let date = new Date(data[id].dates[data[id].dates.length - 1]);

      if (date.getTime() > latestAggregateDate.getTime()) {
        latestSelectedDate = date;
      }
    }

    return sixMonthRange(latestSelectedDate);
  }
  return sixMonthRange(latestAggregateDate);
};

const sixMonthRange = (date) => {
  let sixMonthsAgo = new Date(date.getTime());
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  return [sixMonthsAgo, date];
};

export default getDateRange;
