function initLoginSysteem() {

	var coockieval = getCookie();

	if(coockieval != '') {
		$("#aanmelden").html("Aangemeld als: " + coockieval);
		$("#spotifynaam").val(coockieval);
		$("#bevestigen").html('Vergeet me');
	}

	$("#aanmelden").click(function(evt) {
		$("#Loginformulier").css('display', 'block');
		evt.preventDefault();
	});

	$("#annuleren").click(function() {
		$("#Loginformulier").css('display', 'none');
	});

	$("#bevestigen").click(function() {
		var naam = $("#spotifynaam").val();

		if(coockieval == '') {
			if (naam != '') {
				document.cookie = 'spotifynaam=' + naam + '; Path=/';
        		location.reload();
    		}
    	} else {
    		document.cookie = 'spotifynaam=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    		location.reload();
    	}

    	$("#Loginformulier").css('display', 'none');
	});

	$("main").css("min-height", $(window).height() - 152 + "px");
}

function getCookie(cname) {

    var name = "spotifynaam=";
    var ca = document.cookie.split(';');

    for(var i = 0; i < ca.length; i++) {

        var c = ca[i];
        
        while (c.charAt(0) == ' ') {
        	c = c.substring(1);
        }

        if (c.indexOf(name) == 0) {
        	return c.substring(name.length, c.length);
	    }
	}

    return "";
}