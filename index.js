var audio = new Audio('static/takedown.m4a');
audio.preload = "auto";
audio.loop = true;
audio.load();

$(audio).on("timeupdate", function() {
    let progress = Math.round(audio.currentTime / audio.duration * 100);
    $(".progressbar").css("width", `${progress}%`);
});

$(".popup .button").on("click", function() {
    $(".warning").hide();
    audio.play();

    $(".player").css("height", `${$('.titlebar').outerHeight()}px`);
    $(".play img").attr("src", "static/pause.png");
});

let currstep = 0;
let steps = [[-30, 30], [0, 60], [30, 30], [0, 0]];
$(".play").on("mouseenter", function() {
    if (!audio.paused && currstep < steps.length) {
        let step = steps[currstep];
        $(".play").css("margin-top", `${step[0]}px`);
        $(".play").css("margin-right", `${step[1]}px`);
        currstep += 1;
    }
});

$(".play").on("click", function() {
    if (audio.paused) {
        audio.play();
        $(".play img").attr("src", "static/pause.png");
    } else {
        audio.pause();
        $(".play img").attr("src", "static/play.png");
    }
    currstep = 0;
});

function setPage(pageId) {
    $(".page").hide();
    $(`#${pageId}`).show()
}