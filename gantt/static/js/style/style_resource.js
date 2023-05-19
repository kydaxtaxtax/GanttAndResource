
gantt.templates.histogram_cell_capacity = function(start_date, end_date, resource, tasks, assignments) {
	// if (!gantt.isWorkTime(start_date)) {
	// 	return 0;
	// }

	window.fact = 0;
	window.plan = 0;
	window.histogramFact = 0;
	window.histogramPlan = 0;
	//
	const taskIds = Object.values(tasks).map(elem => elem.id);
	if(taskIds.some((id) => tasksChildSelect.includes(id))) {

		var assignments = gantt.getResourceAssignments(resource.id);
		window.fact = getFact(start_date, end_date, assignments, resource, tasksChildSelect, gantt.getTask(gantt.getSelectedId()));
		window.plan = getPlan(start_date, end_date, tasks, resource, tasksChildSelect, gantt.getTask(gantt.getSelectedId()));
		resource.capacity = 100;
		window.histogramFact = (resource.capacity * fact / plan);
		window.histogramPlan = (resource.capacity * plan / fact);

		return histogramFact <= resource.capacity ? histogramFact : histogramPlan;
	}
};

gantt.templates.histogram_cell_class = function(start_date, end_date, resource, tasks, assignments) {
	if (fact != 0 || plan!= 0){
		if(fact >= plan){
			return "column_green";
		} else {
			return "column_yellow";
		}
	}

};

gantt.templates.histogram_cell_label = function (start_date, end_date, resource, tasks, assignments)
{
	if (tasks.length && !gantt.$resourcesStore.hasChild(resource.id)) {
		if(plan == 0 && fact == 0) return "";
		return fact + " / " + plan;
	} else {
		if (!gantt.$resourcesStore.hasChild(resource.id)) {
			return "";
		}
		return "";
	}
};

gantt.templates.histogram_cell_allocated = function(start_date, end_date, resource, tasks, assignments) {
	// console.log("  ");
	// console.log(histogramFact);
	// console.log(histogramPlan);
	// console.log("  ");
	if(histogramFact && histogramPlan && (histogramFact != 0 || histogramPlan != 0)){
		return histogramFact <= histogramPlan ? histogramFact : histogramPlan;
	}
};






function getFact(start_date, end_date, assignments, resource, resTaskLayout, selectedTask) {
	var result = 0;
	var sel = 0;
	if(assignments){
		assignments.forEach(function(assignment){

			var capasity = gantt.getTask(assignment.task_id).capacity.find(item => item.resource_id === assignment.resource_id);
			var hide_value = capasity ? capasity.hide : false;

			if (((!selectedTask || assignment.task_id == selectedTask.id) ||  resTaskLayout.includes(assignment.task_id)) && hide_value == true && resource.hide == true){
				sel++;
				var task = gantt.getTask(assignment.task_id);
				var tv = 0;

				if(task.start_date >= start_date && task.end_date <= end_date) {    // [  ...  ]
					result += Number(assignment.value)
					tv++ ;
				}
				if(task.start_date <= start_date && task.end_date >= end_date) {    // ....[......]....
					result += (calcBusinessDays(start_date, end_date) * assignment.value) / task.duration;
					tv++ ;
				}
				if(task.start_date < start_date && task.end_date < end_date && task.end_date > start_date) {   // .........[...   ]
					result += (calcBusinessDays(start_date, task.end_date) * assignment.value) / task.duration;
					tv++ ;
				}
				if (task.end_date > end_date && task.start_date > start_date && task.start_date < end_date) {   // [   ...].........
					result += (calcBusinessDays(task.start_date, end_date) * assignment.value) / task.duration;
					tv++ ;
				}
				if(tv >= 2){console.log("ERROR TV >= "+tv+" !!! Условия определения времени сработали 2 раза для одного assigment");return "error"};
				if(tv == 0){console.log("ERROR TV = "+tv+" !!! Не один временной интервал не подходит под условия");return "error"};
			}
		});
		return Number(result.toFixed(2));
	}
}



