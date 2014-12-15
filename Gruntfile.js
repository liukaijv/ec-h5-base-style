module.exports = function(grunt) {
	grunt.initConfig({		
		//文件合并
		concat: {
			// options: {
			// 	separator: '' //文件分隔 
			// },	
			// // 基础公共
			// basic: {
			// 	src: ['js/h5core.js'],
			// 	dest: 'js/basic.js',
			// },
			// // 包括页面级
			// extras: {
			// 	src: ['js/h5core.js'],
			// 	dest: 'js/advence.js',
			// },
			// // 测试用，包括所有
			// demo: {
			// 	src: ['js/h5core.js'],
			// 	dest: 'js/main.js',
			// }
		},
		// less 2 css
		less: {
			// 编译到测试项目
			development: {
				options: {
				  paths: ["less"]
				},
				files: {
					// 手机网站基础样式					
					"css/core.css": "less/core.less",
					"css/font-awesome.css": "font-awesome/font-awesome.less",
					// // 手机网站前台样式
					// "css/h5pages.css": "less/h5pages.less",
					// // 会员中心
					// "css/h5center.css": "less/h5center.less",
					// template 模板
					// "css/template/template01.css": "less/template/template01.less"		    
				}
			},
			// 编译到工程项目
			// production: {
			// 	options: {
			// 		paths: ["less"],
			// 		cleancss: true		    
			// 	},
			// 	files: {
			// 		"../../04/08/Styles/template.css": "less/template01.less",
			// 		"../../04/09/Styles/template.css": "less/template02.less",
			// 		"../../04/10/Styles/template.css": "less/template03.less",
			// 		"../../04/11/Styles/template.css": "less/template04.less"
			// 	}
			// }
		}	
	});
	//load任务	
	grunt.loadNpmTasks('grunt-contrib-concat');	
	grunt.loadNpmTasks('grunt-contrib-less');		
	// 调用任务
	grunt.registerTask('buildcss', [ 'less' ]);
	grunt.registerTask('buildjs', [ 'concat' ]);
	grunt.registerTask('buildall', [ 'less','concat' ]);
} 