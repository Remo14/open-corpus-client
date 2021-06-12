$(function () {
  // VARIABLES
  var basicURL = "https://opencorpus.herokuapp.com/api/";
  var scrappedId = "";

  // EVENT LISTENERS

  /* Main search */
  $("#mainSearch").on("submit", function (e) {
    e.preventDefault();
    scrapUrl();
  });

  /* Main actions */
  $("#frequencyAction").on("click", function (e) {
    e.preventDefault();
    $("#myModal").modal("toggle");
    getFrequencies();
  });

  $("#taggerAction").on("click", function (e) {
    // TODO
    e.preventDefault();
    console.log("taggerAction");
  });

  $("#parserAction").on("click", function (e) {
    // TODO
    e.preventDefault();
    console.log("parserAction");
  });

  /* Modal */
  $("p.float-end").on("click", function () {
    $("#myModal").modal("toggle");
  });

  /* Main actions no draggable */
  $("a.no-draggable").on("dragstart", function (e) {
    return false;
  });

  function scrapUrl() {
    var scrappy = "scrappy/?url=";

    // https://www.theguardian.com/world/2021/mar/01/former-french-president-nicolas-sarkozy-sentenced-to-three-years-for-corruption
    var submitUrl = $("#mainSearch")
      .children("div.input-group")
      .children("input#websiteUrl")
      .val();

    if (submitUrl.includes("www.theguardian.com")) {
      var url = basicURL + scrappy + submitUrl;

      var settings = {
        url: url,
        method: "GET",
        timeout: 0,
      };
      $.ajax(settings)
        .done(function (response, textStatus, request) {
          scrappedId = response.data.scrappedId;
          console.log(response);
          renderScrappySection(response);
        })
        .fail(function (request, status, error) {
          alert("Request failed");
        });
    } else {
      alert("Website not supported yet");
    }
  }

  function renderScrappySection(response) {
    $("#cardMainContainer").removeClass("d-none");

    $("#mainCardTitle").html(response.data.title);
    $("#mainCardBody").html(response.data.body);

    // var template =
    //   "<div class='col'>" +
    //   "<div class='card'>" +
    //   "<div class='card-header d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start'>" +
    //   "<ul class='nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small'>            <li id='test'>              <a href='#'  class='nav-link text-secondary'>                <svg class='bi d-block mx-auto mb-1' width='24' height='24'><use xlink:href='#home'></use></svg>                Home              </a>            </li>            <li>              <a href='#' class='nav-link '>                <svg class='bi d-block mx-auto mb-1' width='24' height='24'><use xlink:href='#speedometer2'></use></svg>                Dashboard              </a>            </li>            <li>              <a href='#' class='nav-link '>                <svg class='bi d-block mx-auto mb-1' width='24' height='24'><use xlink:href='#table'></use></svg>                Orders              </a>            </li>            <li>              <a href='#' class='nav-link '>                <svg class='bi d-block mx-auto mb-1' width='24' height='24'><use xlink:href='#grid'></use></svg>                Products              </a>            </li>            <li>              <a href='#' class='nav-link '>                <svg class='bi d-block mx-auto mb-1' width='24' height='24'><use xlink:href='#people-circle'></use></svg>                Customers              </a>            </li>          </ul>" +
    //   // "<button type='button' class='btn btn-primary'>Primary</button>" +
    //   // "<a class='nav-link active' aria-current='page' href='#'>" +
    //   // "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-home'><path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'></path><polyline points='9 22 9 12 15 12 15 22'></polyline></svg>" +
    //   // "Dashboard" +
    //   // "</a>" +
    //   // "<a class='nav-link active' aria-current='page' href='#'>" +
    //   // "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-home'><path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'></path><polyline points='9 22 9 12 15 12 15 22'></polyline></svg>" +
    //   // "Dashboard" +
    //   // "</a>" +
    //   "</div>" +
    //   "<div class='card-body'>" +
    //   "<h5 class='card-title'>" +
    //   response.data.title +
    //   "</h5>" +
    //   "<p class='card-text text-justify'>" +
    //   response.data.body +
    //   "</p>" +
    //   "</div>" +
    //   "</div>" +
    //   "</div>";
    location.href = "#mainContainer";
  }
});
