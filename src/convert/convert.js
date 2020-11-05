import { getUnixTimeFromUTC, getDateFromTime, getLocalTime, getDateTime } from './utc-date'

function binarySearchInRange (untils, value) {
  if (value < untils[0]) {
    return 0
  }
  if (value > untils[untils.length - 1]) {
    return untils.length - 1
  }

  let high = untils.length - 1
  let low = 0

  while (high >= low) {
    var mid = (high + low) >> 1

    if (value === untils[mid] || (value > untils[mid] && value < untils[mid + 1])) {
      return mid + 1
    } else if (value < untils[mid]) {
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  return -(mid + 1)
}

function findTransitionIndex (unixTime, timeZone) {
  const { untils } = timeZone
  return binarySearchInRange(untils, unixTime)
}

function getTransition (unixTime, timeZone) {
  const transitionIndex = findTransitionIndex(unixTime, timeZone)
  const abbreviation = timeZone.abbreviations[transitionIndex]
  const offset = timeZone.offsets[transitionIndex]
  return { abbreviation, offset }
}

function attachEpoch (time, unixTime) {
  time.epoch = unixTime
}

function getUTCOffset (date, timeZone) {
  const unixTime = typeof date === 'number' ? date : date.getTime()
  const { abbreviation, offset } = getTransition(unixTime, timeZone)
  return { abbreviation, offset }
}

const round3 = (input) => {
  const x = 1000
  return Math.round((input + Number.EPSILON) * x) / x
}

const makeUTCTime = (epochMillis) => {
  const epochSeconds = epochMillis / 1000
  const dayA = ~~(epochSeconds / (24 * 60 * 60))
  const seconds_ = ~~(epochSeconds % (24 * 60 * 60))
  const milliseconds = (1000 * round3(epochSeconds % 1))
  const seconds = seconds_ % 60
  const mins_ = ~~(seconds_ / 60)
  const hours = ~~(mins_ / 60)
  const minutes = mins_ % 60
  const dayOfWeek = (dayA + 4) % 7
  const year_ = ~~(((dayA * 4) + 2) / 1461)
  const year = 1900 + year_ + 70
  const leap = (year & 3) === 0 ? 1 : 0
  const dayB = dayA - ~~(((year_ * 1461) + 1) / 4)
  const dayC = dayB + ((dayB > (58 + leap)) ? (leap ? 1 : 2) : 0)
  const month = ~~(((dayC * 12) + 6) / 367)
  const day = dayC + 1 - ~~(((month * 367) + 5) / 12)
  return { year, month: month + 1, day: day, dayOfWeek, hours, minutes, seconds, milliseconds }
}

function getZonedTime (date, timeZone) {
  const gotUnixTime = typeof date === 'number'
  const unixTime = gotUnixTime ? date : date.getTime()
  const { abbreviation, offset } = getTransition(unixTime, timeZone)
  const time = makeUTCTime(unixTime - offset * 60000)
  time.zone = { abbreviation, offset }
  attachEpoch(time, unixTime)
  return time
}

function getUnixTime (time, timeZone) {
  let { zone, epoch } = time
  if (epoch) {
    if (timeZone) {
      throw new Error('Both epoch and other time zone specified. Omit the other one.')
    }
    return epoch
  }
  const unixTime = getUnixTimeFromUTC(time)
  if (zone) {
    if (timeZone) {
      throw new Error('Both own and other time zones specified. Omit the other one.')
    }
  } else {
    if (!timeZone) {
      throw new Error('Missing other time zone.')
    }
    zone = getTransition(unixTime, timeZone)
  }
  return unixTime + zone.offset * 60000
}

function setTimeZone (time, timeZone, options) {
  if (time instanceof Date) {
    time = getDateTime(time, options)
  } else {
    const { year, month, day, hours, minutes, seconds = 0, milliseconds = 0 } = time
    time = { year, month, day, hours, minutes, seconds, milliseconds }
  }
  const unixTime = getUnixTimeFromUTC(time)
  const utcDate = new Date(unixTime)
  time.dayOfWeek = utcDate.getUTCDay()
  const { abbreviation, offset } = getTransition(unixTime, timeZone)
  time.zone = { abbreviation, offset }
  attachEpoch(time, unixTime + offset * 60000)
  return time
}

function convertTimeToDate (time) {
  const { epoch } = time
  if (epoch !== undefined) {
    return new Date(epoch)
  }
  const { offset } = time.zone || {}
  if (offset === undefined) {
    return getDateFromTime(time)
  }
  const unixTime = getUnixTimeFromUTC(time)
  return new Date(unixTime + offset * 60000)
}

function convertDateToTime (date) {
  const time = getLocalTime(date)
  const match = /\(([^)]+)\)$/.exec(date.toTimeString())
  time.zone = {
    abbreviation: match ? match[1]
      // istanbul ignore next
      : '???',
    offset: date.getTimezoneOffset()
  }
  attachEpoch(time, date.getTime())
  return time
}

export { getUTCOffset, getZonedTime, getUnixTime, setTimeZone, convertTimeToDate, convertDateToTime }
