
	gantt.config.dynamic_resource_calendars = true;

	//Custom lightbox configuration
	var dhxWindow = new dhx.Window({
		title: "DHX Window",
		modal: false,
		resizable: true,
		movable: true,
		closable: true,
		header: true,
		footer: true,
		viewportOverflow: true,
		height: 500,
		width: 700,
		minWidth: 400,
		minHeight: 300
	});

	dhxWindow.footer.data.add({
		type: "button",
		view: "flat",
		size: "medium",
		color: "primary",
		value: "Save",
		id: "save",
	});
	dhxWindow.footer.data.add({
		type: "button",
		view: "link",
		size: "medium",
		color: "primary",
		value: "Cancel",
		id: "cancel",
	});
	dhxWindow.footer.data.add({
		type: "button",
		view: "link",
		size: "medium",
		color: "danger",
		value: "Delete",
		id: "delete",
	});


	dhxWindow.footer.events.on("click", function (id) {
		if (id === "save") {
			saveTask()
			dhxWindow.hide()
		}
		if (id === "cancel") {
			dhxWindow.hide()
		}
		if (id === "delete") {
			deleteTask()
			dhxWindow.hide()
		}
	});



	var formatDate = gantt.date.str_to_date("%Y-%m-%d");

	gantt.showLightbox = function (id) {
		dhxWindow.show();

		gantt._lightbox_id = id;
		var task = gantt.getTask(id);
		gantt._lightbox_task = gantt.copy(task);
		gantt._lightbox_links = "load";
		gantt._removed_links = [];


		var title = document.querySelector(".dhx_navbar-title")
		title.innerHTML = task.text || "New task"

		addTabBar()
}


	dhxWindow.handLightboxClick = function (e) {
		var tab = gantt._tabbar.getActive();
		var functionName = e.target.dataset.onclick;
		var functionArgument = e.target.dataset.onclick_argument;
		if (functionName) {
			gantt.$lightboxControl[tab][functionName](functionArgument);
		}
	}


	dhxWindow.events.on("AfterShow", function (position) {
		gantt.event(dhxWindow._popup, "click", dhxWindow.handLightboxClick);
	});
	dhxWindow.events.on("BeforeHide", function (position, events) {
		gantt.hideLightbox();
		gantt.eventRemove(dhxWindow._popup, "click", dhxWindow.handLightboxClick);
	});


	gantt.hideLightbox = function () {
		if (gantt._lightbox_task.$new) {
			deleteTask()
		}
		gantt._lightbox_task = null;
		gantt._lightbox_id = null;
	}


	function saveTask() {
		var id = gantt.getState().lightbox;

		var task = gantt.getTask(gantt._lightbox_id);

		// update task properties
		gantt.mixin(task, gantt._lightbox_task)

		var taskParent = gantt.getTask(task.parent);
		// var taskPrevSibiling = gantt.getTask(gantt.getPrevSibling(task.id));
		if (task.type == "task") {
			task.render = "split";
			task.type = "project";
			gantt.updateTask(task.id);
		}
		if (task.type == "project") {
			if (taskParent) {
				task.start_date = gantt.date.day_start(new Date());
				gantt.getTask(taskParent.id).open = 1;
				gantt.updateTask(taskParent.id);
			}
		}

		if(task.$new) {
			if (taskParent && taskParent.render == "split") {
				taskParent.planned_start = task.start_date;
				taskParent.planned_end = task.end_date;

				if (gantt.getChildren(taskParent.id).length > 1) {
					gantt.addLink({
						source: gantt.getPrevSibling(task.id),
						target: task.id,
						type: gantt.config.links.finish_to_start
					});

				}
			}
		}
		if (task.$new) {
			delete gantt._lightbox_task.$new;
			delete task.$new;
			gantt.addTask(task)
		}
		else {
			gantt.updateTask(id)
		}

		//update resources
		var assignmentStore = gantt.getDatastore(gantt.config.resource_assignment_store);
		var assignments = gantt._lightbox_task[gantt.config.resource_property] || [];
		for (var i = 0; i < assignments.length; i++) {
			var updatedAssignment = assignments[i]
			var existingAssignmentId = updatedAssignment.$id;
			var existingAssignment = assignmentStore.getItem(existingAssignmentId)
			if (existingAssignment) {
				for (var property in updatedAssignment) {
					existingAssignment[property] = updatedAssignment[property]
				}
			}
			else {
				//assignmentStore.addItem(resource)
			}
		}


	}
	function deleteTask() {
		var id = gantt.getState().lightbox;
		gantt.deleteTask(id)
	}


	function addTabBar() {
		if (gantt._tabbar) gantt._tabbar.destructor();

		gantt._tabbar = new dhx.Tabbar(null, {
			views: [
				{ id: "splitProject", tab: "Параметры проекта", css: "panel flex" },
				{ id: "resources", tab: "Ресурсы", css: "panel flex" }
			]
		});
		dhxWindow.attach(gantt._tabbar)

		dhx.awaitRedraw().then(function () {
			gantt.$lightboxControl.fillTabContent()
		})


		gantt._tabbar.events.on("Change", function (activeId, prevId) {
			gantt.$lightboxControl.fillTabContent(activeId)
		});
	}


	gantt.$lightboxControl = {
		splitProject: {},
		resources: {}
	};


	gantt.$lightboxControl.fillTabContent = function (id) {
		id = id || "splitProject"
		gantt.$lightboxControl[id].addForm();
	}
	// initTaskEditForm();
	initResourceEditForm();
	initsplitProjectEditForm();