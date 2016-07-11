var artistID = "";
var nr = 1;
var naam = "";
var audio = new Audio();


$(document).ready(function () {
    init();
});

function init() {

    artistID = getUrlVars()["artist"];
    
    doAjaxVoorArtist("https://api.spotify.com/v1/artists/" + artistID);
    doAjaxVoorAlbums("https://api.spotify.com/v1/artists/" + artistID + "/albums?limit=50&album_type=single,album");
    doAjaxVoorTop("https://api.spotify.com/v1/artists/" + artistID + "/top-tracks?country=be");

    $("body").on("click", ".play-button", function() {

        audio.src = this.id;
        audio.pause();
        audio.play();
    });

    $("body").on("click", "#toevoegen", function() {

        if ($("#opslaanSpotifynaam:checked").length === 1) {
            document.cookie = 'spotifynaam=' + $("#gebruiker").val() + '; Path=/';
        }

        $.ajax({
            url: "https://api.spotify.com/v1/users/" + $("#gebruiker").val() + "/playlists/" + $("#afspeelijst").val() + "/tracks?uris=" + $("#spelendLiedId").eq(0).val(),
            headers: {
                Authorization: "Bearer BQDxoRNPoLq4IYWxJnJ0nXAUg4ti0inQ2hI-ak9fuS89D9InmJoPF80TPMKfNW10xAlI8leeyCGH25o3dNsAtDOEMEMutUrQLLT_y7z3afO_Kv_ij4EslnIV5w2jrHMFLGic7uWkhAdiwGOp7EVoTV4UMSp_Bs-d-RqKvieE84gXl3avB_uB1ULppjAE58AUyCJCslmUgd3HgaGd217ve2jHtsCwEP0NyZxRpzt3GnhLm5g-YvpCm4GSbOyf4N_4MrdML82HCDxJDww8JMZimFx91XBa6vSRT1O9fVM8OUM"            
            },
            Host: "api.spotify.com",
            Accept: "application/json",
            type: "POST",
            success: function (data){
                $("#toevoegeninfo").html('Het nummer werd toegevoegd aan uw  afspeellijst.');
            },
            error: function (data) {
                $("#toevoegeninfo").html('Er is een fout opgetreden tijdens het toevoegen.');
            }
        });
    });

    $("body").on("focus", "#afspeelijst", function () {
        
        $.ajax({
            url: "https://api.spotify.com/v1/users/" + $("#gebruiker").val() + "/playlists",
            headers: {
                Authorization: "Bearer BQDxoRNPoLq4IYWxJnJ0nXAUg4ti0inQ2hI-ak9fuS89D9InmJoPF80TPMKfNW10xAlI8leeyCGH25o3dNsAtDOEMEMutUrQLLT_y7z3afO_Kv_ij4EslnIV5w2jrHMFLGic7uWkhAdiwGOp7EVoTV4UMSp_Bs-d-RqKvieE84gXl3avB_uB1ULppjAE58AUyCJCslmUgd3HgaGd217ve2jHtsCwEP0NyZxRpzt3GnhLm5g-YvpCm4GSbOyf4N_4MrdML82HCDxJDww8JMZimFx91XBa6vSRT1O9fVM8OUM"
            },
            Host: "api.spotify.com",
            Accept: "application/json",
            type: "GET",
            success: function (data){

                var aantal = data.items.length;
                $('#afspeelijst').empty();

                for (var i = 0; i < aantal; i++) {
                    $("#afspeelijst").append('<option value="' + data.items[i].id + '">' + data.items[i].name + '</option>');
                }
            },
            error: function (data) {

                $("#afspeelijst").empty().append("<option>Het lijkt erop dat Spotify tijdelijk off-line is.</option>");
            }
        });
    });

    $("body").on("click", ".youtube-button", function () {

        audio.pause();

        var zoekfunctie = this.dataset.naam + " " + this.dataset.nummer;
        var spotifyId = this.dataset.spotifyid;

        $.ajax({
            url: "https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyCfQuj6dJx5icIdmcTf7se7ujp4YgesGao&q=" + zoekfunctie,
            success: function (data) {

                var deFrame = $(".video");
                deFrame.css("display", "block");
                deFrame.empty();
                deFrame.append('<div class="margin-bottom-sm">' +
                                    '<button class="sluiten btn btn-default">' +
                                        '<span class="fa fa-times"></span> Sluiten' +
                                    '</button>' +
                                '</div>' +
                                '<input type="hidden" id="spelendLiedId" value="' + spotifyId + '"/>' +
                                '<div class="input-group margin-bottom-sm">' +
                                    '<label for="gebruiker" class="input-group-addon" >Gerbuikersnaam:</label>' +
                                    '<input id="gebruiker" class="form-control" value="' + getCookie() + '" type="text"/>' +
                                '</div>' +
                                '<div class="input-group margin-bottom-sm">' +
                                    '<label for="afspeelijst" class="input-group-addon">Afspeellijst:</label>' +
                                    '<select id="afspeelijst" class="form-control"></select>' +
                                '</div>' +
                                '<button class="btn btn-default margin-bottom-sm" id="toevoegen">Toevoegen aan afspeelijst op Spotify</button>' +
                                '<div class="input-group margin-bottom-sm float-right">' +
                                    '<label for="opslaanSpotifynaam">Gerbuikersnaam opslaan?</label>' +
                                    '<input id="opslaanSpotifynaam" type="checkbox" />' +
                                '</div>' +
                                '<p id="toevoegeninfo"></p>' +
                                '<hr/>' +
                                '<iframe class="col-md-8 col-sm-12 col-xs-12 col-md-offset-2" src="https://www.youtube.com/embed/' + data.items[0].id.videoId + '?autoplay=1" frameborder="0" allowfullscreen ></iframe>');
            },
            error: function() {
                console.log("oops");
            }
        });
    });

    $("body").on("click", ".sluiten", function() {
        $(".video").css("display", "none");
        $(".video iframe")[0].src = "";
    });

    initLoginSysteem();
}

