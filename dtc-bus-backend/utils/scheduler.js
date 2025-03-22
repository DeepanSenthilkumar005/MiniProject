const moment = require('moment');

const calculateSchedule = (initialDepartureTime, route) => {
    const schedule = [];
    let currentTime = moment(initialDepartureTime);

    // Add the start point to the schedule
    schedule.push({
        stop: route.startPoint,
        time: currentTime.format('YYYY-MM-DD HH:mm:ss'),
    });

    // Calculate times for each stop
    route.stops.forEach(stop => {
        currentTime.add(stop.travelTime, 'minutes');
        schedule.push({
            stop: stop.name,
            time: currentTime.format('YYYY-MM-DD HH:mm:ss'),
        });
    });

    // Add the end point to the schedule
    currentTime.add(route.stops[route.stops.length - 1].travelTime, 'minutes');
    schedule.push({
        stop: route.endPoint,
        time: currentTime.format('YYYY-MM-DD HH:mm:ss'),
    });

    return schedule;
};

module.exports = { calculateSchedule };