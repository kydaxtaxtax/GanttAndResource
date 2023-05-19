
// подсчет "Превышения"
gantt.templates.rightside_text = function (start, end, task)
{
  if (task.type != "task") {
    if (task.planned_end) {
      if (end.getTime > task.planned_end.getTime) {
        var overdue = Math.ceil(Math.abs((end.getTime() - task.planned_end.getTime()) / (24 * 60 * 60 * 1000)));
        var text = "<p>Превышение: " + overdue + " д.</p>";
        return text;
      }
    }
  }
  return ;
};

gantt.config.bar_height = 22.5; // высота задачи по факту
gantt.config.row_height = 45; // высота строки 45

// редактирование задач по плану
gantt.addTaskLayer({
    renderer: {
        render: function draw_planned(task) {
            if (task.planned_start && task.planned_end) {
                var sizes = gantt.getTaskPosition(task, task.planned_start, task.planned_end);
                var el = document.createElement('div');
                if ( task.type == "project" && task.render != "split") {
                    el.className = 'baselineProject';
                } else {
                    el.className = 'baselineTask';
                }
                el.style.left = sizes.left + 'px';
                el.style.width = sizes.width + 'px';
                el.style.top = sizes.top + gantt.config.bar_height + -10.2 + 'px';
                el.style.height = 33 + 'px';
                return el;
            }
            return false;
        },
        // define getRectangle in order to hook layer with the smart rendering
        getRectangle: function(task, view){
            if (task.planned_start && task.planned_end  && !task.hide_bar) {
            // if (task.planned_start && task.planned_end  && (!task.hide_bar || task.render == "split")) {
                return gantt.getTaskPosition(task, task.planned_start, task.planned_end);
            }
            return null;
        }
    }
});


// на весь экран
gantt.ext.fullscreen.getFullscreenElement = function ()
{
  return document.getElementById("myCover");
}


// вывод всплывающего окна
gantt.templates.tooltip_text = function (start, end, task)
{
  return "<b>Наименование:</b> " + task.text +
    "<br/><b>Ответственный:</b> " + task.responsible;
  //"<br/><b>End date:</b> "+gantt.templates.tooltip_date_format(end);
};

// класс для шапки таблицы
gantt.templates.grid_header_class = function (start, end, task)
{
  return "grid_header_class";
};


gantt.templates.grid_row_class = function(start, end, task){
    if(task.type == "project" && task.render != "split") {
        return "project_style";
    }
    return "";
};

// определяет класс CSS, который будет применяться к панелям задач(колбасам)
// gantt.templates.task_class = function (start, end, task)
// {
//   if (task.planned_end) {
//     var classes = ['has-baseline'];
//     if (end.getTime > task.planned_end.getTime) {
//       classes.push('overdue');
//     }
//     return classes.join(' ');
//   }
// };


// Класс для шапки времени
gantt.templates.scale_row_class = function (start, end, task)
{
  return "scale_row_class";
};


// Наименование задачи %
  gantt.templates.task_text = function (start, end, task) {
    return progress_PF(task);
  };


// gantt.config.keyboard_navigation = true; //Навигация с помощью клавиатуры
// gantt.config.keyboard_navigation_cells = true; //Навигация по ячейкам

