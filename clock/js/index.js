var AnalogClock = {
  template: '#analog-clock',
  props: { minute: Number, tick: Number },
  data: function data() {
    return {
      rotation: { hours: 0, minutes: 0, seconds: 0 } };

  },
  computed: {
    hours: function hours() {
      return { transform: 'translate3d(-50%, 0, 0) rotate(' + this.rotation.hours + 'deg)' };
    },
    minutes: function minutes() {
      return { transform: 'translate3d(-50%, 0, 0) rotate(' + this.rotation.minutes + 'deg)' };
    },
    seconds: function seconds() {
      return { transform: 'translate3d(-50%, 0, 0) rotate(' + this.rotation.seconds + 'deg)' };
    } },

  watch: {
    tick: function tick() {
      this.rotation.seconds += 6;
      this.rotation.minutes += 0.1;
    },
    minute: function minute(to, from) {
      if (from === to) return;
      this.rotation.hours += 0.5;
    } },

  mounted: function mounted() {
    var date = new Date();var _ref =
    [date.getHours(), date.getMinutes(), date.getSeconds()],h = _ref[0],m = _ref[1],s = _ref[2];
    this.rotation = {
      hours: h * 30 + m * 0.5,
      minutes: m * 6 + s * 0.1,
      seconds: s * 6 };

  } };


var TextClock = {
  template: '#text-clock',
  props: ['time'],
  data: function data() {var _this = this;
    return {
      timeMap: {
        20: 'twenty',
        30: 'thirty',
        40: 'forty',
        50: 'fifty',
        0: [null, 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
        10: [null, 'eleven', 'twelve', 'thirteen', 'fourteen', 'quarter', 'sixteen', 'seventeen', 'eighteen', 'nineteen'],
        hours: [null, 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'] },

      parsers: [{
        test: function test(n) {return !n;},
        parse: function parse() {return { m: 'o\'clock' };} },
      {
        test: function test(n) {return n <= 10;},
        parse: function parse(n) {return { r: 1, m: _this.timeMap[0][n] + ' ' + (!n % 5 ? 'after' : 'past') };} },
      {
        test: function test(n) {return ~[15, 30, 45].indexOf(n);},
        parse: function parse(n) {return { r: 1, m: (n === 30 ? 'half' : 'quarter') + ' ' + (n <= 30 ? 'past' : 'to') };} },
      {
        test: function test(n) {return ~[50, 55].indexOf(n);},
        parse: function parse(n) {return { r: 1, m: _this.timeMap[0][-(n % 10) + 10] + ' to' };} },
      {
        test: function test(n) {return n < 20;},
        parse: function parse(n) {return { m: _this.timeMap[10][n % 10] };} },
      {
        test: function test(n) {return n;},
        parse: function parse(n) {return { m: '' + _this.timeMap[(n * 0.1 | 0) * 10] + (n % 10 ? '-' + _this.timeMap[0][n % 10] : '') };} }] };


  },
  computed: {
    meridiem: function meridiem() {
      return this.time.hours < 12 ? 'a' : 'p';
    },
    output: function output() {var _this2 = this;var _time =
      this.time,h = _time.hours,m = _time.minutes;var _parsers$find$parse =
      this.parsers.
      find(function (_ref2) {var test = _ref2.test;return test(m);}).
      parse(m),reverse = _parsers$find$parse.r,minutes = _parsers$find$parse.m;

      var hours = [h].
      map(function (h) {return h > 12 ? h - 12 : h || 12;}).
      map(function (h) {return (/\sto$/.test(minutes) ? h + 1 : h);}).
      map(function (h) {return h > 12 ? 1 : h;}).
      map(function (h) {return _this2.timeMap.hours[h];}).
      reduce(function (h) {return h;});

      return reverse ? [minutes, hours] : [hours, minutes];
    } } };



new Vue({
  el: '#clock',
  components: { AnalogClock: AnalogClock, TextClock: TextClock },
  data: function data() {
    return {
      tick: 0,
      time: { hours: 0, minutes: 0, seconds: 0 } };

  },
  methods: {
    updateTime: function updateTime(time) {var _this3 = this;
      this.tick++;
      this.time = {
        hours: time.getHours(),
        minutes: time.getMinutes(),
        seconds: time.getSeconds() };


      setTimeout(function () {return _this3.updateTime(new Date());}, 1000 - new Date().getMilliseconds());
    } },

  mounted: function mounted() {
    this.updateTime(new Date());
  } });