$(function () {
  // VARIABLES
  var basicURL = "https://opencorpus.herokuapp.com/api/";
  var scrappedId = "";

  // EVENT LISTENERS

  /* Main search */
  $("#mainSearch").on("submit", function (e) {
    e.preventDefault();
    popoverEraser(0);
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

    var bodyRaw = response.data.body;

    // bodyRaw = bodyRaw.replace(".", " .");
    // bodyRaw = bodyRaw.replace(",", " ,");
    // bodyRaw = bodyRaw.replace("”", " ” ");
    // bodyRaw = bodyRaw.replace("’", " ’ ");

    // bodyRaw = bodyRaw.replace("\n", " <br> ");

    bodyArray = bodyRaw.split(" ");

    var elementContainer = "";
    var i = 0;

    while (i < bodyArray.length) {
      elementContainer +=
        "<span data-bs-container='body'" +
        "data-bs-toggle='popover'" +
        "data-bs-placement='top'" +
        "data-bs-html='true'" +
        "data-bs-content='<div class=concordanceBtn><span>Concordance </span> <span class=popoverSpan>></span></div><hr class=popoverHR><div class=ngramBtn><span>Lexical Bundle </span> <span class=popoverSpan> ></span></div>'" +
        "data-bs-original-title=''" +
        "title=''" +
        "class='fw-light'>" +
        bodyArray[i] +
        " </span>";
      i++;
    }

    $("#mainCardBody").html(elementContainer);

    enablePopovers();

    $("#mainCardBody").on("click", function (e) {
      if (e.target.tagName === "SPAN") {
        clickedWord = e.target.textContent;
        $("div.concordanceBtn").on("click", function (e) {
          getConcordance(clickedWord);
        });
        $("div.ngramBtn").on("click", function (e) {
          getNgram(false, clickedWord);
        });
        popoverEraser(1);
      }
    });
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
    $("#mainModalBody").empty();

    $("#mainModal").children("div.modal-dialog").css("max-width", "80%");

    $("#mainModalTitle").html(
      "<h5><p style='margin-bottom: 0' href='#' class='nav-link link-dark no-draggable'>" +
        "<i style='margin-right: 6px;' class='bi bi-file-earmark-bar-graph mainIcons'></i>" +
        "Word Frequencies" +
        "</p></h5>"
    );

    var i = 0;
    while (i < response.data.length) {
      var wordSize = response.data[i].frequency * 4 + 11;

      var wordElement =
        "<span data-bs-toggle='tooltip' data-bs-html='true' title data-bs-original-title='<b>" +
        response.data[i].frequency +
        "</b>'" +
        "style='font-size:" +
        wordSize +
        "px'>" +
        response.data[i].word +
        " </span>";
      $("#mainModalBody").append(wordElement);
      i++;
    }

    enableTooltips();

    $("#mainModal").modal("toggle");
  }

  function enableTooltips() {
    var tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  function enablePopovers() {
    var popoverTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="popover"]')
    );
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl);
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
    $("#mainModalTitle").html(
      "<h5><p style='margin-bottom: 0' href='#' class='nav-link link-dark no-draggable'>" +
        "<i style='margin-right: 6px;' class='bi bi-file-earmark-font mainIcons'></i>" +
        "POS Tagger" +
        "</p></h5>"
    );

    var tableElement =
      "<table style='margin: 0 auto;' class='table table-sm table-bordered'>" +
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

    $("#mainModalBody").html(tableElement);

    enableTooltips();
    $("#mainModal").modal("toggle");
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
    $("#mainModal").children("div.modal-dialog").css("max-width", "80%");

    $("#mainModalTitle").html(
      "<h5><p style='margin-bottom: 0' href='#' class='nav-link link-dark no-draggable'>" +
        "<i style='margin-right: 6px;' class='bi bi-file-earmark-richtext mainIcons'></i>" +
        "Syntax Parser" +
        "</p></h5"
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

    $("#mainModalBody").html(tableElement);

    $("#parserTable").on("click", function (e) {
      if (e.target.tagName === "BUTTON") {
        $("#secondaryModal")
          .children("div.modal-dialog")
          .css("max-width", "80%");

        var svg = e.target.nextSibling.children;
        e.target.after("");
        $("#secondaryModalBody").html(svg);

        $("#secondaryModal").on("hidden.bs.modal", function () {
          $("#mainModal").modal("toggle");
        });

        $("#mainModal").modal("toggle");
        $("#secondaryModal").modal("toggle");
      }
    });

    $("#mainModal").modal("toggle");
  }

  function popoverEraser(maxPopovers) {
    $("div.popover").each(function (i, element) {
      if ($("div.popover").length > maxPopovers) {
        element.remove();
      }
    });
  }

  function getConcordance(word) {
    var action = "word/concordancer";
    var url = basicURL + action + "?scrappedId=" + scrappedId + "&word=" + word;

    var settings = {
      url: url,
      method: "GET",
      timeout: 0,
    };
    $.ajax(settings)
      .done(function (response, textStatus, request) {
        console.log(response);
        renderConcordance(word, response);
      })
      .fail(function (request, status, error) {
        alert("Request failed");
      });
  }

  function renderConcordance(word, response) {
    $("#mainModal").children("div.modal-dialog").css("max-width", "80%");

    $("#mainModalTitle").html(
      "<h5><p style='margin-bottom: 0' href='#' class='nav-link link-dark no-draggable'>" +
        "Concordance > " +
        word +
        "</p></h5>"
    );

    var tableElement =
      "<table id='concordanceTable' style='margin: 0 auto; width: 85%;' class='table table-sm table-bordered'>" +
      "<thead>" +
      "<tr>" +
      "<th scope='col'>Previous context</th>" +
      "<th style='text-align: center' scope='col'>Word</th>" +
      "<th scope='col'>Following context</th>" +
      "</tr>" +
      "</thead>" +
      "<tbody>";

    var i = 0;
    while (i < response.data.length) {
      tableElement += "<tr>";

      var j = 0;
      while (j < response.data[i].length) {
        if (j < 3) {
          tableElement += "<td>";

          if (Array.isArray(response.data[i][j])) {
            if (j < 3) {
              x = 0;
              while (x < response.data[i][j].length) {
                console.log("x->" + response.data[i][j][x]);

                tableElement += response.data[i][j][x] + " ";
                x++;
              }
            }
          } else if (j < 2) {
            console.log("j-> " + response.data[i][j]);

            tableElement += response.data[i][j];
          } else {
            break;
          }
          // "<td style='text-align: center; vertical-align: middle;'>";

          tableElement += "</td>";
        }
        j++;
      }
      tableElement += "</tr>";
      i++;
    }
    tableElement += "</tbody>" + "</table>";

    $("#mainModalBody").html(tableElement);

    popoverEraser(0);

    $("#mainModal").modal("toggle");
  }

  function getNgram(ngram, word) {
    var action = "word/ngram/";
    var refreshAction = false;
    if (ngram) {
      refreshAction = true;
    } else {
      ngram = 2;
    }
    var url =
      basicURL + action + ngram + "?scrappedId=" + scrappedId + "&word=" + word;

    var settings = {
      url: url,
      method: "GET",
      timeout: 0,
    };
    $.ajax(settings)
      .done(function (response, textStatus, request) {
        console.log(response);
        renderNgram(refreshAction, ngram, word, response);
      })
      .fail(function (request, status, error) {
        alert("Request failed");
      });
  }

  function renderNgram(refreshAction, ngram, word, response) {
    var titlePrefix = { 2: "Bi", 3: "Tri", 4: "Tetra" };

    var modalTitleElement =
      "<div style='margin-bottom: 0; width: fit-content; margin: 9px 0 -1px 0;' href='#' class='nav-link link-dark no-draggable'>" +
      "<h5>" +
      titlePrefix[ngram] +
      "gram > " +
      word +
      "</h5></div>" +
      "<div style='width: fit-content; padding: 14px 0 0 0;'>" +
      "<nav id='ngramPagination' aria-label='Ngram Pagination'>" +
      "<ul class='pagination pagination-sm'>";

    if (ngram == "2") {
      modalTitleElement +=
        "<li id='ngram2' class='page-item active'><a class='page-link' href='#'>2</a></li>" +
        "<li id='ngram3' class='page-item' aria-current='page'><a class='page-link' href='#'>3</a></li>" +
        "<li id='ngram4' class='page-item'><a class='page-link' href='#'>4</a></li>";
    } else if (ngram == "3") {
      modalTitleElement +=
        "<li id='ngram2' class='page-item'><a class='page-link' href='#'>2</a></li>" +
        "<li id='ngram3' class='page-item active' aria-current='page'><a class='page-link' href='#'>3</a></li>" +
        "<li id='ngram4' class='page-item'><a class='page-link' href='#'>4</a></li>";
    } else if (ngram == "4") {
      modalTitleElement +=
        "<li id='ngram2' class='page-item'><a class='page-link' href='#'>2</a></li>" +
        "<li id='ngram3' class='page-item' aria-current='page'><a class='page-link' href='#'>3</a></li>" +
        "<li id='ngram4' class='page-item active'><a class='page-link' href='#'>4</a></li>";
    }

    modalTitleElement += "</ul>" + "</nav>" + "</div>";

    $("#mainModalTitle").html(modalTitleElement);

    $("#ngramPagination").on("click", function (e) {
      e.preventDefault();
      if (e.target.tagName === "A") {
        if (e.target.textContent == "2") {
          getNgram(e.target.textContent, word);

          $("#ngram2").addClass("active");
          $("#ngram3").removeClass("active");
          $("#ngram4").removeClass("active");
        } else if (e.target.textContent == "3") {
          getNgram(e.target.textContent, word);

          $("#ngram2").removeClass("active");
          $("#ngram3").addClass("active");
          $("#ngram4").removeClass("active");
        } else if (e.target.textContent == "4") {
          getNgram(e.target.textContent, word);

          $("#ngram2").removeClass("active");
          $("#ngram3").removeClass("active");
          $("#ngram4").addClass("active");
        }
      }
    });

    var tableElement =
      "<table id='ngramTable' style='margin: 0 auto; width: 85%;' class='table table-sm table-bordered'>" +
      "<thead>" +
      "<tr>" +
      "<th scope='col'>Lexical Bundle</th>" +
      "<th style='text-align: center' scope='col'>Frequency</th>" +
      "</tr>" +
      "</thead>" +
      "<tbody>";

    tableElement += "<tr>";

    var i = 0;
    while (i < response.data.length) {
      tableElement += "<td>";

      ngramBundle = "";

      var j = 0;
      while (j < response.data[i].ngram.length) {
        if (j + 1 < response.data[i].ngram.length) {
          ngramBundle += response.data[i].ngram[j] + ", ";
        } else {
          ngramBundle += response.data[i].ngram[j];
        }
        j++;
      }
      tableElement += ngramBundle;

      tableElement += "</td>";

      tableElement +=
        "<td style='text-align: center; vertical-align: middle;'>" +
        response.data[i].frequency +
        "</td>" +
        "</tr>";

      i++;
    }

    tableElement += "</tr></tbody></table>";

    $("#mainModalBody").html(tableElement);

    popoverEraser(0);

    if (!refreshAction) {
      $("#mainModal").modal("toggle");
    }
  }
});
