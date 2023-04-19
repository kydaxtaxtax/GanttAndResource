gantt.attachEvent("onAfterTaskDrag", function (id, mode) {
	var task = gantt.getTask(id);
	if (mode == gantt.config.drag_mode.progress) {
		var pr = Math.floor(task.progress * 100 * 10) / 10;
		gantt.message({ type:"myCssG", text: task.text + "<p>выполнено " + pr + "%</p>"});
	} else {
		var convert = gantt.date.date_to_str("%d.%m.%y в %H:%i");
		var s = convert(task.start_date);
		var e = convert(task.end_date);
		gantt.message({ type:"myCssG", text: task.text + " <p>Начало: " + s + " <br>Конец: " + e + "</p>"});
	}
});


gantt.attachEvent("onBeforeTaskDrag", function (id, mode) {
	var task = gantt.getTask(id);
	var message = task.text + " ";

	if (mode == gantt.config.drag_mode.progress) {
		message += "<p>прогресс обновляется</p>";
	} else {
		message += "";
		if (mode == gantt.config.drag_mode.move)
			message += "<p>перенесено</p>";
		else if (mode == gantt.config.drag_mode.resize)
			message += "<p>изменено</p>";
	}

	gantt.message({ type:"myCssG", text: message});
	return true;
});
