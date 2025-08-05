var audio = new Audio('static/takedown.m4a');
audio.preload = "auto";
audio.loop = true;
audio.load();

$(".popup .button").on("click", function() {
    $(".warning").hide();
    audio.play();
});

function setPage(pageId) {
    $(".page").hide();
    $(`#${pageId}`).show()
}