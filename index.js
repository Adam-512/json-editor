let editor = {}
  , LOCAL_KEY_OF_LAYOUT = "local-layout-key"
  , JSON_LINT = "jsonformat:json-lint-switch"
  , EDIT_ON_CLICK = "jsonformat:edit-on-click"
  , AUTO_DECODE = "jsonformat:auto-decode";
let vm = new Vue({
  el: "#pageContainer",
  data: {
    defaultResultTpl: '<div class="x-placeholder"></div>',
    placeHolder: "",
    jsonFormattedSource: "",
    errorMsg: "",
    errorJsonCode: "",
    errorPos: "",
    jfCallbackName_start: "",
    jfCallbackName_end: "",
    jsonLintSwitch: !0,
    autoDecode: !1,
    fireChange: !0,
    overrideJson: !1,
    size: '',
    showConfirmBtn: false
  },
  mounted: function () {
    // DarkModeMgr.turnLightAuto(),
    this.placeHolder = this.defaultResultTpl
    this.autoDecode = localStorage.getItem(AUTO_DECODE)
    this.autoDecode = "true" === this.autoDecode
    this.jsonLintSwitch = "false" !== localStorage.getItem(JSON_LINT)
    this.overrideJson = "true" === localStorage.getItem(EDIT_ON_CLICK)
    let layout = localStorage.getItem(LOCAL_KEY_OF_LAYOUT);
    if (!layout) layout = 'up-down'
    this.changeLayout(layout);
    (editor = CodeMirror.fromTextArea(this.$refs.jsonBox, {
      mode: "text/javascript",
      lineNumbers: !0,
      matchBrackets: !0,
      styleActiveLine: !0,
      lineWrapping: !0
    })).focus(),
      window._OnJsonItemClickByFH = (e => {
        this.overrideJson && this.disableEditorChange(e)
      }
      ),
      editor.on("change", (e, t) => {
        this.jsonFormattedSource = e.getValue().replace(/\n/gm, " "),
          this.fireChange && this.format()
      }
      ),
      "chrome-extension:" === location.protocol && chrome.runtime.onMessage.addListener((e, t, o) => ("TAB_CREATED_OR_UPDATED" === e.type && e.content && e.event === location.pathname.split("/")[1] && (editor.setValue(e.content || this.defaultResultTpl),
        this.format()),
        o && o(),
        !0))
  },
  methods: {
    doSubmit() {
      window.parent.postMessage({
        eventName: 'publibconfig_submit',
        payload: this.jsonFormattedSource
      }, '*')
    },
    format: function () {
      this.errorMsg = "",
        this.placeHolder = this.defaultResultTpl,
        this.jfCallbackName_start = "",
        this.jfCallbackName_end = "";
      let e = editor.getValue().replace(/\n/gm, " ");
      if (!e)
        return !1;
      let t = null
        , o = null;
      try {
        let s = /^([\w\.]+)\(\s*([\s\S]*)\s*\)$/gim.exec(e);
        null != s && (t = s[1],
          e = s[2]),
          o = JSON.parse(e)
      } catch (t) {
        try {
          o = new Function("return " + e)()
        } catch (t) {
          try {
            if ("string" == typeof (o = new Function("return '" + e + "'")()))
              try {
                o = JSON.parse(o)
              } catch (e) {
                o = new Function("return " + o)()
              }
          } catch (e) {
            this.errorMsg = e.message
          }
        }
      }
      if (null != o && "object" == typeof o && !this.errorMsg.length) {
        try {
          let t = document.querySelectorAll("[name=jsonsort]:checked")[0].value;
          "0" !== t && (o = JsonABC.sortObj(o, parseInt(t), !0)),
            e = JSON.stringify(o)
        } catch (e) {
          this.errorMsg = e.message
        }
        this.errorMsg.length || (this.autoDecode ? (async () => {
          let t = await JsonEnDecode.urlDecodeByFetch(e);
          e = JsonEnDecode.uniDecode(t),
            Formatter.format(e)
        }
        )() : Formatter.format(e),
          this.placeHolder = "",
          this.jsonFormattedSource = e,
          null != t ? (this.jfCallbackName_start = t + "(",
            this.jfCallbackName_end = ")") : (this.jfCallbackName_start = "",
              this.jfCallbackName_end = ""),
          this.$nextTick(() => {
            this.updateWrapperHeight()
          }
          ))
      }
      return !this.errorMsg.length || (this.jsonLintSwitch ? this.lintOn() : (this.placeHolder = '<span class="x-error">' + this.errorMsg + "</span>",
        !1))
    },
    compress: function () {
      if (this.format()) {
        let e = this.jfCallbackName_start + this.jsonFormattedSource + this.jfCallbackName_end;
        this.disableEditorChange(e)
      }
    },
    autoDecodeFn: function () {
      this.$nextTick(() => {
        localStorage.setItem(AUTO_DECODE, this.autoDecode),
          this.format()
      }
      )
    },
    uniEncode: function () {
      editor.setValue(JsonEnDecode.uniEncode(editor.getValue()))
    },
    uniDecode: function () {
      editor.setValue(JsonEnDecode.uniDecode(editor.getValue()))
    },
    urlDecode: function () {
      JsonEnDecode.urlDecodeByFetch(editor.getValue()).then(e => editor.setValue(e))
    },
    updateWrapperHeight: function () {
      let e = localStorage.getItem(LOCAL_KEY_OF_LAYOUT)
        , t = document.querySelector("#pageContainer");
      t.style.height = "up-down" === e ? "auto" : Math.max(t.scrollHeight, document.body.scrollHeight) + "px"
    },
    changeLayout: function (e) {
      let t = document.querySelector("#pageContainer");
      "up-down" === e ? (t.classList.remove("layout-left-right"),
        t.classList.add("layout-up-down"),
        this.$refs.btnLeftRight.classList.remove("selected"),
        this.$refs.btnUpDown.classList.add("selected")) : (t.classList.remove("layout-up-down"),
          t.classList.add("layout-left-right"),
          this.$refs.btnLeftRight.classList.add("selected"),
          this.$refs.btnUpDown.classList.remove("selected")),
        localStorage.setItem(LOCAL_KEY_OF_LAYOUT, e),
        this.updateWrapperHeight()
    },
    setCache: function () {
      this.$nextTick(() => {
        localStorage.setItem(EDIT_ON_CLICK, this.overrideJson)
      }
      )
    },
    lintOn: function () {
      return this.$nextTick(() => {
        localStorage.setItem(JSON_LINT, this.jsonLintSwitch)
      }
      ),
        !editor.getValue().trim() || (this.$nextTick(() => {
          if (!this.jsonLintSwitch)
            return;
          let e = JsonLint.lintDetect(editor.getValue());
          isNaN(e.line) || (this.placeHolder = '<div id="errorTips"><div id="tipsBox">???????????????' + (e.line + 1) + "??????" + (e.col + 1) + '????????????????????????????????????</div><div id="errorCode">' + e.dom + "</div></div>")
        }
        ),
          !1)
    },
    disableEditorChange: function (e) {
      this.fireChange = !1,
        this.$nextTick(() => {
          editor.setValue(e),
            this.$nextTick(() => {
              this.fireChange = !0
            }
            )
        }
        )
    },
    setDemo: function () {
      editor.setValue('{"BigIntSupported":995815895020119788889,"date":"20180322","message":"Success !","status":200,"city":"??????","count":632,"data":{"shidu":"34%","pm25":73,"pm10":91,"quality":"???","wendu":"5","ganmao":"??????????????????????????????????????????","yesterday":{"date":"21????????????","sunrise":"06:19","high":"?????? 11.0???","low":"?????? 1.0???","sunset":"18:26","aqi":85,"fx":"??????","fl":"<3???","type":"??????","notice":"????????????????????????????????????"},"forecast":[{"date":"22????????????","sunrise":"06:17","high":"?????? 17.0???","low":"?????? 1.0???","sunset":"18:27","aqi":98,"fx":"?????????","fl":"<3???","type":"???","notice":"????????????????????????????????????"},{"date":"23????????????","sunrise":"06:16","high":"?????? 18.0???","low":"?????? 5.0???","sunset":"18:28","aqi":118,"fx":"???????????????","fl":"<3???","type":"??????","notice":"????????????????????????????????????"},{"date":"24????????????","sunrise":"06:14","high":"?????? 21.0???","low":"?????? 7.0???","sunset":"18:29","aqi":52,"fx":"?????????","fl":"<3???","type":"???","notice":"????????????????????????????????????"},{"date":"25????????????","sunrise":"06:13","high":"?????? 22.0???","low":"?????? 7.0???","sunset":"18:30","aqi":71,"fx":"?????????","fl":"<3???","type":"???","notice":"????????????????????????????????????"},{"date":"26????????????","sunrise":"06:11","high":"?????? 21.0???","low":"?????? 8.0???","sunset":"18:31","aqi":97,"fx":"?????????","fl":"<3???","type":"??????","notice":"????????????????????????????????????"}]}}')
    }
  }
});

