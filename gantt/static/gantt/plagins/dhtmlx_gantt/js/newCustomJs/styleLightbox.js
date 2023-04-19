// var WORK_DAY = 8;
// var UNASSIGNED_ID = 5;




var create_splitProject =
[
    {name:"description", height: 33, map_to: "text", type: "textarea", focus: true, default_value: "Введите название задачи"},
    {name:"responsible", height: 33, map_to: "responsible", type: "textarea", default_value: "create_splitProject"},
    {name: "type", height:28, type: "typeselect", map_to: "type"},
    {name: "periodP", type: "dataPixerPeriodP", map_to: "auto", skin: '', date_format: '%d %M %Y'},
    {name:"customView", height:28, type:"template", map_to:"my_template"},
    /*
    {name:"dimensionP", height: 33, map_to: "ob_plan", type: "textarea", default_value: "Введите объем по плану"},
    {name:"dimensionF", height: 33, map_to: "ob_fact", type: "textarea", default_value: "Введите объем по факту"},*/
    {name:"capacity", type: "resources", map_to: "capacity", height: 300, options: gantt.serverList("capasity"), default_value:WORK_DAY, unassigned_value: UNASSIGNED_ID}
];

var update_splitProject =
[
    {name:"description", height: 33, map_to: "text", type: "textarea", focus: true, default_value: "Введите название задачи"},
    {name:"responsible", height: 33, map_to: "responsible", type: "textarea", default_value: "update_splitProject"},
    {name:"periodP", type: "dataPixerPeriodP", map_to: "auto", skin: '', date_format: '%d %M %Y'},
    {name:"customView", height:28, type:"template", map_to:"my_template"},
    {name:"capacity", type: "resources", map_to: "capacity", height: 300, options: gantt.serverList("capasity"), default_value:WORK_DAY, unassigned_value: UNASSIGNED_ID}
];

var create_splitTask =
[
    {name:"description", height: 33, map_to: "text", type: "textarea", focus: true, default_value: "Введите название задачи"},
    {name:"responsible", height: 33, map_to: "responsible", type: "textarea", default_value: "create_splitTask"},
    {name:"periodF", type: "dataPixerPeriodF", map_to: "auto", skin: '', date_format: '%d %M %Y'},
    {name:"customView", height:28, type:"template", map_to:"my_template"},
    {name:"capacity", type: "resources", map_to: "capacity", height: 300, options: gantt.serverList("capasity"), default_value:WORK_DAY, unassigned_value: UNASSIGNED_ID}
];

var update_splitTask =
[
    {name:"description", height: 33, map_to: "text", type: "textarea", focus: true, default_value: "Введите название задачи"},
    {name:"responsible", height: 33, map_to: "responsible", type: "textarea", default_value: "update_splitTask"},
    {name:"periodF", type: "dataPixerPeriodF", map_to: "auto", skin: '', date_format: '%d %M %Y'},
    {name:"customView", height:28, type:"template", map_to:"my_template"},
    {name:"capacity", type: "resources", map_to: "capacity", height: 300, options: gantt.serverList("capasity"), default_value:WORK_DAY, unassigned_value: UNASSIGNED_ID}
];

var create_Project =
[
    {name:"description", height: 33, map_to: "text", type: "textarea", focus: true, default_value: "Введите название задачи"},
    {name:"responsible", height: 33, map_to: "responsible", type: "textarea", default_value: "create_Project"},
    {name:"type", height:28, type: "typeselect", map_to: "type"}
];

var update_Project =
[
    {name:"description", height: 33, map_to: "text", type: "textarea", focus: true, default_value: "Введите название задачи"},
    {name:"responsible", height: 33, map_to: "responsible", type: "textarea", default_value: "update_Project"}
];

// Меняем наименование
gantt.locale.labels.type_project =  "Проект";
gantt.locale.labels.type_task =  "Задача";

// определение заголовков лайтбокса
gantt.locale.labels.section_periodF = "Период по факту:";
gantt.locale.labels.section_periodP = "Период по плану:";
gantt.locale.labels.section_description = "Наименование";
gantt.locale.labels.section_responsible = 'Ответственный:<nobr class= "atr">*</nobr>';
gantt.locale.labels.section_dimensionP = "Объем план:";
gantt.locale.labels.section_dimensionF = "Объем факт:";
gantt.locale.labels.section_progress = "Прогресс:";
gantt.locale.labels.section_capacity = "Нагрузка:";
gantt.locale.labels.section_customView = "";

