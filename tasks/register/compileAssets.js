module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'clean:dev',
		'jst:dev',
    'copy:bootstrap',
		'less:dev',
    'clean:bootstrap',
		'copy:dev',
		'coffee:dev'
	]);
};
