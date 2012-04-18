/*
* Models
*/

var Pin = Backbone.Model.extend({});

/*
* Collections
*/
var PinsCollection = Backbone.Collection.extend({
	"model": Pin,

	"sync": function (method, model, options) {
		options.dataType = "jsonp";
		return Backbone.sync(method, model, options);
	},

	"parse": function (response) {
		return response.pins;
	},

	"url": "http://pazguillermo.com.ar:8080/pinterest/hottest"
});

/*
* Views
*/
var PinView = Backbone.View.extend({
	"tagName": "li",

	"template": _.template($("#tpl-pin").html()),

	"render": function () {
		var pin = this.model.toJSON();

		$(this.el).html(this.template(pin));

		return this;
	}
});

var AppView = Backbone.View.extend({
	"el": "#hottest",

	"initialize": function () {
		this.page = 1;
		this.limit = 10;
		this.collection = new PinsCollection();
		
		this.$el
			.prepend(this.$list);

		this.$el.removeClass("ch-hide");

		this.reset();

		this.fetch();
	},

	"events": {
		"scroll": "more",
		"click .repin": "repin"
	},

	"$list": $("<ul class=\"ch-slats ch-hide\">"),

	"$loading": $(".ch-loading"),

	"render": function () {
		var that = this;

		_.each(this.collection.models, function (pin) {
			var pin = new PinView({"model": pin});
			that.$list.append(pin.render().el);
		}, this);

		this.$list.removeClass("ch-hide");

		that.trigger("end");

		return this;
	},

	"fetch":  function () {
		var that  = this;

		this.$loading.removeClass("ch-hide");

		this.collection.fetch({
			"data": {
				"limit": this.limit,
				"page": that.page
			},
			"success": function () {
				that.$loading.addClass("ch-hide");
				that.render();
			}
		});
	},

	"more": function () {
		var height = this.$list.height() - 500;
		var bottom = this.el.scrollTop;
		if (height === bottom) {
			this.page += 1;
			this.fetch();
		};

		return;
	},

	"repin": function (event) {		
		chrome.tabs.create({url: event.target.href});
		window.close();

		return false;
	},

	"reset": function () {
		this.page = 1;
		this.collection.reset();
		this.$list.html("");
	}

});
var hottest;
setTimeout(function () {
	hottest = new AppView();
}, 1000);