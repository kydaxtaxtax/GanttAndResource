function initResourceEditForm() {
    gantt.$lightboxControl.resources.addForm = function () {

          const generateId = () => {
          const timestamp = Date.now();
          const random = Math.floor(Math.random() * 100000);
          return `${timestamp}${random}`;
        };

        var task = gantt.getTask(gantt._lightbox_id);

        var taskParent = gantt.getTask(task.parent);
        // this.$resourcesStore = gantt.$resourcesStore;
        // this.resourceData = this.$resourcesStore.getItems();

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
            item = item || {id: +new Date() + "", text: "Название ресурса", parent: 0}
            gantt.$resourcesStore.addItem(item);

            // var scrollPosition = this.saveScrollPosition();
            setTimeout(function () {
                gantt.$lightboxControl.fillTabContent("resources");
            }, 50);
            // setTimeout(function () {
            //     gantt.$lightboxControl.resources.restoreScrollPosition(scrollPosition);
            // }, 100);
        };

        this.cloneResource = function (id) {
            var resourceItem = gantt.$resourcesStore.pull[id]
            var clone = gantt.copy(resourceItem);
            clone.id = +new Date();
            clone.parent = parseInt(id);
            clone.type = "task";
            clone.text = "Наименование ресурса";
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

        var resourceEditColumns = [
            {
                minWidth: 200,
                id: "text",
                header: [{content: "inputFilter",}],
                editorType: "input",
                type: "string",
                htmlEnable: true,
            },
             {width: 40, id: "hide", header: [{text: ""}], type: "boolean", htmlEnable: true},
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
                    return "<input type=button value='✚' data-onclick='cloneResource' data-onclick_argument='" + row.id + "' class='dhx_button dhx_button--size_small' title='Clone this resource'>";
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
            cols: [
                {
                    id: "resourceEdit",
                    html: task.type == "project" ? "<div id='resourceEdit'></div>" : "<div id='resourceAssign'></div>",
                    minHeight: "250px"
                    // collapsable: true,
                }
            ]
        });

        gantt._tabbar.getCell("resources").attach(gantt._resourceLayout);
        if (gantt._resourceEditor) gantt._resourceEditor.destructor();

        this.$resourcesStore = gantt.$resourcesStore;
        var resourceData = gantt.$resourcesStore.getItems();

        resourceEditColumns[2].options = ["0"];
        resourceEditColumns[2].optionLabels = {"0": ''};
        resourceEditColumns[2].options = [];

        resourceData.forEach(function (el) {
            if(el.id == 1 || el.id == 2 || el.id == 3) {
                resourceEditColumns[2].options.push(el.id);
                resourceEditColumns[2].optionLabels[el.id] = el.text;
                el.parent = undefined;
            }
        })

console.log(resourceData);
        gantt._resourceEditor = new dhx.TreeGrid(null, {
            columns: resourceEditColumns,
            autoHeight: true,
            // dragItem: "both",
            autoWidth: true,
            editable: true,
            data: resourceData
        });

        // resourceData.forEach(function (el) {
        //     if(el.id == 1 || el.id == 2 || el.id == 3){
        //         gantt._resourceEditor.data.remove(el.id);
        //     }
        // })


        gantt._resourceLayout.getCell("resourceEdit").attach(gantt._resourceEditor);

        gantt._resourceEditor.events.on("CellClick", function (row, column, e) {
              if (column.editable !== false && column.id != "hide") {
                gantt._resourceEditor.editCell(row.id, column.id);
            }
        });

        gantt._resourceEditor.events.on("AfterEditStart", function (row, col, editorType) {

            if (col.id == "parent") {
                setTimeout(function () {
                    var selectEl = document.querySelector(".dhx_cell-editor__select");
                    var selectedValue = selectEl.value;
                    var children = selectEl.childNodes;
                    for (var j = 0; j < children.length; j++) {
                        var child = children[j];
                        for (var i = 0; i < resourceData.length; i++) {
                            if (child.innerHTML == resourceData[i].id) {
                                child.outerHTML = "<option value=" + resourceData[i].id + ">" + resourceData[i].text + "</option>";
                            }
                        }
                    }
                    selectEl.value = selectedValue;
                }, 50);
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

        gantt._resourceEditor.events.on("AfterEditEnd", function (value, row, column) {
            var objectToUpdate = gantt._lightbox_task[gantt.config.resource_store].find(obj => obj.id === row.id);
            if (!objectToUpdate){
                gantt._lightbox_task[gantt.config.resource_store].push(row);
            }
            if (objectToUpdate) {
                objectToUpdate[column.id] = value;
            }

            gantt.getTask(gantt._lightbox_task.id)[gantt.config.resource_store] = gantt._lightbox_task[gantt.config.resource_store];
            gantt.updateTask(gantt._lightbox_task.id);
        });
    };
}