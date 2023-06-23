
function updateLine(dragObj = null){

    // if(saveTask){
    //     gantt.getTask(saveTask.id).planned_start = saveTask.planned_start;
    //     gantt.getTask(saveTask.id).planned_end = saveTask.planned_end;
    //     gantt.getTask(saveTask.id).duration_plan = calcBusinessDays(saveTask.planned_start, saveTask.planned_end);
    //     gantt.updateTask(saveTask.id);
    // }
        // var newTaskPlanStart = saveTask ? saveTask : null;

    gantt.eachTask(function (taskProject){
        if(dragObj ? taskProject.id == dragObj.oldParent.id || taskProject.id == dragObj.newParent.id : taskProject.render != "split" && taskProject.type == "project"){
             var splitTaskIdsLen = dragObj
                 ? taskProject.id == dragObj.newParent.id
                     ?  getSplitTaskIds(taskProject).length + getSplitTaskIds(dragObj.dragProject).length
                     :  getSplitTaskIds(taskProject).length - getSplitTaskIds(dragObj.dragProject).length
                 : getSplitTaskIds(taskProject).length
            if(splitTaskIdsLen > 0){
                var splitProjects = dragObj ? taskProject.id == dragObj.newParent.id
                     ?  getChildSplitProject(taskProject).concat(getChildSplitProject(dragObj.dragProject))
                        : getChildProject(dragObj.oldParent).includes(dragObj.newParent)
                            ? getChildSplitProject(taskProject).concat(getChildSplitProject(dragObj.dragProject))
                            : getChildSplitProject(taskProject).reduce( (acc, item) => {
                         if (!getChildSplitProject(dragObj.dragProject).includes(item)) acc.push(item);
                         return acc;} , [])
                 : getChildSplitProject(taskProject)

                var newTaskPlanStart = null;
                var newTaskPlanEnd = null;

                splitProjects.forEach(function (splitProject){
                    var splitTaskIdsLen = getSplitTaskIds(splitProject).length;
                    if(splitTaskIdsLen > 0) {
                        taskProject.hide_bar = false;
                        gantt.updateTask(taskProject.id);
                        if (newTaskPlanStart == null || newTaskPlanStart.planned_start > splitProject.planned_start) newTaskPlanStart = splitProject;
                        if (newTaskPlanEnd == null || newTaskPlanEnd.planned_end < splitProject.planned_end) newTaskPlanEnd = splitProject;
                    } else {
                        splitProject.hide_bar = true;
                        gantt.updateTask(splitProject.id);
                    }
                })
                gantt.getTask(taskProject.id).planned_start = newTaskPlanStart.planned_start;
                gantt.getTask(taskProject.id).planned_end = newTaskPlanEnd.planned_end;
                gantt.updateTask(taskProject.id);

            } else {
                taskProject.hide_bar = true;
                gantt.updateTask(taskProject.id);
            }
        }
    })
    // gantt.refreshData();
}

{ //маркер текущей даты на временной шкале
  var id = gantt.addMarker({
      start_date: new Date(),
      css: "today",
      title: new Date()
  });
  setInterval(function(){
    var dateToStr = gantt.date.date_to_str(gantt.config.task_date);
    var today = gantt.getMarker(id);
    today.start_date = new Date();
    today.title = dateToStr(today.start_date);
    gantt.updateMarker(id);
}, 1000*60);
}

  // var textFilter = "" +
  //     "<div class='searchEl'>Наименование <input data-text-filter class=\"form-control-feedback me-2\" type=\"text\" id='search' placeholder=\"Поиск по задачам\" aria-label=\"Search\" oninput='gantt.$doFilter(this.value)'></div>";


  // var textFilter = "<div className=\"collapse navbar-collapse justify-content-md-center\" id=\"navbarsExample10\"> " +
  //     "<div className=\"d-flex justify-content-between align-items-center w-100">
  //       "<div className=\"d-flex\">Наименование</div>" +
  //   "<div className=\"d-flex\"><input data-text-filter class=\"form-control-feedback me-2\" type=\"text\" id='search' placeholder=\"Поиск по задачам\" aria-label=\"Search\" oninput='gantt.$doFilter(this.value)'></div></div></div>";

