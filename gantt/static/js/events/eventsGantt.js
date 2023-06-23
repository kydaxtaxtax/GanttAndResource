gantt.attachEvent("onTaskOpened", function(id) {
    gantt.getTask(id).open = 1;
    gantt.updateTask(id);
});

gantt.attachEvent("onTaskClosed", function(id) {
    gantt.getTask(id).open = 0;
    gantt.updateTask(id);
});

gantt.attachEvent("onAfterTaskAdd", function(id, task) {
        task.planned_start = gantt.date.parseDate("2000-01-01 00:00", "xml_date");
    task.planned_end = gantt.date.parseDate("2000-01-01 00:00", "xml_date");
    return true;
});
gantt.attachEvent("onBeforeTaskUpdate", function(id, task) {
    if (!task.planned_start) task.planned_start = "2000-01-01 00:00";
    if (!task.planned_end) task.planned_end = "2000-01-01 00:00";
    return true;
});

gantt.attachEvent("onAfterTaskDelete", function(id, item){
    updateLine();
    return true;
});

gantt.attachEvent("onAfterTaskAdd", function(id, item){
    if(item.type == "project") item.hide_bar = true;
    if(item.type == "splittask"){
            updateLine();
            gantt.getTask(item.parent).hide_bar = false;
    }
    return true;
});

gantt.attachEvent("onBeforeRowDragEnd", function(id, parent, tindex){
    var task = gantt.getTask(id);
    var newParent = gantt.getTask(parent);
    var oldParent = gantt.getTask(task.parent);

        if (newParent && oldParent && newParent.render == "split") return false;
        if (newParent && oldParent && oldParent != newParent) {
            updateLine({dragProject: task, newParent: newParent, oldParent: oldParent});
            return true;
        }
    return false;
});

gantt.attachEvent("onTaskCreated", function(task){
    if(gantt.getTask(task.parent)) {
        var taskParent = gantt.getTask(task.parent);
        if (taskParent.render == "split") {
            task.type = "splittask";
            if (gantt.getChildren(taskParent.id).length > 1) {
                task.end_date = gantt.date.day_start(endDateZoom(task.start_date));
            } else {
                task.end_date = gantt.date.day_start(endDateZoom(task.start_date));
            }
            return true;
        }
        task.planned_start = task.start_date;
        task.planned_end = gantt.date.day_start(endDateZoom(task.start_date));
        return true;
        } else {
        task.planned_start = gantt.date.day_start(new Date());
        task.planned_end = gantt.date.day_start(endDateZoom(new Date()));
        return true;
    }

});

function endDateZoom(date){
    var level = gantt.ext.zoom.getCurrentLevel();
    scaleConfigs = zoomConfig.levels;
    var unit = scaleConfigs[level].scales[scaleConfigs[level].scales.length-1].unit;
    var resDate = gantt.date.add(date, 1, unit);
    return resDate;
}


// 	// Масштаб повторного рендеринга при перетаскивании задач
// gantt.attachEvent("onTaskDrag", function (id, mode, task, original) {
//   var state = gantt.getState();
//   var minDate = state.min_date,
//     maxDate = state.max_date;
//   var scaleStep = gantt.date.add(new Date(), state.scale_step, state.scale_unit) - new Date();
//   var showDate,
//     repaint = false;
//   if (mode == "resize" || mode == "move") {
//     if (Math.abs(task.start_date - minDate) < scaleStep) {
//       showDate = task.start_date;
//       repaint = true;
//
//     } else if (Math.abs(task.end_date - maxDate) < scaleStep) {
//       showDate = task.end_date;
//       repaint = true;
//     }
//     if (repaint) {
//       gantt.render();
//       gantt.showDate(showDate);
//     }
//   }
// });

gantt.attachEvent("onGridResizeEnd", function(old_width, new_width){
    zoomToFit(old_width - new_width);
    return true;
});

gantt.attachEvent("onParse", function(){
    updateLine();
    zoomToFit();
    return true;
});

gantt.attachEvent("onTaskLoading", function (task) {
    // if(task.planned_start == "2000-01-01 00:00" && task.planned_end == "2000-01-01 00:00"){
    //     return true;
    // }
    task = addDefaultResources(task);
    task.planned_start = gantt.date.parseDate(task.planned_start, "xml_date");
    task.planned_end = gantt.date.parseDate(task.planned_end, "xml_date");
return true;
});

