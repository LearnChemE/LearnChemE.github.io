var setup, draw, drawPage, next, reset, resizeFont, windowResized, selectItem, getCoords, applyEffect, glow, glowList;
let instrX, fps, w, h, update, page, effects, effect, choices, domObjs, instrY, eqns, texX, texY, lnHt, letters, glowLetters, partials, constant, rhs, finalEq, largeFontSize, topPartial, bottomPartial, constantText, refLeft, constantIndex, i, fontSize, running, prg, x1, y1, x2, y2;
(function () {
  var _$0 = this;

  var _E = function () {
    let e = document.getElementById("main"),
        t = document.createElement("button");
    t.id = "resetbutton", t.innerText = "reset", t.onclick = reset, t.style.zIndex = 2, t.style.position = "absolute", t.style.top = "10px", e.appendChild(t);
    let n = windowResized(!0);
    t.style.left = `${instrX}px`;
    let s = createCanvas(n, n);
    s.parent("main"), s.position(0, 0), s.style("z-index", 0), frameRate(fps), w = n / 100, h = n / 100, textAlign(LEFT, TOP), windowResized(), background(255, 255, 255);
  };

  var _F = function () {
    update && drawPage(page), effects && applyEffect(effect), update = !1;
  };

  var _G = function (e) {
    switch (clear(), e) {
      case 1:
        removeElements(), choices = [], domObjs = [], effect = [], text("Click an equation to get started.", instrX, instrY);
        let t = Object.keys(eqns.fundamentals);

        for (let e = 0; e < t.length; e++) {
          domObjs.push(new Tex({
            content: eqns.fundamentals[t[e]],
            position: [texX, texY + lnHt * (e + 1)],
            name: `${t[e]}`
          })), domObjs[e].div.addClass("eq"), domObjs[e].div.id(`eq${e}`);
          let n = `${e}`;
          document.getElementById(`eq${n}`).addEventListener("mousedown", () => {
            1 == page && choices.push(parseInt(n)), next(1, choices[0]);
          });
        }

        break;

      case 2:
        text("Click the differential term you would like held constant\n(options are colored)", instrX, instrY);

        for (let e = 0; e < domObjs.length; e++) e != choices[0] && domObjs[e].div.remove();

        effect = [], letters = document.querySelectorAll("mjx-container")[0].firstChild.childNodes, glowLetters = 0 == choices[0] || 2 == choices[0] ? [0, 1, 4, 5, 8, 9] : 1 == choices[0] || 3 == choices[0] ? [0, 1, 5, 6, 9, 10] : [0, 1, 4, 5, 8, 9];

        for (let e = 0; e < glowLetters.length; e++) {
          let t = letters[glowLetters[e]],
              n = `${Math.floor(e / 2)}`;
          effect.push({
            target: t,
            effect: "color",
            color: `${n}`
          }), e >= 2 && t.addEventListener("mousedown", () => {
            next(2, n);
          });
        }

        effects = !0;
        break;

      case 3:
        domObjs.push(new Tex({
          content: `\\left( \\frac{\\partial ${partials[0]}}{\\partial ${partials[1]}} \\right)_{\\scriptscriptstyle ${constant}}=${rhs}`,
          position: [texX, texY],
          name: "partial"
        })), domObjs[domObjs.length - 1].div.id("final"), finalEq = document.querySelectorAll("mjx-container")[1].firstChild, finalEq.style.fontSize = `${largeFontSize}rem`, topPartial = finalEq.firstChild.childNodes[0].childNodes[1].firstChild.childNodes[0], bottomPartial = finalEq.firstChild.childNodes[0].childNodes[1].firstChild.childNodes[1], constantText = finalEq.firstChild.childNodes[1], refLeft = getCoords(constantText).right, domObjs[domObjs.length - 1].div.hide(), effect.push({
          target: [letters[constantIndex], letters[constantIndex + 1]],
          effect: "zeroAndDelete"
        }), effects = !0, loop();
        break;

      case 4:
        text("With constant", instrX, instrY);
        let n = domObjs[domObjs.length - 1];
        n.div.show(), n.div.style("opacity", "0"), effect.push({
          target: topPartial,
          effect: "color",
          color: 0
        }), effect.push({
          target: bottomPartial,
          effect: "color",
          color: `${1 == choices[1] ? 2 : 1}`
        }), effect.push({
          target: constantText,
          effect: "color",
          color: `${2 == choices[1] ? 2 : 1}`
        }), effects = !0, next(4, null);
        break;

      case 5:
        text("With constant ", instrX, instrY);
        let s = textWidth("With constant "),
            o = new Tex({
          content: `${constant},`,
          position: [instrX + s + .05 * lnHt, instrY - .1 * lnHt]
        });
        o.div.id("constantLetter"), effect.push({
          target: document.getElementById("constantLetter"),
          effect: "color",
          color: `${2 == choices[1] ? 2 : 1}`
        }), effects = !0, page++, window.setTimeout(e => {
          update = !0;
        }, 2e3);
        break;

      case 6:
        text("With constant", instrX, instrY), text("therefore,", instrX, texY + 2.5 * lnHt), window.setTimeout(e => {
          update = !0;
        }, 2e3), page++;
        break;

      case 7:
        text("With constant", instrX, instrY), text("therefore,", instrX, texY + 2.5 * lnHt);
        let i = document.getElementById("final");
        i.style.top = `${texY + 4 * lnHt}px`, i.style.opacity = 1, noLoop();
    }

    update = !1;
  };

  var _H = function (e, t) {
    if (e == page) switch (page) {
      case 1:
        let e;

        for (i = 0; i < domObjs.length; i++) {
          e = i != t ? "fade" : "expand";
          let n = document.getElementById(`eq${i}`);
          effect.push({
            target: n,
            effect: e
          });
        }

        effects = !0, redraw(), update = !0, page++;
        break;

      case 2:
        choices.push(t);
        let n = Object.keys(eqns.fundamentals),
            s = eqns.fundamentals[n[choices[0]]];
        constant = s.charAt(glowLetters[2 * t + 1]), constantIndex = glowLetters[2 * t], glowLetters.splice(2 * t, 2);
        let o = s.charAt(glowLetters[2] - 1);

        for (rhs = "-" == s.charAt(glowLetters[2] - 2) ? `-${o}` : `${o}`, partials = [], i = 0; i < glowLetters.length / 2; i++) partials.push(s[glowLetters[2 * i + 1]]);

        update = !0, page++;
        break;

      case 3:
        effect = [], effects = !1, page++, drawPage(page);
        break;

      case 4:
        page++, drawPage(page);
    }
  };

  var _I = function () {
    location.reload();
  };

  var _J = function () {
    let e = Number(window.getComputedStyle(document.getElementById("main")).getPropertyValue("font-size").replace(/[^\d.-]/g, ""));
    fontSize = 100 * w < 400 ? e : 100 * w < 1200 ? 100 * w / 28 : 1200 / 28, textSize(fontSize), lnHt = 1.5 * fontSize, instrX = 5 * w, instrY = lnHt + 10 + getCoords(document.getElementById("resetbutton")).height, texX = instrX, texY = instrY + lnHt, largeFontSize = 2.2 * fontSize / 10;
  };

  var _K = function (e) {
    let t = windowWidth,
        n = windowHeight,
        s = Math.min(t, n);
    if (w = s / 100, h = s / 100, resizeFont(), 1 == e) return s;
    resizeCanvas(s, s), update = !0;
  };

  var _L = function (e, t, n, s) {
    let o = [],
        i = [];
    o = 0 == n ? [0, 2] : -1 != e.search("=-") ? 1 == n ? [3, 7] : 2 == n ? [7, 11] : 3 == n ? [11, 15] : [0, 2] : 1 == n ? [3, 6] : 2 == n ? [6, 10] : 3 == n ? [10, 14] : [0, 2];

    for (let e = o[0]; e < o[1]; e++) i.push(t[e]);

    return s ? e.slice(o[0], o[1]) : i;
  };

  var _M = function (e) {
    let t = e.getBoundingClientRect();
    return {
      top: t.top + pageYOffset,
      left: t.left + pageXOffset,
      bottom: t.top + pageYOffset + t.height,
      right: t.left + pageXOffset + t.width,
      height: t.height,
      width: t.width
    };
  };

  var _N = function (e) {
    e.delete;
    let t = e.time || .5;

    for (i = 0; i < e.length; i++) {
      let n = e[i].target,
          r = e[i].effect,
          s = e[i].color || null,
          o = "cnvElement" != (e[i].type || "DOM");
      if (o) switch (r) {
        case "fade":
          n.style.opacity = 1, n.style.transition = `opacity ${t}s`, n.style.opacity = 0;
          break;

        case "expand":
          n.style.fontSize = fontSize, n.style.transition = "all 1s", n.firstChild.style.transition = "all 1s", n.firstChild.style.fontSize = `${largeFontSize}rem`, n.style.top = `${texY + 1.2 * lnHt}px`;
          break;

        case "glow":
          glow({
            continuous: 2 == page,
            duration: 2e3,
            element: n,
            id: Math.floor(i / 2)
          });
          break;

        case "color":
          glow({
            continuous: !1,
            duration: 1e3,
            element: n,
            id: s
          });
          break;

        case "zeroAndDelete":
          let e = [0, .5, 1, 1.5, 2, 2.5, 3];
          var l = [.04, .04, .04, .025, .025, .025];

          if (running) {
            if (running && prg < e[1]) {
              prg += l[0];
              let t = e[1] - e[0];
              push(), strokeWeight(4), line(x1, y1, (1 - prg / t) * x1 + prg / t * x2, (1 - prg / t) * y1 + prg / t * y2), pop();
            } else if (running && prg < e[2]) {
              prg += l[1];
              let t = e[2] - e[1];
              push(), noStroke(), fill(`rgba(0, 0, 0, ${(prg - e[1]) / t})`), text("0", x2, y2 - lnHt), pop();
            } else if (running && prg < e[3]) prg += l[2];else if (running && prg < e[4]) {
              prg += l[3];
              let t = e[4] - e[3],
                  n = Object.keys(eqns.fundamentals),
                  r = eqns.fundamentals[n[choices[0]]];
              selectItem(r, letters, choices[1]).forEach(function (l) {
                l.style.opacity = (e[4] - prg) / t;
              }), clear(), push(), noStroke(), fill(`rgba(0, 0, 0, ${Math.max((e[4] - prg) / t, 0)})`), text("0", x2, y2 - lnHt), stroke(`rgba(0, 0, 0, ${Math.max((e[4] - prg) / t, 0)})`), strokeWeight(4), line(x1, y1, x2, y2), pop(), (e[4] - prg) / t < .05 && (selectItem(r, letters, choices[1]).forEach(function (e) {
                e.style.visibility = "hidden";
              }), clear());
            } else if (running && prg < e[5]) {
              if (prg < e[4] + l[4]) {
                let t = e[5] - e[4],
                    n = document.getElementById(`eq${choices[0]}`);
                n.style.transition = `all ${t / l[4] / fps}s`, n.style.top = `${texY}px`;
                let r = refLeft - getCoords(letters[2]).left,
                    s = getCoords(letters[0]).left;
                n.style.left = `${s + r}px`;
              }

              prg += l[4];
            } else if (running && prg < e[6]) {
              prg += l[5];
              let t = e[6] - e[5];

              if (1 == choices[1]) {
                let e = Object.keys(eqns.fundamentals),
                    n = eqns.fundamentals[e[choices[0]]],
                    r = getCoords(selectItem(n, letters, 1)[0]).left,
                    s = "+" != selectItem(n, letters, 2, !0).charAt(0),
                    i = selectItem(n, letters, 2);
                s || (i[0].style.visibility = "hidden", i.shift());
                let o = getCoords(i[0]).left;
                i.forEach(function (e) {
                  e.style.transition = `all ${t / l[5] / fps}s`, e.style.transform = `translateX(${r - o}px)`;
                });
              }

              prg = e[6];
            } else if (running && prg >= e[6]) return running = !1, prg = 0, next(3, null);
          } else {
            for (prg = 0, x1 = getCoords(n[0]).left, x2 = getCoords(n[1]).right, y1 = getCoords(n[0]).bottom + 10 + .5 * lnHt, y2 = getCoords(n[1]).top + 10 - .5 * lnHt, running = !0, effects = !0, update = !1, i = 0; i < domObjs.length; i++) domObjs[i].div.style("z-index", "-1");

            loop();
          }

      }
    }
  };

  var _O = function ({
    continuous: e,
    duration: t,
    element: l,
    id: n
  }) {
    let r = Math.floor(t * fps / 1e3),
        s = frameCount % r / r,
        i = e ? .5 + .5 * Math.sin(s * Math.PI) : 1,
        o = 0 == n ? [0, 0, 0] : 1 == n ? [70, 200, 50] : 2 == n ? [100, 100, 255] : [0, 0, 0],
        g = `rgb(${o[0] * i},${o[1] * i},${o[2] * i})`;
    l.style.color = g, e && loop();
  };

  _$0.setup = _E;
  _$0.draw = _F;
  _$0.drawPage = _G;
  _$0.next = _H;
  _$0.reset = _I;
  _$0.resizeFont = _J;
  _$0.windowResized = _K;
  _$0.selectItem = _L;
  _$0.getCoords = _M;
  _$0.applyEffect = _N;
  _$0.glow = _O;

  var _P = class {
    constructor(t) {
      this.name = t.name || String("tex", Math.floor(1e6 * Math.random())), this.content = t.content || "hey put some text here", this.position = t.position || [0, 0], this.div = createDiv(`\\( ${this.content}\\)`), this.div.parent("main"), this.div.style("font-size", `${fontSize / 10}rem`), this.div.position(this.position[0], this.position[1]), MathJax.typeset();
    }

  };

  _$0.Tex = _P;
  _$0.glowList = [];
  instrX = void 0;
  fps = 20;
  w = void 0;
  h = void 0;
  update = false;
  page = 1;
  effects = false;
  effect = [];
  choices = [];
  domObjs = [];
  instrY = void 0;
  eqns = {
    fundamentals: {
      U: "dU=TdS-PdV",
      A: "dA=-SdT-PdV",
      H: "dH=TdS+VdP",
      G: "dG=-SdT+VdP",
      Rand: "d\xA7=\u25B2d\u266B-\u2663d\u03A9"
    }
  };
  texX = void 0;
  texY = void 0;
  lnHt = void 0;
  letters = [];
  glowLetters = [];
  partials = [];
  constant = void 0;
  rhs = void 0;
  finalEq = void 0;
  largeFontSize = void 0;
  topPartial = void 0;
  bottomPartial = void 0;
  constantText = void 0;
  refLeft = void 0;
  constantIndex = void 0;
  i = void 0;
  fontSize = void 0;
  running = false;
  prg = 0;
  x1 = void 0;
  y1 = void 0;
  x2 = void 0;
  y2 = void 0;
}).call(this);