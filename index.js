var audio = new Audio('https://files.catbox.moe/autun1.m4a');
audio.preload = "auto";
audio.loop = true;
audio.load();

$(audio).on("timeupdate", function() {
    let progress = Math.round(audio.currentTime / audio.duration * 100);
    $(".progressbar").css("width", `${progress}%`);
});

$(audio).on("canplaythrough", function() {
    $(".popup .button").on("click", function() {
        $(".warning").hide();
        audio.play();

        $(".player").css("height", `${$('.titlebar').outerHeight()}px`);
        $(".play img").attr("src", "static/pause.png");
    });
});

let currstep = 0;
let steps = [[-30, 30], [0, 60], [30, 30], [0, 0]];
function trolling() {
    if (!audio.paused && currstep < steps.length) {
        let step = steps[currstep];
        $(".play").css("margin-top", `${step[0]}px`);
        $(".play").css("margin-right", `${step[1]}px`);
        currstep += 1;
    }
}
$(".play").on("mouseenter", trolling);
$(".play").on("touchstart", trolling);

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

let activePage = "lyrics";
let scrolling = false;
function setPage(pageId) {
    if (activePage != pageId) {
        $(".content").animate({
            scrollTop: $(`#${pageId}`).offset().top + $(".content").scrollTop() - $(".content").offset().top
        }, 1000, 'easeInOutCubic', function() {
            scrolling = false;
        });
        activePage = pageId;
        $(".link").removeClass("active");
        $(`.link a[href='#${pageId}']`).parent().addClass("active");
    }
}

$(".mywebsite").attr("href", window.location.origin);

function scrollPages(deltaY) {
    let elem = $($(".link.active a").attr("href"));
    if (elem.scrollTop() != scrollTops[elem.attr("id")]) {
        scrollTops[elem.attr("id")] = elem.scrollTop();
    } else if (!scrolling) {
        let pages = Object.keys(scrollTops);
        let pageIdx = pages.indexOf(elem.attr("id"));
        let newPageIdx = pageIdx;
        if (deltaY > 0 && pageIdx + 1 < pages.length && Math.abs(Math.floor(elem.scrollTop() + elem.outerHeight() - elem.prop("scrollHeight"))) < 2) {
            newPageIdx = pageIdx + 1;
            setPage(pages[newPageIdx]);
            scrolling = true;
        } else if (deltaY < 0 && pageIdx > 0 && elem.scrollTop() === 0) {
            newPageIdx = pageIdx - 1;
            setPage(pages[newPageIdx]);
            scrolling = true;
        }
        if (newPageIdx != 0) {
            $("html, body").css("overscroll-behavior", "none");
        } else {
            $("html, body").css("overscroll-behavior", "initial");
        }
    }
}

scrollTops = {}
$(".page").each(function(_, e) {
    let elem = $(e);
    scrollTops[elem.attr("id")] = 0;
})

let updating = false;
$(".page").on("wheel", function (e){
    if (!updating) {
        updating = true;
        scrollPages(e.originalEvent.deltaY);
        updating = false;
    }
});

let touch = null;
$(".page").on("touchstart", function(e) {
    if (!scrolling) {
        touch = e.originalEvent.changedTouches[0].screenY;
    }
});
$(".page").on("touchmove", function(e) {
    if (!scrolling) {
        let newTouch = e.originalEvent.changedTouches[0].screenY;
        let deltaY = touch - newTouch;
        if (Math.abs(deltaY) > 50) {
            scrollPages(deltaY);
            touch = null;
        }
    }
});