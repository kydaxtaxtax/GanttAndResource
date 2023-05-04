
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

var textFilter = "<div style=\"display: flex; justify-content: center; align-items: center;\">" +
  "<div style=\"display: flex; justify-content: space-between; align-items: center;\">" +
    "<div style=\"font-size: 11pt; width: 100px;\">Наименование</div>" +
    "<div style=\"margin-left: 20px;\"><input data-text-filter class=\"form-control-feedback\" type=\"text\" id='search' placeholder=\"Поиск по задачам\" aria-label=\"Search\" oninput='gantt.$doFilter(this.value)' style=\"width: 150px; height: 30px; border: 1px solid #bdbdbd; line-height: 30px; padding-left: 5px;\">\n</div>" +
  "</div>" +
"</div>";




// столбцы
gantt.config.columns =
  [
    // { name: "wbs", label: "№", align: "center", width: 60, resize: true, template: gantt.getWBSCode, resize: true },
    { name: "text", label: textFilter, width: 325, tree: true, resize: true, template: line_break},
    { name: "start_date", label: line_break_title("Начало","Факт"), align: "center", width: 65, template: myFuncSD, resize: true},
    { name: "end_date", label: line_break_title("Окончание","Факт"), align: "center", width: 80, template: myFuncED, resize: true},
    { name: "planned_start", label: line_break_title("Начало","План"), align: "center", width: 65, template: myFuncPS, resize: true},
    { name: "planned_end", label: line_break_title("Окончание","План"), align: "center", width: 80, template: myFuncPE, resize: true},
    { name: "progress", label: "Прогресс", align: "center", width: 75, template: progress_PF, resize: true },//перевод дробного числа в целое и вычисление процента выполнения
    // { name: "responsible", label: "Ответст.", align: "center", width: 70, resize: true },
    { name: "add", label: "", align: "center", width: 45, resize: true},
  ];

//Формат отображаемой даты
var formatFunc = gantt.date.date_to_str("%d-%m-%Y");

//Вывода текста в несколько строк title
  function line_break_title(str1, str2) {
    return "<div class='line_break_title'>" + str1 + "<br>" + str2 + "</div>"; //вывод
};


//Вывода текста в несколько строк
function line_break(task, lenStr = 45) {
  if (task.text.length <= lenStr) {
    return task.text;
  }
  var len = task.text.length; //длина передаваемой строки
  var string1s = task.text.slice(0, lenStr);// промежуточное значение первой строки
  var gap = string1s.lastIndexOf(' ');// позиция последнего пробела промежуточного значения первой строки
  var str1 = task.text.slice(0, gap); // первая строка
  var str2 = task.text.slice(gap, len); // вторая строка
  return "<div class='line_break_title'>" + str1 + "<br>" + str2 + "</div>"; //вывод
};

// считаем прогресс
function progress_PF(task)
{
  var recountedProgress; // создаем глобальную переменную прогресса
  if (gantt.hasChild(task.id)) {// проверяет наличие дочек

    recountedProgress = 0;
    var len = 0;
    gantt.eachTask(function (task1) {// дочки указанной задачи
      if (!gantt.hasChild(task1.id)) {// дочки последнего уровня
        len = len + 1; // считаем количество дочек последнего уровня указанной задачи
        // console.log(task1.id + "   " +len)
      }}, task.id
    );
    gantt.eachTask(function (task1) {// дочки указанной задачи
      if (!gantt.hasChild(task1.id)) {// дочки последнего уровня
                // console.log(task1.ob_plan + "   " + task1.ob_fact)
      // console.log(recountedProgress + "    " +  task1.id  + "    " +task1.ob_plan + "    " +task1.ob_fact+"    " + len);
        recountedProgress = recountedProgress + (100 / (task1.ob_plan / task1.ob_fact) / len); // считаем общий прогресс всех дочек
      }}, task.id);
  }
  else {
    recountedProgress = 100 / (task.ob_plan / task.ob_fact); // считаем прогресс
  }
  if(isNaN(recountedProgress)) {
    recountedProgress = 0;
    task.progress = recountedProgress; // присваивем прогресс
    return recountedProgress + '%';
  }
  else{
    recountedProgress = Math.floor(recountedProgress);
    task.progress = recountedProgress / 100; // присваивем прогресс
    return recountedProgress + '%';
  }
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




