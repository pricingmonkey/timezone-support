/* global beforeAll, it, expect */

import { findTimeZone, getZonedTime } from '../src/index'

let berlin

beforeAll(() => {
  berlin = findTimeZone('Europe/Berlin')
})

it('is exported as a function', () => {
  expect(typeof getZonedTime === 'function').toBeTruthy()
})

it('converts the UNIX time to the correct time object', () => {
  const unixTime = Date.UTC(2018, 0, 2, 9, 30, 15, 234)
  const berlinTime = getZonedTime(unixTime, berlin)
  expect(typeof berlinTime === 'object').toBeTruthy()
  const { year, month, day, dayOfWeek, hours, minutes, seconds, milliseconds, zone, epoch } = berlinTime
  expect(year).toEqual(2018)
  expect(month).toEqual(1)
  expect(day).toEqual(2)
  expect(dayOfWeek).toEqual(2)
  expect(hours).toEqual(10)
  expect(minutes).toEqual(30)
  expect(seconds).toEqual(15)
  expect(milliseconds).toEqual(234)
  expect(typeof zone === 'object').toBeTruthy()
  expect(zone.abbreviation).toEqual('CET')
  expect(zone.offset).toEqual(-60)
  expect(epoch).toEqual(1514885415234)
})

it('recognizes daylight-saving time', () => {
  const unixTime = Date.UTC(2018, 6, 2, 9, 30, 15, 234)
  const berlinTime = getZonedTime(unixTime, berlin)
  expect(typeof berlinTime === 'object').toBeTruthy()
  const { year, month, day, dayOfWeek, hours, minutes, seconds, milliseconds, zone, epoch } = berlinTime
  expect(year).toEqual(2018)
  expect(month).toEqual(7)
  expect(day).toEqual(2)
  expect(dayOfWeek).toEqual(1)
  expect(hours).toEqual(11)
  expect(minutes).toEqual(30)
  expect(seconds).toEqual(15)
  expect(milliseconds).toEqual(234)
  expect(typeof zone === 'object').toBeTruthy()
  expect(zone.abbreviation).toEqual('CEST')
  expect(zone.offset).toEqual(-120)
  expect(epoch).toEqual(1530523815234)
})

it('accepts a Date object instead of a numeric UNIX time', () => {
  const utcDate = new Date(Date.UTC(2018, 6, 2, 9, 30, 15, 234))
  const berlinTime = getZonedTime(utcDate, berlin)
  expect(typeof berlinTime === 'object').toBeTruthy()
  const { year, month, day, dayOfWeek, hours, minutes, seconds, milliseconds, zone, epoch } = berlinTime
  expect(year).toEqual(2018)
  expect(month).toEqual(7)
  expect(day).toEqual(2)
  expect(dayOfWeek).toEqual(1)
  expect(hours).toEqual(11)
  expect(minutes).toEqual(30)
  expect(seconds).toEqual(15)
  expect(milliseconds).toEqual(234)
  expect(typeof zone === 'object').toBeTruthy()
  expect(zone.abbreviation).toEqual('CEST')
  expect(zone.offset).toEqual(-120)
  expect(epoch).toEqual(1530523815234)
})

it('optimizes conversion to UTC', () => {
  const utc = findTimeZone('Etc/UTC')
  const utcDate = new Date(Date.UTC(2018, 6, 2, 9, 30, 15, 234))
  const berlinTime = getZonedTime(utcDate, utc)
  expect(typeof berlinTime === 'object').toBeTruthy()
  const { year, month, day, dayOfWeek, hours, minutes, seconds, milliseconds, zone, epoch } = berlinTime
  expect(year).toEqual(2018)
  expect(month).toEqual(7)
  expect(day).toEqual(2)
  expect(dayOfWeek).toEqual(1)
  expect(hours).toEqual(9)
  expect(minutes).toEqual(30)
  expect(seconds).toEqual(15)
  expect(milliseconds).toEqual(234)
  expect(typeof zone === 'object').toBeTruthy()
  expect(zone.abbreviation).toEqual('UTC')
  expect(zone.offset).toEqual(0)
  expect(epoch).toEqual(1530523815234)
})

it('when date matches timezone transition untils value', () => {
  const utc = findTimeZone('Europe/London')
  const utcDate = new Date(1477789200000)
  const berlinTime = getZonedTime(utcDate, utc)
  expect(typeof berlinTime === 'object').toBeTruthy()
  const { year, month, day, dayOfWeek, hours, minutes, seconds, milliseconds, zone, epoch } = berlinTime
  expect(year).toEqual(2016)
  expect(month).toEqual(10)
  expect(day).toEqual(30)
  expect(dayOfWeek).toEqual(0)
  expect(hours).toEqual(1)
  expect(minutes).toEqual(0)
  expect(seconds).toEqual(0)
  expect(milliseconds).toEqual(0)
  expect(typeof zone === 'object').toBeTruthy()
  expect(zone.abbreviation).toEqual('GMT')
  expect(zone.offset).toEqual(0)
  expect(epoch).toEqual(1477789200000)
})

it('supports last day in february during leap year', () => {
  const utc = findTimeZone('Europe/Berlin')
  const utcDate = new Date(Date.UTC(2020, 1, 29, 22, 59, 1, 314))
  const berlinTime = getZonedTime(utcDate, utc)
  expect(typeof berlinTime === 'object').toBeTruthy()
  const { year, month, day, dayOfWeek, hours, minutes, seconds, milliseconds, zone, epoch } = berlinTime
  expect(year).toEqual(2020)
  expect(month).toEqual(2)
  expect(day).toEqual(29)
  expect(dayOfWeek).toEqual(6)
  expect(hours).toEqual(23)
  expect(minutes).toEqual(59)
  expect(seconds).toEqual(1)
  expect(milliseconds).toEqual(314)
  expect(typeof zone === 'object').toBeTruthy()
  expect(zone.abbreviation).toEqual('CET')
  expect(zone.offset).toEqual(-60)
  expect(epoch).toEqual(1583017141314)
})
