
// DATA PIXER
	var calendar_init = function (id, data, date) {
		var obj = new dhtmlXCalendarObject(id);
		obj.setDateFormat(data.date_format ? data.date_format : '');
		obj.setDate(date ? date : (new Date()));
		obj.hideTime();
		if (data.skin)
			obj.setSkin(data.skin);
		return obj;
	};
	gantt.form_blocks["dataPixerPeriodF"] = {
		render: function (sns) {
			return "<div class='dhx_calendar_cont'><input type='text' readonly='true' id='calendar1'/> – "
				+ "<input type='text' readonly='true' id='calendar2'/></div>";
		},
		set_value: function (node, value, task, data) {
			var a = node._cal_start = calendar_init('calendar1', data, task.start_date);
			var b = node._cal_end = calendar_init('calendar2', data, task.end_date);
			var c = node.lastChild;

			b.setInsensitiveRange(null, new Date(a.getDate(false) - 86400000));

			var a_click = a.attachEvent("onClick", function (date) {
				b.setInsensitiveRange(null, new Date(date.getTime() - 86400000));

			});

			var b_click = b.attachEvent("onClick", function (date) {

			});

			var a_time_click = a.attachEvent("onChange", function (d) {
				b.setInsensitiveRange(null, new Date(d.getTime() - 86400000));

			});

			var b_time_click = b.attachEvent("onChange", function (d) {

			});


			var id = gantt.attachEvent("onAfterLightbox", function () {
				a.detachEvent(a_click);
				a.detachEvent(a_time_click);
				a.unload();
				b.detachEvent(b_click);
				b.detachEvent(b_time_click);
				b.unload();
				a = b = null;
				this.detachEvent(id);
			});

			document.getElementById('calendar1').value = a.getDate(true);
			document.getElementById('calendar2').value = b.getDate(true);

		},
		get_value: function (node, task) {
			task.start_date = node._cal_start.getDate(false);
			task.end_date = node._cal_end.getDate(false);
			return task;
		},
		focus: function (node) {
		}
	};


	gantt.form_blocks["dataPixerPeriodP"] = {
		render: function (sns) {
			return "<div class='dhx_calendar_cont'><input type='text' readonly='true' id='calendar1'/> – "
				+ "<input type='text' readonly='true' id='calendar2'/></div>";
		},
		set_value: function (node, value, task, data) {
			var a = node._cal_start = calendar_init('calendar1', data, task.planned_start);
			var b = node._cal_end = calendar_init('calendar2', data, task.planned_end);
			var c = node.lastChild;

			b.setInsensitiveRange(null, new Date(a.getDate(false) - 86400000));

			var a_click = a.attachEvent("onClick", function (date) {
				b.setInsensitiveRange(null, new Date(date.getTime() - 86400000));

			});

			var b_click = b.attachEvent("onClick", function (date) {

			});

			var a_time_click = a.attachEvent("onChange", function (d) {
				b.setInsensitiveRange(null, new Date(d.getTime() - 86400000));

			});

			var b_time_click = b.attachEvent("onChange", function (d) {

			});


			var id = gantt.attachEvent("onAfterLightbox", function () {
				a.detachEvent(a_click);
				a.detachEvent(a_time_click);
				a.unload();
				b.detachEvent(b_click);
				b.detachEvent(b_time_click);
				b.unload();
				a = b = null;
				this.detachEvent(id);
			});

			document.getElementById('calendar1').value = a.getDate(true);
			document.getElementById('calendar2').value = b.getDate(true);

		}
		,
		get_value: function (node, task) {
			task.planned_start = node._cal_start.getDate(false);
			task.planned_end = node._cal_end.getDate(false);
			return task;
		},
		focus: function (node) {
		}
	};
