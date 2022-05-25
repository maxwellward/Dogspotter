const getOrdinalNum = (number) => {
	let selector;

	if (number <= 0) {
		selector = 4;
	}
	else if ((number > 3 && number < 21) || number % 10 > 3) {
		selector = 0;
	}
	else {
		selector = number % 10;
	}

	return number + ['th', 'st', 'nd', 'rd', ''][selector];
};

const getMonthWord = (number) => {
	const monthNames = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December',
	];

	return monthNames[number];
};

exports.getOrdinalNum = getOrdinalNum;
exports.getMonthWord = getMonthWord;