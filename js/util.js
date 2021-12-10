Date.prototype.format = function(e) {
  let t = function(e, t) {
      let n = ""
        , r = e < 0
        , o = String(Math.abs(e));
      return o.length < t && (n = new Array(t - o.length + 1).join("0")),
      (r ? "-" : "") + n + o
  };
  if ("string" != typeof e)
      return this.toString();
  let n = function(t, n) {
      e = e.replace(t, n)
  }
    , r = this.getFullYear()
    , o = this.getMonth() + 1
    , i = this.getDate()
    , s = this.getHours()
    , l = this.getMinutes()
    , a = this.getSeconds()
    , c = this.getMilliseconds();
  return n(/yyyy/g, t(r, 4)),
  n(/yy/g, t(parseInt(r.toString().slice(2), 10), 2)),
  n(/MM/g, t(o, 2)),
  n(/M/g, o),
  n(/dd/g, t(i, 2)),
  n(/d/g, i),
  n(/HH/g, t(s, 2)),
  n(/H/g, s),
  n(/hh/g, t(s % 12, 2)),
  n(/h/g, s % 12),
  n(/mm/g, t(l, 2)),
  n(/m/g, l),
  n(/ss/g, t(a, 2)),
  n(/s/g, a),
  n(/SSS/g, t(c, 3)),
  n(/S/g, c),
  e
}