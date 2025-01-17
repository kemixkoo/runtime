/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global define, module, require, exports */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['nf.CanvasUtils',
                'nf.ContextMenu'],
            function (nfCanvasUtils, nfContextMenu) {
                return (nf.ng.Canvas.ToolboxCtrl = factory(nfCanvasUtils, nfContextMenu));
            });
    } else if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = (nf.ng.Canvas.ToolboxCtrl =
            factory(require('nf.CanvasUtils'),
                require('nf.ContextMenu')));
    } else {
        nf.ng.Canvas.ToolboxCtrl = factory(root.nf.CanvasUtils,
            root.nf.ContextMenu);
    }
}(this, function (nfCanvasUtils, nfContextMenu) {
    'use strict';

    return function (processorComponent,
                     inputPortComponent,
                     outputPortComponent,
                     groupComponent,
                     remoteGroupComponent,
                     funnelComponent,
                     templateComponent,
                     labelComponent) {
        'use strict';

        function ToolboxCtrl(processorComponent,
                             inputPortComponent,
                             outputPortComponent,
                             groupComponent,
                             remoteGroupComponent,
                             funnelComponent,
                             templateComponent,
                             labelComponent) {
            this.processorComponent = processorComponent;
            this.inputPortComponent = inputPortComponent;
            this.outputPortComponent = outputPortComponent;
            this.groupComponent = groupComponent;
            this.remoteGroupComponent = remoteGroupComponent;
            this.funnelComponent = funnelComponent;
            this.templateComponent = templateComponent;
            this.labelComponent = labelComponent;


            /**
             * Config for the toolbox
             */
            this.config = {
                type: {
                    processor: nf._.msg('nf-canvas-toolbox.Processor'),
                    inputPort: nf._.msg('nf-canvas-toolbox.InputPort'),
                    outputPort: nf._.msg('nf-canvas-toolbox.OutputPort'),
                    processGroup: nf._.msg('nf-canvas-toolbox.ProcessGroup'),
                    remoteProcessGroup: nf._.msg('nf-canvas-toolbox.RemoteProcessGroup'),
                    connection: nf._.msg('nf-canvas-toolbox.Connection'),
                    funnel: nf._.msg('nf-canvas-toolbox.Funnel'),
                    template: nf._.msg('nf-canvas-toolbox.Template'),
                    label: nf._.msg('nf-canvas-toolbox.Label')
                },
                urls: {
                    api: apiHost + "/nifi-api",
                    controller: apiHost + "/nifi-api/controller",
                    processorTypes: apiHost + "/nifi-api/flow/processor-types",
                    marks: apiHost + "/nifi-api/component-marks/classification"
                }
            };
        }

        ToolboxCtrl.prototype = {
            constructor: ToolboxCtrl,

            /**
             * Initialize the toolbox controller.
             */
            init: function () {
                // initialize modal dialogs
                processorComponent.modal.init();
                inputPortComponent.modal.init();
                outputPortComponent.modal.init();
                groupComponent.modal.init();
                remoteGroupComponent.modal.init();
                templateComponent.modal.init();
            },

            draggableRightComponentConfig: function (component,icon) {
                var scrolltop = 0
                return {
                    zIndex: 1011,
                    revert: true,
                    revertDuration: 0,
                    cancel: false,
                    containment: 'body',
                    cursor: '-webkit-grabbing',
                    start: function (e, ui) {
                        var ele = e.target;
                        ele.style.borderLeft = "2px solid #1976d2";
                        scrolltop = $('#component-list').scrollTop();
                        $('#component-list').css('overflow-y','visible');
                        $('#component-list').css('top',(100-scrolltop)+'px');
                        $('#selected-processor-name').text(component.name);
                        $('#selected-processor-type').text(component.type).data('bundle', component.bundle);
                    },
                    stop: function (e, ui) {
                        var ele = e.target;
                        ele.style.borderLeft = "2px solid #F7F9FB";
                        $('#component-list').css('overflow-y','auto');
                        $('#component-list').scrollTop(scrolltop);
                        $('#component-list').css('top','100px');
                        var name = $('#selected-processor-name').text();
                        var processorType = $('#selected-processor-type').text();
                        var bundle = $('#selected-processor-type').data('bundle');

                        var translate = nfCanvasUtils.getCanvasTranslate();
                        var scale = nfCanvasUtils.getCanvasScale();

                        var mouseX = e.originalEvent.pageX;
                        var mouseY = e.originalEvent.pageY - nfCanvasUtils.getCanvasOffset();

                        if (mouseX >= 0 && mouseY >= 0) {
                            // adjust the x and y coordinates accordingly
                            var x = (mouseX / scale) - (translate[0] / scale);
                            var y = (mouseY / scale) - (translate[1] / scale);

                            var pt = {
                                x: x,
                                y: y
                            }

                            processorComponent.createProcessor(name, processorType, bundle, pt);
                        }

                    },
                    helper: function (event) {
                        var marginTop = $('#component-list').scrollTop()+15;
                        var marginLeft = event.originalEvent.pageX-document.getElementById('component-panel').offsetLeft-22;
                        return $('<div style="width:44px;height:44px;border-radius:50%;margin-left:'+marginLeft+'px;margin-top:'+marginTop+'px"><img src="images/'+icon+'" style="width:100%;height:100%;border-radius:50%"></div>');
                    }
                }
            },

            /**
             * Gets the draggable configuration for a toolbox component.
             *
             * @param {object} component        The component responsible for handling the stop event.
             * @returns {object}                The draggable configuration.
             *
             * NOTE: The `component` must implement a dropHandler.
             */
            draggableComponentConfig: function (component) {

                //add hover effect
                component.getElement().hover(function () {
                    component.getElement().removeClass(component.icon).addClass(component.hoverIcon);
                }, function () {
                    component.getElement().removeClass(component.hoverIcon).addClass(component.icon);
                })

                return {
                    zIndex: 1011,
                    revert: true,
                    revertDuration: 0,
                    cancel: false,
                    containment: 'body',
                    cursor: '-webkit-grabbing',
                    start: function (e, ui) {
                        // hide the context menu if necessary
                        nfContextMenu.hide();
                    },
                    stop: function (e, ui) {
                        var translate = nfCanvasUtils.getCanvasTranslate();
                        var scale = nfCanvasUtils.getCanvasScale();

                        var mouseX = e.originalEvent.pageX;
                        var mouseY = e.originalEvent.pageY - nfCanvasUtils.getCanvasOffset();

                        // invoke the drop handler if we're over the canvas
                        if (mouseX >= 0 && mouseY >= 0) {
                            // adjust the x and y coordinates accordingly
                            var x = (mouseX / scale) - (translate[0] / scale);
                            var y = (mouseY / scale) - (translate[1] / scale);

                            //each component must implement a dropHandler function
                            component.dropHandler.apply(component, [{
                                x: x,
                                y: y
                            }]);
                        }
                    },
                    helper: component.dragIcon
                }
            }
        }

        var toolboxCtrl =
            new ToolboxCtrl(processorComponent,
                inputPortComponent,
                outputPortComponent,
                groupComponent,
                remoteGroupComponent,
                funnelComponent,
                templateComponent,
                labelComponent);
        return toolboxCtrl;
    };
}));