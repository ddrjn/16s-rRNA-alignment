export const colorByPosition = position => {
	//position is going to be between 300 and 800
	const lowerLimit = 300;
	const higherLimit = 800;
	const hue = Math.floor(((position - lowerLimit) / (higherLimit - lowerLimit)) * 360);
	return 'hsl(' + hue + ',60%,50%)';
};
