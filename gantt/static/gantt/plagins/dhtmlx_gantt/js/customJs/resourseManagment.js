// gantt.plugins({
// 			grouping: true,
// 			auto_scheduling: true
// 		});
 		function getAllocatedValue(tasks, resource) {
			var result = 0;
			tasks.forEach(function(item) {
				var assignments = gantt.getResourceAssignments(resource.id, item.id);
				assignments.forEach(function(assignment){
					result += Number(assignment.value);
				});
			});
			return result;
		}





  function shouldHighlightTask(task) // проверяет??????????????
  {
    var store = gantt.$resourcesStore; // список ресурсов
    var taskResource = task[gantt.config.resource_property]; // содержимое capacity
    console.log(taskResource);
    var selectedResource = store.getSelectedId();
    if (taskResource == selectedResource || store.isChildOf(taskResource, selectedResource))
    {
      return true;
    }
  }

gantt.templates.grid_row_class = function (start, end, task) {
  var css = [];
  if (gantt.hasChild(task.id)) {
    css.push("folder_row");
  }

  if (task.$virtual) {
    css.push("group_row")
  }

  if (shouldHighlightTask(task)) {
    css.push("highlighted_resource");
  }

  return css.join(" ");
};

gantt.templates.task_row_class = function (start, end, task)// Класс с для временной шкалы
{
  if (shouldHighlightTask(task))
  {
      return "highlighted_resource";
  }
  return "task_row_class";
};

gantt.templates.timeline_cell_class = function(task, date) {
			if (!gantt.isWorkTime({date: date, task: task}))
				return "week_end";
			return "";
		};



function shouldHighlightResource(resource)// выделение ресурса
{
  var selectedTaskId = gantt.getState().selected_task; //id выбранной задачи
  if (gantt.isTaskExists(selectedTaskId)) { // если это задача существует, тогда
    var selectedTask = gantt.getTask(selectedTaskId),//достаем задачу по id
    selectedResource = selectedTask[gantt.config.resource_property];// достаем содержимое maxY
    if (resource.id == selectedResource) {
      return true;
    } else if (gantt.$resourcesStore.isChildOf(selectedResource, resource.id)) {
      return true;
    }
  }
  return false;
}


