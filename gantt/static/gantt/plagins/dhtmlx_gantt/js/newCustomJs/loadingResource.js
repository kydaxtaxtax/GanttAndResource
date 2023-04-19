gantt.$resourcesStore = gantt.createDatastore({
	name: gantt.config.resource_store,
	type: "treeDatastore",
	initItem: function(item) {
		item.parent = item.parent || gantt.config.root_id;
		item[gantt.config.resource_property] = item.parent;
		item.open = true;
		return item;
	}
});


gantt.attachEvent("onParse", function(){
	window.tasksChildSelect = getSplitTaskIds();// Глобальная переменная тасков выбранной задачи

	var taskParent = gantt.getTaskBy(task => task.parent == 0);
	gantt.$resourcesStore.parse(resourceGet(taskParent[0]));

	gantt.eachTask(function(task) {
		if(task.render == "split"){
			task.duration_plan = calcBusinessDays(task.planned_start, task.planned_end);
    		gantt.updateTask(task.id);
		}
	});
	return true;
});

gantt.attachEvent("onTaskSelected", function (id)
    {
		window.tasksChildSelect = getSplitTaskIds();// Глобальная переменная тасков выбранной задачи

		var selectTask = gantt.getTask(id);

		if(selectTask.$new != true){
			gantt.$resourcesStore.clearAll();
			gantt.$resourcesStore.parse(resourceGet(selectTask));
			return true;

		} else {
					gantt.$resourcesStore.clearAll();
			return true;
		}
return true;
    });

// Нужно доделать мультиселект
function resourceGet(selectTask){
	var resources = [];
	if(selectTask.type == "splittask"){
		resources = gantt.getTask(selectTask.parent).resources;
	} else {
		if (selectTask.render == "split") {
			resources = selectTask.resources;
		} else {
			gantt.eachTask(function(task) {
				if (task.resources) {
					(task.resources).forEach(function(resource) {
						resources.push(resource);
					});
				}
			}, selectTask.id);
		// Убираем дубликаты из массива ресурсов
		resources = resources.reduce((acc, city) => {
		if (acc.map[city.text]){
			return acc;
		}
		acc.map[city.text] = true;
		acc.resources.push(city);
		return acc;}, {map: {}, resources: []}).resources;
		}
	}
	return resources ? resources : [];
}

gantt.$resourcesStore.attachEvent("onParse", function() {
	var capasity = [];
	gantt.$resourcesStore.eachItem(function(res) {
		if (!gantt.$resourcesStore.hasChild(res.id)) {
			var copy = gantt.copy(res);
			copy.key = res.id;
			copy.label = res.text + (res.value ? " (" + res.value.toFixed(2) + ")" : "");
			// copy.label = res.text + res.value || " (" + res.value + ")";
			copy.unit = "hours";
			capasity.push(copy);
		}
	});
	gantt.updateCollection("capasity", capasity);
	gantt.refreshData();
});

function getChildProject(taskUpdate = null) {
	var resTasksLayout = [];
	if (taskUpdate) {
		gantt.eachTask(function (task) {
			if (task.render != "split" && task.type == "project") resTasksLayout.push(gantt.getTask(task.id));
		}, taskUpdate.id);
		return resTasksLayout;
	}
}


function getChildSplitProject(taskUpdate = null) {
	var resTasksLayout = [];
	if(taskUpdate.render == "split") {
		resTasksLayout.push(taskUpdate);
		return resTasksLayout;
	}

	if (taskUpdate) {
		gantt.eachTask(function (task) {
			if (task.render == "split" && task.type == "project") resTasksLayout.push(gantt.getTask(task.id));
		}, taskUpdate.id);
		return resTasksLayout;
	}
}

function getSplitTaskIds(taskUpdate = null, ignoreTask = null){
	var resTasksLayout = [];
	if(taskUpdate){
		gantt.eachTask(function(task) {
			if(ignoreTask
				? task.type == "splittask" && !getSplitTaskIds(ignoreTask).includes(task.id)
				: task.type == "splittask") resTasksLayout.push(task.id);
		},taskUpdate.id);
		return resTasksLayout;
	}

	if(!gantt.getSelectedId()) {
		gantt.eachTask(function(task) {
			if(task.type == "splittask") resTasksLayout.push(task.id);
		});
		return resTasksLayout;
	}

	if(gantt.getSelectedId() && gantt.getTask(gantt.getSelectedId()).type == "splittask") {
		resTasksLayout.push(Number(gantt.getSelectedId()));
		return resTasksLayout;
	}

	gantt.eachTask(function(task) {
		if(task.type == "splittask") resTasksLayout.push(task.id);
	},gantt.getSelectedId());
return resTasksLayout;
}

