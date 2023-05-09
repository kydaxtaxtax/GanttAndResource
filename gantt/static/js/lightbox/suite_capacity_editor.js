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
            {width: 40, id: "hide", header: [{text: ""}], type: "boolean", htmlEnable: true},
            {
                minWidth: 382,
                id: "text",
                header: [{content: "inputFilter",}],
                editorType: "input",
                options: [],
                editable: false,
                htmlEnable: true
            },
            {
                id: "valuePlan",
                width: 80,
                header: [{text: "План"}],
                editorType: "input",
                sortable: false,
                editable: false,
                options: []
            },
            {
                width: 80,
                id: "value",
                header: [{text: "Факт"}],
                editorType: "number",
                editable: true,
                sortable: false,
                options: []
            },
            {
                width: 60,
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

            if (el.parent) {
                var idNew = generateId();
                if (!capasityItem) {
                    var newCapacityRow = {
                        id: idNew,
                        $id: idNew,
                        text: el.text,
                        value: '',
                        valuePlan: el.value,
                        unit: el.unit,
                        resource_id: el.id,
                        hide: false
                    };
                    capacityData.push(newCapacityRow);
                    if (!task.$new) {
                        gantt._lightbox_task[gantt.config.resource_property].push(newCapacityRow);
                    } else {
                        if(!gantt._lightbox_task[gantt.config.resource_property]){
                            gantt._lightbox_task[gantt.config.resource_property] = [];
                        }
                        gantt._lightbox_task[gantt.config.resource_property].push(newCapacityRow);
                    }

                } else {
                    var capacityRow = gantt.copy(capasityItem);
                    // else resourceEditColumns[6].options.push(el.text);
                    capacityRow.text = el.text
                    capacityRow.value = capasityItem.value || '';
                    // capacityRow.valuePlan = (el.value / taskParent.duration_plan * task.duration).toFixed(2);
                    capacityRow.valuePlan = el.value;
                    capacityRow.unit = el.unit || '';
                    capacityRow.hide = capasityItem.hide || false;
                    capacityData.push(capacityRow);
                }
            }
            // if (el.parent) {
            //     resourceAssignColumns[1].options.push(el.id);
            //     resourceAssignColumns[1].optionLabels[el.id] = el.text;
            // }
        })

        gantt._resourceAssigner = new dhx.Grid(null, {
            columns: resourceAssignColumns,
            // rowHeight: 50,
            autoHeight: true,
            autoWidth: true,
            editable: true,
            data: capacityData
        });

        gantt._resourceLayout.getCell("resourceAssign").attach(gantt._resourceAssigner);

        gantt._resourceAssigner.events.on("CellClick", function (row, column, e) {
            if (column.editable !== false) {
                gantt._resourceAssigner.editCell(row.id, column.id);
            }
        });

        gantt._resourceAssigner.events.on("AfterEditStart", function (value, row, column) {
            column.id == "hide" && value === true ? gantt._resourceAssigner.showRow(row.id) : gantt._resourceAssigner.hideRow(row.id);
        });

        gantt._resourceAssigner.events.on("AfterEditEnd", function (value, row, column) {
            const objectToUpdate = gantt._lightbox_task[gantt.config.resource_property].find(obj => obj.id === row.id);
                if (objectToUpdate) {
                  objectToUpdate[column.id] = value;
                }
            gantt.getTask(gantt._lightbox_task.id)[gantt.config.resource_property] = gantt._lightbox_task[gantt.config.resource_property];
            gantt.updateTask(gantt._lightbox_task.id);
        });
    };
}