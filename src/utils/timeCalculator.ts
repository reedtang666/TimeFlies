export interface GrowthTime {
  years: number;
  months: number; // Remaining months in current year
  days: number;   // Remaining days in current month
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  totalDays: number;
  totalHours: number;
  heartbeats: number;
  breaths: number;
  sunrises: number;
  sleepDays: number;
  isValid: boolean;
}

export function calculateGrowthTime(dobString: string): GrowthTime {
  const now = new Date();
  const dob = new Date(dobString);

  if (isNaN(dob.getTime())) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
      totalDays: 0,
      totalHours: 0,
      heartbeats: 0,
      breaths: 0,
      sunrises: 0,
      sleepDays: 0,
      isValid: false,
    };
  }

  const diffMs = Math.max(0, now.getTime() - dob.getTime());

  // Precise breakdown
  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let days = now.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    // Get last day of previous month
    const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = Math.floor(now.getMilliseconds() / 10); // 0-99

  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalMinutes = Math.floor(diffMs / (1000 * 60));

  // Life estimations
  const heartbeats = Math.floor(totalMinutes * 78 + seconds * 1.3);
  const breaths = Math.floor(totalMinutes * 18 + seconds * 0.3);
  const sunrises = totalDays;
  const sleepDays = Math.floor((totalDays * 10) / 24); // ~10h per day average for kids

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    milliseconds: milliseconds,
    totalDays,
    totalHours,
    heartbeats,
    breaths,
    sunrises,
    sleepDays,
    isValid: true,
  };
}

export function formatNumberWithCommas(num: number): string {
  return num.toLocaleString('en-US');
}
