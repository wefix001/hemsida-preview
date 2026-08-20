/* WEFIX Trädgård — frontend mock. Ingen API, inga priser, inget CRM. */
(function () {
  "use strict";

  var OFFERS = [
    { code: "host.stad", title: "Höststädning", line1: "Löv, rabatter, infart", line2: "Redo för vintern", keywords: ["höststädning", "löv", "höst"] },
    { code: "var.stad", title: "Vårstädning", line1: "Rabatter och gräs", line2: "Start på säsongen", keywords: ["vårstädning", "vårstäd"] },
    { code: "garden.hack", title: "Häckklippning", line1: "Vi mäter och klipper", line2: "Höjd du vill ha", keywords: ["häck"] },
    { code: "garden.gras", title: "Gräsklippning", line1: "En gång eller abonnemang", line2: "Trimning som tillval", keywords: ["gräsklippning", "gräs", "klippning"] },
    { code: "garden.ogras", title: "Ogräsrensning", line1: "Rabatt eller mellan sten", line2: "Utan att skada växterna", keywords: ["ogräs"] },
    { code: "garden.beskar", title: "Beskärning", line1: "Buskar och träd", line2: "Vi säger när det är rätt tid", keywords: ["beskärning", "fruktträd"] },
    { code: "garden.altan", title: "Altantvätt", line1: "Grön påväxt och smuts", line2: "Trädgård, inte Bygg", keywords: ["altantvätt", "tvätta altan", "altan"] },
    { code: "garden.sno", title: "Snöröjning", line1: "Snö och halka", line2: "Maskin eller för hand", keywords: ["snö", "skotta"] },
    { code: "garden.trad", title: "Trädfällning", line1: "Arborist, bit för bit", line2: "Bortforsling om du vill", keywords: ["fälla träd", "trädfällning"] },
    { code: "garden.plantera", title: "Plantering", line1: "Nytt eller fräscha upp", line2: "Från blomma till träd", keywords: ["plantering"] },
    { code: "garden.anlaggning", title: "Anläggning", line1: "Rulle eller sådd", line2: "Vi gör i ordning ytan", keywords: ["anläggning", "ny gräsmatta"] },
    { code: "pack.sasong", title: "Paket Säsong", line1: "Tre gånger per år", line2: "Vår, häck, höst", keywords: ["trädgårdsmästare", "paket säsong"] },
    { code: "pack.premium", title: "Paket Premium", line1: "En dag i månaden", line2: "Löpande skötsel", keywords: ["premium"] },
    { code: "pack.snabba", title: "Trädgårdsfix Snabba", line1: "En kort insats", line2: "Buskage, trim, ogräs", keywords: ["snabba", "snabb insats"] },
    { code: "robot.service", title: "Basservice", line1: "Du lämnar i Vallda", line2: "Service och vinter", keywords: ["robot", "automower", "service"] },
    { code: "robot.buy", title: "Köpa robot", line1: "Vi hjälper er välja", line2: "En kollega hör av sig", keywords: ["köpa robot"] },
    { code: "brf", title: "BRF-skötsel", line1: "Grönt, snö eller komplett", line2: "Styrelse får en ticket", keywords: ["förening", "brf"] },
    { code: "foretag", title: "Företag", line1: "Yttre skötsel", line2: "Säg fastighet och behov", keywords: ["företag", "fastighet"] },
    { code: "bygg.altan", title: "Ny altan", line1: "WEFIX Bygg", line2: "Egen ticket, vi puttar över", keywords: ["bygga altan", "ny altan"] },
    { code: "bygg.staket", title: "Staket", line1: "WEFIX Bygg", line2: "Egen ticket", keywords: ["staket", "plank"] },
    { code: "bygg.renovering", title: "Renovering", line1: "WEFIX Bygg", line2: "Egen ticket", keywords: ["renovering"] }
  ];

  var ROBOT_EXTRA = [
    { code: "robot.hem", title: "Hemservice", line1: "Vi hämtar hemma", line2: "Samma omsorg" },
    { code: "robot.lyx", title: "Lyxservice", line1: "Hämtning och extra", line2: "Säg vad du har" }
  ];

  var PRICE_RE = /pris|kostar|kostnad|hur mycket|vad kostar|kronor|offertpris|dyrt|billigt/;
  var HUMAN_RE = /\b(ring|ringa|uppring|återuppring|människa|mattias|samtal|telefonera)\b|riktig person|prata med n[åa]gon|en m[äa]nniska/;
  var JOBAPP_RE = /s[öo]ker jobb|jobba hos|anställning|sommarjobb|vill jobba/;
  var JAIL_RE = /systemprompt|ignore (all|previous)|visa alla kunder|kundregister|fieldly|sellfinity|api[- ]?nyckel|jailbreak/;
  var FAR_RE = /stockholm|malm[öo]|uppsala|ume[åa]|sk[åa]ne|sundsvall|lule[åa]|helsingborg/;

  var form = document.getElementById("composer");
  var input = document.getElementById("chat-input");
  var messagesEl = document.getElementById("messages");
  var offersEl = document.getElementById("offers");
  var privacyEl = document.getElementById("privacy-line");

  var started = false;
  var mode = "idle";
  var collectStep = null;
  var draft = { name: "", phone: "", address: "", what: "", when: "" };
  var visibleCodes = [];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  function addMsg(role, text) {
    var p = document.createElement("p");
    p.className = "msg " + role;
    p.textContent = text;
    messagesEl.appendChild(p);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function startChat() {
    if (started) return;
    started = true;
    var greet = messagesEl.querySelector(".greeting");
    if (greet) greet.classList.remove("greeting");
    if (privacyEl) privacyEl.hidden = true;
  }

  function showOffers(list) {
    var shown = list.slice(0, 3);
    offersEl.innerHTML = "";
    visibleCodes = [];
    shown.forEach(function (o) {
      visibleCodes.push(o.code);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "orb orb-offer";
      btn.setAttribute("data-code", o.code);
      btn.innerHTML =
        '<p class="t">' + esc(o.title) + "</p>" +
        '<p class="l1">' + esc(o.line1) + "</p>" +
        '<p class="l2">' + esc(o.line2) + "</p>";
      btn.addEventListener("click", function () { pickOffer(o); });
      offersEl.appendChild(btn);
    });
  }

  function pickOffer(o) {
    draft.what = o.title;
    mode = "collect";
    collectStep = "address_when";
    addMsg("bot", o.title + " — vilken adress ska vi till, och ungefär när?");
    input.focus();
  }

  function findOffers(raw) {
    var t = raw.toLowerCase();
    var hits = [];
    var seen = {};

    var buyRobot = t.indexOf("köpa robot") !== -1 || t.indexOf("kopa robot") !== -1;
    var robotish = /\brobot\b|automower|robotgräs|robotgras/.test(t);
    var hasHack = t.indexOf("häck") !== -1 || t.indexOf("hack") !== -1;
    var hasAltanBygg = t.indexOf("bygga altan") !== -1 || t.indexOf("ny altan") !== -1;

    OFFERS.forEach(function (o) {
      var match = false;
      var score = 0;
      o.keywords.forEach(function (kw) {
        if (t.indexOf(kw.toLowerCase()) !== -1) {
          match = true;
          score = Math.max(score, kw.length);
        }
      });
      if (!match) return;

      if (o.code === "garden.gras") {
        if (robotish || buyRobot) return;
        if (hasHack && t.indexOf("gräs") === -1 && t.indexOf("gras") === -1) return;
      }
      if (o.code === "robot.service" && buyRobot && !/\bservice\b|vinter/.test(t)) return;
      if (o.code === "garden.altan" && hasAltanBygg) return;

      if (!seen[o.code]) {
        seen[o.code] = true;
        hits.push({ offer: o, score: score });
      }
    });

    hits.sort(function (a, b) { return b.score - a.score; });
    var out = hits.map(function (h) { return h.offer; });

    if (out.some(function (o) { return o.code === "robot.service"; })) {
      var bas = out.filter(function (o) { return o.code === "robot.service"; })[0];
      var rest = out.filter(function (o) { return o.code !== "robot.service" && o.code !== "robot.buy"; });
      out = [bas].concat(ROBOT_EXTRA).concat(rest);
    }

    return out.slice(0, 3);
  }

  function looksLikePhone(s) {
    var d = s.replace(/\D/g, "");
    return d.length >= 8 && d.length <= 12;
  }

  function finishDraft() {
    mode = "done";
    collectStep = null;
    addMsg("bot", "Utkast sparat. En kollega tar det.");
  }

  function collectFrom(text) {
    if (collectStep === "address_when") {
      draft.address = text;
      if (/\b(vecka|måndag|tisdag|onsdag|torsdag|fredag|lördag|söndag|snart|asap|vår|höst|vinter|sommar|\d{1,2}\/\d{1,2})\b/i.test(text)) {
        draft.when = text;
      }
      collectStep = "name_phone";
      addMsg("bot", "Vad heter du och vilket nummer når vi dig på?");
      return;
    }
    if (collectStep === "name_phone") {
      if (looksLikePhone(text)) draft.phone = text;
      else draft.name = text;
      if (draft.phone && draft.name) {
        finishDraft();
        return;
      }
      if (!draft.phone && looksLikePhone(text)) {
        draft.phone = text;
        if (!draft.name) {
          collectStep = "name";
          addMsg("bot", "Tack. Vad heter du?");
          return;
        }
        finishDraft();
        return;
      }
      if (!draft.name) draft.name = text.split(/,|\d/)[0].trim() || text;
      if (!draft.phone) {
        collectStep = "phone";
        addMsg("bot", "Vilket telefonnummer ska vi använda?");
        return;
      }
      finishDraft();
      return;
    }
    if (collectStep === "name") {
      draft.name = text;
      if (!draft.phone) {
        collectStep = "phone";
        addMsg("bot", "Vilket telefonnummer ska vi använda?");
        return;
      }
      finishDraft();
      return;
    }
    if (collectStep === "phone") {
      draft.phone = text;
      finishDraft();
      return;
    }
    if (collectStep === "phone_only") {
      draft.phone = text;
      mode = "done";
      collectStep = null;
      addMsg("bot", "Tack. En kollega ringer upp.");
    }
  }

  function reply(text) {
    var t = text.toLowerCase();

    if (JAIL_RE.test(t)) {
      addMsg("bot", "Det kan vi inte hjälpa till med här. Ring 010-33 00 640.");
      return;
    }

    if (JOBAPP_RE.test(t)) {
      addMsg("bot", "Kul att du vill jobba med oss. Mejla info@wefixab.se med namn och hur vi når dig. Inte ett säljärende.");
      return;
    }

    if (PRICE_RE.test(t)) {
      mode = "collect";
      collectStep = "name_phone";
      addMsg("bot", "Vi sätter inget pris i chatten. En kollega hör av sig. Vad heter du och vilket nummer når vi dig på?");
      return;
    }

    if (HUMAN_RE.test(t)) {
      mode = "collect";
      collectStep = "phone_only";
      addMsg("bot", "Självklart. Vilket nummer ska WEFIX ringa?");
      return;
    }

    if (FAR_RE.test(t)) {
      mode = "collect";
      collectStep = "phone_only";
      addMsg("bot", "Det låter lite utanför vårt vanliga område. Lämna ett nummer så hör en kollega av sig.");
      return;
    }

    if (mode === "collect" && collectStep) {
      collectFrom(text);
      return;
    }

    if (mode === "done") {
      addMsg("bot", "Utkastet är sparat hos oss i den här rutan. Behöver du ändra något, skriv det — eller ring 010-33 00 640.");
      return;
    }

    var found = findOffers(text);
    if (found.length) {
      showOffers(found);
      mode = "chat";
      if (found.length === 1) {
        addMsg("bot", "Det låter som " + found[0].title.toLowerCase() + ". Klicka på bollen eller skriv adress och när.");
      } else {
        addMsg("bot", "Vi kan ta det. Klicka på en boll eller skriv adress och när.");
      }
      return;
    }

    mode = "chat";
    var asks = [
      "Berätta gärna mer — häck, gräs, robot eller något annat?",
      "Vad ska vi titta på i trädgården?",
      "Vilken adress gäller det, så vi vet om vi är i närheten?"
    ];
    addMsg("bot", asks[Math.floor(Math.random() * asks.length)]);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = (input.value || "").trim();
    if (!text) return;
    startChat();
    addMsg("user", text);
    input.value = "";
    reply(text);
  });
})();
