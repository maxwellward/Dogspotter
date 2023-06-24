const vision = require('@google-cloud/vision');

const visionClient = new vision.ImageAnnotatorClient();

async function detectDogs(url) {
	let count = 0;
	const [result] = await visionClient.objectLocalization(url);
	const objects = result.localizedObjectAnnotations;
	objects.forEach(object => {
		if (object.name === 'Dog') {
			count++;
		}
	});
	return count;
}

exports.detectDogs = detectDogs;