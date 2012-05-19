navigator.geolocation.getCurrentPosition(successCallback,
                                             errorCallback);

function successCallback(position) {
  get_temp(position.coords.latitude, position.coords.longitude);
}

function errorCallback(error) {
  alert(error);
}

function get_temp(lat, lon) {
  var host = "http://api.wunderground.com/api/63cd7cdddbf88f74/";
  var url = host + "conditions/q/" + lat + "," + lon + ".json";
  $.ajax({
    url: url,
    dataType: "jsonp",
    success: function(data) {
      present_temp(data["current_observation"]["temp_f"]);
    }
  });
}

function present_temp(temp_f) {
  var bottom_c = 50;
  var top_c = 80;
  if (cookieExists("cutoffs")) {
    var values = getCookie("cutoffs").split("|");
    bottom_c = values[0];
    top_c = values[1];
  }
  if (temp_f > top_c) {
    $("#all_the_output").html("Sweatshirts unnecessary");
  } else if (temp_f < bottom_c) {
    $("#all_the_output").html("Bring a real jacket");
  } else {
    $("#all_the_output").html("Might want a sweatshirt at this point");
  }
}


function update_range(slider_id, display_id) {
  $("#" + display_id).html($("#" + slider_id).val());
}

var getCookie = function (sKey) {
    if (!sKey || !cookieExists(sKey)) { return null; }
    return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));  
}

var cookieExists = function (sKey) { 
    return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
}

$(function() {
    $("#bottom_c").change(function() {
      update_range("bottom_c", "bottom_cutoff_display");
    });

    $("#top_c").change(function() {
      update_range("top_c", "top_cutoff_display");
    });

    // Set the sliders to the current cookie value
    if (cookieExists("cutoffs")) {
        var values = getCookie("cutoffs").split("|");
        $("#bottom_c").val(values[0]);
        $("#top_c").val(values[1]);
    }


    update_range("bottom_c", "bottom_cutoff_display");
    update_range("top_c", "top_cutoff_display");

    $("#settings_form").submit(function() {
      if (parseInt($("#top_c").val(), 10) < 
          parseInt($("#bottom_c").val(), 10)) {
        $("#validation").html("It can't be both too hot and too cold to wear sweatshirts!");
        return false;
      } else {
        return true;
      }
    });
});
