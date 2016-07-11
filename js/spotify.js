$(document).ready(function () {
    init();
});

function init() {

    $("#query").keyup(function(){
        $.ajax({
            url: "https://api.spotify.com/v1/search?q=" + $("#query").val() + "&type=artist",
            success: function (data) {

                plaatsArtisten(data);
            },
            error: function (data){
                $("#result").append("<p class='text-danger lead text-center'>Het lijkt erop dat Spotify tijdelijk off-line is.<br/>Onze excuses voor het ongemak. Probeer het over enkele ogenbliken opnieuw</p>");
            }
        });
    });

    $("body").on("click", ".artist", function() {

        window.location.href = "songs.html?artist=" + this.id;
    });

    initLoginSysteem();
}

function plaatsArtisten (data){
    var lengte = data.artists.items.length;

    $("#resultaten").empty();

    for (var i = 0; i < lengte; i++){

        var img = "assets/images/ongekend persoon.png";
        var style = "height: 100px";

        var sterren = "<p><span class='fa fa-star'></span>";
        var populair = data.artists.items[i].popularity;

        if (populair > 20) {
            sterren += "<span class='fa fa-star'></span>"
        }

        if (populair > 40) {
            sterren += "<span class='fa fa-star'></span>"
        }
        if (populair > 60) {
            sterren += "<span class='fa fa-star'></span>"
        }
        if (populair > 80) {
            sterren += "<span class='fa fa-star'></span>"
        }

        if (populair >= 100) {
            sterren += "<span class='fa fa-star'></span>"
        }

        sterren += "</p>";

        if(data.artists.items[i].images.length != 0){

            img = data.artists.items[i].images[0].url;

            if (data.artists.items[i].images[0].height >= data.artists.items[i].images[0].width){
                style = "width:100px";
            }
        }

        $("#resultaten").append(
            "<div class='clearfix col-md-4 col-lg-4 col-sm-6 col-xs-12 artist-outer'>" +
                "<div class='artist' id='" + data.artists.items[i].id + "'>" +
                    "<div class='artist-info'>" +
                        "<div class='img-wrapper'>" +
                            "<img style='" + style + "' src='" + img + "'/>" +
                        "</div>" +
                        "<p class='naam'><b>" + data.artists.items[i].name + "</b></p>" +
                        sterren +
                        "<p>Volgers op Spotify: " + data.artists.items[i].followers.total + "</p>" +
                    "</div>" +
                "</div>" +
            "</div>"
        );
    }
}

function toonNummers(artist){

    console.log(artist);
}



//https://api.spotify.com/v1/search?q=netsky&type=artist