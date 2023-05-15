gantt.config.dynamic_resource_calendars = true;
window.disabledDays = {1: false, 2: false, 3: false, 4: false, 5: false, 6: true, 0: true};

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

gantt.showLightbox = function (id) {
    dhxWindow.show();
    gantt._lightbox_id = id;
    var task = gantt.getTask(id);
    var taskParent = gantt.getTask(task.parent);
    if (task.$new) {
        if (taskParent && taskParent.render != "split") {
            task.render = "split";
            task.type = "project";
            gantt.updateTask(task.id);
        }
    }
    addDefaultResources(task);
    gantt._lightbox_task = gantt.copy(task);
    var title = document.querySelector(".dhx_navbar-title")
    title.innerHTML = task.text || "New task"
    addTabBarSettingsTaskAndProject(task)
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
    gantt.$resourcesStore.eachItem(function (resource) {
        if(resource.type == "project"){
            resource.parent = 0;
        }
    });

    if (gantt._lightbox_task.$new) {
        deleteTask()
    }
    gantt._lightbox_task = null;
    gantt._lightbox_id = null;
}


function saveTask() {
    var id = gantt.getState().lightbox;
    var task = gantt.getTask(gantt._lightbox_id);
    gantt.mixin(task, gantt._lightbox_task, true)
    var taskParent = gantt.getTask(task.parent);

    if (task.type == "project") {
        if (taskParent) {
            task.start_date = gantt.date.day_start(new Date());
            gantt.getTask(taskParent.id).open = 1;
            gantt.updateTask(taskParent.id);
        }
    }

    if (task.$new) {
        if(task.parent == 0){
                task.parent = null;
                task.parent = gantt.getTaskBy(task => task.parent == 0)[0].id;
        }
        // if (taskParent && taskParent.render != "split") {
        //     task.render = "split";
        //     task.type = "project";
        //     gantt.updateTask(task.id);
        // }

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
        } else {
            //assignmentStore.addItem(resource)
        }
    }

    if (task.$new) {
        delete gantt._lightbox_task.$new;
        delete task.$new;
        gantt.addTask(task);
    } else {
        gantt.updateTask(id)
    }
    gantt.updateTask(id);
    updateLine();
}

function deleteTask() {
    var id = gantt.getState().lightbox;
    gantt.deleteTask(id)
}


function addTabBarSettingsTaskAndProject(task) {
 var taskParent = gantt.getTask(task.parent);
    gantt.$lightboxControl.fillTabContent = function (id) {
        task.type == "project" && task.render != "split" || !taskParent ? id = id || "settingsFolder" : id = id || "settingsTaskAndProject";
        gantt.$lightboxControl[id].addForm();
    }
    if (gantt._tabbar) gantt._tabbar.destructor();


    if(taskParent){
        gantt._tabbar = new dhx.Tabbar(null, {
            // css: "custom",
            views: [
                {
                    id: task.type == "project" && task.render != "split" ? "settingsFolder" : "settingsTaskAndProject",
                    tab:  task.type == "splittask" ? "Параметры задачи" : "Параметры проекта",
                    css: "panel flex"
                },

                {
                    id: task.type == "splittask" ? "capacity" : "resources",
                    tab: task.type == "splittask" ? "Нагрузка" : "Ресурсы",
                    css: "panel flex"
                }
            ]
        });
    } else {
       gantt._tabbar = new dhx.Tabbar(null, {
        // css: "custom",
               views: [
                {
                    id: "settingsFolder",
                    tab: "Параметры папки",
                    css: "panel flex"
                }
            ]
        });
    }


    dhxWindow.attach(gantt._tabbar)
    dhx.awaitRedraw().then(function () {
        gantt.$lightboxControl.fillTabContent()
    })

    gantt._tabbar.events.on("Change", function (activeId, prevId) {
        gantt.$lightboxControl.fillTabContent(activeId)
    });
}

gantt.$lightboxControl = {
    settingsFolder: {},
    settingsTaskAndProject: {},
    resources: {},
	capacity: {}
};


initResourceEditForm();
initCapacityEditForm();
initSettingsTaskAndProjectEditForm();
initSettingsFolderEditForm();