const lang = 'en-GB';

/**
 * Returns the relative time string from current date
 *
 * @param date - The first input number
 * @returns The relative date from current date if the different is less than a week
 *
 */
export function getRelativeTimeString(date: Date): string {
	// Allow dates or times to be passed
	const timeMs = date.getTime();

	const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);

	const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];

	const units: Intl.RelativeTimeFormatUnit[] = ["second", "minute", "hour", "day", "week", "month", "year"];

	const unitIndex = cutoffs.findIndex(cutoff => cutoff > Math.abs(deltaSeconds));

	const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

	const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
	return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
}
