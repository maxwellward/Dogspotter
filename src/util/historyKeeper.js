const {
	doc, updateDoc, arrayUnion,
} = require('firebase/firestore');

const { db } = require('../util/initFirebase');

function addScoreistory(user, issuer, action, scoreChange) {
	const docRef = doc(db, 'users', user);

	updateDoc(docRef, {
		point_history: arrayUnion({
			timestamp: Math.floor(+new Date() / 1000),
			issuer,
			action,
			scoreChange,
		}),
	})
		.catch((e) => {
			console.error(e);
		});
}

exports.addScoreHistory = addScoreistory;