function setJson(json) {
  if (json) {
    console.log('frame get data: ', json)
    if (typeof json == 'string') {
      json = JSON.parse(json)
    }
    vm.jsonFormattedSource = json
    vm.disableEditorChange(JSON.stringify(json))
    setTimeout(() => {
      vm.format()
    }, 0);
    setTimeout(() => {
      let j = getJsonText($('.kvov.arrElem.rootKvov'))
      vm.jsonFormattedSource = j
      vm.disableEditorChange(j)
    }, 200);
  }
}

// ????????????????????????
setTimeout(() => {
  let json = {a:1,b:2}
  setJson(json)
}, 1000);

// for small editor height
function setSize(size) {
  vm.size = size
  $('#pageContainer').addClass(size)
}

function showConfirmBtn(val) {
  vm.showConfirmBtn = val
}

function getJsonText(el) {
  let txt = el.text().replace(/":\s/gm, '":').replace(/,$/, '').trim();
  if (!(/^{/.test(txt) && /\}$/.test(txt)) && !(/^\[/.test(txt) && /\]$/.test(txt))) {
    txt = '{' + txt + '}';
  }
  try {
    txt = JSON.stringify(JSON.parse(txt), null, 4);
  } catch (err) {
  }
  return txt;
};

window.vm = vm

window.onload = function () {
  window.parent.postMessage({ eventName: "loaded" }, '*')
}
