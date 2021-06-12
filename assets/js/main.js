$("#mainSearch").on("submit", function (event) {
  event.preventDefault();
  scrapUrl();
});

function scrapUrl() {
  var url1 = "https://opencorpus.herokuapp.com/api/scrappy/?url=https://www.theguardian.com/world/2021/jun/11/johnson-accused-of-hypocrisy-over-g7-girls-education-pledge";
  var url2 = "https://jsonplaceholder.typicode.com/posts";

  var settings = {
    url: url1,
    method: "GET",
    timeout: 0,
  };
  $.ajax(settings)
    .done(function (response, textStatus, request) {
      console.log(response)
    })
    .fail(function (request, status, error) {
      alert("Request failed");
    });
}
