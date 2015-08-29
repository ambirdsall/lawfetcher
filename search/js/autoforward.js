// If 'autoforward' has a truthy value, forward window appropriately
localforage.getItem('autoforward', function(err, value) {
  if (err) {
    console.log(err);
  } else if (value) {
    var linkToPreferredService = $("#link--" + value + "__a");
    window.location.href = linkToPreferredService.attr("href");
  }
});

// set 'autoforward' to preferred service if the corresponding radio button is
// checked
$(".link a").click(function(e) {
  var checked = $(this).siblings().find("input").is(":checked");

  if (checked) {
    var linkId = $(this).attr('id'),
        service;

    // the terminal [0] accesses the matching string, setting `service` to the
    // actual matching service identifier, rather than its surrounding array
    service = (
        linkId.match(/lexis/)          ||
        linkId.match(/westlaw/)        ||
        linkId.match(/ravel/)          ||
        linkId.match(/google-scholar/) ||
        linkId.match(/google/) // /google/ must ALWAYS follow /google-scholar/
    )[0]

    localforage.setItem('autoforward', service, function(err, value){
      if (err) {
        console.log("dang it, there was an error");
      } else {
        console.log(value)
      }
    })
  }
});
