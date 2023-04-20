function initResourceEditForm() {
    gantt.$lightboxControl.resources.addForm = function () {

        const generateId = () => {
            return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 5);
        };



        var task = gantt.getTask(gantt._lightbox_id);
        var taskParent = gantt.getTask(task.parent);
        this.$resourcesStore = gantt.$resourcesStore;
        this.resourceData = this.$resourcesStore.getItems();

        this.unassignResource = function (id) {
            var row = gantt._resourceAssigner.data.getItem(id);
            var resource_id = row.resource_id;
            var owner = gantt._lightbox_task[gantt.config.resource_property];
            for (var i = 0; i < owner.length; i++) {
                if (owner[i].resource_id == resource_id) {
                    owner.splice(i, 1);
                }
            }
            gantt._resourceAssigner.data.remove(id);
        };

        this.unassignAllResources = function () {
            var entries = gantt._resourceAssigner.data._order;
            for (var i = 0; i < entries.length; i++) {
                this.unassignResource(entries[i].id)
            }
        };

        this.assignResource = function () {
            var newResourceAssign = {
                id: +new Date(),
                $id: +new Date(),
                text: "Unassigned",
                value: "8",
                mode: "default",
                start_date: new Date(gantt._lightbox_task.start_date),
                end_date: new Date(gantt._lightbox_task.end_date),
                resource_id: "5"
            };
            var assignExists = gantt._resourceAssigner.data.getItem(newResourceAssign.id);
            if (assignExists) {
                gantt.message({text: "Assign already exists!", type: "error"})
                return;
            }

            gantt._resourceAssigner.data.add([newResourceAssign,])
            gantt._lightbox_task[gantt.config.resource_property] = gantt._lightbox_task[gantt.config.resource_property] || [];
            gantt._lightbox_task[gantt.config.resource_property].push(newResourceAssign);
        }

        this.copyResourceAssignment = function (id) {
            gantt._resourceAssigner.data.copy(id);
            var newAssignment = gantt._resourceAssigner.data._order.reverse()[0];
            newAssignment.$id = +new Date();
            gantt._lightbox_task[gantt.config.resource_property].push(newAssignment)
        };


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


        this.addResource = function (item) {
            item = item || {id: +new Date() + "", text: "Resource", parent: 0}
            gantt.$resourcesStore.addItem(item);

            var scrollPosition = this.saveScrollPosition();
            setTimeout(function () {
                gantt.$lightboxControl.fillTabContent("resources");
            }, 50);
            setTimeout(function () {
                gantt.$lightboxControl.resources.restoreScrollPosition(scrollPosition);
            }, 100);
        };

        this.cloneResource = function (id) {
            var resourceItem = gantt.$resourcesStore.pull[id]
            var clone = gantt.copy(resourceItem);
            clone.id = +new Date();
            clone.text += "_copy";
            this.addResource(clone);
        };


        this.deleteResource = function (id) {
            gantt.$resourcesStore.removeItem(id)
            //this.resourceData = gantt.$resourcesStore.getItems();

            var scrollPosition = this.saveScrollPosition();

            setTimeout(function () {
                gantt.$lightboxControl.fillTabContent("resources");
            }, 50);
            setTimeout(function () {
                gantt.$lightboxControl.resources.restoreScrollPosition(scrollPosition);
            }, 100);
        };

        this.deleteAllResources = function () {
            var resourceData = gantt.$resourcesStore.getItems();

            resourceData.forEach(function (el) {
                if (gantt.$resourcesStore.getItem(el.id)) {
                    gantt.$resourcesStore.removeItem(el.id);
                }
            });

            resourceData = [];
            setTimeout(function () {
                gantt.$lightboxControl.fillTabContent("resources");
            }, 100);
        };


        var resourceAssignColumns = [
            {width: 40, id: "hide", header: [{text: ""}], type: "boolean", htmlEnable: true},
            {
                minWidth: 295,
                id: "text",
                header: [{content: "inputFilter",}],
                editorType: "input",
                options: [],
                editable: true,
                editable: false,
                htmlEnable: true
            },
            {
                id: "valuePlan",
                width: 60,
                header: [{text: "План"}],
                editorType: "input",
                sortable: false,
                editable: true,
                editable: false,
                options: []
            },
            {
                width: 60,
                id: "value",
                header: [{text: "Факт"}],
                editorType: "number",
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
            {
                width: 50,
                id: "add",
                header: [{text: "<input type=button value='✚' data-onclick='assignResource' class='dhx_button dhx_button--size_small' title='Add a new resource assignment'>"}],
                sortable: false,
                align: "center",
                htmlEnable: true,
                editable: false,
                template: function (text, row, col) {
                    return "<input type=button value='✚' data-onclick='copyResourceAssignment' data-onclick_argument='" + row.id + "' class='dhx_button dhx_button--size_small' title='Clone this assignment'>";
                }
            },
            {
                width: 60,
                id: "control",
                header: [{text: "<input type=button value='✖' data-onclick='unassignAllResources' class='dhx_button dhx_button--size_small' title='Remove all assignments'>"}],
                sortable: false,
                htmlEnable: true,
                editable: false,
                template: function (text, row, col) {
                    return "<input type=button value='✖' data-onclick='unassignResource' data-onclick_argument='" + row.id + "' class='dhx_button dhx_button--size_small' title='Unassign resource'>";
                }
            }
        ];


        var resourceEditColumns = [
            {width: 40, id: "hide", header: [{text: ""}], type: "boolean", htmlEnable: true},
            {
                minWidth: 200,
                id: "text",
                header: [{content: "inputFilter",}],
                editorType: "input",
                type: "string",
                htmlEnable: true,
            },
            {
                id: "parent",
                minWidth: 120,
                width: 120,
                header: [{text: "Коллекция", align: "center"}],
                editorType: "select",
                options: [],
                sortable: false,
                htmlEnable: true,
                template: function (text, row, col) {
                    return col.optionLabels[text];
                }
            },
            {
                id: "value",
                width: 70,
                header: [{text: "План"}],
                editorType: "input",
                sortable: false,
                options: []
            },
            {
                id: "unit",
                width: 60,
                header: [{text: "Ед.изм"}],
                editorType: "input",
                type: "string",
                sortable: false,
                options: []
            },
            {
                width: 50,
                id: "add",
                header: [{text: "<input type=button value='✚' data-onclick='addResource' class='dhx_button dhx_button--size_small' title='Add a new resource'>"}],
                sortable: false,
                htmlEnable: true,
                editable: false,
                template: function (text, row, col) {
                    return "<input type=button value='⇊' data-onclick='cloneResource' data-onclick_argument='" + row.id + "' class='dhx_button dhx_button--size_small' title='Clone this resource'>";
                }
            },
            {
                width: 50,
                id: "delete",
                header: [{text: "<input type=button value='✖' data-onclick='deleteAllResources' class='dhx_button dhx_button--size_small' title='Remove all resources'>"}],
                sortable: false,
                htmlEnable: true,
                editable: false,
                template: function (text, row, col) {
                    return "<input type=button value='✖' data-onclick='deleteResource' data-onclick_argument='" + row.id + "' class='dhx_button dhx_button--size_small' title='Remove this resource'>";
                }
            }
        ];


        if (gantt._resourceLayout) {
            gantt._resourceLayout.destructor();
        }
        gantt._resourceLayout = new dhx.Layout(null, {
            // type: "none",
            cols: [
                {
                    id: task.type == "project" ? "resourceEdit" : "resourceAssign",
                    html: task.type == "project" ? "<div id='resourceEdit'></div>" : "<div id='resourceAssign'></div>",
                    minHeight: "250px"
                    // collapsable: true,
                }
            ]
        });

        gantt._tabbar.getCell("resources").attach(gantt._resourceLayout);

        if (gantt._resourceAssigner) gantt._resourceAssigner.destructor();
        if (gantt._resourceEditor) gantt._resourceEditor.destructor();

        resourceAssignColumns[1].options = [];
        resourceAssignColumns[4].options = [''];

        this.$resourcesStore = gantt.$resourcesStore;
        var owners = gantt._lightbox_task[gantt.config.resource_property] || [];
        var taskResources = [];
        var resourceData = gantt.$resourcesStore.getItems();
        resourceAssignColumns[1].optionLabels = {};
        resourceData.forEach(function (el) {
             const owner = owners.find(d => d.resource_id == el.id);
             // console.log(owner);
             // console.log(resourceData);
             if (el.parent) {
                 if(!owner){
                    var idNew = generateId();
                       var resourceRow1 = {
                           id: idNew,
                           $id: idNew,
                           delay: 0,
                           duration: 11,
                           text: el.text,
                           value: '8',
                           valuePlan: el.value,
                           mode: "default",
                           unit:  el.unit,
                           resource_id: el.id
                           // start_date: new Date(gantt._lightbox_task.start_date),
                           // end_date: new Date(gantt._lightbox_task.end_date),
                       };
                    taskResources.push(resourceRow1);
                   }
                 if (owner) {
                     var resourceRow = gantt.copy(owner);
                     // else resourceEditColumns[6].options.push(el.text);
                     resourceRow.text = el.text
                     resourceRow.value = owner.value || '8';
                     // resourceRow.valuePlan = (el.value / taskParent.duration_plan * task.duration).toFixed(2);
                     resourceRow.valuePlan = el.value;
                     resourceRow.unit = el.unit || '';
                     taskResources.push(resourceRow);
                 }
             }
            if (el.parent) {
                resourceAssignColumns[1].options.push(el.id);
                resourceAssignColumns[1].optionLabels[el.id] = el.text;
            }


        })
console.log(taskResources);

        gantt._resourceAssigner = new dhx.Grid(null, {
            columns: resourceAssignColumns,
            // rowHeight: 50,
            autoHeight: true,
            autoWidth: true,
            editable: true,
            data: taskResources
        });

        if (task.type == "splittask") {
            gantt._resourceLayout.getCell("resourceAssign").attach(gantt._resourceAssigner);
        }


        gantt._resourceAssigner.events.on("CellClick", function (row, column, e) {
            if (column.editable !== false) {
                gantt._resourceAssigner.editCell(row.id, column.id);
            }
        });

        gantt._resourceAssigner.events.on("AfterEditStart", function (row, col, editorType) {
            if (col.id == "resource_id") {
                setTimeout(function () {
                    var selectEl = document.querySelector(".dhx_cell-editor__select");
                    var selectedValue = selectEl.value;
                    console.log(selectEl.value);
                    var children = selectEl.childNodes;
                    for (var i = 0; i < children.length; i++) {
                        var child = children[i];
                        child.outerHTML = "<option value=" + child.innerHTML + ">" + gantt.$resourcesStore.pull[child.innerHTML].text + "</option>";
                    }
                    console.log(1);
                    selectEl.value = selectedValue;
                }, 50);
            }
        });


        gantt._resourceAssigner.events.on("BeforeEditEnd", function (value, row, column) {
            gantt._lightbox_task[gantt.config.resource_property] = gantt._lightbox_task[gantt.config.resource_property] || [{resource_id: value}];
            var owner = gantt._lightbox_task[gantt.config.resource_property];
            owner.forEach(function (el) {

                if (el.resource_id == row.resource_id && column.id == "resource_id") {
                    gantt._resourceAssigner.data.getItem(row.id).resource_id = value;
                    console.log(value);
                    el.resource_id = value;
                }
            })
        });

        gantt._resourceAssigner.events.on("AfterEditEnd", function (value, row, column) {
            var owner = gantt._lightbox_task[gantt.config.resource_property];
            owner.forEach(function (el) {
                if (el.$id == row.$id && column.id != "resource_id") {
                    if (el[column.id] instanceof Date) {
                        value = formatDate(value);
                    }
                    el[column.id] = value;
                }
            })
        });


        resourceEditColumns[2].options = ["0"];
        resourceEditColumns[2].optionLabels = {"0": ''};

        var calendars = gantt.getCalendars();
        resourceEditColumns[2].options = [];
        calendars.forEach(function (el) {
            resourceEditColumns[2].options.push(el.id);
        })

        resourceData.forEach(function (el) {
            el.unit = el.unit || '';
            el.hide = el.hide || true;
            el.calendar = el.calendar || "global";

            resourceEditColumns[2].options.push(el.id);
            resourceEditColumns[2].optionLabels[el.id] = el.text;
        })

        gantt._resourceEditor = new dhx.Grid(null, {
            columns: resourceEditColumns,
            autoHeight: true,
            autoWidth: true,
            editable: true,
            data: resourceData
        });
        gantt._resourceLayout.getCell("resourceEdit").attach(gantt._resourceEditor);

        gantt._resourceEditor.events.on("CellClick", function (row, column, e) {
            if (column.editable !== false) {
                gantt._resourceEditor.editCell(row.id, column.id);
            }
        });

        gantt._resourceEditor.events.on("AfterEditStart", function (row, col, editorType) {
            if (col.id == "parent") {
                setTimeout(function () {
                    console.log(col);
                    var selectEl = document.querySelector(".dhx_cell-editor__select");
                    console.log(selectEl);
                    var selectedValue = selectEl.value;
                    // console.log(selectedValue);
                    var children = selectEl.childNodes;
                    children[0].outerHTML = "<option value=0>Root level</option>";
                    for (var j = 1; j < children.length; j++) {
                        var child = children[j];
                        for (var i = 0; i < resourceData.length; i++) {
                            if (child.innerHTML == resourceData[i].id) {
                                child.outerHTML = "<option value=" + resourceData[i].id + ">" + resourceData[i].text + "</option>";
                            }
                        }
                    }
                    selectEl.value = selectedValue;
                }, 300);
            }
        });

        gantt._resourceEditor.events.on("AfterEditEnd", function (value, row, column) {
            if (column.id == "calendar") {
                gantt.config.resource_calendars[row.id] = row.calendar;
            }
            if (column.id == "text") {
                gantt._resourceAssigner.config.columns[1].optionLabels[row.id] = value;
                gantt._resourceAssigner.paint();
            }
        });
    };
}