var textFilter = `<div style="display: flex; justify-content: left; align-items: center;">
  <div style="margin-right: 30px; margin-left: ${((window.innerWidth / 2 < 735 ? window.innerWidth / 2 : 735) > 555 ? 555 : (window.innerWidth / 2 < 735 ? window.innerWidth / 2 : 735))/2 -140}px;">Наименование</div>
  <div>
    <input data-text-filter class="form-control-feedback" type="text" id='search' placeholder="Поиск по задачам" aria-label="Search" oninput='gantt.$doFilter(this.value)'>
  </div>
</div>`;



	var colHeader = '<div class="gantt_grid_head_cell gantt_grid_head_add" onclick="gantt.createTask()"></div>',
		colContent = function (task) {
            return ('<div class="button-container">' +
              '<div class="button-wrapper">' +
                '<div class="fa gantt_button_grid gantt_grid_add fa-plus fa-lg" onclick="clickGridButton(' + task.id + ', \'add\')"></div>' +
              '</div>' +
              '<div class="button-wrapper">' +
                '<div class="fa gantt_button_grid gantt_grid_edit fa-folder-open fa-lg" onclick="clickGridButton(' + task.id + ', \'edit\')"></div>' +
              '</div>' +
            '</div>');
		};


// столбцы
gantt.config.columns =
  [
    // { name: "wbs", label: "№", align: "center", width: 60, resize: true, template: gantt.getWBSCode, resize: true },
    { name: "text", label: textFilter, width: 555, tree: true, resize: true, template: line_break},
    // { name: "start_date", label: line_break_title("Начало","Факт"), align: "center", width: 65, template: myFuncSD, resize: true},
    // { name: "end_date", label: line_break_title("Окончание","Факт"), align: "center", width: 80, template: myFuncED, resize: true},
    // { name: "planned_start", label: line_break_title("Начало","План"), align: "center", width: 65, template: myFuncPS, resize: true},
    // { name: "planned_end", label: line_break_title("Окончание","План"), align: "center", width: 80, template: myFuncPE, resize: true},
    { name: "progress", label: "Прогресс", align: "center", width: 100, template: progress_PF, resize: true },//перевод дробного числа в целое и вычисление процента выполнения
    // { name: "responsible", label: "Ответст.", align: "center", width: 70, resize: true },
    // { name: "add", label: "", align: "center", width: 50, resize: true},
      	{
			name: "buttons",
			label: colHeader,
			width: 80,
			template: colContent
		}
  ];

//Формат отображаемой даты
var formatFunc = gantt.date.date_to_str("%d-%m-%Y");

//Вывода текста в несколько строк title
  function line_break_title(str1, str2) {
    return "<div class='line_break_title'>" + str1 + "<br>" + str2 + "</div>"; //вывод
};


//Вывода текста в несколько строк
function line_break(task, lenStr = 45) {
  // if (task.text.length <= lenStr) {
  //   return task.text;
  // }
  // var len = task.text.length; //длина передаваемой строки
  // var string1s = task.text.slice(0, lenStr);// промежуточное значение первой строки
  // var gap = string1s.lastIndexOf(' ');// позиция последнего пробела промежуточного значения первой строки
  // var str1 = task.text.slice(0, gap); // первая строка
  // var str2 = task.text.slice(gap, len); // вторая строка
  // return "<div class='line_break_title'>" + str1 + "<br>" + str2 + "</div>"; //вывод
    return task.text;
};