var resourceTemplates =
{
  grid_row_class: function (start, end, resource) {
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
  task_row_class: function (start, end, resource) {
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

function getResourceAssignments(resourceId)
{
  var assignments;
  var store = gantt.getDatastore(gantt.config.resource_store); //получаем объект ресурсов
  if (store.hasChild(resourceId)) {
    assignments = [];
    store.getChildren(resourceId).forEach(function (childId) {
      assignments = assignments.concat(gantt.getResourceAssignments(childId));
    });
  } else {
    assignments = gantt.getResourceAssignments(resourceId);
  }
  return assignments;
}



function volumeFact(start_date, end_date, taskS, resource, tasks) //рассчитываем объем по факту на каждый период
{
  var sum = 0;
  if(tasks != []) {
    var value = 0;
    tasks.forEach(function (item) { //проходим по всем задачам
      if(!gantt.hasChild(item.id) && (gantt.isChildOf(item.id, taskS.id))) {
        let periodDays = contentOfDays(item.start_date, item.end_date, start_date, end_date, true); // колличество дней нагрузки в указанный период
        let factDays = calcBusinessDays(item.start_date, item.end_date, false); // колличество дней от даты начала по факту до даты окончания по факту
        value = (item.capacity.find(item => item.resource_id == resource.id)).value;

        sum += Number((value / factDays * periodDays).toFixed(2));
      }
    });
  }

  return sum;
}


gantt.templates.histogram_cell_label = function (start_date, end_date, resource, tasks)// вывод текста внутри каждого дня
{
    var taskS = sell_task();
    if(taskS.type == "task")
    {
      taskS = gantt.getTask(taskS.parent);
    }
    if (resource.value != undefined)
    {
      var fact = volumeFact(start_date, end_date, taskS, resource, tasks);
      var plan = volumePlan(start_date, end_date, taskS, resource);
        if (fact > 0 || plan > 0)
        {


            // if(parseInt(plan) > resource.maxY);
            // {
            //   resource.maxY = parseInt(plan);
            // }
            // console.log(resource.id + " = " + resource.maxY)

          allocated(fact);
          maxY(Number.parseInt(plan));

          return fact + "/" + plan;
        }
        else
        {
          maxY("-1");
          return "";
        }
    }
    else
    {
      maxY("-1");
      return "";
    }
};
gantt.locale.labels.section_owner = "Owner";
gantt.config.resource_render_empty_cells = true; //сообщает временной шкале ресурса для отображения элементов и шаблонов вызовов для нераспределенных ячеек

function maxY(res) //рассчитываем объем по плану на каждый день
{
  gantt.templates.histogram_cell_capacity = function (start_date, end_date, resource, tasks)//план для каждого ресурса
  {
    // console.log(gantt.ext.zoom.zoomIn())



      //
      // localStorage.setItem("planMax", "0");
      // if(localStorage.getItem("planMax") < res)
      // {
      //   localStorage.setItem("planMax", res);
      //   resource.maxY = parseInt(res);
      //   return parseInt(res);
      // }

      return parseInt(res);



    // if(localStorage.getItem("planMax") < res)
    // {
    //   localStorage.setItem("planMax", res);
    // }
    //
    //  if(typeof(resource.maxY) == "number")
    //  {
    //    return res;
    //  }
    //
    // resource.maxY = res;

  };
  return true;
}




/*
gantt.templates.histogram_cell_capacity = function (start_date, end_date, resource, tasks)//план для каждого ресурса
{
  var taskS = sell_task();
  var plan = volumePlan(start_date, end_date, taskS, resource);
  return Number.parseInt(plan);
};
*/
/*
gantt.templates.histogram_cell_capacity = function (start_date, end_date, resource, tasks)//план для каждого ресурса
{





  if (!resource.value)
  {
  	return -1;
  }
  var f = getCapacity(start_date, resource);

  switch (gantt.ext.zoom.getCurrentLevel())
  {

    case 0:

      switch (f)
      {
        case -1:
          return 0;
          break;

        case null:
          if ((getAllocatedValue(start_date, tasks, resource) != 0))
          {
            return 0;
          }
          break;

        default:

        resource.maxY = Number.parseInt(f * 100);
        return Number.parseInt(f * 100);
      }
      break;

    case 1:
      switch (f)
      {
        case -1:
          return 0;
          break;

        case null:
          if ((getAllocatedValue(start_date, tasks, resource) != 0))
          {
            return 0;
          }
          break;

        default:

          if(typeof(resource.maxY) == "number")
          {
            return Number.parseInt(f * 100);
          }

          resource.maxY = Number.parseInt(f * 100);
          return Number.parseInt(f * 100);
      }

      break;

    case 2:
      break;

    case 3:
      break;
  }

};
*/


/*
gantt.templates.histogram_cell_allocated = function (start_date, end_date, resource, tasks)//высота заполненной области в гистограмме
{
  if (getCapacity(start_date, resource) == null && getAllocatedValue(start_date, tasks, resource) != 0)// для просроченных задач
  {
      return resource.maxY;
  }
  return getAllocatedValue(start_date, tasks, resource) * 100;
};
*/







var resourceConfig =
{
  scale_height: 30,
  row_height: 45,
  columns: [/*
    { name: "wbs", label: "№", align: "center", width: 60, resize: true, resize: true, template: function (resource)
      {

        var wbs = gantt.getWBSCode(resource);
        return wbs;


        return resource.$level+1
      }
    },*/
    {
      name: "name", label: "Наименование", tree: true, width: 620, template: function (resource) {
        if (resource.text.length <= 80) {
          return resource.text;
        }
        console.log(resource)
        var len = resource.text.length; //длина передаваемой строки
        var string1s = resource.text.slice(0, 90);// промежуточное значение первой строки
        var gap = string1s.lastIndexOf(' ');// позиция последнего пробела промежуточного значения первой строки
        var str1 = resource.text.slice(0, gap); // первая строка
        var str2 = resource.text.slice(gap, len); // вторая строка

        return "<p class='line_break'>" + str1 + "</p><p class='line_break1'>" + str2 + "</p>"; //вывод


      }, resize: true
    },
    {
      name: "progress", label: "Прогресс", align: "center", width: 130, template: function (resource)
      {
/*
        if(resource.value != 0 && resource.ids.length == 0)
        {
          gantt.message({type:"myCssR", text:"ресур с" + resource.id + " не содержится ни в одном ids"});//проверка объема по факту
          return "0%";
        }
*/
        if ((resource.value == null) || (resource.value == undefined)) // если родитель
        {
          var sumF = 0, sumP = 0;
          resource.ids.forEach(function (id)
          {
            var resource = gantt.$resourcesStore.getItem(id); //вытаскиваем ресурс по id
            if (resource == undefined) {

            }else{
            sumP += resource.value;
            sumF += parseInt(resP(resource));
            }

          });
          return Math.floor(100 / sumP * sumF) + "%";
        }

        return Math.floor(100 / resource.value * resP(resource)) + "%";
      }, resize: true
    },
    {
      name: "workload", label: "Объем по факту", align: "center", width: 130, template: function (resource)
      {
        if ((resource.value == null) || (resource.value == undefined)) // если родитель, то не выводим
        {
          return "";
        }

        return resP(resource) + " "+ resource.unit;

      }, resize: true
    },

    {
      name: "capacity", label: "Объем по плану", align: "center", width: 130, template: function (resource)
      {
        if ((resource.value == null) || (resource.value == undefined)) // если родитель, то не выводим
        {
          return "";
        }

        var task = sell_task();

        if ((task == ""))// если не обнаружена выбранная задача
        {
          return null;
        }

        return  parseFloat(resource.value).toFixed(2) + " "+ resource.units; // превращаем resource.value в число с плавающей точкой, а после округляем до сотых
      }
    }
  ]
};





gantt.templates.resource_cell_value = function (start_date, end_date, resource, tasks)
{
  return "<div>" + tasks.length * 8 + "</div>";

};


// gantt.config.auto_scheduling = true; // Автоматическое планирование при смещении сроков задач
// gantt.config.auto_scheduling_strict = true;// включает режим автоматического планирования, в котором задачи всегда перепланируются на максимально раннюю дату
gantt.config.resource_store = "resource";
gantt.config.resource_property = "capacity";
gantt.config.open_tree_initially = true;


gantt.$resourcesStore = gantt.createDatastore
({
  name: gantt.config.resource_store,
  type: "treeDatastore",
  initItem: function (item)
  {
    item.parent = item.parent || gantt.config.root_id;
    item[gantt.config.resource_property] = item.parent;
    if (!item.parent)
    {
      item.open = true;
    }
    else
    {
      item.open = false;
    }
    return item;
  }
});



// gantt.$resourcesStore.attachEvent("onAfterSelect", function (id) // эта хрень мешала чему то очень серьезному
// {
//   gantt.refreshData();
// });


function toggleGroups(input) // переключает группы
{
  gantt.$groupMode = !gantt.$groupMode;
  if (gantt.$groupMode) {
    input.value = "show gantt view";

    var groups = gantt.$resourcesStore.getItems().map(function (item) {
      var group = gantt.copy(item);
      group.group_id = group.id;
      group.id = gantt.uid();
      return group;
    });

    gantt.groupBy
      ({
        groups: groups,
        relation_property: gantt.config.resource_property,
        group_id: "group_id",
        group_text: "text",
        delimiter: ", ",
        default_group_label: "Not Assigned"
      });
  }
  else {
    input.value = "show resource view";
    gantt.groupBy(false);
  }
}


gantt.$resourcesStore.attachEvent("onParse", function () // срабатывает после анализа данных но до их отображения
{

  var people = []; // создаем массив

  gantt.$resourcesStore.eachItem(function (res)//цикл по элементам resourcesStore
  {
    if (!gantt.$resourcesStore.hasChild(res.id) && res.value != undefined)//проверяет, есть ли у указанного элемента дочерние задачи
    {
      var copy = gantt.copy(res);
      copy.key = res.id;
      copy.label = res.text + " (" + res.value.toFixed(2) + ")";
      copy.unit = res.unit;
      people.push(copy);
    }
  });
  gantt.updateCollection("people", people);
});


gantt.attachEvent("onTaskLoading", function (task)
{
  var maxY = task[gantt.config.resource_property];// нагрузка для конкретной задачи
  if ((maxY == "") || (maxY == undefined) || (maxY == null)) { // если нагрузка пустая
    task[gantt.config.resource_property] = [];//'Unassigned' group
  } else {
    task[gantt.config.resource_property] = maxY;
  }
  if((task.resourceOn != null) || (task.resourceOn != undefined)) {
    gantt.$resourcesStore.clearAll();
    gantt.$resourcesStore.parse(task.resourceOn);
  }
  return true;
});


gantt.templates.histogram_cell_class = function (start_date, end_date, resource, tasks)// цвета
{/*
  if(getCapacity(start_date, resource) == 0)
  {
    return "column_red"
  }

  else
  {
    if (getAllocatedValue(start_date, tasks, resource) < getCapacity(start_date, resource))
    {
      return "column_orange"
    }
  return "column_green"
}*/
};


gantt.templates.resource_cell_class = function (start_date, end_date, resource, tasks) //классы для ресурсного
{
  var css = [];
  css.push("resource_marker");
  if (tasks.length <= 1) {
    css.push("workday_ok");
  } else {
    css.push("workday_over");
  }
  return css.join(" ");
};



function sell_task_parr()//достаем объект родителя выбранного id
{
  var task_Id = gantt.getState().selected_task; // достаем id выбранной задачи  (тут надо делать чтобы возвращались ВСЕ выбранные задачи)
  var taskP = gantt.getParent(task_Id);// достаем родителя выбранной задачи
  return taskP;
}

function sell_task()//достаем объект выбранного id
{
  var task_Id = gantt.getState().selected_task; // достаем id выбранной задачи  (тут надо делать чтобы возвращались ВСЕ выбранные задачи)
  var task = gantt.getTask(task_Id);// достаем выбранную задачу
  return task;
}



  function resP(resource) { //подсчет объема по факту
    var taskS = sell_task();
    var res = 0;
    taskS.capacity.forEach(function (item) { //проходим по всем задачам
      if(item.resource_id == resource.id) {
        res = item.value;
      }
    });
    return res;
  }
