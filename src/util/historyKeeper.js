const {
	doc, updateDoc, arrayUnion,
} = require('firebase/firestore');

const { db } = require('../util/initFirebase');

function addPointsHistory(user, issuer, action, oldValue, newValue) {
	const docRef = doc(db, 'users', user);

	updateDoc(docRef, {
		point_history: arrayUnion({
			timestamp: Math.floor(+new Date() / 1000),
			issuer,
			action,
			old: oldValue,
			new: newValue,
		}),
	})
		.catch((e) => {
			console.log(e);
		});
}

exports.addPointsHistory = addPointsHistory;