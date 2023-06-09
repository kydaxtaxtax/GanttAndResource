function initSettingsTaskAndProjectEditForm() {
	const ru = {
    // short names of months
    monthsShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн",
                 "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
    // full names of months
    months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
            "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    // short names of days
    daysShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    // full names of days
    days: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг",
                "Пятница", "Суббота"]
	};
	dhx.i18n.setLocale("calendar", ru);
	gantt.$lightboxControl.settingsTaskAndProject.addForm = function () {
		var task = gantt.getTask(gantt._lightbox_id);
		if(task.type == "project"){
			var startDate = "planned_start";
			var endDate = "planned_end";
			var duration = "duration_plan";

			var strStartDate = task.planned_start;
			var strEndDate = task.planned_end;
			var strDuration = task.duration_plan;
		} else {
			var startDate = "start_date";
			var endDate = "end_date";
			var duration = "duration";

			var strStartDate = task.start_date;
			var strEndDate = task.end_date;
			var strDuration = task.duration;
		}

		if (gantt._lightbox_task) {
			task = gantt._lightbox_task;
		}
		// console.log(task);
		var taskFormRows = {
			text: {
				weekStart: "monday",
				name: "text",
				type: "input",
				label: "Наименование",
				id: "text",
				labelPosition: "top",
				labelWidth: 100,
				required: true,
				value:task.text,
			},
				start_date: {
				disabledDates: function(date) {return disabledDays[date.getDay()]},
				weekStart: "monday",
				name: "start_date",
				type: "datepicker",
				label: task.type == "project" ? "Дата начала по плану" : "Дата начала по факту",
				id: startDate,
				required: true,
				labelPosition: "top",
				labelWidth: 200,
				dateFormat: "%d-%m-%Y",
				value: strStartDate,
			},
			end_date: {
				disabledDates: function(date) {return disabledDays[date.getDay()]},
				weekStart: "monday",
				name: "end_date",
				type: "datepicker",
				label: task.type == "project" ? "Дата окончания по плану" : "Дата окончания по факту",
				id: endDate,
				required: true,
				labelPosition: "top",
				labelWidth: 200,
				dateFormat: "%d-%m-%Y",
				value: strEndDate,

			},
			duration: {
				// readOnly: true,
				name: "duration",
				type: "input",
				inputType: "text",
				label: "Рабочие дни",
				id: duration,
				labelPosition: "top",
				labelWidth: 150,
				// required: true,
				value: strDuration,
			},
			// progress: {
			// 	name: "progress",
			// 	type: "slider",
			// 	id: "progress",
			// 	label: "Progress",
			// 	labelPosition: "top",
			// 	labelWidth: 100,
			// 	readonly: true,
			// 	min: 0,
			// 	max: 100,
			// 	value: task.progress * 100,
			// },
		};

		var taskFormRowsForGrid = [
			taskFormRows["text"],
			taskFormRows[startDate],
			taskFormRows[endDate],
			taskFormRows[duration],
			taskFormRows["progress"],
		];

		if (gantt._taskForm) gantt._taskForm.destructor();
		gantt._taskForm = new dhx.Form(null, {
			css: "dhx_widget--bordered",
			rows: [
					taskFormRows["text"],
					{
						align: "between",
						cols: [taskFormRows["start_date"],
							taskFormRows["end_date"],
							taskFormRows["duration"]]
					}
			]
		});
		gantt._tabbar.getCell("settingsTaskAndProject").attach(gantt._taskForm);

		gantt._taskForm.events.on("Change", function (name, new_value) {
			var task = gantt._lightbox_task;

			var updatedTask = gantt._taskForm.getValue();
			// document.querySelector("#start_date").innerHTML = updatedTask.start_date;
			task.text = updatedTask.text;
			task.tags = updatedTask.tags;
			task.progress = updatedTask.progress / 100;

			var new_start_date = updatedTask.start_date;
			var new_end_date = updatedTask.end_date;
			var new_duration = updatedTask.duration;
			var old_end_date = +new Date(task[endDate]);

			if (new_start_date instanceof Date) {
				// do nothing
			} else {
				task[startDate] = gantt.date.parseDate(new_start_date, "%d-%m-%Y");
			}

			if (task[duration] != new_duration) {
				task[duration] = new_duration;
				task[endDate] = gantt.calculateEndDate({ start_date: task[startDate], duration: task[duration], task: task });
				new_end_date = task[endDate];
			}

			if (new_end_date instanceof Date && +old_end_date == +new_end_date) {
				// do nothing
			} else {
				new_end_date = gantt.date.parseDate(new_end_date, "%d-%m-%Y");
				if (+old_end_date != +new_end_date) {
					task.end_date = new_end_date;
					// task.duration = gantt.calculateDuration({ start_date: task.start_date, end_date: task.end_date, task: task });
				}
			}
		});
	};
}
