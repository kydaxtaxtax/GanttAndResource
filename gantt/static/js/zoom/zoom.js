var hourToStr = gantt.date.date_to_str("%H:%i");
var hourRangeFormat = function(step){
    return function(date){
        var intervalEnd = new Date(gantt.date.add(date, step, "hour") - 1)
        return hourToStr(date) + " - " + hourToStr(intervalEnd);
    };
};

// gantt.config.min_column_width = 50;
var zoomConfig = {
    // maxColumnWidth: 80,
    // widthStep: 10,
    levels: [{
        min_column_width: 80,
        name:"year",
        scales:[
            {unit: "year", step: 1, format: function (date) {
                var yearNum = gantt.date.date_to_str("%Y")(date); // Определяем выводимую строку
                gantt.templates.timeline_cell_class = function (item, date) {// класс CSS, который будет применяться к ячейкам области шкалы времени
                    if (date.getMonth() % 1) {
                      return "none";
                    }
                };
                return yearNum;
                }
            }
        ]},
        {
        name:"quarter",
        min_column_width:70,
        scales:[
            {unit: "year", step: 1, format: "%Y"},
            {unit: "quarter", step: 1, format: function (date)
                {
                    var dateToStr = gantt.date.date_to_str("%M");
                    var endDate = gantt.date.add(gantt.date.add(date, 3, "month"), -1, "day");
                    return dateToStr(date) + " - " + dateToStr(endDate);
                }
            }
        ]},
        {
        name:"month",
        min_column_width: 60,
        scales:[
            {unit: "year", step: 1, format: "%Y"},
            {unit: "month", step: 1, format: function (date) {
                var quarterNum = gantt.date.date_to_str("%F")(date);
                gantt.templates.timeline_cell_class = function (item, date) {
                    if (date.getMonth() % 1) {
                        return "none";
                    }
                };
                return quarterNum;
                }
            }
        ]},
        {
        name:"week",
        min_column_width: 70,
        scales: [
            {unit: "month", step: 1, format: "%F %Y"},
            {unit: "week", step: 1, format: function (date) {
                var monthNum = gantt.date.date_to_str("%W")(date); // Определяем выводимую строку
                gantt.templates.timeline_cell_class = function (item, date) {// класс CSS, который будет применяться к ячейкам области шкалы времени
                    if (date.getMonth() % 1) {
                        return "none";
                    }
                };
                return monthNum + " неделя";
                }
            }
        ]},
        {
        name:"day",
        // scale_height: 50,
        // minColumnWidth: 20,
        scales: [
            {unit: "week", step: 1, format: function (date) {
                var dateToStr = gantt.date.date_to_str("%d %M");
                var endDate = gantt.date.add(date, -6, "day");
                var weekNum = gantt.date.date_to_str("%W неделя")(date);
                return weekNum + " (" + dateToStr(endDate) + " - " + dateToStr(date) + ")";
                }
            },
            {unit: "day", step: 1, format: function (date) {
                var weekNum = gantt.date.date_to_str("%j %D")(date);
                gantt.templates.timeline_cell_class = function (item, date) {
                    if (date.getDay() == 0 || date.getDay() == 6) {
                        return "weekend";
                    }
                };
                return weekNum;
                }
            }
        ]},
    ],
    useKey: "ctrlKey",
    trigger: "wheel",
    element: function() {
      return gantt.$root.querySelector(".gantt_task");
    }
};

gantt.ext.zoom.init(zoomConfig);
// gantt.ext.zoom.setLevel("week");