function doAjaxVoorArtist(deUrl){
    $.ajax({
        url:  deUrl,
        Accept: "application/json",
        success: function (data){
            plaatsArtist(data);
        },
        error: function (data) {
            $("#result").append("<p class='text-danger lead text-center'>Het lijkt erop dat Spotify tijdelijk off-line is.<br/>Onze excuses voor het ongemak. Probeer het over enkele ogenbliken opnieuw</p>");
        }
    });
}

function plaatsArtist(data){

    $('title').html(data.name);

    var artistenVelden = $(".naam-artist");
    var artistenVeldenLengte = artistenVelden.length;
    naam = data.name;

    for (var i = 0; i < artistenVeldenLengte; i++) {
        artistenVelden[i].innerHTML = data.name;
    }

    if ( data.images.length > 0){
        $(".header-image").css({"background-image": "url('" + data.images[0].url + "')"});
    }
}

function doAjaxVoorAlbums(deUrl){
    $.ajax({
        url:  deUrl,
        Accept: "application/json",
        success: function (data){
            plaatsAlbums(data);
        },
        error: function (data) {
            $("#result").append("<p class='text-danger lead text-center'>Het lijkt erop dat Spotify tijdelijk off-line is.<br/>Onze excuses voor het ongemak. Probeer het over enkele ogenbliken opnieuw</p>");
        }
    });
}

function doAjaxVoorTracks(deUrl){
    $.ajax({
        url: deUrl,
        Accept: "application/json",
        success: function (data){
            plaatsNummers(data);
        },
        error: function (data) {
        }
    });
}

function doAjaxVoorTop(deUrl){
    $.ajax({
        url: deUrl,
        Accept: "application/json",
        success: function (data){
            plaatsTop(data);
        },
        error: function (data) {
        }
    });
}

