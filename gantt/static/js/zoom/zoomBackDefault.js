// Для возврата в дефолтное зуммирование



// function getDateMaxMin(){
//     var newStart;
//     var newEnd;
//     gantt.eachTask(function (task) {
//         if(task.type == "project") {
//             if (task.planned_start <= task.start_date){
//                 newStart = task.planned_start;
//             }
//             else {
//                 newStart = task.start_date;
//             }
//
//             if (task.planned_end >= task.end_date){
//                 newEnd = task.planned_end;
//             } else {
//                 newEnd = task.end_date;
//             }
//         }
//     });
//     return {start_date: newStart, end_date: newEnd};
// };

function zoomToFit(new_width = null) {
    var datesMaxMin = gantt.getSubtaskDates();
    if(datesMaxMin.start_date && datesMaxMin.end_date){
        var areaWidth = new_width ? new_width + gantt.$task.offsetWidth : gantt.$task.offsetWidth;
        var scaleConfigs = zoomConfig.levels;
        for (var i = scaleConfigs.length - 1; i > 0; i--) {
                var columnCount = getUnitsBetween(datesMaxMin.start_date, datesMaxMin.end_date, scaleConfigs[i].scales[scaleConfigs[i].scales.length-1].unit, scaleConfigs[i].scales[0].step);
                var minWidth = scaleConfigs[i].min_column_width? scaleConfigs[i].min_column_width : gantt.config.min_column_width;

            if ((columnCount + 2) * minWidth <= areaWidth) {
                break;
            }
        }
        gantt.ext.zoom.setLevel(scaleConfigs[i].name);
        applyConfig(scaleConfigs[i], datesMaxMin);
    } else {
        gantt.ext.zoom.setLevel("year");
    }

}

function applyConfig(config, dates) {

    gantt.config.scales = config.scales;
    // restore the previous scroll position
    if (config.scroll_position) {
        setTimeout(function(){
            gantt.scrollTo(config.scroll_position.x, config.scroll_position.y)
        },4)
    }
}


	// get number of columns in timeline
function getUnitsBetween(from, to, unit, step) {
    var start = new Date(from),
        end = new Date(to);
    var units = 0;
    while (start.valueOf() < end.valueOf()) {
        units++;
        start = gantt.date.add(start, step, unit);
    }
    return units;
}
