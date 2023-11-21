/**
 * Convert a date to a relative time string, such as
 * "a minute ago", "in 2 hours", "yesterday", "3 months ago", etc.
 * using Intl.RelativeTimeFormat
 */
const lang = 'en-GB';

export function getRelativeTimeString(date: Date): string {
	// Allow dates or times to be passed
	const timeMs = date.getTime();

	// Get the amount of seconds between the given date and now
	const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);

	// Array representing one minute, hour, day, week, month, etc. in seconds
	const cutoffs = [60, 3600, 86400, 86400 * 7, Infinity];

	// Array equivalent to the above but in the string representation of the units
	const units: Intl.RelativeTimeFormatUnit[] = ['second', 'minute', 'hour', 'day'];

	// Grab the ideal cutoff unit
	const unitIndex = cutoffs.findIndex((cutoff) => cutoff > Math.abs(deltaSeconds));

	// If deltaSecond is less than 7 day, then show relative time
	if (unitIndex <= 3) {
		// Get the divisor to divide from the seconds. E.g. if our unit is "day" our divisor
		// is one day in seconds, so we can divide our seconds by this to get the # of days
		const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

		// Intl.RelativeTimeFormat do its magic
		const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
		return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
	}

	return date.toLocaleDateString(lang);
}
