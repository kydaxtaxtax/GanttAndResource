
gantt.config.layout = //Горизонтальная полоса прокрутки на обе части Гната
{
    css: "gantt_container",
    rows: [{
        cols:
            [{
                width: window.innerWidth / 2 < 735 ? window.innerWidth / 2 : 735, // Максимальная ширина таблицы (grid)
                min_width: 735, //Минимальная ширина таблицы (grid)
                 max_width: 735,
                rows: [
                    { view: "grid", scrollX: "gridScroll", scrollable: true, scrollY: "scrollVer" },
                    { view: "scrollbar", id: "gridScroll", group: "horizontal" }
                ]
            },
            { resizer: true, width: 1 },
            {
                rows: [
                  { view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" },
                  { view: "scrollbar", id: "scrollHor", group: "horizontal" }
                ]
            },
            { view: "scrollbar", id: "scrollVer" }
          ],
        gravity: 3
        },
        { resizer: true, width: 1, next: "resources" },
        {
        gravity: 2,
        id: "resources",
        config: resourceConfig,
        templates: resourceTemplates,
        cols:
            [
            {
                width: window.innerWidth/2, // Максимальная ширина таблицы (grid)
                min_width: 735, //Минимальная ширина таблицы (grid)
                max_width: 735,
                rows:
                    [
                        { view: "resourceGrid", group: "grids", scrollX: "gridScroll", scrollable: true, width: 430, scrollY: "resourceVScroll" }
                    ]
            },
            { resizer: true, width: 1 },
            {
                rows:
                    [
                        { view: "resourceHistogram", scrollX: "scrollHor", scrollY: "resourceVScroll" }
                    ]
            },
            { view: "scrollbar", id: "resourceVScroll", group: "vertical" }
            ]
        }
    ]
};
