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
	if(gantt.getTaskCount() > 0) {
		window.tasksChildSelect = getSplitTaskIds();// Глобальная переменная тасков выбранной задачи

		var taskParent = gantt.getTaskBy(task => task.parent == 0);
		gantt.$resourcesStore.parse(resourceGet(taskParent[0]));

		gantt.eachTask(function (task) {
			if (task.render == "split") {
				task.duration_plan = calcBusinessDays(task.planned_start, task.planned_end);
				gantt.updateTask(task.id);
			}
		});
		return true;
	}
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
			// gantt.$resourcesStore.clearAll();
			return true;
		}
	return true;
    });

// Нужно доделать мультиселект
function resourceGet(selectTask){
	var resources = [];
	if(gantt.getTaskCount() > 0){
		if(selectTask && selectTask.type == "splittask"){
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
}

gantt.$resourcesStore.attachEvent("onParse", function() {
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

function addDefaultResources(task){
	if(!task[gantt.config.resource_store]) task[gantt.config.resource_store] = [];
	 if(task.resources.length == 0 && task.render == "split") {
        var resourse1 = {
            $expanded_branch: true,
            $level: 0,
            $local_index: 0,
            $open: true,
            $rendered_parent: 0,
            calendar: "global",
            capacity: 0,
            hide: true,
            id: 1 + "",
            open: true,
            owner: 0,
            parent: 0,
            text: "Трудозатраты",
            unit: ""
        }

        var resourse2 = {
            $expanded_branch: true,
            $level: 0,
            $local_index: 1,
            $open: true,
            $rendered_parent: 0,
            calendar: "global",
            capacity: 0,
            hide: true,
            id: 2 + "",
            open: true,
            owner: 0,
            parent: 0,
            text: "Материалы",
            unit: ""
        }

        var resourse3 = {
            $expanded_branch: true,
            $level: 0,
            $local_index: 2,
            $open: true,
            $rendered_parent: 0,
            calendar: "global",
            capacity: 0,
            hide: true,
            id: 3 + "",
            open: true,
            owner: 0,
            parent: 0,
            text: "Эксплуатация машин",
            unit: ""
        }
        task[gantt.config.resource_store].push(resourse1);
        task[gantt.config.resource_store].push(resourse2);
        task[gantt.config.resource_store].push(resourse3);
		return task;
    }
}


