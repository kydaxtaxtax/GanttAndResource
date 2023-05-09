gantt.plugins({
    fullscreen: true,
    multiselect: true,
    undo: true,
    redo: true,
  keyboard_navigation: true,
  marker: true,
  auto_scheduling: true,
  grouping: true,
  tooltip: true,
  overlay: true,
  drag_timeline: true,
  export_api: true
});


	gantt.config.date_format = "%Y-%m-%d %H:%i";

var WORK_DAY = 8;
  var UNASSIGNED_ID = 5;

  gantt.config.undo_types = {
    link:"link",
    task:"task"
};

  gantt.locale.labels.section_owner = "Owner";
  gantt.config.resource_render_empty_cells = true;
  gantt.config.process_resource_assignments = false;//новое поле для отображения ресурсов

  gantt.config.auto_scheduling = true;
  gantt.config.auto_scheduling_strict = true;
  gantt.config.resource_store = "resources";
  gantt.config.resource_property = "capacity";
  gantt.config.scale_height = 45;

  gantt.locale.labels.section_priority = "Priority";
  gantt.config.xml_date = "%Y-%m-%d %H:%i:%s"; // формат вводимой даты
  gantt.config.auto_scheduling_compatibility = true;
  gantt.locale.labels.section_split = "Display";
  gantt.config.duration_unit = "day";// Устанавливает единицу длительности задачи
  gantt.config.fit_tasks = true; //автоматическое расширение шкалы времени
  gantt.config.sort = true; // сортировка
  gantt.config.show_tasks_outside_timescale = true;//Отображает задачи на графике, если даже они выходят за пределы max_date
  gantt.config.work_time = true; //убирает нерабочее время из расчетов
  gantt.config.correct_work_time = true; // нельзя поставить задачу на выходные
  gantt.config.auto_types = false;//автоматически преобразует задачи с подзадачами в проекты и проекты без подзадач обратно в задачи
  gantt.config.order_branch = true; // Переупорядочение методом перетаскивания внутри одного уровня дерева
  gantt.config.order_branch_free = true; // Переупорядочение методом перетаскивания в пределах любого уровня дерева
  gantt.config.order_branch = "marker"; // применение маркера (красиво) для переупорядочевания задач (загрузка происходит только при отпускании мыши)
  gantt.config.open_tree_initially = true;

