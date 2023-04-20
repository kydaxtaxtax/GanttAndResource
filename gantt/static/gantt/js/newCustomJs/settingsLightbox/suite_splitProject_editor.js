function initsplitProjectEditForm() {
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
	gantt.$lightboxControl.splitProject.addForm = function () {
		var task = gantt.getTask(gantt._lightbox_id);
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
				value: task.text,
			},
				start_date: {
				disabledDates: function(date) {
					const disabled = {
						1: false,
						2: false,
						3: false,
						4: false,
						5: false,
						6: true,
						0: true
					}
					return disabled[date.getDay()];
				},
				weekStart: "monday",
				name: "start_date",
				type: "datepicker",
				label: "Дата начала по плану",
				id: "start_date",
				required: true,
				labelPosition: "top",
				labelWidth: 200,
				value: task.planned_start,
			},
			end_date: {
				disabledDates: function(date) {
					const disabled = {
						1: false,
						2: false,
						3: false,
						4: false,
						5: false,
						6: true,
						0: true
					}
					return disabled[date.getDay()];
				},

				weekStart: "monday",
				name: "end_date",
				type: "datepicker",
				label: "Дата окончания по плану",
				id: "end_date",
				required: true,
				labelPosition: "top",
				labelWidth: 200,
				value: task.planned_end,

			},
			duration: {
				readonly: true,
				name: "duration",
				type: "input",
				inputType: "number",
				label: "Продолжительность",
				id: "duration",
				labelPosition: "top",
				labelWidth: 150,
				required: true,
				value: task.duration,
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
			taskFormRows["start_date"],
			taskFormRows["end_date"],
			taskFormRows["duration"],
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
		gantt._tabbar.getCell("splitProject").attach(gantt._taskForm);

		gantt._taskForm.events.on("Change", function (name, new_value) {
			var task = gantt._lightbox_task;

			var updatedTask = gantt._taskForm.getValue();
			console.log(updatedTask);
			// document.querySelector("#start_date").innerHTML = updatedTask.start_date;
			task.text = updatedTask.text;
			task.tags = updatedTask.tags;
			task.progress = updatedTask.progress / 100;

			var new_start_date = updatedTask.start_date;
			var new_end_date = updatedTask.end_date;
			var new_duration = updatedTask.duration;
			var old_end_date = +new Date(task.end_date);

			if (new_start_date instanceof Date) {
				// do nothing
			} else {
				task.start_date = gantt.date.parseDate(new_start_date, "%d/%m/%y");
			}

			if (task.duration != new_duration) {
				task.duration = new_duration;
				task.end_date = gantt.calculateEndDate({ start_date: task.start_date, duration: task.duration, task: task });
				new_end_date = task.end_date;
			}

			if (new_end_date instanceof Date && +old_end_date == +new_end_date) {
				// do nothing
			} else {
				new_end_date = gantt.date.parseDate(new_end_date, "%d/%m/%y");
				if (+old_end_date != +new_end_date) {
					task.end_date = new_end_date;
					// task.duration = gantt.calculateDuration({ start_date: task.start_date, end_date: task.end_date, task: task });
				}
			}
		});
	};
}
