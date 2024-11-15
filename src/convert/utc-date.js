// https://pubs.opengroup.org/onlinepubs/009695399/basedefs/xbd_chap04.html#tag_04_14
function getUnixTimeFromUTC ({ year, month, day, hours = 0, minutes = 0, seconds = 0, milliseconds = 0 }) {
  if (year < 1970) {
    return Date.UTC(year, month - 1, day, hours, minutes, seconds, milliseconds)
  }
  const mdays = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
  const _year = year - 1900
  let yday = mdays[month - 1] + day - 1
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  if (isLeap && month >= 3) {
    yday += 1
  }
  return 1000 * (
    seconds +
    minutes * 60 +
    hours * 3600 +
    yday * 86400 +
    (_year - 70) * 31536000 +
    Math.trunc((_year - 69) / 4) * 86400 -
    Math.trunc((_year - 1) / 100) * 86400 +
    Math.trunc((_year + 299) / 400) * 86400
  ) + milliseconds
}

function getDateFromTime ({ year, month, day, hours = 0, minutes = 0, seconds = 0, milliseconds = 0 }) {
  return new Date(year, month - 1, day, hours, minutes, seconds, milliseconds)
}

function getUTCTime (date) {
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()
  const dayOfWeek = date.getUTCDay()
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()
  const seconds = date.getUTCSeconds() || 0
  const milliseconds = date.getUTCMilliseconds() || 0
  return { year, month, day, dayOfWeek, hours, minutes, seconds, milliseconds }
}

function getLocalTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const dayOfWeek = date.getDay()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds() || 0
  const milliseconds = date.getMilliseconds() || 0
  return { year, month, day, dayOfWeek, hours, minutes, seconds, milliseconds }
}

function getDateTime (date, options) {
  const { useUTC } = options || {}
  let extract
  if (useUTC === true) {
    extract = getUTCTime
  } else if (useUTC === false) {
    extract = getLocalTime
  } else {
    throw new Error('Extract local or UTC date? Set useUTC option.')
  }
  return extract(date)
}

export { getUnixTimeFromUTC, getDateFromTime, getUTCTime, getLocalTime, getDateTime }
