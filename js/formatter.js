let JsonFormatDealer = function () {
  "use strict";
  let e = 1
    , t = 2
    , n = 3
    , r = 4
    , o = 5
    , i = 6;
  function s(e) {
    let t = {
      singleQuote: !1,
      doubleQuote: !1,
      regex: !1,
      blockComment: !1,
      lineComment: !1,
      condComp: !1
    };
    for (let n = 0, r = (e = ("__" + e + "__").split("")).length; n < r; n++)
      if (t.regex)
        "/" === e[n] && "\\" !== e[n - 1] && (t.regex = !1);
      else if (t.singleQuote)
        "'" === e[n] && "\\" !== e[n - 1] && (t.singleQuote = !1);
      else if (t.doubleQuote)
        '"' === e[n] && "\\" !== e[n - 1] && (t.doubleQuote = !1);
      else if (t.blockComment)
        "*" === e[n] && "/" === e[n + 1] && (e[n + 1] = "",
          t.blockComment = !1),
          e[n] = "";
      else if (t.lineComment)
        "\n" !== e[n + 1] && "\r" !== e[n + 1] || (t.lineComment = !1),
          e[n] = "";
      else if (t.condComp)
        "@" === e[n - 2] && "*" === e[n - 1] && "/" === e[n] && (t.condComp = !1);
      else if (t.doubleQuote = '"' === e[n],
        t.singleQuote = "'" === e[n],
        "/" === e[n]) {
        if ("*" === e[n + 1] && "@" === e[n + 2]) {
          t.condComp = !0;
          continue
        }
        if ("*" === e[n + 1]) {
          e[n] = "",
            t.blockComment = !0;
          continue
        }
        if ("/" === e[n + 1]) {
          e[n] = "",
            t.lineComment = !0;
          continue
        }
        t.regex = !0
      }
    return e.join("").slice(2, -2)
  }
  let l = document.createElement("div")
    , a = document.createElement("span");
  function c(e, t) {
    let n = a.cloneNode(!1);
    return n.className = t,
      n.innerText = e,
      n
  }
  function u(e) {
    let t = a.cloneNode(!1);
    return t.className = e,
      t
  }
  let f = {
    t_kvov: function (e) {
      let t = l.cloneNode(!1);
      return t.className = e,
        t
    }("kvov"),
    t_key: u("k"),
    t_string: u("s"),
    t_number: u("n"),
    t_exp: u("e"),
    t_null: c("null", "nl"),
    t_true: c("true", "bl"),
    t_false: c("false", "bl"),
    t_oBrace: c("{", "b"),
    t_cBrace: c("}", "b"),
    t_oBracket: c("[", "b"),
    t_cBracket: c("]", "b"),
    t_ellipsis: u("ell"),
    t_blockInner: u("blockInner"),
    t_colonAndSpace: document.createTextNode(": "),
    t_commaText: document.createTextNode(","),
    t_dblqText: document.createTextNode('"')
  };
  function d(s, l) {
    let c = function s(l, c) {
      let u, d, p, h, g, m, b, y, v = f;
      if (u = "string" == typeof l ? e : "number" == typeof l ? t : !1 === l || !0 === l ? o : null === l ? i : l instanceof Array ? r : n,
        d = v.t_kvov.cloneNode(!1),
        u === n || u === r)
        if ("function" == typeof JSON.BigNumber && l instanceof JSON.BigNumber)
          l = JSON.stringify(l),
            u = t;
        else {
          for (h in p = !1,
            l)
            if (l.hasOwnProperty(h)) {
              p = !0;
              break
            }
          p && d.appendChild(v.t_exp.cloneNode(!0))
        }
      switch (!1 !== c ? (d.classList.add("objProp"),
        (g = v.t_key.cloneNode(!1)).textContent = JSON.stringify(c).slice(1, -1),
        d.appendChild(v.t_dblqText.cloneNode(!1)),
        d.appendChild(g),
        d.appendChild(v.t_dblqText.cloneNode(!1)),
        d.appendChild(v.t_colonAndSpace.cloneNode(!1))) : d.classList.add("arrElem"),
      u) {
        case e:
          let f = a.cloneNode(!1)
            , h = JSON.stringify(l);
          if (h = h.substring(1, h.length - 1),
            "h" === l[0] && "http" === l.substring(0, 4)) {
            let e = document.createElement("A");
            e.href = l,
              e.innerText = h,
              f.appendChild(e)
          } else
            f.innerText = h;
          (m = v.t_string.cloneNode(!1)).appendChild(v.t_dblqText.cloneNode(!1)),
            m.appendChild(f),
            m.appendChild(v.t_dblqText.cloneNode(!1)),
            d.appendChild(m);
          break;
        case t:
          (m = v.t_number.cloneNode(!1)).innerText = l,
            d.appendChild(m);
          break;
        case n:
          if (d.appendChild(v.t_oBrace.cloneNode(!0)),
            p) {
            d.appendChild(v.t_ellipsis.cloneNode(!1)),
              b = v.t_blockInner.cloneNode(!1);
            let e, t, n = 0;
            for (e in l)
              l.hasOwnProperty(e) && (n++,
                y = s(l[e], e),
                t = v.t_commaText.cloneNode(),
                y.appendChild(t),
                b.appendChild(y));
            y.removeChild(t),
              d.appendChild(b)
          }
          d.appendChild(v.t_cBrace.cloneNode(!0));
          break;
        case r:
          if (d.appendChild(v.t_oBracket.cloneNode(!0)),
            p) {
            d.appendChild(v.t_ellipsis.cloneNode(!1)),
              b = v.t_blockInner.cloneNode(!1);
            for (let e = 0, t = l.length, n = t - 1; e < t; e++)
              y = s(l[e], !1),
                e < n && y.appendChild(v.t_commaText.cloneNode()),
                b.appendChild(y);
            d.appendChild(b)
          }
          d.appendChild(v.t_cBracket.cloneNode(!0));
          break;
        case o:
          l ? d.appendChild(v.t_true.cloneNode(!0)) : d.appendChild(v.t_false.cloneNode(!0));
          break;
        case i:
          d.appendChild(v.t_null.cloneNode(!0))
      }
      return d
    }(s, !1);
    c.classList.add("rootKvov");
    let u = document.createElement("DIV");
    u.id = "formattedJson",
      u.appendChild(c);
    let d = u.outerHTML;
    return null !== l && (d = '<div id="jsonpOpener">' + l + " ( </div>" + d + '<div id="jsonpCloser">)</div>'),
      d
  }
  return {
    postMessage: function (e) {
      let t = null;
      if ("SENDING TEXT" === e.type) {
        let n, r = e.text;
        try {
          n = JSON.parse(r)
        } catch (e) {
          let o;
          if (!(o = (r = r.trim()).indexOf("(")))
            return void JsonFormatEntrance.postMessage(["NOT JSON", "no opening parenthesis"]);
          let i, l = s(r.substring(0, o)).trim();
          if (!l.match(/^[a-zA-Z_$][\.\[\]'"0-9a-zA-Z_$]*$/))
            return void JsonFormatEntrance.postMessage(["NOT JSON", "first bit not a valid function name"]);
          if (!(i = r.lastIndexOf(")")))
            return void JsonFormatEntrance.postMessage(["NOT JSON", "no closing paren"]);
          let a = s(r.substring(i + 1)).trim();
          if ("" !== a && ";" !== a)
            return void JsonFormatEntrance.postMessage(["NOT JSON", "last closing paren followed by invalid characters"]);
          r = r.substring(o + 1, i);
          try {
            n = JSON.parse(r)
          } catch (e) {
            return void JsonFormatEntrance.postMessage(["NOT JSON", "looks like a function call, but the parameter is not valid JSON"])
          }
          t = l
        }
        if ("object" != typeof n && "array" != typeof n)
          return void JsonFormatEntrance.postMessage(["NOT JSON", "technically JSON but not an object or array"]);
        JsonFormatEntrance.postMessage(["FORMATTING"]);
        try {
          localStorage.getItem("just test : Blocked script execution in xxx?"),
            setTimeout(function () {
              let e = d(n, t);
              JsonFormatEntrance.postMessage(["FORMATTED", e])
            }, 0)
        } catch (e) {
          let r = d(n, t);
          JsonFormatEntrance.postMessage(["FORMATTED", r])
        }
      }
    }
  }
}();

//----------------

let JsonFormatEntrance = function () {
  "use strict";
  let e, t, n, r, o, i, s = 0, l = "", a = function (e) {
    let t = (new Date).format("yyyyMMddHHmmss")
      , n = new Blob([e], {
        type: "application/octet-stream"
      })
      , r = $('<button class="xjf-btn xjf-btn-right">下载JSON</button>').appendTo("#optionBar");
    "undefined" != typeof chrome && chrome.permissions ? r.click(function (e) {
      chrome.permissions.request({
        permissions: ["downloads"]
      }, e => {
        e ? chrome.downloads.download({
          url: URL.createObjectURL(n),
          saveAs: !0,
          conflictAction: "overwrite",
          filename: "FeHelper-" + t + ".json"
        }) : ''
      }
      )
    }) : r.click(function (e) {
      let r = $("#aLinkDownload");
      r[0] || ((r = $('<a id="aLinkDownload" target="_blank" title="保存到本地">下载JSON数据</a>').appendTo("body")).attr("download", t + ".json"),
        r.attr("href", URL.createObjectURL(n))),
        r[0].click()
    })
  }, c = function (e) {
    let t = e.text().replace(/":\s/gm, '":').replace(/,$/, "").trim();
    /^{/.test(t) && /\}$/.test(t) || /^\[/.test(t) && /\]$/.test(t) || (t = "{" + t + "}");
    try {
      t = JSON.stringify(JSON.parse(t), null, 4)
    } catch (e) { }
    return t
  }, u = function (t) {
    (r = $("#boxOpt")).length || (r = $('<div id="boxOpt"><a class="opt-download" target="_blank">下载</a>|<a class="opt-copy">复制</a>|<a class="opt-del">删除</a></div>').appendTo(e)),
      r.find("a.opt-download").unbind("click").bind("click", function (e) {
        let n = c(t)
          , r = (new Date).format("yyyyMMddHHmmss")
          , o = new Blob([n], {
            type: "application/octet-stream"
          });
        "undefined" != typeof chrome && chrome.permissions ? chrome.permissions.request({
          permissions: ["downloads"]
        }, e => {
          e ? chrome.downloads.download({
            url: URL.createObjectURL(o),
            saveAs: !0,
            conflictAction: "overwrite",
            filename: "FeHelper-" + r + ".json"
          }) : ''
        }
        ) : $(this).attr("download", "FeHelper-" + r + ".json").attr("href", URL.createObjectURL(o))
      }),
      r.find("a.opt-copy").unbind("click").bind("click", function (e) {
        !function (e) {
          let t = document.createElement("textarea");
          t.style.position = "fixed",
            t.style.opacity = 0,
            t.value = e,
            document.body.appendChild(t),
            t.select(),
            document.execCommand("Copy"),
            document.body.removeChild(t)
        }(c(t))
      }),
      r.find("a.opt-del").unbind("click").bind("click", function (e) {
        if (t.parent().is("#formattedJson"))
          return '',
            !1;
        t.remove(),
          r.css("top", -1e3).hide(),
          o && o.hide()
      }),
      r.css({
        left: t.offset().left + t.width() - 90,
        top: t.offset().top
      }).show()
  };
  function f(e) {
    let t;
    $.each(e, function (e) {
      if ((t = $(this)).children(".blockInner").length && (t.addClass("collapsed"),
        !t.attr("id"))) {
        t.attr("id", "kvov" + ++s);
        let e = t.children(".blockInner").eq(0).children().length
          , r = e + (1 === e ? " item" : " items");
        n[0].insertAdjacentHTML("beforeend", "\n#kvov" + s + '.collapsed:after{color: #aaa; content:" // ' + r + '"}')
      }
    })
  }
  let d = function () {
    let n = $("#optionBar");
    n.length ? n.html("") : n = $('<span id="optionBar" />').appendTo(e.parent()),
      $('<span class="x-split">|</span>').appendTo(n);
    let i = $('<button class="xjf-btn xjf-btn-left">元数据</button>').appendTo(n)
      , s = $('<button class="xjf-btn xjf-btn-mid">折叠所有</button>').appendTo(n)
      , l = !1;
    i.bind("click", function (n) {
      l ? (l = !1,
        t.hide(),
        e.show(),
        i.text("元数据")) : (l = !0,
          t.show(),
          e.hide(),
          i.text("格式化")),
        r && r.hide(),
        o && o.hide()
    }),
      s.bind("click", function (e) {
        l && i.trigger("click"),
          "折叠所有" === s.text() ? (s.text("展开所有"),
            f($(".objProp,.arrElem"))) : (s.text("折叠所有"),
              $(".objProp,.arrElem").removeClass("collapsed")),
          r && r.hide(),
          o && o.hide()
      })
  }
    , p = function () {
      $("#jfContent span.e").bind("click", function (e) {
        e.preventDefault();
        let t = $(this).parent();
        t.toggleClass("collapsed"),
          t.hasClass("collapsed") && f(t)
      }),
        $("#jfContent .kvov").bind("click", function (e) {
          if ($(this).hasClass("x-outline"))
            return r && r.hide(),
              o && o.hide(),
              $(this).removeClass("x-outline"),
              e.stopPropagation(),
              !0;
          $(".x-outline").removeClass("x-outline");
          let t = $(this).removeClass("x-hover").addClass("x-outline");
          u(t),
            function (e) {
              let t = [];
              do {
                if (e.hasClass("arrElem") ? e.hasClass("rootKvov") || t.unshift("[" + e.prevAll(".kvov").length + "]") : t.unshift(e.find(">.k").text()),
                  e.parent().hasClass("rootKvov") || e.parent().parent().hasClass("rootKvov"))
                  break;
                e = e.parent().parent()
              } while (e.length && !e.hasClass("rootKvov"));
              let n = t.join("#@#").replace(/#@#\[/g, "[").replace(/#@#/g, ".");
              o || (o = $("<div/>").css({
                position: "fixed",
                bottom: 0,
                left: 0,
                background: "rgb(0, 0, 0,0.6)",
                color: "#ff0",
                fontSize: "12px",
                fontWeight: "bold",
                padding: "2px 10px 2px 2px",
                zIndex: 10
              }).appendTo("body")),
                o.html("当前路径：" + n).show()
            }(t),
            $(e.target).is(".kvov .e") ? $(e.target).parent().trigger("click") : e.stopPropagation(),
            "function" == typeof window._OnJsonItemClickByFH && window._OnJsonItemClickByFH(c(t))
        }).bind("mouseover", function (e) {
          return $(this).addClass("x-hover"),
            !1
        }).bind("mouseout", function (e) {
          $(this).removeClass("x-hover")
        })
    };
  return {
    format: function (r) {
      l = JSON.stringify(JSON.parse(r), null, 4),
        function () {
          (e = $("#jfContent"))[0] || (e = $('<div id="jfContent" />').appendTo("body")),
            (t = $("#jfContent_pre"))[0] || (t = $('<pre id="jfContent_pre" />').appendTo("body")),
            (n = $("#jfStyleEl"))[0] || (n = $('<style id="jfStyleEl" />').appendTo("head")),
            (i = $("#formattingMsg"))[0] || (i = $('<div id="formattingMsg"><span class="x-loading"></span>格式化中...</div>').appendTo("body"));
          try {
            e.html("").show(),
              t.html("").hide(),
              o && o.hide(),
              i.hide()
          } catch (e) { }
        }(),
        t.html(l.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")),
        JsonFormatDealer.postMessage({
          type: "SENDING TEXT",
          text: r,
          length: r.length
        })
    },
    postMessage: function (n) {
      switch (n[0]) {
        case "NOT JSON":
          t.show(),
            e.html('<span class="x-json-tips">JSON不合法，请检查：</span>');
          break;
        case "FORMATTING":
          i.show();
          break;
        case "FORMATTED":
          i.hide(),
            e.html(n[1]),
            d(),
            p(),
            a(l);
          break;
        default:
          throw new Error("Message not understood: " + n[0])
      }
    }
  }
}()


window.Formatter = {
  format: JsonFormatEntrance.format
}