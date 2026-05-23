export const DAILY_ALARM = 'linkdrop:daily'
export const WEEKLY_ALARM = 'linkdrop:weekly'

export function nextDailyFireTime(timeStr, now = new Date()) {
  const [hh, mm] = (timeStr || '08:00').split(':').map((n) => parseInt(n, 10) || 0)
  const fire = new Date(now)
  fire.setHours(hh, mm, 0, 0)
  if (fire.getTime() <= now.getTime()) fire.setDate(fire.getDate() + 1)
  return fire.getTime()
}

export function nextWeeklyFireTime(day, timeStr, now = new Date()) {
  const target = ((day % 7) + 7) % 7
  const [hh, mm] = (timeStr || '08:00').split(':').map((n) => parseInt(n, 10) || 0)
  const fire = new Date(now)
  fire.setHours(hh, mm, 0, 0)
  const diff = (target - fire.getDay() + 7) % 7
  fire.setDate(fire.getDate() + diff)
  if (fire.getTime() <= now.getTime()) fire.setDate(fire.getDate() + 7)
  return fire.getTime()
}

export async function rescheduleAll(settings) {
  await chrome.alarms.clear(DAILY_ALARM)
  await chrome.alarms.clear(WEEKLY_ALARM)

  if (settings.dailyEnabled) {
    chrome.alarms.create(DAILY_ALARM, {
      when: nextDailyFireTime(settings.dailyTime),
      periodInMinutes: 60 * 24,
    })
  }

  if (settings.weeklyEnabled) {
    chrome.alarms.create(WEEKLY_ALARM, {
      when: nextWeeklyFireTime(settings.weeklyDay, settings.dailyTime),
      periodInMinutes: 60 * 24 * 7,
    })
  }
}
