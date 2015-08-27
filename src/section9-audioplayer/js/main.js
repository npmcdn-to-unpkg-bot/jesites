var audio;

//Hide pause
$('#pause').hide();

//Init with the first song
initAudio($('#playlist li:first-child'));

function initAudio(element) {
    var song = element.attr('song');
    var cover = element.attr('cover');
    var artist = element.attr('artist');
    var title = element.text();

    //Create audio object
     audio = new Audio("media/"+ song);

    //Insert audio info
    $('.artist').text(artist);
    $('.title').text(title);

    //Insert song cover
    $('img.cover').attr('src','images/covers/'+cover);

    $('#playlist li').removeClass('active');

    element.addClass('active');
}


$('#play').click(
    function() {
        audio.play();
        $('#play').hide();
        $('#pause').show();
        showDuration();
    }
);

$('#pause').click(
    function() {
        audio.pause();
        $('#play').show();
        $('#pause').hide();
    }
);

$('#stop').click(
    function() {
        audio.pause();
        audio.currentTime = 0;
    }
);

$('#next').click(
    function() {
        audio.pause();
        var next = $('#playlist li.active').next();
        if(next.length == 0) {
            next = $('#playlist li:first-child');
        }

        initAudio(next);

        audio.play();

        showDuration();
    }
);


$('#prev').click(
    function() {
        audio.pause();
        var prev= $('#playlist li.active').prev();
        if(prev.length == 0) {
            prev = $('#playlist li:first-child');
        }

        initAudio(prev);

        audio.play();

        showDuration();
    }
);

//Playlist song click
$('#playlist li').click(
    function() {
        audio.pause();
        initAudio($(this));

        $('#play').hide();
        $('#pause').show();


        audio.play();
        showDuration();

    }
);


$('#volume').change(function() {
    audio.volume = parseFloat(this.value / 10);
});

//Time / Duration
function showDuration() {
    //$(audio).bind('timeUpdate', function() {
    audio.addEventListener('timeupdate', function() {
       //Get hours and minutes
        var s = parseInt(audio.currentTime % 60);
        var m = parseInt(audio.currentTime / 60) % 60;

        if(s < 10) {
            s = '0' + s;
        }

        $('#duration').html(m + ":" + s);

        var value=0;

        if(audio.currentTime > 0) {
            value = Math.floor((100 / audio.duration) * audio.currentTime);
        }

        $('#progress').css('width', value + '%');
    });
}