function plaatsAlbums(data){

    var aantal = data.items.length;

    for (var i = 0; i < aantal; i++){

        $("#result").append(
            "<div id='" + data.items[i].id + "'>" +
                "<div class='album'>" +
                    "<div class='img-wrapper'>" +
                        "<img src='" +  data.items[i].images[0].url + "' width='100px'/>" +
                    "</div>" +
                    "<p><b>" + data.items[i].name + "</b></p>" +
                    "<p class='uitgavedatum'></p>" +
                "</div>" +
                "<div class='clearfix'></div>" +
                "<div class='nummers'></div>" +
                "<hr/>" +
            "</div>"
        );

        doAjaxVoorTracks(data.items[i].href);
    }

    if (data.next != null ){
        doAjax(data.next)
    }
}

function plaatsNummers(data){

    $("#" + data.id + " .uitgavedatum").html("Jaar van uitgave: " + data.release_date);

    var tabel = maakTabel(data.tracks.items);

    $("#" + data.id + " .nummers").append(tabel);
}

function plaatsTop(data){

    var aantal = data.tracks.length;
    var tabel = maakTabel(data.tracks);
    $("#top").append(tabel);
    $(".top-aantal")[0].innerHTML = aantal;
    var ctx = $("#graph")[0].getContext("2d");
    var labels = [];
    var dataValue = [];

    for(var i = 0; i < aantal; i++){
        labels.push(data.tracks[i].name);
        dataValue.push(data.tracks[i].popularity);
    }

    var chartData = {
        labels: labels,
        datasets: [
            {
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,0.8)",
                highlightFill: "rgba(151,187,205,0.75)",
                highlightStroke: "rgba(151,187,205,1)",
                data: dataValue
            }
        ]
    };

    new Chart(ctx).Bar(chartData, {
        barShowStroke: false
    });
    //var myBarChart = new Chart(ctx).Bar(chartData, options);
}

function maakTabel(lijst){
    var trackList = "<div class='table-responsive'><table cellpadding='10px' class='table table-striped'><tr><th class='smalle-kolom'>#</th><th class='smalle-kolom'><span class='fa fa-spotify fa-2x'></span></th><th class='smalle-kolom'><span class='fa fa-youtube fa-2x'></span></th><th>Titel</th><th>Duur</th></tr>";
    //var tracksVanAlbum = doAjaxVoorTracks(data.albums.items[i].href);
    var aantalTracksVanAlbum = lijst.length;
    var nummer = 1;

    for (var it = 0; it < aantalTracksVanAlbum; it++) {

        var min = Math.floor((lijst[it].duration_ms / 1000) / 60);
        var sec = Math.round((lijst[it].duration_ms / 1000) - min * 60);

        trackList += "<tr class='song'>" +
            "<td class='smalle-kolom'>" + (nummer++) + "</td>" +
            "<td class='smalle-kolom'>" +
            "<abbr title='Speel 30 seconden van Spotify.'><span class='fa-stack fa-lg aling-left play-button' id='" + lijst[it].preview_url + "'><span class='fa fa-circle-o fa-stack-2x'></span><span class='fa fa-play fa-stack-1x' style='margin: 1px'></span></span></abbr>" +
            "</td><td class='smalle-kolom'>" +
            "<div title='Speel voledig nummer op YouTube.' class='youtube-button' data-spotifyId='" + lijst[it].uri + "' data-naam='" + naam + "' data-nummer='" + lijst[it].name + "'><span class='fa-stack fa-lg aling-left youtube-button' id='" + lijst[it].preview_url + "'><span class='fa fa-circle-o fa-stack-2x'></span><span class='fa fa-youtube fa-stack-1x'></span></span></div>" +
            "</td><td class='title'>" +
            "<p>" + lijst[it].name + "</p>" +
            "</td>" +
            "<td>" + min + ":" + ("0" + sec).slice(-2) + "</td>" +
            "</tr>";
    }

    trackList += "</table></div>";

    return trackList;
}

//https://api.spotify.com/v1/search?q=Kabouter+Plop&type=album&limit=50
//https://api.spotify.com/v1/search?q=Kabouter+Plop&type=track&limit=50

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0].replace("%20", " "));
        vars[hash[0]] = hash[1].replace("%20", " ");
    }
    return vars;
}
