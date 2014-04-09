module.exports = function (grunt) {
	grunt.registerTask('syncAssets', [
		'jst:dev',
    'copy:bootstrap',
		'less:dev',
    'clean:bootstrap',
		'sync:dev',
		'coffee:dev'
	]);
};
