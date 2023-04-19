function initTaskEditForm() {
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
	gantt.$lightboxControl.task.addForm = function () {
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
				label: "Task name",
				id: "text",
				labelPosition: "left",
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
				label: "Start Date",
				id: "start_date",
				required: true,
				labelPosition: "left",
				labelWidth: 100,
				value: task.start_date,
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
				label: "End Date",
				id: "end_date",
				required: true,
				labelPosition: "left",
				labelWidth: 100,
				value: task.end_date,

			},
			duration: {
				readonly: 1,
				name: "duration",
				type: "input",
				inputType: "number",
				label: "Duration",
				id: "duration",
				labelPosition: "left",
				labelWidth: 100,
				required: true,
				value: task.duration,
			},

			tags: {
				name: "tags",
				type: "combo",
				label: "Tags",
				id: "end_date",
				labelPosition: "left",
				labelWidth: 100,
				multiselection: true,
				value: ["1", "4"],
				data: [
					{ value: "Important", id: "1" },
					{ value: "Urgent", id: "2" },
					{ value: "External", id: "3" },
					{ value: "Planned", id: "4" },
					{ value: "Teamwork", id: "5" },
				],
				value: task.tags,
			},
			progress: {
				name: "progress",
				type: "slider",
				id: "progress",
				label: "Progress",
				labelPosition: "left",
				labelWidth: 100,
				min: 0,
				max: 100,
				value: task.progress * 100,
			},
		};

		var taskFormRowsForGrid = [
			taskFormRows["text"],
			taskFormRows["start_date"],
			taskFormRows["end_date"],
			taskFormRows["duration"],
			taskFormRows["tags"],
			taskFormRows["progress"],
		];

		if (gantt._taskForm) gantt._taskForm.destructor();
		gantt._taskForm = new dhx.Form(null, {
			css: "dhx_widget--bordered",
			rows: taskFormRowsForGrid,
		});
		gantt._tabbar.getCell("task").attach(gantt._taskForm);

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
