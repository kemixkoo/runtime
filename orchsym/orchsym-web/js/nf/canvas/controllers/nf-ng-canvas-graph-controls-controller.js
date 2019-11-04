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
        define(['jquery',
                'nf.Actions',
                'nf.Birdseye',
                'nf.Storage',
                'nf.CanvasUtils',
                'nf.ProcessGroupConfiguration'],
            function ($, nfActions, nfBirdseye, nfStorage, nfCanvasUtils, nfProcessGroupConfiguration) {
                return (nf.ng.Canvas.GraphControlsCtrl = factory($, nfActions, nfBirdseye, nfStorage, nfCanvasUtils, nfProcessGroupConfiguration));
            });
    } else if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = (nf.ng.Canvas.GraphControlsCtrl =
            factory(require('jquery'),
                require('nf.Actions'),
                require('nf.Birdseye'),
                require('nf.Storage'),
                require('nf.CanvasUtils'),
                require('nf.ProcessGroupConfiguration')));
    } else {
        nf.ng.Canvas.GraphControlsCtrl = factory(root.$,
            root.nf.Actions,
            root.nf.Birdseye,
            root.nf.Storage,
            root.nf.CanvasUtils,
            root.nf.ProcessGroupConfiguration);
    }
}(this, function ($, nfActions, nfBirdseye, nfStorage, nfCanvasUtils, nfProcessGroupConfiguration) {
    'use strict';

    return function (serviceProvider, navigateCtrl, operateCtrl) {
        'use strict';

        /**
         * Opens the specified graph control.
         *
         * @param {jQuery} graphControl
         */
        var openGraphControl = function (graphControl) {
            // undock if necessary
            if ($('div.graph-control-content').is(':visible') === false) {
                $('#graph-controls div.graph-control-docked').hide();
                $('#graph-controls div.graph-control-header-container').show();
                $('.graph-control').removeClass('docked');
            }

            // show the content of the specified graph control
            graphControl.find('div.graph-control-content').show();
            graphControl.find('div.graph-control-expansion').removeClass('fa-plus-square-o').addClass('fa-minus-square-o');

            // handle specific actions as necessary
            if (graphControl.attr('id') === 'navigation-control') {
                nfBirdseye.updateBirdseyeVisibility(true);
            }

            // get the current visibility
            var graphControlVisibility = nfStorage.getItem('graph-control-visibility');
            if (graphControlVisibility === null) {
                graphControlVisibility = {};
            }

            // update the visibility for this graph control
            var graphControlId = graphControl.attr('id');
            graphControlVisibility[graphControlId] = true;
            nfStorage.setItem('graph-control-visibility', graphControlVisibility);
        };

        /**
         * Hides the specified graph control.
         *
         * @param {jQuery} graphControl
         */
        var hideGraphControl = function (graphControl) {
            // hide the content of the specified graph control
            graphControl.find('div.graph-control-content').hide();
            graphControl.find('div.graph-control-expansion').removeClass('fa-minus-square-o').addClass('fa-plus-square-o');

            // dock if necessary
            if ($('div.graph-control-content').is(':visible') === false) {
                $('#graph-controls div.graph-control-header-container').hide();
                $('#graph-controls div.graph-control-docked').show();
                $('.graph-control').addClass('docked');
            }

            // handle specific actions as necessary
            if (graphControl.attr('id') === 'navigation-control') {
                nfBirdseye.updateBirdseyeVisibility(false);
            }

            // get the current visibility
            var graphControlVisibility = nfStorage.getItem('graph-control-visibility');
            if (graphControlVisibility === null) {
                graphControlVisibility = {};
            }

            // update the visibility for this graph control
            var graphControlId = graphControl.attr('id');
            graphControlVisibility[graphControlId] = false;
            nfStorage.setItem('graph-control-visibility', graphControlVisibility);
        };

        function GraphControlsCtrl(navigateCtrl, operateCtrl) {
            this.navigateCtrl = navigateCtrl;
            this.operateCtrl = operateCtrl;
        }

        GraphControlsCtrl.prototype = {
            constructor: GraphControlsCtrl,

            /**
             *  Register the header controller.
             */
            register: function () {
                if (serviceProvider.graphControlsCtrl === undefined) {
                    serviceProvider.register('graphControlsCtrl', graphControlsCtrl);
                }
            },

            /**
             * Initialize the graph controls.
             */
            init: function () {

                var tooltipHtml1 = '<div class="component-info" id="component-info1">'+
                                      '<div class="shang-caret"></div>'+
                                      '<span class="component-info-title" id="component-info-title1"></span>'+
                                      '<span class="component-info-content" id="component-info-content1"></span>'+
                                    '</div>';
                $('body').append(tooltipHtml1);

                var tooltipHtml2 = '<div class="component-info" id="component-info2">'+
                                      '<div class="xia-caret"></div>'+
                                      '<span class="component-info-title" id="component-info-title2"></span>'+
                                      '<span class="component-info-content" id="component-info-content2"></span>'+
                                    '</div>';
                $('body').append(tooltipHtml2);


                this.filterText = ""
                this.operateCtrl.init();
                // initial the graph control visibility
                var graphControlVisibility = nfStorage.getItem('graph-control-visibility');
                if (graphControlVisibility !== null) {
                    $.each(graphControlVisibility, function (id, isVisible) {
                        var graphControl = $('#' + id);
                        if (graphControl) {
                            if (isVisible) {
                                openGraphControl(graphControl);
                            } else {
                                // hideGraphControl(graphControl);
                            }
                        }
                    });
                } else {
                    openGraphControl($('#navigation-control'));
                    openGraphControl($('#operation-control'));
                }
            },

            /**
             * Undock the graph control.
             * @param {jQuery} $event
             */
            undock: function ($event) {
                openGraphControl($($event.target).parent());
            },

            /**
             * Expand the graph control.
             * @param {jQuery} $event
             */
            expand: function ($event) {
                var icon = $($event.target);
                console.log("icon", icon)
                $("#graph-controls").toggle();
                // if (icon.find('.fa-plus-square-o').length > 0 || icon.hasClass('fa-plus-square-o') || icon.parent().children().find('.fa-plus-square-o').length > 0) {
                //     openGraphControl(icon.closest('div.graph-control'));
                // } else {
                //     hideGraphControl(icon.closest('div.graph-control'));
                // }
            },

            toggleClassification: function (classification) {
                this.bigClassificationName = classification.name
                this.backupComponentList = JSON.parse(JSON.stringify(classification.classification))
                var el = document.getElementById('component-list')
                el.scrollTop = 0
                this.filter()
            },

            inputFocus: function() {
                // since the context menu event propagated back to the canvas, clear the selection
                nfCanvasUtils.getSelection().classed('selected', false);
                // update URL deep linking params
                nfCanvasUtils.setURLParameters();
            },

            filter: function ($event) {

                this.componentList = JSON.parse(JSON.stringify(this.backupComponentList))

                var filterText = this.filterText

                var arr = []

                this.componentList.map(function(item){
                    item.components = item.components.filter(function(doc){
                        return doc.name.toLowerCase().indexOf(filterText.toLowerCase()) != -1
                    })
                    if(item.components.length > 0){
                        arr.push(item)
                    }
                })

                this.componentList = arr

            },

            showTooltip: function ($event, name, content) {
                    var $v = $($event.target)

                    var e = $event.target

                    if($v.hasClass('component-item')){

                    }else if(e.tagName == 'IMG') {
                        e = e.parentNode.parentNode
                    } else {
                        e = e.parentNode
                    }

                    var e1 = document.getElementById('component-info1')
                    var e2 = document.getElementById('component-info2')

                    $('#component-info-title1').text(name)
                    $('#component-info-content1').text(content)

                    var offsetTop = e.offsetTop
                    var clientHeight = document.body.clientHeight
                    var eHeight = e1.offsetHeight
                    var scrolltop = $('#component-list').scrollTop();

                    var fixedTop = offsetTop-scrolltop + 245

                    if(clientHeight - fixedTop - eHeight >= 35 ){
                        e1.style.right = '68px'
                        // e1.style.bottom = (clientHeight - (offsetTop-scrolltop) - eHeight - 273) + 'px'
                        e1.style.top = fixedTop + 'px'
                    } else {
                        e2.style.right = '68px'
                        $('#component-info-title2').text(name)
                        $('#component-info-content2').text(content)
                        e2.style.top = (fixedTop-eHeight-60) + 'px'
                    }

            },

            hiddenTootip: function() {
                document.getElementById('component-info1').style.right = '-200px'
                document.getElementById('component-info2').style.right = '-200px'

            },

            changeDomStatus: function (item) {
                item.open = !item.open
            },

            openComponent: function () {
                // this.isComponentOpen = true;
                $("#component-panel").toggleClass("component-panel-toggleClass");
                if($("#component-panel").attr("class").indexOf("component-panel-toggleClass")!==-1){
                    $("#component-panel-tools > .acon").removeClass("blue");
                } else {
                    $("#component-panel-tools > .acon").addClass("blue");
                }
            },

            closeComponent: function () {
                this.isComponentOpen = false
            },

            toggleDom: function () {
                this.isComponentOpen = !this.isComponentOpen
            },
            /**
             * component group open or close
             */
            toggleGroup: function (item) {
                item.open = !item.open
            },

            /**
             * Gets the icon to show for the selection context.
             */
            getContextIcon: function () {
                var selection = nfCanvasUtils.getSelection();

                if (selection.empty()) {
                    if (nfCanvasUtils.getParentGroupId() === null) {
                        return 'icon-orchsym-logo';
                    } else {
                        return 'icon-group';
                    }
                } else {
                    if (selection.size() === 1) {
                        if (nfCanvasUtils.isProcessor(selection)) {
                            return 'icon-processor';
                        } else if (nfCanvasUtils.isProcessGroup(selection)) {
                            return 'icon-group';
                        } else if (nfCanvasUtils.isInputPort(selection)) {
                            return 'icon-port-in';
                        } else if (nfCanvasUtils.isOutputPort(selection)) {
                            return 'icon-port-out';
                        } else if (nfCanvasUtils.isRemoteProcessGroup(selection)) {
                            return 'icon-group-remote';
                        } else if (nfCanvasUtils.isFunnel(selection)) {
                            return 'icon-funnel';
                        } else if (nfCanvasUtils.isLabel(selection)) {
                            return 'icon-label';
                        } else if (nfCanvasUtils.isConnection(selection)) {
                            return 'icon-connect';
                        }
                    } else {
                        return 'icon-orchsym-logo';
                    }
                }
            },

            /**
             * Will hide target when appropriate.
             */
            hide: function () {
                var selection = nfCanvasUtils.getSelection();
                if (selection.size() > 1) {
                    return 'invisible'
                } else {
                    return '';
                }
            },

            /**
             * Gets the name to show for the selection context.
             */
            getContextName: function () {
                var selection = nfCanvasUtils.getSelection();
                var canRead = nfCanvasUtils.canReadCurrentGroup();

                if (selection.empty()) {
                    if (canRead) {
                        return nfCanvasUtils.getGroupName();
                    } else {
                        return nfCanvasUtils.getGroupId();
                    }
                } else {
                    if (selection.size() === 1) {
                        var d = selection.datum();
                        if (d.permissions.canRead) {
                            if (nfCanvasUtils.isLabel(selection)) {
                                if ($.trim(d.component.label) !== '') {
                                    return d.component.label;
                                } else {
                                    return '';
                                }
                            } else if (nfCanvasUtils.isConnection(selection)) {
                                return nfCanvasUtils.formatConnectionName(d.component);
                            } else {
                                return d.component.name;
                            }
                        } else {
                            return d.id;
                        }
                    } else {
                        return 'Multiple components selected';
                    }
                }
            },

            /**
             * Gets the type to show for the selection context.
             */
            getContextType: function () {
                var selection = nfCanvasUtils.getSelection();

                if (selection.empty()) {
                    return nf._.msg('nf-canvas-graph-controls-controller.ProcessGroup');
                } else {
                    if (selection.size() === 1) {
                        if (nfCanvasUtils.isProcessor(selection)) {
                            return nf._.msg('nf-canvas-graph-controls-controller.Processor');
                        } else if (nfCanvasUtils.isProcessGroup(selection)) {
                            return nf._.msg('nf-canvas-graph-controls-controller.ProcessGroup');
                        } else if (nfCanvasUtils.isInputPort(selection)) {
                            return nf._.msg('nf-canvas-graph-controls-controller.InputPort');
                        } else if (nfCanvasUtils.isOutputPort(selection)) {
                            return nf._.msg('nf-canvas-graph-controls-controller.OutputPort');
                        } else if (nfCanvasUtils.isRemoteProcessGroup(selection)) {
                            return nf._.msg('nf-canvas-graph-controls-controller.RemoteProcessGroup');
                        } else if (nfCanvasUtils.isFunnel(selection)) {
                            return nf._.msg('nf-canvas-graph-controls-controller.Funnel');
                        } else if (nfCanvasUtils.isLabel(selection)) {
                            return nf._.msg('nf-canvas-graph-controls-controller.Label');
                        } else if (nfCanvasUtils.isConnection(selection)) {
                            return nf._.msg('nf-canvas-graph-controls-controller.Connection');
                        }
                    } else {
                        return nf._.msg('nf-canvas-graph-controls-controller.MultipleSelected');
                    }
                }
            },

            /**
             * Gets the id to show for the selection context.
             */
            getContextId: function () {
                var selection = nfCanvasUtils.getSelection();

                if (selection.empty()) {
                    return nfCanvasUtils.getGroupId();
                } else {
                    if (selection.size() === 1) {
                        var d = selection.datum();
                        return d.id;
                    } else {
                        return nf._.msg('nf-canvas-graph-controls-controller.MultipleSelected');
                    }
                }
            },

            /**
             * Determines whether the user can configure or open the details dialog.
             */
            canConfigureOrOpenDetails: function () {
                var selection = nfCanvasUtils.getSelection();

                if (selection.empty()) {
                    return true;
                }

                return nfCanvasUtils.isConfigurable(selection) || nfCanvasUtils.hasDetails(selection);
            },

            /**
             * Opens either the configuration or details view based on the current state.
             */
            openConfigureOrDetailsView: function () {
                var selection = nfCanvasUtils.getSelection();

                if (nfCanvasUtils.isConfigurable(selection)) {
                    nfActions.showConfiguration(selection);
                } else if (nfCanvasUtils.hasDetails(selection)) {
                    nfActions.showDetails(selection);
                }
            }
        }

        var graphControlsCtrl = new GraphControlsCtrl(navigateCtrl, operateCtrl);
        graphControlsCtrl.register();
        return graphControlsCtrl;
    };
}));
