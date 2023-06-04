function initCapacityEditForm() {
    gantt.$lightboxControl.capacity.addForm = function () {

        const generateId = () => {
          const timestamp = Date.now();
          const random = Math.floor(Math.random() * 100000);
          return `${timestamp}${random}`;
        };

        var task = gantt.getTask(gantt._lightbox_id);

        var taskParent = gantt.getTask(task.parent);

        this.saveScrollPosition = function () {
            var layoutElement = document.querySelectorAll(".dhx_layout")[1];
            var layoutScrollTop = layoutElement.scrollTop;
            var layoutScrollLeft = layoutElement.scrollLeft;
            var layoutScroll = {left: layoutScrollLeft, top: layoutScrollTop};

            var resourceEditorScroll = gantt._resourceEditor._scroll;

            return {el1: layoutScroll, el2: resourceEditorScroll}
        };

        this.restoreScrollPosition = function (scrollPosition) {
            var layoutElement = document.querySelectorAll(".dhx_layout")[1]
            if (layoutElement.scrollTo) {
                layoutElement.scrollTo(scrollPosition.el1.left, scrollPosition.el1.top);
            } else {
                layoutElement.scrollTop = scrollPosition.el1.top;
            }

            dhx.awaitRedraw().then(function () {
                setTimeout(function () {
                    var gridBody = layoutElement.querySelectorAll(".dhx_grid-body")[1];
                    if (gridBody.scrollTo) {
                        gridBody.scrollTo(scrollPosition.el2.left, scrollPosition.el2.top)
                    } else {
                        gridBody.scrollTop = scrollPosition.el2.top;
                    }
                }, 50);
            });
        };

        var resourceAssignColumns = [
            {
                autoWidth: true,
                // width: 300,
                id: "text",
                header: [{content: "inputFilter",}],
                editorType: "input",
                editable: false,
                htmlEnable: true,
                footer: [{align: "right", text: '<div class="custom_footer">Total</div>' }],
            },
            {
                id: "valuePlan",
                align: "right",
                width: 70,
                header: [{text: "План"}],
                editorType: "input",
                format: "# #.00",
                sortable: false,
                editable: false,
                footer: [{align: "right", content: "sum"}]
            },
            {
                width: 70,
                align: "right",
                id: "value",
                header: [{text: "Факт"}],
                editorType: "number",
                format: "# #.00",
                sortable: false,
                editable: true,
                footer: [{align: "right", content: "sum"}]
            },
            {
                width: 80,
                align: "right",
                id: "progress",
                header: [{text: "Прогресс"}],
                editorType: "input",
                // type: "string",
                type: "percent",
                sortable: false,
                editable: false,
                footer: [{align: "right",  content: "avg"}]
            },
            {
                width: 70,
                align: "right",
                id: "unit",
                header: [{text: "Ед.изм"}],
                editorType: "input",
                type: "string",
                sortable: false,
                editable: false
            },
            {width: 40, id: "hide", header: [{text: ""}], type: "boolean", htmlEnable: true}
        ];


        if (gantt._resourceLayout) {
            gantt._resourceLayout.destructor();
        }
        gantt._resourceLayout = new dhx.Layout(null, {
            // type: "none",
            cols: [
                {
                    id: "resourceAssign",
                    html: "<div id='resourceAssign'></div>",
                    minHeight: "250px"
                    // collapsable: true,
                }
            ]
        });

        gantt._tabbar.getCell("capacity").attach(gantt._resourceLayout);

        if (gantt._resourceAssigner) gantt._resourceAssigner.destructor();

        this.$resourcesStore = copyCapacity;
        var resourceData = copyCapacity;


        //                 this.$resourcesStore = gantt.$resourcesStore;
        // console.log(gantt.$resourcesStore);
        //         var resourceData = gantt.$resourcesStore.getItems();

        var capacityData = [];
        resourceAssignColumns[1].optionLabels = {};
        var capasityItems = gantt._lightbox_task[gantt.config.resource_property] || [];
        resourceData.forEach(function (el) {
            var capasityItem = capasityItems.find(d => d.resource_id == el.id);

            if (el.hide == true) {
                if (el.type != "project") {
                    var idNew = generateId();
                    if (!capasityItem) {
                        var newCapacityRow = {
                            id: idNew,
                            $id: idNew,
                            text: el.text,
                            value: 0,
                            progress: 0,
                            type: "task",
                            parent: el.parent,
                            valuePlan: el.value || 0,
                            unit: el.unit,
                            resource_id: el.id,
                            hide: false
                        };
                        capacityData.push(newCapacityRow);
                        if (!task.$new) {
                            gantt._lightbox_task[gantt.config.resource_property].push(newCapacityRow);
                        } else {
                            if (!gantt._lightbox_task[gantt.config.resource_property]) {
                                gantt._lightbox_task[gantt.config.resource_property] = [];
                            }
                            gantt._lightbox_task[gantt.config.resource_property].push(newCapacityRow);
                        }

                    } else {
                        var capacityRow = gantt.copy(capasityItem);
                        capacityRow.text = el.text;
                        capacityRow.value = capacityRow.value || 0;
                        capacityRow.type = "task";
                        capacityRow.progress = capacityRow && el && capacityRow.value && el.value ? Math.round(((capacityRow.value / el.value))) : 0;
                        capacityRow.valuePlan = el.value || 0;
                        capacityRow.unit = el.unit || '';
                        // capacityRow.hide = capacityRow.hide || true;
                        capacityData.push(capacityRow);
                    }
                } else {
                    el.parent = undefined;
                    capacityData.push(el);
                }
            }
        })

        gantt._resourceAssigner = new dhx.TreeGrid(null, {
            columns: resourceAssignColumns,
            rowHeight: 40,
            // dragItem: "both",
            // autoHeight: true,
            autoWidth: true,
            editable: true,
            data: capacityData,
            rowCss: function (row) {return row.type === "project" ? "project_row" : ""}
        });

        gantt._resourceLayout.getCell("resourceAssign").attach(gantt._resourceAssigner);

        gantt._resourceAssigner.events.on("CellClick", function (row, column, e) {
            if (column.editable !== false && column.id != "hide") {
                gantt._resourceAssigner.editCell(row.id, column.id);
            }
        });

        gantt._resourceAssigner.events.on("BeforeEditStart", function (value, row, column) {
            return 0;
        });

        gantt._resourceAssigner.events.on("AfterEditEnd", function (value, row, column) {
            gantt._lightbox_task[gantt.config.resource_property].find(obj => obj.id === row.id)[column.id] = value;

            if(column.id == "value"){
                var progressCapacity = row && value && row.valuePlan ? Math.round(((value / row.valuePlan))) : 0;
                gantt._resourceAssigner.data.update(row.id, { progress: progressCapacity });
                gantt._lightbox_task[gantt.config.resource_property].find(obj => obj.id === row.id)['progress'] = progressCapacity;
            }
        });


    };
}