var gulp = require('gulp');
var ftp = require('vinyl-ftp');
var connect = require('gulp-connect');
var prompt = require('gulp-prompt');
var gutil = require('gulp-util');
var fs = require('fs');
var path = require('path');

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function(file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

function buildItemLinks(linkArray) {
    var result = "<ul>";

    for (var i = 0, len = linkArray.length; i < len; i++) {
        result += '<li >' +
        '<a href="'+linkArray[i]+'">'+linkArray[i]+'</a>'+
        '</li>\n';
    }

    result += "</ul>\n";

    return result;


}

function buildHtmlItem(srcItem) {
    var siteDataJSON = srcItem;
    var result = "TODO#"+srcItem;

    try {

        siteDataJSON = fs.readFileSync("./src/"+srcItem+'/site-data.json' , "utf8");
        siteDataJSON = JSON.parse(siteDataJSON);

        result = '<ul class="details">';
        result += '<li><a href="src/'+srcItem+'">Live demo</a></li>';
        result += '<li>Title: '+siteDataJSON.title+'</li>';
        result += '<li>Description: '+siteDataJSON.description+'</li>';
        result += '<li>Links: '+buildItemLinks(siteDataJSON.links)+'</li>';
        result += '</ul>';

    } catch (e) {
        if(e.code === 'ENOENT') {
            console.log('File not found!', srcItem);
        } else {
            throw e;
        }
    }

    console.log(result);

    return result;
}


function buildHtmlList(list) {
    var result = "<ul class='accordion' data-accordion>\n";

    for (var i = 0, len = list.length; i < len; i++) {
        result += '<li class="accordion-navigation">' +
                        '<a href="#panel'+i+'">'+list[i]+'</a>'+
                        '<div id="panel'+i+'" class="content">'+ buildHtmlItem(list[i]) + '</div>' +
                    '</li>\n';
    }

    result += "</ul>\n";

    return result;
}

// Read site projects and build index.html.tpl
gulp.task('generate-catalog', function(cb) {
    var folders = getFolders('src');
    console.log("Generating index.html.tpl for catalog" , folders);

    var htmlList = buildHtmlList(folders);

    var content = fs.readFileSync("./index.html.tpl", "utf8");
    content = content.replace('@PROJECT-LIST', htmlList);

    return fs.writeFile('index.html', content, cb);
});

gulp.task('deploy:src', function () {
    return gulp.src('/')//it may be anything
        .pipe(prompt.prompt({
            type: 'password',
            name: 'pass',
            message: 'Please enter your password'
        }, function(res){

            var conn = ftp.create( {
                host:     'www.jesidea.com',
                user:     'jesidea.com',
                password: res.pass,
                parallel: 10,
                log:      gutil.log
            } );

            var globs = ['src/**/*.*',
                        '!src/**/*.zip',
                        '!src/**/*.psd',
                        '!src/**/*.mp3'];

            // using base = '.' will transfer everything to /public_html correctly
            // turn off buffering in gulp.src for best performance
            return gulp.src( globs, { buffer: false } )
                .pipe( conn.newer( '/jesites/src' ) ) // only upload newer files
                .pipe( conn.dest( '/jesites/src' ) );

        }));
});

gulp.task('deploy:site', function () {
    return gulp.src('/')//it may be anything
        .pipe(prompt.prompt({
            type: 'password',
            name: 'pass',
            message: 'Please enter your password'
        }, function(res){

            var conn = ftp.create( {
                host:     'www.jesidea.com',
                user:     'jesidea.com',
                password: res.pass,
                parallel: 10,
                log:      gutil.log
            } );

            //var globs = 'src/index.html';

            var globs = ['index.html',
                        '**/*.*',
                        '!src/**/*.*',
                        '!**/*.zip'];

            // using base = '.' will transfer everything to /public_html correctly
            // turn off buffering in gulp.src for best performance
            return gulp.src( globs, { buffer: false } )
                .pipe( conn.newer( '/jesites' ) ) // only upload newer files
                .pipe( conn.dest( '/jesites' ) );

        }));
});


// The default task (called when you run `gulp` from cli)
//gulp.task('default', ['generate-catalog', 'deploy:site']);