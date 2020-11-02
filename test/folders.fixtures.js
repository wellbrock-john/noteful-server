function makeFoldersArray() {
	return [
		{
			folder_id: 1,
			folder_name: "Folder One",
		},
		{
			folder_id: 2,
			folder_name: "Folder Two",
		},
		{
			folder_id: 3,
			folder_name: "Folder Three",
		},
		{
			folder_id: 4,
			folder_name: "Folder Four",
		},
	];
}

function makeMaliciousFolder() {
	const maliciousFolder = {
		folder_id: 911,
		folder_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
	};
	const expectedFolder = {
		...maliciousFolder,
		folder_name:
			'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
	};
	return {
		maliciousFolder,
		expectedFolder,
	};
}

module.exports = {
	makeFoldersArray,
	makeMaliciousFolder,
};
