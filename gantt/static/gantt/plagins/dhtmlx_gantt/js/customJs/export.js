
function get_max_width()
{
	gantt.config.columns =
	[// столбцы
	    {name:"wbs",           label:"№", align:"center", width: 150, resize:true, template:gantt.getWBSCode, resize:true},
	    {name:"text",          label:"Наименование", width: 1000, tree: true, resize:true, template: line_break22, editor: textEditor},
	    {name:"start_date", label:"Дата н. факт",   align:"center", width: 130, template: myFunc_s_f, resize:true, editor: dateEditor1},
	    {name:"end_date",   label:"Дата ок. факт",  align:"center", width: 130, template: myFunc_e_f, resize:true, editor: dateEditor2},
	    {name:"planned_start",    label:"Дата н. план",   align:"center", width: 130, template: myFunc_s_p, resize:true, editor: dateEditor3},
	    {name:"planned_end",      label:"Дата ок. план",  align:"center", width: 130, template: myFunc_e_p, resize:true, editor: dateEditor4},
	    {name:"progress",      label:"Прогресс",  align:"center", width: 100, template:function(obj){return parseInt(obj.progress + '%') + '%'}, resize:true, editor: durationEditor},//перевод дробного числа в целое и вычисление процента выполнения
	    {name:"responsible",   label:"Ответст.",       align:"center", width: 100, resize:true}
	];

	function line_break22(task)  //для вывода текста в несколько строк
	{
	  return task.text;
	};

	gantt.addTaskLayer({// редактирование задач по плану
	  renderer: {
	    render: function draw_planned(task) {
	      if (task.planned_start && task.planned_end) {
	        var sizes = gantt.getTaskPosition(task, task.planned_start, task.planned_end);
	        var el = document.createElement('div');
	        el.className = 'baseline';
	        el.style.left = sizes.left + 'px';
	        el.style.width = sizes.width + 'px';
	        el.style.height = 32 + 'px';
	        el.style.top = sizes.top + gantt.config.task_height + -9 + 'px';//отступ плана от факта
	        return el;
	      }
	      return false;
	    },
	    // определить getRectangle, чтобы подключить слой с помощью умного рендеринга
	    getRectangle: function(task, view){
	      if (task.planned_start && task.planned_end) {
	        return gantt.getTaskPosition(task, task.planned_start, task.planned_end);
	      }
	      return null;
	    }
	  }
	});
/*
	gantt.config.layout = //Горизонтальная полоса прокрутки на обе части Гната
	{
	  css: "gantt_container",
	  cols:
		[
	    {
				width:1660, // Максимальная ширина таблицы (grid)
	      min_width: 300, //Минимальная ширина таблицы (grid)
	      rows:
				[
	        {view: "grid", scrollX: "gridScroll", scrollable: true, scrollY: "scrollVer"},

	         // horizontal scrollbar for the grid
	        {view: "scrollbar", id: "gridScroll", group:"horizontal"}
	      ]
	    },
	    {resizer: true, width: 1},
	    {
	      rows:
				[
	        {view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer"},

	        // horizontal scrollbar for the timeline
	        {view: "scrollbar", id: "scrollHor", group:"horizontal"}
	      ]
	    },
	    {resizer: true, width: 1}
	  ]
	};
*/
	gantt.templates.rightside_text = function (start, end, task) //подсчет "Превышения"
	{
	  if (task.planned_end)
	  {
	    if (end.getTime() > task.planned_end.getTime())
	    {
	      var overdue = Math.ceil(Math.abs((end.getTime() - task.planned_end.getTime()) / (24 * 60 * 60 * 1000)));
	      var text = "<p>Превышение: " + overdue + " д.</p>";
	      return text;
	    }
	  }
	};

  gantt.render()
}

function export_PDF()
{
  var backup_columns = gantt.copy(gantt.config.columns);
  var backup_grid_width = gantt.config.grid_width;
  get_max_width();

var header = `

.gantt_tree_icon .gantt_folder_open /*   удаление лишних иконок   */
{
  display: none!important;
}
.gantt_tree_icon .gantt_folder_closed {
    display: none!important;
}
.gantt_folder_closed {
    display: none!important;
}
.gantt_folder_open {
    display: none!important;
}
.gantt_tree_icon.gantt_file /*   удаление лишних иконок   */
{
  display: none!important;
}

.gantt_task_progress_drag /*   удаление управлением прогресса   */
{
  display: none!important;
}


/*  Удаление банера просрочки бесплатной версии  */
.gantt-error
{
  display: none!important;
}
.dhtmlx-error
{
  display: none!important;
}

html, body
{
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: visible!important;
}

.baseline
{
  position: absolute;
  border-radius: 2px;
  opacity: 0.6;
  margin-top: -7px;
  height: 12px;
  background: #ffd180;
  border: 1px solid rgb(255, 153, 0);
}
.not_active /* класс для задач с выполнением 100% */
{
    color: #BFBFBF;
}
.gantt_side_content /*Класс для Превышения задачи по времени*/
{
  font-family: Akrobat-Regular!important;
  color: #4d4d4d;
  font-size: 10pt!important;
}



.weekend /* окраска выходных */
{
  background: #cfcfcf!important;
  color:white !important;
}

.none /* отмена окраски для zoom кроме дней */
{
  background: white!important;
  color:#4d4d4d !important;
}

.task_row_class  /*класс CSS, который будет применён к строке области шкалы времени*/
{
  font-weight: none!important;
  font-family: Akrobat-Light!important;
}

.grid_row_class/* Класс для строки таблицы */
{
  font-weight: none!important;
  font-family: Akrobat-SemiBold!important;
  font-size: 12pt!important;
}

.grid_header_class/*Класс для шапки таблицы*/
{
  font-weight: none!important;
  font-family: Akrobat-Bold!important;
  font-size: 11pt!important;
}

.scale_row_class  /*Класс для шапки шкалы времени */
{
  font-weight: none!important;
  font-family: Akrobat-Bold!important;
  font-size: 11pt!important;
}

`;
  gantt.exportToPDF
	({
    raw: true,
		header:"<style>" + header + "</style>"
  });

  gantt.config.columns = gantt.copy(backup_columns);
  gantt.config.grid_width = backup_grid_width;
  gantt.render()
}

/*
function export_Excel()
{
	gantt.exportToExcel
	({
	    name:"document.xlsx",
	    columns:[
	        { id:"text", header:"Наименование", width: 150 },
	        { id:"start_date", header:"Дата н. факт", width: 250, type: "date"},
	        { id:"end_date", header:"Дата ок. факт", width: 250, type: "date"},
	        { id:"planned_start", header:"Дата н. план", width: 250, type: "date"},
	        { id:"planned_end", header:"Дата ок. план", width: 250, type: "date"},
					{ id:"progress", header:"Прогресс", width: 150 },
					{ id:"responsible", header:"Ответст", width: 150 }
	    ],
	    server: "https://export.dhtmlx.com/gantt",
	    visual: true,
	    cellColors: true
	});

	gantt.render()
}
*/
