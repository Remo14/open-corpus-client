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

    enableTooltips();
    getFrequencies();
  });

  $("#taggerAction").on("click", function (e) {
    e.preventDefault();
    console.log("taggerAction");
    getTags();
  });

  $("#parserAction").on("click", function (e) {
    e.preventDefault();
    console.log("parserAction");
    getTree();
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
    var action = "scrappy";

    // https://www.theguardian.com/world/2021/mar/01/former-french-president-nicolas-sarkozy-sentenced-to-three-years-for-corruption
    var submitUrl = $("#mainSearch")
      .children("div.input-group")
      .children("input#websiteUrl")
      .val();

    if (submitUrl.includes("www.theguardian.com")) {
      var url = basicURL + action + "?url=" + submitUrl;

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
    location.href = "#mainContainer";
  }

  function getFrequencies() {
    var action = "frequency";
    var url = basicURL + action + "?scrappedId=" + scrappedId;

    var settings = {
      url: url,
      method: "GET",
      timeout: 0,
    };
    $.ajax(settings)
      .done(function (response, textStatus, request) {
        console.log(response);
        renderFrequencySection(response);
      })
      .fail(function (request, status, error) {
        alert("Request failed");
      });
  }

  function renderFrequencySection(response) {
    $("#myModal").children("div.modal-dialog").css("max-width", "80%");

    $("#myModalTitle").html(
      "<p style='margin-bottom: 0' href='#' class='nav-link link-dark no-draggable'>" +
        "<i style='margin-right: 6px;' class='bi bi-file-earmark-bar-graph mainIcons'></i>" +
        "Word Frequencies" +
        "</p>"
    );

    var i = 0;
    while (i < response.data.length) {
      var wordSize = response.data[i].frequency * 3 + 11;

      var wordElement =
        "<span data-bs-toggle='tooltip' data-bs-html='true' title data-bs-original-title='<b>" +
        response.data[i].frequency +
        "</b>'" +
        "style='font-size:" +
        wordSize +
        "px'>" +
        response.data[i].word +
        " </span>";
      $("#myModalBody").append(wordElement);
      i++;
    }

    enableTooltips();

    $("#myModal").modal("toggle");
  }

  function enableTooltips() {
    var tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  function getTags() {
    var action = "tagger";
    var url = basicURL + action + "?scrappedId=" + scrappedId;

    var settings = {
      url: url,
      method: "GET",
      timeout: 0,
    };
    $.ajax(settings)
      .done(function (response, textStatus, request) {
        console.log(response);
        renderTaggerSection(response);
      })
      .fail(function (request, status, error) {
        alert("Request failed");
      });
  }

  function renderTaggerSection(response) {
    // $("#myModal").children("div.modal-dialog").css("max-width", "80%");

    $("#myModalTitle").html(
      "<p style='margin-bottom: 0' href='#' class='nav-link link-dark no-draggable'>" +
        "<i style='margin-right: 6px;' class='bi bi-file-earmark-font mainIcons'></i>" +
        "POS Tagger" +
        "</p>"
    );

    var tableElement =
      "<table style='margin: 0 auto; width: 85%;' class='table table-sm table-bordered'>" +
      "<thead>" +
      "<tr>" +
      "<th scope='col'>Word</th>" +
      "<th style='text-align: center' scope='col'>POS Tag</th>" +
      "</tr>" +
      "</thead>" +
      "<tbody>";

    var tagsLegend = {
      CC: "coordinating conjunction",
      CD: "cardinal digit",
      DT: "determiner",
      EX: "existential there",
      FW: "foreign word",
      IN: "preposition/subordinating conjunction",
      JJ: "adjective",
      JJR: "adjective, comparative",
      JJS: "adjective, superlative",
      LS: "list marker",
      MD: "modal",
      NN: "noun, singular",
      NNS: "noun plural",
      NNP: "proper noun, singular",
      NNPS: "proper noun, plural",
      PDT: "predeterminer",
      POS: "possessive ending",
      PRP: "personal pronoun",
      PRP$: "possessive pronoun",
      RB: "adverb",
      RBR: "adverb, comparative",
      RBS: "adverb, superlative",
      RP: "particle",
      TO: "to",
      UH: "interjection",
      VB: "verb, base form",
      VBD: "verb, past tense",
      VBG: "verb, gerund/present participle",
      VBN: "verb, past participle",
      VBP: "verb, sing. present, non-3d",
      VBZ: "verb, 3rd person sing. present",
      WDT: "wh-determiner",
      WP: "wh-pronoun",
      WP$: "possessive wh-pronoun",
      WRB: "wh-abverb",
    };

    var i = 0;
    while (i < response.data.length) {
      tableElement +=
        "<tr>" +
        "<td>" +
        response.data[i][0] +
        "</td>" +
        "<td style='text-align: center' data-bs-placement='right' data-bs-toggle='tooltip' data-bs-html='true' title data-bs-original-title='<b>" +
        tagsLegend[response.data[i][1]] +
        "</b>'>" +
        response.data[i][1] +
        "</td>" +
        "</tr>";
      i++;
    }
    tableElement += "</tbody>" + "</table>";

    $("#myModalBody").html(tableElement);

    //     #   CC coordinating conjunction
    //     #   CD cardinal digit
    //     #   DT determiner
    //     #   EX existential there
    //     #   FW foreign word
    //     #   IN preposition/subordinating conjunction
    //     #   JJ adjective
    //     #   JJR adjective, comparative
    //     #   JJS adjective, superlative
    //     #   LS list marker
    //     #   MD modal
    //     #   NN noun, singular
    //     #   NNS noun plural
    //     #   NNP proper noun, singular
    //     #   NNPS proper noun, plural
    //     #   PDT predeterminer
    //     #   POS possessive ending
    //     #   PRP personal pronoun
    //     #   PRP$ possessive pronoun
    //     #   RB adverb
    //     #   RBR adverb, comparative
    //     #   RBS adverb, superlative
    //     #   RP particle
    //     #   TO to
    //     #   UH interjection
    //     #   VB verb, base form
    //     #   VBD verb, past tense
    //     #   VBG verb, gerund/present participle
    //     #   VBN verb, past participle
    //     #   VBP verb, sing. present, non-3d
    //     #   VBZ verb, 3rd person sing. present
    //     #   WDT wh-determiner
    //     #   WP wh-pronoun
    //     #   WP$ possessive wh-pronoun
    //     #   WRB wh-abverb
    enableTooltips();
    $("#myModal").modal("toggle");
  }

  function getTree() {
    var action = "parser";
    var url = basicURL + action + "?scrappedId=" + scrappedId;

    var settings = {
      url: url,
      method: "GET",
      timeout: 0,
    };
    $.ajax(settings)
      .done(function (response, textStatus, request) {
        console.log(response);
        renderParserSection(response);
      })
      .fail(function (request, status, error) {
        alert("Request failed");
      });
  }

  function renderParserSection(response) {
    $("#myModal").children("div.modal-dialog").css("max-width", "80%");

    $("#myModalTitle").html(
      "<p style='margin-bottom: 0' href='#' class='nav-link link-dark no-draggable'>" +
        "<i style='margin-right: 6px;' class='bi bi-file-earmark-richtext mainIcons'></i>" +
        "Syntax Parser" +
        "</p>"
    );

    var tableElement =
      "<table id='parserTable' style='margin: 0 auto; width: 85%;' class='table table-sm table-bordered'>" +
      "<thead>" +
      "<tr>" +
      "<th scope='col'>Sentence</th>" +
      "<th style='text-align: center' scope='col'>Tree</th>" +
      "</tr>" +
      "</thead>" +
      "<tbody>";

    var i = 0;
    while (i < response.data.length) {
      tableElement +=
        "<tr>" +
        "<td>" +
        response.data[i].sentence +
        "</td>" +
        "<td style='text-align: center; vertical-align: middle;'>" +
        "<button type='button' class='btn btn-primary'>Show</button>" +
        "<div style='display:none'>" +
        response.data[i].tree +
        "</div>";
      "</td>" + "</tr>";
      i++;
    }
    tableElement += "</tbody>" + "</table>";

    $("#myModalBody").html(tableElement);

    $("#parserTable").on("click", function (e) {
      console.log(e.target.nextSibling.children);
    });

    $("#myModal").modal("toggle");
  }
});

/* <table class="table table-sm table-bordered">
          <thead>
          <tr>
            <th scope="col" style="
    width: 85%;
">Sentence</th>
            <th style="text-align: center;" scope="col">Syntax Tree</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Otto</td>
            <td style="text-align: center;"><button type="button" class="btn btn-primary">Show</button></td>
          </tr>
          </tbody>
        </table> */
