/*
@license

dhtmlxGantt v.6.3.4 Professional Evaluation
This software is covered by DHTMLX Evaluation License. Contact sales@dhtmlx.com to get Commercial or Enterprise license. Usage without proper license is prohibited.

(c) XB Software Ltd.

*/
Gantt.plugin(function(t) {
    ! function(t, n) {
        "object" == typeof exports && "object" == typeof module ? module.exports = n() : "function" == typeof define && define.amd ? define("ext/dhtmlxgantt_undo", [], n) : "object" == typeof exports ? exports["ext/dhtmlxgantt_undo"] = n() : t["ext/dhtmlxgantt_undo"] = n()
    }(window, function() {
        return function(t) {
            var n = {};

            function e(o) {
                if (n[o]) return n[o].exports;
                var i = n[o] = {
                    i: o,
                    l: !1,
                    exports: {}
                };
                return t[o].call(i.exports, i, i.exports, e), i.l = !0, i.exports
            }
            return e.m = t, e.c = n, e.d = function(t, n, o) {
                e.o(t, n) || Object.defineProperty(t, n, {
                    enumerable: !0,
                    get: o
                })
            }, e.r = function(t) {
                "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
                    value: "Module"
                }), Object.defineProperty(t, "__esModule", {
                    value: !0
                })
            }, e.t = function(t, n) {
                if (1 & n && (t = e(t)), 8 & n) return t;
                if (4 & n && "object" == typeof t && t && t.__esModule) return t;
                var o = Object.create(null);
                if (e.r(o), Object.defineProperty(o, "default", {
                        enumerable: !0,
                        value: t
                    }), 2 & n && "string" != typeof t)
                    for (var i in t) e.d(o, i, function(n) {
                        return t[n]
                    }.bind(null, i));
                return o
            }, e.n = function(t) {
                var n = t && t.__esModule ? function() {
                    return t.default
                } : function() {
                    return t
                };
                return e.d(n, "a", n), n
            }, e.o = function(t, n) {
                return Object.prototype.hasOwnProperty.call(t, n)
            }, e.p = "/codebase/", e(e.s = 238)
        }({
            236: function(n, e, o) {
                "use strict";
                Object.defineProperty(e, "__esModule", {
                    value: !0
                });
                var i = 10,
                    a = function() {
                        function n() {
                            var n = this;
                            this.maxSteps = i, this.undoEnabled = !0, this.redoEnabled = !0, this.action = {
                                create: function(t) {
                                    return {
                                        commands: t ? t.slice() : []
                                    }
                                },
                                invert: function(e) {
                                    for (var o, i = t.copy(e), a = n.command, s = 0; s < e.commands.length; s++) {
                                        var r = i.commands[s] = a.invert(i.commands[s]);
                                        r.type !== a.type.update && r.type !== a.type.move || (o = [r.oldValue, r.value], r.value = o[0], r.oldValue = o[1])
                                    }
                                    return i
                                }
                            }, this.command = {
                                entity: null,
                                type: null,
                                create: function(n, e, o, i) {
                                    return {
                                        entity: i,
                                        type: o,
                                        value: t.copy(n),
                                        oldValue: t.copy(e || n)
                                    }
                                },
                                invert: function(n) {
                                    var e = t.copy(n);
                                    return e.type = this.inverseCommands(n.type), e
                                },
                                inverseCommands: function(n) {
                                    switch (n) {
                                        case this.type.update:
                                            return this.type.update;
                                        case this.type.remove:
                                            return this.type.add;
                                        case this.type.add:
                                            return this.type.remove;
                                        case this.type.move:
                                            return this.type.move;
                                        default:
                                            return t.assert(!1, "Invalid command " + n), null
                                    }
                                }
                            }, this._undoStack = [], this._redoStack = []
                        }
                        return n.prototype.getUndoStack = function() {
                            return this._undoStack
                        }, n.prototype.getRedoStack = function() {
                            return this._redoStack
                        }, n.prototype.clearUndoStack = function() {
                            this._undoStack = []
                        }, n.prototype.clearRedoStack = function() {
                            this._redoStack = []
                        }, n.prototype.updateConfigs = function() {
                            this.maxSteps = t.config.undo_steps || i, this.command.entity = t.config.undo_types, this.command.type = t.config.undo_actions, this.undoEnabled = !!t.config.undo, this.redoEnabled = !!t.config.undo && !!t.config.redo
                        }, n.prototype.undo = function() {
                            if (this.updateConfigs(), this.undoEnabled) {
                                var n = this._pop(this._undoStack);
                                if (n && this._reorderCommands(n), !1 !== t.callEvent("onBeforeUndo", [n]) && n) return this._applyAction(this.action.invert(n)), this._push(this._redoStack, t.copy(n)), void t.callEvent("onAfterUndo", [n]);
                                t.callEvent("onAfterUndo", [null])
                            }
                        }, n.prototype.redo = function() {
                            if (this.updateConfigs(), this.redoEnabled) {
                                var n = this._pop(this._redoStack);
                                if (n && this._reorderCommands(n), !1 !== t.callEvent("onBeforeRedo", [n]) && n) return this._applyAction(n), this._push(this._undoStack, t.copy(n)), void t.callEvent("onAfterRedo", [n]);
                                t.callEvent("onAfterRedo", [null])
                            }
                        }, n.prototype.logAction = function(t) {
                            this._push(this._undoStack, t), this._redoStack = []
                        }, n.prototype._push = function(n, e) {
                            if (e.commands.length) {
                                var o = n === this._undoStack ? "onBeforeUndoStack" : "onBeforeRedoStack";
                                if (!1 !== t.callEvent(o, [e]) && e.commands.length) {
                                    for (n.push(e); n.length > this.maxSteps;) n.shift();
                                    return e
                                }
                            }
                        }, n.prototype._pop = function(t) {
                            return t.pop()
                        }, n.prototype._reorderCommands = function(t) {
                            var n = {
                                    any: 0,
                                    link: 1,
                                    task: 2
                                },
                                e = {
                                    move: 1,
                                    any: 0
                                };
                            t.commands.sort(function(t, o) {
                                if ("task" === t.entity && "task" === o.entity) return t.type !== o.type ? (e[o.type] || 0) - (e[t.type] || 0) : "move" === t.type && t.oldValue && o.oldValue && o.oldValue.parent === t.oldValue.parent ? t.oldValue.$index - o.oldValue.$index : 0;
                                var i = n[t.entity] || n.any;
                                return (n[o.entity] || n.any) - i
                            })
                        }, n.prototype._applyAction = function(n) {
                            var e = null,
                                o = this.command.entity,
                                i = this.command.type,
                                a = {};
                            a[o.task] = {
                                add: "addTask",
                                get: "getTask",
                                update: "updateTask",
                                remove: "deleteTask",
                                move: "moveTask",
                                isExists: "isTaskExists"
                            }, a[o.link] = {
                                add: "addLink",
                                get: "getLink",
                                update: "updateLink",
                                remove: "deleteLink",
                                isExists: "isLinkExists"
                            }, t.batchUpdate(function() {
                                for (var o = 0; o < n.commands.length; o++) {
                                    e = n.commands[o];
                                    var s = a[e.entity][e.type],
                                        r = a[e.entity].get,
                                        d = a[e.entity].isExists;
                                    if (e.type === i.add) t[s](e.oldValue, e.oldValue.parent, e.oldValue.$index);
                                    else if (e.type === i.remove) t[d](e.value.id) && t[s](e.value.id);
                                    else if (e.type === i.update) {
                                        var c = t[r](e.value.id);
                                        for (var u in e.value) u.startsWith("$") || u.startsWith("_") || (c[u] = e.value[u]);
                                        t[s](e.value.id)
                                    } else e.type === i.move && t[s](e.value.id, e.value.$index, e.value.parent)
                                }
                            })
                        }, n
                    }();
                e.Undo = a
            },
            237: function(n, e, o) {
                "use strict";
                Object.defineProperty(e, "__esModule", {
                    value: !0
                });
                var i = {
                        onBeforeUndo: "onAfterUndo",
                        onBeforeRedo: "onAfterRedo"
                    },
                    a = ["onTaskDragStart", "onAfterTaskUpdate", "onAfterTaskDelete", "onBeforeBatchUpdate"],
                    s = function() {
                        function n(t) {
                            this._batchAction = null, this._batchMode = !1, this._ignore = !1, this._ignoreMoveEvents = !1, this._initialTasks = {}, this._initialLinks = {}, this._nestedTasks = {}, this._nestedLinks = {}, this._undo = t, this._attachEvents()
                        }
                        return n.prototype.store = function(n, e, o) {
                            return void 0 === o && (o = !1), e === t.config.undo_types.task ? this._storeTask(n, o) : e === t.config.undo_types.link && this._storeLink(n, o)
                        }, n.prototype.isMoveEventsIgnored = function() {
                            return this._ignoreMoveEvents
                        }, n.prototype.toggleIgnoreMoveEvents = function(t) {
                            this._ignoreMoveEvents = t || !1
                        }, n.prototype.startIgnore = function() {
                            this._ignore = !0
                        }, n.prototype.stopIgnore = function() {
                            this._ignore = !1
                        }, n.prototype.startBatchAction = function() {
                            var t = this;
                            this._timeout && clearTimeout(this._timeout), this._timeout = setTimeout(function() {
                                t.stopBatchAction()
                            }, 10), this._ignore || this._batchMode || (this._batchMode = !0, this._batchAction = this._undo.action.create())
                        }, n.prototype.stopBatchAction = function() {
                            if (!this._ignore) {
                                var t = this._undo;
                                this._batchAction && t.logAction(this._batchAction), this._batchMode = !1, this._batchAction = null
                            }
                        }, n.prototype.onTaskAdded = function(t) {
                            this._ignore || this._storeTaskCommand(t, this._undo.command.type.add)
                        }, n.prototype.onTaskUpdated = function(t) {
                            this._ignore || this._storeTaskCommand(t, this._undo.command.type.update)
                        }, n.prototype.onTaskMoved = function(t) {
                            this._ignore || this._storeEntityCommand(t, this.getInitialTask(t.id), this._undo.command.type.move, this._undo.command.entity.task)
                        }, n.prototype.onTaskDeleted = function(t) {
                            if (!this._ignore) {
                                if (this._storeTaskCommand(t, this._undo.command.type.remove), this._nestedTasks[t.id])
                                    for (var n = this._nestedTasks[t.id], e = 0; e < n.length; e++) this._storeTaskCommand(n[e], this._undo.command.type.remove);
                                if (this._nestedLinks[t.id]) {
                                    var o = this._nestedLinks[t.id];
                                    for (e = 0; e < o.length; e++) this._storeLinkCommand(o[e], this._undo.command.type.remove)
                                }
                            }
                        }, n.prototype.onLinkAdded = function(t) {
                            this._ignore || this._storeLinkCommand(t, this._undo.command.type.add)
                        }, n.prototype.onLinkUpdated = function(t) {
                            this._ignore || this._storeLinkCommand(t, this._undo.command.type.update)
                        }, n.prototype.onLinkDeleted = function(t) {
                            this._ignore || this._storeLinkCommand(t, this._undo.command.type.remove)
                        }, n.prototype.setNestedTasks = function(n, e) {
                            for (var o = null, i = [], a = this._getLinks(t.getTask(n)), s = 0; s < e.length; s++) o = this.setInitialTask(e[s]), a = a.concat(this._getLinks(o)), i.push(o);
                            var r = {};
                            for (s = 0; s < a.length; s++) r[a[s]] = !0;
                            var d = [];
                            for (var s in r) d.push(this.setInitialLink(s));
                            this._nestedTasks[n] = i, this._nestedLinks[n] = d
                        }, n.prototype.setInitialTask = function(n, e) {
                            if (e || !this._initialTasks[n] || !this._batchMode) {
                                var o = t.copy(t.getTask(n));
                                o.$index = t.getTaskIndex(n), this.setInitialTaskObject(n, o)
                            }
                            return this._initialTasks[n]
                        }, n.prototype.getInitialTask = function(t) {
                            return this._initialTasks[t]
                        }, n.prototype.clearInitialTasks = function() {
                            this._initialTasks = {}
                        }, n.prototype.setInitialTaskObject = function(t, n) {
                            this._initialTasks[t] = n
                        }, n.prototype.setInitialLink = function(n, e) {
                            return this._initialLinks[n] && this._batchMode || (this._initialLinks[n] = t.copy(t.getLink(n))), this._initialLinks[n]
                        }, n.prototype.getInitialLink = function(t) {
                            return this._initialLinks[t]
                        }, n.prototype.clearInitialLinks = function() {
                            this._initialLinks = {}
                        }, n.prototype._attachEvents = function() {
                            var n = this,
                                e = null,
                                o = function() {
                                    e || (e = setTimeout(function() {
                                        e = null
                                    }), n.clearInitialTasks(), t.eachTask(function(t) {
                                        n.setInitialTask(t.id)
                                    }), n.clearInitialLinks(), t.getLinks().forEach(function(t) {
                                        n.setInitialLink(t.id)
                                    }))
                                },
                                s = function(n) {
                                    return t.copy(t.getTask(n))
                                };
                            for (var r in i) t.attachEvent(r, function() {
                                return n.startIgnore(), !0
                            }), t.attachEvent(i[r], function() {
                                return n.stopIgnore(), !0
                            });
                            for (r = 0; r < a.length; r++) t.attachEvent(a[r], function() {
                                return n.startBatchAction(), !0
                            });
                            t.attachEvent("onParse", function() {
                                n._undo.clearUndoStack(), n._undo.clearRedoStack(), o()
                            }), t.attachEvent("onAfterTaskAdd", function(t, e) {
                                n.setInitialTask(t, !0), n.onTaskAdded(e)
                            }), t.attachEvent("onAfterTaskUpdate", function(t, e) {
                                n.onTaskUpdated(e)
                            }), t.attachEvent("onAfterTaskDelete", function(t, e) {
                                n.onTaskDeleted(e)
                            }), t.attachEvent("onAfterLinkAdd", function(t, e) {
                                n.setInitialLink(t, !0), n.onLinkAdded(e)
                            }), t.attachEvent("onAfterLinkUpdate", function(t, e) {
                                n.onLinkUpdated(e)
                            }), t.attachEvent("onAfterLinkDelete", function(t, e) {
                                n.onLinkDeleted(e)
                            }), t.attachEvent("onRowDragEnd", function(t, e) {
                                return n.onTaskMoved(s(t)), n.toggleIgnoreMoveEvents(), !0
                            }), t.attachEvent("onBeforeTaskDelete", function(e) {
                                n.store(e, t.config.undo_types.task);
                                var i = [];
                                return o(), t.eachTask(function(t) {
                                    i.push(t.id)
                                }, e), n.setNestedTasks(e, i), !0
                            });
                            var d = t.getDatastore("task");
                            d.attachEvent("onBeforeItemMove", function(t, e, i) {
                                return n.isMoveEventsIgnored() || o(), !0
                            }), d.attachEvent("onAfterItemMove", function(t, e, o) {
                                return n.isMoveEventsIgnored() || n.onTaskMoved(s(t)), !0
                            }), t.attachEvent("onRowDragStart", function(t, e, i) {
                                return n.toggleIgnoreMoveEvents(!0), o(), !0
                            }), t.attachEvent("onBeforeTaskDrag", function(e) {
                                return n.store(e, t.config.undo_types.task)
                            }), t.attachEvent("onLightbox", function(e) {
                                return n.store(e, t.config.undo_types.task)
                            }), t.attachEvent("onBeforeTaskAutoSchedule", function(e) {
                                return n.store(e.id, t.config.undo_types.task), !0
                            }), t.ext.inlineEditors && t.ext.inlineEditors.attachEvent("onEditStart", function(e) {
                                n.store(e.id, t.config.undo_types.task)
                            })
                        }, n.prototype._storeCommand = function(t) {
                            var n = this._undo;
                            if (n.updateConfigs(), n.undoEnabled)
                                if (this._batchMode) this._batchAction.commands.push(t);
                                else {
                                    var e = n.action.create([t]);
                                    n.logAction(e)
                                }
                        }, n.prototype._storeEntityCommand = function(t, n, e, o) {
                            var i = this._undo.command.create(t, n, e, o);
                            this._storeCommand(i)
                        }, n.prototype._storeTaskCommand = function(t, n) {
                            this._storeEntityCommand(t, this.getInitialTask(t.id), n, this._undo.command.entity.task)
                        }, n.prototype._storeLinkCommand = function(t, n) {
                            this._storeEntityCommand(t, this.getInitialLink(t.id), n, this._undo.command.entity.link)
                        }, n.prototype._getLinks = function(t) {
                            return t.$source.concat(t.$target)
                        }, n.prototype._storeTask = function(n, e) {
                            var o = this;
                            return void 0 === e && (e = !1), this.setInitialTask(n, e), t.eachTask(function(t) {
                                o.setInitialTask(t.id)
                            }, n), !0
                        }, n.prototype._storeLink = function(t, n) {
                            return void 0 === n && (n = !1), this.setInitialLink(t, n), !0
                        }, n
                    }();
                e.Monitor = s
            },
            238: function(n, e, o) {
                "use strict";
                Object.defineProperty(e, "__esModule", {
                    value: !0
                });
                var i = o(237),
                    a = new(o(236).Undo),
                    s = new i.Monitor(a);

                function r(t, n, e) {
                    t && (t.id === n && (t.id = e), t.parent === n && (t.parent = e))
                }

                function d(t, n, e) {
                    r(t.value, n, e), r(t.oldValue, n, e)
                }

                function c(t, n, e) {
                    t && (t.source === n && (t.source = e), t.target === n && (t.target = e))
                }

                function u(t, n, e) {
                    c(t.value, n, e), c(t.oldValue, n, e)
                }

                function l(t, n, e) {
                    for (var o = a, i = 0; i < t.length; i++)
                        for (var s = t[i], r = 0; r < s.commands.length; r++) s.commands[r].entity === o.command.entity.task ? d(s.commands[r], n, e) : s.commands[r].entity === o.command.entity.link && u(s.commands[r], n, e)
                }

                function p(t, n, e) {
                    for (var o = a, i = 0; i < t.length; i++)
                        for (var s = t[i], r = 0; r < s.commands.length; r++) {
                            var d = s.commands[r];
                            d.entity === o.command.entity.link && (d.value && d.value.id === n && (d.value.id = e), d.oldValue && d.oldValue.id === n && (d.oldValue.id = e))
                        }
                }
                t.config.undo = !0, t.config.redo = !0, t.config.undo_types = {
                    link: "link",
                    task: "task"
                }, t.config.undo_actions = {
                    update: "update",
                    remove: "remove",
                    add: "add",
                    move: "move"
                }, t.ext || (t.ext = {}), t.ext.undo = {
                    undo: function() {
                        return a.undo()
                    },
                    redo: function() {
                        return a.redo()
                    },
                    getUndoStack: function() {
                        return a.getUndoStack()
                    },
                    getRedoStack: function() {
                        return a.getRedoStack()
                    },
                    clearUndoStack: function() {
                        return a.clearUndoStack()
                    },
                    clearRedoStack: function() {
                        return a.clearRedoStack()
                    },
                    saveState: function(t, n) {
                        return s.store(t, n, !0)
                    }
                }, t.undo = t.ext.undo.undo, t.redo = t.ext.undo.redo, t.getUndoStack = t.ext.undo.getUndoStack, t.getRedoStack = t.ext.undo.getRedoStack, t.clearUndoStack = t.ext.undo.clearUndoStack, t.clearRedoStack = t.ext.undo.clearRedoStack, t.attachEvent("onTaskIdChange", function(t, n) {
                    var e = a;
                    l(e.getUndoStack(), t, n), l(e.getRedoStack(), t, n)
                }), t.attachEvent("onLinkIdChange", function(t, n) {
                    var e = a;
                    p(e.getUndoStack(), t, n), p(e.getRedoStack(), t, n)
                }), t.attachEvent("onGanttReady", function() {
                    a.updateConfigs()
                })
            }
        })
    })
});