module.exports = function (grunt) {
	grunt.registerTask('linkAssetsBuildProd', [
		'sails-linker:prodJsRelative',
		'sails-linker:prodStylesRelative',
		'sails-linker:devTpl',
    'sails-linker:prodJsJADE',
    'sails-linker:prodStylesJADE',
    'sails-linker:prodTplJADE'
	]);
};