function getPlan(start_date, end_date, tasks, resource, resTaskLayout, selectedTask) {

	// // Для вывода плана за пределами факта (надо доделать)
	// // console.log(resTaskLayout);
	// if(tasks == 0){
	// 	tasks == 0;
	//
	// 	resTaskLayout.forEach(function (id) {
	// 		var task = gantt.getTask(gantt.getTask(id).parent);
	// 		if((task.render == "split" && (task.start_date < start_date && task.end_date < start_date) && (task.start_date > end_date && task.end_date > end_date)) &&
	// 			((task.planned_start >= start_date && task.planned_start <= end_date) || (task.planned_end >= start_date && task.planned_end <= end_date)) ||
	// 			((task.planned_start < start_date && task.planned_end > end_date))){
	// 			// {
	// 			console.log(tasks);
	// 			tasks.push(task);
	//
	// 		}
	// 	});
	// }

	var result = 0;
	var sel = 0;
	var saveTaskParentId = 0;
	tasks.forEach(function (task) {
		var taskParent = gantt.getTask(task.parent);
		if(((!selectedTask || task.id == selectedTask.id) ||  resTaskLayout.includes(task.id)) && saveTaskParentId != taskParent.id){
			if(task.type == "splittask") {
				task = taskParent;
				saveTaskParentId = task.id;
			}
			sel++;
			var tv = 0;

			if (task.planned_start >= start_date && task.planned_end <= end_date) {    // [  ...  ]
				result += Number(resource.value)
				tv++;
			}
			if (task.planned_start <= start_date && task.planned_end >= end_date) {    // ....[......]....
				result += (calcBusinessDays(start_date, end_date) * resource.value) / task.duration_plan;
				tv++;
			}

			if (task.planned_start < start_date && task.planned_end < end_date && task.planned_end > start_date) {   // .........[...   ]
				result += (calcBusinessDays(start_date, task.planned_end) * resource.value) / task.duration_plan;
				tv++;
			}

			if (task.planned_end > end_date && task.planned_start > start_date && task.planned_start < end_date) {   // [   ...].........
				result += (calcBusinessDays(task.planned_start, end_date) * resource.value) / task.duration_plan;
				tv++;
			}
			if (tv >= 2) {
				console.log("ERROR TV >= " + tv + " !!! Условия определения времени сработали 2 раза для одного assigment");
				return "error"
			}
		}
	});
	return Number(result.toFixed(2));
}

var resourceConfig =
{
scale_height: 45,
row_height: 30,
columns:
	[
		{
			name: "name", label: "Наименование", tree: true, width: 405, template: function (resource) {
				return resource.text;
		}, resize: true
	},

	{
		name: "progress", label: "Прогресс", align: "center", width:90, template: function (resource)
		{
			if ((resource.value == null) || (resource.value == undefined)) return "";// если родитель, то не выводим
			var res = 0;
			var len = 0;
			gantt.getResourceAssignments(resource.id).forEach(function(capacity) {
				if(tasksChildSelect.includes(capacity.task_id)) len += 1;
			});

			gantt.getResourceAssignments(resource.id).forEach(function(capacity) {
				if(tasksChildSelect.includes(capacity.task_id)) res += Number((capacity.value/resource.value)*(100/len));
			});
			return res.toFixed(2) + "%";
		}, resize: true
	},

	{
		name: "workload", label: "Объем по факту", align: "center", width: 120, template: function (resource)
		{
			if ((resource.value == null) || (resource.value == undefined)) return "";// если родитель, то не выводим
			var res = 0;
			gantt.getResourceAssignments(resource.id).forEach(function(capacity) {
				if(tasksChildSelect.includes(capacity.task_id)) {res += Number(capacity.value)}
			});
			return res.toFixed(2)+ " " + resource.unit;
		}, resize: true
	},

	{
		name: "capacity", label: "Объем по плану", align: "center", width: 120, template: function (resource)
			{

			if ((resource.value == null) || (resource.value == undefined))return ""; // если родитель, то не выводим

			var res = 0;
			var Assigments = gantt.getResourceAssignments(resource.id);
			if(resource.hide == true){
				if(Assigments != 0){
					Assigments.forEach(function(capacity) {
						console.log(capacity);
						if(tasksChildSelect.includes(capacity.task_id)) res += Number(resource.value);
					});
				} else {
					res = Number(resource.value);
				}
			}

			return res.toFixed(2)+ " " + resource.unit;
			}
		}
	]
};


function shouldHighlightResource(resource) {
	var selectedTaskId = gantt.getState().selected_task;
	if (gantt.isTaskExists(selectedTaskId)) {
		var selectedTask = gantt.getTask(selectedTaskId),
			selectedResource = selectedTask[gantt.config.resource_property];

		if (resource.id == selectedResource) {
			return true;
		} else if (gantt.$resourcesStore.isChildOf(selectedResource, resource.id)) {
			return true;
		}
	}
	return false;
}

var resourceTemplates = {
	grid_row_class: function(start, end, resource) {
		var css = [];
		if (gantt.$resourcesStore.hasChild(resource.id)) {
			css.push("folder_row");
			css.push("group_row");
		}
		if (shouldHighlightResource(resource)) {
			css.push("highlighted_resource");
		}
		return css.join(" ");
	},
	task_row_class: function(start, end, resource) {
		var css = [];
		if (shouldHighlightResource(resource)) {
			css.push("highlighted_resource");
		}
		if (gantt.$resourcesStore.hasChild(resource.id)) {
			css.push("group_row");
		}

		return css.join(" ");
	}
};