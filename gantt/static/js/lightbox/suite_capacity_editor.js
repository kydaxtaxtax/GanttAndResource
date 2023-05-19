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
                width: 302,
                id: "text",
                header: [{content: "inputFilter",}],
                editorType: "input",
                options: [],
                editable: false,
                htmlEnable: true,
                footer: [{ text: '<div class="custom_footer">Total</div>' }],
            },
            {width: 40, id: "hide", header: [{text: ""}], type: "boolean", htmlEnable: true},
            {
                id: "valuePlan",
                width: 75,
                header: [{text: "План"}],
                editorType: "input",
                sortable: false,
                editable: false,
                options: [],
                footer: [{ content: "sum"}]
            },
            {
                width: 75,
                id: "value",
                header: [{text: "Факт"}],
                editorType: "number",
                sortable: false,
                editable: true,
                options: [],
                footer: [{ content: "sum"}]
            },
            {
                width: 80,
                id: "progress",
                header: [{text: "Прогресс"}],
                editorType: "input",
                type: "string",
                sortable: false,
                editable: false,
                options: [],
                footer: [{ content: "sum"}]
            },
            {
                width: 70,
                id: "unit",
                header: [{text: "Ед.изм"}],
                editorType: "input",
                type: "string",
                sortable: false,
                editable: false,
                options: []
            },
            // {
            //     width: 50,
            //     id: "add",
            //     header: [{text: "<input type=button value='✚' data-onclick='assignResource' class='dhx_button dhx_button--size_small' title='Add a new resource assignment'>"}],
            //     sortable: false,
            //     align: "center",
            //     htmlEnable: true,
            //     editable: false,
            //     template: function (text, row, col) {
            //         return "<input type=button value='✚' data-onclick='copyResourceAssignment' data-onclick_argument='" + row.id + "' class='dhx_button dhx_button--size_small' title='Clone this assignment'>";
            //     }
            // },
            // {
            //     width: 60,
            //     id: "control",
            //     header: [{text: "<input type=button value='✖' data-onclick='unassignAllResources' class='dhx_button dhx_button--size_small' title='Remove all assignments'>"}],
            //     sortable: false,
            //     htmlEnable: true,
            //     editable: false,
            //     template: function (text, row, col) {
            //         return "<input type=button value='✖' data-onclick='unassignResource' data-onclick_argument='" + row.id + "' class='dhx_button dhx_button--size_small' title='Unassign resource'>";
            //     }
            // }
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

        this.$resourcesStore = gantt.$resourcesStore;

        var capacityData = [];
        var resourceData = gantt.$resourcesStore.getItems();

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
                            value: '',
                            type: "task",
                            parent: el.parent,
                            valuePlan: el.value,
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

                        // else resourceEditColumns[6].options.push(el.text);
                        capacityRow.text = el.text;
                        capacityRow.value = capacityRow.value || '';
                        capacityRow.type = "task";
                        // capacityRow.valuePlan = (el.value / taskParent.duration_plan * task.duration).toFixed(2);
                        capacityRow.progress = Math.round(((capacityRow.value / el.value) * 100)) + '%';
                        capacityRow.valuePlan = el.value;
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
            // rowHeight: 50,
            // dragItem: "both",
            autoHeight: true,
            autoWidth: true,
            editable: true,
            data: capacityData,
            rowCss: function (row) {return row.type === "project" ? "project_row" : ""}
        });

        gantt._resourceLayout.getCell("resourceAssign").attach(gantt._resourceAssigner);

        // grid.events.on("beforeEditStart", function(row,col,editorType){
        //     // your logic here
        //     return true;
        // });

        gantt._resourceAssigner.events.on("CellClick", function (row, column, e) {
            if (column.editable !== false && column.id != "hide") {
                gantt._resourceAssigner.editCell(row.id, column.id);
            }
        });

        gantt._resourceAssigner.events.on("AfterEditEnd", function (value, row, column) {
            gantt._lightbox_task[gantt.config.resource_property].find(obj => obj.id === row.id)[column.id] = value;
        });

    };
}