gantt.attachEvent("onAfterTaskDrag", function(id, mode, e){
    dragSplitTask(id, mode);
    updateLine();
    gantt.updateTask(id);
});

function dragSplitTask(id, mode = 'move')// прибавление дней к дате
{
    task = gantt.getTask(id);
    var taskPrevSibiling = gantt.getTask(gantt.getPrevSibling(task.id));
    var taskNextSibiling = gantt.getTask(gantt.getNextSibling(task.id));
    var currentLevel = gantt.ext.zoom.getCurrentLevel();
    var durationDrag = moment(task.end_date).diff(moment(task.start_date), 'days');
    switch(mode) {
        case 'move':
            if(taskPrevSibiling && task.start_date < taskPrevSibiling.end_date){
                task.start_date = taskPrevSibiling.end_date;
                task.end_date = gantt.date.add(task.start_date, durationDrag, 'day');
                updateStartDateWeekend(task, currentLevel);
                break;
            }
            if(taskNextSibiling && task.end_date > taskNextSibiling.start_date){
                task.end_date = taskNextSibiling.start_date;
                task.start_date = gantt.date.add(task.end_date, -durationDrag, 'day');
                updateEndDateWeekend(task, currentLevel);
                break;
            }

            if([0, 1, 2, 3].includes(currentLevel)){
                if (moment(task.start_date).day() === 5) {
                    task.start_date = gantt.date.add(task.start_date, 3, 'day');
                }
                task.end_date = gantt.date.add(task.start_date, durationDrag, 'day');
            }

            case 'resize':
            if(taskPrevSibiling && task.start_date < taskPrevSibiling.end_date){
                do{
                    durationDrag = moment(taskPrevSibiling.end_date).diff(moment(taskPrevSibiling.start_date), 'days');
                    taskPrevSibiling.end_date = taskPrevSibilingOld ? taskPrevSibilingOld.start_date : task.start_date;
                    taskPrevSibiling.start_date = gantt.date.add(taskPrevSibiling.end_date, -durationDrag, 'day');
                    updateEndDateWeekend(taskPrevSibiling, currentLevel);
                    updateStartDateWeekend(taskPrevSibiling, currentLevel);
                    gantt.updateTask(taskPrevSibiling.id);
                    var taskPrevSibilingOld = taskPrevSibiling;
                    taskPrevSibiling = gantt.getTask(gantt.getPrevSibling(taskPrevSibiling.id));
                }while(taskPrevSibiling && (taskPrevSibiling.end_date > taskPrevSibilingOld.start_date))
                gantt.updateTask(task.id);
                updateStartDateWeekend(task, currentLevel);
                break;
            }
            if(taskNextSibiling && task.end_date > taskNextSibiling.start_date){
                do{
                    durationDrag = moment(taskNextSibiling.end_date).diff(moment(taskNextSibiling.start_date), 'days');
                    taskNextSibiling.start_date = taskNextSibilingOld ? taskNextSibilingOld.end_date : task.end_date;
                    taskNextSibiling.end_date = gantt.date.add(taskNextSibiling.start_date, durationDrag, 'day');
                    updateEndDateWeekend(taskNextSibiling, currentLevel);
                    updateStartDateWeekend(taskNextSibiling, currentLevel);
                    gantt.updateTask(taskNextSibiling.id);
                    var taskNextSibilingOld = taskNextSibiling;
                    taskNextSibiling = gantt.getTask(gantt.getNextSibling(taskNextSibiling.id));

                }while(taskNextSibiling && (taskNextSibiling.start_date < taskNextSibilingOld.end_date))
                gantt.updateTask(task.id);
                updateEndDateWeekend(task, currentLevel);
                break;
            }
        }
}

function updateStartDateWeekend(task, currentLevel){
    if([0, 1, 2, 3].includes(currentLevel)){
        if (moment(task.start_date).day() === 6) {
            task.start_date = gantt.date.add(task.start_date, 2, 'day');
        }
        if (moment(task.start_date).day() === 0) {
            task.start_date = gantt.date.add(task.start_date, 1, 'day');
        }
    }
}

function updateEndDateWeekend(task, currentLevel){
    if([0, 1, 2, 3].includes(currentLevel)){
        if (moment(task.end_date).day() === 1) {
            task.end_date = gantt.date.add(task.end_date, -2, 'day');
        }
        if (moment(task.end_date).day() === 0) {
            task.end_date = gantt.date.add(task.end_date, -1, 'day');
        }
    }
}