// считаем прогресс
function progress_PF(task)
{
    var percentages = [];
    var percentages2 = [];
    var percentagesSplit = [];
    var splitTaskProgress = [];
    var splitProjectProgress = [];
         if (task.type == "project" && task.render != 'split') {
                gantt.eachTask(function (projectSplit) {
                    percentagesSplit.splice(0);
                    if (projectSplit.type == "project" && projectSplit.render == 'split') {
                        gantt.eachTask(function (splittask) {
                            if (splittask.capacity) {
                                splittask.capacity.forEach(function (capacityItem) {
                                    if (capacityItem.value == 0 || capacityItem.valuePlan == 0) {
                                        percent = 0;
                                    } else {
                                        percent = (capacityItem.value / capacityItem.valuePlan) * 100;
                                    }
                                    percentagesSplit.push(percent > 100 ? 100 : percent);
                                });
                            }
                        }, projectSplit.id);
                        if(percentagesSplit.length !== 0){
                            splitProjectProgress = percentagesSplit.length === 0 ? 0 : Math.round(percentagesSplit.reduce((sum, percent) => sum + percent, 0) / percentagesSplit.length);
                            percentages.push(splitProjectProgress);
                        }
                    }
                }, task.id);
                task.progress = percentages.length === 0 ? 0 : Math.round(percentages.reduce((sum, percent) => sum + percent, 0) / percentages.length);
        }
        if (task.type == "project" && task.render == 'split') {
                gantt.eachTask(function (splittask) {
                    if (splittask.type == "splittask") {
                        if (splittask.capacity) {
                            splittask.capacity.forEach(function (capacityItem) {
                                if (capacityItem.value == 0 || capacityItem.valuePlan == 0) {
                                    percent = 0;
                                } else {
                                    percent = (capacityItem.value / capacityItem.valuePlan) * 100;
                                }
                                percentagesSplit.push(percent > 100 ? 100 : percent);
                            });
                        }
                    }
                }, task.id);
                task.progress  = percentagesSplit.length === 0 ? 0 : Math.round(percentagesSplit.reduce((sum, percent) => sum + percent, 0) / percentagesSplit.length);
        }
        if (task.type == "splittask") {
            var percent = 0;
            if (task.capacity) {
                task.capacity.forEach(function (item) {
                    if (item.value == 0 || item.valuePlan == 0){
                        percent = 0;
                    } else {
                        percent = (item.value / item.valuePlan) * 100;
                    }
                    percentages.push(percent);
                });
            }
            task.progress = percentages.length === 0 ? 0 : Math.round(percentages.reduce((sum, percent) => sum + percent, 0) / percentages.length);
        }
        return task.progress + "%";
}

// function myFuncSD(task) {
//   var tta = Math.round(100 / (task.ob_plan / task.ob_fact));
//   if (!(100 > tta > 0) || (task.render == "split"))
//   {
//     return "<div class='not_active'>" + formatFunc(task.start_date) + "</div>";
//   }
//   return formatFunc(task.start_date);
// }
//
// function myFuncED(task) {
//   var tta = Math.round(100 / (task.ob_plan / task.ob_fact));
//   if (!(100 > tta > 0) || (task.render == "split"))
//   {
//     return "<div class='not_active'>" + formatFunc(task.end_date) + "</div>";
//   }
//     return formatFunc(task.end_date);
// }

function myFuncSD(task) {

  if (task.start_date) {
    return formatFunc(task.start_date);
  }
  return "";
}

function myFuncED(task) {

  if (task.end_date) {
    return formatFunc(task.end_date);
  }
  return "";
}


function myFuncPS(task) {
  // if (!task.planned_start || task.planned_start == "2000-01-01 00:00") {
        if (!task.planned_start) {
    return ""
  }
  else {
      return formatFunc(task.planned_start);}
}

function myFuncPE(task) {
  // if (!task.planned_end || task.planned_end == "2000-01-01 00:00") {
      if (!task.planned_end) {
    return ""
  }
  else { return formatFunc(task.planned_end);}
}



  function generateId (){
              return () => {
              const timestamp = Date.now();
              const random = Math.floor(Math.random() * 100000);
              return `${timestamp}${random}`;
            };
        }
