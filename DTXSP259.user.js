// ==UserScript==
// @name          TA Script Bug-Fixes Pack - (DTeCH)
// @namespace     TAScriptBugFixesPack
// @icon          http://eistee82.github.io/ta_simv2/icon.png
// @description   MaelstromTools Dev, Basescanner, X-Ray, Coords, Combat Sim, ZWaves, Who's Online, Tunnel Info, Chat Colorizer, ReplayShare, TA Fixes, Resource Trade Window, & TA Base Upgrade Tool
// @include       http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include       http*://*.cncopt.com/*
// @include       http*://cncopt.com/*
// @grant         GM_log
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_openInTab
// @grant         GM_registerMenuCommand
// @grant         GM_xmlhttpRequest
// @grant         GM_updatingEnabled
// @grant         unsafeWindow
// @grant         metadata
// @version       2.5.9
// @author        DTeCH
// @updateURL     https://cdn.rawgit.com/DTeCH-X/stuff/master/DTXSP259.meta.js
// @downloadURL   https://cdn.rawgit.com/DTeCH-X/stuff/master/DTXSP259.user.js
// ==/UserScript==

try {
    unsafeWindow.__cncopt_version = "2.0.1.";
    (function () {
// Tiberium Alliances Tweaks
    var mainTAT = function() {
        'use strict';

        function createTATweaks() {
            console.log('TA Tweaks loaded');
                console.log('TA Tweaks loaded');
                if (localStorage.getItem('TATweaks3') === undefined || localStorage.getItem('TATweaks3') === 'undefined' || localStorage.getItem('TATweaks3') == 'null' || localStorage.getItem('TATweaks3') === null || localStorage.getItem('TATweaks3') === {} || localStorage.getItem('TATweaks3') === "") {
                var jsonConfDefault = '{"AlternativeErrorHandler":{"enabled":false,"openWindowOnError":false},"ShrinkableWindows":{"enabled":true},"MovableMessageComposingWindow":{"enabled":true},"ExtendedChatHistory":{"enabled":false,"length":64},"AmbientSoundVolumeFix":{"enabled":true},"NotificationTickerFix":{"enabled":true},"ReportsLoadFix":{"enabled":true},"MaelstromToolsButtons":{"enabled":true,"fixRepairAll":true,"fixCollectPackages":true},"NotifyAboutNewFeatures":{"enabled":false},"PlayerBasePlateColoring":{"enabled":true}}';
                    localStorage.setItem('TATweaks3', jsonConfDefault);
                    console.log('TA Tweaks: (setOptionsSettingsTAT): ', 'Default config written: ' + jsonConfDefault);
                }
                else {
                    console.log('TA Tweaks: (setOptionsSettingsTAT): ', 'Default Ok, new config not written');
                }
            qx.Class.define('TATweaks3', {
                type: 'singleton',
                extend: qx.core.Object,
                statics: {
                    Category: {
                        Useful: 1,
                        Bugfix: 2,
                        Script: 3,
                        Uncategorized: 4,
                        Self: 5
                    },
                    CategoryNames: {}
                },
                defer: function(statics) {
                    statics.CategoryNames[TATweaks3.Category.Useful] = 'Useful stuff';
                    statics.CategoryNames[TATweaks3.Category.Bugfix] = 'Game bugfixes';
                    statics.CategoryNames[TATweaks3.Category.Script] = '3rd party script tuning';
                    statics.CategoryNames[TATweaks3.Category.Uncategorized] = 'Uncategorized';
                    statics.CategoryNames[TATweaks3.Category.Self] = 'Settings';
                },
                construct: function() {
                    this.features = {};
                    this.configs = this.loadSettings();
                    this.settingsWindow = new TATweaks3.SettingsWindow(this, TATweaks3.CategoryNames);
                    this.settingsWindow.addListener('change', this.onSettingsChange, this);
                },
                events: {
                    initialize: 'qx.event.type.Event',
                    addFeature: 'qx.event.type.Data',
                    saveSettings: 'qx.event.type.Event'
                },
                members: {
                    settingsWindow: null,
                    features: null,
                    configs: null,
                    initialized: false,

                    initialize: function() {
                        this.initializeEntryPoint();
                        this.initialized = true;
                        this.fireEvent('initialize');

                        if (!this.hasSavedSettings()) {
                            webfrontend.gui.MessageBox.messageBox({
                                modal: false,
                                textRich: true,
                                title: 'Would you like to configure TA Tweaks?',
                                text: 'Looks like this is your first time running TA Tweaks in this server. Open settings now?<br/><br/>' + 'You can always access it later in the navigation bar under <i>Scripts</i>.',
                                okText: 'Yes',
                                cancelText: 'No',
                                executeOk: this.openSettingsWindow,
                                callbackContext: this
                            });

                            // Save empty settings so user won't be asked again
                            this.saveSettings({});
                        }
                    },

                    initializeEntryPoint: function() {
                        var scriptsButton = qx.core.Init.getApplication().getMenuBar().getScriptsButton();
                        scriptsButton.Add('TA Tweaks', 'FactionUI/icons/icon_mode_repair.png');

                        var children = scriptsButton.getMenu().getChildren();
                        var lastChild = children[children.length - 1];
                        lastChild.addListener('execute', this.openSettingsWindow, this);
                        lastChild.getChildControl('icon').set({
                            scale: true,
                            width: 18,
                            height: 18
                        });
                    },

                    /**
                     * @param {qx.event.type.Data} event
                     */
                    onSettingsChange: function(event) {
                        var encounteredError = false;
                        var settings = event.getData();

                        for (var classname in settings) {
                            var isEnabled = settings[classname].enabled;
                            var details = this.features[classname];
                            var wasEnabled = this.hasConfig(details.instance) ? this.getConfig(details.instance).enabled : false;
                            this.configs[details.options.configKey] = settings[classname];

                            try {
                                if (isEnabled) {
                                    details.instance.activate(wasEnabled);
                                }
                                else {
                                    details.instance.deactivate(wasEnabled);
                                }
                            }
                            catch (e) {
                                encounteredError = true;
                                this.settingsWindow.addError(details.container, (isEnabled ? 'Activation' : 'Deactivation') + ' failed');
                                qx.event.GlobalError.handleError(e);
                            }
                        }

                        this.saveSettings(this.configs);

                        try {
                            this.fireEvent('saveSettings');
                        }
                        catch (e) {
                            qx.event.GlobalError.handleError(e);
                        }

                        if (encounteredError) {
                            this.settingsWindow.open();
                        }
                    },

                    /**
                     * @returns {Boolean}
                     */
                    hasSavedSettings: function() {
                        return localStorage.getItem('TATweaks3') !== null;
                    },

                    /**
                     * @returns {Object}
                     */
                    loadSettings: function() {
                        return JSON.parse(localStorage.getItem('TATweaks3')) || {};
                    },

                    /**
                     * @param {Object} settings
                     */
                    saveSettings: function(settings) {
                        localStorage.setItem('TATweaks3', JSON.stringify(settings));
                    },

                    /**
                     * @param {TATweaks3.Feature.IFeature} featureConstructor
                     * @param {Object} options
                     */
                    registerFeature: function(featureConstructor, options) {
                        qx.Interface.assert(featureConstructor, TATweaks3.Feature.IFeature, true);

                        if (featureConstructor.classname in this.features) {
                            throw new Error('Feature "' + featureConstructor.classname + '" is already registered');
                        }

                        var instance = null;
                        var normalizedOptions = {
                            name: options.name || featureConstructor.classname,
                            description: options.description || null,
                            category: options.category || TATweaks3.Category.Uncategorized,
                            configKey: options.configKey || featureConstructor.classname,
                            disabled: options.disabled || false
                        };

                        var featureKey = featureConstructor.classname;
                        this.features[featureKey] = {
                            construct: featureConstructor,
                            container: null,
                            instance: null,
                            options: normalizedOptions
                        };

                        if (!normalizedOptions.disabled) {
                            try {
                                instance = new featureConstructor();
                                this.features[featureKey].instance = instance;
                            }
                            catch (e) {
                                qx.event.GlobalError.handleError(e);
                            }
                        }

                        var config = this.getConfig(featureConstructor);
                        var container = this.settingsWindow.addFeature(instance, normalizedOptions, config);
                        this.features[featureKey].container = container;

                        if (normalizedOptions.disabled) {
                            this.settingsWindow.addMessage(container, 'Disabled', normalizedOptions.disabled);
                        }
                        else if (instance === null) {
                            this.settingsWindow.addError(container, 'Failed to instantiate');
                        }
                        else if (config.enabled) {
                            try {
                                instance.activate(false);
                            }
                            catch (e) {
                                this.settingsWindow.addError(container, 'Activation failed');
                                qx.event.GlobalError.handleError(e);
                            }
                        }

                        try {
                            this.fireDataEvent('addFeature', this.shallowClone(this.features[featureKey]));
                        }
                        catch (e) {
                            qx.event.GlobalError.handleError(e);
                        }
                    },

                    /**
                     * @returns {Object}
                     */
                    getAllFeatures: function() {
                        return this.shallowClone(this.features);
                    },

                    /**
                     * @param {TATweaks3.Feature.IFeature} feature
                     * @returns {Boolean}
                     */
                    hasConfig: function(feature) {
                        return feature.classname in this.features && this.features[feature.classname].options.configKey in this.configs;
                    },

                    /**
                     * @param {TATweaks3.Feature.IFeature} feature
                     * @returns {Object}
                     */
                    getConfig: function(feature) {
                        if (!(feature.classname in this.features)) {
                            throw new Error('Feature "' + feature.classname + '" is not registered');
                        }

                        var options = this.features[feature.classname].options;

                        return options.configKey in this.configs ? this.shallowClone(this.configs[options.configKey])
                            : {};
                    },

                    openSettingsWindow: function() {
                        this.settingsWindow.open();
                    },

                    /**
                     * @param {Object} object
                     * @returns {Object}
                     */
                    shallowClone: function(object) {
                        var clone = new object.constructor();

                        for (var key in object) {
                            if (object.hasOwnProperty(key)) {
                                clone[key] = object[key];
                            }
                        }

                        return clone;
                    }
                }
            });

            qx.Class.define('TATweaks3.SettingsWindow', {
                extend: qx.ui.window.Window,
                statics: {
                    IndentStep: 20
                },
                construct: function(core, categories) {
                    qx.ui.window.Window.call(this);
                    this.core = core;

                    this.set({
                        caption: 'TA Tweaks',
                        icon: 'FactionUI/icons/icon_mode_repair.png',
                        layout: new qx.ui.layout.VBox(18),
                        contentPaddingTop: 0,
                        contentPaddingBottom: 5,
                        contentPaddingRight: 6,
                        contentPaddingLeft: 6,
                        showMaximize: false,
                        showMinimize: false,
                        allowMaximize: false,
                        allowMinimize: false,
                        textColor: 'text-region-tooltip',
                        resizable: [true, false],
                        width: 500
                    });
                    this.getChildControl('icon').set({
                        scale: true,
                        width: 20,
                        height: 20,
                        alignY: 'middle'
                    });

                    var mainContainer = qx.core.Init.getApplication().getMainContainer();
                    mainContainer.addListener('resize', function(event) {
                        this.setMaxHeight(event.getData().height);
                    }, this);
                    this.setMaxHeight(mainContainer.getBounds().height);

                    var mainOverlayBounds = qx.core.Init.getApplication().getMainOverlay().getBounds();
                    this.moveTo(
                        mainOverlayBounds.left + mainOverlayBounds.width - this.getWidth() - 120,
                        mainOverlayBounds.top + 100
                    );

                    var scrollContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());
                    var scroller = new qx.ui.container.Scroll(scrollContainer);
                    scrollContainer.addListener('resize', function(event) {
                        this.setHeight(event.getData().height);
                    }, scroller);
                    this.add(scroller, { flex: 1 });

                    this.categoryContainers = {};
                    this.features = [];

                    for (var categoryId in categories) {
                        var container = this.categoryContainers[categoryId] = new qx.ui.container.Composite(new qx.ui.layout.VBox(5)).set({
                            marginLeft: 2,
                            visibility: 'excluded'
                        });
                        container.add(new qx.ui.basic.Label(categories[categoryId]).set({
                            font: 'font_size_13',
                            textColor: 'text-region-value'
                        }));
                        scrollContainer.add(container);
                    }

                    var cancelButton = new qx.ui.form.Button('Cancel').set({
                        paddingLeft: 10,
                        paddingRight: 10
                    });
                    cancelButton.addListener('execute', this.onCancelClick, this);
                    var saveButton = new qx.ui.form.Button('Save').set({
                        paddingLeft: 10,
                        paddingRight: 10
                    });
                    saveButton.addListener('execute', this.onSaveClick, this);
                    var controlsContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(4));
                    controlsContainer.add(cancelButton, { flex: 1 });
                    controlsContainer.add(saveButton, { flex: 1 });
                    this.add(controlsContainer);
                },
                events: {
                    change: 'qx.event.type.Data'
                },
                members: {
                    core: null,
                    configs: null,
                    categoryContainers: null,
                    features: null,

                    onCancelClick: function() {
                        var encounteredError = false;

                        for (var i = 0; i < this.features.length; i++) {
                            var details = this.features[i];
                            var config = this.core.getConfig(details.instance);
                            details.checkbox.setValue(config.enabled || false);

                            try {
                                details.instance.onReset(config);
                            }
                            catch (e) {
                                encounteredError = true;
                                this.addError(details.container, 'Failed to reset settings');
                                qx.event.GlobalError.handleError(e);
                            }
                        }

                        if (!encounteredError) {
                            this.close();
                        }
                    },

                    onSaveClick: function() {
                        var encounteredError = false;
                        var configs = {};

                        for (var i = 0; i < this.features.length; i++) {
                            var details = this.features[i];
                            var isEnabled = details.checkbox.getValue();
                            var config = { enabled: isEnabled };

                            try {
                                details.instance.onSaveConfig(config);
                            }
                            catch (e) {
                                encounteredError = true;
                                this.addError(details.container, 'Failed to save settings');
                                qx.event.GlobalError.handleError(e);
                            }

                            configs[details.instance.classname] = config;
                        }

                        if (!encounteredError) {
                            this.close();
                        }

                        this.fireDataEvent('change', configs);
                    },

                    /**
                     * @param {TATweaks3.Feature.IFeature} feature
                     * @param {Object} options
                     * @param {Object} config
                     * @returns {qx.ui.container.Composite}
                     */
                    addFeature: function(feature, options, config) {
                        var checkbox = new qx.ui.form.CheckBox(options.name).set({
                            value: config.enabled || false
                        });
                        var label = options.description ? new qx.ui.basic.Label(options.description).set({ rich: true }) : null;
                        var renderFailed = false;
                        var container = null;

                        if (feature !== null) {
                            try {
                                var temp = feature.onRender(checkbox, label, config);

                                if (temp) {
                                    qx.core.Assert.assertInstance(temp, qx.ui.container.Composite);
                                    container = temp;
                                }
                            }
                            catch (e) {
                                checkbox.setEnabled(false);
                                renderFailed = true;
                                qx.event.GlobalError.handleError(e);
                            }
                        }
                        else {
                            checkbox.set({
                                enabled: false,
                                value: false
                            });
                        }

                        if (!container) {
                            container = new qx.ui.container.Composite(new qx.ui.layout.VBox());
                            container.add(checkbox);

                            if (label !== null) {
                                container.add(label);
                            }
                        }

                        container.setMarginLeft(10);
                        var categoryContainer = this.categoryContainers[options.category];
                        categoryContainer.add(container);

                        if (!categoryContainer.isVisible()) {
                            categoryContainer.show();
                        }

                        if (renderFailed) {
                            this.addError(container, 'Failed to render settings');
                        }
                        else if (feature !== null) {
                            this.features.push({
                                checkbox: checkbox,
                                container: container,
                                instance: feature
                            });
                        }

                        return container;
                    },

                    /**
                     * @param {qx.ui.container.Composite} container
                     * @param {String} message
                     */
                    addError: function(container, message) {
                        this.addMessage(container, 'Error', message);
                    },

                    /**
                     * @param {qx.ui.container.Composite} container
                     * @param {String} title
                     * @param {String} message
                     */
                    addMessage: function(container, title, message) {
                        container.add(new qx.ui.basic.Label().set({
                            rich: true,
                            value: '<span style="color: #f00;">' + title + ': ' + message + '</span>'
                        }));
                    }
                }
            });

            qx.Class.define('TATweaks3.NotificationButton', {
                extend: qx.ui.form.Button,
                construct: function(label, icon, command) {
                    qx.ui.form.Button.call(this, label, icon, command);

                    this.set({
                        margin: 1,
                        padding: [0, 0, 2]
                    });
                    this._setLayout(new qx.ui.layout.Canvas());
                    this.getContentElement().setStyle('overflow', 'visible');
                },
                members: {
                    /** @inheritDoc */
                    _createChildControlImpl: function(id) {
                        var child;

                        switch (id) {
                            case 'label':
                                child = qx.ui.form.Button.prototype._createChildControlImpl.apply(this, arguments).set({
                                    backgroundColor: 'white',
                                    font: 'font_size_13_bold',
                                    padding: [1, 6],
                                    textColor: 'black'
                                });
                                child.setLayoutProperties({
                                    right: -2,
                                    top: -2
                                });

                                var containerElement = PerforceChangelist >= 430398 ? child.getContentElement() : child.getContainerElement();
                                containerElement.setStyle('border-radius', '8px');
                                break;
                            case 'icon':
                                child = qx.ui.form.Button.prototype._createChildControlImpl.apply(this, arguments).set({
                                    margin: [4, 6, 6]
                                });
                                break;
                        }

                        return child || qx.ui.form.Button.prototype._createChildControlImpl.apply(this, arguments);
                    },
                    _applyCenter: function() {},
                    _applyGap: function() {},
                    _applyIconPosition: function() {}
                }
            });

            qx.Interface.define('TATweaks3.Feature.IFeature', {
                members: {
                    /**
                     * Called when the feature is about to be rendered in settings window.
                     * Return an instance of a qx.ui.container.Composite to change the appearance.
                     * 
                     * @param {qx.ui.form.CheckBox} checkbox
                     * @param {qx.ui.basic.Label} label
                     * @param {Object} config
                     * @returns {qx.ui.container.Composite}
                     */
                    onRender: function(checkbox, label, config) {},
                    /**
                     * Called when settings are being reseted.
                     * 
                     * @param {Object} config
                     */
                    onReset: function(config) {},
                    /**
                     * Called when settings are being saved.
                     * 
                     * @param {Object} config
                     */
                    onSaveConfig: function(config) {},
                    /**
                     * Called when the feature is to be (re)activated.
                     * 
                     * @param {Boolean} wasActive
                     */
                    activate: function(wasActive) {},
                    /**
                     * Called when the feature is to be (re)deactivated.
                     * 
                     * @param {Boolean} wasActive
                     */
                    deactivate: function(wasActive) {}
                }
            });

            qx.Class.define('TATweaks3.Feature.AlternativeErrorHandler', {
                extend: qx.core.Object,
                implement: [TATweaks3.Feature.IFeature],
                defer: function(statics, members) {
                    TATweaks3.getInstance().registerFeature(members.constructor, {
                        category: TATweaks3.Category.Useful,
                        name: 'Alternative error handler',
                        description: 'A non-blocking error handler to replace the error reporting dialog.',
                        configKey: 'AlternativeErrorHandler'
                    });
                },
                construct: function() {
                    if (typeof qx.event.GlobalError.getErrorHandler !== 'function') {
                        var source = qx.event.GlobalError.handleError.toString();
                        var matches = source.match(/this\.([A-Za-z_]+)\.call\(this\.([A-Za-z_]+),[A-Za-z]+\);/);
                        var callbackMemberName = matches[1];
                        var contextMemberName = matches[2];

                        qx.event.GlobalError.getErrorHandler = eval('(function(){return {callback:this.' + callbackMemberName + ',context:this.' + contextMemberName + '};})');
                    }
                },
                members: {
                    openWindowOnErrorCheckbox: null,
                    desktopButton: null,
                    window: null,
                    errorCount: 0,
                    originalErrorHandler: null,
                    shouldOpenWindowOnError: null,

                    /** @inheritDoc */
                    onRender: function(checkbox, label, config) {
                        var container = new qx.ui.container.Composite(new qx.ui.layout.VBox());
                        container.add(checkbox);
                        container.add(this.openWindowOnErrorCheckbox = new qx.ui.form.CheckBox().set({
                            label: 'Open error log automatically when an error is encountered',
                            marginLeft: TATweaks3.SettingsWindow.IndentStep,
                            value: config.openWindowOnError || false
                        }));
                        container.add(label);

                        checkbox.bind('value', this.openWindowOnErrorCheckbox, 'enabled');

                        return container;
                    },

                    /** @inheritDoc */
                    onReset: function(config) {
                        this.openWindowOnErrorCheckbox.setValue(config.openWindowOnError || false);
                    },

                    /** @inheritDoc */
                    onSaveConfig: function(config) {
                        config.openWindowOnError = this.openWindowOnErrorCheckbox.getValue();
                    },

                    /** @inheritDoc */
                    activate: function(wasActive) {
                        this.shouldOpenWindowOnError = this.openWindowOnErrorCheckbox.getValue();

                        if (wasActive) {
                            return;
                        }

                        this.originalErrorHandler = qx.event.GlobalError.getErrorHandler();
                        qx.event.GlobalError.setErrorHandler(this.handleError, this);
                    },

                    deactivate: function(wasActive) {
                        if (!wasActive) {
                            return;
                        }

                        if (this.errorCount > 0 && this.originalErrorHandler.context === qx.core.Init.getApplication()) {
                            qx.event.GlobalError.setErrorHandler(null, null);
                        }
                        else {
                            qx.event.GlobalError.setErrorHandler(this.originalErrorHandler.callback, this.originalErrorHandler.context);
                            this.originalErrorHandler = null;
                        }
                    },

                    onClickDesktopButton: function() {
                        this.getWindow().open();
                    },

                    /**
                     * @param {Error} error
                     */
                    handleError: function(error) {
                        console.error(error.stack ? error.stack : error);

                        this.errorCount++;
                        var desktopButton = this.getDesktopButton();
                        desktopButton.setLabel(this.errorCount.toString());
                        desktopButton.show();

                        var window = this.getWindow();
                        window.push(error);

                        if (this.shouldOpenWindowOnError) {
                            window.open();
                        }
                    },

                    /**
                     * @returns {TATweaks3.NotificationButton}
                     */
                    getDesktopButton: function() {
                        if (this.desktopButton === null) {
                            this.desktopButton = new TATweaks3.NotificationButton().set({
                                appearance: 'button-standard-nod',
                                icon: 'webfrontend/ui/icons/icn_show_combat_active.png',
                                toolTipText: 'Click to open error log'
                            });
                            this.desktopButton.getChildControl('icon').set({
                                scale: true,
                                width: 36,
                                height: 32
                            });

                            this.desktopButton.addListener('execute', this.onClickDesktopButton, this);
                            qx.core.Init.getApplication().getDesktop().add(this.desktopButton, {
                                right: 125,
                                top: 40
                            });
                        }

                        return this.desktopButton;
                    },

                    /**
                     * @returns {TATweaks3.Feature.AlternativeErrorHandler.ErrorWindow}
                     */
                    getWindow: function() {
                        if (this.window === null) {
                            this.window = new TATweaks3.Feature.AlternativeErrorHandler.ErrorWindow();
                            var baseNavBarX = qx.core.Init.getApplication().getBaseNavigationBar().getLayoutParent().getBounds().left;
                            this.window.moveTo(baseNavBarX - this.window.getWidth() - 60, 40);
                        }

                        return this.window;
                    }
                }
            });

            qx.Class.define('TATweaks3.Feature.AlternativeErrorHandler.ErrorWindow', {
                extend: qx.ui.window.Window,
                construct: function() {
                    qx.ui.window.Window.call(this);

                    this.set({
                        caption: 'Errors',
                        icon: 'webfrontend/ui/common/icon_moral_alert_red.png',
                        layout: new qx.ui.layout.VBox(4),
                        width: 450,
                        height: 200,
                        contentPaddingTop: 0,
                        contentPaddingBottom: 6,
                        contentPaddingRight: 6,
                        contentPaddingLeft: 6,
                        showMaximize: false,
                        showMinimize: false,
                        allowMaximize: false,
                        allowMinimize: false,
                        resizable: true,
                        visibility: 'excluded',
                        textColor: '#bfbfbf'
                    });
                    this.getChildControl('icon').set({
                        scale: true,
                        width: 18,
                        height: 17,
                        alignY: 'middle',
                        marginLeft: 8
                    });

                    this.add(this.logContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox()));
                    this.add(new qx.ui.core.Spacer(), { flex: 1 });

                    var reportContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());
                    reportContainer.add(this.reportButton = new qx.ui.form.Button('Report first error').set({
                        alignX: 'center',
                        allowGrowX: false,
                        enabled: false,
                        toolTipText: 'Click to open the error reporting dialog'
                    }));
                    this.reportButton.addListener('execute', this.onClickReportButton, this);
                    this.add(reportContainer);
                },
                members: {
                    logContainer: null,
                    reportButton: null,

                    /**
                     * @param {Error} error
                     */
                    push: function(error) {
                        if (!this.reportButton.isEnabled() && !this.logContainer.getChildren().length) {
                            this.reportButton.setUserData('error', error);
                            this.reportButton.setEnabled(true);
                        }

                        this.logContainer.add(new qx.ui.basic.Label(
                            phe.cnc.Util.getDateTimeString(new Date()) + ' ' + error.toString()
                        ));
                    },

                    onClickReportButton: function() {
                        this.reportButton.setEnabled(false);
                        var error = this.reportButton.getUserData('error');

                        var app = qx.core.Init.getApplication();
                        var errorHandler = qx.event.GlobalError.getErrorHandler();
                        app.handleError(error);

                        if (errorHandler.context !== app) {
                            // Restore error handler that webfrontend.Application.prototype.handleError removed
                            qx.event.GlobalError.setErrorHandler(errorHandler.callback, errorHandler.context);
                        }
                    }
                }
            });

            qx.Class.define('TATweaks3.Feature.ShrinkableWindows', {
                extend: qx.core.Object,
                implement: [TATweaks3.Feature.IFeature],
                defer: function(statics, members) {
                    TATweaks3.getInstance().registerFeature(members.constructor, {
                        category: TATweaks3.Category.Useful,
                        name: 'Shrinkable windows',
                        description: 'Click the minimize button to shrink windows. Note that overlays look similar to windows, but they are not shrinkable.',
                        configKey: 'ShrinkableWindows'
                    });
                },
                members: {
                    onRender: function(checkbox, label, config) {},
                    onReset: function(config) {},
                    onSaveConfig: function(config) {},

                    /** @inheritDoc */
                    activate: function(wasActive) {
                        if (wasActive) {
                            return;
                        }

                        var context = this;
                        var root = qx.core.Init.getApplication().getRoot();
                        var windows = root.getWindows();

                        root._addWindow = function(window) {
                            context.enableWindowShrink(window);
                            return qx.ui.root.Application.prototype._addWindow.apply(this, arguments);
                        };
                        root._removeWindow = function(window) {
                            context.disableWindowShrink(window);
                            return qx.ui.root.Application.prototype._removeWindow.apply(this, arguments);
                        };

                        for (var i = 0; i < windows.length; i++) {
                            this.enableWindowShrink(windows[i]);
                        }
                    },

                    /** @inheritDoc */
                    deactivate: function(wasActive) {
                        if (!wasActive) {
                            return;
                        }

                        var root = qx.core.Init.getApplication().getRoot();
                        var windows = root.getWindows();

                        root._addWindow = qx.ui.root.Application.prototype._addWindow;
                        root._removeWindow = qx.ui.root.Application.prototype._removeWindow;

                        for (var i = 0; i < windows.length; i++) {
                            this.disableWindowShrink(windows[i]);
                        }
                    },

                    /**
                     * @param {qx.ui.window.Window} window
                     */
                    enableWindowShrink: function(window) {
                        if (window.getUserData('TATweaks3.Shrinkable')) {
                            return;
                        }

                        window.setUserData('TATweaks3.Shrinkable', true);
                        window.setUserData('TATweaks3.AllowMinimize', window.getAllowMinimize());
                        window.setUserData('TATweaks3.ShowMinimize', window.getShowMinimize());

                        window.setAllowMinimize = function(value) {
                            this.setUserData('TATweaks3.AllowMinimize', value);
                        };
                        window.setShowMinimize = function(value) {
                            this.setUserData('TATweaks3.ShowMinimize', value);
                        };

                        window.constructor.prototype.setAllowMinimize.call(window, true);
                        window.constructor.prototype.setShowMinimize.call(window, true);

                        window.addListener('beforeMinimize', this.onBeforeWindowMinimize, this);
                        window.addListener('disappear', this.onWindowDisappear, this);
                    },

                    /**
                     * @param {qx.ui.window.Window} window
                     */
                    disableWindowShrink: function(window) {
                        if (!window.getUserData('TATweaks3.Shrinkable')) {
                            return;
                        }

                        window.removeListener('beforeMinimize', this.onBeforeWindowMinimize, this);
                        window.removeListener('disappear', this.onWindowDisappear, this);

                        window.setAllowMinimize = window.constructor.prototype.setAllowMinimize;
                        window.setShowMinimize = window.constructor.prototype.setShowMinimize;

                        window.setAllowMinimize(window.getUserData('TATweaks3.AllowMinimize'));
                        window.setShowMinimize(window.getUserData('TATweaks3.ShowMinimize'));
                        window.setUserData('TATweaks3.AllowMinimize', undefined);
                        window.setUserData('TATweaks3.ShowMinimize', undefined);
                        window.setUserData('TATweaks3.Shrinkable', undefined);

                        this.restoreWindowContent(window);
                    },

                    /**
                     * @param {qx.event.type.Event} event
                     */
                    onBeforeWindowMinimize: function(event) {
                        event.preventDefault();

                        var window = event.getTarget();
                        var pane = window.getChildrenContainer();

                        if (window.getUserData('TATweaks3.Dimensions') === null) {
                            window.setUserData('TATweaks3.Dimensions', {
                                height: window.getHeight(),
                                minHeight: window.getMinHeight(),
                                width: window.getWidth()
                            });
                            pane.exclude();
                            window.set({
                                height: null,
                                minHeight: null,
                                width: window.getBounds().width
                            });
                        }
                        else {
                            this.restoreWindowContent(window);
                        }
                    },

                    /**
                     * @param {qx.event.type.Event} event
                     */
                    onWindowDisappear: function(event) {
                        var window = event.getTarget();
                        this.restoreWindowContent(window);
                    },

                    /**
                     * @param {qx.ui.window.Window} window
                     */
                    restoreWindowContent: function(window) {
                        var dimensions = window.getUserData('TATweaks3.Dimensions');

                        if (dimensions !== null) {
                            window.set({
                                height: dimensions.height,
                                minHeight: dimensions.minHeight,
                                width: dimensions.width
                            });
                            window.getChildrenContainer().show();
                            window.setUserData('TATweaks3.Dimensions', undefined);
                        }
                    }
                }
            });

            qx.Class.define('TATweaks3.Feature.MovableMessageComposingWindow', {
                extend: qx.core.Object,
                implement: [TATweaks3.Feature.IFeature],
                defer: function(statics, members) {
                    TATweaks3.getInstance().registerFeature(members.constructor, {
                        category: TATweaks3.Category.Useful,
                        name: 'Movable message composing window',
                        description: 'Replaces the message composing overlay with its window equivalent. Also enables shrinking if that option is activated.',
                        configKey: 'MovableMessageComposingWindow'
                    });
                },
                construct: function() {
                    var source = webfrontend.gui.mail.MailOverlay.prototype.onNewMessage.toString();
                    this.mailOverlayMessageMemberName = source.match(/this\.([A-Za-z_]+)\.open/)[1];
                },
                members: {
                    mailOverlayMessageMemberName: null,

                    onRender: function(checkbox, label, config) {},
                    onReset: function(config) {},
                    onSaveConfig: function(config) {},

                    /** @inheritDoc */
                    activate: function(wasActive) {
                        if (wasActive) {
                            return;
                        }

                        var mailMessageWindow = new webfrontend.gui.mail.MailMessageWindow();

                        mailMessageWindow.open = function(returnWidget, writeType) {
                            webfrontend.gui.mail.MailMessageWindow.prototype.open.call(this, null, writeType);
                        };

                        // Use methods from MailMessageOverlay to fix reply and forward
                        mailMessageWindow.setSubject = webfrontend.gui.mail.MailMessageOverlay.prototype.setSubject;
                        mailMessageWindow.setHistoryEntries = webfrontend.gui.mail.MailMessageOverlay.prototype.setHistoryEntries;

                        webfrontend.gui.mail.MailOverlay.getInstance()[this.mailOverlayMessageMemberName] = mailMessageWindow;
                    },

                    /** @inheritDoc */
                    deactivate: function(wasActive) {
                        if (!wasActive) {
                            return;
                        }

                        webfrontend.gui.mail.MailOverlay.getInstance()[this.mailOverlayMessageMemberName] = new webfrontend.gui.mail.MailMessageOverlay();
                    }
                }
            });

            qx.Class.define('TATweaks3.Feature.ExtendedChatHistory', {
                extend: qx.core.Object,
                implement: [TATweaks3.Feature.IFeature],
                defer: function(statics, members) {
                    TATweaks3.getInstance().registerFeature(members.constructor, {
                        category: TATweaks3.Category.Useful,
                        name: 'Extended chat history',
                        description: 'Increases chat history length.',
                        configKey: 'ExtendedChatHistory'
                    });
                },
                construct: function() {
                    var source = webfrontend.gui.chat.ChatWidget.prototype.setTab.toString();
                    this.tabViewMemberName = source.match(/this\.([A-Za-z_]+)\.setSelection\(/)[1];

                    // MaelstromTools overwrites webfrontend.gui.chat.ChatWidget.recvbufsize, so use hardcoded value instead.
                    this.defaultLength = /*webfrontend.gui.chat.ChatWidget.recvbufsize*/64;
                },
                members: {
                    tabViewMemberName: null,
                    defaultLength: null,
                    lengthSpinner: null,

                    /** @inheritDoc */
                    onRender: function(checkbox, label, config) {
                        var rowContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(25));
                        rowContainer.add(checkbox);
                        rowContainer.add(this.lengthSpinner = new qx.ui.form.Spinner().set({
                            minimum: this.defaultLength,
                            maximum: 512,
                            value: config.length || this.defaultLength
                        }));
                        checkbox.bind('value', this.lengthSpinner, 'enabled');

                        var container = new qx.ui.container.Composite(new qx.ui.layout.VBox());
                        container.add(rowContainer);
                        container.add(label);

                        return container;
                    },

                    /** @inheritDoc */
					onReset: function(config) {
						this.lengthSpinner.setValue(config.length || this.defaultLength);
					},

					/** @inheritDoc */
					onSaveConfig: function(config) {
						config.length = this.lengthSpinner.getValue();
					},

					/** @inheritDoc */
					activate: function(wasActive) {
						var length = this.lengthSpinner.getValue();
						this.setChatHistoryLength(length);
					},

					/** @inheritDoc */
					deactivate: function(wasActive) {
						if (wasActive) {
							this.setChatHistoryLength(this.defaultLength);
						}
					},

					/**
					 * @param {Number} length
					 */
					setChatHistoryLength: function(length) {
						var tabPages = qx.core.Init.getApplication().getChat().getChatWidget()[this.tabViewMemberName].getChildren();

						for (var i = 0; i < tabPages.length; i++) {
							tabPages[i].messages.resize(length);
						}
					}
				}
			});

			qx.Class.define('TATweaks3.Feature.AmbientSoundVolumeFix', {
				extend: qx.core.Object,
				implement: [TATweaks3.Feature.IFeature],
				defer: function(statics, members) {
					TATweaks3.getInstance().registerFeature(members.constructor, {
						category: TATweaks3.Category.Bugfix,
						name: 'Fix ambient audio volume',
						description: 'Fixes ambient audio volume always resetting to 20% on login.',
						configKey: 'AmbientSoundVolumeFix'
					});
				},
				members: {
					previousPlayAreaSoundVolume: null,

					onRender: function(checkbox, label, config) {},
					onReset: function(config) {},
					onSaveConfig: function(config) {},

					/** @inheritDoc */
					activate: function(wasActive) {
						if (wasActive) {
							return;
						}

						var config = phe.cnc.config.Config.getInstance();
						config.addListener('changeAudio', this.onChangeAudio, this);

						var battleground = ClientLib.Vis.VisMain.GetInstance().get_Battleground();
						this.previousPlayAreaSoundVolume = battleground.get_SoundVolume();
						battleground.set_SoundVolume(config.getAudioAmbientLevel() / 100);
					},

					/** @inheritDoc */
					deactivate: function(wasActive) {
						if (!wasActive || this.previousPlayAreaSoundVolume === null) {
							return;
						}

						phe.cnc.config.Config.getInstance().removeListener('changeAudio', this.onChangeAudio, this);
						ClientLib.Vis.VisMain.GetInstance().get_Battleground().set_SoundVolume(this.previousPlayAreaSoundVolume);
						this.previousPlayAreaSoundVolume = null;
					},

					onChangeAudio: function() {
						phe.cnc.config.Config.getInstance().removeListener('changeAudio', this.onChangeAudio, this);
						this.previousPlayAreaSoundVolume = null;
					}
				}
			});

			qx.Class.define('TATweaks3.Feature.NotificationSidebarFix', {
				extend: qx.core.Object,
				implement: [TATweaks3.Feature.IFeature],
				defer: function(statics, members) {
					TATweaks3.getInstance().registerFeature(members.constructor, {
						category: TATweaks3.Category.Bugfix,
						name: 'Fix notification sidebar error',
						description: 'Fixes a common script error caused by a bug in the notification sidebar. ' + '<a href="http://forum.alliances.commandandconquer.com/showthread.php?tid=32553" style="color:' + webfrontend.gui.util.BBCode.clrLink + ';" target="_blank">Read more</a>',
						configKey: 'NotificationSidebarFix',
						disabled: PerforceChangelist >= 425395 ? 'Obsolete. Bug fixed in patch 15.2' : false
					});
				},
				construct: function() {
					var source = webfrontend.gui.bars.NotificationBar.prototype._onNotificationUpdated.toString();
					this.addToSidebarMethodName = source.match(/this\.([A-Za-z_]+)\([A-Za-z]+\);/)[1];

					source = webfrontend.gui.bars.NotificationBar.prototype[this.addToSidebarMethodName].toString();
					var matches = source.match(/this\.([A-Za-z_]+)\.removeAt\(webfrontend\.gui\.bars\.NotificationBar\.MaxNumberOfNotifications\);this\.([A-Za-z_]+)--;\}\s*;var [A-Za-z]+=this.([A-Za-z_]+)\([A-Za-z]+\);/);
					this.sidebarNotificationContainerMemberName = matches[1];
					this.sidebarNotificationCountMemberName = matches[2];
					this.createSidebarItemMethodName = matches[3];

					source = webfrontend.gui.bars.NotificationBar.prototype._onNotificationRemoved.toString();
					matches = source.match(/var ([A-Za-z]+)=([A-Za-z]+)\.get_Id\(\);var ([A-Za-z]+)=\2\.get_IdOnlineOnly\(\);if\(\1>0&&this\.([A-Za-z_]+)\[\1\]!=null\)\{.+?\}\s*else if\(\1==0&&this\.([A-Za-z_]+)\[\3\]!=null\)\{/);
					this.sidebarNotificationMapByIdMemberName = matches[4];
					this.sidebarNotificationMapByIdOnlineOnlyMemberName = matches[5];
				},
				members: {
					addToSidebarMethodName: null,
					sidebarNotificationContainerMemberName: null,
					sidebarNotificationCountMemberName: null,
					createSidebarItemMethodName: null,
					sidebarNotificationMapByIdMemberName: null,
					sidebarNotificationMapByIdOnlineOnlyMemberName: null,
					removedNotifications: null,

					onRender: function(checkbox, label, config) {},
					onReset: function(config) {},
					onSaveConfig: function(config) {},

					/** @inheritDoc */
					activate: function(wasActive) {
						if (wasActive) {
							return;
						}

						var source = webfrontend.gui.bars.NotificationBar.prototype[this.addToSidebarMethodName].toString();
						var rewrittenFunctionBody = source.replace(
							/while\(this\.[A-Za-z_]+>webfrontend\.gui\.bars\.NotificationBar\.MaxNumberOfNotifications\)\{.+?\}\s*;/,
                            'this.truncateSidebarNotifications(this);'
                        );

                        var notificationBar = qx.core.Init.getApplication().getNotificationBar();

                        if (notificationBar.truncateSidebarNotifications === undefined) {
                            notificationBar.truncateSidebarNotifications = this.truncateSidebarNotifications.bind(this);
                        }

                        notificationBar[this.addToSidebarMethodName] = eval('(' + rewrittenFunctionBody + ')');

                        this.removedNotifications = this.cleanupNotificationMap(notificationBar, notificationBar[this.sidebarNotificationMapByIdMemberName])
                            .concat(this.cleanupNotificationMap(notificationBar, notificationBar[this.sidebarNotificationMapByIdOnlineOnlyMemberName]));
                    },

                    deactivate: function(wasActive) {
                        if (!wasActive) {
                            return;
                        }

                        var notificationBar = qx.core.Init.getApplication().getNotificationBar();
                        notificationBar[this.addToSidebarMethodName] = notificationBar.constructor.prototype[this.addToSidebarMethodName];

                        if (this.removedNotifications !== null) {
                            for (var i = 0; i < this.removedNotifications.length; i++) {
                                // Create sidebar items and add them to id maps, but don't add items to sidebar
                                notificationBar[this.createSidebarItemMethodName](this.removedNotifications[i]);
                            }

                            this.removedNotifications = null;
                        }
                    },

                    /**
                     * @param {webfrontend.gui.bars.NotificationBar} notificationBar
                     * @param {Object} map
                     * @returns {Array}
                     */
                    cleanupNotificationMap: function(notificationBar, map) {
                        var notificationContainer = notificationBar[this.sidebarNotificationContainerMemberName];
                        var removed = [];

                        for (var id in map) {
                            var sidebarItem = map[id];

                            if (sidebarItem !== null && notificationContainer.indexOf(sidebarItem) === -1) {
                                var notification = this.getSidebarItemNotification(notificationBar, sidebarItem);

                                if (notification !== null) {
                                    // Add missing items to sidebar so webfrontend.gui.bars.NotificationBar.prototype._onNotificationRemoved can remove them properly
                                    notificationContainer.add(sidebarItem);
                                    notificationBar[this.sidebarNotificationCountMemberName]++;

                                    notificationBar._onNotificationRemoved(notification);
                                    removed.push(notification);
                                }
                            }
                        }

                        return removed;
                    },

                    /**
                     * @param {webfrontend.gui.bars.NotificationBar} notificationBar
                     */
                    truncateSidebarNotifications: function(notificationBar) {
                        var notificationContainer = notificationBar[this.sidebarNotificationContainerMemberName];

                        while (notificationBar[this.sidebarNotificationCountMemberName] > webfrontend.gui.bars.NotificationBar.MaxNumberOfNotifications) {
                            var sidebarItem = notificationContainer.getChildren()[webfrontend.gui.bars.NotificationBar.MaxNumberOfNotifications];
                            var notification = this.getSidebarItemNotification(notificationBar, sidebarItem);

                            if (notification !== null) {
                                notificationBar._onNotificationRemoved(notification);
                                this.removedNotifications.push(notification);
                            }
                            else {
                                notificationContainer.removeAt(webfrontend.gui.bars.NotificationBar.MaxNumberOfNotifications);
                                notificationBar[this.sidebarNotificationCountMemberName]--;
                            }
                        }
                    },

                    /**
                     * @param {webfrontend.gui.bars.NotificationBar} notificationBar
                     * @param {qx.ui.container.Composite} sidebarItem
                     * @returns {ClientLib.Data.Notification}
                     */
                    getSidebarItemNotification: function(notificationBar, sidebarItem) {
                        var clickListeners = qx.event.Registration.getManager(sidebarItem).getListeners(sidebarItem, 'click');

                        for (var i = 0; i < clickListeners.length; i++) {
                            if (clickListeners[i].handler === notificationBar._onClick) {
                                return clickListeners[i].context.notification;
                            }
                        }

                        return null;
                    }
                }
            });

            qx.Class.define('TATweaks3.Feature.NotificationTickerFix', {
                extend: qx.core.Object,
                implement: [TATweaks3.Feature.IFeature],
                defer: function(statics, members) {
                    TATweaks3.getInstance().registerFeature(members.constructor, {
                        category: TATweaks3.Category.Bugfix,
                        name: 'Fix notification ticker error',
                        description: 'Fixes a common script error caused by a bug in the notification ticker. ' + '<a href="http://forum.alliances.commandandconquer.com/showthread.php?tid=32553" style="color:' + webfrontend.gui.util.BBCode.clrLink + ';" target="_blank">Read more</a>',
                        configKey: 'NotificationTickerFix'
                    });
                },
                construct: function() {
                    var source = webfrontend.gui.notifications.Ticker.prototype._onTick.toString();
                    var matches = source.match(/this\.([A-Za-z_]+)\.removeChild\(this\.([A-Za-z_]+)\[i\]\.getElement\(\)\);/);
                    this.tickerDomContainerMemberName = matches[1];
                    this.tickerItemArrayMemberName = matches[2];
                },
                members: {
                    tickerDomContainerMemberName: null,
                    tickerItemArrayMemberName: null,
                    removedTickerItems: null,

                    onRender: function(checkbox, label, config) {},
                    onReset: function(config) {},
                    onSaveConfig: function(config) {},

                    /** @inheritDoc */
                    activate: function(wasActive) {
                        if (wasActive) {
                            return;
                        }

                        var ticker = qx.core.Init.getApplication().getMessagingTicker();
                        var domContainer = ticker[this.tickerDomContainerMemberName];
                        var tickerItems = ticker[this.tickerItemArrayMemberName];

                        if (domContainer === null) {
                            ticker._onTick();
                            domContainer = ticker[this.tickerDomContainerMemberName];
                        }

                        if (tickerItems.length > domContainer.children.length) {
                            if (this.removedTickerItems === null) {
                                this.removedTickerItems = [];
                            }

                            for (var i = tickerItems.length - 1; i >= 0; i--) {
                                if (!domContainer.contains(tickerItems[i].getElement())) {
                                    this.removedTickerItems.push(tickerItems.splice(i, 1)[0]);
                                }
                            }
                        }
                    },

                    /** @inheritDoc */
                    deactivate: function(wasActive) {
                        if (this.removedTickerItems === null) {
                            return;
                        }

                        var ticker = qx.core.Init.getApplication().getMessagingTicker();
                        var tickerItems = ticker[this.tickerItemArrayMemberName];

                        // Shove back the errorneus notifications that were removed on activation. This will effectively return the ticker to its broken state.
                        for (var i = 0; i < this.removedTickerItems.length; i++) {
                            tickerItems.push(this.removedTickerItems[i]);
                        }

                        this.removedTickerItems = null;
                    }
                }
            });

            qx.Class.define('TATweaks3.Feature.ReportsLoadFix', {
                extend: qx.core.Object,
                implement: [TATweaks3.Feature.IFeature],
                defer: function(statics, members) {
                    TATweaks3.getInstance().registerFeature(members.constructor, {
                        category: TATweaks3.Category.Bugfix,
                        name: 'Fix report load error',
                        description: 'Fixes a common script error that occurs when opening a tab in the reports overlay. Also fixes a similar problem in the base info window causing reports not to load. ' + '<a href="http://forum.alliances.commandandconquer.com/showthread.php?tid=33706" style="color:' + webfrontend.gui.util.BBCode.clrLink + ';" target="_blank">Read more</a>',
                        configKey: 'ReportsLoadFix'
                    });
                },
                construct: function() {
                    var source = ClientLib.Data.Reports.Reports.prototype.RequestReportHeaderDataAll.toString();
                    this.onResponseReportHeaderDataAllMethodName = source.match(/\(new \$I\.[A-Z]{6}\)\.[A-Z]{6}\(this,this\.([A-Z]{6})\)/)[1];

                    source = ClientLib.Data.Reports.Reports.prototype.RequestReportHeaderDataBase.toString();
                    this.onResponseReportHeaderDataBaseMethodName = source.match(/\(new \$I\.[A-Z]{6}\)\.[A-Z]{6}\(this,this\.([A-Z]{6})\)/)[1];
                },
                members: {
                    onResponseReportHeaderDataAllMethodName: null,
                    onResponseReportHeaderDataBaseMethodName: null,

                    onRender: function(checkbox, label, config) {},
                    onReset: function(config) {},
                    onSaveConfig: function(config) {},

                    /** @inheritDoc */
                    activate: function(wasActive) {
                        if (wasActive) {
                            return;
                        }

                        var reports = ClientLib.Data.MainData.GetInstance().get_Reports();

                        var source = ClientLib.Data.Reports.Reports.prototype[this.onResponseReportHeaderDataAllMethodName].toString();
                        var rewrittenFunctionBody = source.replace(
                            /(var ([A-Za-z]+)=)null;if\([A-Za-z]+\.length==[A-Za-z]+\)\{\2=(.+?\})\}/,
                            '$1$3'
                        );
                        reports[this.onResponseReportHeaderDataAllMethodName] = eval('(' + rewrittenFunctionBody + ')');

                        source = ClientLib.Data.Reports.Reports.prototype[this.onResponseReportHeaderDataBaseMethodName].toString();
                        rewrittenFunctionBody = source.replace(
                            /if\([A-Za-z]+\.length==[A-Za-z]+\.NumReportsRequested\)\{(.+?\})\}/,
                            '$1'
                        );
                        reports[this.onResponseReportHeaderDataBaseMethodName] = eval('(' + rewrittenFunctionBody + ')');
                    },

                    /** @inheritDoc */
                    deactivate: function(wasActive) {
                        if (!wasActive) {
                            return;
                        }

                        var reports = ClientLib.Data.MainData.GetInstance().get_Reports();
                        reports[this.onResponseReportHeaderDataAllMethodName] = ClientLib.Data.Reports.Reports.prototype[this.onResponseReportHeaderDataAllMethodName];
                        reports[this.onResponseReportHeaderDataBaseMethodName] = ClientLib.Data.Reports.Reports.prototype[this.onResponseReportHeaderDataBaseMethodName];
                    }
                }
            });

            qx.Class.define('TATweaks3.Feature.MaelstromToolsButtons', {
                extend: qx.core.Object,
                implement: [TATweaks3.Feature.IFeature],
                defer: function(statics, members) {
                    TATweaks3.getInstance().registerFeature(members.constructor, {
                        category: TATweaks3.Category.Script,
                        name: 'Fix MaelstromTools button logic',
                        description: 'Tested with MaelstromTools 0.1.3.2',
                        configKey: 'MaelstromToolsButtons'
                    });
                },
                members: {
                    fixRepairAllCheckbox: null,
                    fixCollectPackagesCheckbox: null,
                    wrapperInstalled: false,

                    /** @inheritDoc */
                    onRender: function(checkbox, label, config) {
                        var container = new qx.ui.container.Composite(new qx.ui.layout.VBox());
                        container.add(checkbox);
                        container.add(this.fixRepairAllCheckbox = new qx.ui.form.CheckBox().set({
                            label: 'Don\'t show "Repair all" button for ghost bases',
                            marginLeft: TATweaks3.SettingsWindow.IndentStep,
                            value: config.fixRepairAll || false
                        }));
                        container.add(this.fixCollectPackagesCheckbox = new qx.ui.form.CheckBox().set({
                            label: 'Don\'t show "Collect packages" button for ghost or locked bases',
                            marginLeft: TATweaks3.SettingsWindow.IndentStep,
                            value: config.fixCollectPackages || false
                        }));
                        container.add(label);

                        checkbox.bind('value', this.fixRepairAllCheckbox, 'enabled');
                        checkbox.bind('value', this.fixCollectPackagesCheckbox, 'enabled');

                        return container;
                    },

                    /** @inheritDoc */
                    onReset: function(config) {
                        this.fixRepairAllCheckbox.setValue(config.fixRepairAll || false);
                        this.fixCollectPackagesCheckbox.setValue(config.fixCollectPackages || false);
                    },

                    /** @inheritDoc */
                    onSaveConfig: function(config) {
                        config.fixRepairAll = this.fixRepairAllCheckbox.getValue();
                        config.fixCollectPackages = this.fixCollectPackagesCheckbox.getValue();
                    },

                    /** @inheritDoc */
                    activate: function(wasActive) {
                        if (this.wrapperInstalled) {
                            return;
                        }

                        if (window.MaelstromTools === undefined) {
                            // If MaelstromTools is not yet loaded, create a construct that activates the fixes once it has loaded
                            var context = this;
                            this.wrapperInstalled = true;

                            window.MaelstromTools = {
                                set Wrapper(value) {
                                    delete this.Wrapper;
                                    this.Wrapper = value;
                                    context.wrapperInstalled = false;
                                    context.applyFixes(false);
                                    return value;
                                }
                            };
                        }
                        else {
                            this.applyFixes(false);
                        }
                    },

                    /** @inheritDoc */
                    deactivate: function(wasActive) {
                        if (wasActive) {
                            if (this.wrapperInstalled) {
                                delete window.MaelstromTools;
                                this.wrapperInstalled = false;
                            }
                            else {
                                this.applyFixes(true);
                            }
                        }
                    },

                    /**
                     * @param {Boolean} deactivating
                     */
                    applyFixes: function(deactivating) {
                        if (MaelstromTools.Wrapper.CanRepairAll_Original === undefined) {
                            MaelstromTools.Wrapper.CanRepairAll_Original = MaelstromTools.Wrapper.CanRepairAll;
                        }

                        if (!deactivating && this.fixRepairAllCheckbox.getValue()) {
                            MaelstromTools.Wrapper.CanRepairAll = function(city, viewMode) {
                                if (city.get_IsGhostMode()) {
                                    return false;
                                }

                                return this.CanRepairAll_Original(city, viewMode);
                            };
                        }
                        else {
                            MaelstromTools.Wrapper.CanRepairAll = MaelstromTools.Wrapper.CanRepairAll_Original;
                        }

                        if (!deactivating && this.fixCollectPackagesCheckbox.getValue()) {
                            var source = MaelstromTools.Base.prototype.checkForPackages.toString();
                            var rewrittenFunctionBody = source.replace(
                                /(([A-Za-z_]+)\.get_CityBuildingsData\(\)\.get_HasCollectableBuildings\(\))/,
                                '!$2.get_IsGhostMode() && !$2.get_IsLocked() && $1'
                            ).replace(
                                /(MT_Cache)/,
                                'var $1 = MaelstromTools.Cache.getInstance(); $1'
                            );
                            MaelstromTools.Base.getInstance().checkForPackages = eval('(' + rewrittenFunctionBody + ')');
                        }
                        else {
                            MaelstromTools.Base.getInstance().checkForPackages = MaelstromTools.Base.prototype.checkForPackages;
                        }
                    }
                }
            });

            qx.Class.define('TATweaks3.Feature.NotifyAboutNewFeatures', {
                extend: qx.core.Object,
                implement: [TATweaks3.Feature.IFeature],
                defer: function(statics, members) {
                    TATweaks3.getInstance().registerFeature(members.constructor, {
                        category: TATweaks3.Category.Self,
                        name: 'Notify me about new features',
                        description: 'Displays an icon when new features are added and highlights them in this window.',
                        configKey: 'NotifyAboutNewFeatures'
                    });
                },
                members: {
                    desktopButton: null,
                    alteredContainers: null,
                    newFeatureCount: 0,

                    onRender: function(checkbox, label, config) {},
                    onReset: function(config) {},
                    onSaveConfig: function(config) {},

                    /** @inheritDoc */
                    activate: function(wasActive) {
                        if (wasActive) {
                            return;
                        }

                        var core = TATweaks3.getInstance();
                        core.addListener('addFeature', this.onFeatureAdd, this);
                        core.addListener('saveSettings', this.onSettingsChange, this);

                        if (!core.initialized) {
                            core.addListenerOnce('initialize', this.onSettingsChange, this);
                        }
                    },

                    /** @inheritDoc */
                    deactivate: function(wasActive) {
                        if (wasActive) {
                            if (this.desktopButton !== null) {
                                this.desktopButton.exclude();
                            }

                            var core = TATweaks3.getInstance();
                            core.removeListener('addFeature', this.onFeatureAdd, this);
                            core.removeListener('saveSettings', this.onSettingsChange, this);
                            this.restoreContainers();
                        }
                    },

                    /**
                     * @param {qx.event.type.Data} event
                     */
                    onFeatureAdd: function(event) {
                        var details = event.getData();

                        if (!TATweaks3.getInstance().hasConfig(details.construct)) {
                            this.highlightContainer(details.container);
                            this.newFeatureCount++;

                            var desktopButton = this.getDesktopButton();
                            desktopButton.setLabel(this.newFeatureCount.toString());
                            desktopButton.show();
                        }
                    },

                    onSettingsChange: function() {
                        this.restoreContainers();

                        var core = TATweaks3.getInstance();
                        var features = core.getAllFeatures();
                        this.newFeatureCount = 0;

                        for (var id in features) {
                            var feature = features[id];

                            if (!core.hasConfig(feature.construct) && !feature.options.disabled) {
                                this.highlightContainer(feature.container);
                                this.newFeatureCount++;
                            }
                        }

                        if (this.newFeatureCount > 0) {
                            var desktopButton = this.getDesktopButton();
                            desktopButton.setLabel(this.newFeatureCount.toString());
                            desktopButton.show();
                        }
                        else if (this.desktopButton !== null) {
                            this.desktopButton.exclude();
                        }
                    },

                    onClickDesktopButton: function() {
                        TATweaks3.getInstance().openSettingsWindow();
                    },

                    /**
                     * @returns {TATweaks3.NotificationButton}
                     */
                    getDesktopButton: function() {
                        if (this.desktopButton === null) {
                            this.desktopButton = new TATweaks3.NotificationButton().set({
                                appearance: 'button-standard-gdi',
                                icon: 'webfrontend/ui/icons/icn_show_combat_active.png',
                                toolTipText: 'New features in TA Tweaks'
                            });
                            this.desktopButton.getChildControl('icon').set({
                                scale: true,
                                width: 36,
                                height: 32
                            });

                            this.desktopButton.addListener('execute', this.onClickDesktopButton, this);
                            qx.core.Init.getApplication().getDesktop().add(this.desktopButton, {
                                right: 125,
                                top: 90
                            });
                        }

                        return this.desktopButton;
                    },

                    /**
                     * @param {qx.ui.container.Composite} container
                     */
                    highlightContainer: function(container) {
                        if (this.alteredContainers === null) {
                            this.alteredContainers = [];
                        }

                        var containerElement = (PerforceChangelist >= 430398) ? container.getContentElement() : container.getContainerElement();

                        this.alteredContainers.push({
                            container: container,
                            backgroundColor: container.getBackgroundColor(),
                            marginLeft: container.getMarginLeft(),
                            paddingLeft: container.getPaddingLeft(),
                            textColor: container.getTextColor(),
                            borderRadius: containerElement.getStyle('border-radius')
                        });
                        container.set({
                            backgroundColor: '#3c7c3c',
                            marginLeft: container.getMarginLeft() - 4,
                            paddingLeft: container.getPaddingLeft() + 4,
                            textColor: '#333'
                        });
                        containerElement.setStyle('border-radius', '8px');
                    },

                    restoreContainers: function() {
                        if (this.alteredContainers === null) {
                            return;
                        }

                        for (var i = 0; i < this.alteredContainers.length; i++) {
                            var info = this.alteredContainers[i];
                            info.container.set({
                                backgroundColor: info.backgroundColor,
                                marginLeft: info.marginLeft,
                                paddingLeft: info.paddingLeft,
                                textColor: info.textColor
                            });

                            var containerElement = PerforceChangelist >= 430398 ? info.container.getContentElement() : info.container.getContainerElement();

                            containerElement.setStyle('border-radius', info.borderRadius);
                        }

                        this.alteredContainers = null;
                    }
                }
            });

            qx.Class.define('TATweaks3.Feature.PlayerBasePlateColoring', {
                extend: qx.core.Object,
                implement: [TATweaks3.Feature.IFeature],
                defer: function(statics, members) {
                    TATweaks3.getInstance().registerFeature(members.constructor, {
                        category: TATweaks3.Category.Script,
                        name: 'Enable player base plate coloring',
                        description: 'Allows scripts like TACS to color player base plates.',
                        configKey: 'PlayerBasePlateColoring'
                    });
                },
                construct: function() {
                    var regionCity$ctorMemberName = null;

                    for (var key in ClientLib.Vis.Region.RegionCity.prototype) {
                        if (typeof ClientLib.Vis.Region.RegionCity.prototype[key] === 'function' && ClientLib.Vis.Region.RegionCity.prototype[key].toString().indexOf('region_city_owner') !== -1) {
                            regionCity$ctorMemberName = key;
                            break;
                        }
                    }

                    if (regionCity$ctorMemberName === null) {
                        throw new Error('Unable to locate ClientLib.Vis.Region.RegionCity.prototype.$ctor');
                    }

                    var source = ClientLib.Vis.Region.RegionCity.prototype[regionCity$ctorMemberName].toString();
                    var matches = source.match(/this\.([A-Z]{6})=\(new \$I\.([A-Z]{6})\)\.([A-Z]{6})\(\$I\.[A-Z]{6}\.Black/);
                    var basePlateMemberName = matches[1];
                    this.playerBasePlateClassName = matches[2];
                    var playerBasePlate$ctorMemberName = matches[3];

                    if (typeof ClientLib.Vis.Region.RegionCity.prototype.get_BasePlate !== 'function') {
                        ClientLib.Vis.Region.RegionCity.prototype.get_BasePlate = eval('(function(){return this.' + basePlateMemberName + ';})');
                    }

                    source = $I[this.playerBasePlateClassName].prototype[playerBasePlate$ctorMemberName].toString();
                    matches = source.match(/\$I\.([A-Z]{6})\.prototype\.([A-Z]{6})\.call/);
                    var basePlateClassName = matches[1];
                    var basePlate$ctorMemberName = matches[2];

                    source = $I[basePlateClassName].prototype[basePlate$ctorMemberName].toString();
                    matches = source.match(/\$I\.([A-Z]{6})\.prototype\.([A-Z]{6})\.call/);
                    var parentBasePlateClassName = matches[1];
                    var parentBasePlate$ctorMemberName = matches[2];

                    source = $I[parentBasePlateClassName].prototype[parentBasePlate$ctorMemberName].toString();
                    matches = source.match(/this\.([A-Z]{6})=a.+this\.([A-Z]{6})\(\)/);
                    var plateColorMemberName = matches[1];
                    var initMethodName = matches[2];

                    if (typeof $I[this.playerBasePlateClassName].prototype.setPlateColor !== 'function') {
                        $I[parentBasePlateClassName].prototype.setPlateColor = eval('(function(a){this.' + plateColorMemberName + '=a;this.' + initMethodName + '();})');
                    }

                    source = ClientLib.Vis.Region.RegionCity.prototype.VisUpdate.toString();
                    this.playerBasePlateUpdateMethodName = source.match(/this\.[A-Z]{6}\.([A-Z]{6})\(this\.[A-Z]{6},this\.[A-Z]{6}\);/)[1];

                    source = $I[this.playerBasePlateClassName].prototype[this.playerBasePlateUpdateMethodName].toString();
                    var rewrittenFunctionBody = source.replace(
                        /\$I\.[A-Z]{6}\.Black/,
                        'this.' + plateColorMemberName
                    );

                    this.rewrittenPlayerbasePlateUpdateMethod = eval('(' + rewrittenFunctionBody + ')');
                },
                members: {
                    playerBasePlateClassName: null,
                    playerBasePlateUpdateMethodName: null,
                    rewrittenPlayerbasePlateUpdateMethod: null,
                    originalPlayerbasePlateUpdateMethod: null,

                    onRender: function(checkbox, label, config) {},
                    onReset: function(config) {},
                    onSaveConfig: function(config) {},

                    /** @inheritDoc */
                    activate: function(wasActive) {
                        if (wasActive) {
                            return;
                        }

                        this.originalPlayerbasePlateUpdateMethod = $I[this.playerBasePlateClassName].prototype[this.playerBasePlateUpdateMethodName];
                        $I[this.playerBasePlateClassName].prototype[this.playerBasePlateUpdateMethodName] = this.rewrittenPlayerbasePlateUpdateMethod;
                    },

                    /** @inheritDoc */
                    deactivate: function(wasActive) {
                        if (!wasActive || this.originalPlayerbasePlateUpdateMethod === null) {
                            return;
                        }

                        $I[this.playerBasePlateClassName].prototype[this.playerBasePlateUpdateMethodName] = this.originalPlayerbasePlateUpdateMethod;
                    }
                }
            });
        }

        function waitForGameTAT() {
            try {
                if (typeof qx !== 'undefined' && qx.core.Init.getApplication() && qx.core.Init.getApplication().initDone) {
                    createTATweaks();
                    TATweaks3.getInstance().initialize();
                }
                else {
                    setTimeout(waitForGameTAT, 1000);
                }
            }
            catch (e) {
                console.log('TATweaks3: ', e.toString());
            }
        }

        setTimeout(waitForGameTAT, 1000);
    };

    var mainTATscript = document.createElement('script');
    mainTATscript.innerHTML = '(' + mainTAT.toString() + ')();';
    mainTATscript.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(mainTATscript);
    
// C&C:TA CNCOpt Offence Link Button - (DTeCH)
        var cncopt_main = function () {


            var scity = null;
            var tcity = null;
            var tbase = null;

            var defense_unit_map = {
                /* GDI Defense Units */"GDI_Wall": "w",
                "GDI_Cannon": "c",
                "GDI_Antitank Barrier": "t",
                "GDI_Barbwire": "b",
                "GDI_Turret": "m",
                "GDI_Flak": "f",
                "GDI_Art Inf": "r",
                "GDI_Art Air": "e",
                "GDI_Art Tank": "a",
                "GDI_Def_APC Guardian": "g",
                "GDI_Def_Missile Squad": "q",
                "GDI_Def_Pitbull": "p",
                "GDI_Def_Predator": "d",
                "GDI_Def_Sniper": "s",
                "GDI_Def_Zone Trooper": "z",
                /* Nod Defense Units */"NOD_Def_Antitank Barrier": "t",
                "NOD_Def_Art Air": "e",
                "NOD_Def_Art Inf": "r",
                "NOD_Def_Art Tank": "a",
                "NOD_Def_Attack Bike": "p",
                "NOD_Def_Barbwire": "b",
                "NOD_Def_Black Hand": "z",
                "NOD_Def_Cannon": "c",
                "NOD_Def_Confessor": "s",
                "NOD_Def_Flak": "f",
                "NOD_Def_MG Nest": "m",
                "NOD_Def_Militant Rocket Soldiers": "q",
                "NOD_Def_Reckoner": "g",
                "NOD_Def_Scorpion Tank": "d",
                "NOD_Def_Wall": "w",

                /* Forgotten Defense Units */"FOR_Wall": "w",
                "FOR_Barbwire_VS_Inf": "b",
                "FOR_Barrier_VS_Veh": "t",
                "FOR_Inf_VS_Inf": "g",
                "FOR_Inf_VS_Veh": "r",
                "FOR_Inf_VS_Air": "q",
                "FOR_Sniper": "n",
                "FOR_Mammoth": "y",
                "FOR_Veh_VS_Inf": "o",
                "FOR_Veh_VS_Veh": "s",
                "FOR_Veh_VS_Air": "u",
                "FOR_Turret_VS_Inf": "m",
                "FOR_Turret_VS_Inf_ranged": "a",
                "FOR_Turret_VS_Veh": "v",
                "FOR_Turret_VS_Veh_ranged": "d",
                "FOR_Turret_VS_Air": "f",
                "FOR_Turret_VS_Air_ranged": "e",
                "": ""
            };

            var offense_unit_map = {
                /* GDI Offense Units */"GDI_APC Guardian": "g",
                "GDI_Commando": "c",
                "GDI_Firehawk": "f",
                "GDI_Juggernaut": "j",
                "GDI_Kodiak": "k",
                "GDI_Mammoth": "m",
                "GDI_Missile Squad": "q",
                "GDI_Orca": "o",
                "GDI_Paladin": "a",
                "GDI_Pitbull": "p",
                "GDI_Predator": "d",
                "GDI_Riflemen": "r",
                "GDI_Sniper Team": "s",
                "GDI_Zone Trooper": "z",

                /* Nod Offense Units */"NOD_Attack Bike": "b",
                "NOD_Avatar": "a",
                "NOD_Black Hand": "z",
                "NOD_Cobra": "r",
                "NOD_Commando": "c",
                "NOD_Confessor": "s",
                "NOD_Militant Rocket Soldiers": "q",
                "NOD_Militants": "m",
                "NOD_Reckoner": "k",
                "NOD_Salamander": "l",
                "NOD_Scorpion Tank": "o",
                "NOD_Specter Artilery": "p",
                "NOD_Venom": "v",
                "NOD_Vertigo": "t",
                "": ""
            };


            function findTechLayout(city) {
                for (var k in city) {
                    //console.log(typeof(city[k]), "1.city[", k, "]", city[k])
                    if ((typeof (city[k]) == "object") && city[k] && 0 in city[k] && 8 in city[k]) {
                        if ((typeof (city[k][0]) == "object") && city[k][0] && city[k][0] && 0 in city[k][0] && 15 in city[k][0]) {
                            if ((typeof (city[k][0][0]) == "object") && city[k][0][0] && "BuildingIndex" in city[k][0][0]) {
                                return city[k];
                            }
                        }
                    }
                }
                return null;
            }

            function findBuildings(city) {
                var cityBuildings = city.get_CityBuildingsData();
                for (var k in cityBuildings) {
                    if (PerforceChangelist >= 376877) {
                        if ((typeof (cityBuildings[k]) === "object") && cityBuildings[k] && "d" in cityBuildings[k] && "c" in cityBuildings[k] && cityBuildings[k].c > 0) {
                            return cityBuildings[k].d;
                        }
                    } else {
                        if ((typeof (cityBuildings[k]) === "object") && cityBuildings[k] && "l" in cityBuildings[k]) {
                            return cityBuildings[k].l;
                        }
                    }
                }
            }

            function isOffenseUnit(unit) {
                return (unit.get_UnitGameData_Obj().n in offense_unit_map);
            }

            function isDefenseUnit(unit) {
                return (unit.get_UnitGameData_Obj().n in defense_unit_map);
            }

            function getUnitArrays(city) {
                var ret = [];
                for (var k in city) {
                    if ((typeof (city[k]) == "object") && city[k]) {
                        for (var k2 in city[k]) {
                            if (PerforceChangelist >= 376877) {
                                if ((typeof (city[k][k2]) == "object") && city[k][k2] && "d" in city[k][k2]) {
                                    var lst1 = city[k][k2].d;
                                    if ((typeof (lst1) == "object") && lst1) {
                                        for (var i in lst1) {
                                            if (typeof (lst1[i]) == "object" && lst1[i] && "get_CurrentLevel" in lst1[i]) {
                                                ret.push(lst1);
                                            }
                                        }
                                    }
                                }
                            } else {
                                if ((typeof (city[k][k2]) == "object") && city[k][k2] && "l" in city[k][k2]) {
                                    var lst2 = city[k][k2].l;
                                    if ((typeof (lst2) == "object") && lst2) {
                                        for (var i2 in lst2) {
                                            if (typeof (lst2[i2]) == "object" && lst2[i2] && "get_CurrentLevel" in lst2[i2]) {
                                                ret.push(lst2);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return ret;
            }

            function getDefenseUnits(city) {
                var arr = getUnitArrays(city);
                for (var i = 0; i < arr.length; ++i) {
                    for (var j in arr[i]) {
                        if (isDefenseUnit(arr[i][j])) {
                            return arr[i];
                        }
                    }
                }
                return [];
            }

            function getOffenseUnits(xCity) {
                var arr = getUnitArrays(xCity);
                for (var i = 0; i < arr.length; ++i) {
                    for (var j in arr[i]) {
                        if (isOffenseUnit(arr[i][j])) {
                            return arr[i];
                        }
                    }
                }
                return [];
            }


            function cncopt_create() {
                console.log("CNCOpt-X Link Button v" + window.__cncopt_version + " loaded");
                var cncopt = {
                    selected_base: null,
                    keymap: {
                        /* GDI Buildings */"GDI_Accumulator": "a",
                        "GDI_Refinery": "r",
                        "GDI_Trade Center": "u",
                        "GDI_Silo": "s",
                        "GDI_Power Plant": "p",
                        "GDI_Construction Yard": "y",
                        "GDI_Airport": "d",
                        "GDI_Barracks": "b",
                        "GDI_Factory": "f",
                        "GDI_Defense HQ": "q",
                        "GDI_Defense Facility": "w",
                        "GDI_Command Center": "e",
                        "GDI_Support_Art": "z",
                        "GDI_Support_Air": "x",
                        "GDI_Support_Ion": "i",
                        /* Forgotten Buildings */"FOR_Silo": "s",
                        "FOR_Refinery": "r",
                        "FOR_Tiberium Booster": "b",
                        "FOR_Crystal Booster": "v",
                        "FOR_Trade Center": "u",
                        "FOR_Defense Facility": "w",
                        "FOR_Construction Yard": "y",
                        "FOR_Harvester_Tiberium": "h",
                        "FOR_Defense HQ": "q",
                        "FOR_Harvester_Crystal": "n",
                        /* Nod Buildings */"NOD_Refinery": "r",
                        "NOD_Power Plant": "p",
                        "NOD_Harvester": "h",
                        "NOD_Construction Yard": "y",
                        "NOD_Airport": "d",
                        "NOD_Trade Center": "u",
                        "NOD_Defense HQ": "q",
                        "NOD_Barracks": "b",
                        "NOD_Silo": "s",
                        "NOD_Factory": "f",
                        "NOD_Harvester_Crystal": "n",
                        "NOD_Command Post": "e",
                        "NOD_Support_Art": "z",
                        "NOD_Support_Ion": "i",
                        "NOD_Accumulator": "a",
                        "NOD_Support_Air": "x",
                        "NOD_Defense Facility": "w",
                        //"NOD_Tech Lab": "",
                        //"NOD_Recruitment Hub": "X",
                        //"NOD_Temple of Nod": "X",

                        /* GDI Defense Units */"GDI_Wall": "w",
                        "GDI_Cannon": "c",
                        "GDI_Antitank Barrier": "t",
                        "GDI_Barbwire": "b",
                        "GDI_Turret": "m",
                        "GDI_Flak": "f",
                        "GDI_Art Inf": "r",
                        "GDI_Art Air": "e",
                        "GDI_Art Tank": "a",
                        "GDI_Def_APC Guardian": "g",
                        "GDI_Def_Missile Squad": "q",
                        "GDI_Def_Pitbull": "p",
                        "GDI_Def_Predator": "d",
                        "GDI_Def_Sniper": "s",
                        "GDI_Def_Zone Trooper": "z",
                        /* Nod Defense Units */"NOD_Def_Antitank Barrier": "t",
                        "NOD_Def_Art Air": "e",
                        "NOD_Def_Art Inf": "r",
                        "NOD_Def_Art Tank": "a",
                        "NOD_Def_Attack Bike": "p",
                        "NOD_Def_Barbwire": "b",
                        "NOD_Def_Black Hand": "z",
                        "NOD_Def_Cannon": "c",
                        "NOD_Def_Confessor": "s",
                        "NOD_Def_Flak": "f",
                        "NOD_Def_MG Nest": "m",
                        "NOD_Def_Militant Rocket Soldiers": "q",
                        "NOD_Def_Reckoner": "g",
                        "NOD_Def_Scorpion Tank": "d",
                        "NOD_Def_Wall": "w",

                        /* Forgotten Defense Units */"FOR_Wall": "w",
                        "FOR_Barbwire_VS_Inf": "b",
                        "FOR_Barrier_VS_Veh": "t",
                        "FOR_Inf_VS_Inf": "g",
                        "FOR_Inf_VS_Veh": "r",
                        "FOR_Inf_VS_Air": "q",
                        "FOR_Sniper": "n",
                        "FOR_Mammoth": "y",
                        "FOR_Veh_VS_Inf": "o",
                        "FOR_Veh_VS_Veh": "s",
                        "FOR_Veh_VS_Air": "u",
                        "FOR_Turret_VS_Inf": "m",
                        "FOR_Turret_VS_Inf_ranged": "a",
                        "FOR_Turret_VS_Veh": "v",
                        "FOR_Turret_VS_Veh_ranged": "d",
                        "FOR_Turret_VS_Air": "f",
                        "FOR_Turret_VS_Air_ranged": "e",

                        /* GDI Offense Units */"GDI_APC Guardian": "g",
                        "GDI_Commando": "c",
                        "GDI_Firehawk": "f",
                        "GDI_Juggernaut": "j",
                        "GDI_Kodiak": "k",
                        "GDI_Mammoth": "m",
                        "GDI_Missile Squad": "q",
                        "GDI_Orca": "o",
                        "GDI_Paladin": "a",
                        "GDI_Pitbull": "p",
                        "GDI_Predator": "d",
                        "GDI_Riflemen": "r",
                        "GDI_Sniper Team": "s",
                        "GDI_Zone Trooper": "z",

                        /* Nod Offense Units */"NOD_Attack Bike": "b",
                        "NOD_Avatar": "a",
                        "NOD_Black Hand": "z",
                        "NOD_Cobra": "r",
                        "NOD_Commando": "c",
                        "NOD_Confessor": "s",
                        "NOD_Militant Rocket Soldiers": "q",
                        "NOD_Militants": "m",
                        "NOD_Reckoner": "k",
                        "NOD_Salamander": "l",
                        "NOD_Scorpion Tank": "o",
                        "NOD_Specter Artilery": "p",
                        "NOD_Venom": "v",
                        "NOD_Vertigo": "t",

                        "<last>": "."
                    },
                    make_sharelink: function () {
                        try {
                            var selected_base = cncopt.selected_base;
                            var city_id = selected_base.get_Id();
                            var city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(city_id);
                            var own_city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                            var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
                            var server = ClientLib.Data.MainData.GetInstance().get_Server();
                            var doLinkCity = (city.get_CityFaction() > 2 ? own_city.get_CityFaction() : city.get_CityFaction());
                            var doCity = (city.get_CityFaction() > 2 ? own_city : city);
                            tbase = selected_base;
                            tcity = city;
                            scity = own_city;
                            console.log("CNCOpt-X Target City: ", city);
                            console.log("CNCOpt-X Own City: ", own_city);
                            console.log("CNCOpt-X doCity City: ", doCity);
                            var link = "http://cncopt.com/?map=";
                            link += "3|";
                            /* link version */
                            switch (city.get_CityFaction()) {
                                case 1:
                                    /* GDI */
                                    link += "G|";
                                    break;
                                case 2:
                                    /* NOD */
                                    link += "N|";
                                    break;
                                case 3:
                                /* FOR faction - unseen, but in GAMEDATA */
                                case 4:
                                /* Forgotten Bases */
                                case 5:
                                /* Forgotten Camps */
                                case 6:
                                    /* Forgotten Outposts */
                                    link += "F|";
                                    break;
                                default:
                                    console.log("CNCOpt-X: Unknown faction: " + city.get_CityFaction());
                                    link += "E|";
                                    break;
                            }
                            //switch (own_city.get_CityFaction()) {
                            switch (doLinkCity) {
                                case 1:
                                    /* GDI */
                                    link += "G|";
                                    break;
                                case 2:
                                    /* NOD */
                                    link += "N|";
                                    break;
                                case 3:
                                /* FOR faction - unseen, but in GAMEDATA */
                                case 4:
                                /* Forgotten Bases */
                                case 5:
                                /* Forgotten Camps */
                                case 6:
                                    /* Forgotten Outposts */
                                    link += "F|";
                                    break;
                                default:
                                    console.log("CNCOpt-X: Unknown faction: " + own_city.get_CityFaction());
                                    link += "E|";
                                    break;
                            }
                            link += city.get_Name() + "|";
                            var defense_units = [];
                            for (var i1 = 0; i1 < 20; ++i1) {
                                var col = [];
                                for (var j2 = 0; j2 < 9; ++j2) {
                                    col.push(null);
                                }
                                defense_units.push(col);
                            }
                            var defense_unit_list = getDefenseUnits(city);
                            if (PerforceChangelist >= 376877) {
                                for (var i2 in defense_unit_list) {
                                    var unit1 = defense_unit_list[i2];
                                    defense_units[unit1.get_CoordX()][unit1.get_CoordY() + 8] = unit1;
                                }
                            } else {
                                for (var i3 = 0; i3 < defense_unit_list.length; ++i3) {
                                    var unit2 = defense_unit_list[i3];
                                    defense_units[unit2.get_CoordX()][unit2.get_CoordY() + 8] = unit2;
                                }
                            }

                            var offense_units = [];
                            for (var i4 = 0; i4 < 20; ++i4) {
                                var col2 = [];
                                for (var j3 = 0; j3 < 9; ++j3) {
                                    col2.push(null);
                                }
                                offense_units.push(col2);
                            }

                            //var offense_unit_list = getOffenseUnits(own_city);
                            var offense_unit_list = getOffenseUnits(doCity);
                            console.log("CNCOpt-X Offense Unit List: ", getOffenseUnits(city));
                            if (PerforceChangelist >= 376877) {
                                for (var i8 in offense_unit_list) {
                                    var unit3 = offense_unit_list[i8];
                                    offense_units[unit3.get_CoordX()][unit3.get_CoordY() + 16] = unit3;
                                }
                            } else {
                                for (var i5 = 0; i5 < offense_unit_list.length; ++i5) {
                                    var unit5 = offense_unit_list[i5];
                                    offense_units[unit5.get_CoordX()][unit5.get_CoordY() + 16] = unit5;
                                }
                            }

                            var techLayout = findTechLayout(city);
                            var buildings = findBuildings(city);
                            var row = [];
                            for (var i6 = 0; i6 < 20; ++i6) {
                                row = [];
                                for (var j = 0; j < 9; ++j) {
                                    var spot = i6 > 16 ? null : techLayout[j][i6];
                                    var level = 0;
                                    var building = null;
                                    if (spot && spot.BuildingIndex >= 0) {
                                        building = buildings[spot.BuildingIndex];
                                        level = building.get_CurrentLevel();
                                    }
                                    var defense_unit = defense_units[j][i6];
                                    if (defense_unit) {
                                        level = defense_unit.get_CurrentLevel();
                                    }
                                    var offense_unit = offense_units[j][i6];
                                    if (offense_unit) {
                                        level = offense_unit.get_CurrentLevel();
                                    }
                                    if (level > 1) {
                                        link += level;
                                    }

                                    switch (i6 > 16 ? 0 : city.GetResourceType(j, i6)) {
                                        case 0:
                                            if (building) {
                                                var techId = building.get_MdbBuildingId();
                                                if (GAMEDATA.Tech[techId].n in cncopt.keymap) {
                                                    link += cncopt.keymap[GAMEDATA.Tech[techId].n];
                                                } else {
                                                    console.log("CNCOpt-X [5]: Unhandled building: " + techId, building);
                                                    link += ".";
                                                }
                                            } else if (defense_unit) {
                                                if (defense_unit.get_UnitGameData_Obj().n in cncopt.keymap) {
                                                    link += cncopt.keymap[defense_unit.get_UnitGameData_Obj().n];
                                                } else {
                                                    console.log("CNCOpt-X [5]: Unhandled unit: " + defense_unit.get_UnitGameData_Obj().n);
                                                    link += ".";
                                                }
                                            } else if (offense_unit) {
                                                if (offense_unit.get_UnitGameData_Obj().n in cncopt.keymap) {
                                                    link += cncopt.keymap[offense_unit.get_UnitGameData_Obj().n];
                                                } else {
                                                    console.log("CNCOpt-X [5]: Unhandled unit: " + offense_unit.get_UnitGameData_Obj().n);
                                                    link += ".";
                                                }
                                            } else {
                                                link += ".";
                                            }
                                            break;
                                        case 1:
                                            /* Crystal */
                                            if (spot.BuildingIndex < 0) link += "c";
                                            else link += "n";
                                            break;
                                        case 2:
                                            /* Tiberium */
                                            if (spot.BuildingIndex < 0) link += "t";
                                            else link += "h";
                                            break;
                                        case 4:
                                            /* Woods */
                                            link += "j";
                                            break;
                                        case 5:
                                            /* Scrub */
                                            link += "h";
                                            break;
                                        case 6:
                                            /* Oil */
                                            link += "l";
                                            break;
                                        case 7:
                                            /* Swamp */
                                            link += "k";
                                            break;
                                        default:
                                            console.log("CNCOpt-X [4]: Unhandled resource type: " + city.GetResourceType(j, i6));
                                            link += ".";
                                            break;
                                    }
                                }
                            }
                            /* Tack on our alliance bonuses */
                            if (alliance && scity.get_AllianceId() == tcity.get_AllianceId()) {
                                link += "|" + alliance.get_POITiberiumBonus();
                                link += "|" + alliance.get_POICrystalBonus();
                                link += "|" + alliance.get_POIPowerBonus();
                                link += "|" + alliance.get_POIInfantryBonus();
                                link += "|" + alliance.get_POIVehicleBonus();
                                link += "|" + alliance.get_POIAirBonus();
                                link += "|" + alliance.get_POIDefenseBonus();
                            }
                            if (server.get_TechLevelUpgradeFactorBonusAmount() != 1.20) {
                                link += "|newEconomy";
                            }

                            //console.log(link);
                            window.open(link, "_blank");
                        } catch (e) {
                            console.log("CNCOpt-X [1]: ", e);
                        }
                    }
                };
                if (!webfrontend.gui.region.RegionCityMenu.prototype.__cncopt_real_showMenu) {
                    webfrontend.gui.region.RegionCityMenu.prototype.__cncopt_real_showMenu = webfrontend.gui.region.RegionCityMenu.prototype.showMenu;
                }

                var check_ct = 0;
                var check_timer = null;
                var button_enabled = 123456;
                /* Wrap showMenu so we can inject our Sharelink at the end of menus and
                 * sync Base object to our cncopt.selected_base variable  */
                webfrontend.gui.region.RegionCityMenu.prototype.showMenu = function (selected_base) {
                    try {
                        var self = this;
                        //console.log(selected_base);
                        cncopt.selected_base = selected_base;
                        if (this.__cncopt_initialized != 1) {
                            this.__cncopt_initialized = 1;
                            this.__cncopt_links = [];
                            for (var i in this) {
                                try {
                                    if (this[i] && this[i].basename == "Composite") {
                                        var link = new qx.ui.form.Button("X-Ray", "data:image/png;base64,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");
                                        link.addListener("execute", function () {
                                            var bt = qx.core.Init.getApplication();
                                            bt.getBackgroundArea().closeCityInfo();
                                            cncopt.make_sharelink();
                                        });
                                        this[i].add(link);
                                        this.__cncopt_links.push(link);
                                    }
                                } catch (e) {
                                    console.log("CNCOpt-X [2]: ", e);
                                }
                            }
                        }
                        var tf = false;
                        switch (selected_base.get_VisObjectType()) {
                            case ClientLib.Vis.VisObject.EObjectType.RegionCityType:
                                switch (selected_base.get_Type()) {
                                    case ClientLib.Vis.Region.RegionCity.ERegionCityType.Own:
                                        tf = true;
                                        break;
                                    case ClientLib.Vis.Region.RegionCity.ERegionCityType.Alliance:
                                    case ClientLib.Vis.Region.RegionCity.ERegionCityType.Enemy:
                                        tf = true;
                                        break;
                                }
                                break;
                            case ClientLib.Vis.VisObject.EObjectType.RegionGhostCity:
                                tf = false;
                                console.log("CNCOpt-X: Ghost City selected.. ignoring because we don't know what to do here");
                                break;
                            case ClientLib.Vis.VisObject.EObjectType.RegionNPCBase:
                                tf = true;
                                break;
                            case ClientLib.Vis.VisObject.EObjectType.RegionNPCCamp:
                                tf = true;
                                break;
                        }

                        var orig_tf = tf;

                        function check_if_button_should_be_enabled() {
                            try {
                                tf = orig_tf;
                                var selected_base = cncopt.selected_base;
                                var still_loading = false;
                                if (check_timer !== null) {
                                    clearTimeout(check_timer);
                                }

                                /* When a city is selected, the data for the city is loaded in the background.. once the
                                 * data arrives, this method is called again with these fields set, but until it does
                                 * we can't actually generate the link.. so this section of the code grays out the button
                                 * until the data is ready, then it'll light up. */
                                if (selected_base && selected_base.get_Id) {
                                    var city_id = selected_base.get_Id();
                                    var city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(city_id);
                                    //if (!city || !city.m_CityUnits || !city.m_CityUnits.m_DefenseUnits) {
                                    //console.log("City", city);
                                    //console.log("get_OwnerId", city.get_OwnerId());
                                    if (!city || city.get_OwnerId() === 0) {
                                        still_loading = true;
                                        tf = false;
                                    }
                                } else {
                                    tf = false;
                                }
                                if (tf != button_enabled) {
                                    button_enabled = tf;
                                    for (var i = 0; i < self.__cncopt_links.length; ++i) {
                                        self.__cncopt_links[i].setEnabled(tf);
                                    }
                                }
                                if (!still_loading) {
                                    check_ct = 0;
                                } else {
                                    if (check_ct > 0) {
                                        check_ct--;
                                        check_timer = setTimeout(check_if_button_should_be_enabled, 100);
                                    } else {
                                        check_timer = null;
                                    }
                                }
                            } catch (e) {
                                console.log("CNCOpt-X [3]: ", e);
                                tf = false;
                            }
                        }

                        check_ct = 50;
                        check_if_button_should_be_enabled();
                    } catch (e) {
                        console.log("CNCOpt-X [3]: ", e);
                    }
                    this.__cncopt_real_showMenu(selected_base);
                };
            }


            /* Nice load check (ripped from AmpliDude's LoU Tweak script) */
            function cnc_check_if_loaded() {
                try {
                    if (typeof qx != 'undefined') {
                        var a = qx.core.Init.getApplication(); // application
                        if (a) {
                            cncopt_create();
                        } else {
                            window.setTimeout(cnc_check_if_loaded, 1000);
                        }
                    } else {
                        window.setTimeout(cnc_check_if_loaded, 1000);
                    }
                } catch (e) {
                    if (typeof console != 'undefined') console.log(e);
                    else if (window.opera) opera.postError(e);
                    else GM_log(e);
                }
            }

            if (/commandandconquer\.com/i.test(document.domain)) window.setTimeout(cnc_check_if_loaded, 1000);
        };

        // injecting because we can't seem to hook into the game interface via unsafeWindow
        //   (Ripped from AmpliDude's LoU Tweak script)
        var script_block = document.createElement("script");
        var txt = cncopt_main.toString();
        script_block.innerHTML = "(" + txt + ")();";
        script_block.type = "text/javascript";
        if (/commandandconquer\.com/i.test(document.domain)) document.getElementsByTagName("head")[0].appendChild(script_block);

// infernal Wrapper - DTeCH
        var CCTAWrapper_main = function () {
            var CCTAWrapper_IsInstalled = false;
            try {
                var _log = function () {
                    if (typeof console != 'undefined') console.log(arguments);
                    else if (window.opera) opera.postError(arguments);
                    else GM_log(arguments);
                };

                function createCCTAWrapper() {
                    console.log('CCTAWrapper loaded');
                    _log('wrapper loading' + PerforceChangelist);
                    var System = $I;
                    var SharedLib = $I;
                    var strFunction;

                    // SharedLib.Combat.CbtSimulation.prototype.DoStep
                    for (var x in $I) {
                        for (var key in $I[x].prototype) {
                            if ($I[x].prototype.hasOwnProperty(key) && typeof($I[x].prototype[key]) === 'function') {  // reduced iterations from 20K to 12K
                                strFunction = $I[x].prototype[key].toString();
                                if (strFunction.indexOf("().l;var b;for (var d = 0 ; d < c.length ; d++){b = c[d];if((b.") > -1) {
                                    $I[x].prototype.DoStep = $I[x].prototype[key];
                                    console.log("SharedLib.Combat.CbtSimulation.prototype.DoStep = $I." + x + ".prototype." + key);
                                    break;
                                }
                            }
                        }
                    }

                    // ClientLib.Data.CityRepair.prototype.CanRepair
                    for (var key in ClientLib.Data.CityRepair.prototype) {
                        if (typeof ClientLib.Data.CityRepair.prototype[key] === 'function') {
                            strFunction = ClientLib.Data.CityRepair.prototype[key].toString();
                            if (strFunction.indexOf("DefenseSetup") > -1 && strFunction.indexOf("DamagedEntity") > -1) {  // order important to reduce iterations
                                ClientLib.Data.CityRepair.prototype.CanRepair = ClientLib.Data.CityRepair.prototype[key];
                                console.log("ClientLib.Data.CityRepair.prototype.CanRepair = ClientLib.Data.CityRepair.prototype." + key);
                                break;
                            }
                        }
                    }

                    // ClientLib.Data.CityRepair.prototype.UpdateCachedFullRepairAllCost
                    for (var key in ClientLib.Data.CityRepair.prototype) {
                        if (typeof ClientLib.Data.CityRepair.prototype[key] === 'function') {
                            strFunction = ClientLib.Data.CityRepair.prototype[key].toString();
                            if (strFunction.indexOf("Type==7") > -1 && strFunction.indexOf("var a=0;if") > -1) {  // order important to reduce iterations
                                ClientLib.Data.CityRepair.prototype.UpdateCachedFullRepairAllCost = ClientLib.Data.CityRepair.prototype[key];
                                console.log("ClientLib.Data.CityRepair.prototype.UpdateCachedFullRepairAllCost = ClientLib.Data.CityRepair.prototype." + key);
                                break;
                            }
                        }
                    }

                    // ClientLib.Data.CityUnits.prototype.get_OffenseUnits
                    strFunction = ClientLib.Data.CityUnits.prototype.HasUnitMdbId.toString();
                    var searchString = "for (var b in {d:this.";
                    var startPos = strFunction.indexOf(searchString) + searchString.length;
                    var fn_name = strFunction.slice(startPos, startPos + 6);
                    strFunction = "var $createHelper;return this." + fn_name + ";";
                    var fn = Function('', strFunction);
                    ClientLib.Data.CityUnits.prototype.get_OffenseUnits = fn;
                    console.log("ClientLib.Data.CityUnits.prototype.get_OffenseUnits = function(){var $createHelper;return this." + fn_name + ";}");

                    // ClientLib.Data.CityUnits.prototype.get_DefenseUnits
                    strFunction = ClientLib.Data.CityUnits.prototype.HasUnitMdbId.toString();
                    searchString = "for (var c in {d:this.";
                    startPos = strFunction.indexOf(searchString) + searchString.length;
                    fn_name = strFunction.slice(startPos, startPos + 6);
                    strFunction = "var $createHelper;return this." + fn_name + ";";
                    fn = Function('', strFunction);
                    ClientLib.Data.CityUnits.prototype.get_DefenseUnits = fn;
                    console.log("ClientLib.Data.CityUnits.prototype.get_DefenseUnits = function(){var $createHelper;return this." + fn_name + ";}");

                    // ClientLib.Vis.Battleground.Battleground.prototype.get_Simulation
                    strFunction = ClientLib.Vis.Battleground.Battleground.prototype.StartBattle.toString();
                    searchString = "=0;for(var a=0; (a<9); a++){this.";
                    startPos = strFunction.indexOf(searchString) + searchString.length;
                    fn_name = strFunction.slice(startPos, startPos + 6);
                    strFunction = "return this." + fn_name + ";";
                    fn = Function('', strFunction);
                    ClientLib.Vis.Battleground.Battleground.prototype.get_Simulation = fn;
                    console.log("ClientLib.Vis.Battleground.Battleground.prototype.get_Simulation = function(){return this." + fn_name + ";}");

                    // GetNerfBoostModifier
                    if (typeof ClientLib.Vis.Battleground.Battleground.prototype.GetNerfAndBoostModifier == 'undefined') ClientLib.Vis.Battleground.Battleground.prototype.GetNerfAndBoostModifier = ClientLib.Base.Util.GetNerfAndBoostModifier;

                    _log('wrapper loaded');
                }
            } catch (e) {
                console.log("createCCTAWrapper: ", e);
            }

            function CCTAWrapper_checkIfLoaded() {
                try {
                    if (typeof qx !== 'undefined') {
                        createCCTAWrapper();
                    } else {
                        window.setTimeout(CCTAWrapper_checkIfLoaded, 1000);
                    }
                } catch (e) {
                    CCTAWrapper_IsInstalled = false;
                    console.log("CCTAWrapper_checkIfLoaded: ", e);
                }
            }

            if (/commandandconquer\.com/i.test(document.domain)) {
                window.setTimeout(CCTAWrapper_checkIfLoaded, 1000);
            }
        };

        try {
            var CCTAWrapper = document.createElement("script");
            CCTAWrapper.innerHTML = "var CCTAWrapper_IsInstalled = true; (" + CCTAWrapper_main.toString() + ")();";
            CCTAWrapper.type = "text/javascript";
            if (/commandandconquer\.com/i.test(document.domain)) {
                document.getElementsByTagName("head")[0].appendChild(CCTAWrapper);
            }
        } catch (e) {
            console.log("CCTAWrapper: init error: ", e);
        }

// MaelstromTools Dev (DTeCH)
var MaelstromTools_main = function () {
    try {
        function CCTAWrapperIsInstalled() {
            return (typeof (CCTAWrapper_IsInstalled) != 'undefined' && CCTAWrapper_IsInstalled);
        }

        function createMaelstromTools() {
            console.log('MaelstromTools loaded');

            qx.Class.define("MaelstromTools.Language", {
                type: "singleton",
                extend: qx.core.Object,
                construct: function (language) {
                    this.Languages = ['de', 'pt', 'fr', 'tr']; // en is default, not needed in here!
                    if (language != null) {
                        this.MyLanguage = language;
                    }
                },
                members: {
                    MyLanguage: "en",
                    Languages: null,
                    Data: null,

                    loadData: function (language) {
                        var l = this.Languages.indexOf(language);

                        if (l < 0) {
                            this.Data = null;
                            return;
                        }

                        this.Data = {};
                        this.Data["Collect all packages"] = ["Alle Pakete einsammeln", "Recolher todos os pacotes", "Récupérez tous les paquets", "Tüm paketleri topla"][l];
                        this.Data["Overall production"] = ["Produktionsübersicht", "Produção global", "La production globale", "Genel üretim"][l];
                        this.Data["Army overview"] = ["Truppenübersicht", "Vista Geral de Exército", "Armée aperçu", "Ordu önizlemesi"][l];
                        this.Data["Base resources"] = ["Basis Ressourcen", "Recursos base", "ressources de base", "Üs önizlemesi"][l];
                        this.Data["Main menu"] = ["Hauptmenü", "Menu Principal", "menu principal", "Ana menü"][l];
                        this.Data["Repair all units"] = ["Alle Einheiten reparieren", "Reparar todas as unidades", "Réparer toutes les unités", "Tüm üniteleri onar"][l];
                        this.Data["Repair all defense buildings"] = ["Alle Verteidigungsgebäude reparieren", "Reparar todos os edifícios de defesa", "Réparer tous les bâtiments de défense", "Tüm savunma binalarını onar"][l];
                        this.Data["Repair all buildings"] = ["Alle Gebäurde reparieren", "Reparar todos os edifícios", "Réparer tous les bâtiments", "Tüm binaları onar"][l];
                        this.Data["Base status overview"] = ["Basisübersicht", "Estado geral da base", "aperçu de l'état de base", "Üs durumu önizlemesi"][l];
                        this.Data["Upgrade priority overview"] = ["Upgrade Übersicht", "Prioridade de upgrades", "aperçu des priorités de mise à niveau", "Yükseltme önceliği önizlemesi"][l];
                        this.Data["MaelstromTools Preferences"] = ["MaelstromTools Einstellungen", "Preferências de MaelstromTools", "Préférences MaelstromTools", "MaelstromTools Ayarları"][l];
                        this.Data["Options"] = ["Einstellungen", "Opções", "Options", "Seçenekler"][l];
                        this.Data["Target out of range, no resource calculation possible"] = ["Ziel nicht in Reichweite, kann die plünderbaren Ressourcen nicht berechnen", "Alvo fora do alcance, não é possivel calcular os recursos", "Cible hors de portée, pas de calcul de ressources possible",
                            "Hedef menzil dışında, kaynak hesaplaması olanaksız"][l];
                        this.Data["Lootable resources"] = ["Plünderbare Ressourcen", "Recursos roubáveis", "Ressources à piller", "Yağmalanabilir kaynaklar"][l];
                        this.Data["per CP"] = ["pro KP", "por PC", "par PC", "KP başına"][l];
                        this.Data["2nd run"] = ["2. Angriff", "2º ataque", "2° attaque", "2. saldırı"][l];
                        this.Data["3rd run"] = ["3. Angriff", "3º ataque", "3° attaque", "3. saldırı"][l];
                        this.Data["Calculating resources..."] = ["Berechne plünderbare Ressourcen...", "A calcular recursos...", "calcul de ressources ...", "Kaynaklar hesaplanıyor..."][l];
                        this.Data["Next MCV"] = ["MBF", "MCV", "VCM"][l];
                        this.Data["Show time to next MCV"] = ["Zeige Zeit bis zum nächsten MBF", "Mostrar tempo restante até ao próximo MCV", "Afficher l'heure pour le prochain VCM ", "Sırdaki MCV için gereken süreyi göster"][l];
                        this.Data["Show lootable resources (restart required)"] = ["Zeige plünderbare Ressourcen (Neustart nötig)", "Mostrar recursos roubáveis (é necessário reiniciar)", "Afficher les ressources fouiller (redémarrage nécessaire)", "Yağmalanabilir kaynakları göster (yeniden başlatma gerekli)"][l];
                        this.Data["Use dedicated Main Menu (restart required)"] = ["Verwende extra Hauptmenü (Neustart nötig)", "Usar botão para o Menu Principal (é necessário reiniciar)", "Utiliser dédiée du menu principal (redémarrage nécessaire)", "Ana menü tuşunu kullan (yeniden başlatma gerekli)"][l];
                        this.Data["Autocollect packages"] = ["Sammle Pakete automatisch", "Auto recolher pacotes", "paquets autocollecté", "Paketleri otomatik topla"][l];
                        this.Data["Autorepair units"] = ["Repariere Einheiten automatisch", "Auto reparar o exército", "unités autoréparé", "Üniteleri otomatik onar"][l];
                        this.Data["Autorepair defense (higher prio than buildings)"] = ["Repariere Verteidigung automatisch (höhere Prio als Gebäude)", "Auto reparar defesa (maior prioridade do que os edifícios)", "réparation automatique la défense (priorité plus élevé que les bâtiments) ", "Savunmayı otomatik onar (binalardan daha yüksek öncelikli olarak)"][l];
                        this.Data["Autorepair buildings"] = ["Repariere Gebäude automatisch", "Auto reparar edifícios", "bâtiments autoréparé", "Binaları otomatik onar"][l];
                        this.Data["Automatic interval in minutes"] = ["Auto-Intervall in Minuten", "Intervalo de tempo automático (em minutos)", "intervalle automatique en quelques minutes", "Otomatik toplama aralığı (dk)"][l];
                        this.Data["Apply changes"] = ["Speichern", "Confirmar", "Appliquer changements", "Uygula"][l];
                        this.Data["Discard changes"] = ["Abbrechen", "Cancelar", "Annuler changements", "İptal"][l];
                        this.Data["Reset to default"] = ["Auf Standard zurücksetzen", "Definições padrão", "Réinitialiser", "Sıfırla"][l];
                        this.Data["Continuous"] = ["Kontinuierlich", "Contínua", "continue", "Sürekli"][l];
                        this.Data["Bonus"] = ["Pakete", "Bónus", "Bonus", "Bonus"][l];
                        this.Data["POI"] = ["POI", "POI", "POI", "POI"][l];
                        this.Data["Total / h"] = ["Gesamt / h", "Total / h", "Total / h", "Toplam / sa."][l];
                        this.Data["Repaircharges"] = ["Reparaturzeiten", "Custo de reparação", "frais de réparation", "Onarım maliyeti"][l];
                        this.Data["Repairtime"] = ["Max. verfügbar", "Tempo de reparação", "Temps de réparation", "Onarım süresi"][l];
                        this.Data["Attacks"] = ["Angriffe", "Ataques", "Attaques", "Saldırılar"][l];
                        this.Data[MaelstromTools.Statics.Infantry] = ["Infanterie", "Infantaria", "Infanterie", "Piyade"][l];
                        this.Data[MaelstromTools.Statics.Vehicle] = ["Fahrzeuge", "Veículos", "Vehicule", "Motorlu B."][l];
                        this.Data[MaelstromTools.Statics.Aircraft] = ["Flugzeuge", "Aeronaves", "Aviation", "Hava A."][l];
                        this.Data[MaelstromTools.Statics.Tiberium] = ["Tiberium", "Tibério", "Tiberium", "Tiberium"][l];
                        this.Data[MaelstromTools.Statics.Crystal] = ["Kristalle", "Cristal", "Cristal", "Kristal"][l];
                        this.Data[MaelstromTools.Statics.Power] = ["Strom", "Potência", "Energie", "Güç"][l];
                        this.Data[MaelstromTools.Statics.Dollar] = ["Credits", "Créditos", "Crédit", "Kredi"][l];
                        this.Data[MaelstromTools.Statics.Research] = ["Forschung", "Investigação", "Recherche", "Araştırma"][l];
                        this.Data["Base"] = ["Basis", "Base", "Base", "Üs"][l];
                        this.Data["Defense"] = ["Verteidigung", "Defesa", "Défense", "Savunma"][l];
                        this.Data["Army"] = ["Armee", "Exército", "Armée", "Ordu"][l];
                        this.Data["Level"] = ["Stufe", "Nível", "Niveau", "Seviye"][l];
                        this.Data["Buildings"] = ["Gebäude", "Edifícios", "Bâtiments", "Binalar"][l];
                        this.Data["Health"] = ["Leben", "Vida", "Santé", "Sağlık"][l];
                        this.Data["Units"] = ["Einheiten", "Unidades", "Unités", "Üniteler"][l];
                        this.Data["Hide Mission Tracker"] = ["Missionsfenster ausblenden", "Esconder janela das Missões", "Cacher la fenêtre de mission", "Görev İzleyicisini Gizle"][l];
                        this.Data["none"] = ["keine", "nenhum", "aucun", "hiçbiri"][l];
                        this.Data["Cooldown"] = ["Cooldown", "Relocalização", "Recharge", "Cooldown"][l];
                        this.Data["Protection"] = ["Geschützt bis", "Protecção", "Protection", "Koruma"][l];
                        this.Data["Available weapon"] = ["Verfügbare Artillerie", "Apoio disponível", "arme disponible", "Mevcut silah"][l];
                        this.Data["Calibrated on"] = ["Kalibriert auf", "Calibrado em", "Calibré sur ", "Kalibreli"][l];
                        this.Data["Total resources"] = ["Gesamt", "Total de recursos", "Ressources totales", "Toplam kaynaklar"][l];
                        this.Data["Max. storage"] = ["Max. Kapazität", "Armazenamento Máx.", "Max. de stockage", "Maks. Depo"][l];
                        this.Data["Storage full!"] = ["Lager voll!", "Armazenamento cheio!", "Stockage plein", "Depo dolu!"][l];
                        this.Data["Storage"] = ["Lagerstand", "Armazenamento", "Stockage", "Depo"][l];
                        this.Data["display only top buildings"] = ["Nur Top-Gebäude anzeigen", "Mostrar apenas melhores edifícios", "afficher uniquement les bâtiments principaux", "yalnızca en iyi binaları göster"][l];
                        this.Data["display only affordable buildings"] = ["Nur einsetzbare Gebäude anzeigen", "Mostrar apenas edíficios acessíveis", "afficher uniquement les bâtiments abordables", "yalnızca satın alınabilir binaları göster"][l];
                        this.Data["City"] = ["Stadt", "Base", "Base", "Şehir"][l];
                        this.Data["Type (coord)"] = ["Typ (Koord.)", "Escrever (coord)", "Type (coord)", "Tip (koord.)"][l];
                        this.Data["to Level"] = ["Auf Stufe", "para nível", "à Niveau ", "Seviye için"][l];
                        this.Data["Gain/h"] = ["Zuwachs/h", "Melhoria/h", "Gain / h", "Kazanç / sa."][l];
                        this.Data["Factor"] = ["Faktor", "Factor", "Facteur", "Faktör"][l];
                        this.Data["Tib/gain"] = ["Tib./Zuwachs", "Tib/melhoria", "Tib / gain", "Tib/Kazanç"][l];
                        this.Data["Pow/gain"] = ["Strom/Zuwachs", "Potencia/melhoria", "Puissance / Gain", "Güç/Kazanç"][l];
                        this.Data["ETA"] = ["Verfügbar in", "Tempo restante", "Temps restant", "Kalan Zaman"][l];
                        this.Data["Upgrade"] = ["Aufrüsten", "Upgrade", "Upgrade", "Yükselt"][l];
                        this.Data["Powerplant"] = ["Kratfwerk", "Central de Energia", "Centrale", "Güç Santrali"][l];
                        this.Data["Refinery"] = ["Raffinerie", "Refinaria", "Raffinerie", "Rafineri"][l];
                        this.Data["Harvester"] = ["Sammler", "Harvester", "Collecteur", "Biçerdöver"][l];
                        this.Data["Silo"] = ["Silo", "Silo", "Silo", "Silo"][l];
                        this.Data["Accumulator"] = ["Akkumulator", "Acumulador", "Accumulateur", "Akümülatör"][l];
                        this.Data["Calibrate support"] = ["Artillerie kalibrieren", "Calibrar apoio", "Calibrer soutien", "Takviyeyi kalibre et"][l];
                        this.Data["Access"] = ["Öffne", "Aceder", "Accès ", "Aç"][l];
                        this.Data["Focus on"] = ["Zentriere auf", "Concentrar em", "Centré sur", "Odaklan"][l];
                        this.Data["Possible attacks from this base (available CP)"] = ["Mögliche Angriffe (verfügbare KP)", "Possible attacks from this base (available CP)", "Possible attacks from this base (available CP)", "Bu üsten yapılması mümkün olan saldırılar (mevcut KP)"][l];
                        //this.Data[""] = [""][l];
                    },
                    get: function (ident) {
                        return this.gt(ident);
                    },
                    gt: function (ident) {
                        if (!this.Data || !this.Data[ident]) {
                            /*if(!parseInt(ident.substr(0, 1), 10) && ident != "0") {
                             console.log("missing language data: " + ident);
                             }*/
                            return ident;
                        }
                        return this.Data[ident];
                    }
                }
            });

            // define Base
            qx.Class.define("MaelstromTools.Base", {
                type: "singleton",
                extend: qx.core.Object,
                members: {
                    /* Desktop */
                    timerInterval: 1500,
                    mainTimerInterval: 5000,
                    lootStatusInfoInterval: null,
                    images: null,
                    mWindows: null,
                    mainMenuWindow: null,

                    itemsOnDesktop: null,
                    itemsOnDesktopCount: null,
                    itemsInMainMenu: null,
                    itemsInMainMenuCount: null,
                    buttonCollectAllResources: null,
                    buttonRepairAllUnits: null,
                    buttonRepairAllBuildings: null,

                    lootWidget: null,

                    initialize: function () {
                        try {
                            //console.log(qx.locale.Manager.getInstance().getLocale());
                            Lang.loadData(qx.locale.Manager.getInstance().getLocale());
                            //console.log("Client version: " + MaelstromTools.Wrapper.GetClientVersion());
                            this.itemsOnDesktopCount = [];
                            this.itemsOnDesktop = {};
                            this.itemsInMainMenuCount = [];
                            this.itemsInMainMenu = {};

                            var fileManager = ClientLib.File.FileManager.GetInstance();
                            //ui/icons/icon_mainui_defense_button
                            //ui/icons/icon_mainui_base_button
                            //ui/icons/icon_army_points
                            //icon_def_army_points
                            var factionText = ClientLib.Base.Util.GetFactionGuiPatchText();
                            this.createNewImage(MaelstromTools.Statics.Tiberium, "ui/common/icn_res_tiberium.png", fileManager);
                            this.createNewImage(MaelstromTools.Statics.Crystal, "ui/common/icn_res_chrystal.png", fileManager);
                            this.createNewImage(MaelstromTools.Statics.Power, "ui/common/icn_res_power.png", fileManager);
                            this.createNewImage(MaelstromTools.Statics.Dollar, "ui/common/icn_res_dollar.png", fileManager);
                            this.createNewImage(MaelstromTools.Statics.Research, "ui/common/icn_res_research.png", fileManager);
                            this.createNewImage("Sum", "ui/common/icn_build_slots.png", fileManager);
                            this.createNewImage("AccessBase", "ui/" + factionText + "/icons/icon_mainui_enterbase.png", fileManager);
                            this.createNewImage("FocusBase", "ui/" + factionText + "/icons/icon_mainui_focusbase.png", fileManager);
                            this.createNewImage("Packages", "ui/" + factionText + "/icons/icon_collect_packages.png", fileManager);
                            this.createNewImage("RepairAllUnits", "ui/" + factionText + "/icons/icon_army_points.png", fileManager);
                            this.createNewImage("RepairAllBuildings", "ui/" + factionText + "/icons/icn_build_slots.png", fileManager);
                            this.createNewImage("ResourceOverviewMenu", "ui/common/icn_res_chrystal.png", fileManager);
                            this.createNewImage("ProductionMenu", "ui/" + factionText + "/icons/icn_build_slots.png", fileManager);
                            this.createNewImage("RepairTimeMenu", "ui/" + factionText + "/icons/icon_repair_all_button.png", fileManager);
                            this.createNewImage("Crosshair", "ui/icons/icon_support_tnk_white.png", fileManager);
                            this.createNewImage("UpgradeBuilding", "ui/" + factionText + "/icons/icon_building_detail_upgrade.png", fileManager);

                            this.createNewWindow("MainMenu", "R", 125, 140, 120, 100, "B");
                            this.createNewWindow("Production", "L", 120, 60, 340, 140);
                            this.createNewWindow("RepairTime", "L", 120, 60, 340, 140);
                            this.createNewWindow("ResourceOverview", "L", 120, 60, 340, 140);
                            this.createNewWindow("BaseStatusOverview", "L", 120, 60, 340, 140);
                            this.createNewWindow("Preferences", "L", 120, 60, 440, 140);
                            this.createNewWindow("UpgradePriority", "L", 120, 60, 870, 400);

                            if (!this.mainMenuWindow) {
                                this.mainMenuWindow = new qx.ui.popup.Popup(new qx.ui.layout.Canvas()).set({
                                    //backgroundColor: "#303030",
                                    padding: 5,
                                    paddingRight: 0
                                });
                                if (MT_Preferences.Settings.useDedicatedMainMenu) {
                                    this.mainMenuWindow.setPlaceMethod("mouse");
                                    this.mainMenuWindow.setPosition("top-left");
                                } else {
                                    this.mainMenuWindow.setPlaceMethod("widget");
                                    this.mainMenuWindow.setPosition("bottom-right");
                                    this.mainMenuWindow.setAutoHide(false);
                                    this.mainMenuWindow.setBackgroundColor("transparent");
                                    //this.mainMenuWindow.setShadow(null);
                                    this.mainMenuWindow.setDecorator(new qx.ui.decoration.Background());
                                }
                            }

                            var desktopPositionModifier = 0;

                            this.buttonCollectAllResources = this.createDesktopButton(Lang.gt("Collect all packages"), "Packages", true, this.desktopPosition(desktopPositionModifier));
                            this.buttonCollectAllResources.addListener("execute", this.collectAllPackages, this);

                            var openProductionWindowButton = this.createDesktopButton(Lang.gt("Overall production"), "ProductionMenu", false, this.desktopPosition(desktopPositionModifier));
                            openProductionWindowButton.addListener("execute", function () {
                                MaelstromTools.Production.getInstance().openWindow("Production", Lang.gt("Overall production"));
                            }, this);

                            var openResourceOverviewWindowButton = this.createDesktopButton(Lang.gt("Base resources"), "ResourceOverviewMenu", false, this.desktopPosition(desktopPositionModifier));
                            openResourceOverviewWindowButton.addListener("execute", function () {
                                MaelstromTools.ResourceOverview.getInstance().openWindow("ResourceOverview", Lang.gt("Base resources"));
                            }, this);

                            desktopPositionModifier++;
                            var openMainMenuButton = this.createDesktopButton(Lang.gt("Main menu"), "ProductionMenu", false, this.desktopPosition(desktopPositionModifier));
                            openMainMenuButton.addListener("click", function (e) {
                                this.mainMenuWindow.placeToMouse(e);
                                this.mainMenuWindow.show();
                            }, this);

                            this.buttonRepairAllUnits = this.createDesktopButton(Lang.gt("Repair all units"), "RepairAllUnits", true, this.desktopPosition(desktopPositionModifier));
                            this.buttonRepairAllUnits.addListener("execute", this.repairAllUnits, this);

                            this.buttonRepairAllBuildings = this.createDesktopButton(Lang.gt("Repair all buildings"), "RepairAllBuildings", true, this.desktopPosition(desktopPositionModifier));
                            this.buttonRepairAllBuildings.addListener("execute", this.repairAllBuildings, this);

                            var openRepairTimeWindowButton = this.createDesktopButton(Lang.gt("Army overview"), "RepairTimeMenu", false, this.desktopPosition(desktopPositionModifier));
                            openRepairTimeWindowButton.addListener("execute", function () {
                                MaelstromTools.RepairTime.getInstance().openWindow("RepairTime", Lang.gt("Army overview"));
                            }, this);

                            var openBaseStatusOverview = this.createDesktopButton(Lang.gt("Base status overview"), "Crosshair", false, this.desktopPosition(desktopPositionModifier));
                            openBaseStatusOverview.addListener("execute", function () {
                                MaelstromTools.BaseStatus.getInstance().openWindow("BaseStatusOverview", Lang.gt("Base status overview"));
                            }, this);

                            desktopPositionModifier++;
                            var openHuffyUpgradeOverview = this.createDesktopButton(Lang.gt("Upgrade priority overview"), "UpgradeBuilding", false, this.desktopPosition(desktopPositionModifier));
                            openHuffyUpgradeOverview.addListener("execute", function () {
                                HuffyTools.UpgradePriorityGUI.getInstance().openWindow("UpgradePriority", Lang.gt("Upgrade priority overview"));
                            }, this);

                            desktopPositionModifier++;
                            var preferencesButton = new qx.ui.form.Button(Lang.gt("Options")).set({
                                appearance: "button-text-small",
                                width: 100,
                                minWidth: 100,
                                maxWidth: 100
                            });
                            //noinspection JSCheckFunctionSignatures
                            preferencesButton.setUserData("desktopPosition", this.desktopPosition(desktopPositionModifier));
                            preferencesButton.addListener("execute", function () {
                                MaelstromTools.Preferences.getInstance().openWindow("Preferences", Lang.gt("MaelstromTools Preferences"), true);
                            }, this);

                            if (MT_Preferences.Settings.useDedicatedMainMenu) {
                                this.addToDesktop("MainMenu", openMainMenuButton);
                            }
                            this.addToMainMenu("ResourceOverviewMenu", openResourceOverviewWindowButton);
                            this.addToMainMenu("ProductionMenu", openProductionWindowButton);
                            this.addToMainMenu("BaseStatusMenu", openBaseStatusOverview);
                            this.addToMainMenu("RepairTimeMenu", openRepairTimeWindowButton);
                            this.addToMainMenu("UpgradeBuilding", openHuffyUpgradeOverview);

                            this.addToMainMenu("PreferencesMenu", preferencesButton);

                            if (!MT_Preferences.Settings.useDedicatedMainMenu) {
                                this.mainMenuWindow.show();
                                var target = qx.core.Init.getApplication().getOptionsBar(); //getServerBar(); //qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_APPOINTMENTS);
                                this.mainMenuWindow.placeToWidget(target, true);
                            }

                            phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, function () {
                                MaelstromTools.Cache.getInstance().SelectedBaseForLoot = null;
                            });

                            webfrontend.gui.chat.ChatWidget.recvbufsize = MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.CHATHISTORYLENGTH, 64);
                            this.runSecondlyTimer();
                            this.runMainTimer();
                            this.runAutoCollectTimer();
                        } catch (e) {
                            console.log("MaelstromTools.initialize: ", e);
                        }
                    },

                    desktopPosition: function (modifier) {
                        if (!modifier) modifier = 0;
                        return modifier;
                    },

                    createDesktopButton: function (title, imageName, isNotification, desktopPosition) {
                        try {
                            if (!isNotification) {
                                isNotification = false;
                            }
                            if (!desktopPosition) {
                                desktopPosition = this.desktopPosition();
                            }
                            var desktopButton = new qx.ui.form.Button(null, this.images[imageName]).set({
                                toolTipText: title,
                                width: 50,
                                height: 40,
                                maxWidth: 50,
                                maxHeight: 40,
                                appearance: (isNotification ? "button-standard-nod" : "button-playarea-mode-frame"), //"button-standard-"+factionText), button-playarea-mode-red-frame
                                center: true
                            });

                            //noinspection JSCheckFunctionSignatures
                            desktopButton.setUserData("isNotification", isNotification);
                            //noinspection JSCheckFunctionSignatures
                            desktopButton.setUserData("desktopPosition", desktopPosition);
                            return desktopButton;
                        } catch (e) {
                            console.log("MaelstromTools.createDesktopButton: ", e);
                        }
                    },

                    createNewImage: function (name, path, fileManager) {
                        try {
                            if (!this.images) {
                                this.images = {};
                            }
                            if (!fileManager) {
                                return;
                            }

                            this.images[name] = fileManager.GetPhysicalPath(path);
                        } catch (e) {
                            console.log("MaelstromTools.createNewImage: ", e);
                        }
                    },

                    createNewWindow: function (name, align, x, y, w, h, alignV) {
                        try {
                            if (!this.mWindows) {
                                this.mWindows = {};
                            }
                            this.mWindows[name] = {};
                            this.mWindows[name]["Align"] = align;
                            this.mWindows[name]["AlignV"] = alignV;
                            this.mWindows[name]["x"] = x;
                            this.mWindows[name]["y"] = y;
                            this.mWindows[name]["w"] = w;
                            this.mWindows[name]["h"] = h;
                        } catch (e) {
                            console.log("MaelstromTools.createNewWindow: ", e);
                        }
                    },

                    addToMainMenu: function (name, button) {
                        try {
                            /*if(!this.useDedicatedMainMenu) {
                             return;
                             }*/
                            if (this.itemsInMainMenu[name] != null) {
                                return;
                            }
                            var desktopPosition = button.getUserData("desktopPosition");
                            var isNotification = button.getUserData("isNotification");
                            if (!desktopPosition) {
                                desktopPosition = this.desktopPosition();
                            }
                            if (!isNotification) {
                                isNotification = false;
                            }

                            if (isNotification && MT_Preferences.Settings.useDedicatedMainMenu) {
                                this.addToDesktop(name, button);
                            } else {
                                if (!this.itemsInMainMenuCount[desktopPosition]) {
                                    this.itemsInMainMenuCount[desktopPosition] = 0;
                                }
                                this.mainMenuWindow.add(button, {
                                    right: 5 + (52 * this.itemsInMainMenuCount[desktopPosition]),
                                    top: (42 * (desktopPosition)) //bottom: 0 - (42 * (desktopPosition - 1))
                                });

                                this.itemsInMainMenu[name] = button;
                                this.itemsInMainMenuCount[desktopPosition]++;
                            }
                        } catch (e) {
                            console.log("MaelstromTools.addToMainMenu: ", e);
                        }
                    },

                    removeFromMainMenu: function (name, rearrange) {
                        try {
                            if (rearrange == null) {
                                rearrange = true;
                            }
                            var isNotification;
                            //null;
                            if (this.itemsOnDesktop[name] != null) {
                                isNotification = this.itemsOnDesktop[name].getUserData("isNotification");
                                if (!isNotification) {
                                    isNotification = false;
                                }
                                if (isNotification && MT_Preferences.Settings.useDedicatedMainMenu) {
                                    this.removeFromDesktop(name, rearrange);
                                }
                            } else if (this.itemsInMainMenu[name] != null) {
                                var desktopPosition = this.itemsInMainMenu[name].getUserData("desktopPosition");
                                isNotification = this.itemsInMainMenu[name].getUserData("isNotification");
                                if (!desktopPosition) {
                                    desktopPosition = this.desktopPosition();
                                }
                                if (!isNotification) {
                                    isNotification = false;
                                }

                                this.mainMenuWindow.remove(this.itemsInMainMenu[name]);
                                this.itemsInMainMenu[name] = null;
                                this.itemsInMainMenuCount[desktopPosition]--;

                                if (rearrange && this.itemsInMainMenu[desktopPosition] > 1) {
                                    var tmpItems = {};
                                    // remove notifications
                                    for (var itemName in this.itemsOnDesktop) {
                                        //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                        if (this.itemsInMainMenu[itemName] == null) {
                                            continue;
                                        }
                                        if (!isNotification) {
                                            continue;
                                        }
                                        //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop,JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                        tmpItems[itemName] = this.itemsInMainMenu[itemName];
                                        //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                        this.removeFromMainMenu(itemName, false);
                                    }
                                    // rearrange notifications
                                    for (var itemName2 in tmpItems) {
                                        //noinspection JSUnfilteredForInLoop
                                        var tmp = tmpItems[itemName2];
                                        if (tmp == null) {
                                            continue;
                                        }
                                        //noinspection JSUnfilteredForInLoop
                                        this.addToMainMenu(itemName2, tmp);
                                    }
                                }
                            }
                        } catch (e) {
                            console.log("MaelstromTools.removeFromDesktop: ", e);
                        }
                    },

                    addToDesktop: function (name, button) {
                        try {
                            if (this.itemsOnDesktop[name] != null) {
                                return;
                            }
                            var desktopPosition = button.getUserData("desktopPosition");
                            if (!desktopPosition) {
                                desktopPosition = this.desktopPosition();
                            }

                            if (!this.itemsOnDesktopCount[desktopPosition]) {
                                this.itemsOnDesktopCount[desktopPosition] = 0;
                            }

                            var app = qx.core.Init.getApplication();
                            //var navBar = app.getNavigationBar();

                            // console.log("add to Desktop at pos: " + this.itemsOnDesktopCount);
                            app.getDesktop().add(button, {
                                //right: navBar.getBounds().width + (52 * this.itemsOnDesktopCount[desktopPosition]),
                                //top: 42 * (desktopPosition - 1)
                                right: 5 + (52 * this.itemsOnDesktopCount[desktopPosition]),
                                //top: this.initialAppointmentBarHeight + 125 + (42 * (desktopPosition - 1))
                                bottom: 140 - (42 * (desktopPosition - 1))
                            });

                            this.itemsOnDesktop[name] = button;
                            this.itemsOnDesktopCount[desktopPosition]++;
                        } catch (e) {
                            console.log("MaelstromTools.addToDesktop: ", e);
                        }
                    },

                    removeFromDesktop: function (name, rearrange) {
                        try {
                            if (rearrange == null) {
                                rearrange = true;
                            }
                            var app = qx.core.Init.getApplication();

                            if (this.itemsOnDesktop[name] != null) {
                                var desktopPosition = this.itemsOnDesktop[name].getUserData("desktopPosition");
                                var isNotification = this.itemsOnDesktop[name].getUserData("isNotification");
                                if (!desktopPosition) {
                                    desktopPosition = this.desktopPosition();
                                }
                                if (!isNotification) {
                                    isNotification = false;
                                }

                                app.getDesktop().remove(this.itemsOnDesktop[name]);
                                this.itemsOnDesktop[name] = null;
                                this.itemsOnDesktopCount[desktopPosition]--;

                                if (rearrange && this.itemsOnDesktopCount[desktopPosition] > 1) {
                                    var tmpItems = {};
                                    // remove notifications
                                    for (var itemName in this.itemsOnDesktop) {
                                        //noinspection JSUnfilteredForInLoop
                                        if (this.itemsOnDesktop[itemName] == null) {
                                            continue;
                                        }
                                        //noinspection JSUnfilteredForInLoop
                                        if (!this.itemsOnDesktop[itemName].getUserData("isNotification")) {
                                            continue;
                                        }
                                        //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                        tmpItems[itemName] = this.itemsOnDesktop[itemName];
                                        //noinspection JSUnfilteredForInLoop
                                        this.removeFromDesktop(itemName, false);
                                    }
                                    // rearrange notifications
                                    for (var itemName2 in tmpItems) {
                                        //noinspection JSUnfilteredForInLoop
                                        var tmp = tmpItems[itemName2];
                                        if (tmp == null) {
                                            continue;
                                        }
                                        //noinspection JSUnfilteredForInLoop
                                        this.addToMainMenu(itemName2, tmp);
                                    }
                                }
                            }
                        } catch (e) {
                            console.log("MaelstromTools.removeFromDesktop: ", e);
                        }
                    },

                    runSecondlyTimer: function () {
                        try {
                            this.calculateCostsForNextMCV();

                            var self = this;
                            setTimeout(function () {
                                self.runSecondlyTimer();
                            }, 1000);
                        } catch (e) {
                            console.log("MaelstromTools.runSecondlyTimer: ", e);
                        }
                    },

                    runMainTimer: function () {
                        try {
                            this.checkForPackages();
                            this.checkRepairAllUnits();
                            this.checkRepairAllBuildings();

                            var missionTracker = typeof (qx.core.Init.getApplication().getMissionsBar) === 'function' ? qx.core.Init.getApplication().getMissionsBar() : qx.core.Init.getApplication().getMissionTracker(); //fix for PerforceChangelist>=376877
                            if (MT_Preferences.Settings.autoHideMissionTracker) {
                                if (missionTracker.isVisible()) {
                                    missionTracker.hide();
                                }
                                if (typeof (qx.core.Init.getApplication().getMissionsBar) === 'function') {
                                    if (qx.core.Init.getApplication().getMissionsBar().getSizeHint().height != 0) {
                                        qx.core.Init.getApplication().getMissionsBar().getSizeHint().height = 0;
                                        qx.core.Init.getApplication().triggerDesktopResize();
                                    }
                                }
                            } else {
                                if (!missionTracker.isVisible()) {
                                    missionTracker.show();
                                    if (typeof (qx.core.Init.getApplication().getMissionsBar) === 'function') {
                                        qx.core.Init.getApplication().getMissionsBar().initHeight();
                                        qx.core.Init.getApplication().triggerDesktopResize();
                                    }
                                }
                            }

                            var self = this;
                            setTimeout(function () {
                                self.runMainTimer();
                            }, this.mainTimerInterval);
                        } catch (e) {
                            console.log("MaelstromTools.runMainTimer: ", e);
                        }
                    },

                    runAutoCollectTimer: function () {
                        try {
                            //console.log("runAutoCollectTimer ", MT_Preferences.Settings.AutoCollectTimer);
                            if (!CCTAWrapperIsInstalled()) return; // run timer only then wrapper is running
                            if (this.checkForPackages() && MT_Preferences.Settings.autoCollectPackages) {
                                this.collectAllPackages();
                            }
                            if (this.checkRepairAllUnits() && MT_Preferences.Settings.autoRepairUnits) {
                                this.repairAllUnits();
                            }
                            if (this.checkRepairAllBuildings() && MT_Preferences.Settings.autoRepairBuildings) {
                                this.repairAllBuildings();
                            }

                            var self = this;
                            setTimeout(function () {
                                self.runAutoCollectTimer();
                            }, MT_Preferences.Settings.AutoCollectTimer * 60000);
                        } catch (e) {
                            console.log("MaelstromTools.runMainTimer: ", e);
                        }
                    },

                    openWindow: function (windowObj, windowName, skipMoveWindow) {
                        try {
                            if (!windowObj.isVisible()) {
                                if (windowName == "MainMenu") {
                                    windowObj.show();
                                } else {
                                    if (!skipMoveWindow) {
                                        this.moveWindow(windowObj, windowName);
                                    }
                                    windowObj.open();
                                }
                            }
                        } catch (e) {
                            console.log("MaelstromTools.openWindow: ", e);
                        }
                    },

                    moveWindow: function (windowObj, windowName) {
                        try {
                            var x = this.mWindows[windowName]["x"];
                            var y = this.mWindows[windowName]["y"];
                            if (this.mWindows[windowName]["Align"] == "R") {
                                x = qx.bom.Viewport.getWidth(window) - this.mWindows[windowName]["x"];
                            }
                            if (this.mWindows[windowName]["AlignV"] == "B") {
                                y = qx.bom.Viewport.getHeight(window) - this.mWindows[windowName]["y"] - windowObj.height;
                            }
                            windowObj.moveTo(x, y);
                            if (windowName != "MainMenu") {
                                windowObj.setHeight(this.mWindows[windowName]["h"]);
                                windowObj.setWidth(this.mWindows[windowName]["w"]);
                            }
                        } catch (e) {
                            console.log("MaelstromTools.moveWindow: ", e);
                        }
                    },

                    checkForPackages: function () {
                        try {
                            MT_Cache.updateCityCache();

                            for (var cname in MT_Cache.Cities) {
                                //noinspection JSUnfilteredForInLoop
                                var ncity = MT_Cache.Cities[cname].Object;
                                if (ncity.get_CityBuildingsData().get_HasCollectableBuildings() && !ncity.get_IsGhostMode()) {
                                    this.addToMainMenu("CollectAllResources", this.buttonCollectAllResources);
                                    return true;
                                }
                            }
                            this.removeFromMainMenu("CollectAllResources");
                            return false;
                        } catch (e) {
                            console.log("MaelstromTools.checkForPackages: ", e);
                            return false;
                        }
                    },

                    collectAllPackages: function () {
                        try {
                            MT_Cache.updateCityCache();
                            for (var cname in MT_Cache.Cities) {
                                //noinspection JSUnfilteredForInLoop
                                var ncity = MT_Cache.Cities[cname].Object;
                                if (ncity.get_CityBuildingsData().get_HasCollectableBuildings()) {
                                    ncity.CollectAllResources();
                                }
                            }
                            this.removeFromMainMenu("CollectAllResources");
                        } catch (e) {
                            console.log("MaelstromTools.collectAllPackages: ", e);
                        }
                    },

                    checkRepairAll: function (visMode, buttonName, button) {
                        try {
                            MT_Cache.updateCityCache();

                            for (var cname in MT_Cache.Cities) {
                                //noinspection JSUnfilteredForInLoop
                                var ncity = MT_Cache.Cities[cname].Object;
                                if (!ncity.get_IsGhostMode() && ncity.get_CityRepairData().CanRepairAll(visMode)) {
                                    this.addToMainMenu(buttonName, button);
                                    return true;
                                }
                            }

                            this.removeFromMainMenu(buttonName);
                            return false;
                        } catch (e) {
                            console.log("MaelstromTools.checkRepairAll: ", e);
                            return false;
                        }
                    },

                    checkRepairAllUnits: function () {
                        return this.checkRepairAll(ClientLib.Vis.Mode.ArmySetup, "RepairAllUnits", this.buttonRepairAllUnits);
                    },

                    checkRepairAllBuildings: function () {
                        return this.checkRepairAll(ClientLib.Vis.Mode.City, "RepairAllBuildings", this.buttonRepairAllBuildings);
                    },

                    repairAll: function (visMode, buttonName) {
                        try {
                            MT_Cache.updateCityCache();

                            for (var cname in MT_Cache.Cities) {
                                //noinspection JSUnfilteredForInLoop
                                var ncity = MT_Cache.Cities[cname].Object;
                                if (!ncity.get_IsGhostMode() && ncity.get_CityRepairData().CanRepairAll(visMode)) {
                                    ncity.get_CityRepairData().RepairAll(visMode);
                                }

                            }
                            this.removeFromMainMenu(buttonName);
                        } catch (e) {
                            console.log("MaelstromTools.repairAll: ", e);
                        }
                    },

                    //ClientLib.Data.City.prototype.get_CityRepairData
                    //ClientLib.Data.CityRepair.prototype.CanRepairAll
                    //ClientLib.Data.CityRepair.prototype.RepairAll
                    repairAllUnits: function () {
                        try {
                            this.repairAll(ClientLib.Vis.Mode.ArmySetup, "RepairAllUnits");
                        } catch (e) {
                            console.log("MaelstromTools.repairAllUnits: ", e);
                        }
                    },

                    repairAllBuildings: function () {
                        try {
                            this.repairAll(ClientLib.Vis.Mode.City, "RepairAllBuildings");
                        } catch (e) {
                            console.log("MaelstromTools.repairAllBuildings: ", e);
                        }
                    },

                    updateLoot: function (ident, visCity, widget) {
                        try {
                            clearInterval(this.lootStatusInfoInterval);
                            if (!MT_Preferences.Settings.showLoot) {
                                if (this.lootWidget[ident]) {
                                    this.lootWidget[ident].removeAll();
                                }
                                return;
                            }

                            var baseLoadState = MT_Cache.updateLoot(visCity);
                            if (baseLoadState == -2) { // base already cached and base not changed
                                return;
                            }

                            if (!this.lootWidget) {
                                this.lootWidget = {};
                            }
                            if (!this.lootWidget[ident]) {
                                this.lootWidget[ident] = new qx.ui.container.Composite(new qx.ui.layout.Grid(5, 5));
                                this.lootWidget[ident].setTextColor("white");
                                widget.add(this.lootWidget[ident]);
                            }
                            var lootWidget = this.lootWidget[ident];

                            var rowIdx = 1;
                            var colIdx = 1;
                            lootWidget.removeAll();
                            switch (baseLoadState) {
                                case -1:
                                {
                                    MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, "Target out of range, no resource calculation possible", null, null, 'bold', null);
                                    break;
                                }
                                case 1:
                                {
                                    var Resources = MT_Cache.SelectedBaseResources;
                                    this.createResourceLabels(lootWidget, ++rowIdx, "Possible attacks from this base (available CP)", Resources, -1);
                                    this.createResourceLabels(lootWidget, ++rowIdx, "Lootable resources", Resources, 1);
                                    this.createResourceLabels(lootWidget, ++rowIdx, "per CP", Resources, 1 * Resources.CPNeeded);
                                    this.createResourceLabels(lootWidget, ++rowIdx, "2nd run", Resources, 2 * Resources.CPNeeded);
                                    this.createResourceLabels(lootWidget, ++rowIdx, "3rd run", Resources, 3 * Resources.CPNeeded);
                                    break;
                                }
                                default:
                                {
                                    MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, "Calculating resources...", null, null, 'bold', null);
                                    this.lootStatusInfoInterval = setInterval(function () {
                                        MaelstromTools.Base.getInstance().updateLoot(ident, visCity, widget);
                                    }, 100);
                                    break;
                                }
                            }
                        } catch (e) {
                            console.log("MaelstromTools.updateLoot: ", e);
                        }
                    },

                    createResourceLabels: function (lootWidget, rowIdx, Label, Resources, Modifier) {
                        var colIdx = 1;
                        var font = (Modifier > 1 ? null : 'bold');

                        if (Modifier == -1 && Resources.CPNeeded > 0) {
                            Label = Lang.gt(Label) + ": " + Math.floor(ClientLib.Data.MainData.GetInstance().get_Player().GetCommandPointCount() / Resources.CPNeeded);
                            MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, Label, null, 'left', font, null, 9);
                            return;
                        }
                        colIdx = 1;
                        if (Modifier > 0) {
                            MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, Lang.gt(Label) + ":", null, null, font);
                            MaelstromTools.Util.addImage(lootWidget, rowIdx, colIdx++, MaelstromTools.Util.getImage(MaelstromTools.Statics.Research));
                            MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Resources[MaelstromTools.Statics.Research] / Modifier), 50, 'right', font);
                            MaelstromTools.Util.addImage(lootWidget, rowIdx, colIdx++, MaelstromTools.Util.getImage(MaelstromTools.Statics.Tiberium));
                            MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Resources[MaelstromTools.Statics.Tiberium] / Modifier), 50, 'right', font);
                            MaelstromTools.Util.addImage(lootWidget, rowIdx, colIdx++, MaelstromTools.Util.getImage(MaelstromTools.Statics.Crystal));
                            MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Resources[MaelstromTools.Statics.Crystal] / Modifier), 50, 'right', font);
                            MaelstromTools.Util.addImage(lootWidget, rowIdx, colIdx++, MaelstromTools.Util.getImage(MaelstromTools.Statics.Dollar));
                            MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Resources[MaelstromTools.Statics.Dollar] / Modifier), 50, 'right', font);
                            MaelstromTools.Util.addImage(lootWidget, rowIdx, colIdx++, MaelstromTools.Util.getImage("Sum"));
                            MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Resources["Total"] / Modifier), 50, 'right', font);
                        }
                    },

                    mcvPopup: null,
                    mcvPopupX: 0,
                    mcvPopupY: 0,
                    mcvTimerLabel: null,
                    calculateCostsForNextMCV: function () {
                        try {
                            if (!MT_Preferences.Settings.showCostsForNextMCV) {
                                if (this.mcvPopup) {
                                    this.mcvPopup.close();
                                }
                                return;
                            }
                            var player = ClientLib.Data.MainData.GetInstance().get_Player();
                            var cw = player.get_Faction();
                            var cj = ClientLib.Base.Tech.GetTechIdFromTechNameAndFaction(ClientLib.Base.ETechName.Research_BaseFound, cw);
                            var cr = player.get_PlayerResearch();
                            var cd = cr.GetResearchItemFomMdbId(cj);
                            if (cd == null) {
                                if (this.mcvPopup) {
                                    this.mcvPopup.close();
                                }
                                return;
                            }

                            if (!this.mcvPopup) {
                                this.mcvPopup = new qx.ui.window.Window("").set({
                                    contentPadding: 0,
                                    showMinimize: false,
                                    showMaximize: false,
                                    showClose: false,
                                    resizable: false
                                });
                                this.mcvPopup.setLayout(new qx.ui.layout.VBox());
                                this.mcvPopup.addListener("move", function (e) {
                                    var base = MaelstromTools.Base.getInstance();
                                    var size = qx.core.Init.getApplication().getRoot().getBounds();
                                    var value = size.width - e.getData().left;
                                    base.mcvPopupX = value < 0 ? 150 : value;
                                    value = size.height - e.getData().top;
                                    base.mcvPopupY = value < 0 ? 70 : value;
                                    MaelstromTools.LocalStorage.set("mcvPopup", {
                                        x: base.mcvPopupX,
                                        y: base.mcvPopupY
                                    });
                                });
                                var font = qx.bom.Font.fromString('bold').set({
                                    size: 20
                                });

                                this.mcvTimerLabel = new qx.ui.basic.Label().set({
                                    font: font,
                                    textColor: 'red',
                                    width: 155,
                                    textAlign: 'center',
                                    marginBottom: 5
                                });
                                this.mcvPopup.add(this.mcvTimerLabel);
                                var serverBar = qx.core.Init.getApplication().getServerBar().getBounds();
                                var pos = MaelstromTools.LocalStorage.get("mcvPopup", {
                                    x: serverBar.width + 150,
                                    y: 70
                                });
                                this.mcvPopupX = pos.x;
                                this.mcvPopupY = pos.y;
                                this.mcvPopup.open();
                            }
                            var size = qx.core.Init.getApplication().getRoot().getBounds();
                            this.mcvPopup.moveTo(size.width - this.mcvPopupX, size.height - this.mcvPopupY);

                            var nextLevelInfo = cd.get_NextLevelInfo_Obj();
                            var resourcesNeeded = [];
                            for (var i in nextLevelInfo.rr) {
                                //noinspection JSUnfilteredForInLoop
                                if (nextLevelInfo.rr[i].t > 0) {
                                    //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                    resourcesNeeded[nextLevelInfo.rr[i].t] = nextLevelInfo.rr[i].c;
                                }
                            }
                            //var researchNeeded = resourcesNeeded[ClientLib.Base.EResourceType.ResearchPoints];
                            //var currentResearchPoints = player.get_ResearchPoints();

                            var creditsNeeded = resourcesNeeded[ClientLib.Base.EResourceType.Gold];
                            var creditsResourceData = player.get_Credits();
                            var creditGrowthPerHour = (creditsResourceData.Delta + creditsResourceData.ExtraBonusDelta) * ClientLib.Data.MainData.GetInstance().get_Time().get_StepsPerHour();
                            var creditTimeLeftInHours = (creditsNeeded - player.GetCreditsCount()) / creditGrowthPerHour;

                            if (creditGrowthPerHour == 0 || creditTimeLeftInHours <= 0) {
                                if (this.mcvPopup) {
                                    this.mcvPopup.close();
                                }
                                return;
                            }

                            this.mcvPopup.setCaption(Lang.gt("Next MCV") + " ($ " + MaelstromTools.Wrapper.FormatNumbersCompact(creditsNeeded) + ")");
                            this.mcvTimerLabel.setValue(MaelstromTools.Wrapper.FormatTimespan(creditTimeLeftInHours * 60 * 60));

                            if (!this.mcvPopup.isVisible()) {
                                this.mcvPopup.open();
                            }
                        } catch (e) {
                            console.log("calculateCostsForNextMCV", e);
                        }
                    }
                }
            });

            // define Preferences
            qx.Class.define("MaelstromTools.Preferences", {
                type: "singleton",
                extend: qx.core.Object,

                statics: {
                    USEDEDICATEDMAINMENU: "useDedicatedMainMenu",
                    AUTOCOLLECTPACKAGES: "autoCollectPackages",
                    AUTOREPAIRUNITS: "autoRepairUnits",
                    AUTOREPAIRBUILDINGS: "autoRepairBuildings",
                    AUTOHIDEMISSIONTRACKER: "autoHideMissionTracker",
                    AUTOCOLLECTTIMER: "AutoCollectTimer",
                    SHOWLOOT: "showLoot",
                    SHOWCOSTSFORNEXTMCV: "showCostsForNextMCV",
                    CHATHISTORYLENGTH: "ChatHistoryLength"
                },

                members: {
                    Window: null,
                    Widget: null,
                    Settings: null,
                    FormElements: null,

                    readOptions: function () {
                        try {
                            if (!this.Settings) {
                                this.Settings = {};
                            }

                            /*
                             if(MaelstromTools.LocalStorage.get("useDedicatedMainMenu") == null) {
                             if(qx.bom.Viewport.getWidth(window) > 1800) {
                             this.Settings["useDedicatedMainMenu"] = false;
                             }
                             } else {
                             this.Settings["useDedicatedMainMenu"] = (MaelstromTools.LocalStorage.get("useDedicatedMainMenu", 1) == 1);
                             }*/
                            this.Settings[MaelstromTools.Preferences.USEDEDICATEDMAINMENU] = (MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.USEDEDICATEDMAINMENU, 1) == 1);
                            this.Settings[MaelstromTools.Preferences.AUTOCOLLECTPACKAGES] = (MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.AUTOCOLLECTPACKAGES, 1) == 1);
                            this.Settings[MaelstromTools.Preferences.AUTOREPAIRUNITS] = (MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.AUTOREPAIRUNITS, 1) == 1);
                            this.Settings[MaelstromTools.Preferences.AUTOREPAIRBUILDINGS] = (MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.AUTOREPAIRBUILDINGS, 1) == 1);
                            this.Settings[MaelstromTools.Preferences.AUTOHIDEMISSIONTRACKER] = (MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.AUTOHIDEMISSIONTRACKER, 0) == 1);
                            this.Settings[MaelstromTools.Preferences.AUTOCOLLECTTIMER] = MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.AUTOCOLLECTTIMER, 1);
                            this.Settings[MaelstromTools.Preferences.SHOWLOOT] = (MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.SHOWLOOT, 1) == 1);
                            this.Settings[MaelstromTools.Preferences.SHOWCOSTSFORNEXTMCV] = (MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.SHOWCOSTSFORNEXTMCV, 1) == 1);
                            this.Settings[MaelstromTools.Preferences.CHATHISTORYLENGTH] = MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.CHATHISTORYLENGTH, 64);

                            if (!CCTAWrapperIsInstalled()) {
                                this.Settings[MaelstromTools.Preferences.AUTOREPAIRUNITS] = false;
                                this.Settings[MaelstromTools.Preferences.AUTOREPAIRBUILDINGS] = false;
                                //this.Settings[MaelstromTools.Preferences.SHOWLOOT] = false;
                            }
                            //console.log(this.Settings);

                        } catch (e) {
                            console.log("MaelstromTools.Preferences.readOptions: ", e);
                        }
                    },

                    openWindow: function (WindowName, WindowTitle) {
                        try {
                            if (!this.Window) {
                                //this.Window = new qx.ui.window.Window(WindowTitle).set({
                                this.Window = new webfrontend.gui.OverlayWindow().set({
                                    autoHide: false,
                                    title: WindowTitle,
                                    minHeight: 350

                                    //resizable: false,
                                    //showMaximize:false,
                                    //showMinimize:false,
                                    //allowMaximize:false,
                                    //allowMinimize:false,
                                    //showStatusbar: false
                                });
                                this.Window.clientArea.setPadding(10);
                                this.Window.clientArea.setLayout(new qx.ui.layout.VBox(3));

                                this.Widget = new qx.ui.container.Composite(new qx.ui.layout.Grid().set({
                                    spacingX: 5,
                                    spacingY: 5
                                }));

                                //this.Widget.setTextColor("white");

                                this.Window.clientArea.add(this.Widget);
                            }

                            if (this.Window.isVisible()) {
                                this.Window.close();
                            } else {
                                MT_Base.openWindow(this.Window, WindowName);
                                this.setWidgetLabels();
                            }
                        } catch (e) {
                            console.log("MaelstromTools.Preferences.openWindow: ", e);
                        }
                    },

                    addFormElement: function (name, element) {
                        this.FormElements[name] = element;
                    },

                    setWidgetLabels: function () {
                        try {
                            this.readOptions();

                            this.FormElements = {};
                            this.Widget.removeAll();
                            var rowIdx = 1;
                            var colIdx = 1;

                            var chkAutoHideMissionTracker = new qx.ui.form.CheckBox(Lang.gt("Hide Mission Tracker")).set({
                                value: this.Settings[MaelstromTools.Preferences.AUTOHIDEMISSIONTRACKER] == 1
                            });
                            var chkUseDedicatedMainMenu = new qx.ui.form.CheckBox(Lang.gt("Use dedicated Main Menu (restart required)")).set({
                                value: this.Settings[MaelstromTools.Preferences.USEDEDICATEDMAINMENU] == 1
                            });
                            var chkShowLoot = new qx.ui.form.CheckBox(Lang.gt("Show lootable resources (restart required)")).set({
                                value: this.Settings[MaelstromTools.Preferences.SHOWLOOT] == 1/*,
                                 enabled: CCTAWrapperIsInstalled()*/
                            });
                            var chkCostsNextMCV = new qx.ui.form.CheckBox(Lang.gt("Show time to next MCV")).set({
                                value: this.Settings[MaelstromTools.Preferences.SHOWCOSTSFORNEXTMCV] == 1
                            });
                            MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, chkAutoHideMissionTracker, 2);
                            MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, chkUseDedicatedMainMenu, 2);
                            MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, chkShowLoot, 2);
                            MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, chkCostsNextMCV, 2);

                            var chkAutoCollectPackages = new qx.ui.form.CheckBox(Lang.gt("Autocollect packages")).set({
                                value: this.Settings[MaelstromTools.Preferences.AUTOCOLLECTPACKAGES] == 1
                            });
                            var chkAutoRepairUnits = new qx.ui.form.CheckBox(Lang.gt("Autorepair units")).set({
                                value: this.Settings[MaelstromTools.Preferences.AUTOREPAIRUNITS] == 1,
                                enabled: CCTAWrapperIsInstalled()
                            });
                            var chkAutoRepairBuildings = new qx.ui.form.CheckBox(Lang.gt("Autorepair buildings")).set({
                                value: this.Settings[MaelstromTools.Preferences.AUTOREPAIRBUILDINGS] == 1,
                                enabled: CCTAWrapperIsInstalled()
                            });

                            var spinnerChatHistoryLength = new qx.ui.form.Spinner().set({
                                minimum: 64,
                                maximum: 512,
                                value: this.Settings[MaelstromTools.Preferences.CHATHISTORYLENGTH]
                            });

                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx, Lang.gt("Chat history length") + " (" + spinnerChatHistoryLength.getMinimum() + " - " + spinnerChatHistoryLength.getMaximum() + ")");
                            MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx + 1, spinnerChatHistoryLength);

                            var spinnerAutoCollectTimer = new qx.ui.form.Spinner().set({
                                minimum: 1,
                                maximum: 60 * 6,
                                value: this.Settings[MaelstromTools.Preferences.AUTOCOLLECTTIMER]
                            });

                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx, Lang.gt("Automatic interval in minutes") + " (" + spinnerAutoCollectTimer.getMinimum() + " - " + spinnerAutoCollectTimer.getMaximum() + ")");
                            MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx + 1, spinnerAutoCollectTimer);
                            MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, chkAutoCollectPackages, 2);
                            MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, chkAutoRepairUnits, 2);
                            MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, chkAutoRepairBuildings, 2);

                            var applyButton = new qx.ui.form.Button(Lang.gt("Apply changes")).set({
                                appearance: "button-addpoints",
                                width: 120,
                                minWidth: 120,
                                maxWidth: 120
                            });
                            applyButton.addListener("execute", this.applyChanges, this);

                            var cancelButton = new qx.ui.form.Button(Lang.gt("Discard changes")).set({
                                appearance: "button-addpoints",
                                width: 120,
                                minWidth: 120,
                                maxWidth: 120
                            });
                            cancelButton.addListener("execute", function () {
                                this.Window.close();
                            }, this);

                            var resetButton = new qx.ui.form.Button(Lang.gt("Reset to default")).set({
                                appearance: "button-addpoints",
                                width: 120,
                                minWidth: 120,
                                maxWidth: 120
                            });
                            resetButton.addListener("execute", this.resetToDefault, this);

                            MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, resetButton);
                            colIdx = 1;
                            MaelstromTools.Util.addElement(this.Widget, rowIdx, colIdx++, cancelButton);
                            MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, applyButton);

                            this.addFormElement(MaelstromTools.Preferences.AUTOHIDEMISSIONTRACKER, chkAutoHideMissionTracker);
                            this.addFormElement(MaelstromTools.Preferences.USEDEDICATEDMAINMENU, chkUseDedicatedMainMenu);
                            this.addFormElement(MaelstromTools.Preferences.SHOWLOOT, chkShowLoot);
                            this.addFormElement(MaelstromTools.Preferences.SHOWCOSTSFORNEXTMCV, chkCostsNextMCV);
                            this.addFormElement(MaelstromTools.Preferences.AUTOCOLLECTPACKAGES, chkAutoCollectPackages);
                            this.addFormElement(MaelstromTools.Preferences.AUTOREPAIRUNITS, chkAutoRepairUnits);
                            this.addFormElement(MaelstromTools.Preferences.AUTOREPAIRBUILDINGS, chkAutoRepairBuildings);
                            this.addFormElement(MaelstromTools.Preferences.AUTOCOLLECTTIMER, spinnerAutoCollectTimer);
                            this.addFormElement(MaelstromTools.Preferences.CHATHISTORYLENGTH, spinnerChatHistoryLength);
                        } catch (e) {
                            console.log("MaelstromTools.Preferences.setWidgetLabels: ", e);
                        }
                    },

                    applyChanges: function () {
                        try {
                            var autoRunNeeded = false;
                            for (var idx in this.FormElements) {
                                //noinspection JSUnfilteredForInLoop
                                var element = this.FormElements[idx];
                                if (idx == MaelstromTools.Preferences.AUTOCOLLECTTIMER) {
                                    autoRunNeeded = (MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.AUTOCOLLECTTIMER, 0) != element.getValue());
                                }
                                if (idx == MaelstromTools.Preferences.CHATHISTORYLENGTH) {
                                    webfrontend.gui.chat.ChatWidget.recvbufsize = element.getValue();
                                }
                                //noinspection JSUnfilteredForInLoop
                                MaelstromTools.LocalStorage.set(idx, element.getValue());
                            }
                            this.readOptions();
                            if (autoRunNeeded) {
                                MT_Base.runAutoCollectTimer();
                            }
                            this.Window.close();
                        } catch (e) {
                            console.log("MaelstromTools.Preferences.applyChanges: ", e);
                        }
                    },

                    resetToDefault: function () {
                        try {
                            MaelstromTools.LocalStorage.clearAll();
                            this.setWidgetLabels();
                        } catch (e) {
                            console.log("MaelstromTools.Preferences.resetToDefault: ", e);
                        }
                    }
                }
            });

            // define DefaultObject
            qx.Class.define("MaelstromTools.DefaultObject", {
                type: "abstract",
                extend: qx.core.Object,
                members: {
                    Window: null,
                    Widget: null,
                    Cache: {}, //k null
                    IsTimerEnabled: true,

                    calc: function () {
                        try {
                            if (this.Window.isVisible()) {
                                this.updateCache();
                                this.setWidgetLabels();
                                if (this.IsTimerEnabled) {
                                    var self = this;
                                    setTimeout(function () {
                                        self.calc();
                                    }, MT_Base.timerInterval);
                                }
                            }
                        } catch (e) {
                            console.log("MaelstromTools.DefaultObject.calc: ", e);
                        }
                    },

                    openWindow: function (WindowName, WindowTitle) {
                        try {
                            if (!this.Window) {
                                this.Window = new qx.ui.window.Window(WindowTitle).set({
                                    resizable: false,
                                    showMaximize: false,
                                    showMinimize: false,
                                    allowMaximize: false,
                                    allowMinimize: false,
                                    showStatusbar: false
                                });
                                this.Window.setPadding(10);
                                this.Window.setLayout(new qx.ui.layout.VBox(3));

                                this.Widget = new qx.ui.container.Composite(new qx.ui.layout.Grid());
                                this.Widget.setTextColor("white");

                                this.Window.add(this.Widget);
                            }

                            if (this.Window.isVisible()) {
                                this.Window.close();
                            } else {
                                MT_Base.openWindow(this.Window, WindowName);
                                this.calc();
                            }
                        } catch (e) {
                            console.log("MaelstromTools.DefaultObject.openWindow: ", e);
                        }
                    }
                }
            });

            // define Production
            qx.Class.define("MaelstromTools.Production", {
                type: "singleton",
                extend: MaelstromTools.DefaultObject,
                members: {
                    updateCache: function (onlyForCity) {
                        try {
                            MT_Cache.updateCityCache();
                            var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
                            //this.Cache = Object();

                            for (var cname in MT_Cache.Cities) {
                                if (onlyForCity != null && onlyForCity != cname) {
                                    continue;
                                }
                                //noinspection JSUnfilteredForInLoop
                                var ncity = MT_Cache.Cities[cname].Object;
                                //noinspection JSUnfilteredForInLoop
                                if (typeof (this.Cache[cname]) !== 'object') { //noinspection JSUnfilteredForInLoop
                                    this.Cache[cname] = {};
                                }
                                //noinspection JSUnfilteredForInLoop
                                if (typeof (this.Cache[cname][MaelstromTools.Statics.Tiberium]) !== 'object') { //noinspection JSUnfilteredForInLoop
                                    this.Cache[cname][MaelstromTools.Statics.Tiberium] = {};
                                } // all have to be checked,
                                //noinspection JSUnfilteredForInLoop
                                if (typeof (this.Cache[cname][MaelstromTools.Statics.Crystal]) !== 'object') { //noinspection JSUnfilteredForInLoop
                                    this.Cache[cname][MaelstromTools.Statics.Crystal] = {};
                                } // this.Cache[cname] can be created inside different namespaces
                                //noinspection JSUnfilteredForInLoop
                                if (typeof (this.Cache[cname][MaelstromTools.Statics.Power]) !== 'object') { //noinspection JSUnfilteredForInLoop
                                    this.Cache[cname][MaelstromTools.Statics.Power] = {};
                                } // like the RepairTime etc... without those objs
                                //noinspection JSUnfilteredForInLoop
                                if (typeof (this.Cache[cname][MaelstromTools.Statics.Dollar]) !== 'object') { //noinspection JSUnfilteredForInLoop
                                    this.Cache[cname][MaelstromTools.Statics.Dollar] = {};
                                }

                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["ProductionStopped"] = ncity.get_IsGhostMode();
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["PackagesStopped"] = (ncity.get_hasCooldown() || ncity.get_IsGhostMode());
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname][MaelstromTools.Statics.Tiberium]["Delta"] = ncity.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Tiberium, false, false); // (production.d[ClientLib.Base.EResourceType.Tiberium]['Delta'] * serverTime.get_StepsPerHour());
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname][MaelstromTools.Statics.Tiberium]["ExtraBonusDelta"] = ncity.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Tiberium); //(production.d[ClientLib.Base.EResourceType.Tiberium]['ExtraBonusDelta'] * serverTime.get_StepsPerHour());
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname][MaelstromTools.Statics.Tiberium]["POI"] = alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Tiberium);
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname][MaelstromTools.Statics.Crystal]["Delta"] = ncity.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Crystal, false, false); //(production.d[ClientLib.Base.EResourceType.Crystal]['Delta'] * serverTime.get_StepsPerHour());
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname][MaelstromTools.Statics.Crystal]["ExtraBonusDelta"] = ncity.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Crystal); //(production.d[ClientLib.Base.EResourceType.Crystal]['ExtraBonusDelta'] * serverTime.get_StepsPerHour());
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname][MaelstromTools.Statics.Crystal]["POI"] = alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Crystal);
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname][MaelstromTools.Statics.Power]["Delta"] = ncity.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Power, false, false); //(production.d[ClientLib.Base.EResourceType.Power]['Delta'] * serverTime.get_StepsPerHour());
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname][MaelstromTools.Statics.Power]["ExtraBonusDelta"] = ncity.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Power); // (production.d[ClientLib.Base.EResourceType.Power]['ExtraBonusDelta'] * serverTime.get_StepsPerHour());
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname][MaelstromTools.Statics.Power]["POI"] = alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Power);
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname][MaelstromTools.Statics.Dollar]["Delta"] = ClientLib.Base.Resource.GetResourceGrowPerHour(ncity.get_CityCreditsProduction(), false); // (ncity.get_CityCreditsProduction()['Delta'] * serverTime.get_StepsPerHour());
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname][MaelstromTools.Statics.Dollar]["ExtraBonusDelta"] = ClientLib.Base.Resource.GetResourceBonusGrowPerHour(ncity.get_CityCreditsProduction(), false); // (ncity.get_CityCreditsProduction()['ExtraBonusDelta'] * serverTime.get_StepsPerHour());
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname][MaelstromTools.Statics.Dollar]["POI"] = 0;
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["BaseLevel"] = MaelstromTools.Wrapper.GetBaseLevel(ncity);
                                if (onlyForCity != null && onlyForCity == cname) { //noinspection JSUnfilteredForInLoop
                                    return this.Cache[cname];
                                }
                            }
                        } catch (e) {
                            console.log("MaelstromTools.Production.updateCache: ", e);
                        }
                    },

                    createProductionLabels2: function (rowIdx, colIdx, cityName, resourceType) {
                        try {
                            if (cityName == "-Total-") {
                                var Totals = Object();
                                Totals["Delta"] = 0;
                                Totals["ExtraBonusDelta"] = 0;
                                Totals["POI"] = 0;
                                Totals["Total"] = 0;

                                for (var cname in this.Cache) {
                                    //noinspection JSUnfilteredForInLoop
                                    Totals["Delta"] += this.Cache[cname][resourceType]['Delta'];
                                    //noinspection JSUnfilteredForInLoop
                                    Totals["ExtraBonusDelta"] += this.Cache[cname][resourceType]['ExtraBonusDelta'];
                                    //noinspection JSUnfilteredForInLoop
                                    Totals["POI"] += this.Cache[cname][resourceType]['POI'];
                                }
                                Totals["Total"] = Totals['Delta'] + Totals['ExtraBonusDelta'] + Totals['POI'];

                                rowIdx++;

                                MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact(Totals['Delta']), 80, 'right', 'bold');
                                MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact(Totals['ExtraBonusDelta']), 80, 'right', 'bold');
                                if (resourceType != MaelstromTools.Statics.Dollar) {
                                    MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact(Totals['POI']), 80, 'right', 'bold');
                                } else {
                                    rowIdx++;
                                }
                                MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact(Totals['Total']), 80, 'right', 'bold');
                            } else if (cityName == "-Labels-") {
                                MaelstromTools.Util.addImage(this.Widget, rowIdx++, colIdx, MaelstromTools.Util.getImage(resourceType));
                                MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, "Continuous", 100, 'left');
                                MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, "Bonus", 100, 'left');
                                if (resourceType != MaelstromTools.Statics.Dollar) {
                                    MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, "POI", 100, 'left');
                                } else {
                                    MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, "Total / BaseLevel", 100, 'left');
                                }
                                MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, "Total / h", 100, 'left');
                            } else {
                                var cityCache = this.Cache[cityName];
                                if (rowIdx > 2) {
                                    rowIdx++;
                                }
                                MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[resourceType]['Delta']), 80, 'right', null, ((cityCache["ProductionStopped"] || cityCache[resourceType]['Delta'] == 0) ? "red" : "white"));
                                MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[resourceType]['ExtraBonusDelta']), 80, 'right', null, ((cityCache["PackagesStopped"] || cityCache[resourceType]['ExtraBonusDelta'] == 0) ? "red" : "white"));
                                if (resourceType != MaelstromTools.Statics.Dollar) {
                                    MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[resourceType]['POI']), 80, 'right', null, (cityCache[resourceType]['POI'] == 0 ? "red" : "white"));
                                } else {
                                    MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact((cityCache[resourceType]['Delta'] + cityCache[resourceType]['ExtraBonusDelta'] + cityCache[resourceType]['POI']) / cityCache["BaseLevel"]), 80, 'right');
                                }
                                MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[resourceType]['Delta'] + cityCache[resourceType]['ExtraBonusDelta'] + cityCache[resourceType]['POI']), 80, 'right', 'bold');
                            }
                            return rowIdx;
                        } catch (e) {
                            console.log("MaelstromTools.Production.createProductionLabels2: ", e);
                        }
                    },

                    setWidgetLabels: function () {
                        try {
                            this.Widget.removeAll();

                            var rowIdx = 1;
                            var colIdx = 1;

                            rowIdx = this.createProductionLabels2(rowIdx, colIdx, "-Labels-", MaelstromTools.Statics.Tiberium);
                            rowIdx = this.createProductionLabels2(rowIdx, colIdx, "-Labels-", MaelstromTools.Statics.Crystal);
                            rowIdx = this.createProductionLabels2(rowIdx, colIdx, "-Labels-", MaelstromTools.Statics.Power);
                            rowIdx = this.createProductionLabels2(rowIdx, colIdx, "-Labels-", MaelstromTools.Statics.Dollar);

                            colIdx++;
                            for (var cityName in this.Cache) {
                                rowIdx = 1;
                                //noinspection JSUnfilteredForInLoop
                                MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, cityName, 80, 'right');

                                //noinspection JSUnfilteredForInLoop
                                rowIdx = this.createProductionLabels2(rowIdx, colIdx, cityName, MaelstromTools.Statics.Tiberium);
                                //noinspection JSUnfilteredForInLoop
                                rowIdx = this.createProductionLabels2(rowIdx, colIdx, cityName, MaelstromTools.Statics.Crystal);
                                //noinspection JSUnfilteredForInLoop
                                rowIdx = this.createProductionLabels2(rowIdx, colIdx, cityName, MaelstromTools.Statics.Power);
                                //noinspection JSUnfilteredForInLoop
                                rowIdx = this.createProductionLabels2(rowIdx, colIdx, cityName, MaelstromTools.Statics.Dollar);

                                //noinspection JSUnfilteredForInLoop
                                MaelstromTools.Util.addElement(this.Widget, rowIdx, colIdx++, MaelstromTools.Util.getAccessBaseButton(cityName));
                            }

                            rowIdx = 1;
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx, "Total / h", 80, 'right', 'bold');

                            rowIdx = this.createProductionLabels2(rowIdx, colIdx, "-Total-", MaelstromTools.Statics.Tiberium);
                            rowIdx = this.createProductionLabels2(rowIdx, colIdx, "-Total-", MaelstromTools.Statics.Crystal);
                            rowIdx = this.createProductionLabels2(rowIdx, colIdx, "-Total-", MaelstromTools.Statics.Power);
                            rowIdx = this.createProductionLabels2(rowIdx, colIdx, "-Total-", MaelstromTools.Statics.Dollar);
                        } catch (e) {
                            console.log("MaelstromTools.Production.setWidgetLabels: ", e);
                        }
                    }
                }
            });

            // define RepairTime
            qx.Class.define("MaelstromTools.RepairTime", {
                type: "singleton",
                extend: MaelstromTools.DefaultObject,
                members: {

                    updateCache: function () {
                        try {
                            MT_Cache.updateCityCache();
                            this.Cache = Object();

                            for (var cname in MT_Cache.Cities) {
                                //noinspection JSUnfilteredForInLoop
                                var ncity = MT_Cache.Cities[cname].Object;
                                var RepLargest = '';

                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname] = Object();
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["RepairTime"] = Object();
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["Repaircharge"] = Object();
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["Repaircharge"]["Smallest"] = 999999999;
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["RepairTime"]["Largest"] = 0;

                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Infantry] = ncity.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false);
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Vehicle] = ncity.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false);
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Aircraft] = ncity.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false);
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["RepairTime"]["Maximum"] = ncity.GetResourceMaxStorage(ClientLib.Base.EResourceType.RepairChargeInf);
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Infantry] = ncity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeInf);
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Vehicle] = ncity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeVeh);
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Aircraft] = ncity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeAir);

                                //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                if (this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Infantry] < this.Cache[cname]["Repaircharge"]["Smallest"]) {
                                    //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                    this.Cache[cname]["Repaircharge"]["Smallest"] = this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Infantry];
                                }
                                //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                if (this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Vehicle] < this.Cache[cname]["Repaircharge"]["Smallest"]) {
                                    //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                    this.Cache[cname]["Repaircharge"]["Smallest"] = this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Vehicle];
                                }
                                //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                if (this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Aircraft] < this.Cache[cname]["Repaircharge"]["Smallest"]) {
                                    //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                    this.Cache[cname]["Repaircharge"]["Smallest"] = this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Aircraft];
                                }

                                //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                if (this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Infantry] > this.Cache[cname]["RepairTime"]["Largest"]) {
                                    //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                    this.Cache[cname]["RepairTime"]["Largest"] = this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Infantry];
                                    RepLargest = "Infantry";
                                }
                                //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                if (this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Vehicle] > this.Cache[cname]["RepairTime"]["Largest"]) {
                                    //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                    this.Cache[cname]["RepairTime"]["Largest"] = this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Vehicle];
                                    RepLargest = "Vehicle";
                                }
                                //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                if (this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Aircraft] > this.Cache[cname]["RepairTime"]["Largest"]) {
                                    //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                    this.Cache[cname]["RepairTime"]["Largest"] = this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Aircraft];
                                    RepLargest = "Aircraft";
                                }

                                //PossibleAttacks and MaxAttacks fixes
                                var offHealth = ncity.GetOffenseConditionInPercent();
                                if (RepLargest !== '') {
                                    //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                    this.Cache[cname]["RepairTime"]["LargestDiv"] = this.Cache[cname]["RepairTime"][RepLargest];
                                    //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                    var i = Math.ceil(this.Cache[cname]["Repaircharge"].Smallest / this.Cache[cname]["RepairTime"].LargestDiv); //fix
                                    //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                    var j = this.Cache[cname]["Repaircharge"].Smallest / this.Cache[cname]["RepairTime"].LargestDiv;
                                    if (offHealth !== 100) {
                                        i--;
                                        i += '*';
                                    } // Decrease number of attacks by 1 when unit unhealthy. Additional visual info: asterisk when units aren't healthy
                                    //noinspection JSUnfilteredForInLoop
                                    this.Cache[cname]["RepairTime"]["PossibleAttacks"] = i;
                                    //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                    var k = this.Cache[cname]["RepairTime"].Maximum / this.Cache[cname]["RepairTime"].LargestDiv;
                                    //noinspection JSUnfilteredForInLoop
                                    this.Cache[cname]["RepairTime"]["MaxAttacks"] = Math.ceil(k); //fix
                                } else {
                                    //noinspection JSUnfilteredForInLoop
                                    this.Cache[cname]["RepairTime"]["LargestDiv"] = 0;
                                    //noinspection JSUnfilteredForInLoop
                                    this.Cache[cname]["RepairTime"]["PossibleAttacks"] = 0;
                                    //noinspection JSUnfilteredForInLoop
                                    this.Cache[cname]["RepairTime"]["MaxAttacks"] = 0;
                                }

                                var unitsData = ncity.get_CityUnitsData();
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["Base"] = Object();
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["Base"]["Level"] = MaelstromTools.Wrapper.GetBaseLevel(ncity);
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["Base"]["UnitLimit"] = ncity.GetBuildingSlotLimit(); //ncity.GetNumBuildings();
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["Base"]["TotalHeadCount"] = ncity.GetBuildingSlotCount();
                                //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                this.Cache[cname]["Base"]["FreeHeadCount"] = this.Cache[cname]["Base"]["UnitLimit"] - this.Cache[cname]["Base"]["TotalHeadCount"];
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["Base"]["HealthInPercent"] = ncity.GetBuildingsConditionInPercent();

                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["Offense"] = Object();
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["Offense"]["Level"] = (Math.floor(ncity.get_LvlOffense() * 100) / 100).toFixed(2);
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["Offense"]["UnitLimit"] = unitsData.get_UnitLimitOffense();
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["Offense"]["TotalHeadCount"] = unitsData.get_TotalOffenseHeadCount();
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["Offense"]["FreeHeadCount"] = unitsData.get_FreeOffenseHeadCount();
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["Offense"]["HealthInPercent"] = offHealth > 0 ? offHealth : 0;

                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["Defense"] = Object();
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["Defense"]["Level"] = (Math.floor(ncity.get_LvlDefense() * 100) / 100).toFixed(2);
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["Defense"]["UnitLimit"] = unitsData.get_UnitLimitDefense();
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["Defense"]["TotalHeadCount"] = unitsData.get_TotalDefenseHeadCount();
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["Defense"]["FreeHeadCount"] = unitsData.get_FreeDefenseHeadCount();
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["Defense"]["HealthInPercent"] = ncity.GetDefenseConditionInPercent() > 0 ? ncity.GetDefenseConditionInPercent() : 0;

                                //console.log(ncity.get_CityUnitsData().get_UnitLimitOffense() + " / " + ncity.get_CityUnitsData().get_TotalOffenseHeadCount() + " = " + ncity.get_CityUnitsData().get_FreeOffenseHeadCount());
                                //console.log(ncity.get_CityUnitsData().get_UnitLimitDefense() + " / " + ncity.get_CityUnitsData().get_TotalDefenseHeadCount() + " = " + ncity.get_CityUnitsData().get_FreeDefenseHeadCount());
                            }
                        } catch (e) {
                            console.log("MaelstromTools.RepairTime.updateCache: ", e);
                        }
                    },

                    setWidgetLabels: function () {
                        try {
                            this.Widget.removeAll();
                            var rowIdx = 1;

                            rowIdx = this.createOverviewLabels(rowIdx);
                            rowIdx = this.createRepairchargeLabels(rowIdx);
                        } catch (e) {
                            console.log("MaelstromTools.RepairTime.setWidgetLabels: ", e);
                        }
                    },

                    createRepairchargeLabels: function (rowIdx) {
                        try {
                            var colIdx = 2;
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx++, "Repaircharges", null, 'left', null, null, 3);
                            colIdx = 2;

                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Statics.Infantry, 60, 'right');
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Statics.Vehicle, 60, 'right');
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Statics.Aircraft, 60, 'right');
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Repairtime", 80, 'right');
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Attacks", 60, 'right');
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Next at", 80, 'right');
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Max+1 at", 80, 'right');

                            rowIdx++;
                            for (var cityName in this.Cache) {
                                //noinspection JSUnfilteredForInLoop
                                var cityCache = this.Cache[cityName];
                                if (cityCache.Offense.UnitLimit == 0) {
                                    continue;
                                }
                                colIdx = 1;
                                //noinspection JSUnfilteredForInLoop
                                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityName, 80, 'left');

                                // Skip bases with no armies
                                if (cityCache.Offense.UnitLimit > 0) {
                                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatTimespan(cityCache.RepairTime.Infantry), 60, 'right', null, (cityCache.RepairTime.Infantry == cityCache.RepairTime.LargestDiv ? "yellow" : "white"));
                                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatTimespan(cityCache.RepairTime.Vehicle), 60, 'right', null, (cityCache.RepairTime.Vehicle == cityCache.RepairTime.LargestDiv ? "yellow" : "white"));
                                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatTimespan(cityCache.RepairTime.Aircraft), 60, 'right', null, (cityCache.RepairTime.Aircraft == cityCache.RepairTime.LargestDiv ? "yellow" : "white"));
                                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatTimespan(cityCache.Repaircharge.Smallest), 80, 'right');
                                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.RepairTime.PossibleAttacks + " / " + cityCache.RepairTime.MaxAttacks, 60, 'right', null, (cityCache.Offense.HealthInPercent !== 100 ? 'red' : null)); // mark red when unhealthy
                                    var i = cityCache.RepairTime.LargestDiv * cityCache.RepairTime.PossibleAttacks;
                                    var j = cityCache.RepairTime.LargestDiv * cityCache.RepairTime.MaxAttacks;
                                    (i > 0) ? MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatTimespan(i), 80, 'right', null, (i > cityCache.RepairTime.Maximum ? "yellow" : "white")) : colIdx++; /// yellow if more than Maximum RT
                                    (j > 0) ? MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatTimespan(j), 80, 'right') : colIdx++;
                                } else {
                                    colIdx += 7;
                                }

                                colIdx += 4;
                                //noinspection JSUnfilteredForInLoop
                                MaelstromTools.Util.addElement(this.Widget, rowIdx, colIdx++, MaelstromTools.Util.getAccessBaseButton(cityName, PerforceChangelist >= 376877 ? ClientLib.Data.PlayerAreaViewMode.pavmPlayerOffense : webfrontend.gui.PlayArea.PlayArea.modes.EMode_PlayerOffense));
                                rowIdx += 2;
                            }

                            return rowIdx;
                        } catch (e) {
                            console.log("MaelstromTools.RepairTime.createRepairchargeLabels: ", e);
                        }
                    },

                    createOverviewLabels: function (rowIdx) {
                        try {
                            var colIdx = 2;

                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx, "Base", 60, 'right');
                            colIdx += 3;
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx, "Defense", 60, 'right');
                            colIdx += 3;
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx, "Army", 60, 'right');

                            rowIdx++;
                            colIdx = 2;

                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Level", 60, 'right');
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Buildings", 60, 'right');
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Health", 60, 'right');

                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Level", 60, 'right');
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Buildings", 60, 'right');
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Health", 60, 'right');

                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Level", 60, 'right');
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Units", 60, 'right');
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Health", 60, 'right');

                            rowIdx++;
                            for (var cityName in this.Cache) {
                                //noinspection JSUnfilteredForInLoop
                                var cityCache = this.Cache[cityName];
                                colIdx = 1;

                                //noinspection JSUnfilteredForInLoop
                                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityName, 80, 'left');

                                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Base.Level, 60, 'right');
                                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Base.TotalHeadCount + " / " + cityCache.Base.UnitLimit, 60, 'right', null, (cityCache.Base.FreeHeadCount >= 1 ? "red" : "white"));
                                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Base.HealthInPercent + "%", 60, 'right', null, (cityCache.Base.HealthInPercent < 25 ? "red" : (cityCache.Base.HealthInPercent < 100 ? "yellow" : "white")));

                                if (cityCache.Defense.UnitLimit > 0) {
                                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Defense.Level, 60, 'right');
                                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Defense.TotalHeadCount + " / " + cityCache.Defense.UnitLimit, 60, 'right', null, (cityCache.Defense.FreeHeadCount >= 5 ? "red" : (cityCache.Defense.FreeHeadCount >= 3 ? "yellow" : "white")));
                                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Defense.HealthInPercent + "%", 60, 'right', null, (cityCache.Defense.HealthInPercent < 25 ? "red" : (cityCache.Defense.HealthInPercent < 100 ? "yellow" : "white")));
                                } else {
                                    colIdx += 3;
                                }

                                // Skip bases with no armies
                                if (cityCache.Offense.UnitLimit > 0) {
                                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Offense.Level, 60, 'right');
                                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Offense.TotalHeadCount + " / " + cityCache.Offense.UnitLimit, 60, 'right', null, (cityCache.Offense.FreeHeadCount >= 10 ? "red" : (cityCache.Offense.FreeHeadCount >= 5 ? "yellow" : "white")));
                                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Offense.HealthInPercent + "%", 60, 'right', null, (cityCache.Offense.HealthInPercent < 25 ? "red" : (cityCache.Offense.HealthInPercent < 100 ? "yellow" : "white")));
                                } else {
                                    colIdx += 3;
                                }

                                //noinspection JSUnfilteredForInLoop
                                MaelstromTools.Util.addElement(this.Widget, rowIdx, colIdx++, MaelstromTools.Util.getAccessBaseButton(cityName));
                                rowIdx += 2;
                            }
                            return rowIdx;
                        } catch (e) {
                            console.log("MaelstromTools.RepairTime.createOverviewLabels: ", e);
                        }
                    }

                }
            });

            // define ResourceOverview
            qx.Class.define("MaelstromTools.ResourceOverview", {
                type: "singleton",
                extend: MaelstromTools.DefaultObject,
                members: {
                    Table: null,
                    Model: null,

                    updateCache: function () {
                        try {
                            MT_Cache.updateCityCache();
                            this.Cache = Object();

                            for (var cname in MT_Cache.Cities) {
                                //noinspection JSUnfilteredForInLoop
                                var ncity = MT_Cache.Cities[cname].Object;
                                var mtime = ClientLib.Data.MainData.GetInstance().get_Time();

                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname] = Object();
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname][MaelstromTools.Statics.Tiberium] = ncity.GetResourceCount(ClientLib.Base.EResourceType.Tiberium);
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname][MaelstromTools.Statics.Tiberium + "Max"] = ncity.GetResourceMaxStorage(ClientLib.Base.EResourceType.Tiberium);
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname][MaelstromTools.Statics.Tiberium + "Full"] = mtime.GetJSStepTime(ncity.GetResourceStorageFullStep(ClientLib.Base.EResourceType.Tiberium));
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname][MaelstromTools.Statics.Crystal] = ncity.GetResourceCount(ClientLib.Base.EResourceType.Crystal);
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname][MaelstromTools.Statics.Crystal + "Max"] = ncity.GetResourceMaxStorage(ClientLib.Base.EResourceType.Crystal);
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname][MaelstromTools.Statics.Crystal + "Full"] = mtime.GetJSStepTime(ncity.GetResourceStorageFullStep(ClientLib.Base.EResourceType.Crystal));
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname][MaelstromTools.Statics.Power] = ncity.GetResourceCount(ClientLib.Base.EResourceType.Power);
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname][MaelstromTools.Statics.Power + "Max"] = ncity.GetResourceMaxStorage(ClientLib.Base.EResourceType.Power);
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname][MaelstromTools.Statics.Power + "Full"] = mtime.GetJSStepTime(ncity.GetResourceStorageFullStep(ClientLib.Base.EResourceType.Power));
                            }

                        } catch (e) {
                            console.log("MaelstromTools.ResourceOverview.updateCache: ", e);
                        }
                    },

                    setWidgetLabels: function () {
                        try {
                            this.Widget.removeAll();

                            var first = true;
                            var rowIdx = 2;
                            var Totals = Object();
                            var colIdx = 1;
                            Totals[MaelstromTools.Statics.Tiberium] = 0;
                            Totals[MaelstromTools.Statics.Crystal] = 0;
                            Totals[MaelstromTools.Statics.Power] = 0;
                            Totals[MaelstromTools.Statics.Tiberium + "Max"] = 0;
                            Totals[MaelstromTools.Statics.Power + "Max"] = 0;

                            for (var cityName in this.Cache) {
                                //noinspection JSUnfilteredForInLoop
                                var cityCache = this.Cache[cityName];
                                Totals[MaelstromTools.Statics.Tiberium] += cityCache[MaelstromTools.Statics.Tiberium];
                                Totals[MaelstromTools.Statics.Crystal] += cityCache[MaelstromTools.Statics.Crystal];
                                Totals[MaelstromTools.Statics.Power] += cityCache[MaelstromTools.Statics.Power];
                                Totals[MaelstromTools.Statics.Tiberium + "Max"] += cityCache[MaelstromTools.Statics.Tiberium + 'Max'];
                                Totals[MaelstromTools.Statics.Power + "Max"] += cityCache[MaelstromTools.Statics.Power + 'Max'];

                                colIdx = 1;

                                //noinspection JSUnfilteredForInLoop
                                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityName, 100, 'left');
                                if (first) {
                                    MaelstromTools.Util.addLabel(this.Widget, 1, colIdx, 'Max. storage', 80, 'left');
                                }
                                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[MaelstromTools.Statics.Tiberium + 'Max']), 80, 'right');

                                if (first) {
                                    MaelstromTools.Util.addImage(this.Widget, 1, colIdx, MaelstromTools.Util.getImage(MaelstromTools.Statics.Tiberium));
                                }
                                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[MaelstromTools.Statics.Tiberium]), 60, 'right', null, (cityCache[MaelstromTools.Statics.Tiberium] >= cityCache[MaelstromTools.Statics.Tiberium + 'Max'] ? "red" : (cityCache[MaelstromTools.Statics.Tiberium] >= (0.75 * cityCache[MaelstromTools.Statics.Tiberium + 'Max']) ? "yellow" : "white")));

                                if (cityCache[MaelstromTools.Statics.Tiberium] < cityCache[MaelstromTools.Statics.Tiberium + 'Max']) {
                                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.GetDateTimeString(cityCache[MaelstromTools.Statics.Tiberium + 'Full']), 100, 'right', null, (cityCache[MaelstromTools.Statics.Tiberium] >= (0.75 * cityCache[MaelstromTools.Statics.Tiberium + 'Max']) ? "yellow" : "white"));
                                } else {
                                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Storage full!", 100, 'right', null, "red");
                                }
                                if (first) {
                                    MaelstromTools.Util.addImage(this.Widget, 1, colIdx, MaelstromTools.Util.getImage(MaelstromTools.Statics.Crystal));
                                }
                                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[MaelstromTools.Statics.Crystal]), 60, 'right', null, (cityCache[MaelstromTools.Statics.Crystal] >= cityCache[MaelstromTools.Statics.Crystal + 'Max'] ? "red" : (cityCache[MaelstromTools.Statics.Crystal] >= (0.75 * cityCache[MaelstromTools.Statics.Crystal + 'Max']) ? "yellow" : "white")));

                                if (cityCache[MaelstromTools.Statics.Crystal] < cityCache[MaelstromTools.Statics.Crystal + 'Max']) {
                                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.GetDateTimeString(cityCache[MaelstromTools.Statics.Crystal + 'Full']), 100, 'right', null, (cityCache[MaelstromTools.Statics.Crystal] >= (0.75 * cityCache[MaelstromTools.Statics.Crystal + 'Max']) ? "yellow" : "white"));
                                } else {
                                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Storage full!", 100, 'right', null, "red");
                                }

                                if (first) {
                                    MaelstromTools.Util.addImage(this.Widget, 1, colIdx, MaelstromTools.Util.getImage(MaelstromTools.Statics.Power));
                                }
                                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[MaelstromTools.Statics.Power]), 60, 'right', null, (cityCache[MaelstromTools.Statics.Power] >= cityCache[MaelstromTools.Statics.Power + 'Max'] ? "red" : (cityCache[MaelstromTools.Statics.Power] >= (0.75 * cityCache[MaelstromTools.Statics.Power + 'Max']) ? "yellow" : "white")));

                                if (first) {
                                    MaelstromTools.Util.addLabel(this.Widget, 1, colIdx, 'Storage', 80, 'left');
                                }
                                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[MaelstromTools.Statics.Power + 'Max']), 80, 'right');

                                if (cityCache[MaelstromTools.Statics.Power] < cityCache[MaelstromTools.Statics.Power + 'Max']) {
                                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.GetDateTimeString(cityCache[MaelstromTools.Statics.Power + 'Full']), 100, 'right', null, (cityCache[MaelstromTools.Statics.Power] >= (0.75 * cityCache[MaelstromTools.Statics.Power + 'Max']) ? "yellow" : "white"));
                                } else {
                                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Storage full!", 100, 'right', null, "red");
                                }


                                //noinspection JSUnfilteredForInLoop
                                MaelstromTools.Util.addElement(this.Widget, rowIdx, colIdx++, MaelstromTools.Util.getAccessBaseButton(cityName));
                                rowIdx++;
                                first = false;
                            }

                            colIdx = 1;
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Total resources", 100, 'left', 'bold');
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Totals[MaelstromTools.Statics.Tiberium + 'Max']), 80, 'right', 'bold');
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Totals[MaelstromTools.Statics.Tiberium]), 60, 'right', 'bold');
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, Math.round(Totals[MaelstromTools.Statics.Tiberium] / Totals[MaelstromTools.Statics.Tiberium + 'Max'] * 100) + '%', 100, 'center', 'bold');
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Totals[MaelstromTools.Statics.Crystal]), 60, 'right', 'bold');
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, Math.round(Totals[MaelstromTools.Statics.Crystal] / Totals[MaelstromTools.Statics.Tiberium + 'Max'] * 100) + '%', 100, 'center', 'bold');
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Totals[MaelstromTools.Statics.Power]), 60, 'right', 'bold');
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Totals[MaelstromTools.Statics.Power + 'Max']), 80, 'right', 'bold');
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, Math.round(Totals[MaelstromTools.Statics.Power] / Totals[MaelstromTools.Statics.Power + 'Max'] * 100) + '%', 100, 'center', 'bold');
                        } catch (e) {
                            console.log("MaelstromTools.ResourceOverview.setWidgetLabels: ", e);
                        }
                    }
                }
            });

            // define BaseStatus
            qx.Class.define("MaelstromTools.BaseStatus", {
                type: "singleton",
                extend: MaelstromTools.DefaultObject,
                members: {
                    CityMenuButtons: null,

                    //City.SetDedicatedSupport
                    //City.RecallDedicatedSupport
                    //City.get_SupportDedicatedBaseId
                    //System.String get_SupportDedicatedBaseName ()
                    updateCache: function () {
                        try {
                            MT_Cache.updateCityCache();
                            this.Cache = Object();

                            for (var cname in MT_Cache.Cities) {
                                //noinspection JSUnfilteredForInLoop
                                var ncity = MT_Cache.Cities[cname].Object;
                                var player = ClientLib.Data.MainData.GetInstance().get_Player();
                                var supportData = ncity.get_SupportData();
                                //System.String get_PlayerName ()
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname] = Object();
                                // Movement lock
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["HasCooldown"] = ncity.get_hasCooldown();
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["CooldownEnd"] = Math.max(ncity.get_MoveCooldownEndStep(), ncity.get_MoveRestictionEndStep());
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["MoveCooldownEnd"] = ncity.get_MoveCooldownEndStep();
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["MoveLockdownEnd"] = ncity.get_MoveRestictionEndStep();
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["IsProtected"] = ncity.get_isProtected();
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["ProtectionEnd"] = ncity.get_ProtectionEndStep();
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["IsProtected"] = ncity.get_ProtectionEndStep();
                                //noinspection JSUnfilteredForInLoop
                                this.Cache[cname]["IsAlerted"] = ncity.get_isAlerted();

                                // Supportweapon
                                if (supportData == null) {
                                    //noinspection JSUnfilteredForInLoop
                                    this.Cache[cname]["HasSupportWeapon"] = false;
                                } else {
                                    //noinspection JSUnfilteredForInLoop
                                    this.Cache[cname]["HasSupportWeapon"] = true;
                                    if (ncity.get_SupportDedicatedBaseId() > 0) {
                                        //noinspection JSUnfilteredForInLoop
                                        this.Cache[cname]["SupportedCityId"] = ncity.get_SupportDedicatedBaseId();
                                        //noinspection JSUnfilteredForInLoop
                                        this.Cache[cname]["SupportedCityName"] = ncity.get_SupportDedicatedBaseName();
                                        var coordId = ncity.get_SupportDedicatedBaseCoordId();
                                        //noinspection JSUnfilteredForInLoop
                                        this.Cache[cname]["SupportedCityX"] = (coordId & 0xffff);
                                        //noinspection JSUnfilteredForInLoop
                                        this.Cache[cname]["SupportedCityY"] = ((coordId >> 0x10) & 0xffff);

                                    } else { // prevent reference to undefined property ReferenceError
                                        //noinspection JSUnfilteredForInLoop
                                        this.Cache[cname]["SupportedCityId"] = null;
                                        //noinspection JSUnfilteredForInLoop
                                        this.Cache[cname]["SupportedCityName"] = null;
                                        //noinspection JSUnfilteredForInLoop
                                        this.Cache[cname]["SupportedCityX"] = null;
                                        //noinspection JSUnfilteredForInLoop
                                        this.Cache[cname]["SupportedCityY"] = null;
                                    }
                                    //noinspection JSUnfilteredForInLoop
                                    this.Cache[cname]["SupportRange"] = MaelstromTools.Wrapper.GetSupportWeaponRange(ncity.get_SupportWeapon());
                                    var techName = ClientLib.Base.Tech.GetTechNameFromTechId(supportData.get_Type(), player.get_Faction());
                                    //noinspection JSUnfilteredForInLoop
                                    this.Cache[cname]["SupportName"] = ClientLib.Base.Tech.GetProductionBuildingNameFromFaction(techName, player.get_Faction());
                                    //noinspection JSUnfilteredForInLoop
                                    this.Cache[cname]["SupportLevel"] = supportData.get_Level();
                                    //this.Cache[cname]["SupportBuilding"] = ncity.get_CityBuildingsData().GetUniqueBuildingByTechName(techName);
                                    //console.log(this.Cache[cname]["SupportBuilding"]);
                                }
                            }
                        } catch (e) {
                            console.log("MaelstromTools.BaseStatus.updateCache: ", e);
                        }
                    },


                    setWidgetLabels: function () {
                        try {
                            this.Widget.removeAll();
                            var rowIdx = 1;
                            var colIdx = 2;

                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Cooldown", 85, 'left');
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Protection", 85, 'left');
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Available weapon", 140, 'left');
                            MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Calibrated on", 140, 'left');

                            //colIdx++;
                            var rowIdxRecall = rowIdx;
                            var colIdxRecall = 0;
                            var supportWeaponCount = 0;

                            rowIdx++;
                            for (var cityName in this.Cache) {
                                //noinspection JSUnfilteredForInLoop
                                var cityCache = this.Cache[cityName];
                                colIdx = 1;

                                //noinspection JSUnfilteredForInLoop
                                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityName, 100, 'left', null, (cityCache.IsAlerted ? 'red' : null));

                                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.GetStepTime(cityCache.CooldownEnd), 70, 'right');
                                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.GetStepTime(cityCache.ProtectionEnd), 70, 'right');

                                if (!cityCache.HasSupportWeapon) {
                                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "none", 140, 'left');
                                    colIdx += 2;
                                } else {
                                    supportWeaponCount++;
                                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.SupportName + " (" + cityCache.SupportLevel + ")", 140, 'left');

                                    if (cityCache.SupportedCityId > 0) {
                                        MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.SupportedCityName, 140, 'left');
                                        colIdxRecall = colIdx;
                                        //noinspection JSUnfilteredForInLoop
                                        MaelstromTools.Util.addElement(this.Widget, rowIdx, colIdx++, this.getRecallButton(cityName));
                                    } else {
                                        colIdx += 2;
                                    }
                                }

                                //noinspection JSUnfilteredForInLoop
                                MaelstromTools.Util.addElement(this.Widget, rowIdx, colIdx++, MaelstromTools.Util.getAccessBaseButton(cityName));
                                //noinspection JSUnfilteredForInLoop
                                MaelstromTools.Util.addElement(this.Widget, rowIdx, colIdx++, MaelstromTools.Util.getFocusBaseButton(cityName));

                                rowIdx++;
                            }

                            if (supportWeaponCount > 0 && colIdxRecall > 0) {
                                MaelstromTools.Util.addElement(this.Widget, rowIdxRecall, colIdxRecall, this.getRecallAllButton());
                            }
                        } catch (e) {
                            console.log("MaelstromTools.BaseStatus.setWidgetLabels: ", e);
                        }
                    },

                    getRecallAllButton: function () {
                        var button = new qx.ui.form.Button("Recall all").set({
                            appearance: "button-text-small",
                            toolTipText: "Recall all support weapons",
                            width: 100,
                            height: 20
                        });
                        button.addListener("execute", function (e) {
                            MaelstromTools.Util.recallAllSupport();
                        }, this);
                        return button;
                    },

                    getRecallButton: function (cityName) {
                        var button = new qx.ui.form.Button("Recall").set({
                            appearance: "button-text-small",
                            toolTipText: "Recall support to " + cityName,
                            width: 100,
                            height: 20
                        });
                        button.addListener("execute", function (e) {
                            MaelstromTools.Util.recallSupport(cityName);
                        }, this);
                        return button;
                    }


                }
            });

            // define Statics
            qx.Class.define("MaelstromTools.Statics", {
                type: "static",
                statics: {
                    Tiberium: 'Tiberium',
                    Crystal: 'Crystal',
                    Power: 'Power',
                    Dollar: 'Dollar',
                    Research: 'Research',
                    Vehicle: "Vehicle",
                    Aircraft: "Aircraft",
                    Infantry: "Infantry",

                    LootTypeName: function (ltype) {
                        //noinspection JSConstructorReturnsPrimitive,JSConstructorReturnsPrimitive,JSConstructorReturnsPrimitive,JSConstructorReturnsPrimitive,JSConstructorReturnsPrimitive
                        switch (ltype) {
                            case ClientLib.Base.EResourceType.Tiberium:
                                return MaelstromTools.Statics.Tiberium;
                                break;
                            case ClientLib.Base.EResourceType.Crystal:
                                return MaelstromTools.Statics.Crystal;
                                break;
                            case ClientLib.Base.EResourceType.Power:
                                return MaelstromTools.Statics.Power;
                                break;
                            case ClientLib.Base.EResourceType.Gold:
                                return MaelstromTools.Statics.Dollar;
                                break;
                            default:
                                return "";
                                break;
                        }
                    }
                }
            });

            // define Util
            //ClientLib.Data.Cities.prototype.GetCityByCoord
            //ClientLib.Data.City.prototype.get_HasIncommingAttack
            qx.Class.define("MaelstromTools.Util", {
                type: "static",
                statics: {
                    ArrayUnique: function (array) {
                        var o = {};
                        var l = array.length;
                        var r = [];
                        for (var i = 0; i < l; i++) o[array[i]] = array[i];
                        for (var i1 in o) { //noinspection JSUnfilteredForInLoop
                            r.push(o[i1]);
                        }
                        return r;
                    },

                    ArraySize: function (array) //noinspection JSConstructorReturnsPrimitive
                    {
                        var size = 0;
                        for (var key in array)
                            if (array.hasOwnProperty(key)) size++;
                        return size;
                    },

                    addLabel: function (widget, rowIdx, colIdx, value, width, textAlign, font, color, colSpan) {
                        try {
                            var label = new qx.ui.basic.Label().set({
                                value: Lang.gt(value)
                            });
                            if (width) {
                                label.setWidth(width);
                            }
                            if (textAlign) {
                                label.setTextAlign(textAlign);
                            }
                            if (color) {
                                label.setTextColor(color);
                            }
                            if (font) {
                                label.setFont(font);
                            }
                            if (!colSpan || colSpan == 0) {
                                colSpan = 1;
                            }

                            widget.add(label, {
                                row: rowIdx,
                                column: colIdx,
                                colSpan: colSpan
                            });
                        } catch (e) {
                            console.log("MaelstromTools.Util.addLabel: ", e);
                        }
                    },

                    addElement: function (widget, rowIdx, colIdx, element, colSpan) {
                        try {
                            if (!colSpan || colSpan == 0) {
                                colSpan = 1;
                            }
                            widget.add(element, {
                                row: rowIdx,
                                column: colIdx,
                                colSpan: colSpan
                            });
                        } catch (e) {
                            console.log("MaelstromTools.Util.addElement: ", e);
                        }
                    },

                    addImage: function (widget, rowIdx, colIdx, image) {
                        try {
                            widget.add(image, {
                                row: rowIdx,
                                column: colIdx
                            });
                        } catch (e) {
                            console.log("MaelstromTools.Util.addImage: ", e);
                        }
                    },

                    getImage: function (name) {
                        var image = new qx.ui.basic.Image(MT_Base.images[name]);
                        image.setScale(true);
                        image.setWidth(20);
                        image.setHeight(20);
                        return image;
                    },

                    getAccessBaseButton: function (cityName, viewMode) {
                        try {
                            var cityButton = new qx.ui.form.Button(null, MT_Base.images["AccessBase"]).set({
                                appearance: "button-addpoints",
                                toolTipText: Lang.gt("Access") + " " + cityName,
                                width: 20,
                                height: 20,
                                marginLeft: 5
                            });
                            //noinspection JSCheckFunctionSignatures
                            cityButton.setUserData("cityId", MT_Cache.Cities[cityName].ID);
                            //noinspection JSCheckFunctionSignatures
                            cityButton.setUserData("viewMode", viewMode);
                            cityButton.addListener("execute", function (e) {
                                MaelstromTools.Util.accessBase(e.getTarget().getUserData("cityId"), e.getTarget().getUserData("viewMode"));
                            }, this);
                            return cityButton;
                        } catch (e) {
                            console.log("MaelstromTools.Util.getAccessBaseButton: ", e);
                        }
                    },

                    getFocusBaseButton: function (cityName) {
                        try {
                            var cityButton = new qx.ui.form.Button(null, MT_Base.images["FocusBase"]).set({
                                appearance: "button-addpoints",
                                toolTipText: Lang.gt("Focus on") + " " + cityName,
                                width: 20,
                                height: 20,
                                marginLeft: 5
                            });
                            //noinspection JSCheckFunctionSignatures
                            cityButton.setUserData("cityId", MT_Cache.Cities[cityName].ID);
                            cityButton.addListener("execute", function (e) {
                                MaelstromTools.Util.focusBase(e.getTarget().getUserData("cityId"));
                            }, this);
                            return cityButton;
                        } catch (e) {
                            console.log("MaelstromTools.Util.getFocusBaseButton: ", e);
                        }
                    },

                    accessBase: function (cityId, viewMode) {
                        try {
                            if (cityId > 0) {
                                var ncity = MaelstromTools.Wrapper.GetCity(cityId);

                                if (ncity != null && !ncity.get_IsGhostMode()) {
                                    if (viewMode) {
                                        webfrontend.gui.UtilView.openVisModeInMainWindow(viewMode, cityId, false);
                                    } else {
                                        webfrontend.gui.UtilView.openCityInMainWindow(cityId);
                                    }
                                }
                            }
                        } catch (e) {
                            console.log("MaelstromTools.Util.accessBase: ", e);
                        }
                    },
                    focusBase: function (cityId) {
                        try {
                            if (cityId > 0) {
                                var ncity = MaelstromTools.Wrapper.GetCity(cityId);

                                if (ncity != null && !ncity.get_IsGhostMode()) {
                                    webfrontend.gui.UtilView.centerCityOnRegionViewWindow(cityId);
                                }
                            }
                        } catch (e) {
                            console.log("MaelstromTools.Util.focusBase: ", e);
                        }
                    },

                    recallSupport: function (cityName) {
                        try {
                            var ncity = MT_Cache.Cities[cityName]["Object"];
                            ncity.RecallDedicatedSupport();
                        } catch (e) {
                            console.log("MaelstromTools.Util.recallSupport: ", e);
                        }
                    },

                    recallAllSupport: function () {
                        try {
                            MT_Cache.updateCityCache();
                            for (var cityName in MT_Cache.Cities) {
                                //noinspection JSUnfilteredForInLoop
                                var ncity = MT_Cache.Cities[cityName]["Object"];
                                ncity.RecallDedicatedSupport();
                            }
                        } catch (e) {
                            console.log("MaelstromTools.Util.recallAllSupport: ", e);
                        }
                    },

                    checkIfSupportIsAllowed: function (selectedBase) {
                        try {
                            if (selectedBase.get_VisObjectType() != ClientLib.Vis.VisObject.EObjectType.RegionCityType) {
                                return false;
                            }
                            return !(selectedBase.get_Type() != ClientLib.Vis.Region.RegionCity.ERegionCityType.Own && selectedBase.get_Type() != ClientLib.Vis.Region.RegionCity.ERegionCityType.Alliance);

                        } catch (e) {
                            console.log("MaelstromTools.Util.checkIfSupportIsAllowed: ", e);
                            return false;
                        }
                    },

                    calibrateWholeSupportOnSelectedBase: function () {
                        if (this.checkIfSupportIsAllowed(MT_Cache.SelectedBaseForMenu)) {
                            this.calibrateWholeSupport(MT_Cache.SelectedBaseForMenu);
                        }
                    },

                    calibrateWholeSupport: function (targetRegionCity) {
                        try {
                            MT_Cache.updateCityCache();
                            for (var cityName in MT_Cache.Cities) {
                                //noinspection JSUnfilteredForInLoop
                                var ncity = MT_Cache.Cities[cityName]["Object"];
                                //var targetCity = MaelstromTools.Wrapper.GetCity(targetCityId);
                                var weapon = ncity.get_SupportWeapon();

                                //console.log("checking support weapon for " + ncity.get_Name() + " calibrating on " + targetRegionCity.get_Name());

                                if (targetRegionCity != null && weapon != null) {
                                    //console.log("city at " + ncity.get_X() + " / " + ncity.get_Y());
                                    //console.log("targetRegionCity at " + targetRegionCity.get_RawX() + " / " + targetRegionCity.get_RawY());
                                    //var distance = ClientLib.Base.Util.CalculateDistance(ncity.get_X(), ncity.get_Y(), targetRegionCity.get_RawX(), targetRegionCity.get_RawY());
                                    var dx = (ncity.get_X() - targetRegionCity.get_RawX());
                                    var dy = (ncity.get_Y() - targetRegionCity.get_RawY());
                                    var distance = ((dx * dx) + (dy * dy));
                                    var range = MaelstromTools.Wrapper.GetSupportWeaponRange(weapon);
                                    //console.log("distance is " + distance);
                                    //console.log("range isy " + range*range);
                                    if (distance <= (range * range)) {
                                        ncity.SetDedicatedSupport(targetRegionCity.get_Id());
                                    }
                                }
                            }
                        } catch (e) {
                            console.log("MaelstromTools.Util.calibrateWholeSupport: ", e);
                        }
                    },

                    // visCity : ClientLib.Vis.Region.RegionObject
                    getResources: function (visCity) { // to verifier against PerforceChangelist>=376877
                        try {
                            var loot = {};
                            if (visCity.get_X() < 0 || visCity.get_Y() < 0) {
                                loot["LoadState"] = 0;
                                return loot;
                            }
                            var currentOwnCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();

                            var distance = ClientLib.Base.Util.CalculateDistance(currentOwnCity.get_X(), currentOwnCity.get_Y(), visCity.get_RawX(), visCity.get_RawY());
                            var maxAttackDistance = ClientLib.Data.MainData.GetInstance().get_Server().get_MaxAttackDistance();
                            if (distance > maxAttackDistance) {
                                loot["LoadState"] = -1;
                                return loot;
                            }

                            var ncity = MaelstromTools.Wrapper.GetCity(visCity.get_Id());
                            /* ClientLib.Data.CityBuildings */
                            //var cityBuildings = ncity.get_CityBuildingsData();
                            var cityUnits = ncity.get_CityUnitsData();

                            //var buildings = MaelstromTools.Wrapper.GetBuildings(cityBuildings);
                            var buildings = ncity.get_Buildings().d;
                            var defenseUnits = MaelstromTools.Wrapper.GetDefenseUnits(cityUnits);
                            //var defenseUnits = MaelstromTools.Wrapper.GetDefenseUnits();

                            /*for(var u in buildings) {
                             console.log(buildings[u].get_MdbBuildingId());
                             console.log("----------------");
                             }*/

                            var buildingLoot = MaelstromTools.Util.getResourcesPart(buildings);
                            //var buildingLoot2 = MaelstromTools.Util.getResourcesPart(this.collectBuildings(ncity));

                            var unitLoot = MaelstromTools.Util.getResourcesPart(defenseUnits);

                            loot[MaelstromTools.Statics.Tiberium] = buildingLoot[ClientLib.Base.EResourceType.Tiberium] + unitLoot[ClientLib.Base.EResourceType.Tiberium];
                            loot[MaelstromTools.Statics.Crystal] = buildingLoot[ClientLib.Base.EResourceType.Crystal] + unitLoot[ClientLib.Base.EResourceType.Crystal];
                            loot[MaelstromTools.Statics.Dollar] = buildingLoot[ClientLib.Base.EResourceType.Gold] + unitLoot[ClientLib.Base.EResourceType.Gold];
                            loot[MaelstromTools.Statics.Research] = buildingLoot[ClientLib.Base.EResourceType.ResearchPoints] + unitLoot[ClientLib.Base.EResourceType.ResearchPoints];
                            loot["Factor"] = loot[MaelstromTools.Statics.Tiberium] + loot[MaelstromTools.Statics.Crystal] + loot[MaelstromTools.Statics.Dollar] + loot[MaelstromTools.Statics.Research];
                            loot["CPNeeded"] = currentOwnCity.CalculateAttackCommandPointCostToCoord(ncity.get_X(), ncity.get_Y());
                            loot["LoadState"] = (loot["Factor"] > 0 ? 1 : 0);
                            loot["Total"] = loot[MaelstromTools.Statics.Research] + loot[MaelstromTools.Statics.Tiberium] + loot[MaelstromTools.Statics.Crystal] + loot[MaelstromTools.Statics.Dollar];

                            /*console.log("Building loot");
                             console.log( buildingLoot[ClientLib.Base.EResourceType.Tiberium] + " vs " +  buildingLoot2[ClientLib.Base.EResourceType.Tiberium]);
                             console.log( buildingLoot[ClientLib.Base.EResourceType.Crystal] + " vs " +  buildingLoot2[ClientLib.Base.EResourceType.Crystal]);
                             console.log( buildingLoot[ClientLib.Base.EResourceType.Gold] + " vs " +  buildingLoot2[ClientLib.Base.EResourceType.Gold]);
                             console.log( buildingLoot[ClientLib.Base.EResourceType.ResearchPoints] + " vs " +  buildingLoot2[ClientLib.Base.EResourceType.ResearchPoints]);
                             console.log("-------------");*/
                            return loot;
                        } catch (e) {
                            console.log("MaelstromTools.Util.getResources", e);
                        }
                    },


                    getResourcesPart: function (cityEntities) {
                        try {
                            var loot = [0, 0, 0, 0, 0, 0, 0, 0];
                            if (cityEntities == null) {
                                return loot;
                            }

                            var objcityEntities = [];
                            if (PerforceChangelist >= 376877) { //new
                                for (var o in cityEntities) { //noinspection JSUnfilteredForInLoop
                                    objcityEntities.push(cityEntities[o]);
                                }
                            } else { //old
                                for (var i1 = 0; i1 < cityEntities.length; i1++) objcityEntities.push(cityEntities[i1]);
                            }

                            for (var i = 0; i < objcityEntities.length; i++) {
                                var cityEntity = objcityEntities[i];
                                var unitLevelRequirements = MaelstromTools.Wrapper.GetUnitLevelRequirements(cityEntity);

                                for (var x = 0; x < unitLevelRequirements.length; x++) {
                                    loot[unitLevelRequirements[x].Type] += unitLevelRequirements[x].Count * cityEntity.get_HitpointsPercent();
                                    if (cityEntity.get_HitpointsPercent() < 1.0) {
                                        // destroyed

                                    }
                                }
                            }

                            return loot;
                        } catch (e) {
                            console.log("MaelstromTools.Util.getResourcesPart", e);
                        }
                    }


                }
            });

            // define Wrapper
            qx.Class.define("MaelstromTools.Wrapper", {
                type: "static",
                statics: {
                    GetStepTime: function (step, defaultString) {
                        if (!defaultString) {
                            defaultString = "";
                        }
                        var endTime = ClientLib.Data.MainData.GetInstance().get_Time().GetTimespanString(step, ClientLib.Data.MainData.GetInstance().get_Time().GetServerStep());
                        if (endTime == "00:00") {
                            return defaultString;
                        }
                        return endTime;
                    },

                    FormatNumbersCompact: function (value) {
                        if (PerforceChangelist >= 387751) { //new
                            return phe.cnc.gui.util.Numbers.formatNumbersCompact(value);
                        } else { //old
                            return webfrontend.gui.Util.formatNumbersCompact(value);
                        }
                    },

                    GetDateTimeString: function (value) {
                        return phe.cnc.Util.getDateTimeString(value);
                    },

                    FormatTimespan: function (value) {
                        return ClientLib.Vis.VisMain.FormatTimespan(value);
                    },

                    GetSupportWeaponRange: function (weapon) {
                        return weapon.r;
                    },

                    GetCity: function (cityId) {
                        return ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(cityId);
                    },

                    GetDefenseUnits: function (cityUnits) {
                        //GetDefenseUnits: function () {
                        if (PerforceChangelist >= 392583) { //endgame patch
                            return (cityUnits.get_DefenseUnits() != null ? cityUnits.get_DefenseUnits().d : null);
                        } else { //old
                            var defenseObjects = [];
                            for (var x = 0; x < 9; x++) {
                                for (var y = 0; y < 8; y++) {
                                    var defenseObject = ClientLib.Vis.VisMain.GetInstance().get_DefenseSetup().GetDefenseObjectFromPosition((x * ClientLib.Vis.VisMain.GetInstance().get_City().get_GridWidth()), (y * ClientLib.Vis.VisMain.GetInstance().get_City().get_GridHeight()));
                                    if (defenseObject !== null && defenseObject.get_CityEntity() !== null) {
                                        defenseObjects.push(defenseObject.get_UnitDetails());
                                    }
                                }
                            }
                            return defenseObjects;
                        }
                    },
                    GetUnitLevelRequirements: function (cityEntity) {
                        if (PerforceChangelist >= 376877) { //new
                            return (cityEntity.get_UnitLevelRepairRequirements() != null ? cityEntity.get_UnitLevelRepairRequirements() : null);
                        } else { //old
                            return (cityEntity.get_UnitLevelRequirements() != null ? cityEntity.get_UnitLevelRequirements() : null);
                        }
                    },

                    GetBaseLevel: function (ncity) //noinspection JSConstructorReturnsPrimitive
                    {
                        return (Math.floor(ncity.get_LvlBase() * 100) / 100).toFixed(2);
                    }

                }
            });

            // define LocalStorage
            qx.Class.define("MaelstromTools.LocalStorage", {
                type: "static",
                statics: {
                    isSupported: function () {
                        return typeof (Storage) !== "undefined";
                    },
                    set: function (key, value) {
                        try {
                            if (MaelstromTools.LocalStorage.isSupported()) {
                                localStorage["CCTA_MaelstromTools_Dev_DTeCH1" + key] = JSON.stringify(value);
                            }
                        } catch (e) {
                            console.log("MaelstromTools.LocalStorage.set: ", e);
                        }
                    },
                    get: function (key, defaultValueIfNotSet) {
                        try {
                            if (MaelstromTools.LocalStorage.isSupported()) {
                                if (localStorage["CCTA_MaelstromTools_Dev_DTeCH1" + key] != null && localStorage["CCTA_MaelstromTools_Dev_DTeCH1" + key] != 'undefined') {
                                    return JSON.parse(localStorage["CCTA_MaelstromTools_Dev_DTeCH1" + key]);
                                }
                            }
                        } catch (e) {
                            console.log("MaelstromTools.LocalStorage.get: ", e);
                        }
                        return defaultValueIfNotSet;
                    },
                    clearAll: function () {
                        try {
                            if (!MaelstromTools.LocalStorage.isSupported()) {
                                return;
                            }
                            for (var key in localStorage) {
                                //noinspection JSUnfilteredForInLoop
                                if (key.indexOf("CCTA_MaelstromTools_Dev_DTeCH1") == 0) {
                                    //noinspection JSUnfilteredForInLoop
                                    localStorage.removeItem(key);
                                }
                            }
                        } catch (e) {
                            console.log("MaelstromTools.LocalStorage.clearAll: ", e);
                        }
                    }
                }
            });

            // define Cache
            qx.Class.define("MaelstromTools.Cache", {
                type: "singleton",
                extend: qx.core.Object,
                members: {
                    CityCount: 0,
                    Cities: null,
                    SelectedBaseForMenu: null,
                    SelectedBaseResources: null,
                    SelectedBaseForLoot: null,

                    updateCityCache: function () {
                        try {
                            this.CityCount = 0;
                            this.Cities = Object();

                            var cities = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities();
                            for (var cindex in cities.d) {
                                this.CityCount++;
                                //noinspection JSUnfilteredForInLoop
                                var ncity = MaelstromTools.Wrapper.GetCity(cindex);
                                var ncityName = ncity.get_Name();
                                this.Cities[ncityName] = Object();
                                this.Cities[ncityName]["ID"] = cindex;
                                this.Cities[ncityName]["Object"] = ncity;
                            }
                        } catch (e) {
                            console.log("MaelstromTools.Cache.updateCityCache: ", e);
                        }
                    },

                    updateLoot: function (visCity) {
                        var cityId = visCity.get_Id();

                        if (this.SelectedBaseForLoot != null && cityId == this.SelectedBaseForLoot.get_Id() && this.SelectedBaseResources != null && this.SelectedBaseResources["LoadState"] > 0) {
                            return -2;
                        }
                        this.SelectedBaseForLoot = visCity;
                        this.SelectedBaseResources = MaelstromTools.Util.getResources(visCity);
                        return this.SelectedBaseResources["LoadState"];
                    }
                }
            });

            // define HuffyTools.ImageRender
            qx.Class.define("HuffyTools.ImageRender", {
                extend: qx.ui.table.cellrenderer.AbstractImage,
                construct: function (width, height) {
                    this.base(arguments);
                    if (width) {
                        this.__imageWidth = width;
                    }
                    if (height) {
                        this.__imageHeight = height;
                    }
                    this.__am = qx.util.AliasManager.getInstance();
                },
                members: {
                    __am: null,
                    __imageHeight: 16,
                    __imageWidth: 16,
                    // overridden
                    _identifyImage: function (cellInfo) {
                        var imageHints = {
                            imageWidth: this.__imageWidth,
                            imageHeight: this.__imageHeight
                        };
                        if (cellInfo.value == "") {
                            imageHints.url = null;
                        } else {
                            imageHints.url = this.__am.resolve(cellInfo.value);
                        }
                        imageHints.tooltip = cellInfo.tooltip;
                        return imageHints;
                    }
                },
                destruct: function () {
                    this.__am = null;
                }
            });

            // define HuffyTools.ReplaceRender
            qx.Class.define("HuffyTools.ReplaceRender", {
                extend: qx.ui.table.cellrenderer.Default,
                properties: {
                    replaceFunction: {
                        check: "Function",
                        nullable: true,
                        init: null
                    }
                },
                members: {
                    // overridden
                    _getContentHtml: function (cellInfo) {
                        var value = cellInfo.value;
                        var replaceFunc = this.getReplaceFunction();
                        // use function
                        if (replaceFunc) {
                            cellInfo.value = replaceFunc(value);
                        }
                        return qx.bom.String.escape(this._formatValue(cellInfo));
                    }
                }
            });

            qx.Class.define("HuffyTools.CityCheckBox", {
                extend: qx.ui.form.CheckBox,
                members: {
                    HT_CityID: null
                }
            });

            // define HuffyTools.UpgradePriorityGUI
            qx.Class.define("HuffyTools.UpgradePriorityGUI", {
                type: "singleton",
                extend: MaelstromTools.DefaultObject,
                members: {
                    HT_TabView: null,
                    HT_Options: null,
                    HT_ShowOnlyTopBuildings: null,
                    HT_ShowOnlyAffordableBuildings: null,
                    HT_CityBuildings: null,
                    HT_Pages: null,
                    HT_Tables: null,
                    HT_Models: null,
                    HT_SelectedResourceType: null,
                    BuildingList: null,
                    upgradeInProgress: null,
                    upgradeToDoType: null,
                    upgradeToDo: null,
                    init: function () {
                        /*
                         Done:
                         - Added cost per gain to the lists
                         - Added building coordinates to the lists
                         - Only display the top affordable and not affordable building
                         - Persistent filter by city, top and affordable per resource type
                         - Reload onTabChange for speed optimization
                         - Estimated time until upgrade is affordable

                         ToDo:
                         - let the user decide to sort by colums he like i.e. timefactor or cost/gain and save it in the configuration
                         - integrate buttons to transfer resources ?

                         */
                        try {
                            this.HT_SelectedResourceType = -1;
                            this.IsTimerEnabled = false;
                            this.upgradeInProgress = false;

                            this.HT_TabView = new qx.ui.tabview.TabView();
                            this.HT_TabView.set({
                                contentPadding: 0,
                                appearance: "tabview",
                                margin: 5,
                                barPosition: 'left'
                            });
                            this.Widget = new qx.ui.tabview.Page("UpgradePriority");
                            this.Widget.setPadding(0);
                            this.Widget.setMargin(0);
                            this.Widget.setBackgroundColor("#BEC8CF");
                            this.Widget.setLayout(new qx.ui.layout.VBox(2));
                            //this.Widget.add(this.HT_Options);
                            this.Widget.add(this.HT_TabView, {
                                flex: 1
                            });
                            this.Window.setPadding(0);
                            this.Window.set({
                                resizable: true
                            });

                            this.Window.removeAll();
                            this.Window.add(this.Widget);

                            this.BuildingList = [];
                            this.HT_Models = [];
                            this.HT_Tables = [];
                            this.HT_Pages = [];
                            var eventType = "cellTap";
                            if (PerforceChangelist >= 436669) { // 15.3 patch
                                eventType = "cellTap";
                            } else { //old
                                eventType = "cellClick";
                            }

                            this.createTabPage(ClientLib.Base.EResourceType.Tiberium);
                            this.createTable(ClientLib.Base.EResourceType.Tiberium);
                            this.HT_Tables[ClientLib.Base.EResourceType.Tiberium].addListener(eventType, function (e) {
                                this.upgradeBuilding(e, ClientLib.Base.EResourceType.Tiberium);
                            }, this);


                            this.createTabPage(ClientLib.Base.EResourceType.Crystal);
                            this.createTable(ClientLib.Base.EResourceType.Crystal);
                            this.HT_Tables[ClientLib.Base.EResourceType.Crystal].addListener(eventType, function (e) {
                                this.upgradeBuilding(e, ClientLib.Base.EResourceType.Crystal);
                            }, this);

                            this.createTabPage(ClientLib.Base.EResourceType.Power);
                            this.createTable(ClientLib.Base.EResourceType.Power);
                            this.HT_Tables[ClientLib.Base.EResourceType.Power].addListener(eventType, function (e) {
                                this.upgradeBuilding(e, ClientLib.Base.EResourceType.Power);
                            }, this);

                            this.createTabPage(ClientLib.Base.EResourceType.Gold);
                            this.createTable(ClientLib.Base.EResourceType.Gold);
                            this.HT_Tables[ClientLib.Base.EResourceType.Gold].addListener(eventType, function (e) {
                                this.upgradeBuilding(e, ClientLib.Base.EResourceType.Gold);
                            }, this);


                            MT_Cache.updateCityCache();
                            this.HT_Options = [];
                            this.HT_ShowOnlyTopBuildings = [];
                            this.HT_ShowOnlyAffordableBuildings = [];
                            this.HT_CityBuildings = [];
                            for (var mPage in this.HT_Pages) {
                                //noinspection JSUnfilteredForInLoop
                                this.createOptions(mPage);
                                //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                this.HT_Pages[mPage].add(this.HT_Options[mPage]);
                                //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                this.HT_Pages[mPage].add(this.HT_Tables[mPage], {
                                    flex: 1
                                });
                                //noinspection JSUnfilteredForInLoop
                                this.HT_TabView.add(this.HT_Pages[mPage]);
                            }

                            // Zeigen wir Dollars an !
                            this.HT_TabView.setSelection([this.HT_TabView.getChildren()[2]]);
                            this.HT_SelectedResourceType = ClientLib.Base.EResourceType.Gold;
                        } catch (e) {
                            console.log("HuffyTools.UpgradePriority.init: ", e);
                        }
                    },
                    createOptions: function (eType) {
                        var oBox = new qx.ui.layout.Flow();
                        var oOptions = new qx.ui.container.Composite(oBox);
                        oOptions.setMargin(5);
                        this.HT_ShowOnlyTopBuildings[eType] = new qx.ui.form.CheckBox(Lang.gt("display only top buildings"));
                        this.HT_ShowOnlyTopBuildings[eType].setMargin(5);
                        this.HT_ShowOnlyTopBuildings[eType].setValue(MaelstromTools.LocalStorage.get("UGL_TOPBUILDINGS_" + eType, true));
                        this.HT_ShowOnlyTopBuildings[eType].addListener("execute", this.CBChanged, this);
                        oOptions.add(this.HT_ShowOnlyTopBuildings[eType], {
                            left: 10,
                            top: 10
                        });
                        this.HT_ShowOnlyAffordableBuildings[eType] = new qx.ui.form.CheckBox(Lang.gt("display only affordable buildings"));
                        this.HT_ShowOnlyAffordableBuildings[eType].setMargin(5);
                        this.HT_ShowOnlyAffordableBuildings[eType].setValue(MaelstromTools.LocalStorage.get("UGL_AFFORDABLE_" + eType, true));
                        this.HT_ShowOnlyAffordableBuildings[eType].addListener("execute", this.CBChanged, this);
                        oOptions.add(this.HT_ShowOnlyAffordableBuildings[eType], {
                            left: 10,
                            top: 10,
                            lineBreak: true
                        });
                        this.HT_CityBuildings[eType] = [];
                        for (var cname in MT_Cache.Cities) {
                            //noinspection JSUnfilteredForInLoop
                            var oCity = MT_Cache.Cities[cname].Object;
                            //noinspection JSUnfilteredForInLoop
                            var oCityBuildings = new HuffyTools.CityCheckBox(cname);
                            oCityBuildings.HT_CityID = oCity.get_Id();
                            oCityBuildings.setMargin(5);
                            oCityBuildings.setValue(MaelstromTools.LocalStorage.get("UGL_CITYFILTER_" + eType + "_" + oCity.get_Id(), true));
                            oCityBuildings.addListener("execute", this.CBChanged, this);
                            oOptions.add(oCityBuildings, {
                                left: 10,
                                top: 10
                            });
                            //noinspection JSUnfilteredForInLoop
                            this.HT_CityBuildings[eType][cname] = oCityBuildings;
                        }
                        var buttonUpgradeAll = new qx.ui.form.Button("UpgradeAll").set({
                            width: 80,
                            appearance: "button-text-small",
                            toolTipText: "Upgrade all filtered buildings"
                        });
                        buttonUpgradeAll.addListener("execute", function (e) {
                            this.upgradeAll(e, eType);
                        }, this);
                        oOptions.add(buttonUpgradeAll, {
                            left: 10,
                            top: 10
                        });
                        this.HT_Options[eType] = oOptions;
                    },
                    createTable: function (eType) {
                        try {
                            this.HT_Models[eType] = new qx.ui.table.model.Simple();
                            this.HT_Models[eType].setColumns(["ID", Lang.gt("City"), Lang.gt("Type (coord)"), Lang.gt("to Level"), Lang.gt("Gain/h"), Lang.gt("Factor"), Lang.gt("Tiberium"), Lang.gt("Power"), Lang.gt("Tib/gain"), Lang.gt("Pow/gain"), Lang.gt("ETA"), Lang.gt("Upgrade"), "State"]);
                            this.HT_Tables[eType] = new qx.ui.table.Table(this.HT_Models[eType]);
                            this.HT_Tables[eType].setColumnVisibilityButtonVisible(false);
                            this.HT_Tables[eType].setColumnWidth(0, 0);
                            this.HT_Tables[eType].setColumnWidth(1, 90);
                            this.HT_Tables[eType].setColumnWidth(2, 120);
                            this.HT_Tables[eType].setColumnWidth(3, 55);
                            this.HT_Tables[eType].setColumnWidth(4, 70);
                            this.HT_Tables[eType].setColumnWidth(5, 60);
                            this.HT_Tables[eType].setColumnWidth(6, 70);
                            this.HT_Tables[eType].setColumnWidth(7, 70);
                            this.HT_Tables[eType].setColumnWidth(8, 70);
                            this.HT_Tables[eType].setColumnWidth(9, 70);
                            this.HT_Tables[eType].setColumnWidth(10, 70);
                            this.HT_Tables[eType].setColumnWidth(11, 40);
                            this.HT_Tables[eType].setColumnWidth(12, 0);
                            var tcm = this.HT_Tables[eType].getTableColumnModel();
                            tcm.setColumnVisible(0, false);
                            tcm.setColumnVisible(12, false);
                            tcm.setDataCellRenderer(4, new qx.ui.table.cellrenderer.Number().set({
                                numberFormat: new qx.util.format.NumberFormat().set({
                                    maximumFractionDigits: 2,
                                    minimumFractionDigits: 2
                                })
                            }));
                            tcm.setDataCellRenderer(5, new qx.ui.table.cellrenderer.Number().set({
                                numberFormat: new qx.util.format.NumberFormat().set({
                                    maximumFractionDigits: 5,
                                    minimumFractionDigits: 5
                                })
                            }));
                            tcm.setDataCellRenderer(6, new HuffyTools.ReplaceRender().set({
                                ReplaceFunction: this.formatTiberiumAndPower
                            }));
                            tcm.setDataCellRenderer(7, new HuffyTools.ReplaceRender().set({
                                ReplaceFunction: this.formatTiberiumAndPower
                            }));
                            tcm.setDataCellRenderer(11, new HuffyTools.ImageRender(40, 20));
                        } catch (e) {
                            console.log("HuffyTools.UpgradePriority.createTable: ", e);
                        }
                    },
                    createTabPage: function (resource_type) {
                        try {
                            var sName = MaelstromTools.Statics.LootTypeName(resource_type);
                            var oRes = new qx.ui.tabview.Page(Lang.gt(sName), MT_Base.images[sName]);
                            oRes.setLayout(new qx.ui.layout.VBox(2));
                            oRes.setPadding(5);
                            var btnTab = oRes.getChildControl("button");
                            btnTab.resetWidth();
                            btnTab.resetHeight();
                            btnTab.set({
                                show: "icon",
                                margin: 0,
                                padding: 0,
                                toolTipText: sName
                            });
                            btnTab.addListener("execute", this.TabChanged, [this, resource_type]);
                            this.HT_Pages[resource_type] = oRes;
                            return oRes;
                        } catch (e) {
                            console.log("HuffyTools.UpgradePriority.createTabPage: ", e);
                        }
                    },

                    TabChanged: function (e) {
                        try {
                            this[0].HT_SelectedResourceType = this[1];
                            this[0].UpgradeCompleted(null, null);
                        } catch (e) {
                            console.log("HuffyTools.UpgradePriority.TabChanged: ", e);
                        }
                    },
                    upgradeAll: function (e, eResourceType) {
                        try {
                            if (this.upgradeToDo == null) {
                                this.upgradeToDoType = parseInt(eResourceType);
                                this.upgradeToDo = this.HT_Models[eResourceType].getData();
                            }
                            if (this.upgradeToDo.length > 0) {
                                this.upgradeInProgress = true;
                                var current = this.upgradeToDo.pop();
                                var buildingID = current[0];
                                var iState = parseInt(current[12]);
                                if (iState != 1) {
                                    return;
                                }
                                if (buildingID in this.BuildingList) {
                                    if (PerforceChangelist >= 382917) { //new
                                        ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", this.BuildingList[buildingID], phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, this.upgradeAllCompleted), null, true);
                                    } else { //old
                                        ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", this.BuildingList[buildingID], webfrontend.Util.createEventDelegate(ClientLib.Net.CommandResult, this, this.upgradeAllCompleted), null, true);
                                    }
                                }
                            } else {
                                this.upgradeToDo = null;
                            }
                        } catch (e) {
                            console.log("HuffyTools.UpgradePriority.upgradeBuilding: ", e);
                        }
                    },
                    upgradeAllCompleted: function (context, result) {
                        var self = this;
                        if (this.upgradeToDo.length > 0) {
                            setTimeout(function () {
                                self.upgradeAll(self.upgradeToDoType);
                            }, 100);
                        } else {
                            this.upgradeToDoType = null;
                            this.upgradeToDo = null;
                            setTimeout(function () {
                                self.calc();
                            }, 100);
                            this.upgradeInProgress = false;
                        }
                    },
                    upgradeBuilding: function (e, eResourceType) {
                        if (this.upgradeInProgress == true) {
                            console.log("upgradeBuilding:", "upgrade in progress !");
                            return;
                        }
                        try {
                            if (e.getColumn() == 11) {
                                var buildingID = this.HT_Models[eResourceType].getValue(0, e.getRow());
                                var iState = parseInt(this.HT_Models[eResourceType].getValue(12, e.getRow()));
                                if (iState != 1) {
                                    return;
                                }
                                if (buildingID in this.BuildingList) {
                                    this.upgradeInProgress = true;
                                    if (PerforceChangelist >= 382917) { //new
                                        ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", this.BuildingList[buildingID], phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, this.UpgradeCompleted), null, true);
                                    } else { //old
                                        ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", this.BuildingList[buildingID], webfrontend.Util.createEventDelegate(ClientLib.Net.CommandResult, this, this.UpgradeCompleted), null, true);
                                    }
                                }
                            }
                        } catch (e) {
                            console.log("HuffyTools.UpgradePriority.upgradeBuilding: ", e);
                        }
                    },
                    UpgradeCompleted: function (context, result) {
                        /* Dodgy solution to get upgrade priority working.
                         Upgrades in the game were reworked in the February patch and again in the March patch.
                         In the past resources were deducted from the base immediately when the upgrade command was sent, but now it is done moments after the upgrade has been completed.
                         When running updateCache() immediately after the upgrade it will still return with the pre-upgrade resource amounts.
                         A one second delay will work as a temporary solution giving the base enough time to update to reflect the new resource amounts.
                         A better solution could be to monitor for the reduction in resources after an upgrade and once it takes place only then update the cache.
                         */
                        var self = this;
                        setTimeout(function () {
                            self.calc();
                        }, 1000);
                        //this.calc();
                        this.upgradeInProgress = false;
                    },
                    CBChanged: function (e) {
                        this.UpgradeCompleted(null, null);
                    },
                    formatTiberiumAndPower: function (oValue) {
                        if (PerforceChangelist >= 387751) { //new
                            return phe.cnc.gui.util.Numbers.formatNumbersCompact(oValue);
                        } else { //old
                            return webfrontend.gui.Util.formatNumbersCompact(oValue);
                        }
                    },
                    updateCache: function () {
                        try {
                            if (!this.HT_TabView) {
                                this.init();
                            }
                            var eType = this.HT_SelectedResourceType;
                            var bTop = this.HT_ShowOnlyTopBuildings[eType].getValue();
                            MaelstromTools.LocalStorage.set("UGL_TOPBUILDINGS_" + eType, bTop);
                            var bAffordable = this.HT_ShowOnlyAffordableBuildings[eType].getValue();
                            MaelstromTools.LocalStorage.set("UGL_AFFORDABLE_" + eType, bAffordable);
                            var oCityFilter = [];
                            for (var cname in this.HT_CityBuildings[eType]) {
                                //noinspection JSUnfilteredForInLoop
                                var oCityBuildings = this.HT_CityBuildings[eType][cname];
                                var bFilterBuilding = oCityBuildings.getValue();
                                MaelstromTools.LocalStorage.set("UGL_CITYFILTER_" + eType + "_" + oCityBuildings.HT_CityID, bFilterBuilding);
                                //noinspection JSUnfilteredForInLoop
                                oCityFilter[cname] = bFilterBuilding;
                            }
                            HuffyTools.UpgradePriority.getInstance().collectData(bTop, bAffordable, oCityFilter, eType);
                        } catch (e) {
                            console.log("HuffyTools.UpgradePriority.updateCache: ", e);
                        }
                    },
                    setWidgetLabels: function () {
                        try {
                            var HuffyCalc = HuffyTools.UpgradePriority.getInstance();
                            var UpgradeList = HuffyCalc.Cache;

                            for (var eResourceType in UpgradeList) {
                                //var eResourceType = MaelstromTools.Statics.LootTypeName(eResourceName);
                                var rowData = [];

                                //noinspection JSUnfilteredForInLoop
                                this.HT_Models[eResourceType].setData([]);

                                //noinspection JSUnfilteredForInLoop
                                for (var mCity in UpgradeList[eResourceType]) {
                                    //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                    for (var mBuilding in UpgradeList[eResourceType][mCity]) {
                                        //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                        var UpItem = UpgradeList[eResourceType][mCity][mBuilding];
                                        if (typeof (UpItem.Type) == "undefined") {
                                            continue;
                                        }
                                        if (!(mBuilding in this.BuildingList)) {
                                            this.BuildingList[UpItem.ID] = UpItem.Building;
                                        }
                                        var iTiberiumCosts = 0;
                                        if (ClientLib.Base.EResourceType.Tiberium in UpItem.Costs) {
                                            iTiberiumCosts = UpItem.Costs[ClientLib.Base.EResourceType.Tiberium];
                                        }
                                        var iTiberiumPerGain = 0;
                                        if (ClientLib.Base.EResourceType.Tiberium in UpItem.Costs) {
                                            iTiberiumPerGain = UpItem.Costs[ClientLib.Base.EResourceType.Tiberium] / UpItem.GainPerHour;
                                        }
                                        var iPowerCosts = 0;
                                        if (ClientLib.Base.EResourceType.Power in UpItem.Costs) {
                                            iPowerCosts = UpItem.Costs[ClientLib.Base.EResourceType.Power];
                                        }
                                        var iPowerPerGain = 0;
                                        if (ClientLib.Base.EResourceType.Power in UpItem.Costs) {
                                            iPowerPerGain = UpItem.Costs[ClientLib.Base.EResourceType.Power] / UpItem.GainPerHour;
                                        }
                                        var img = MT_Base.images["UpgradeBuilding"];
                                        if (UpItem.Affordable == false) {
                                            img = "";
                                        }
                                        var sType = UpItem.Type;
                                        sType = sType + "(" + UpItem.PosX + ":" + UpItem.PosY + ")";
                                        var iETA = 0;
                                        if (UpItem.TimeTillUpgradable[ClientLib.Base.EResourceType.Tiberium] > 0) {
                                            iETA = UpItem.TimeTillUpgradable[ClientLib.Base.EResourceType.Tiberium];
                                        }
                                        if (UpItem.TimeTillUpgradable[ClientLib.Base.EResourceType.Power] > iETA) {
                                            iETA = UpItem.TimeTillUpgradable[ClientLib.Base.EResourceType.Power];
                                        }
                                        var sETA = "";
                                        if (iETA > 0) {
                                            sETA = ClientLib.Vis.VisMain.FormatTimespan(iETA);
                                        }
                                        var iState = 0;
                                        if (UpItem.Affordable == true) {
                                            iState = 1;
                                        } else if (UpItem.AffordableByTransfer == true) {
                                            iState = 2;
                                        } else {
                                            iState = 3;
                                        }
                                        //noinspection JSUnfilteredForInLoop
                                        rowData.push([UpItem.ID, mCity, sType, UpItem.Level, UpItem.GainPerHour, UpItem.Ticks, iTiberiumCosts, iPowerCosts, iTiberiumPerGain, iPowerPerGain, sETA, img, iState]);
                                    }
                                }
                                //noinspection JSUnfilteredForInLoop
                                this.HT_Models[eResourceType].setData(rowData);
                            }
                        } catch (e) {
                            console.log("HuffyTools.UpgradePriority.setWidgetLabels: ", e);
                        }
                    }
                }
            });

            // define HuffyTools.UpgradePriority
            qx.Class.define("HuffyTools.UpgradePriority", {
                type: "singleton",
                extend: qx.core.Object,
                members: {
                    list_units: null,
                    list_buildings: null,

                    comparePrio: function (elem1, elem2) {
                        if (elem1.Ticks < elem2.Ticks) return -1;
                        if (elem1.Ticks > elem2.Ticks) return 1;
                        return 0;
                    },
                    getPrioList: function (city, arTechtypes, eModPackageSize, eModProduction, bOnlyTopBuildings, bOnlyAffordableBuildings) {
                        try {
                            var RSI = MaelstromTools.ResourceOverview.getInstance();
                            RSI.updateCache();
                            var TotalTiberium = 0;

                            for (var cityName in this.Cache) {
                                //noinspection JSUnfilteredForInLoop
                                var cityCache = this.Cache[cityName];
                                var i = cityCache[MaelstromTools.Statics.Tiberium];
                                if (typeof (i) !== 'undefined') {
                                    TotalTiberium += i;
                                    //but never goes here during test.... // to optimize - to do
                                }
                            }
                            var resAll = [];
                            var prod = MaelstromTools.Production.getInstance().updateCache(city.get_Name());
                            //var buildings = MaelstromTools.Wrapper.GetBuildings(city.get_CityBuildingsData());
                            var buildings = city.get_Buildings().d;

                            // 376877 & old fixes
                            var objbuildings = [];
                            if (PerforceChangelist >= 376877) { //new
                                for (var o in buildings) { //noinspection JSUnfilteredForInLoop
                                    objbuildings.push(buildings[o]);
                                }
                            } else { //old
                                for (var i1 = 0; i1 < buildings.length; i1++) objbuildings.push(buildings[i1]);
                            }


                            for (var i2 = 0; i2 < objbuildings.length; i2++) {
                                var city_building = objbuildings[i2];

                                // TODO: check for destroyed building

                                var iTechType = city_building.get_TechName();
                                var bSkip = true;
                                for (var iTypeKey in arTechtypes) {
                                    //noinspection JSUnfilteredForInLoop
                                    if (arTechtypes[iTypeKey] == iTechType) {
                                        bSkip = false;
                                        break;
                                    }
                                }
                                if (bSkip == true) {
                                    continue;
                                }
                                var city_buildingdetailview = city.GetBuildingDetailViewInfo(city_building);
                                if (city_buildingdetailview == null) {
                                    continue;
                                }
                                var bindex = city_building.get_Id();
                                var resbuilding = [];
                                resbuilding["ID"] = bindex;
                                resbuilding["Type"] = this.TechTypeName(parseInt(iTechType, 10));
                                resbuilding["PosX"] = city_building.get_CoordX();
                                resbuilding["PosY"] = city_building.get_CoordY();

                                resbuilding["Building"] = {
                                    cityid: city.get_Id(),
                                    posX: resbuilding["PosX"],
                                    posY: resbuilding["PosY"],
                                    isPaid: true
                                };

                                resbuilding["GainPerHour"] = 0;
                                resbuilding["Level"] = city_building.get_CurrentLevel() + 1;
                                for (var ModifierType in city_buildingdetailview.OwnProdModifiers.d) {
                                    //noinspection JSUnfilteredForInLoop
                                    switch (parseInt(ModifierType, 10)) {
                                        case eModPackageSize:
                                        {
                                            var ModOj = city_buildingdetailview.OwnProdModifiers.d[city_building.get_MainModifierTypeId()];
                                            var Mod = (ModOj.TotalValue + ModOj.NewLvlDelta) / ClientLib.Data.MainData.GetInstance().get_Time().get_StepsPerHour();
                                            //noinspection JSUnfilteredForInLoop
                                            resbuilding["GainPerHour"] += (city_buildingdetailview.OwnProdModifiers.d[ModifierType].NewLvlDelta / Mod);
                                            break;
                                        }
                                        case eModProduction:
                                        {
                                            //noinspection JSUnfilteredForInLoop
                                            resbuilding["GainPerHour"] += city_buildingdetailview.OwnProdModifiers.d[ModifierType].NewLvlDelta;
                                            break;
                                        }
                                    }
                                }
                                // Nutzen ins VerhÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¤ltnis zu den Kosten setzten
                                var TechLevelData = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj(city_building.get_CurrentLevel() + 1, city_building.get_TechGameData_Obj());
                                var RatioPerCostType = {};
                                var sRatio = "";
                                var sCosts = "";
                                var lTicks = 0;
                                var bHasPower = true;
                                var bHasTiberium = true;
                                var bAffordableByTransfer = true;
                                var oCosts = [];
                                var oTimes = [];
                                for (var costtype in TechLevelData) {
                                    //noinspection JSUnfilteredForInLoop
                                    if (typeof (TechLevelData[costtype]) == "function") {
                                        continue;
                                    }
                                    //noinspection JSUnfilteredForInLoop
                                    if (TechLevelData[costtype].Type == "0") {
                                        continue;
                                    }

                                    //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                    oCosts[TechLevelData[costtype].Type] = TechLevelData[costtype].Count;
                                    //noinspection JSUnfilteredForInLoop
                                    if (parseInt(TechLevelData[costtype].Count) <= 0) {
                                        continue;
                                    }
                                    //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                    RatioPerCostType[costtype] = TechLevelData[costtype].Count / resbuilding["GainPerHour"];
                                    if (sCosts.length > 0) {
                                        sCosts = sCosts + ", ";
                                    }
                                    //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                    sCosts = sCosts + MaelstromTools.Wrapper.FormatNumbersCompact(TechLevelData[costtype].Count) + " " + MaelstromTools.Statics.LootTypeName(TechLevelData[costtype].Type);
                                    if (sRatio.length > 0) {
                                        sRatio = sRatio + ", ";
                                    }
                                    // Upgrade affordable ?
                                    //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                    if (city.GetResourceCount(TechLevelData[costtype].Type) < TechLevelData[costtype].Count) {
                                        //noinspection JSUnfilteredForInLoop
                                        switch (TechLevelData[costtype].Type) {
                                            case ClientLib.Base.EResourceType.Tiberium:
                                            {
                                                bHasTiberium = false;
                                                //noinspection JSUnfilteredForInLoop
                                                if (TotalTiberium < TechLevelData[costtype].Count) {
                                                    bAffordableByTransfer = false;
                                                }
                                            }
                                                break;
                                            case ClientLib.Base.EResourceType.Power:
                                            {
                                                bHasPower = false;
                                            }
                                                break;
                                        }
                                    }
                                    //noinspection JSUnfilteredForInLoop
                                    sRatio = sRatio + MaelstromTools.Wrapper.FormatNumbersCompact(RatioPerCostType[costtype]);

                                    //noinspection JSUnfilteredForInLoop
                                    var techlevelData = MaelstromTools.Statics.LootTypeName(TechLevelData[costtype].Type);

                                    var dCityProduction = prod[techlevelData].Delta + prod[techlevelData].ExtraBonusDelta + prod[techlevelData].POI;
                                    if (dCityProduction > 0) {
                                        //noinspection JSUnfilteredForInLoop
                                        if (lTicks < (3600 * RatioPerCostType[costtype] / dCityProduction)) {
                                            //noinspection JSUnfilteredForInLoop
                                            lTicks = (3600 * RatioPerCostType[costtype] / dCityProduction);
                                        }
                                    }
                                    //noinspection JSUnfilteredForInLoop
                                    oTimes[TechLevelData[costtype].Type] = 0;
                                    //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                    if (oCosts[TechLevelData[costtype].Type] > city.GetResourceCount(TechLevelData[costtype].Type)) {
                                        //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop,JSUnfilteredForInLoop
                                        oTimes[TechLevelData[costtype].Type] = (3600 * (oCosts[TechLevelData[costtype].Type] - city.GetResourceCount(TechLevelData[costtype].Type))) / dCityProduction;
                                    }
                                }
                                resbuilding["Ticks"] = lTicks;
                                resbuilding["Time"] = ClientLib.Vis.VisMain.FormatTimespan(lTicks);
                                resbuilding["Costtext"] = sCosts;
                                resbuilding["Costs"] = oCosts;
                                resbuilding["TimeTillUpgradable"] = oTimes;
                                resbuilding["Ratio"] = sRatio;
                                resbuilding["Affordable"] = bHasTiberium && bHasPower;
                                resbuilding["AffordableByTransfer"] = bHasPower && bAffordableByTransfer;
                                if (resbuilding["GainPerHour"] > 0 && (bOnlyAffordableBuildings == false || resbuilding["Affordable"] == true)) {
                                    resAll[bindex] = resbuilding;
                                }
                            }


                            resAll = resAll.sort(this.comparePrio);
                            if (!bOnlyTopBuildings) {
                                return resAll;
                            }
                            var res2 = [];
                            if (MaelstromTools.Util.ArraySize(resAll) > 0) {
                                var iTopNotAffordable = -1;
                                var iTopAffordable = -1;
                                var iNextNotAffordable = -1;
                                var iLastIndex = -1;
                                for (var iNewIndex in resAll) {
                                    //noinspection JSUnfilteredForInLoop
                                    if (resAll[iNewIndex].Affordable == true) {
                                        if (iTopAffordable == -1) {
                                            iTopAffordable = iNewIndex;
                                            iNextNotAffordable = iLastIndex;
                                        }
                                    } else {
                                        if (iTopNotAffordable == -1) {
                                            iTopNotAffordable = iNewIndex;
                                        }
                                    }
                                    iLastIndex = iNewIndex;
                                }
                                if (iTopAffordable == -1) {
                                    iNextNotAffordable = iLastIndex;
                                }
                                var iIndex = 0;
                                if (iTopNotAffordable != -1) {
                                    res2[iIndex++] = resAll[iTopNotAffordable];
                                }
                                if (iNextNotAffordable != -1) {
                                    res2[iIndex++] = resAll[iNextNotAffordable];
                                }
                                if (iTopAffordable != -1) {
                                    res2[iIndex++] = resAll[iTopAffordable];
                                }
                            }
                            res2 = res2.sort(this.comparePrio);
                            return res2;
                        } catch (e) {
                            console.log("HuffyTools.getPrioList: ", e);
                        }
                    },
                    TechTypeName: function (iTechType) //noinspection JSConstructorReturnsPrimitive
                    {
                        switch (iTechType) {
                            case ClientLib.Base.ETechName.PowerPlant:
                            {
                                return Lang.gt("Powerplant");
                                //noinspection UnreachableCodeJS,UnreachableCodeJS,UnreachableCodeJS
                                break;
                            }
                            case ClientLib.Base.ETechName.Refinery:
                            {
                                return Lang.gt("Refinery");
                                //noinspection UnreachableCodeJS,UnreachableCodeJS,UnreachableCodeJS
                                break;
                            }
                            case ClientLib.Base.ETechName.Harvester_Crystal:
                            {
                                return Lang.gt("Harvester");
                                //noinspection UnreachableCodeJS,UnreachableCodeJS,UnreachableCodeJS
                                break;
                            }
                            case ClientLib.Base.ETechName.Harvester:
                            {
                                return Lang.gt("Harvester");
                                //noinspection UnreachableCodeJS,UnreachableCodeJS,UnreachableCodeJS
                                break;
                            }
                            case ClientLib.Base.ETechName.Silo:
                            {
                                return Lang.gt("Silo");
                                //noinspection UnreachableCodeJS,UnreachableCodeJS,UnreachableCodeJS
                                break;
                            }
                            case ClientLib.Base.ETechName.Accumulator:
                            {
                                return Lang.gt("Accumulator");
                                //noinspection UnreachableCodeJS,UnreachableCodeJS,UnreachableCodeJS
                                break;
                            }
                        }
                        return "?";
                    },
                    collectData: function (bOnlyTopBuildings, bOnlyAffordableBuildings, oCityFilter, eSelectedResourceType) {
                        try {
                            MT_Cache.updateCityCache();
                            this.Cache = {};
                            if (eSelectedResourceType == ClientLib.Base.EResourceType.Tiberium) {
                                this.Cache[ClientLib.Base.EResourceType.Tiberium] = {};
                            }
                            if (eSelectedResourceType == ClientLib.Base.EResourceType.Crystal) {
                                this.Cache[ClientLib.Base.EResourceType.Crystal] = {};
                            }
                            if (eSelectedResourceType == ClientLib.Base.EResourceType.Power) {
                                this.Cache[ClientLib.Base.EResourceType.Power] = {};
                            }
                            if (eSelectedResourceType == ClientLib.Base.EResourceType.Gold) {
                                this.Cache[ClientLib.Base.EResourceType.Gold] = {};
                            }
                            for (var cname in MT_Cache.Cities) {
                                //noinspection JSUnfilteredForInLoop
                                var city = MT_Cache.Cities[cname].Object;
                                //noinspection JSUnfilteredForInLoop
                                if (oCityFilter[cname] == false) {
                                    continue;
                                }
                                if (eSelectedResourceType == ClientLib.Base.EResourceType.Tiberium) {
                                    //noinspection JSUnfilteredForInLoop
                                    this.Cache[ClientLib.Base.EResourceType.Tiberium][cname] = this.getPrioList(city, [ClientLib.Base.ETechName.Harvester, ClientLib.Base.ETechName.Silo], ClientLib.Base.EModifierType.TiberiumPackageSize, ClientLib.Base.EModifierType.TiberiumProduction, bOnlyTopBuildings, bOnlyAffordableBuildings);
                                }
                                if (eSelectedResourceType == ClientLib.Base.EResourceType.Crystal) {
                                    //noinspection JSUnfilteredForInLoop
                                    this.Cache[ClientLib.Base.EResourceType.Crystal][cname] = this.getPrioList(city, [ClientLib.Base.ETechName.Harvester, ClientLib.Base.ETechName.Silo], ClientLib.Base.EModifierType.CrystalPackageSize, ClientLib.Base.EModifierType.CrystalProduction, bOnlyTopBuildings, bOnlyAffordableBuildings);
                                }
                                if (eSelectedResourceType == ClientLib.Base.EResourceType.Power) {
                                    //noinspection JSUnfilteredForInLoop
                                    this.Cache[ClientLib.Base.EResourceType.Power][cname] = this.getPrioList(city, [ClientLib.Base.ETechName.PowerPlant, ClientLib.Base.ETechName.Accumulator], ClientLib.Base.EModifierType.PowerPackageSize, ClientLib.Base.EModifierType.PowerProduction, bOnlyTopBuildings, bOnlyAffordableBuildings);
                                }
                                if (eSelectedResourceType == ClientLib.Base.EResourceType.Gold) {
                                    //noinspection JSUnfilteredForInLoop
                                    this.Cache[ClientLib.Base.EResourceType.Gold][cname] = this.getPrioList(city, [ClientLib.Base.ETechName.Refinery, ClientLib.Base.ETechName.PowerPlant], ClientLib.Base.EModifierType.CreditsPackageSize, ClientLib.Base.EModifierType.CreditsProduction, bOnlyTopBuildings, bOnlyAffordableBuildings);
                                }
                            }
                        } catch (e) {
                            console.log("HuffyTools.UpgradePriority.collectData: ", e);
                        }
                    }
                }
            });

            var __MTCity_initialized = false; //k undeclared

            var Lang = MaelstromTools.Language.getInstance();
            var MT_Cache = MaelstromTools.Cache.getInstance();
            var MT_Base = MaelstromTools.Base.getInstance();
            var MT_Preferences = MaelstromTools.Preferences.getInstance();
            MT_Preferences.readOptions();

            if (!webfrontend.gui.region.RegionCityMenu.prototype.__MTCity_showMenu) {
                webfrontend.gui.region.RegionCityMenu.prototype.__MTCity_showMenu = webfrontend.gui.region.RegionCityMenu.prototype.showMenu;
            }
            webfrontend.gui.region.RegionCityMenu.prototype.showMenu = function (selectedVisObject) {

                MT_Cache.SelectedBaseForMenu = selectedVisObject;
                var baseStatusOverview = MaelstromTools.BaseStatus.getInstance();

                if (__MTCity_initialized == false) {
                    //console.log(selectedBase.get_Name());
                    __MTCity_initialized = true;
                    baseStatusOverview.CityMenuButtons = [];

                    for (var k in this) {
                        try {
                            if (this.hasOwnProperty(k)) {
                                if (this[k] && this[k].basename == "Composite") {
                                    var button = new qx.ui.form.Button(Lang.gt("Calibrate support"));
                                    button.addListener("execute", function (e) {
                                        MaelstromTools.Util.calibrateWholeSupportOnSelectedBase();
                                    }, this);

                                    this[k].add(button);
                                    baseStatusOverview.CityMenuButtons.push(button);
                                }
                            }
                        } catch (e) {
                            console.log("webfrontend.gui.region.RegionCityMenu.prototype.showMenu: ", e);
                        }
                    }
                }

                var isAllowed = MaelstromTools.Util.checkIfSupportIsAllowed(MT_Cache.SelectedBaseForMenu);

                for (var x = 0; x < baseStatusOverview.CityMenuButtons.length; ++x) {
                    baseStatusOverview.CityMenuButtons[x].setVisibility(isAllowed ? 'visible' : 'excluded');
                }
                this.__MTCity_showMenu(selectedVisObject);
            };

            if (MT_Preferences.Settings.showLoot) {
                // Wrap onCitiesChange method
                if (!webfrontend.gui.region.RegionNPCCampStatusInfo.prototype.__MTCity_NPCCamp) {
                    webfrontend.gui.region.RegionNPCCampStatusInfo.prototype.__MTCity_NPCCamp = webfrontend.gui.region.RegionNPCCampStatusInfo.prototype.onCitiesChange;
                }
                webfrontend.gui.region.RegionNPCCampStatusInfo.prototype.onCitiesChange = function () {
                    MT_Base.updateLoot(1, ClientLib.Vis.VisMain.GetInstance().get_SelectedObject(), webfrontend.gui.region.RegionNPCCampStatusInfo.getInstance());
                    return this.__MTCity_NPCCamp();
                };

                if (!webfrontend.gui.region.RegionNPCBaseStatusInfo.prototype.__MTCity_NPCBase) {
                    webfrontend.gui.region.RegionNPCBaseStatusInfo.prototype.__MTCity_NPCBase = webfrontend.gui.region.RegionNPCBaseStatusInfo.prototype.onCitiesChange;
                }
                webfrontend.gui.region.RegionNPCBaseStatusInfo.prototype.onCitiesChange = function () {
                    MT_Base.updateLoot(2, ClientLib.Vis.VisMain.GetInstance().get_SelectedObject(), webfrontend.gui.region.RegionNPCBaseStatusInfo.getInstance());
                    //MT_Base.updateLoot(2, ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity(), webfrontend.gui.region.RegionNPCBaseStatusInfo.getInstance());
                    return this.__MTCity_NPCBase();
                };

                if (!webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.__MTCity_City) {
                    webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.__MTCity_City = webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.onCitiesChange;
                }
                webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.onCitiesChange = function () {
                    MT_Base.updateLoot(3, ClientLib.Vis.VisMain.GetInstance().get_SelectedObject(), webfrontend.gui.region.RegionCityStatusInfoEnemy.getInstance());
                    //MT_Base.updateLoot(3, ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity(), webfrontend.gui.region.RegionCityStatusInfoEnemy.getInstance());
                    return this.__MTCity_City();
                };
            }

        }
    } catch (e) {
        console.log("createMaelstromTools: ", e);
    }

    function MaelstromTools_checkIfLoaded() {
        try {
            if (typeof qx != 'undefined' && qx.core.Init.getApplication() && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION) && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION).isVisible()) {
                createMaelstromTools();
                MaelstromTools.Base.getInstance().initialize();
            } else {
                setTimeout(MaelstromTools_checkIfLoaded, 1000);
            }
        } catch (e) {
            console.log("MaelstromTools_checkIfLoaded: ", e);
        }
    }

    setTimeout(MaelstromTools_checkIfLoaded, 1000);
};

try {
    var MaelstromScript = document.createElement("script");
    MaelstromScript.innerHTML = "(" + MaelstromTools_main.toString() + ")();";
    MaelstromScript.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(MaelstromScript);
} catch (e) {
    console.log("MaelstromTools: init error: ", e);
}

// Maelstrom Basescanner Plugin - DTeCH
    var MaelstromTools_Basescanner = function () {
        window.__msbs_version = "1.8.5";
        function createMaelstromTools_Basescanner() {

            qx.Class.define("Addons.BaseScannerGUI", {
                type : "singleton",
                extend : qx.ui.window.Window,
                construct : function () {
                    try {
                        this.base(arguments);
                        console.info("Addons.BaseScannerGUI " + window.__msbs_version);
                        this.T = Addons.Language.getInstance();
                        this.setWidth(820);
                        this.setHeight(400);
                        this.setContentPadding(10);
                        this.setShowMinimize(true);
                        this.setShowMaximize(true);
                        this.setShowClose(true);
                        this.setResizable(true);
                        this.setAllowMaximize(true);
                        this.setAllowMinimize(true);
                        this.setAllowClose(true);
                        this.setShowStatusbar(false);
                        this.setDecorator(null);
                        this.setPadding(5);
                        this.setLayout(new qx.ui.layout.VBox(3));
                        this.stats.src = 'https://goo.gl/DrJ2x'; //1.5

                        this.FI();
                        this.FH();
                        this.FD();
                        if (this.ZE == null) {
                            this.ZE = [];
                        }
                        this.setPadding(0);
                        this.removeAll();

                        this.add(this.ZF);
                        this.add(this.ZN);

                        this.add(this.ZP);
                        this.ZL.setData(this.ZE);                            

                    } catch (e) {
                        console.debug("Addons.BaseScannerGUI.construct: ", e);
                    }
                },
                members : {
                    // pictures
                    stats : document.createElement('img'),
                    T : null,
                    ZA : 0,
                    ZB : null,
                    ZC : null,
                    ZD : null,
                    ZE : null,
                    ZF : null,
                    ZG : null,
                    ZH : false,
                    ZI : true,
                    ZJ : null,
                    ZK : null,
                    ZL : null,
                    ZM : null,
                    ZN : null,
                    ZO : null,
                    ZP : null,
                    ZQ : null,
                    ZR : [],
                    ZT : true,
                    ZU : null,
                    ZV : null,
                    ZX : null,
                    ZY : null,
                    ZZ : [],
                    ZS : {},
                    YZ : null,
                    YY : null,
                    
                    openWindow : function (title) {
                        try {
                            this.setCaption(title);
                            if (this.isVisible()) {
                                this.close();
                            } else {
                                MT_Cache.updateCityCache();
                                MT_Cache = window.MaelstromTools.Cache.getInstance();
                                var cname;                                
                                this.ZC.removeAll();
                                for (cname in MT_Cache.Cities) {
                                    var item = new qx.ui.form.ListItem(cname, null, MT_Cache.Cities[cname].Object);
                                    this.ZC.add(item);
                                    if (Addons.LocalStorage.getserver("Basescanner_LastCityID") == MT_Cache.Cities[cname].Object.get_Id()) {
                                        this.ZC.setSelection([item]);
                                    }
                                }                            
                                this.open();
                                this.moveTo(100, 100);
                            }
                        } catch (e) {
                            console.log("MaelstromTools.DefaultObject.openWindow: ", e);
                        }
                    },
                    FI : function () {
                        try {
                            this.ZL = new qx.ui.table.model.Simple();
                            this.ZL.setColumns(["ID", "LoadState", this.T.get("City"), this.T.get("Location"), this.T.get("Level"), this.T.get("Tiberium"), this.T.get("Crystal"), this.T.get("Dollar"), this.T.get("Research"), "Crystalfields", "Tiberiumfields", this.T.get("Building state"), this.T.get("Defense state"), this.T.get("CP"), "Def.HP/Off.HP", "Sum Tib+Cry+Cre", "(Tib+Cry+Cre)/CP", "CY", "DF", this.T.get("base set up at")]);
                            this.YY = ClientLib.Data.MainData.GetInstance().get_Player();
                            this.ZN = new qx.ui.table.Table(this.ZL);
                            this.ZN.setColumnVisibilityButtonVisible(false);
                            this.ZN.setColumnWidth(0, 0);
                            this.ZN.setColumnWidth(1, 0);
                            this.ZN.setColumnWidth(2, Addons.LocalStorage.getserver("Basescanner_ColWidth_2", 120));
                            this.ZN.setColumnWidth(3, Addons.LocalStorage.getserver("Basescanner_ColWidth_3", 60));
                            this.ZN.setColumnWidth(4, Addons.LocalStorage.getserver("Basescanner_ColWidth_4", 50));
                            this.ZN.setColumnWidth(5, Addons.LocalStorage.getserver("Basescanner_ColWidth_5", 60));
                            this.ZN.setColumnWidth(6, Addons.LocalStorage.getserver("Basescanner_ColWidth_6", 60));
                            this.ZN.setColumnWidth(7, Addons.LocalStorage.getserver("Basescanner_ColWidth_7", 60));
                            this.ZN.setColumnWidth(8, Addons.LocalStorage.getserver("Basescanner_ColWidth_8", 60));
                            this.ZN.setColumnWidth(9, Addons.LocalStorage.getserver("Basescanner_ColWidth_9", 30));
                            this.ZN.setColumnWidth(10, Addons.LocalStorage.getserver("Basescanner_ColWidth_10", 30));
                            this.ZN.setColumnWidth(11, Addons.LocalStorage.getserver("Basescanner_ColWidth_11", 50));
                            this.ZN.setColumnWidth(12, Addons.LocalStorage.getserver("Basescanner_ColWidth_12", 50));
                            this.ZN.setColumnWidth(13, Addons.LocalStorage.getserver("Basescanner_ColWidth_13", 30));
                            this.ZN.setColumnWidth(14, Addons.LocalStorage.getserver("Basescanner_ColWidth_14", 60));
                            this.ZN.setColumnWidth(15, Addons.LocalStorage.getserver("Basescanner_ColWidth_15", 60));
                            this.ZN.setColumnWidth(16, Addons.LocalStorage.getserver("Basescanner_ColWidth_16", 60));
                            this.ZN.setColumnWidth(17, Addons.LocalStorage.getserver("Basescanner_ColWidth_17", 50));
                            this.ZN.setColumnWidth(18, Addons.LocalStorage.getserver("Basescanner_ColWidth_18", 50));
                            this.ZN.setColumnWidth(19, Addons.LocalStorage.getserver("Basescanner_ColWidth_19", 40));
                            var c = 0;
                            var tcm = this.ZN.getTableColumnModel();
                            for (c = 0; c < this.ZL.getColumnCount(); c++) {
                                if (c == 0 || c == 1 || c == 11 || c == 12) {
                                    tcm.setColumnVisible(c, Addons.LocalStorage.getserver("Basescanner_Column_" + c, false));
                                } else {
                                    tcm.setColumnVisible(c, Addons.LocalStorage.getserver("Basescanner_Column_" + c, true));
                                }
                            }

                            tcm.setColumnVisible(1, false);
                            tcm.setHeaderCellRenderer(9, new qx.ui.table.headerrenderer.Icon(MT_Base.images[MaelstromTools.Statics.Crystal]), "Crystalfields");
                            tcm.setHeaderCellRenderer(10, new qx.ui.table.headerrenderer.Icon(MT_Base.images[MaelstromTools.Statics.Tiberium], "Tiberiumfields"));
                            tcm.setDataCellRenderer(5, new qx.ui.table.cellrenderer.Replace().set({
                                    ReplaceFunction : this.FA
                                }));
                            tcm.setDataCellRenderer(6, new qx.ui.table.cellrenderer.Replace().set({
                                    ReplaceFunction : this.FA
                                }));
                            tcm.setDataCellRenderer(7, new qx.ui.table.cellrenderer.Replace().set({
                                    ReplaceFunction : this.FA
                                }));
                            tcm.setDataCellRenderer(8, new qx.ui.table.cellrenderer.Replace().set({
                                    ReplaceFunction : this.FA
                                }));
                            tcm.setDataCellRenderer(15, new qx.ui.table.cellrenderer.Replace().set({
                                    ReplaceFunction : this.FA
                                }));
                            tcm.setDataCellRenderer(16, new qx.ui.table.cellrenderer.Replace().set({
                                    ReplaceFunction : this.FA
                                }));
                            tcm.setDataCellRenderer(19, new qx.ui.table.cellrenderer.Boolean());

                            
                            if (PerforceChangelist >= 436669) { // 15.3 patch
                                var eventType = "cellDbltap";
                            } else { //old
                                var eventType = "cellDblclick";
                            }
                
                            this.ZN.addListener(eventType, function (e) {
                                Addons.BaseScannerGUI.getInstance().FB(e);
                            }, this);

                            
                            tcm.addListener("widthChanged", function (e) {
                                //console.log(e, e.getData());
                                var col = e.getData().col;
                                var width = e.getData().newWidth;
                                Addons.LocalStorage.setserver("Basescanner_ColWidth_" + col, width);
                            }, tcm);

                        } catch (e) {
                            console.debug("Addons.BaseScannerGUI.FI: ", e);
                        }
                    },
                    FB : function (e) {
                        try {
                            console.log("e",e.getRow(),this.ZE);
                            var cityId = this.ZE[e.getRow()][0];
                            var posData = this.ZE[e.getRow()][3];
                            /* center screen */
                            if (posData != null && posData.split(':').length == 2) {
                                var posX = parseInt(posData.split(':')[0]);
                                var posY = parseInt(posData.split(':')[1]);
                                ClientLib.Vis.VisMain.GetInstance().CenterGridPosition(posX, posY);
                            }
                            /* and highlight base */
                            if (cityId && !(this.ZK[4].getValue())) {
                                //ClientLib.Data.MainData.GetInstance().get_Cities().set_CurrentCityId(cityId);
                                //webfrontend.gui.UtilView.openCityInMainWindow(cityId);
                                //webfrontend.gui.UtilView.openVisModeInMainWindow(1, cityId, false);
                                var bk = qx.core.Init.getApplication();
                                bk.getBackgroundArea().closeCityInfo();
                                bk.getPlayArea().setView(ClientLib.Data.PlayerAreaViewMode.pavmCombatSetupDefense, cityId, 0, 0);
                            }

                            var q = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                            if (q != null)
                                q.get_CityArmyFormationsManager().set_CurrentTargetBaseId(cityId);

                        } catch (ex) {
                            console.debug("Addons.BaseScannerGUI FB error: ", ex);
                        }
                    },
                    FN : function (e) {
                        this.ZG.setLabel(this.T.get("Scan"));
                        this.ZH = false;
                    },
                    CBChanged : function (e) {
                        this.ZH = false;
                    },
                    FA : function (oValue) {
                        var f = new qx.util.format.NumberFormat();
                        f.setGroupingUsed(true);
                        f.setMaximumFractionDigits(3);
                        if (!isNaN(oValue)) {
                            if (Math.abs(oValue) < 100000)
                                oValue = f.format(Math.floor(oValue));
                            else if (Math.abs(oValue) >= 100000 && Math.abs(oValue) < 1000000)
                                oValue = f.format(Math.floor(oValue / 100) / 10) + "k";
                            else if (Math.abs(oValue) >= 1000000 && Math.abs(oValue) < 10000000)
                                oValue = f.format(Math.floor(oValue / 1000) / 1000) + "M";
                            else if (Math.abs(oValue) >= 10000000 && Math.abs(oValue) < 100000000)
                                oValue = f.format(Math.floor(oValue / 10000) / 100) + "M";
                            else if (Math.abs(oValue) >= 100000000 && Math.abs(oValue) < 1000000000)
                                oValue = f.format(Math.floor(oValue / 100000) / 10) + "M";
                            else if (Math.abs(oValue) >= 1000000000 && Math.abs(oValue) < 10000000000)
                                oValue = f.format(Math.floor(oValue / 1000000) / 1000) + "G";
                            else if (Math.abs(oValue) >= 10000000000 && Math.abs(oValue) < 100000000000)
                                oValue = f.format(Math.floor(oValue / 10000000) / 100) + "G";
                            else if (Math.abs(oValue) >= 100000000000 && Math.abs(oValue) < 1000000000000)
                                oValue = f.format(Math.floor(oValue / 100000000) / 10) + "G";
                            else if (Math.abs(oValue) >= 1000000000000 && Math.abs(oValue) < 10000000000000)
                                oValue = f.format(Math.floor(oValue / 1000000000) / 1000) + "T";
                            else if (Math.abs(oValue) >= 10000000000000 && Math.abs(oValue) < 100000000000000)
                                oValue = f.format(Math.floor(oValue / 10000000000) / 100) + "T";
                            else if (Math.abs(oValue) >= 100000000000000 && Math.abs(oValue) < 1000000000000000)
                                oValue = f.format(Math.floor(oValue / 100000000000) / 10) + "T";
                            else if (Math.abs(oValue) >= 1000000000000000)
                                oValue = f.format(Math.floor(oValue / 1000000000000)) + "T";
                        };
                        return oValue.toString();
                    },
                    FH : function () {
                        try {
                            var oBox = new qx.ui.layout.Flow();
                            var oOptions = new qx.ui.container.Composite(oBox);
                            this.ZC = new qx.ui.form.SelectBox();
                            this.ZC.setHeight(25);
                            this.ZC.setMargin(5);
                            MT_Cache.updateCityCache();
                            MT_Cache = window.MaelstromTools.Cache.getInstance();
                            var cname;                            
                            for (cname in MT_Cache.Cities) {
                                var item = new qx.ui.form.ListItem(cname, null, MT_Cache.Cities[cname].Object);
                                this.ZC.add(item);
                                if (Addons.LocalStorage.getserver("Basescanner_LastCityID") == MT_Cache.Cities[cname].Object.get_Id()) {
                                    this.ZC.setSelection([item]);
                                }
                            }
                            this.ZC.addListener("changeSelection", function (e) {                                
                                this.FP(0, 1, 200);
                                this.ZH = false;
                                this.ZG.setLabel(this.T.get("Scan"));
                            }, this);
                            oOptions.add(this.ZC);

                            var l = new qx.ui.basic.Label().set({
                                    value : this.T.get("CP Limit"),
                                    textColor : "white",
                                    margin : 5
                                });
                            oOptions.add(l);

                            this.ZQ = new qx.ui.form.SelectBox();
                            this.ZQ.setWidth(50);
                            this.ZQ.setHeight(25);
                            this.ZQ.setMargin(5);
                            var limiter = Addons.LocalStorage.getserver("Basescanner_Cplimiter", 25);
                            for (var m = 11; m < 42; m += 1) {
                                item = new qx.ui.form.ListItem("" + m, null, m);
                                this.ZQ.add(item);
                                if (limiter == m) {
                                    this.ZQ.setSelection([item]);
                                }
                            }
                            this.ZQ.addListener("changeSelection", function (e) {
                                this.ZE = [];
                                this.FP(0, 1, 200);
                                this.ZH = false;
                                this.ZG.setLabel(this.T.get("Scan"));
                            }, this);
                            oOptions.add(this.ZQ);

                            var la = new qx.ui.basic.Label().set({
                                    value : this.T.get("min Level"),
                                    textColor : "white",
                                    margin : 5
                                });
                            oOptions.add(la);
                            var minlevel = Addons.LocalStorage.getserver("Basescanner_minLevel", "1");
                            this.ZY = new qx.ui.form.TextField(minlevel).set({
                                    width : 50
                                });
                            oOptions.add(this.ZY);

                            this.ZK = [];
                            this.ZK[0] = new qx.ui.form.CheckBox(this.T.get("Player"));
                            this.ZK[0].setMargin(5);
                            this.ZK[0].setTextColor("white");
                            this.ZK[0].setValue(Addons.LocalStorage.getserver("Basescanner_Show0", false));
                            this.ZK[0].addListener("changeValue", function (e) {
                                this.ZE = [];
                                this.FP(0, 1, 200);
                                this.ZH = false;
                                this.ZG.setLabel(this.T.get("Scan"));
                            }, this);
                            oOptions.add(this.ZK[0]);
                            this.ZK[1] = new qx.ui.form.CheckBox(this.T.get("Bases"));
                            this.ZK[1].setMargin(5);
                            this.ZK[1].setTextColor("white");
                            this.ZK[1].setValue(Addons.LocalStorage.getserver("Basescanner_Show1", false));
                            this.ZK[1].addListener("changeValue", function (e) {
                                this.ZE = [];
                                this.FP(0, 1, 200);
                                this.ZH = false;
                                this.ZG.setLabel(this.T.get("Scan"));
                            }, this);
                            oOptions.add(this.ZK[1]);
                            this.ZK[2] = new qx.ui.form.CheckBox(this.T.get("Outpost"));
                            this.ZK[2].setMargin(5);
                            this.ZK[2].setTextColor("white");
                            this.ZK[2].setValue(Addons.LocalStorage.getserver("Basescanner_Show2", false));
                            this.ZK[2].addListener("changeValue", function (e) {
                                this.ZE = [];
                                this.FP(0, 1, 200);
                                this.ZH = false;
                                this.ZG.setLabel(this.T.get("Scan"));
                            }, this);
                            oOptions.add(this.ZK[2]);
                            this.ZK[3] = new qx.ui.form.CheckBox(this.T.get("Camp"));
                            this.ZK[3].setMargin(5);
                            this.ZK[3].setTextColor("white");
                            this.ZK[3].setValue(Addons.LocalStorage.getserver("Basescanner_Show3", true));
                            this.ZK[3].addListener("changeValue", function (e) {
                                this.ZE = [];
                                this.FP(0, 1, 200);
                                this.ZH = false;
                                this.ZG.setLabel(this.T.get("Scan"));
                            }, this);
                            oOptions.add(this.ZK[3], {
                                lineBreak : true
                            });

                            this.ZG = new qx.ui.form.Button(this.T.get("Scan")).set({
                                    width : 100,
                                    minWidth : 100,
                                    maxWidth : 100,
                                    height : 25,
                                    margin : 5
                                });
                            this.ZG.addListener("execute", function () {

                                this.FE();
                            }, this);
                            oOptions.add(this.ZG);

                            var border = new qx.ui.decoration.Single(2, "solid", "blue");
                            this.ZV = new qx.ui.container.Composite(new qx.ui.layout.Basic()).set({
                                    decorator : border,
                                    backgroundColor : "red",
                                    allowGrowX : false,
                                    height : 20,
                                    width : 200
                                });
                            this.ZU = new qx.ui.core.Widget().set({
                                    decorator : null,
                                    backgroundColor : "green",
                                    width : 0
                                });
                            this.ZV.add(this.ZU);
                            this.ZX = new qx.ui.basic.Label("").set({
                                    decorator : null,
                                    textAlign : "center",
                                    width : 200
                                });
                            this.ZV.add(this.ZX, {
                                left : 0,
                                top : -3
                            });
                            oOptions.add(this.ZV);

                            this.YZ = new qx.ui.form.Button(this.T.get("clear Cache")).set({
                                    minWidth : 100,
                                    height : 25,
                                    margin : 5
                                });
                            this.YZ.addListener("execute", function () {
                                this.ZZ = [];
                            }, this);
                            oOptions.add(this.YZ);

                            this.ZK[4] = new qx.ui.form.CheckBox(this.T.get("Only center on World"));
                            this.ZK[4].setMargin(5);
                            this.ZK[4].setTextColor("white");
                            oOptions.add(this.ZK[4], {
                                lineBreak : true
                            });

                            this.ZJ = new qx.ui.form.SelectBox();
                            this.ZJ.setWidth(150);
                            this.ZJ.setHeight(25);
                            this.ZJ.setMargin(5);
                            var item = new qx.ui.form.ListItem("7 " + this.T.get(MaelstromTools.Statics.Tiberium) + " 5 " + this.T.get(MaelstromTools.Statics.Crystal), null, 7);
                            this.ZJ.add(item);
                            item = new qx.ui.form.ListItem("6 " + this.T.get(MaelstromTools.Statics.Tiberium) + " 6 " + this.T.get(MaelstromTools.Statics.Crystal), null, 6);
                            this.ZJ.add(item);
                            item = new qx.ui.form.ListItem("5 " + this.T.get(MaelstromTools.Statics.Tiberium) + " 7 " + this.T.get(MaelstromTools.Statics.Crystal), null, 5);
                            this.ZJ.add(item);
                            oOptions.add(this.ZJ);
                            this.ZD = new qx.ui.form.Button(this.T.get("Get Layouts")).set({
                                    width : 120,
                                    minWidth : 120,
                                    maxWidth : 120,
                                    height : 25,
                                    margin : 5
                                });
                            this.ZD.addListener("execute", function () {
                                var layout = window.Addons.BaseScannerLayout.getInstance();
                                layout.openWindow(this.T.get("BaseScanner Layout"));
                            }, this);
                            this.ZD.setEnabled(false);
                            oOptions.add(this.ZD);

                            this.ZB = new qx.ui.container.Composite();
                            this.ZB.setLayout(new qx.ui.layout.Flow());
                            this.ZB.setWidth(750);
                            //oOptions.add(this.ZB, {flex:1});

                            var J = webfrontend.gui.layout.Loader.getInstance();
                            //var L = J.getLayout("playerbar", this);
                            //this._ZZ = J.getElement(L, "objid", 'lblplayer');


                            //this.tableSettings = new qx.ui.groupbox.GroupBox("Visable Columns");
                            //box.add(this.tableSettings, {flex:1});
                            var k = 2;
                            for (k = 2; k < this.ZL.getColumnCount(); k++) {
                                var index = k - 2;

                                this.ZR[index] = new qx.ui.form.CheckBox(this.ZL.getColumnName(k));
                                this.ZR[index].setValue(this.ZN.getTableColumnModel().isColumnVisible(k));
                                this.ZR[index].setTextColor("white");
                                this.ZR[index].index = k;
                                this.ZR[index].table = this.ZN;
                                this.ZR[index].addListener("changeValue", function (e) {
                                    //console.log("click", e, e.getData(), this.index);
                                    var tcm = this.table.getTableColumnModel();
                                    tcm.setColumnVisible(this.index, e.getData());
                                    Addons.LocalStorage.setserver("Basescanner_Column_" + this.index, e.getData());
                                });
                                this.ZB.add(this.ZR[index]);
                                //this.tableSettings.add( this.ZR[index] );
                            }

                            this.ZO = new qx.ui.form.Button("+").set({
                                    margin : 5
                                });
                            this.ZO.addListener("execute", function () {
                                if (this.ZI) {
                                    oOptions.addAfter(this.ZB, this.ZO);
                                    this.ZO.setLabel("-");
                                } else {
                                    oOptions.remove(this.ZB);
                                    this.ZO.setLabel("+");
                                }
                                this.ZI = !this.ZI;
                            }, this);
                            this.ZO.setAlignX("right");
                            oOptions.add(this.ZO, {
                                lineBreak : true
                            });

                            this.ZF = oOptions;

                        } catch (e) {
                            console.debug("Addons.BaseScannerGUI.createOptions: ", e);
                        }
                    },
                    FD : function () {
                        //0.7
                        //var n = ClientLib.Data.MainData.GetInstance().get_Cities();
                        //var i = n.get_CurrentOwnCity();
                        var st = '<a href="https://sites.google.com/site/blindmanxdonate" target="_blank">Support Development of BlinDManX Addons</a>';
                        this.ZP = new qx.ui.basic.Label().set({
                                value : st,
                                rich : true,
                                width : 800
                            });
                    },
                    FE : function () {
                        var selectedBase = this.ZC.getSelection()[0].getModel();
                        ClientLib.Vis.VisMain.GetInstance().CenterGridPosition(selectedBase.get_PosX(), selectedBase.get_PosY()); //Load data of region
                        ClientLib.Vis.VisMain.GetInstance().Update();
                        ClientLib.Vis.VisMain.GetInstance().ViewUpdate();
                        ClientLib.Data.MainData.GetInstance().get_Cities().set_CurrentCityId(selectedBase.get_Id());

                        if (this.ZT) {
                            var obj = ClientLib.Data.WorldSector.WorldObjectCity.prototype;
                            // var fa = foundfnkstring(obj['$ctor'], /=0;this\.(.{6})=g>>7&255;.*d\+=f;this\.(.{6})=\(/, "ClientLib.Data.WorldSector.WorldObjectCity", 2);
                            var fa = foundfnkstring(obj['$ctor'], /this\.(.{6})=\(?\(?g>>8\)?\&.*d\+=f;this\.(.{6})=\(/, "ClientLib.Data.WorldSector.WorldObjectCity", 2);
                            if (fa != null && fa[1].length == 6) {
                                obj.getLevel = function () {
                                    return this[fa[1]];
                                };
                            } else {
                                console.error("Error - ClientLib.Data.WorldSector.WorldObjectCity.Level undefined");
                            }
                            if (fa != null && fa[2].length == 6) {
                                obj.getID = function () {
                                    return this[fa[2]];
                                };
                            } else {
                                console.error("Error - ClientLib.Data.WorldSector.WorldObjectCity.ID undefined");
                            }

                            obj = ClientLib.Data.WorldSector.WorldObjectNPCBase.prototype;
                            //var fb = foundfnkstring(obj['$ctor'], /100;this\.(.{6})=Math.floor.*d\+=f;this\.(.{6})=\(/, "ClientLib.Data.WorldSector.WorldObjectNPCBase", 2);
                            var fb = foundfnkstring(obj['$ctor'], /100\){0,1};this\.(.{6})=Math.floor.*d\+=f;this\.(.{6})=\(/, "ClientLib.Data.WorldSector.WorldObjectNPCBase", 2);
                            if (fb != null && fb[1].length == 6) {
                                obj.getLevel = function () {
                                    return this[fb[1]];
                                };
                            } else {
                                console.error("Error - ClientLib.Data.WorldSector.WorldObjectNPCBase.Level undefined");
                            }
                            if (fb != null && fb[2].length == 6) {
                                obj.getID = function () {
                                    return this[fb[2]];
                                };
                            } else {
                                console.error("Error - ClientLib.Data.WorldSector.WorldObjectNPCBase.ID undefined");
                            }

                            obj = ClientLib.Data.WorldSector.WorldObjectNPCCamp.prototype;
                            //var fc = foundfnkstring(obj['$ctor'], /100;this\.(.{6})=Math.floor.*=-1;\}this\.(.{6})=\(/, "ClientLib.Data.WorldSector.WorldObjectNPCCamp", 2);
                            var fc = foundfnkstring(obj['$ctor'], /100\){0,1};this\.(.{6})=Math.floor.*this\.(.{6})=\(*g\>\>(22|0x16)\)*\&.*=-1;\}this\.(.{6})=\(/, "ClientLib.Data.WorldSector.WorldObjectNPCCamp", 4);
                            if (fc != null && fc[1].length == 6) {
                                obj.getLevel = function () {
                                    return this[fc[1]];
                                };
                            } else {
                                console.error("Error - ClientLib.Data.WorldSector.WorldObjectNPCCamp.Level undefined");
                            }
                            if (fc != null && fc[2].length == 6) {
                                obj.getCampType = function () {
                                    return this[fc[2]];
                                };
                            } else {
                                console.error("Error - ClientLib.Data.WorldSector.WorldObjectNPCCamp.CampType undefined");
                            }

                            if (fc != null && fc[4].length == 6) {
                                obj.getID = function () {
                                    return this[fc[4]];
                                };
                            } else {
                                console.error("Error - ClientLib.Data.WorldSector.WorldObjectNPCCamp.ID undefined");
                            }
                            this.ZT = false;
                        }

                        //Firstscan
                        if (this.ZE == null) {
                            this.ZH = false;
                            this.ZG.setLabel("Pause");
                            this.ZD.setEnabled(false);
                            window.setTimeout("window.Addons.BaseScannerGUI.getInstance().FJ()", 1000);
                            return;
                        }
                        //After Pause
                        var c = 0;
                        for (i = 0; i < this.ZE.length; i++) {
                            if (this.ZE[i][1] == -1) {
                                c++;
                            }
                        }

                        if (!this.ZH) {
                            this.ZG.setLabel("Pause");
                            this.ZD.setEnabled(false);
                            if (c > 0) {
                                this.ZH = true;
                                window.setTimeout("window.Addons.BaseScannerGUI.getInstance().FG()", 1000);
                                return;
                            } else {
                                this.ZH = false;
                                window.setTimeout("window.Addons.BaseScannerGUI.getInstance().FJ()", 1000);
                            }
                        } else {
                            this.ZH = false;
                            this.ZG.setLabel(this.T.get("Scan"));
                        }

                    },
                    FP : function (value, max, maxwidth) {
                        if (this.ZU != null && this.ZX != null) {
                            this.ZU.setWidth(parseInt(value / max * maxwidth, 10));
                            this.ZX.setValue(value + "/" + max);
                        }
                    },
                    FJ : function () {
                        try {
                            this.ZM = {};
                            this.ZE = [];
                            var selectedBase = this.ZC.getSelection()[0].getModel();
                            Addons.LocalStorage.setserver("Basescanner_LastCityID", selectedBase.get_Id());
                            var ZQ = this.ZQ.getSelection()[0].getModel();
                            Addons.LocalStorage.setserver("Basescanner_Cplimiter", ZQ);
                            Addons.LocalStorage.setserver("Basescanner_minLevel", this.ZY.getValue());

                            var c1 = this.ZK[0].getValue();
                            var c2 = this.ZK[1].getValue();
                            var c3 = this.ZK[2].getValue();
                            var c4 = this.ZK[3].getValue();
                            var c5 = parseInt(this.ZY.getValue(), 10);
                            //console.log("Select", c1, c2, c3,c4,c5);
                            Addons.LocalStorage.setserver("Basescanner_Show0", c1);
                            Addons.LocalStorage.setserver("Basescanner_Show1", c2);
                            Addons.LocalStorage.setserver("Basescanner_Show2", c3);
                            Addons.LocalStorage.setserver("Basescanner_Show3", c4);
                            var posX = selectedBase.get_PosX();
                            var posY = selectedBase.get_PosY();
                            var scanX = 0;
                            var scanY = 0;
                            var world = ClientLib.Data.MainData.GetInstance().get_World();
                            console.info("Scanning from: " + selectedBase.get_Name());

                            // world.CheckAttackBase (System.Int32 targetX ,System.Int32 targetY) -> ClientLib.Data.EAttackBaseResult
                            // world.CheckAttackBaseRegion (System.Int32 targetX ,System.Int32 targetY) -> ClientLib.Data.EAttackBaseResult
                            var t1 = true;
                            var t2 = true;
                            var t3 = true;

                            var maxAttackDistance = ClientLib.Data.MainData.GetInstance().get_Server().get_MaxAttackDistance();
                            for (scanY = posY - Math.floor(maxAttackDistance + 1); scanY <= posY + Math.floor(maxAttackDistance + 1); scanY++) {
                                for (scanX = posX - Math.floor(maxAttackDistance + 1); scanX <= posX + Math.floor(maxAttackDistance + 1); scanX++) {
                                    var distX = Math.abs(posX - scanX);
                                    var distY = Math.abs(posY - scanY);
                                    var distance = Math.sqrt((distX * distX) + (distY * distY));
                                    if (distance <= maxAttackDistance) {
                                        var object = world.GetObjectFromPosition(scanX, scanY);
                                        var loot = {};
                                        if (object) {
                                            //console.log(object);

                                            if (object.Type == 1 && t1) {
                                                //console.log("object typ 1");
                                                //objfnkstrON(object);
                                                //t1 = !t1;
                                            }
                                            if (object.Type == 2 && t2) {
                                                //console.log("object typ 2");
                                                //objfnkstrON(object);
                                                //t2 = !t2;
                                            }

                                            if (object.Type == 3 && t3) {

                                                //console.log("object typ 3");
                                                //objfnkstrON(object);
                                                //t3 = !t3;
                                            }

                                            if (object.Type == 3) {
                                                if (c5 <= parseInt(object.getLevel(), 10)) {
                                                    //console.log(object);
                                                }
                                            }

                                            //if(object.ConditionBuildings>0){
                                            var needcp = selectedBase.CalculateAttackCommandPointCostToCoord(scanX, scanY);
                                            if (needcp <= ZQ && typeof object.getLevel == 'function') {
                                                if (c5 <= parseInt(object.getLevel(), 10)) {
                                                    // 0:ID , 1:Scanned, 2:Name, 3:Location, 4:Level, 5:Tib, 6:Kristal, 7:Credits, 8:Forschung, 9:Kristalfelder, 10:Tiberiumfelder,
                                                    // 11:ConditionBuildings,12:ConditionDefense,13: CP pro Angriff , 14: defhp/offhp , 15:sum tib,krist,credits, 16: sum/cp
                                                    var d = this.FL(object.getID(), 0);
                                                    var e = this.FL(object.getID(), 1);
                                                    if (e != null) {
                                                        this.ZM[object.getID()] = e;
                                                    }

                                                    if (object.Type == 1 && c1) { //User
                                                        //console.log("object ID LEVEL", object.getID() ,object.getLevel() );
                                                        if (d != null) {
                                                            this.ZE.push(d);
                                                        } else {
                                                            this.ZE.push([object.getID(),  - 1, this.T.get("Player"), scanX + ":" + scanY, object.getLevel(), 0, 0, 0, 0, 0, 0, 0, 0, needcp, 0, 0, 0, 0]);
                                                        }
                                                    }
                                                    if (object.Type == 2 && c2) { //basen
                                                        //console.log("object ID LEVEL", object.getID() ,object.getLevel() );
                                                        if (d != null) {
                                                            this.ZE.push(d);
                                                        } else {
                                                            this.ZE.push([object.getID(),  - 1, this.T.get("Bases"), scanX + ":" + scanY, object.getLevel(), 0, 0, 0, 0, 0, 0, 0, 0, needcp, 0, 0, 0, 0]);
                                                        }
                                                    }
                                                    if (object.Type == 3 && (c3 || c4)) { //Lager Vposten
                                                        //console.log("object ID LEVEL", object.getID() ,object.getLevel() );
                                                        if (d != null) {
                                                            if (object.getCampType() == 2 && c4) {
                                                                this.ZE.push(d);
                                                            }
                                                            if (object.getCampType() == 3 && c3) {
                                                                this.ZE.push(d);
                                                            }

                                                        } else {
                                                            if (object.getCampType() == 2 && c4) {
                                                                this.ZE.push([object.getID(),  - 1, this.T.get("Camp"), scanX + ":" + scanY, object.getLevel(), 0, 0, 0, 0, 0, 0, 0, 0, needcp, 0, 0, 0, 0]);
                                                            }
                                                            if (object.getCampType() == 3 && c3) {
                                                                this.ZE.push([object.getID(),  - 1, this.T.get("Outpost"), scanX + ":" + scanY, object.getLevel(), 0, 0, 0, 0, 0, 0, 0, 0, needcp, 0, 0, 0, 0]);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            //}
                                        }
                                    }
                                }
                            }
                            this.ZH = true;
                            this.ZL.setData(this.ZE);
                            this.FP(0, this.ZE.length, 200);
                            this.ZL.sortByColumn(4, false); //Sort form Highlevel to Lowlevel
                            if (this.YY.name != "DR01D")
                                window.setTimeout("window.Addons.BaseScannerGUI.getInstance().FG()", 50);
                        } catch (ex) {
                            console.debug("Maelstrom_Basescanner FJ error: ", ex);
                        }
                    },
                    FG : function () {
                        try {
                            var retry = false;
                            var loops = 0;
                            var maxLoops = 10;
                            var i = 0;
                            var sleeptime = 150;
                            while (!retry) {
                                var ncity = null;
                                var selectedid = 0;
                                var id = 0;
                                if (this.ZE == null) {
                                    console.warn("data null: ");
                                    this.ZH = false;
                                    break;
                                }
                                for (i = 0; i < this.ZE.length; i++) {
                                    // 1= "LoadState"
                                    if (this.ZE[i][1] == -1) {
                                        break;
                                    }
                                }

                                if (i == this.ZE.length) {
                                    this.ZH = false;
                                }
                                this.FP(i, this.ZE.length, 200); //Progressbar
                                if (this.ZE[i] == null) {
                                    console.warn("data[i] null: ");
                                    this.ZH = false;
                                    this.ZG.setLabel(this.T.get("Scan"));
                                    this.ZD.setEnabled(true);
                                    break;
                                }
                                var posData = this.ZE[i][3];
                                /* make sure coordinates are well-formed enough */
                                if (posData != null && posData.split(':').length == 2) {
                                    var posX = parseInt(posData.split(':')[0]);
                                    var posY = parseInt(posData.split(':')[1]);
                                    /* check if there is any base */
                                    var playerbase = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                                    var world = ClientLib.Data.MainData.GetInstance().get_World();
                                    var foundbase = world.CheckFoundBase(posX, posY, playerbase.get_PlayerId(), playerbase.get_AllianceId());
                                    //console.log("foundbase",foundbase);
                                    this.ZE[i][19] = (foundbase == 0);
                                    //var obj = ClientLib.Vis.VisMain.GetInstance().get_SelectedObject();
                                    //console.log("obj", obj);
                                    id = this.ZE[i][0];
                                    ClientLib.Data.MainData.GetInstance().get_Cities().set_CurrentCityId(id);
                                    ncity = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(id);
                                    //console.log("ncity", ncity);
                                    if (ncity != null) {
                                        if (!ncity.get_IsGhostMode()) {
                                            //if(ncity.get_Name() != null)
                                            //console.log("ncity.get_Name ", ncity.get_Name() , ncity.get_CityBuildingsData().get_Buildings());
                                            //var cityBuildings = ncity.get_CityBuildingsData();
                                            var cityUnits = ncity.get_CityUnitsData();
                                            if (cityUnits != null) { // cityUnits !=null können null sein
                                                //console.log("ncity.cityUnits", cityUnits );

                                                var selectedBase = this.ZC.getSelection()[0].getModel();
                                                var buildings = ncity.get_Buildings().d;
                                                var defenseUnits = cityUnits.get_DefenseUnits().d;
                                                var offensivUnits = selectedBase.get_CityUnitsData().get_OffenseUnits().d;
                                                //console.log(buildings,defenseUnits,offensivUnits);

                                                if (buildings != null) //defenseUnits !=null können null sein
                                                {
                                                    var buildingLoot = getResourcesPart(buildings);
                                                    var unitLoot = getResourcesPart(defenseUnits);

                                                    //console.log("buildingLoot", buildingLoot);
                                                    //console.log("unitLoot", unitLoot);
                                                    this.ZE[i][2] = ncity.get_Name();
                                                    this.ZE[i][5] = buildingLoot[ClientLib.Base.EResourceType.Tiberium] + unitLoot[ClientLib.Base.EResourceType.Tiberium];
                                                    this.ZE[i][6] = buildingLoot[ClientLib.Base.EResourceType.Crystal] + unitLoot[ClientLib.Base.EResourceType.Crystal];
                                                    this.ZE[i][7] = buildingLoot[ClientLib.Base.EResourceType.Gold] + unitLoot[ClientLib.Base.EResourceType.Gold];
                                                    this.ZE[i][8] = buildingLoot[ClientLib.Base.EResourceType.ResearchPoints] + unitLoot[ClientLib.Base.EResourceType.ResearchPoints];
                                                    //console.log(posX,posY,"GetBuildingsConditionInPercent", ncity.GetBuildingsConditionInPercent() );
                                                    if (ncity.GetBuildingsConditionInPercent() != 0) {
                                                        this.ZA = 0;
                                                        if (this.ZE[i][5] != 0) {
                                                            var c = 0;
                                                            var t = 0;
                                                            var m = 0;
                                                            var k = 0;
                                                            var l = 0;
                                                            this.ZM[id] = new Array(9);
                                                            for (m = 0; m < 9; m++) {
                                                                this.ZM[id][m] = new Array(8);
                                                            }
                                                            for (k = 0; k < 9; k++) {
                                                                for (l = 0; l < 8; l++) {
                                                                    //console.log( ncity.GetResourceType(k,l) );
                                                                    switch (ncity.GetResourceType(k, l)) {
                                                                    case 1:
                                                                        /* Crystal */
                                                                        this.ZM[id][k][l] = 1;
                                                                        c++;
                                                                        break;
                                                                    case 2:
                                                                        /* Tiberium */
                                                                        this.ZM[id][k][l] = 2;
                                                                        t++;
                                                                        break;
                                                                    default:
                                                                        //none
                                                                        break;
                                                                    }
                                                                }
                                                            }
                                                            //console.log( c,t );


                                                            this.ZE[i][9] = c;
                                                            this.ZE[i][10] = t;
                                                            this.ZE[i][11] = ncity.GetBuildingsConditionInPercent();
                                                            this.ZE[i][12] = ncity.GetDefenseConditionInPercent();

                                                            try {
                                                                var u = offensivUnits;
                                                                //console.log("OffenseUnits",u);
                                                                var offhp = 0;
                                                                var defhp = 0;
                                                                for (var g in u) {
                                                                    offhp += u[g].get_Health();
                                                                }

                                                                u = defenseUnits;
                                                                //console.log("DefUnits",u);
                                                                for (var g in u) {
                                                                    defhp += u[g].get_Health();
                                                                }

                                                                u = buildings;
                                                                //console.log("DefUnits",u);
                                                                for (var g in u) {
                                                                    //var id=0;
                                                                    //console.log("MdbUnitId",u[g].get_MdbUnitId());
                                                                    var mid = u[g].get_MdbUnitId();
                                                                    //DF
                                                                    if (mid == 158 || mid == 131 || mid == 195) {
                                                                        this.ZE[i][18] = 8 - u[g].get_CoordY();
                                                                    }
                                                                    //CY
                                                                    if (mid == 112 || mid == 151 || mid == 177) {
                                                                        this.ZE[i][17] = 8 - u[g].get_CoordY();
                                                                    }
                                                                }

                                                                //console.log("HPs",offhp,defhp, (defhp/offhp) );
                                                            } catch (x) {
                                                                console.debug("HPRecord", x);
                                                            }
                                                            this.ZE[i][14] = (defhp / offhp);

                                                            this.ZE[i][15] = this.ZE[i][5] + this.ZE[i][6] + this.ZE[i][7];
                                                            this.ZE[i][16] = this.ZE[i][15] / this.ZE[i][13];

                                                            this.ZE[i][1] = 0;
                                                            retry = true;
                                                            console.info(ncity.get_Name(), " finish");
                                                            this.ZA = 0;
                                                            this.countlastidchecked = 0;
                                                            //console.log(this.ZE[i],this.ZM[id],id);
                                                            this.FK(this.ZE[i], this.ZM[id], id);
                                                            //update table
                                                            this.ZL.setData(this.ZE);
                                                        }
                                                    } else {
                                                        if (this.ZA > 250) {
                                                            console.info(this.ZE[i][2], " on ", posX, posY, " removed (GetBuildingsConditionInPercent == 0)");
                                                            this.ZE.splice(i, 1); //entfernt element aus array
                                                            this.ZA = 0;
                                                            this.countlastidchecked = 0;
                                                            break;
                                                        }
                                                        this.ZA++;
                                                    }
                                                }
                                            }
                                        } else {
                                            console.info(this.ZE[i][2], " on ", posX, posY, " removed (IsGhostMode)");
                                            this.ZE.splice(i, 1); //entfernt element aus array
                                            break;
                                        }
                                    }
                                }
                                loops++;
                                if (loops >= maxLoops) {
                                    retry = true;
                                    break;
                                }
                            }

                            //console.log("getResourcesByID end ", this.ZH, Addons.BaseScannerGUI.getInstance().isVisible());
                            if (this.lastid != i) {
                                this.lastid = i;
                                this.countlastidchecked = 0;
                                this.ZA = 0;
                            } else {
                                if (this.countlastidchecked > 16) {
                                    console.info(this.ZE[i][2], " on ", posX, posY, " removed (found no data)");
                                    this.ZE.splice(i, 1); //entfernt element aus array
                                    this.countlastidchecked = 0;
                                } else if (this.countlastidchecked > 10) {
                                    sleeptime = 500;
                                } else if (this.countlastidchecked > 4) {
                                    sleeptime = 250;
                                }
                                this.countlastidchecked++;
                            }
                            //console.log("this.ZH", this.ZH);
                            if (this.ZH && Addons.BaseScannerGUI.getInstance().isVisible()) {
                                //console.log("loop");
                                window.setTimeout("window.Addons.BaseScannerGUI.getInstance().FG()", sleeptime);
                            } else {
                                this.ZG.setLabel(this.T.get("Scan"));
                                this.ZH = false;
                            }
                        } catch (e) {
                            console.debug("MaelstromTools_Basescanner getResources", e);
                        }
                    },
                    FK : function (dataa, datab, id) {
                        this.ZZ.push(dataa);
                        this.ZS[id] = datab;
                    },
                    FL : function (id, t) {
                        if (t == 0) {
                            for (var i = 0; i < this.ZZ.length; i++) {
                                if (this.ZZ[i][0] == id) {
                                    return this.ZZ[i];
                                }
                            }
                        } else {
                            if (this.ZS[id]) {
                                return this.ZS[id];
                            }
                        }
                        return null;
                    }

                }
            });

            qx.Class.define("Addons.BaseScannerLayout", {
                type : "singleton",
                extend : qx.ui.window.Window,
                construct : function () {
                    try {
                        this.base(arguments);
                        console.info("Addons.BaseScannerLayout " + window.__msbs_version);
                        this.setWidth(820);
                        this.setHeight(400);
                        this.setContentPadding(10);
                        this.setShowMinimize(false);
                        this.setShowMaximize(true);
                        this.setShowClose(true);
                        this.setResizable(true);
                        this.setAllowMaximize(true);
                        this.setAllowMinimize(false);
                        this.setAllowClose(true);
                        this.setShowStatusbar(false);
                        this.setDecorator(null);
                        this.setPadding(10);
                        this.setLayout(new qx.ui.layout.Grow());

                        this.ZW = [];
                        this.removeAll();
                        this.ZZ = new qx.ui.container.Scroll();
                        this.ZY = new qx.ui.container.Composite(new qx.ui.layout.Flow());
                        this.add(this.ZZ, {
                            flex : 3
                        });
                        this.ZZ.add(this.ZY);
                        //this.FO();
                    } catch (e) {
                        console.debug("Addons.BaseScannerLayout.construct: ", e);
                    }
                },
                members : {
                    ZW : null,
                    ZZ : null,
                    ZY : null,
                    ZX : null,
                    openWindow : function (title) {
                        try {
                            this.setCaption(title);
                            if (this.isVisible()) {
                                this.close();
                            } else {
                                this.open();
                                this.moveTo(100, 100);
                                this.FO();
                            }
                        } catch (e) {
                            console.log("Addons.BaseScannerLayout.openWindow: ", e);
                        }
                    },
                    FO : function () {
                        var ZM = window.Addons.BaseScannerGUI.getInstance().ZM;
                        var ZE = window.Addons.BaseScannerGUI.getInstance().ZE;
                        this.ZX = [];
                        var selectedtype = window.Addons.BaseScannerGUI.getInstance().ZJ.getSelection()[0].getModel();
                        //console.log("FO: " , ZM.length);
                        var rowDataLine = null;
                        if (ZE == null) {
                            console.info("ZE null: ");
                            return;
                        }
                        //console.log("FO: " , ZM);
                        this.ZW = [];
                        var id;
                        var i;
                        var x;
                        var y;
                        var a;
                        for (id in ZM) {
                            for (i = 0; i < ZE.length; i++) {
                                if (ZE[i][0] == id) {
                                    rowDataLine = ZE[i];
                                }
                            }

                            if (rowDataLine == null) {
                                continue;
                            }
                            //console.log("ST",selectedtype,rowDataLine[10]);
                            if (selectedtype > 4 && selectedtype < 8) {
                                if (selectedtype != rowDataLine[10]) {
                                    continue;
                                }
                            } else {
                                continue;
                            }

                            var posData = rowDataLine[3];
                            var posX;
                            var posY;
                            if (posData != null && posData.split(':').length == 2) {
                                posX = parseInt(posData.split(':')[0]);
                                posY = parseInt(posData.split(':')[1]);
                            }
                            var st = '<table border="2" cellspacing="0" cellpadding="0">';
                            var link = rowDataLine[2] + " - " + rowDataLine[3];
                            st = st + '<tr><td colspan="9"><font color="#FFF">' + link + '</font></td></tr>';
                            for (y = 0; y < 8; y++) {
                                st = st + "<tr>";
                                for (x = 0; x < 9; x++) {
                                    var img = "";
                                    var res = ZM[id][x][y];
                                    //console.log("Res ",res);
                                    switch (res == undefined ? 0 : res) {
                                    case 2:
                                        //console.log("Tiberium " , MT_Base.images[MaelstromTools.Statics.Tiberium] );
                                        img = '<img width="14" height="14" src="' + MT_Base.images[MaelstromTools.Statics.Tiberium] + '">';
                                        break;
                                    case 1:
                                        //console.log("Crystal ");
                                        img = '<img width="14" height="14" src="' + MT_Base.images[MaelstromTools.Statics.Crystal] + '">';
                                        break;
                                    default:
                                        img = '<img width="14" height="14" src="' + MT_Base.images["Emptypixels"] + '">';
                                        break;
                                    }
                                    st = st + "<td>" + img + "</td>";
                                }
                                st = st + "</tr>";
                            }
                            st = st + "</table>";
                            //console.log("setWidgetLabels ", st);
                            var l = new qx.ui.basic.Label().set({
                                    backgroundColor : "#303030",
                                    value : st,
                                    rich : true
                                });
                            l.cid = id;
                            this.ZX.push(id);
                            l.addListener("click", function (e) {

                                //console.log("clickid ", this.cid, );
                                //webfrontend.gui.UtilView.openCityInMainWindow(this.cid);
                                var bk = qx.core.Init.getApplication();
                                bk.getBackgroundArea().closeCityInfo();
                                bk.getPlayArea().setView(ClientLib.Data.PlayerAreaViewMode.pavmCombatSetupDefense, this.cid, 0, 0);
                                var q = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                                if (q != null)
                                    q.get_CityArmyFormationsManager().set_CurrentTargetBaseId(this.cid);

                            });
                            l.setReturnValue = id;
                            this.ZW.push(l);
                        }
                        this.ZY.removeAll();
                        var b = 0;
                        var c = 0;
                        //console.log("this.ZW.length",this.ZW.length);
                        for (a = 0; a < this.ZW.length; a++) {
                            this.ZY.add(this.ZW[a], {
                                row : b,
                                column : c
                            });
                            c++;
                            if (c > 4) {
                                c = 0;
                                b++;
                            }
                        }
                    }
                }
            });

            qx.Class.define("Addons.LocalStorage", {
                type : "static",
                extend : qx.core.Object,
                statics : {
                    isSupported : function () {
                        return typeof(localStorage) !== "undefined";
                    },
                    isdefined : function (key) {
                        return (localStorage[key] !== "undefined" && localStorage[key] != null);
                    },
                    isdefineddata : function (data, key) {
                        return (data[key] !== "undefined" && data[key] != null);
                    },
                    setglobal : function (key, value) {
                        try {
                            if (Addons.LocalStorage.isSupported()) {
                                localStorage[key] = JSON.stringify(value);
                            }
                        } catch (e) {
                            console.debug("Addons.LocalStorage.setglobal: ", e);
                        }
                    },
                    getglobal : function (key, defaultValue) {
                        try {
                            if (Addons.LocalStorage.isSupported()) {
                                if (Addons.LocalStorage.isdefined(key)) {
                                    return JSON.parse(localStorage[key]);
                                }
                            }
                        } catch (e) {
                            console.log("Addons.LocalStorage.getglobal: ", e);
                        }
                        return defaultValue;
                    },
                    setserver : function (key, value) {
                        try {
                            if (Addons.LocalStorage.isSupported()) {
                                var sn = ClientLib.Data.MainData.GetInstance().get_Server().get_Name();
                                var data;
                                if (Addons.LocalStorage.isdefined(sn)) {
                                    try {
                                        data = JSON.parse(localStorage[sn]);
                                        if (!(typeof data === "object")) {
                                            data = {};
                                            console.debug("LocalStorage data from server not null, but not object");
                                        }
                                    } catch (e) {
                                        console.debug("LocalStorage data from server not null, but parsererror", e);
                                        data = {};
                                    }
                                } else {
                                    data = {};
                                }
                                data[key] = value;
                                localStorage[sn] = JSON.stringify(data);
                            }
                        } catch (e) {
                            console.debug("Addons.LocalStorage.setserver: ", e);
                        }
                    },
                    getserver : function (key, defaultValue) {
                        try {
                            if (Addons.LocalStorage.isSupported()) {
                                var sn = ClientLib.Data.MainData.GetInstance().get_Server().get_Name();
                                if (Addons.LocalStorage.isdefined(sn)) {
                                    var data = JSON.parse(localStorage[sn]);
                                    if (Addons.LocalStorage.isdefineddata(data, key)) {
                                        return data[key];
                                    }
                                }
                            }
                        } catch (e) {
                            console.log("Addons.LocalStorage.getserver: ", e);
                        }
                        return defaultValue;
                    }
                }
            });
            
            if(typeof Addons.Language === 'undefined'){
                qx.Class.define("Addons.Language", {
                    type : "singleton",
                    extend : qx.core.Object,
                    members : {
                        d : {},
                        debug : false,
                        addtranslateobj : function (o) {
                            if ( o.hasOwnProperty("main") ){
                                this.d[o.main.toString()] = o;                                
                                if(this.debug){
                                    console.log("Translate Added ", o.main.toString() );
                                }
                                delete o.main;                                
                            } else {
                                console.debug("Addons.Language.addtranslateobj main not define");
                            }
                        },
                        get : function (t) {
                            var locale = qx.locale.Manager.getInstance().getLocale();
                            var loc = locale.split("_")[0];
                            if ( this.d.hasOwnProperty(t) ){
                                if ( this.d[t].hasOwnProperty(loc) ){
                                    return this.d[t][loc];
                                }
                            }
                            if(this.debug){
                                console.debug("Addons.Language.get ", t, " not translate for locale ", loc);
                            }
                            return t;
                        }
                    }
                });
            }
            
            qx.Class.define("qx.ui.table.cellrenderer.Replace", {
                extend : qx.ui.table.cellrenderer.Default,

                properties : {

                    replaceMap : {
                        check : "Object",
                        nullable : true,
                        init : null
                    },
                    replaceFunction : {
                        check : "Function",
                        nullable : true,
                        init : null
                    }
                },
                members : {
                    // overridden
                    _getContentHtml : function (cellInfo) {
                        var value = cellInfo.value;
                        var replaceMap = this.getReplaceMap();
                        var replaceFunc = this.getReplaceFunction();
                        var label;

                        // use map
                        if (replaceMap) {
                            label = replaceMap[value];
                            if (typeof label != "undefined") {
                                cellInfo.value = label;
                                return qx.bom.String.escape(this._formatValue(cellInfo));
                            }
                        }

                        // use function
                        if (replaceFunc) {
                            cellInfo.value = replaceFunc(value);
                        }
                        return qx.bom.String.escape(this._formatValue(cellInfo));
                    },

                    addReversedReplaceMap : function () {
                        var map = this.getReplaceMap();
                        for (var key in map) {
                            var value = map[key];
                            map[value] = key;
                        }
                        return true;
                    }
                }
            });
            
            
            console.info("Maelstrom_Basescanner initalisiert");
            
            var T = Addons.Language.getInstance();
            T.debug = false;
            T.addtranslateobj( {main:"Point", de: "Position", pt: "Position", fr: "Position"} );
            T.addtranslateobj( {main:"BaseScanner Overview", de: "Basescanner Übersicht", pt: "Visão geral do scanner de base", fr: "Aperçu du scanner de base"} );
            T.addtranslateobj( {main:"Scan", de: "Scannen", pt: "Esquadrinhar", fr: "Balayer"} );
            T.addtranslateobj( {main:"Location", de: "Lage", pt: "localização", fr: "Emplacement"} );
            T.addtranslateobj( {main:"Player", de: "Spieler", pt: "Jogador", fr: "Joueur"} );
            T.addtranslateobj( {main:"Bases", de: "Bases", pt: "Bases", fr: "Bases"} );
            T.addtranslateobj( {main:"Camp,Outpost", de: "Lager,Vorposten", pt: "Camp,posto avançado", fr: "Camp,avant-poste"} );
            T.addtranslateobj( {main:"Camp", de: "Lager", pt: "Camp", fr: "Camp"} );                        
            T.addtranslateobj( {main:"Outpost", de: "Vorposten", pt: "posto avançado", fr: "avant-poste"} );
            T.addtranslateobj( {main:"BaseScanner Layout", de: "BaseScanner Layout", pt: "Layout da Base de Dados de Scanner", fr: "Mise scanner de base"} );
            T.addtranslateobj( {main:"Show Layouts", de: "Layouts anzeigen", pt: "Mostrar Layouts", fr: "Voir Layouts"} );                        
            T.addtranslateobj( {main:"Building state", de: "Gebäudezustand", pt: "construção do Estado", fr: "construction de l'État"} );
            T.addtranslateobj( {main:"Defense state", de: "Verteidigungszustand", pt: "de Defesa do Estado", fr: "défense de l'Etat"} );
            T.addtranslateobj( {main:"CP", de: "KP", pt: "CP", fr: "CP"} );
            T.addtranslateobj( {main:"CP Limit", de: "KP begrenzen", pt: "CP limitar", fr: "CP limiter"} );                        
            T.addtranslateobj( {main:"min Level", de: "min. Level", pt: "nível mínimo", fr: "niveau minimum"} );
            T.addtranslateobj( {main:"clear Cache", de: "Cache leeren", pt: "limpar cache", fr: "vider le cache"} );
            T.addtranslateobj( {main:"Only center on World", de: "Nur auf Welt zentrieren", pt: "Único centro no Mundial", fr: "Seul centre sur World"} );
            T.addtranslateobj( {main:"base set up at", de: "Basis errichtbar", pt: "base de configurar a", fr: "mis en place à la base"} );    
            T.addtranslateobj( {main:"Infantry", de: "Infanterie", pt: "Infantaria", fr: "Infanterie"} );
            T.addtranslateobj( {main:"Vehicle", de: "Fahrzeuge", pt: "Veículos", fr: "Vehicule"} );
            T.addtranslateobj( {main:"Aircraft", de: "Flugzeuge", pt: "Aeronaves", fr: "Aviation"} );
            T.addtranslateobj( {main:"Tiberium", de: "Tiberium", pt: "Tibério", fr: "Tiberium"} );
            T.addtranslateobj( {main:"Crystal", de: "Kristalle", pt: "Cristal", fr: "Cristal"} );
            T.addtranslateobj( {main:"Power", de: "Strom", pt: "Potência", fr: "Energie"} );
            T.addtranslateobj( {main:"Dollar", de: "Credits", pt: "Créditos", fr: "Crédit"} );
            T.addtranslateobj( {main:"Research", de: "Forschung", pt: "Investigação", fr: "Recherche"} );
            T.addtranslateobj( {main:"-----", de: "--", pt: "--", fr: "--"} );
            

            
            
            var MT_Lang = null;
            var MT_Cache = null;
            var MT_Base = null;
            var fileManager = null;
            var lastid = 0;
            var countlastidchecked = 0;
            fileManager = ClientLib.File.FileManager.GetInstance();
            MT_Lang = window.MaelstromTools.Language.getInstance();
            MT_Cache = window.MaelstromTools.Cache.getInstance();
            MT_Base = window.MaelstromTools.Base.getInstance();

            MT_Base.createNewImage("BaseScanner", "ui/icons/icon_item.png", fileManager);
            MT_Base.createNewImage("Emptypixels", "ui/menues/main_menu/misc_empty_pixel.png", fileManager);
            var openBaseScannerOverview = MT_Base.createDesktopButton(T.get("BaseScanner Overview") + "version " + window.__msbs_version, "BaseScanner", false, MT_Base.desktopPosition(2));
            openBaseScannerOverview.addListener("execute", function () {
                Addons.BaseScannerGUI.getInstance().openWindow(T.get("BaseScanner Overview") + " version " + window.__msbs_version);
            }, this);
            Addons.BaseScannerGUI.getInstance().addListener("close", Addons.BaseScannerGUI.getInstance().FN, Addons.BaseScannerGUI.getInstance());
            //this.addListener("resize", function(){ }, this );
            
            MT_Base.addToMainMenu("BaseScanner", openBaseScannerOverview);
            
            if(typeof Addons.AddonMainMenu !== 'undefined'){
                var addonmenu = Addons.AddonMainMenu.getInstance();
                addonmenu.AddMainMenu("Basescanner", function () {
                    Addons.BaseScannerGUI.getInstance().openWindow(T.get("BaseScanner Overview") + " version " + window.__msbs_version);
                },"ALT+B");
            }
            
        }

        function getResourcesPart(cityEntities) {
            try {
                var loot = [0, 0, 0, 0, 0, 0, 0, 0];
                if (cityEntities == null) {
                    return loot;
                }

                for (var i in cityEntities) {
                    var cityEntity = cityEntities[i];
                    var unitLevelRequirements = MaelstromTools.Wrapper.GetUnitLevelRequirements(cityEntity);

                    for (var x = 0; x < unitLevelRequirements.length; x++) {
                        loot[unitLevelRequirements[x].Type] += unitLevelRequirements[x].Count * cityEntity.get_HitpointsPercent();
                        if (cityEntity.get_HitpointsPercent() < 1.0) {
                            // destroyed

                        }
                    }
                }
                return loot;
            } catch (e) {
                console.debug("MaelstromTools_Basescanner getResourcesPart", e);
            }
        }

        function objfnkstrON(obj) {
            var key;
            for (key in obj) {
                if (typeof(obj[key]) == "function") {
                    var s = obj[key].toString();
                    console.debug(key, s);
                    //var protostring = s.replace(/\s/gim, "");
                    //console.log(key, protostring);
                }
            }
        }

        function foundfnkstring(obj, redex, objname, n) {
            var redexfounds = [];
            var s = obj.toString();
            var protostring = s.replace(/\s/gim, "");
            redexfounds = protostring.match(redex);
            var i;
            for (i = 1; i < (n + 1); i++) {
                if (redexfounds != null && redexfounds[i].length == 6) {
                    console.debug(objname, i, redexfounds[i]);
                } else if (redexfounds != null && redexfounds[i].length > 0) {
                    console.warn(objname, i, redexfounds[i]);
                } else {
                    console.error("Error - ", objname, i, "not found");
                    console.warn(objname, protostring);
                }
            }
            return redexfounds;
        }

        function MaelstromTools_Basescanner_checkIfLoaded() {
            try {
                if (typeof qx != 'undefined' && typeof MaelstromTools != 'undefined') {
                    createMaelstromTools_Basescanner();
                } else {
                    window.setTimeout(MaelstromTools_Basescanner_checkIfLoaded, 1000);
                }
            } catch (e) {
                console.debug("MaelstromTools_Basescanner_checkIfLoaded: ", e);
            }
        }
        if (/commandandconquer\.com/i.test(document.domain)) {
            window.setTimeout(MaelstromTools_Basescanner_checkIfLoaded, 10000);
        }
    };
    try {
        var MaelstromScript_Basescanner = document.createElement("script");
        MaelstromScript_Basescanner.innerHTML = "(" + MaelstromTools_Basescanner.toString() + ")();";
        MaelstromScript_Basescanner.type = "text/javascript";
        if (/commandandconquer\.com/i.test(document.domain)) {
            document.getElementsByTagName("head")[0].appendChild(MaelstromScript_Basescanner);
        }
    } catch (e) {
        console.debug("MaelstromTools_Basescanner: init error: ", e);
    }

// Maelstrom ADDON Alliance members Who's Online (DTeCH)
        function OnlineStatusCityColor_Main() 
        {
//        var localStorageKey = "CCTA_MaelstromTools_CC_OnlineStateColorer";
            var injectionMode = 0;
            switch (PerforceChangelist) {
                case 373715:
                    injectionMode = 1;
                    break;
                default:
                    injectionMode = 2;
                    break;
            }
            console.log("Maelstrom_CityOnlineStateColorer " + window.__mscc_version + " loaded, Serverversion " + injectionMode);
            var OnlineState = {
                Online: 1,
                Away: 2,
                Offline: 0,
                Hidden: 3
            };
            var onlineStateColor = {};
            onlineStateColor[OnlineState.Online] = "#00FF00";
            onlineStateColor[OnlineState.Away] = "#FFFF00";
            onlineStateColor[OnlineState.Offline] = "#FF0000";
            onlineStateColor[OnlineState.Hidden] = "#C2C2C2";

            function CityOnlineStateColorerInclude() {
                setInterval(requestOnlineStatusUpdate, 45 * 1000); // update users online status every 45 seconds
                console.log("Maelstrom_CityOnlineStateColorer Include");
                var regionCityPrototype = ClientLib.Vis.Region.RegionCity.prototype;
                regionCityPrototype.CityTextcolor = function (defaultColor) {
                    try {
                        var members = ClientLib.Data.MainData.GetInstance().get_Alliance().get_MemberData().d;
                        var playerId = this.get_PlayerId();
                        if (members[playerId] !== undefined) {
                            var onlineState = members[playerId].OnlineState;
                            return onlineStateColor[onlineState];
                        }
                    } catch (ex) {
                        console.log("MaelstromTools_CityOnlineStateColorer CityTextcolor error: ", ex);
                    }
                    return defaultColor;
                };
                regionCityPrototype.CityBackgroundColor = function (backgroundBlock) {
                    try {


                    } catch (ex) {
                        console.log("MaelstromTools_CityOnlineStateColorer CityBackgroundColor error: ", ex);
                    }
                };

                var updateColorParts = g(regionCityPrototype.UpdateColor, /createHelper;this\.([A-Z]{6})\(/, "ClientLib.Vis.Region.RegionCity UpdateColor", 1);
                var setCanvasValue_Name = updateColorParts[1];
                console.log("setCanvasValue_Name = " + updateColorParts[1]);
                if (updateColorParts === null || setCanvasValue_Name.length !== 6) {
                    console.error("Error - ClientLib.Vis.Region.RegionCity.SetCanvasValue undefined");
                    return;
                }

                regionCityPrototype.SetCanvasValue_ORG = regionCityPrototype[setCanvasValue_Name];
                console.log("regionCityPrototype.SetCanvasValue_ORG = " + regionCityPrototype[setCanvasValue_Name]);
                var setCanvasValueFunctionBody = getFunctionBody(regionCityPrototype.SetCanvasValue_ORG);
                regionCityPrototype.SetCanvasValue_BODY = setCanvasValueFunctionBody;

                //var setCanvasValueFunctionBodyFixed = setCanvasValueFunctionBody.replace(/true;.{0,3}\}.{0,3}this/im, "true; } g=this.CityTextcolor(g); this");
                var setCanvasValueFunctionBodyFixed = setCanvasValueFunctionBody.replace(
                    /\{g="#000000";\}/im,
                    "{g=\"#000000\";}else{g=this.CityTextcolor(g);}");
                regionCityPrototype[setCanvasValue_Name] = new Function("a", "b", setCanvasValueFunctionBodyFixed);
                regionCityPrototype.SetCanvasValue_FIXED = new Function("a", "b", setCanvasValueFunctionBodyFixed);
                var visUpdateParts = null;
                switch (injectionMode) {
                    case 1:
                        visUpdateParts = g(regionCityPrototype.VisUpdate, /Own:\{?this\.(.{6})\(.*Alliance:\{?this\.(.{6})\(/, "ClientLib.Vis.Region.RegionCity VisUpdate", 2);
                        break;
                    default:
                        visUpdateParts = g(regionCityPrototype.VisUpdate, /Own:\{?\$I\.(.{6})\.(.{6})\(.*Alliance:\{?\$I\..{6}\.(.{6})\(/, "ClientLib.Vis.Region.RegionCity VisUpdate", 3);
                        var G = ClientLib.Vis.Region.Region.prototype;
                        var fc = g(G.VisUpdate, /\.(.{6})\(a,n,s\);/, "ClientLib.Vis.Region.Region VisUpdate", 1);
                        break;
                }
                if (visUpdateParts === null || visUpdateParts[1].length !== 6) {
                    console.error("Error - ClientLib.Vis.Region.RegionCity VisUpdate paramter undefined");
                    return;
                }

                if (injectionMode > 1) {
                    regionCityPrototype[visUpdateParts[2]] = $I[visUpdateParts[1]][visUpdateParts[2]];
                    regionCityPrototype[visUpdateParts[3]] = $I[visUpdateParts[1]][visUpdateParts[3]];
                    var visUpdate = getFunctionBody(regionCityPrototype.VisUpdate);
                    var t = visUpdate.replace(/Own:(\{?).{0,2}\$I\.(.{6})\.(.{6}).{0,2}\(/im, "Own: $1 this.$3(");
                    var q = t.replace(/Alliance:(\{?).{0,2}\$I\.(.{6})\.(.{6}).{0,2}\(/im, "Alliance: $1 this.$3(");
                    var F = q.replace(/Enemy:(\{?).{0,2}\$I\.(.{6})\.(.{6}).{0,2}\(/im, "Enemy: $1 this.$3(");
                    regionCityPrototype[fc[1]] = new Function("a", "b", "c", F);
                    regionCityPrototype.VisUpdate = regionCityPrototype[fc[1]];
                }
                try {
                    var u = null, Q = null;
                    if (injectionMode === 1) {
                        u = getFunctionBody(regionCityPrototype[visUpdateParts[1]]);
                        Q = u.replace(/c\.Font\);/im, "c.Font); this.CityBackgroundColor(a); ");
                        regionCityPrototype[visUpdateParts[1]] = new Function("a", "b", "c", "d", Q);
                    } else {
                        u = getFunctionBody(regionCityPrototype[visUpdateParts[2]]);
                        Q = u.replace(/d\.Font\);/im, "d.Font); this.CityBackgroundColor(b);");
                        regionCityPrototype[visUpdateParts[2]] = new Function("a", "b", "c", "d", "e", Q);
                    }
                } catch (P) {
                    console.log("MaelstromTools_CityOnlineStateColorer Include B error: ", P);
                }
                try {

                    if (injectionMode === 1) {
                        var K = getFunctionBody(regionCityPrototype[visUpdateParts[2]]);
                        var J = K.replace(/c.Font\);/im, "c.Font); this.CityBackgroundColor(a); ");
                        regionCityPrototype[visUpdateParts[2]] = new Function("a", "b", "c", "d", "e", J);
                    } else {
                        var K2 = getFunctionBody(regionCityPrototype[visUpdateParts[3]]);
                        var J2 = K2.replace(/d.Font\);/im, "d.Font); this.CityBackgroundColor(b);");
                        regionCityPrototype[visUpdateParts[3]] = new Function("a", "b", "c", "d", "e", "f", "g", J2);
                    }
                } catch (P) {
                    console.log("MaelstromTools_CityOnlineStateColorer Include C error: ", P);
                }
            }

            function g(functionObject, regEx, m, p) {
                var functionBody = functionObject.toString();
                var shrinkedText = functionBody.replace(/\s/gim, "");
                var matches = shrinkedText.match(regEx);
                for (var i = 1; i < (p + 1); i++) {
                    if (matches !== null && matches[i].length === 6) {
                        console.log(m, i, matches[i]);
                    } else {
                        console.error("Error - ", m, i, "not found");
                        console.warn(m, shrinkedText);
                    }
                }
                return matches;
            }

            function requestOnlineStatusUpdate() {
                console.log("Who's Online: requesting online status udpate");
                var mainData = ClientLib.Data.MainData.GetInstance();
                var alliance = mainData.get_Alliance();
                alliance.RefreshMemberData();
            }

            function getFunctionBody(functionObject) {
                var string = functionObject.toString();
                var singleLine = string.replace(/(\n\r|\n|\r|\t)/gm, " ");
                var spacesShrinked = singleLine.replace(/\s+/gm, " ");
                var headerRemoved = spacesShrinked.replace(/function.*?\{/, "");
                //var result = headerRemoved.substring(0, headerRemoved.length - 1); // remove last "}"
                return headerRemoved.substring(0, headerRemoved.length - 1); //result;
            }

            function MaelstromTools_CityOnlineStateColorerInclude_checkIfLoaded() {
                try {
                    if (typeof ClientLib !== "undefined" && ClientLib.Vis !== undefined && ClientLib.Vis.Region !== undefined && ClientLib.Vis.Region.RegionCity !== undefined) {
                        CityOnlineStateColorerInclude();
                    } else {
                        window.setTimeout(MaelstromTools_CityOnlineStateColorerInclude_checkIfLoaded, 10000); //10);
                    }
                } catch (ex) {
                    console.log("MaelstromTools_CityOnlineStateColorerInclude_checkIfLoaded: ", ex);
                }
            }

            function MaelstromTools_CityOnlineStateColorerTool_checkIfLoaded() {
                try {
                    if (typeof ClientLib === "undefined" || typeof MaelstromTools === "undefined") {
                        window.setTimeout(MaelstromTools_CityOnlineStateColorerTool_checkIfLoaded, 25000); //10000); //1000);
                    }
                } catch (ex) {
                    console.log("MaelstromTools_CityOnlineStateColorerTool_checkIfLoaded: ", ex);
                }
            }

            if (/commandandconquer\.com/i.test(document.domain)) {
                window.setTimeout(MaelstromTools_CityOnlineStateColorerInclude_checkIfLoaded, 10000); //100);
                window.setTimeout(MaelstromTools_CityOnlineStateColorerTool_checkIfLoaded, 25000); //10000);
            }
        }

        try {
            if (/commandandconquer\.com/i.test(document.domain)) {
                var scriptTag = document.createElement("script");
                scriptTag.id = "xxx";
                scriptTag.innerHTML = "(" + OnlineStatusCityColor_Main.toString() + ")();";
                scriptTag.type = "text/javascript";
                document.getElementsByTagName("head")[0].appendChild(scriptTag);
            }
        } catch (c) {
            console.log("MaelstromTools_CityOnlineStateColorer: init error: ", c);
        }

// TACS (TA Combat Sim) - DTeCH
	var TASuite_mainFunction = function () {
		console.log("TACS: Simulator loaded");

		/* not used
		function compare(a, b) {
		return a - b;
		}

		function sort_and_unique(my_array) {
		my_array.sort(compare);
		for (var i = 1; i < my_array.length; i++) {
		if (my_array[i] === my_array[i - 1]) {
		my_array.splice(i--, 1);
		}
		}
		return my_array;
		}*/

		var locale = null;
		var languages = ["tr_TR", "de_DE", "pt_PT", "it_IT", "nl_NL", "hu_HU", "fr_FR", "fi_FI"]; //en is default
		var translations = {
			"Stats" : ["İstatistik", "Statistik", "Estatística", "Statistiche", "Statistieken", "Statisztika", "Statistiques", "Tiedot"],
			"Enemy Base:" : ["Düşman Üssü:", "Feindliche Basis:", "Base Inimiga:", "Base Nemica:", "Vijandelijke Basis:", "Ellenséges bázis:", "Base Ennemie:", "Vihollisen tukikohta:"],
			"Defences:" : ["Savunma Üniteleri:", "Verteidigung:", "Defesas:", "Difesa:", "Verdediging:", "Védelem:", "Défenses:", "Puolustus:"],
			"Buildings:" : ["Binalar:", "Gebäude:", "Edifícios:", "Strutture:", "Gebouwen:", "Épületek:", "Bâtiments:", "Rakennelmat:"],
			"Construction Yard:" : ["Şantiye:", "Bauhof:", "Estaleiro:", "Cantiere:", "Bouwplaats:", "Központ:", "Chantier De Construction:", "Rakennustukikohta:"],
			"Defense Facility:" : ["Savunma Tesisi:", "Verteidigungseinrichtung:", "Instalações de Defesa:", "Stazione di Difesa:", "Defensiefaciliteit:", "Védelmi Bázis:", "Complexe De Défense:", "Puolustuslaitos:"],
			"Command Center:" : ["Komuta Merkezi:", "Kommandozentrale:", "Centro de Comando:", "Centro di Comando:", "Commandocentrum:", "Parancsnoki központ:", "Centre De Commandement:", "Komentokeskus:"],
			"Available Repair:" : ["Mevcut Onarım:", "", "", "", "", "", "", "Korjausaikaa jäljellä:"],
			"Available Attacks:" : ["Mevcut Saldırılar:", "", "", "", "", "", "", "Hyökkäyksiä:"],
			"Overall:" : ["Tüm Birlikler:", "Gesamt:", "Geral:", "Totale:", "Totaal:", "Áttekintés:", "Total:", "Yhteensä:"],
			"Infantry:" : ["Piyadeler:", "Infanterie:", "Infantaria:", "Fanteria:", "Infanterie:", "Gyalogság:", "Infanterie:", "Jalkaväki:"],
			"Vehicle:" : ["Motorlu Birlikler:", "Fahrzeuge:", "Veículos:", "Veicoli:", "Voertuigen:", "Jármu:", "Véhicules:", "Ajoneuvot:"],
			"Aircraft:" : ["Hava Araçları:", "Flugzeuge:", "Aviões:", "Velivoli:", "Vliegtuigen:", "Légiero:", "Avions:", "Lentokoneet:"],
			"Outcome:" : ["Sonuç:", "Ergebnis:", "Resultado:", "Esito:", "Uitkomst:", "Eredmény:", "Résultat:", "Lopputulos:"],
			"Unknown" : ["Bilinmiyor", "Unbekannt", "Desconhecido", "Sconosciuto", "Onbekend", "Ismeretlen", "Inconnu", "Tuntematon"],
			"Battle Time:" : ["Savaş Süresi:", "Kampfdauer:", "Tempo de Batalha:", "Tempo di Battaglia:", "Gevechtsduur:", "Csata ideje:", "Durée Du Combat:", "Taistelun kesto:"],
			"Layouts" : ["Diziliş", "Layouts", "Formações", "Formazione", "Indelingen", "Elrendezés", "Dispositions", "Asetelmat"],
			"Load" : ["Yükle", "Laden", "Carregar", "Carica", "Laad", "Töltés", "Charger", "Lataa"],
			"Load this saved layout." : ["Kayıtlı dizilişi yükle.", "Gespeichertes Layout laden.", "Carregar esta formação guardada.", "Carica questa formazione salvata.", "Laad deze opgeslagen indeling.", "Töltsd be ezt az elmentett elrendezést.", "Charger Cette Disposition.", "Lataa valittu asetelma."],
			"Delete" : ["Sil", "Löschen", "Apagar", "Cancella", "Verwijder", "Törlés", "Effacer", "Poista"],
			"Name: " : ["İsim: ", "Name: ", "Nome: ", "Nome: ", "Naam: ", "Név: ", "Nom: ", "Nimi: "],
			"Delete this saved layout." : ["Kayıtlı dizilişi sil.", "Gewähltes Layout löschen.", "Apagar esta formação guardada.", "Cancella questa formazione salvata.", "Verwijder deze opgeslagen indeling.", "Töröld ezt az elmentett elrendezést.", "Effacer Cette Disposition.", "Poista valittu asetelma."],
			"Save" : ["Kaydet", "Speichern", "Guardar", "Salva", "Opslaan", "Mentés", "Sauvegarder", "Tallenna"],
			"Save this layout." : ["Bu dizilişi kaydet.", "Layout speichern.", "Guardar esta formação.", "Salva questa formazione.", "Deze indeling opslaan.", "Mentsd el ezt az elrendezést.", "Sauvegarder Cette Disposition.", "Tallenna nykyinen asetelma."],
			"Info" : ["Bilgi", "Info", "Info", "Info", "Info", "Info", "Infos", "Tietoa"],
			"Forums" : ["Forum", "Forum", "Fóruns", "Forum", "Forums", "Fórum", "Forums", "Keskustelupalsta"],
			"Spoils" : ["Ganimetler", "Rohstoffausbeute", "Espólios", "Bottino", "Opbrengst", "Zsákmény", "Butin", "Sotasaalis"],
			"Options" : ["Seçenekler", "Optionen", "Opções:", "Opzioni:", "Opties:", "Opciók:", "Options:", "Asetukset"],
			"TACS Options": ["TACS Seçenekleri", "", "", "", "", "", "", ""],
			"Auto display stats" : ["İstatistik penceresini otomatik olarak göster", "Dieses Fenster automatisch öffnen", "Mostrar esta caixa automaticamente", "Apri automaticamente la finestra Strumenti", "Dit venster automatisch weergeven", "Ezen ablak autómatikus megjelenítése", "Affich. Auto. de cette Fenêtre", "Näytä simuloinnin tiedot automaattisesti"], // need to change translations
			"Show shift buttons" : ["Kaydırma tuşlarını göster", "Bewegungstasten anzeigen", "Mostrar botões de deslocamento", "Mostra i pulsanti di spostamento", "Verschuifknoppen weergeven", "Eltoló gombok megjelenítése", "Affich. Auto. Boutons de Déplacement", "Näytä armeijan siirtopainikkeet"],
			"Warning!" : ["Uyarı!", "Warnung!", "Aviso!", "Attenzione!", "Waarschuwing!", "Figyelem!", "Attention!", "Varoitus!"],
			"Simulate" : ["Simule et", "Simulieren", "Simular", "Simula", "Simuleer", "Szimuláció", "Simuler", "Simuloi"],
			"Start Combat Simulation" : ["Savaş Simulasyonunu Başlat", "Kampfsimulation starten", "Começar a simalação de combate", "Avvia simulazione", "Start Gevechtssimulatie", "Csata szimuláció elindítása", "Démarrer La Simulation Du Combat", "Aloita taistelun simulaatio"],
			"Setup" : ["Düzen", "Aufstellung", "Configuração", "Setup", "Opzet", "Elrendezés", "Organisation", "Takaisin"],
			"Return to Combat Setup" : ["Ordu düzenini göster", "Zurück zur Einheitenaufstellung", "Voltar à configuração de combate", "Ritorna alla configurazione", "Keer terug naar Gevechtsopzet", "Vissza az egységek elrendezéséhez", "Retourner à l'Organisation Des Troupes", "Return to Combat Setup"],
			"Unlock" : ["Kilidi aç", "Freigabe", "Desbloquear", "Sblocca", "Ontgrendel", "Felold", "Debloquer", "Avaa"],
			//"Tools" : ["Araçlar", "Extras", "Ferramentas", "Strumenti", "Gereedschap", "Eszközök", "Outils", "Työkalut"],
			"Open Simulator Tools" : ["Simulatör Araçlarını Göster", "Extras öffnen", "Abrir as ferramentas do simulador", "Apri strumenti", "Open Simulator Gereedschap", "Megnyitja a szimulátor információs ablakát", "Ouvrir Les Réglages Du Simulateur", "Avaa simulaattorin työkalut"],
			"Shift units left" : ["Birlikleri sola kaydır", "Einheiten nach links bewegen", "Deslocar as unidades para a esquerda", "Spostare le unità a sinistra", "Verschuif eenheden links", "Egységek eltolása balra", "Déplacer Les Unités Vers La Gauche", "Siirtää yksikköjä vasemmalle"],
			"Shift units right" : ["Birlikleri sağa kaydır", "Einheiten nach rechts bewegen", "Deslocar as unidades para a direita", "Spostare le unità a destra", "Verschuif eenheden rechts", "Egységek eltolása jobbra", "Déplacer Les Unités Vers La Droite", "Siirtää yksikköjä oikealle"],
			"Shift units up" : ["Birlikleri yukarı kaydır", "Einheiten nach oben bewegen", "Deslocar as unidades para cima", "Spostare le unità in alto", "Verschuif eenheden omhoog", "Egységek eltolása fel", "Déplacer Les Unités Vers Le Haut", "Siirtää yksikköjä ylös"],
			"Shift units down" : ["Birlikleri aşağı kaydır", "Einheiten nach unten bewegen", "Deslocar as unidades para baixo", "Spostare le unità in basso", "Verschuif eenheden omlaag", "Egységek eltolása le", "Déplacer Les Unités Vers Le Bas", "Siirtää yksikköjä alas"],
			//"Battle Simulator" : ["Savaş Simulatörü", "Kampfsimulator", "Simulador de Combate", "Simulatore", "Gevechtssimulator", "Csata szimulátor", "Simulateur De Combat", "Taistelusimulaattori"],
			"Total Victory" : ["Mutlak Zafer", "Gesamtsieg", "Vitória Total", "Vittoria Totale", "Totale Overwinning", "Teljes gyozelem", "Victoire Totale", "Totaalinen Voitto"],
			"Victory" : ["Zafer", "Sieg", "Vitória", "Vittoria", "Overwinning", "Gyozelem", "Victoire", "Voitto"],
			"Total Defeat" : ["Mutlak Yenilgi", "Totale Niederlage", "Derrota total", "Sconfitta Totale", "Totale Nederlaag", "Teljes vereség", "Défaite Totale", "Total Tappio"],
			"Support lvl " : ["Takviye seviyesi ", "Stufe Supportwaffe ", "Nível do Suporte ", "Supporto lvl ", "Ondersteuningsniveau ", '"Support" épület szintje ', "Lvl. Du Support ", "Tukitykistön taso "],
			"Refresh" : ["Yenile", "Erfrischen", "Actualizar", "Rinfrescare", "Verversen", "Felfrissít", "Actualiser", "Päivitä"], //google translate non-PT langs
			"Refresh Stats" : ["İstatistikleri Yenile", "Erfrischen Statistik", "Estatística", "Rinfrescare Statistiche", "Verversen Statistieken", "Frissítés Stats", "Actualiser Les Stats", "Päivitä tiedot"], //google translate non-PT langs 'refresh' + statistics label
			"Side:" : ["Taraf:", "Seite", "Lado:", "", "Zijde", "", "Côté", "Sijainti:"],
			"Left" : ["Sol", "Links", "Esquerda", "", "Links", "", "Gauche", "Vasen"],
			"Right" : ["Sağ", "Rechts", "Direita", "", "Rechts", "", "Droite", "Oikea"],
			"Locks:" : ["Kilitler:", "Freigabe", "Bloquear:", "", "Vergrendelingen:", "", "Vérouiller:", "Varmistimet:"],
			"Attack" : ["Saldırı", "Angriff", "Atacar", "", "Aanvallen", "", "Attaquer", "Hyökkäys"],
			"Repair" : ["Onarım", "Reparatur", "Reparar", "", "Repareren", "", "Réparer", "Korjaus"],
			"Reset" : ["Sıfırla", "", "", "", "", "", "", "Palauta"],
			"Simulation will be based on most recently refreshed stats!" : ["Simulasyon en son güncellenen istatistiklere göre yapılacaktır!", "Die Simulation basiert auf den zuletzt aktualisierten Stand", "A simulação vai ser baseada na mais recente data!", "", "Simulatie zal gebaseerd worden op meest recentelijke ververste statistieken!", "", "La Simulation sera basée en fonction des dernières stats actualisées !", "Simulaatio suoritetaan viimeisimmän päivityksen tiedoilla!"],
			"Unlock Attack Button" : ["Saldırı Düğmesinin Kilidini Aç", "Angriffsbutton freigeben", "Desbloquear o botão de ataque", "Sblocca pulsante d'attacco", "Ontgrendel Aanvalsknop", "a Támadás gomb feloldása", "Débloquer Le Bouton d'Attaque", "Poista hyökkäusnapin lukitus"],
			"Unlock Repair Button" : ["Onarım Düğmesinin Kilidini Aç", "Reparaturbutton freigeben", "Desbloquear botão de reparação", "", "Ontgrendel Repareerknop", "", "Débloquer Le Bouton de Réparation", "Poista korjausnapin lukitus"],
			"Unlock Reset Button" : ["Sıfırlama Düğmesinin Kilidini Aç", "", "", "", "", "", "", "Avaa Tyhjennä nappi"],
			"SKIP": ["ATLA", "", "", "", "", "", "", ""],
			"Skip to end" : ["Simulasyonu atla", "Zum Ende Vorspringen", "", "", "", "", "", "Mene loppuun"],
			"Reset Formation" : ["Dizilişi Sıfırla", "", "", "", "", "", "", "Palauta armeijan oletusasetelma"],
			"Flip Horizontal" : ["Yatay Çevir", "Horizontal Spiegeln", "", "", "", "", "", "Käännä vaakasuunnassa"],
			"Flip Vertical" : ["Dikey Çevir", "Vertikal Spiegeln", "", "", "", "", "", "Käännä pystysuunnassa"],
			"Activate All" : ["Hepsini Aktifleştir", "Alle Aktivieren", "", "", "", "", "", "Aktivoi kaikki"],
			"Deactivate All" : ["Hepsini Deaktifleştir", "Alle Deaktivieren", "", "", "", "", "", "Poista kaikki käytöstä"],
			"Activate Infantry" : ["Piyadeleri Aktifleştir", "Infanterie Aktivieren", "", "", "", "", "", "Aktivoi jalkaväki"],
			"Deactivate Infantry" : ["Piyadeleri Deaktifleştir", "Infanterie Deaktivieren", "", "", "", "", "", "Poista jalkaväki käytöstä"],
			"Activate Vehicles" : ["Motorlu Birlikleri Aktifleştir", "Fahrzeuge Aktivieren", "", "", "", "", "", "Aktivoi ajoneuvot"],
			"Deactivate Vehicles" : ["Motorlu Birlikleri Deaktifleştir", "Fahrzeuge Deaktivieren", "", "", "", "", "", "Poista ajoneuvot käytöstä"],
			"Activate Air" : ["Hava Araçlarını Aktifleştir", "Flugzeuge Aktivieren", "", "", "", "", "", "Aktivoi lentokoneet"],
			"Deactivate Air" : ["Hava Araçlarını Deaktifleştir", "Flugzeuge Deaktivieren", "", "", "", "", "", "Poista lentokoneet käytöstä"],
			"Activate Repair Mode" : ["Onarım Modunu Aç", "Reparatur Modus Aktivieren", "", "", "", "", "", "Aktivoi korjaustila"],
			"Deactivate Repair Mode" : ["Onarım Modunu Kapat", "Reparatur Modus Deaktivieren", "", "", "", "", "", "Poista korjaustila käytöstä"],
			"Version: " : ["Sürüm: ", "", "", "", "", "", "", "Versio: "],
			"Mark saved targets on region map" : ["Kaydedilmiş hedefleri haritada işaretle", "Gespeicherte Ziele auf der Karte Markieren", "", "", "", "", "", "Merkitse tallennetut kohteet alue kartalle"], // region view
			"Enable 'Double-click to (De)activate units'" : ["Çift-tıklama ile birlikleri (de)aktifleştirmeyi etkinleştir", "Doppel-Klick zum Einheiten (De)-Aktivieren ", "", "", "", "", "", "Tuplaklikkaus aktivoi/deaktivoi yksiköt"],
			"Show Stats During Attack" : ["İstatistikleri saldırı sırasında göster", "", "", "", "", "", "", "Näytä tiedot -ikkuna hyökkäyksen aikana"],
			"Show Stats During Simulation" : ["İstatistikleri simulasyondayken göster", "", "", "", "", "", "", "Näytä tiedot -ikkuna simuloinnin aikana"],
			"Skip Victory-Popup After Battle" : ["Savaş Bitiminde Zafer Bildirimini Atla", "", "", "", "", "", "", "Ohita taistelun jälkeinen voittoruutu"],
			"Stats Window Opacity" : ["İstatistik Penceresi Saydamlığı", "", "", "", "", "", "", "Tiedot -ikkunan läpinäkyvyys"],
			"Disable Unit Tooltips In Army Formation Manager" : ["Ordu Dizilişi Yöneticisinde Birlik İpuçlarını Gizle", "", "", "", "", "", "", "Poista käytöstä yksiköiden työkaluvihjeet armeijan muodostamisikkunassa"],
			"Disable Tooltips In Attack Preparation View" : ["Saldırı Hazırlık Görünümünde İpuçlarını Gizle", "", "", "", "", "", "", "Poista työkaluvihjeet käytöstä hyökkäyksen valmisteluikkunassa"],
			"Undo" : ["Geri Al", "", "", "", "", "", "", "Kumoa"],
			"Redo" : ["İleri Al", "", "", "", "", "", "", "Tee uudelleen"],
			"Open Stats Window" : ["İstatistik Penceresini Aç", "", "", "", "", "", "", "Avaa tiedot -ikkuna"]
		};

		function lang(text) {
			try {
				if (languages.indexOf(locale) > -1) {
					var translated = translations[text][languages.indexOf(locale)];
					if (translated !== "") {
						return translated;
					} else {
						return text;
					}
				} else {
					return text;
				}
			} catch (e) {
				console.log(e);
				//console.log("Text is undefined: "+text);
				return text;
			}
		}

		function CreateTweak() {
			var TASuite = {};
			qx.Class.define("TACS", {
				type : "singleton",
				extend : qx.core.Object,
				members : {
					// Default settings
					saveObj : {
						// section.option
						section : {
							option : "foo"
						},
						bounds : {
							battleResultsBoxLeft : 125,
							battleResultsBoxTop : 125
						},
						checkbox : {
							showStatsDuringAttack : true,
							showStatsDuringSimulation : true,
							skipVictoryPopup : false,
							disableArmyFormationManagerTooltips : false,
							disableAttackPreparationTooltips : false
						},
						audio : {
							playRepairSound : true
						},
						slider : {
							statsOpacity : 100
						}
					},
					buttons : {
						attack : {
							layout : {
								save : null, // buttonLayoutSave
								load : null // buttonLayoutLoad
							},
							simulate : null, // buttonSimulateCombat
							unlock : null, // buttonUnlockAttack
							repair : null, // buttonUnlockRepair
							unlockReset : null, // buttonUnlockReset
							tools : null, // buttonTools
							refreshStats : null, // buttonRefreshStats
							formationReset : null, // buttonResetFormation
							flipVertical : null, // buttonFlipVertical
							flipHorizontal : null, // buttonFlipHorizontal
							activateInfantry : null, // buttonActivateInfantry
							activateVehicles : null, // buttonActivateVehicles
							activateAir : null, // buttonActivateAir
							activateAll : null, // buttonActivateAll
							repairMode : null, // buttonToggleRepairMode
							toolbarRefreshStats : null, // buttontoolbarRefreshStats
							toolbarShowStats : null,
							toolbarUndo : null,
							toolbarRedo : null,
							options : null // buttonOptions
						},
						simulate : {
							back : null, // buttonReturnSetup
							skip : null // buttonSkipSimulation
						},
						shiftFormationUp : null,
						shiftFormationDown : null,
						shiftFormationLeft : null,
						shiftFormationRight : null,
						optionStats : null
					},
					stats : {
						spoils : {
							tiberium : null, // tiberiumSpoils
							crystal : null, // crystalSpoils
							credit : null, // creditSpoils
							research : null // researchSpoils
						},
						health : {
							infantry : null, // lastInfantryPercentage
							vehicle : null, // lastVehiclePercentage
							aircraft : null, // lastAirPercentage
							overall : null // lastPercentage
						},
						repair : {
							infantry : null, // lastInfantryRepairTime
							vehicle : null, // lastVehicleRepairTime
							aircraft : null, // lastAircraftRepairTime
							overall : null, // lastRepairTime
							available : null, // storedRepairTime
							max : null // maxRepairCharges
						},
						attacks : {
							availableCP : null,
							attackCost : null,
							availableAttacksCP: null,
							availableAttacksAtFullStrength: null,
							availableAttacksWithCurrentRepairCharges: null
						},
						damage : {
							units : {
								overall : null // lastEnemyUnitsPercentage
							},
							structures : {
								construction : null, // lastCYPercentage
								defense : null, // lastDFPercentage
								command : null, // lastCCPercentage
								support : null,
								overall : null // lastEnemyBuildingsPercentage
							},
							overall : null // lastEnemyPercentage
						},
						time : null,
						supportLevel : null
					},
					labels : {
						health : {
							infantry : null, // infantryTroopStrengthLabel
							vehicle : null, // vehicleTroopStrengthLabel
							aircraft : null, // airTroopStrengthLabel
							overall : null // simTroopDamageLabel
						},
						repair : {
							available : null
						},
						repairinfos : {
							infantry : null,
							vehicle : null,
							aircraft : null,
							available : null
						},
						attacks : {
							available : null
						},
						damage : {
							units : {
								overall : null // enemyUnitsStrengthLabel
							},
							structures : {
								construction : null, // CYTroopStrengthLabel
								defense : null, // DFTroopStrengthLabel
								command : null, // CCTroopStrengthLabel
								support : null, // enemySupportStrengthLabel
								overall : null // enemyBuildingsStrengthLabel
							},
							overall : null, // enemyTroopStrengthLabel
							outcome : null // simVictoryLabel
						},
						time : null, // simTimeLabel
						supportLevel : null, // enemySupportLevelLabel
						countDown : null // countDownLabel
					},
					view : {
						playerCity : null,
						playerCityDefenseBonus : null,
						ownCity : null,
						ownCityId : null,
						targetCityId : null,
						lastUnits : null,
						lastUnitList : null
					},
					layouts : {
						label : null,
						list : null,
						all : null,
						current : null,
						restore : null
					},
					options : {
						autoDisplayStats : null,
						showShift : null,
						sideLabel : null,
						locksLabel : null,
						leftSide : null,
						rightSide : null,
						attackLock : null,
						repairLock : null,
						markSavedTargets : null,
						dblClick2DeActivate : null,
						showStatsDuringAttack : null,
						showStatsDuringSimulation : null,
						skipVictoryPopup : null,
						statsOpacityLabel : null,
						statsOpacity : null,
						statsOpacityOutput: null,
						disableArmyFormationManagerTooltips : null,
						disableAttackPreparationTooltips : null
					},
					audio : {
						soundRepairImpact : null,
						soundRepairReload : null
					},

					_Application : null,
					_MainData : null,
					_Cities : null,
					_VisMain : null,
					_ActiveView : null,
					_PlayArea : null,
					_armyBarContainer : null,
					_armyBar : null,
					attacker_modules : null,
					defender_modules : null,

					battleResultsBox : null,
					optionsWindow : null,
					statsPage : null,
					lastSimulation : null,
					count : null,
					counter : null,
					statsOnly : null,
					simulationWarning : null,
					warningIcon : null,
					userInterface : null,
					infantryActivated : null,
					vehiclesActivated : null,
					airActivated : null,
					allActivated : null,
					toolBar : null,
					toolBarParent : null,
					TOOL_BAR_LOW : 113, // hidden
					TOOL_BAR_HIGH : 155, // popped-up
					TOOL_BAR_WIDTH : 740,

					repairInfo : null,
					repairButtons : [],
					repairButtonsRedrawTimer : null,
					armybarClickCount : null,
					armybarClearnClickCounter : null,
					repairModeTimer : null,
					curPAVM : null,
					curViewMode : null,
					DEFAULTS : null,
					undoCache : [],
					ts1 : null, //timestamps
					ts2 : null,
					attackUnitsLoaded : null,

					loadData : function () {
						var str = localStorage.getItem("TACS");
						var temp;
						// this needs to be thoroughly checked
						if (str != null) {
							//previous options found
							temp = JSON.parse(str);
							for (var i in this.saveObj) {
								if (typeof temp[i] == "object") {
									for (var j in this.saveObj[i]) {
										if (typeof temp[i][j] == "object") {
											//recurse deeper?
										} else if (typeof temp[i][j] == "undefined") {
											// create missing option
											console.log("Creating missing save option: " + i + "." + j);
											temp[i][j] = this.saveObj[i][j];
										}
									}
								} else if (typeof temp[i] == "undefined") {
									// create missing option section
									console.log("Creating missing option section: " + i);
									temp[i] = this.saveObj[i];
								}
							}
							this.saveObj = temp;
							this.saveData();
						}
					},
					saveData : function () {
						var obj = this.saveObj || window.TACS.getInstance().saveObj;
						var str = JSON.stringify(obj);
						localStorage.setItem("TACS", str);
					},
					initialize : function () {
						try {
							this.loadData();
							locale = qx.locale.Manager.getInstance().getLocale();
							this.targetCityId = "0";

							// Store references
							this._Application = qx.core.Init.getApplication();
							this._MainData = ClientLib.Data.MainData.GetInstance();
							this._VisMain = ClientLib.Vis.VisMain.GetInstance();
							this._ActiveView = this._VisMain.GetActiveView();
							this._PlayArea = this._Application.getPlayArea();
							this._armyBarContainer = this._Application.getArmySetupAttackBar();
							this._armyBar = this._Application.getUIItem(ClientLib.Data.Missions.PATH.BAR_ATTACKSETUP);

							// Fix Defense Bonus Rounding
							for (var key in ClientLib.Data.City.prototype) {
									if (typeof ClientLib.Data.City.prototype[key] === 'function') {
										var strFunction = ClientLib.Data.City.prototype[key].toString();
										if (strFunction.indexOf("Math.floor(a.adb)") > -1) {
											ClientLib.Data.City.prototype[key] = this.fixBonusRounding(ClientLib.Data.City.prototype[key], "a");
											break;
										}
									}
								}

							// Event Handlers
							phe.cnc.Util.attachNetEvent(ClientLib.API.Battleground.GetInstance(), "OnSimulateBattleFinished", ClientLib.API.OnSimulateBattleFinished, this, this.onSimulateBattleFinishedEvent);
							phe.cnc.Util.attachNetEvent(this._VisMain, "ViewModeChange", ClientLib.Vis.ViewModeChange, this, this.viewChangeHandler);
							phe.cnc.Util.attachNetEvent(this._MainData.get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, this.ownCityChangeHandler);

							// Setup Button
							this.buttons.simulate.back = new qx.ui.form.Button(lang("Setup"));
							this.buttons.simulate.back.set({
								width : 80,
								appearance : "button-text-small",
								toolTipText : lang("Return to Combat Setup")
							});
							this.buttons.simulate.back.addListener("click", this.returnSetup, this);

							// Skip to end Button
							this.buttons.simulate.skip = new qx.ui.form.Button(lang("SKIP"));
							this.buttons.simulate.skip.set({
								width : 50,
								height : 21,
								appearance : "button-text-small",
								toolTipText : lang("Skip to end")
							});
							this.buttons.simulate.skip.addListener("click", this.skipSimulation, this);

							var replayBar = this._Application.getReportReplayOverlay();
							replayBar.add(this.buttons.simulate.back, {
								top : 12,
								left : 150
							});
							if (typeof(CCTAWrapper_IsInstalled) != 'undefined' && CCTAWrapper_IsInstalled) {
								replayBar.add(this.buttons.simulate.skip, {
									top : 38,
									left : 460
								});
							}

							// Unlock Button
							this.buttons.attack.unlock = new qx.ui.form.Button(lang("Unlock"));
							this.buttons.attack.unlock.set({
								width : 45,
								height : 45,
								padding : 0,
								appearance : "button-text-small",
								toolTipText : lang("Unlock Attack Button")
							});
							this.buttons.attack.unlock.addListener("click", this.unlockAttacks, this);
							this.buttons.attack.unlock.setOpacity(0.5);
							var temp = localStorage.ta_sim_attackLock;
							if (temp) {
								temp = JSON.parse(localStorage.ta_sim_attackLock);
							} else {
								temp = true;
							}
							if (temp) {
								this._armyBar.add(this.buttons.attack.unlock, {
									top : 108,
									right : 9
								});
							}

							// Unlock Repair
							this.buttons.attack.repair = new qx.ui.form.Button(lang("Unlock"));
							this.buttons.attack.repair.set({
								width : 45,
								height : 45,
								padding : 0,
								appearance : "button-text-small",
								toolTipText : lang("Unlock Repair Button")
							});
							this.buttons.attack.repair.addListener("click", this.unlockRepairs, this);
							this.buttons.attack.repair.setOpacity(0.5);
							var temp = localStorage.ta_sim_repairLock;
							if (temp) {
								temp = JSON.parse(localStorage.ta_sim_repairLock);
							} else {
								temp = true;
							}
							if (temp) {
								this._armyBar.add(this.buttons.attack.repair, {
									top : 16,
									right : 9
								});
							}

							var battleUnitData = ClientLib.Data.CityPreArmyUnit.prototype;
							if (!battleUnitData.set_Enabled_Original) {
								battleUnitData.set_Enabled_Original = battleUnitData.set_Enabled;
							}
							battleUnitData.set_Enabled = function (a) {
								this.set_Enabled_Original(a);
								window.TACS.getInstance().formationChangeHandler();
							};
							if (!battleUnitData.MoveBattleUnit_Original) {
								battleUnitData.MoveBattleUnit_Original = battleUnitData.MoveBattleUnit;
							}
							battleUnitData.MoveBattleUnit = function (a, b) {
								var _this = window.TACS.getInstance();
								if (_this.options.dblClick2DeActivate.getValue()) {
									if (_this.armybarClickCount >= 2) {
										if (this.get_CoordX() === a && this.get_CoordY() === b) {
											var enabledState = this.get_Enabled();
											enabledState ^= true;
											this.set_Enabled_Original(enabledState);
										}
									}
								}
								this.MoveBattleUnit_Original(a, b);
								_this.formationChangeHandler();
								_this.armybarClickCount = 0;
								clearInterval(_this.armybarClearnClickCounter);
							};

							this.loadLayouts();

							// The Options Window
							this.optionsWindow = new qx.ui.window.Window(lang("Options"), "FactionUI/icons/icon_forum_properties.png").set({
									contentPaddingTop : 1,
									contentPaddingBottom : 8,
									contentPaddingRight : 8,
									contentPaddingLeft : 8,
									width : 400,
									height : 400,
									showMaximize : false,
									showMinimize : false,
									allowMaximize : false,
									allowMinimize : false,
									resizable : false
								});
							this.optionsWindow.getChildControl("icon").set({
								scale : true,
								width : 25,
								height : 25
							});
							this.optionsWindow.setLayout(new qx.ui.layout.VBox());
							var optionsWindowTop = localStorage.ta_sim_options_top;
							if (optionsWindowTop) {
								optionsWindowTop = JSON.parse(localStorage.ta_sim_options_top);
								var optionsWindowLeft = JSON.parse(localStorage.ta_sim_options_left);
								this.optionsWindow.moveTo(optionsWindowLeft, optionsWindowTop);
							} else {
								this.optionsWindow.center();
							}
							this.optionsWindow.addListener("close", function () {
								localStorage.ta_sim_options_top = JSON.stringify(this.optionsWindow.getLayoutProperties().top);
								localStorage.ta_sim_options_left = JSON.stringify(this.optionsWindow.getLayoutProperties().left);
								this.saveData();
							}, this);

							// The Battle Simulator box
							this.battleResultsBox = new qx.ui.window.Window("TACS", "FactionUI/icons/icon_res_plinfo_command_points.png").set({
									contentPaddingTop : 0,
									contentPaddingBottom : 2,
									contentPaddingRight : 2,
									contentPaddingLeft : 6,
									showMaximize : false,
									showMinimize : false,
									allowMaximize : false,
									allowMinimize : false,
									resizable : false
								});
							this.battleResultsBox.getChildControl("icon").set({
								scale : true,
								width : 20,
								height : 20,
								alignY: "middle"
							});
							this.battleResultsBox.setLayout(new qx.ui.layout.HBox());
							this.battleResultsBox.moveTo(this.saveObj.bounds.battleResultsBoxLeft, this.saveObj.bounds.battleResultsBoxTop);
							this.battleResultsBox.addListener("move", function () {
								this.saveObj.bounds.battleResultsBoxLeft = this.battleResultsBox.getBounds().left;
								this.saveObj.bounds.battleResultsBoxTop = this.battleResultsBox.getBounds().top;
								this.saveData();
							}, this);
							this.battleResultsBox.addListener("appear", function () {
								this.battleResultsBox.setOpacity(this.saveObj.slider.statsOpacity/100);
							}, this);
							var tabView = new qx.ui.tabview.TabView().set({
									contentPaddingTop : 3,
									contentPaddingBottom : 6,
									contentPaddingRight : 7,
									contentPaddingLeft : 3
								});
							this.battleResultsBox.add(tabView);
							this.initializeStats(tabView);
							this.initializeLayout(tabView);
							this.initializeInfo(tabView);
							this.initializeOptions();
							this.setupInterface();
							this.createBasePlateFunction(ClientLib.Vis.Region.RegionNPCCamp);
							this.createBasePlateFunction(ClientLib.Vis.Region.RegionNPCBase);
							this.createBasePlateFunction(ClientLib.Vis.Region.RegionCity);

							// Fix armyBar container divs, the mouse has a horrible offset in the armybar when this is enabled
							// if this worked it would essentially fix a layout bug, shame... using zIndex instead
							// Abort, Retry, Fail?
							/*
							this._armyBar.getLayoutParent().getContentElement().getParent().setStyles({
							height : "155px"
							});
							this._armyBar.getLayoutParent().getContentElement().setStyles({
							height : "155px"
							});
							this._armyBar.getLayoutParent().setLayoutProperties({
							bottom : 0
							});
							this._armyBar.getLayoutParent().setHeight(155);
							this._armyBar.setLayoutProperties({
							top : -5
							});
							 */
							// putting overlays in front so we have 19 layers to work with behind them
							// zIndex 5 is reserved for Shiva
							this.gameOverlaysToFront();
						} catch (e) {
							console.log(e);
						}
					},
					fixBonusRounding: function (bonus, data) {
							try {
								if (data == null) data = "";
								var strFunction = bonus.toString();
								strFunction = strFunction.replace("floor", "round");
								var functionBody = strFunction.substring(strFunction.indexOf("{") + 1, strFunction.lastIndexOf("}"));
								var fn = Function(data, functionBody);
								return fn;
							} catch (e) {
								console.log("fixBonusRounding error: ", e);
							}
						},
					initializeStats : function (tabView) {
						try {
							////////////////// Stats ////////////////////
							this.statsPage = new qx.ui.tabview.Page(lang("Stats"));
							this.statsPage.setLayout(new qx.ui.layout.VBox(1));
							tabView.add(this.statsPage);

							// Refresh Vertical Box
							var container = new qx.ui.container.Composite();
							var layout = new qx.ui.layout.Grid();
							layout.setColumnAlign(0, "left", "middle");
							layout.setColumnAlign(1, "right", "middle");
							layout.setColumnFlex(0, 1);
							layout.setRowHeight(0, 15);
							container.setLayout(layout);
							container.setThemedFont("bold");
							container.setThemedBackgroundColor("#eef");
							this.statsPage.add(container);

							// Countdown for next refresh
							this.labels.countDown = new qx.ui.basic.Label("");
							this.labels.countDown.set({
								width : 0,
								height : 10,
								marginLeft : 5,
								backgroundColor : "#B40404"
							});
							container.add(this.labels.countDown, {
								row : 0,
								column : 0
							});

							this.buttons.attack.refreshStats = new qx.ui.form.Button(lang("Refresh"));
							this.buttons.attack.refreshStats.set({
								width : 58,
								appearance : "button-text-small",
								toolTipText : lang("Refresh Stats")
							});
							this.buttons.attack.refreshStats.addListener("click", this.refreshStatistics, this);
							container.add(this.buttons.attack.refreshStats, {
								row : 0,
								column : 1
							});

							// The Enemy Vertical Box
							var container = new qx.ui.container.Composite();
							var layout = new qx.ui.layout.Grid();
							layout.setColumnAlign(1, "right", "middle");
							layout.setColumnFlex(0, 1);
							container.setLayout(layout);
							container.setThemedFont("bold");
							container.setThemedBackgroundColor("#eef");
							this.statsPage.add(container);

							// The Enemy Troop Strength Label
							container.add(new qx.ui.basic.Label(lang("Enemy Base:")), {
								row : 0,
								column : 0
							});
							this.labels.damage.overall = new qx.ui.basic.Label("100");
							container.add(this.labels.damage.overall, {
								row : 0,
								column : 1
							});

							// Units
							container.add(new qx.ui.basic.Label(lang("Defences:")), {
								row : 1,
								column : 0
							});
							this.labels.damage.units.overall = new qx.ui.basic.Label("100");
							container.add(this.labels.damage.units.overall, {
								row : 1,
								column : 1
							});

							// Buildings
							container.add(new qx.ui.basic.Label(lang("Buildings:")), {
								row : 2,
								column : 0
							});
							this.labels.damage.structures.overall = new qx.ui.basic.Label("100");
							container.add(this.labels.damage.structures.overall, {
								row : 2,
								column : 1
							});

							// Command Center
							container.add(new qx.ui.basic.Label(lang("Construction Yard:")), {
								row : 3,
								column : 0
							});
							this.labels.damage.structures.construction = new qx.ui.basic.Label("100");
							container.add(this.labels.damage.structures.construction, {
								row : 3,
								column : 1
							});

							// Defense Facility
							container.add(new qx.ui.basic.Label(lang("Defense Facility:")), {
								row : 4,
								column : 0
							});
							this.labels.damage.structures.defense = new qx.ui.basic.Label("100");
							container.add(this.labels.damage.structures.defense, {
								row : 4,
								column : 1
							});

							// Command Center
							container.add(new qx.ui.basic.Label(lang("Command Center:")), {
								row : 5,
								column : 0
							});
							this.labels.damage.structures.command = new qx.ui.basic.Label("100");
							container.add(this.labels.damage.structures.command, {
								row : 5,
								column : 1
							});

							// The Support Horizontal Box
							this.labels.supportLevel = new qx.ui.basic.Label("");
							container.add(this.labels.supportLevel, {
								row : 6,
								column : 0
							});
							this.labels.damage.structures.support = new qx.ui.basic.Label("");
							container.add(this.labels.damage.structures.support, {
								row : 6,
								column : 1
							});

							// The Troops Vertical Box
							container = new qx.ui.container.Composite();
							layout = new qx.ui.layout.Grid();
							layout.setColumnAlign(1, "right", "middle");
							layout.setColumnFlex(0, 1);
							container.setLayout(layout);
							container.setThemedFont("bold");
							container.setThemedBackgroundColor("#eef");
							this.statsPage.add(container);

							// The Troop Strength Label
							container.add(new qx.ui.basic.Label(lang("Overall:")), {
								row : 0,
								column : 0
							});
							this.labels.health.overall = new qx.ui.basic.Label("100");
							container.add(this.labels.health.overall, {
								row : 0,
								column : 1
							});

							// The Infantry Troop Strength Label
							container.add(new qx.ui.basic.Label(lang("Infantry:")), {
								row : 1,
								column : 0
							});
							this.labels.health.infantry = new qx.ui.basic.Label("100");
							container.add(this.labels.health.infantry, {
								row : 1,
								column : 1
							});

							// The Vehicle Troop Strength Label
							container.add(new qx.ui.basic.Label(lang("Vehicle:")), {
								row : 2,
								column : 0
							});
							this.labels.health.vehicle = new qx.ui.basic.Label("100");
							container.add(this.labels.health.vehicle, {
								row : 2,
								column : 1
							});

							// The Air Troop Strength Label
							container.add(new qx.ui.basic.Label(lang("Aircraft:")), {
								row : 3,
								column : 0
							});
							this.labels.health.aircraft = new qx.ui.basic.Label("100");
							container.add(this.labels.health.aircraft, {
								row : 3,
								column : 1
							});

							// The inner Vertical Box
							container = new qx.ui.container.Composite();
							layout = new qx.ui.layout.Grid();
							layout.setColumnAlign(1, "right", "middle");
							layout.setColumnFlex(0, 1);
							container.setLayout(layout);
							container.setThemedFont("bold");
							container.setThemedBackgroundColor("#eef");
							this.statsPage.add(container);

							// The Victory Label
							container.add(new qx.ui.basic.Label(lang("Outcome:")), {
								row : 0,
								column : 0
							});
							this.labels.damage.outcome = new qx.ui.basic.Label(lang("Unknown"));
							container.add(this.labels.damage.outcome, {
								row : 0,
								column : 1
							});

							// The Battle Time Label
							container.add(new qx.ui.basic.Label(lang("Battle Time:")), {
								row : 1,
								column : 0
							});
							this.labels.time = new qx.ui.basic.Label("120");
							container.add(this.labels.time, {
								row : 1,
								column : 1
							});
							
							// Available RT/Attacks Vertical Box
							container = new qx.ui.container.Composite();
							layout = new qx.ui.layout.Grid();
							layout.setColumnAlign(1, "right", "middle");
							layout.setColumnFlex(0, 1);
							container.setLayout(layout);
							container.setThemedFont("bold");
							container.setThemedBackgroundColor("#eef");
							this.statsPage.add(container);

							// Available Repair Time Label
							container.add(new qx.ui.basic.Label(lang("Available Repair:")), {
								row : 0,
								column : 0
							});
							this.labels.repair.available = new qx.ui.basic.Label("00:00:00");
							container.add(this.labels.repair.available, {
								row : 0,
								column : 1
							});

							// Available Attacks Label
							container.add(new qx.ui.basic.Label(lang("Available Attacks:")), {
								row : 1,
								column : 0
							});
							this.labels.attacks.available = new qx.ui.basic.Label("CP:- / FR:- / CFR:-");
							container.add(this.labels.attacks.available, {
								row : 1,
								column : 1
							});
						} catch (e) {
							console.log(e);
						}
					},
					initializeLayout : function (tabView) {
						try {
							////////////////// Layouts ////////////////////
							var layoutPage = new qx.ui.tabview.Page(lang("Layouts"));
							layoutPage.setLayout(new qx.ui.layout.VBox());
							tabView.add(layoutPage);

							this.layouts.list = new qx.ui.form.List();
							this.layouts.list.set({
								height : 174,
								selectionMode : "one"
							});
							layoutPage.add(this.layouts.list);

							// Add the two buttons for save and load
							var layHBox = new qx.ui.container.Composite();
							layHBox.setLayout(new qx.ui.layout.HBox(5));

							// Load button
							this.buttons.attack.layout.load = new qx.ui.form.Button(lang("Load"));
							this.buttons.attack.layout.load.set({
								width : 80,
								appearance : "button-text-small",
								toolTipText : lang("Load this saved layout.")
							});
							this.buttons.attack.layout.load.addListener("click", this.loadCityLayout, this);
							layHBox.add(this.buttons.attack.layout.load);

							// Delete button
							this.buttonLayoutDelete = new qx.ui.form.Button(lang("Delete"));
							this.buttonLayoutDelete.set({
								width : 80,
								appearance : "button-text-small",
								toolTipText : lang("Delete this saved layout.")
							});
							this.buttonLayoutDelete.addListener("click", this.deleteCityLayout, this);
							layHBox.add(this.buttonLayoutDelete);
							layoutPage.add(layHBox);

							var layVBox = new qx.ui.container.Composite();
							layVBox.setLayout(new qx.ui.layout.VBox(1));
							layVBox.setThemedFont("bold");
							layVBox.setThemedPadding(2);
							layVBox.setThemedBackgroundColor("#eef");

							// The Label Textbox
							var layHBox2 = new qx.ui.container.Composite();
							layHBox2.setLayout(new qx.ui.layout.HBox(5));
							layHBox2.add(new qx.ui.basic.Label(lang("Name: ")));
							this.layouts.label = new qx.ui.form.TextField();
							this.layouts.label.setValue("");
							layHBox2.add(this.layouts.label);
							layVBox.add(layHBox2);

							// Save Button
							this.buttons.attack.layout.save = new qx.ui.form.Button(lang("Save"));
							this.buttons.attack.layout.save.set({
								width : 80,
								appearance : "button-text-small",
								toolTipText : lang("Save this layout.")
							});
							this.buttons.attack.layout.save.addListener("click", this.saveCityLayout, this);
							layVBox.add(this.buttons.attack.layout.save);
							layoutPage.add(layVBox);
						} catch (e) {
							console.log(e);
						}
					},
					initializeInfo : function (tabView) {
						try {
							////////////////// Info ////////////////////
							var infoPage = new qx.ui.tabview.Page(lang("Info"));
							infoPage.setLayout(new qx.ui.layout.VBox(1));
							tabView.add(infoPage);

							// The Help Vertical Box
							var pVBox = new qx.ui.container.Composite();
							pVBox.setLayout(new qx.ui.layout.VBox(1));
							pVBox.setThemedFont("bold");
							pVBox.setThemedPadding(2);
							pVBox.setThemedBackgroundColor("#eef");
							infoPage.add(pVBox);
							var proHelpBar = new qx.ui.basic.Label().set({
									value : "<a target='_blank' href='http://userscripts.org/scripts/discuss/138212'>" + lang("Forums") + "</a>",
									rich : true
								});
							pVBox.add(proHelpBar);

							// The Spoils
							var psVBox = new qx.ui.container.Composite();
							psVBox.setLayout(new qx.ui.layout.VBox(1));
							psVBox.setThemedFont("bold");
							psVBox.setThemedPadding(2);
							psVBox.setThemedBackgroundColor("#eef");
							infoPage.add(psVBox);
							psVBox.add(new qx.ui.basic.Label(lang("Spoils")));
							// Tiberium
							this.stats.spoils.tiberium = new qx.ui.basic.Atom("0", "webfrontend/ui/common/icn_res_tiberium.png");
							psVBox.add(this.stats.spoils.tiberium);
							// Crystal
							this.stats.spoils.crystal = new qx.ui.basic.Atom("0", "webfrontend/ui/common/icn_res_chrystal.png");
							psVBox.add(this.stats.spoils.crystal);
							// Credits
							this.stats.spoils.credit = new qx.ui.basic.Atom("0", "webfrontend/ui/common/icn_res_dollar.png");
							psVBox.add(this.stats.spoils.credit);
							// Research
							this.stats.spoils.research = new qx.ui.basic.Atom("0", "webfrontend/ui/common/icn_res_research_mission.png");
							psVBox.add(this.stats.spoils.research);

							// Options Page
							var pssVBox = new qx.ui.container.Composite();
							var layout = new qx.ui.layout.Grid();
							//layout.setColumnFlex(2, 1);
							pssVBox.setLayout(layout);
							pssVBox.setThemedFont("bold");
							pssVBox.setThemedBackgroundColor("#eef");
							infoPage.add(pssVBox);

							this.buttons.optionStats = new qx.ui.form.Button().set({
									height : 25,
									width : 160,
									margin : 15,
									alignX : "center",
									label : lang("Options"),
									appearance : "button-text-small",
									icon : "FactionUI/icons/icon_forum_properties.png",
									toolTipText : lang("TACS Options")
								});
							this.buttons.optionStats.addListener("click", this.toggleOptionsWindow, this);
							pssVBox.add(this.buttons.optionStats, {
								row : 0,
								column : 0
							});

							/*
							// Popup Checkbox
							this.options.autoDisplayStats = new qx.ui.form.CheckBox(lang("Auto display this box"));
							var temp = localStorage.ta_sim_autoDisplayStats;
							if (temp) {
							temp = JSON.parse(localStorage.ta_sim_autoDisplayStats);
							this.options.autoDisplayStats.setValue(temp);
							} else {
							this.options.autoDisplayStats.setValue(true);
							}
							this.options.autoDisplayStats.addListener("click", this.optionPopup, this);
							pssVBox.add(this.options.autoDisplayStats, {
							row: 1,
							column: 0,
							colSpan: 3
							});

							// showShift Checkbox
							this.options.showShift = new qx.ui.form.CheckBox(lang("Show shift buttons"));
							var temp = localStorage.ta_sim_showShift;
							if (temp) {
							temp = JSON.parse(localStorage.ta_sim_showShift);
							this.options.showShift.setValue(temp);
							} else {
							this.options.showShift.setValue(true);
							}
							this.options.showShift.addListener("click", this.optionShowShift, this);
							pssVBox.add(this.options.showShift, {
							row: 3,
							column: 0,
							colSpan: 3
							});

							// side RadioButtons
							this.options.sideLabel = new qx.ui.basic.Label(lang("Side:"));
							this.options.leftSide = new qx.ui.form.RadioButton(lang("Left"));
							this.options.rightSide = new qx.ui.form.RadioButton(lang("Right"));
							var sideRadioGroup = new qx.ui.form.RadioGroup();
							sideRadioGroup.add(this.options.leftSide, this.options.rightSide);
							var temp = localStorage.ta_sim_side;
							if (temp) {
							temp = JSON.parse(localStorage.ta_sim_side);
							this.options.rightSide.setValue(temp);
							} else {
							this.options.rightSide.setValue(true);
							}
							sideRadioGroup.addListener("changeSelection", this.setupInterface, this);
							pssVBox.add(this.options.sideLabel, {
							row: 4,
							column: 0
							});
							pssVBox.add(this.options.leftSide, {
							row: 4,
							column: 1
							});
							pssVBox.add(this.options.rightSide, {
							row: 4,
							column: 2
							});

							// locks Checkboxes
							this.options.locksLabel = new qx.ui.basic.Label(lang("Locks:"));
							this.options.attackLock = new qx.ui.form.CheckBox(lang("Attack"));
							var temp = localStorage.ta_sim_attackLock;
							if (temp) {
							temp = JSON.parse(localStorage.ta_sim_attackLock);
							this.options.attackLock.setValue(temp);
							} else {
							this.options.attackLock.setValue(true);
							}
							this.options.repairLock = new qx.ui.form.CheckBox(lang("Repair"));
							var temp = localStorage.ta_sim_repairLock;
							if (temp) {
							temp = JSON.parse(localStorage.ta_sim_repairLock);
							this.options.repairLock.setValue(temp);
							} else {
							this.options.repairLock.setValue(true);
							}
							this.options.attackLock.addListener("click", this.optionAttackLock, this);
							this.options.repairLock.addListener("click", this.optionRepairLock, this);
							pssVBox.add(this.options.locksLabel, {
							row: 5,
							column: 0
							});
							pssVBox.add(this.options.attackLock, {
							row: 5,
							column: 1
							});
							pssVBox.add(this.options.repairLock, {
							row: 5,
							column: 2
							});*/

							this.battleResultsBox.add(tabView);
						} catch (e) {
							console.log(e);
						}
					},
					initializeOptions : function () {
						try {
							var options = new qx.ui.container.Composite(); //hello
							options.setLayout(new qx.ui.layout.VBox(1)); //hey
							options.setThemedPadding(10);
							options.setThemedBackgroundColor("#eef");
							this.optionsWindow.add(options);

							// Options Page
							var pssVBox = new qx.ui.container.Composite();
							var layout = new qx.ui.layout.Grid(5, 5);
							layout.setColumnFlex(2, 1);
							pssVBox.setLayout(layout);
							pssVBox.setThemedFont("bold");
							pssVBox.setThemedBackgroundColor("#eef");
							options.add(pssVBox);
							pssVBox.add(new qx.ui.basic.Label(lang("Version: ") + "3.01b"), {
								row : 0,
								column : 0,
								colSpan : 3
							});

							// Popup Checkbox
							this.options.autoDisplayStats = new qx.ui.form.CheckBox(lang("Auto display stats"));
							var temp = localStorage.ta_sim_popup;
							if (temp) {
								temp = JSON.parse(localStorage.ta_sim_popup);
								this.options.autoDisplayStats.setValue(temp);
							} else {
								this.options.autoDisplayStats.setValue(true);
							}
							this.options.autoDisplayStats.addListener("click", this.optionPopup, this);
							pssVBox.add(this.options.autoDisplayStats, {
								row : 1,
								column : 0,
								colSpan : 3
							});

							// Mark Saved Targets Checkbox
							this.options.markSavedTargets = new qx.ui.form.CheckBox(lang("Mark saved targets on region map"));
							var temp = localStorage.ta_sim_marksavedtargets;
							if (temp) {
								temp = JSON.parse(localStorage.ta_sim_marksavedtargets);
								this.options.markSavedTargets.setValue(temp);
							} else {
								this.options.markSavedTargets.setValue(true);
							}
							this.options.markSavedTargets.addListener("click", function () {
								localStorage.ta_sim_marksavedtargets = JSON.stringify(this.options.markSavedTargets.getValue());
							}, this);
							pssVBox.add(this.options.markSavedTargets, {
								row : 2,
								column : 0,
								colSpan : 3
							});

							// Double-click to (De)activate Checkbox
							this.options.dblClick2DeActivate = new qx.ui.form.CheckBox(lang("Enable 'Double-click to (De)activate units'"));
							var temp = localStorage.ta_sim_dblClick2DeActivate;
							if (temp) {
								temp = JSON.parse(localStorage.ta_sim_dblClick2DeActivate);
								this.options.dblClick2DeActivate.setValue(temp);
							} else {
								this.options.dblClick2DeActivate.setValue(true);
							}
							this.options.dblClick2DeActivate.addListener("click", function () {
								localStorage.ta_sim_dblClick2DeActivate = JSON.stringify(this.options.dblClick2DeActivate.getValue());
							}, this);
							pssVBox.add(this.options.dblClick2DeActivate, {
								row : 3,
								column : 0,
								colSpan : 3
							});

							// showShift Checkbox
							this.options.showShift = new qx.ui.form.CheckBox(lang("Show shift buttons"));
							var temp = localStorage.ta_sim_showShift;
							if (temp) {
								temp = JSON.parse(localStorage.ta_sim_showShift);
								this.options.showShift.setValue(temp);
							} else {
								this.options.showShift.setValue(true);
							}
							this.options.showShift.addListener("click", this.optionShowShift, this);
							pssVBox.add(this.options.showShift, {
								row : 4,
								column : 0,
								colSpan : 3
							});

							// side RadioButtons
							this.options.sideLabel = new qx.ui.basic.Label(lang("Side:"));
							this.options.leftSide = new qx.ui.form.RadioButton(lang("Left"));
							this.options.rightSide = new qx.ui.form.RadioButton(lang("Right"));
							var sideRadioGroup = new qx.ui.form.RadioGroup();
							sideRadioGroup.add(this.options.leftSide, this.options.rightSide);
							var temp = localStorage.ta_sim_side;
							if (temp) {
								temp = JSON.parse(localStorage.ta_sim_side);
								this.options.rightSide.setValue(temp);
							} else {
								this.options.rightSide.setValue(true);
							}
							sideRadioGroup.addListener("changeSelection", this.setupInterface, this);
							pssVBox.add(this.options.sideLabel, {
								row : 5,
								column : 0
							});
							pssVBox.add(this.options.leftSide, {
								row : 5,
								column : 1
							});
							pssVBox.add(this.options.rightSide, {
								row : 5,
								column : 2
							});

							// locks Checkboxes
							this.options.locksLabel = new qx.ui.basic.Label(lang("Locks:"));
							this.options.attackLock = new qx.ui.form.CheckBox(lang("Attack"));
							var temp = localStorage.ta_sim_attackLock;
							if (temp) {
								temp = JSON.parse(localStorage.ta_sim_attackLock);
								this.options.attackLock.setValue(temp);
							} else {
								this.options.attackLock.setValue(true);
							}
							this.options.repairLock = new qx.ui.form.CheckBox(lang("Repair"));
							var temp = localStorage.ta_sim_repairLock;
							if (temp) {
								temp = JSON.parse(localStorage.ta_sim_repairLock);
								this.options.repairLock.setValue(temp);
							} else {
								this.options.repairLock.setValue(true);
							}
							this.options.attackLock.addListener("click", this.optionAttackLock, this);
							this.options.repairLock.addListener("click", this.optionRepairLock, this);
							pssVBox.add(this.options.locksLabel, {
								row : 6,
								column : 0
							});
							pssVBox.add(this.options.attackLock, {
								row : 6,
								column : 1
							});
							pssVBox.add(this.options.repairLock, {
								row : 6,
								column : 2
							});

							// showStatsDuringAttack Checkbox
							this.options.showStatsDuringAttack = new qx.ui.form.CheckBox(lang("Show Stats During Attack"));
							this.options.showStatsDuringAttack.saveLocation = "showStatsDuringAttack";
							this.options.showStatsDuringAttack.setValue(this.saveObj.checkbox.showStatsDuringAttack);
							this.options.showStatsDuringAttack.addListener("click", this.toggleCheckboxOption, this);
							pssVBox.add(this.options.showStatsDuringAttack, {
								row : 7,
								column : 0,
								colSpan : 3
							});

							// showStatsDuringSimulation Checkbox
							this.options.showStatsDuringSimulation = new qx.ui.form.CheckBox(lang("Show Stats During Simulation"));
							this.options.showStatsDuringSimulation.saveLocation = "showStatsDuringSimulation";
							this.options.showStatsDuringSimulation.setValue(this.saveObj.checkbox.showStatsDuringSimulation);
							this.options.showStatsDuringSimulation.addListener("click", this.toggleCheckboxOption, this);
							pssVBox.add(this.options.showStatsDuringSimulation, {
								row : 8,
								column : 0,
								colSpan : 3
							});

							// skipVictoryPopup Checkbox
							this.options.skipVictoryPopup = new qx.ui.form.CheckBox(lang("Skip Victory-Popup After Battle"));
							this.options.skipVictoryPopup.saveLocation = "skipVictoryPopup";
							this.options.skipVictoryPopup.setValue(this.saveObj.checkbox.skipVictoryPopup);
							this.options.skipVictoryPopup.addListener("click", this.toggleCheckboxOption, this);
							pssVBox.add(this.options.skipVictoryPopup, {
								row : 9,
								column : 0,
								colSpan : 3
							});
							webfrontend.gui.reports.CombatVictoryPopup.getInstance().addListener("appear", function () {
								/*if (this.toolBar.isVisible()) {
									this.toolBar.hide();
								}
								if (this.toolBarMouse.isVisible()) {
									this.toolBarMouse.hide();
								}*/
								if (this.saveObj.checkbox.skipVictoryPopup) {
									webfrontend.gui.reports.CombatVictoryPopup.getInstance()._onBtnClose();
								}
							}, this);

							// disableTooltipsInAttackPreparationView Checkbox
							this.options.disableAttackPreparationTooltips = new qx.ui.form.CheckBox(lang("Disable Tooltips In Attack Preparation View"));
							this.options.disableAttackPreparationTooltips.saveLocation = "disableAttackPreparationTooltips";
							this.options.disableAttackPreparationTooltips.setValue(this.saveObj.checkbox.disableAttackPreparationTooltips);
							this.options.disableAttackPreparationTooltips.addListener("click", this.toggleCheckboxOption, this);
							pssVBox.add(this.options.disableAttackPreparationTooltips, {
								row : 10,
								column : 0,
								colSpan : 3
							});

							// disableArmyFormationManagerTooltips Checkbox
							this.options.disableArmyFormationManagerTooltips = new qx.ui.form.CheckBox(lang("Disable Unit Tooltips In Army Formation Manager"));
							this.options.disableArmyFormationManagerTooltips.saveLocation = "disableArmyFormationManagerTooltips";
							this.options.disableArmyFormationManagerTooltips.setValue(this.saveObj.checkbox.disableArmyFormationManagerTooltips);
							this.options.disableArmyFormationManagerTooltips.addListener("click", this.toggleCheckboxOption, this);
							pssVBox.add(this.options.disableArmyFormationManagerTooltips, {
								row : 11,
								column : 0,
								colSpan : 3
							});

							this.options.statsOpacityLabel = new qx.ui.basic.Label(lang("Stats Window Opacity"));
							this.options.statsOpacityLabel.setMarginTop(10);
							pssVBox.add(this.options.statsOpacityLabel, {
								row : 12,
								column : 0,
								colSpan : 3
							});

							this.options.statsOpacity = new qx.ui.form.Slider();
							pssVBox.add(this.options.statsOpacity, {
								row : 13,
								column : 1,
								colSpan : 2
							});
							this.options.statsOpacity.setValue(this.saveObj.slider.statsOpacity);

							this.options.statsOpacityOutput = new qx.ui.basic.Label(String(this.saveObj.slider.statsOpacity));
							pssVBox.add(this.options.statsOpacityOutput, {
								row : 13,
								column : 0
							});

							this.options.statsOpacity.addListener("changeValue", function () {
								var val = this.options.statsOpacity.getValue();
								this.battleResultsBox.setOpacity(val/100);
								this.options.statsOpacityOutput.setValue(String(val)+"%");
								this.saveObj.slider.statsOpacity = val;
							}, this);


							// The Help Vertical Box
							var pVBox = new qx.ui.container.Composite();
							pVBox.setLayout(new qx.ui.layout.VBox(1));
							pVBox.setThemedFont("bold");
							pVBox.setThemedPadding(10);
							//pVBox.setThemedMargin(3);
							pVBox.setThemedBackgroundColor("#eef");
							options.add(pVBox);
							var proHelpBar = new qx.ui.basic.Label().set({
									value : "<a target='_blank' href='http://userscripts.org/scripts/discuss/138212'>" + lang("Forums") + "</a>",
									rich : true
								});
							pVBox.add(proHelpBar);

						} catch (e) {
							console.log(e);
						}
					},
					toggleCheckboxOption : function (evt) {
						var tgt = evt.getTarget();
						var val = tgt.getValue();
						this.saveObj.checkbox[tgt.saveLocation] = val;
						//console.log("this.saveObj.checkbox[\"" + tgt.saveLocation + "\"] = " + this.saveObj.checkbox[tgt.saveLocation]);
						//console.log("val = " + val);
						this.saveData();
					},
					createBasePlateFunction : function (r) {
						var BPDebug = false;
						try {
							var regionObject = r.prototype;
							//              regionObject.disu =
							// if (r === ClientLib.Vis.Region.RegionNPCCamp || r === ClientLib.Vis.Region.RegionNPCBase) {
							for (var key in regionObject) {
								if (typeof regionObject[key] === 'function') {
									strFunction = regionObject[key].toString();
									if (strFunction.indexOf("region_city_owner") > -1) {
										if (BPDebug)
											console.log("1: " + strFunction);

										var re = /[A-Z]{6}\=\(new \$I.[A-Z]{6}\).[A-Z]{6}\(\$I.[A-Z]{6}.Black/;
										//IWZRVB=(new $I.ISZOKO).FDXTHE($I.GIBPLN.Black
										var strFunction = strFunction.match(re).toString();
										var basePlate = strFunction.slice(0, 6);
										if (BPDebug)
											console.log("2: " + basePlate + " // The obfuscated basePlate location in the visObject");

										if (r === ClientLib.Vis.Region.RegionNPCCamp) {
											if (BPDebug)
												console.log("3: " + strFunction + " // The part which creates a new base plate");
											var toStrFunction = "return " + strFunction.slice(12, 21) + ".prototype." + strFunction.slice(23, 29) + ".toString()" + ";";
											var fn = Function('', toStrFunction);
											strFunction = fn();
											if (BPDebug)
												console.log("4: " + strFunction + " // (" + toStrFunction + ")");

											//$I.CNDDJD.prototype.ECWGAG
											re = /.I.[A-Z]{6}.prototype.[A-Z]{6}/;

											//$I.CNDDJD.prototype
											var re2 = /.I.[A-Z]{6}.prototype/;
											var newFuncLocation = strFunction.match(re2).toString();
											if (BPDebug)
												console.log("5: " + newFuncLocation + " // this is where the new setPlateColor function will be placed");

											strFunction = strFunction.match(re).toString();
											toStrFunction = "return " + strFunction + ".toString()" + ";";
											//var strProtos = strFunction.match(re2).toString();
											fn = Function('', toStrFunction);
											strFunction = fn();
											if (BPDebug)
												console.log("6: " + strFunction + " // (" + toStrFunction + ")");

											//this.QDRXMK=a
											var re3 = /this.[A-Z]{6}=a/;
											var plateColor = strFunction.match(re3).toString();
											plateColor = "this." + plateColor.slice(5, 11) + "=a;";
											if (BPDebug)
												console.log("7: " + plateColor + " // this holds the color value (ClientLib.Vis.EBackgroundPlateColor)");

											//this.BFZGMK()
											var re4 = /this.[A-Z]{6}\(\)/;
											var update = strFunction.match(re4).toString();
											update = "this." + update.slice(5, 13) + ";";
											if (BPDebug)
												console.log("8: " + update + " // the obfuscated baseplate update function");

											var functionBody = newFuncLocation + ".setPlateColor = function(a){" + plateColor + update + "};regionObject.get_BasePlate = function(){return this." + basePlate + ";}";
											fn = Function('regionObject', functionBody);
											if (BPDebug)
												console.log("9: " + fn.toString() + " // creates a setPlateColor function and a getter function for the base plate");
											fn(regionObject);
										} else {
											var functionBody = "regionObject.get_BasePlate = function(){return this." + basePlate + ";}";
											fn = Function('regionObject', functionBody);
											if (BPDebug)
												console.log("3b: " + fn.toString() + " // a getter function for the base plate");
											fn(regionObject);
										}
										break;
									}
								}
							}
							//\// }
						} catch (e) {
							console.log(e);
						}
					},
					initToolBarListeners : function () {
						try {
							var playAreaBounds = this._PlayArea.getLayoutParent().getBounds();
							var playAreaWidth = this._PlayArea.getLayoutParent().getBounds().width;
							this._PlayArea.addListener("mouseover", function () {
								//this.toolBar.setOpacity(0);
								if (this.toolBar.isVisible()) {
									this.toolBarMouse.show();
									this.toolBar.setLayoutProperties({
										bottom : this.TOOL_BAR_LOW
									});
									this.toolBar.setZIndex(1);
								}
							}, this);
							
							this._armyBarContainer.addListener("appear", function () {
								//console.log("_armyBarContainer appeared");
								this._armyBarContainer.setZIndex(3);
								this.toolBar.show();
								this.toolBarMouse.show();
							}, this);

							this._armyBarContainer.addListener("changeVisibility", function () {
								if (!this._armyBarContainer.isVisible()) {
									//console.log("changeVisibility: _armyBarContainer hidden");
									this.toolBar.hide();
									this.toolBarMouse.hide();
								} else {
									//console.log("changeVisibility: armybar is visible");
									this.toolBar.show();
									this.toolBarMouse.show();
								}
							}, this);

							this.toolBarMouse.addListener("mouseover", function () {
								var paw = playAreaBounds.width;
								if (playAreaWidth !== paw) {
									playAreaWidth = paw;

									//need to do this on maximize as well
									var armyBarBounds = this._armyBarContainer.getBounds();
									if (armyBarBounds){
										this.toolBar.setDomLeft(armyBarBounds.left + ((armyBarBounds.width - this.TOOL_BAR_WIDTH)/2));
										this.toolBarMouse.setDomLeft(armyBarBounds.left + ((armyBarBounds.width - this.TOOL_BAR_WIDTH)/2));
									}
								}
								this.toolBarMouse.hide();
								this.toolBar.setZIndex(11);
								this.toolBar.setLayoutProperties({
									bottom : this.TOOL_BAR_HIGH
								});
							}, this);

							this.toolBar.addListener("appear", function () {
								this.toolBar.setZIndex(1);
							}, this);

							this._armyBar.addListener("mouseover", function () {
								//this.toolBar.setOpacity(0);
								this.toolBarMouse.show();
								this.toolBar.setZIndex(1);
								this.toolBar.setLayoutProperties({
									bottom : this.TOOL_BAR_LOW
								});
							}, this);

							this._armyBar.addListener("click", function () {
								this.armybarClickCount += 1;
								if (this.armybarClickCount == 1) {
									this.armybarClearnClickCounter = setInterval(this.resetDblClick, 500);
								}
							}, this);
						} catch(err){
							console.log(err);
						}
					},
					setupInterface : function () {
						try {
							////////////////// Interface Side ////////////////////
							localStorage.ta_sim_side = JSON.stringify(this.options.rightSide.getValue());
							
							// qx.core.Init.getApplication().getPlayArea()
							// might need to use this instead, mouseovers are not being registered during attacks
							
							var playArea = this._Application.getUIItem(ClientLib.Data.Missions.PATH.OVL_PLAYAREA);
							var playAreaWidth = this._Application.getUIItem(ClientLib.Data.Missions.PATH.OVL_PLAYAREA).getLayoutParent().getLayoutParent().getBounds().width;
							this.armybarClickCount = 0;
							var playerFaction = this._MainData.get_Player().get_Faction();
							var statsIcon = "data:image/png;base64,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";
							var undoIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAzdJREFUeNq8ll2ITGEYx+edj901i2UNaaiVyFdK3PgohUJSyo3ykVsXeyFy7+NOElfkjpBy5Yoil5S4EclolfK5YwfL7JwzX8f/af5Hj9eZs2P3nD3165yZc877/N//857nfUwi5PA8T05GLo0xiTiO5DjBe8BaMIDfZsoEMHg32Akug00gNZUOSLD14CQYAu9BMw4B6YDZi9WrwGnQC56A161bf9Lg6Xcmsz7SAcHz4BTIge+gClaA5QxcBqO8Fn7hvTGcXVAXp/5HkLHyPhucAdvAGAV2B6RHjmGKk+c+gLfgKd0qiiAI8ToSwOAzwVFwGPxgzvUAnvXbv29IimI/g0fgNiiAWpgjvgB5eR+tL9PKoOA2TXXWgqZxnEvgrrjUTkRSnXO03Jtg8AaFO2CEv0+AI6CPLrcVUANXwXUwS+XZn1FSYRSJABH+ucy1sB8MyrhBIuxF2AeOgUOgRCEVDtYMcKeXC1dm/ZPP1pUbDcYQd2+BG/KMTkdaf8sQIYvvPBfTHg58H9zkqrfFT6eIzWALWMxZV5UI4RPYC16Bx7qope2CQhEXafdusJIDD+F+3aobJV6+AXfALnCA/5WUAIfjyb0C3iv6LvxTinlDPqULnL0UoNWg386hPEvqfEecOsfUZRi8Rke+ggUsaiZ0L2ABEdvOsrAsA9nQgtISLjN9CK6BebS6RiEVitwIutruBVoEDhFxnIvoy3gllimUkvwAbOf4dTpQowuLWPSKof0AB5QZvAPPcF3pqLa3REqge3StpigzPTk/nclOBpzAbifCn6sU+OvAUXtMZwImcVSt4FXumA47LRO6BiJqdhpW8Cq38mzcDhh+OQ4Du0pIimlIxOlAF+vHNxXcVRWy4pf0yB3g6s6z4Iyo4C7XQ4bOxJYCcXUDv/+yCu6oDW20bSmOYPZSbreym66o4C5TM0ZhsTggu+gOBhu2gksq5qr/oxWA2SfZzq8DLzlLx7J/DrfkRqQCaP18cBB8ZDvvWg7MkBaeW7cXtQOG3ZTMrB+sAUs5Y/9TXwJe6AX4V0sWUQqy7CnlMxwAC/lfhuKu2LuqiakO+I1sD3vGPHvGAoI39PO/BRgAhgJgQiBnZrUAAAAASUVORK5CYII=";
							var redoIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAx9JREFUeNq8l8uPDFEUxvtWV8/o7hmPTCeeC4bJYIhHIhZYiNjZ2CEidlYWHrEwEyxn7x+wtbSxFqyJiEeEeGS0kU4YY3qobt3lO/HdOK6q6mrd5Sa/VLoe93zn3HPuPZ3LZTTCMDSg43teRsZ9XDaD1SLkvwvAKIFT4DqoJEUiKwFN8A5sB+fB0jgRXo+hdjEMeQM8BE/BCXAWlKNE+N0mFi55UABLwDAY4GO5N8LnOT6vglFwEnwBNzDHgjG/08Kk8ZKREmMbwU4wAVaBNfKKhBgsA21i5/0BAjoqeXEJ3JZ7VoRJ4bFMvgMcB7s5mUzccpbSOE7puQ0jJblxDtyHgHaiABiXUG4CZ8B+ehIog54ybK9RaBFFUAPHwKxEwU8wLnV8lWGuMdR5tcba+3ZCQmsRErUyGIxNQhiXibayfIbAR06Sj5nYJEQiR+F2Cb6CKUlOmwN+xJqvBRcZrk807DtrOcTnkvnv6ZlxRA3QW8OKmGc5PoLxVlwEilyfYRr3nVAv57274A54xYkbEdHZA06DbUy+C67xPwTQ+w1gnyQIQxcq4yvAGzANXjMhf2WyqmuWrZTkGPNInLoCHrjG3QjIi0fo0aIT9gpFXZaQY6Kww/myBexisk2y9htRL/tK9Up+NMM6t6PMj6eZPJ3OWBGwHoyDa+CW3njiIuDxAzG0oDLecN1vgud28+gwWsyRl+BJknEtwOem8wF8V/v7IH/fiwvhX0Vv5DwKq7rUkoavDo5KREbLDJ/lfprJlIjU71oBeWZ0nSWTU5tILa33/zJ8Z+0CJwHrjE4hKwGe8jSkp4G6LvI0LKZpMHsR0KTnniOizjIcS9M79CKgwUOnwKy3R+837vUHuFFlJqBFASUVgYBiZtgJjXZqsXvNgSrXu+VEYZ4cUvtDJgJmmQcF5b1dhhc81db1Oxk9tXHMsZevOEsQ8JnkwlFZpn6K8Jw/E4/ZgrWdZQjUH42D3bbzqQTwlHvGtmmEZVeioAl2xHW24/l+CTAR/eBecFhtvxL+t2xGava86Ga/70aA/WM5TsNz3A2bUd1PP8ZPAQYA6tkaX3nBq4MAAAAASUVORK5CYII=";
							var resetIcon = "data:image/png;base64,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";
							switch (playerFaction) {
							case ClientLib.Base.EFactionType.GDIFaction:
								var iconFlipHorizontal = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFTElEQVR4XtWVW28bRRTHz5nZ9Xrt2IlzKUlanJReiEhLpUpFPAQJBIUH4K1IXEQf+AZIfIE+9oXPgAChPlb0DVGFXlBBlFJoaakobVVCkxbiJI7ttdfeOfwnySo18UXIlRBnd+X1zP/8/mfO7tj0v4lvStKDtseYfVAiGxeCBt8Q8a5Hkj67JGkRYVyEe/2LwSWioNnMeZRx4so1vhLK0Km7xbdO3Fw6fnYpOvr+ye9e/uDzi4NnlqIdGJvC3PjVUNzPfrr66IzP/ylk47pI4tTc6psnbi3/cPmvslxalZPvfjz74dFPZnfj/hDGXsPcc9CMQ8txbrdQ3QQzI0xn7ghXyjRKrJ59aiA5dWAoRa6mEWau4zKOogTGGHN90OTKZUoix+b2XoCNTJ7U/EppplKrHx7w9BpViEwsEHsiMEfQDC+slHLZCbK63gs4VxGqBpR3tDs9PZDMu0p7QSTEQg34xhCxY5jT0PjQZoMK+cjtvQAlolbLwcFSJTjiOUosUta5EW2GyEYboCFox5CTVdJDAefLGy5GdpLwwcmsNzzqu5mFqgi3aK4ds3PQuNC6yBlAbipm/esCZtJMXwfiSGSmqtXakX7PcSuRkOKmZysPf7Nz0Ai0jJwx5PaBwWC1L6DT6o0x+XK5drg/6aZ3pt3MPaxQNbOEpKkAshpoE8jRyB0Bw+/UBdVu9ecC8VzhPVFkXnoy6w0CTA63fLObyFYDrezFY0DuMBhpsFS7Lqh2q1ck4w8Kq28orf3RpPYLoV09dzS3YTVWO5bUWuEEY1yxeO26oNqs3nci3stKP/3CY37+Rqnl6hmXMG2tymptDnJTYGScBveBqVt1QbVavato273F4juseMDX7IRGhLllC0Vo616zWpuDXAbDAWs7mIlWXVAPm9sKz1clFVWjfVrrna+O+buvFI1YDrWLNjM2x+aCkQbLMjNg2y5Yr60FxO3xFA09WCkf6XPV9lq0JmhvTiw4AGj7hrNlgJUEcxRsN/ZqKiCu6EJd/GKx9oyQmnx+JDnxa5m4w+LbGDc/CssAywczBXYOHk2eKq5oVoQSQsOlIHwxn3KmCnWK93wnfxZEpyZZBlgEZh/YQ/BIfIWUuAsqriRDlLi/WJlBy/ZP9bu5Qkga7G5L7NYiEgRYDGaiZigLj0F4cdwFZSs5EwhTSKPG0MHpfndfsaHcxrp15/6LqG41ItiywOTprJuBR7/UKAlPst6KEP1JUvOLpZnVavhKznPcSEgZibdepxCbz93eA8sCk8FmeIzMF0o5eK7Blf3PrlQo7ypnen8u+YSjdHqlLtQdvEZXpKxF12DLBNuBRwpeGXj61lu5ZHi5WDqwVCy/5zqarLVsPr8tV/xzO7e6QMaIE0WRvbdjHXNiLjwYXnl4ZuBNjkTAsdufz8jg4/gXu1sWSur2azIb7/z2vlGl+LpmxHhm1Nqzp7jjzlkKiSbSrrOYSVCRXRfeKEAMaUUVY/Q1T1FmV4al1QYXEaqbBtrowFL05T/uBJGIz4T7udvRrt0TtR0+SWjqktAuKVbUIthhotW6UZETrRXrOKwkCMKb399d+PTcbxpANoKTpPnXFmAuBMs84GVVKHWZm1vZI0LfGkO10xfnwt+Xq/MeJ6hQXZbh1CAldOIf6+D1A67LK8X05LahYHIkRSygHPvicvbSrfn9IiYkhDAsTfMLp5hZ44hMxICwh4epFF+AYAgML6xHYsDSrMTeIVr8d8oGT6m940P3j79+qM7UY7z90WlX4i2LE9a0vrvtZ1wEPuNvwsQs9OPte42fjx3t2bzH/C/pP4+/ARzr/zZI4lPKAAAAAElFTkSuQmCC";
								var iconFlipVertical = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEz0lEQVR4XsWX3W8U5RfHz3lmd2Z2drftdinQjRhKE02MV7SIhZYLSUyIMcZ45wVeatQ/4BfwlxiF+A8Yb8WXC68QiBFjIEYwigQiYFEoFVBCX3ZL931nd555zvFkQnphu11Td/VMJvMkm8l8crLn+/0ehDXqXIkxbhECKgBFPOFZDD2qNQHOl2hbzff3C4BWSHOZAe8axqG4SyH9OwBF8xo16h8YpsZik34eSLnHLQsvZwfcKy2G6h4bdW8Blun/kxl850HAXPB1I+8HQSHg722Fl/tT7lkvFZtuGqhNuRj0qAN0eKIfjtyoAmx1EUKikNno6VKwXCe4CGRubR3sO6kcmBGQ8j4XdVcBzhXDQ3v71dHpKgMCsKsQXQsgabG2kfmbRf8uI94Ephu5bPp4GIM7oYLCVAypSx3Qh/f0W0euC4CFCMwMDMC2gCAAbEtAyMz01YJ/ywKetxRcHMqkvtAIdycTON8FgFAA1ArAw4pApFg4UMnh8TTwckD++ULzLhhT8pz4l17K/pZR3Z5KqrnuAayula4kY4gjHsLtmi7PVIOlZissD6QTn7IFP9m2fXMyifPdAmgLEjLwsIu42UG4WgqWykHYKjSCxcE+7xNN5peBVOJqTEFhzEH6WwBf52uH929KCgCtAHQqYgbNwKOewoQFcL3SetDShv+o6dk+zzkFQFeGB7xLTR2UdqcdvS7Ah7dnDx3cPnp0NUDnMsxADDySVMhyXvB1pdQM+Z5vrsYVXEi59ulMyrk05mGtLcDpxcpbzw6l371WEQCEDZVhAAWRjsgZmMjo36pBuFAPvsumvbf7U/aFXR7ymgCn8oX/PT+06T3fMKBcLNdGixkgrkBuBJLzmXvlkOLuwcG089nudBuA1z+/8NFLUzseybpZKDZLvNkbjF6W6tQPbjNpFiPEhAPqmu+0CD4GwDP7Mm0AXj529jlLwQEEDAkgVIgEzAaiJ0YDiIgMUa10EVfuiAPVWgNHRM7EEzvef2PX9lmQagfwmGUBICtiBFaoonlDRGCIvg+IEXvEg5FiI0a/yTGCih6re0GG1eSTo3Ov7ny00RbgzZM/7nxx74iddbKw3CzBluQgELfrdscpiXjlRkvOtZD9gODevoxaagtwYiE//sKWoZxvmHvwJzQUd64cyCXm1hvDcRnDYRlD7uIYsowhyRgWN6W9mf2bneJ6QjT2yshobloAuiBEWoQIRIgq0oViyo3nRYjKIkRmPSkeFykeFiXkDUoxihS3RIpBpLguUrwIQGWR4rJIsRYp5k5mNC55YDVAZzNCMaOWmBGJGbXEjO5rMhUxo+ruBLZWUW8IoL0da7HjQOw4FDu+zxaUxI7rYscrH94YQOdAQhJIGmBMKIEkL4FkiVH5Ekia/ySSCUAsAmgTyYiZQSJZ3QJuWgpKEsnyGqExKa3uRigdk1Cak1DKfwmlZCODhNIGI9aBqSahdCGMQX3CxqCbsVw6AMO/VoEfxnJiNiyxPKgTlIFMTWL5onKhLhOmJZZzV2P5D2Uee7oPcrKYUMHXRhYTKgRcikurJV4tJdOxqh+CmXKRerKYHLs+/8xoJulqIpLVrCqr2bxlYVlWs0qLIZTVjHu6mp34vbLFcWLxyA+RmrKcVp5yUPdmO/6P609VRf8/TUkZ4wAAAABJRU5ErkJggg%3D%3D";
								var iconRefresh = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFfUlEQVR4Xu2Va2wUVRTHz9zZme6zpbQVSgxU21r64hUSUIkPFFPhCx/kFTEkkhYwNYX4ICFRoTFEKomhIajBICRNSgSifrBWHpaAChUhPFtqIVKUAm63y86+ZmfmzvXcnWWxBaoy+9Gb/DJ7956Z//+ee8+9AmSw1XZpIj5kxIm4EAcSRFTE2F4hs+ECjgwJ84lISDZSgIxF8lJGTiA3EQW5ywDJkLicEizLl4QXnxvt2Lx4rNTycqG0c4pPrAEALyIWVMyuwHiSQshUBkQkBymp9pJl1V5xGRHufJdZ5kh77ZIlotNZ2/F2/SfPNm39hi8LmkjYN2AJjBnvJLMn+8TlfCCo0f7j3b8NXLr4q6fwmTlHTzY3VRBJXpUzplAun1T93sU9LdkTFyzlJvwE7LcCpBRn/yrv9EfUa1t27o1917qbXDi0Xzm+bYt7sLdn/ahHSzwL65ZPWNNQV/rEtOrGKwfalgLAQ5kwMAGpzJWE8bzT0nZE0CJhoKp6XvL41gd6uqpyi0u7Zy94Kf78jCl5PGburOn5MyZXLASAYttl+OWf5kH+odGSUGSYptnddz2e7XGrntxR7e0DxjoeU+Uli3Ezbhou0BszP7Zt4LNrdFupm6waPnA6TNeej5i7eacm37ExGrxVo0RjzvIJhS4HIWRQZ1cA4LLtJegM0b0HzvSe+fvAV8fP/rzz/Y3lh9asmN/Z1Dhlw1vviJ+27At+e+JCiIvzmLYBYwfSSMB+u9x5puuLth9+GeCdg52nA9/v2esKXu4tzyurOK9Hw+ux/Kpkrw+Wzn2KJatEZ1fxcQHpu28ZzmrY+kokFn/XZOye40QQwOdxr8bOsaI5c1t+2tMS7Dl5ak332XNhdTCg5U2s3DDztYbY9cMHsksmPhadWf6IO1cWx3GBcxFzB98CiP++e+Dx+uZmg9LXix8eCyIR0meogBjUhJ6+a+B2OddVrlyx6fb5j4fMvEj/Hysll2t7zfbWw3guLMLybIJUMxkY5yJ0FxrYhd0eZHCkJUgwlG2smw9b3lgEH622aH5zEaxdNg9ww3MzGl4wJo9FFDzhWrH8VqB4K9fj4wyAGgwS1xPs1P6AsRbFPweAS0gIof94EiaoCQkDI00rBxRldWoOibFuuXSSuhCCRLAS2pFA6jbkzxuIH1EQnb83ogHG0DoKq5RBSh+owE0xPjbiq0gU6UeOIAYSTxnhWaP/5jpGFbRpchOQTDlLvkBAH1E8nRE9RXikWMcIsxe4gzhlIFGTG0hffSr2UxmwTdrA1NoPO4NKeOrtfr/fL1aWFMPur4+C5CDgcTuhZs4McDqz0kuAZM5AQtcLqkqKpKenlQH/bpYkgRdFCZjQdzOEBCGiUaAiTe4Jg1IQBCGYMQOMMeoQCZ5W0yGVbS4AWRjRceoqXOoPWKlH+LMwPw8CIaVhWt3mGr5chAhElqTOY1sbmh7UQHKd/RFrvbk4b7JMIKzqIACDmGECReI6hXEFeZCb7ZoUjcUn8YyFonEIhpTpAPBgBtBB8oQLaUa65DhZKK1Syk2lDagYQCmD+oUvQFlRLuBrUP9BKyjRuGZnCcBAkcEEHRIgA4GYbmUlblAwdAoqAgxjUe9GGE2Z1p5gGGPLAEWRIDcgDDUQRWF2x0A6IyGNgj9h/Tas0rRngM8ipNMhH5KYgBmwRPixTBENAezfQgMyN8D/t8rSfgYUfehMHGCCapjJDKi6AQ4igpYyxPcLiRupDFD7BpjJQIkl+O90GRIUi6MwRQxNTwKSAxivCkaAmAIwhJo2M2AyJuuJBBxp3Tc8xtpcKPB7ekxIbpOb+ztAlCQMADSm8UzID2wgx+vtCITCT95rFoKVjruNKeEhMTk+34//Uf9/4C/OeihXxgLfsQAAAABJRU5ErkJggg%3D%3D";
								var leftBG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAACgCAMAAAC7f4tPAAABklBMVEUAAAD///8bfqbc3Nyhop/T09PZ2dnY2Njx8fHy8vLz8/Oen5t2d3XW1tZyc3C5ubnJycnLy8ugoZ6hoZ7X19bX19eKioiXmJTa2tqXmJXg4ODh4eHi4uLr6+ucnZmcnZqdnpr09PTR0dHS0tLV1dV0dXPj4+Pq6uqen52LjIrK09eMjIvOzs3Q0NC3t7e4uLiRko9qa2iWl5NtbmsbfqZ0dHK9vr3b29t2dnTf39/IyMifoJygoZ3CwsLo6Ojp6enDw8Pu7u7w8PCGh4OIiYewsLC0tLR1dnRnoblsbWqpqairq6irrKmsrKutrq2ur6xub22zs7OHiISHiIW4uLZub26Jioi5uri6urq7vLtvb22Ki4dvb27FxcVra2nIz9KNjoqOjouQkY5zc3HOzs7O1djPz8+Sk4+TlJCVlpNpamd0dXJubmyYmJaZmpeam5ibm5l1dnNqpbxubm2enptub2x4eXd6enh8fXuCgoGEhYKEhYOioqHt7e2io6Hv7++jo6OkpaKlpaOlpqOmp6Wnp6Um7BAdAAAAA3RSTlMAAH5Ny5jlAAACu0lEQVR4Xu3b1Y/bQBDA4Wtm1+wgM8MhMzOUmZmZmfH/rtc5K6kq9SGbac/qjnSv38NPymmccbr2oM3vtKC7nPGMdXRaaM/THuAZSZLYX9kBmrRnqwekDkyZQpyacUmyaEe+5MjcNFj0xEdGN2rcAO5p0ABxaz6/ZLQj80+DZjYcfsdoVoPJS+sDg+2Pz+cHp7VJ4X6O0awzkzf8k8npdieZTEERbDoepxRO6Ixu1Fg6EqiuaGq7o2kFJV0CgDLLYR7wzlr0jrwRSH9SeEbVlORNRgPI3a+Ozln0mP1JWfdXmcxlFzIli6YgR18cexRiNLAZmFxReEfLSIw2T05dHso36cGkxk/XGA2bUwkSDJEmPa1y0+qiTY8HCQkRDJoO6yR2W/9LtMI/Ng0VwsY9NGKQ/6a1aC1ai9Z3rSC3cFpfzJPYUB4lSOQQWmuQfxAdJwhA//MYFk37TtVxgrBZw6O9WEEoJl1BC/JHWrQWrfv2YtH9b58gfdDlXiNRR6EjUSOB9P96+14Caw8ZDZJYzG3LAnh1QnS3LWZ0lLirNT8t9mvRWrQWrQ281uH9aK1B/obVmj3dfSFINIQn6nhL8Coe7XXlfl35N0FEa9E6fBCrtdz7eg0niBw9ey6LQoejxhWkPcQwEijLgnMDQ6HFHiJ2PtFatBatRettJBr/BkaIG29gx7O75QYm9mvxLCNau/EGdm3VdTewbvac5LYb2HB+F+0hYucTrUVrzHeC3UNjBnF/a4x33cfJr1/G+TpAqws2vWm5wVALnSpwF1lO2UHMfaGR1pf/Z0DROO0P6YhNg/x15GquSUOxqhQ0jt9wqMtpU4KdG9h3Mhts0lBKZTK1xXantpCKSODQcCY710LDdSrxjMxkOwgUKbzRbbqT4+zXz3IItA0Ezj/GomcePMQKcuH9HSx6fv70T0KzcLgY6GqkAAAAAElFTkSuQmCC";
								var rightBG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAACgCAMAAACL85puAAAAn1BMVEX////c3Nzr6+vw8PDT09PFxcXp6enV1dWdnpro6Ojt7e2en5v29vb39/fq6uqhop+kpaOdnpvs7OyhoZ7g4ODOzs7Q0NDX19eam5ecnZq9vb3CwsK6urrGxsbv7+/Hx8fy8vKPkIyTlJC2tLGSk5DLy8ubnJiWl5TR0dGdnpwbfqafoJzZ2dna2trIyMj19fXd3d3e3t74+Pj5+fn6+voyWnv7AAAAAXRSTlMAQObYZgAAAR9JREFUeF7tmkduxTAMREnJvf/ea3qv9z9bYuQE0XyAXswDuJ3FA2XPgkJEHkFEQSRSjZDBAxQED7hCHTzgARhyqz3++7MOQ1a9A18d/T4MyVSj8ZsvnGv+cM2/kImqr7xL8kCk1enXsUjyUKTUae1dDgVU+wYIaM0DyssE0AEd0EGGO+Aqj9CAMxpwQgOuzQNOeAAdnM1XuVUFn7N5QKtKB8MLSFAHiYlELpJ9wajZE9mVl9YtjSWLDnrkzqCl8XswZAd0QAd0QAd0MLrIz5UdiQ7M6/6S/YD9YEAO6IAO6GDy8oGdUGTP79gRx2qxcNAZyVOapgVyyFJGv4yBU5puPj8c7l34MU83m+12wMgNiLyCSBzH6zUwst1stsj8AK74lmQgdGoWAAAAAElFTkSuQmCC";
								break;
							case ClientLib.Base.EFactionType.NODFaction:
								var iconFlipHorizontal = "data:image/png;base64,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%3D";
								var iconFlipVertical = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFMElEQVR4XsWXXWwUZRfHz5nZ7213u91u2W26RRFfaoCgiSDbxpiYKIitcueFGKM3mhhD64WJ0Qgx75WxkBATjRdcCBdyIYlEJNF4gdrlI6AUiNBCtFK3Le2W3S3dnZl9nnnOe7ZbQJp2obDre+bZZDMXk9+cc+Z//gdhgaCxIwhKIAAf0glbtxDUKBYEyJ3bu8Kpw5MAKIkco75w01nQtQxGNql/BWDohx37w/FHXyJZtOT0lXOBYONB1N2nPeHIGRDyOrY8L2oKMHZi9/7ohp6XwRwnMztSsHIjRciPJEH3nK4LhH/U6+vPkyFmtLbuYk0ARo/t2hfbuH0bTJ0A8D8AyhbSlkoYqeQ1XWROWkq71Ngc/wZc+pA0VM65vEtUFSCV7PuyJdH7CqT7gVAj1H0IDh8oLSBI81Bh6MAwgj0oleNiQzR+EED9WRSuSXfbs6o6GejnDHT0bIN0EkBzABABXwzimQUm/ypJpFThwt5LipxjpLlOBiPRb0HZw9j64tj990By975oYvstgHLMgQAh6giIQKHHSRXGDfPy18NFW8t6vHXfef11R5n6D2zbOno/JfisJdHzJqSP3Q4AMA9GETqDCIHVIKfO5qzxX9OmVcgFg+H9iPCb7vQOYhtnZMklSO76PJbY/sY8gMVBVJHQ/yCCLw7F0aNpkU9bRjZ1NRSK7BO2/N0TCA+A1zWJoWfUXfZA3x7ugbfnAVQOshlEEAbXIDjrwEr1TwnLIuva4GV/XcMhBXjG1xw/BcLIYqxL3KEEn+xs2di7A6bKAEsKJculCaxGJgIrOzxdnEmTnb04AJr7uM/fcMTV1HgKw5tnFgfo7/u0paPnLZj8GQArAVTOCKAG4F/OfyVJYQtzckAamSu/1DdGdnqDDcdxWTct1gPvxxK9/wW7UCZChHsOUgCaCwCdAKBg6vxXps8pX/OGIgdw2ZaFAQa///DdSHztKiVFOyJeI6ViCFB+AmDpENwKJJq9hYu1Oc4FoE65iWGtMRx5rz4SO4zRzQsDHNrV1e30eLodqBEBSNRKnKjKPyBAPogAxIeonCKkOQbCf/bXPFSwTNO9sn3dx+2bPrq0aA8c3rN1ldvrAx21Ej6V4G++eYkZae4eAdGNGtHshbcSgTRHgEQ3y2gaBj78yLqRh57+YLa+i5VgZaR1jV/Zog5QK4Kt3ICkISAt1BM0R1F+XYTb3lwr39G0ErgO2YlhDIcjFwJrX5+oIER9a2OJd1ZwE6oaNKHkJhzwtb86WukzXN/S0RuFyZ+oap+htMmcGFBG5q9MoHHZkPc/2zKVhGgdj+M2VkKqghAJFiJgIZpmIcqwEE2wEOVYiOxKUrw+VspAOkn3KMVopZKWsExgKc6zFF9VgDmW4hwIQ7AU052G0ROxRE+EAZY6jLCYOmqJQlrxMLJCjZGUkHKah1HJR1pLGccbuATNDLCEcXxOWOOnizyOJY/jFCJkeRzneRxb92JIOtmQhO7SkCg2JAU2JJINyYS3rj4NhAYbEvN+LFknj+NQBUumiBSwJcsrcpqku7LBpugEKFXA1hesapjSTi5BaAFTqkjzAJvSAoKdl8ox0xBtHQegPDdWsZq2vDO2kTMwdfyGLVe2VMS2vKiLbM5SOMO2/Cq49LxtKOFY3kXVXkw6eDEJgzmmzOzfNi8miheTLOieLC8maV5MrpMhbF5MVK1Ws6ea4o/5lbQUr2bXA8HwGOquHK9m0yCk5E+KarqaZc580ex2O1ygkAgcJi+n0xh9TtRmO/4/x/8AHKjlP9O9djoAAAAASUVORK5CYII%3D";
								var iconRefresh = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFmklEQVR4Xu2VfWxT5QLGn3P6tbasU9nGAO+GczjQOUaAuyioSPxjSC6BmAiEixjMEEz4UiJxfs2PoJL9gyFeVDJGgID4gd443R8oRByyTRBwiDg23YAxVrvSru1pT895j4+n/WMyGHHtnz7Lr+3es/M+z/u8Z28lpFFG/WwLADvJIE5iJX4SJZo050sDV8maJmMJgI14SA7JIyOTQVrIZRIkgwLIaTK3Jw2L4c6ZjcI5NSip3IW7V9Qhb1oFgBHEMuku550MKyeR0tWAhWSRIuSULUVe+VJI8oB5DYaDPLO6cZHDKlU+UtO09eP15fUAogwRk5G67GQUssbNwuh7njDNI5e7zx7dd+rDujfa4W09/MzOH++026SVhaNcrvKyopc3159bBCCXZKQjQA4Zj9ypy0DF/R0Xt71XE3n3o4PyZ43nglW7j7nOXAhVj89zu9cu+U/Bs0+/MH7KtH+/uvtw53/BEOkIUEDugjMnH9QXn9ZJgYgGJS5aPW5rdWtXsKR4jPvMsrnTlfKZ80eCmvHQgmyGeBTA7RJSlPHLtgPgRHDmjoMWE+c7TigjMrOiN3tuakD7/qpER5MWYvS9b+Fq9bX+L/UAJze+g1tKVuJqXTqyAd6TewEw3vyN/uCVilB/IONfhWVOWB0ylN7fALSnvgUXDn/0c/MnJzFAx77a2byuZufEuZu+m/dU7YmylVUvW2q3v+s/3lgfMM0ptH1cS16Vkbraj7U07/v2wAe/g2o6tN9X+/9G59nu8MSSfE9rMKxVO21ySZbLiofnPW6AguLtAnCadFpxHb22pmhJNBx5SRgC15IsyXCOcK8F8PXi+wp2ba5v9h851bbuh9Md/b5QXL07P/OVjYunRD5s6fGUTrg9XFz6gAuuUWNAoff7WrAD4pVwHb2y6ra3dU1fNTa/AJJkAYxEeP4CITSc7+iAw5lR9WJF8ZsAHCSDh8ycC33RFU679f1D1dMPIW/qAuRO24SkYPDGnqYd8J7YAeAs6RtqC2KGMLBk+WZUrt6DyrW7Eqzei4WPvQ5dCDCMmvyCiZEgT7g9Mc14kuZ7AAhAUhlch9BiCHUdR8cnG2i+HcA5EiC6FTeQoUUBKICIJxuw01zFQCVDEFM/EZmE0NPSQHwAosRHeoiXBEmc4Y0hAxis3YjTXAsDEEhIMFSE14bOTcKkm3xDNKIkg6g01pGUdchJJEDoMUAoMHSdIxyS4wylYiglG4kn6ccQsg6xeskQoFkYRtSe2HPKIlkg2AqvIwUNDvBc5dimULB/MpLq7fFZ7phQiIYDdZBlG1wZbsyaMQ9Wp5ttRM0AJH0BNFXNKRxfZCuZNNNs3+50wOn0QBcy/L52+Ho7occC0CXNfAZ0XYckSf60BWCjuixbcf+DqwBJgAINOO7Eubb98F5qg87qhcSVqwqyc7MR8AfWPL/81grB7ZIhyTaHral6y6+bhhnAgBACQrtovtM8EcJwQIsFYQiZxmEwJ7R4BDl5eXC5biqNRCKlgEAkFELwSv9UAMMNANaqIR72AQOOX5stgwEU8yHU1RDt4wwSMc+X+QvXI3vkZAAatm5ZDKUrrIIafgOaBhHpveogcrD6UKIdGgvEE1thANFQLwxPJz/rHOO9HEwhAEwTXfEBA+YRNgdElAEYUGMADTY2EmUjBsf7oPd3m+0IoZlzpNSAxga0SB+MASuRbHYah01DXaUxNPNwoif0iB96iAENwXsIE6S2BToniV4ZOBHDWCHiUZoaiHPlNlgZVDXbiocZwCVB530Mn3oA/kBRgubn5L8h65aJAk3oUGlCGAJmS1Y9DEmRIJmHUuoN2KOqhtqGo7haggZCAmrPdyeCyeYrPvd5YbPKHABUVQe3yT7sAO5M98FQIDD9Wi3SHBYMVsj4699ketyNQAB/R//oD9nHCW2twSEjAAAAAElFTkSuQmCC";
								var leftBG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAACgCAMAAAC7f4tPAAABj1BMVEX///+hop/p6el0dXOXmJSTlJBqa2jY2NihoZ6XmJV2d3XX19egoZ6dnprOzs3X19aIiYeKiojQ0NDr6+vq6uqen51sbWqnp6WRko+cnZl0dHKMjIuur6yLjIro6Oh2dnTIyMh1dnRtbmupqajCwsLu7u6enpuWl5OGh4OgoZ2EhYJ0dXKHiIWHiIR6eniSk49ub2yam5hpameJioiNjoqlpqOkpaK9vr25uritrq18fXtvb22Ki4d1dnOOjou4uLZzc3Fra2mrq6irrKnPz8/t7e2lpaOQkY6mp6W7vLvOzs6CgoFubm1vb26bm5mYmJaZmpfFxcWVlpO6urrc3NzZ2dnT09PV1dXa2trg4ODz8/PW1tbJycnLy8u0tLTi4uLSvbq5ubnDw8OwsLC3t7fb29vw8PDR0dHv7+/f39+uRDqvRTzj4+Px8fGcnZrh4eGsrKv09PSioqHTwL2mGxvW19by8vJyc3Czs7Ojo6KfoJxubmyEhYPOuri4uLjS0tK9vb2en5tub254eXdub21rpm98AAAAAXRSTlMAQObYZgAAAr9JREFUeF7s0MUOwzAURNF+5DxTEIrMzPDhjRtZztqx1E2vNNuzmNZv+rf2Wl0epWgSEelxA9TkYQryEGcQLBBENfkC8kSjpO9L+8YKjatoQJQdXj5loKK1jffZvKHlvGhf3cuyEObrgOE0NT9rOQ47cuCalDP08KWFYAzPh30j30fjrtq6ptRiktwAcH3HZr47WjmOkv6nffPsbRoKozBva+oRO6NJS5OSpIWWTubee+/xxqgOqCBGQaobpUKOxIdW/udwrUgOX/jA7UGxeM8PeBQ90rWOc65DnURBuHZHoZnN+rGjS+oMJifl49tNRdZid8u7v9A+m6UTqycthWaVT5+/hLoJyi2Fbp9unpnyUvTOWqCPrig0zzZtci1K0d8ibXQ0kqBrLpFFCLQ/FpOxP/5H6FA/CZpHSSU7aKCQ/8a1uBbX4vpUTMZxjOubHhlTHkRI7iDMNZsHKMYIYR4/YqDQfv7CBEaIShGH7qGE+Ej0KEzIH9HiWlznD6PQ48tXQQfdnHZszOMpV3Js0PN6csVG9ZBDLhlG1soC92KiGFbMYK4J63r40NKvxbW4FtcOznXhNsw1m2dRrtXb3TkCoblwfgJXghfh1R3fr/FovBBxLa4LF1GuzelLRYwQs3T5ShWCLpSca6Ae4jg2oCykGxgELT1EOp+4FtfiWlxPgtD4DYwoixvY9eqwbGDSr+VdRlxncQO7sZi5Dazu2ERZ28DGvCHqIdL5xLW4Rt4Jzg4aKST7rhF33Wv0+4X0D3uAjhoJetYicq0BdKerbWS+kwhp37IWBi//z3AYaLLvruf6G9i9hftbKZo3NsNuoPENRzS/3m5xfwN7QD/cFM27nXK5MvK3qTQ66jf30fywujSA5kd+SyemIidCeMPnx3GC3tP0+/WTLQCaVd49fYZCzzx/gRLycvsVCj039/onvUF9K+HA7eQAAAAASUVORK5CYII%3D";
								var rightBG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAACgCAMAAACL85puAAAAolBMVEX////o6Ojg4ODLy8vIyMien5uhop/FxcXCwsLOzs66urrGxsa9vb2Sk5CPkIyTlJCdnpvV1dXHx8eWl5T5+fmkpaPQ0NCam5fX19fR0dHa2trZ2dnd3d3e3t6foJzc3Nzr6+vw8PDT09P29vbq6ur19fWmGxvp6ent7e339/ehoZ7y8vKdnpqlGxu2tLHv7++bnJj4+PicnZrs7Oydnpz6+voBl3AiAAAAAXRSTlMAQObYZgAAAS9JREFUeNrtmttuwjAQRDe0JNxDuPcCayehSSCUFtr//7US8QX1IBmhGcmvR+zBseZhhRE5fGARBSOpaoocHKBgcMAnOsIPDsAiX9rE/n5XbpFT81NstrdHt0h9AZy3tjQmv8bk/4rsVG1mTRE4RkJtzfZlETgD2tqqrAkgQHbMAUDoHXAdgQ7ogA7gEWr+jfgIYxQQo4ARChh6B4zoAB8h9n6VQ1X0c8YB8Ah0cH+AAnVQ8CJ5uUj+C0bFnsiuvEQBMQsGS9YtAFO4pfE94JtIB3RAB3TwWA7GKGDKjsSe2AC81/0l3wO+iXRAB3RwRw52r2tshaJ+e8eWOE6rlYHWSDZJkpTIIks7veQMrNLMF4vJ5MW4L/PMu91+HzjyBEaewUgURYMBcKTX6fSQ8wfrkQWdCN/EzwAAAABJRU5ErkJggg%3D%3D";
								break;
							}

							if (this.toolBar) {
								this.toolBarParent.remove(this.toolBar);
							}

							if (this.repairInfo) {
								playArea.remove(this.repairInfo);
							}

							// Repair Time Infobox
							this.repairInfo = new qx.ui.container.Composite();
							var layout = new qx.ui.layout.Grid();
							layout.setColumnAlign(0, "right", "middle");
							//layout.setColumnFlex(0, 1);
							//layout.setColumnWidth(1, 70);
							this.repairInfo.setLayout(layout);
							this.repairInfo.setThemedFont("bold");
							this.repairInfo.set({
								visibility : false
							});
							//this.repairInfo.setThemedBackgroundColor("#eef");
							// Available Repair Label
							this.repairInfo.add(new qx.ui.basic.Image("webfrontend/ui/icons/icn_repair_off_points.png"), {
								row : 0,
								column : 1
							});
							this.labels.repairinfos.available = new qx.ui.basic.Label("100").set({
									textColor : "white"
								});
							this.repairInfo.add(this.labels.repairinfos.available, {
								row : 0,
								column : 0
							});
							// Max Infantry Repaircharge Label
							this.repairInfo.add(new qx.ui.basic.Image("webfrontend/ui/icons/icon_res_repair_inf.png"), {
								row : 1,
								column : 1
							});
							this.labels.repairinfos.infantry = new qx.ui.basic.Label("100").set({
									textColor : "white"
								});
							this.repairInfo.add(this.labels.repairinfos.infantry, {
								row : 1,
								column : 0
							});
							// Max Vehicle Repaircharge Label
							this.repairInfo.add(new qx.ui.basic.Image("webfrontend/ui/icons/icon_res_repair_tnk.png"), {
								row : 2,
								column : 1
							});
							this.labels.repairinfos.vehicle = new qx.ui.basic.Label("100").set({
									textColor : "white"
								});
							this.repairInfo.add(this.labels.repairinfos.vehicle, {
								row : 2,
								column : 0
							});
							// Max Air Repaircharge Label
							this.repairInfo.add(new qx.ui.basic.Image("webfrontend/ui/icons/icon_res_repair_air.png"), {
								row : 3,
								column : 1
							});
							this.labels.repairinfos.aircraft = new qx.ui.basic.Label("100").set({
									textColor : "white"
								});
							this.repairInfo.add(this.labels.repairinfos.aircraft, {
								row : 3,
								column : 0
							});

							playArea.add(this.repairInfo, {
								bottom : 130,
								right : 3
							});

							// Toolbar
							this.toolBar = new qx.ui.container.Composite();
							this.toolBar.setLayout(new qx.ui.layout.Canvas());
							this.toolBar.setHeight(53);
							this.toolBar.setWidth(this.TOOL_BAR_WIDTH);
							this.toolBar.set({
								decorator : new qx.ui.decoration.Background().set({
									backgroundImage : "FactionUI/menues/victory_screen/bgr_victscr_header.png"
								}),
								visibility : false
							});

							if (PerforceChangelist >= 441272) { // 15.4 patch
								this.toolBarParent = this._armyBar.getLayoutParent().getLayoutParent().getLayoutParent();
							} else { //old
								this.toolBarParent = this._armyBar.getLayoutParent().getLayoutParent();
							}

							this.toolBarParent.add(this.toolBar, {
								bottom : this.TOOL_BAR_HIGH,
								left : (playAreaWidth - this.TOOL_BAR_WIDTH) / 2,
								visibility : false
							});

							// Toolbar Mouse Region
							this.toolBarMouse = new qx.ui.container.Composite();
							this.toolBarMouse.setLayout(new qx.ui.layout.Canvas());
							this.toolBarMouse.setHeight(25);
							this.toolBarMouse.setWidth(740);
							this.toolBarParent.add(this.toolBarMouse, {
								bottom : 155,
								left : (playAreaWidth - this.TOOL_BAR_WIDTH) / 2
							});
							this.toolBarMouse.hide();
							this.toolBarMouse.setBackgroundColor("#FF0000");
							this.toolBarMouse.setOpacity(0);
							this.toolBarMouse.setZIndex(10);
							
							
							this.initToolBarListeners();
							/*
							// does the game init in combat mode?
							if (this._VisMain.get_Mode() === ClientLib.Vis.Mode.CombatSetup) {
							this.toolBar.show();
							this.toolBarMouse.show();
							//this.toolBar.setOpacity(0);
							this.toolBar.setLayoutProperties({
							bottom : this.TOOL_BAR_LOW
							});
							}
							 */

							// (De)activate All Button
							this.buttons.attack.activateAll = new qx.ui.form.ToggleButton("", "FactionUI/icons/icon_disable_unit_active.png");
							this.buttons.attack.activateAll.set({
								width : 44,
								height : 40,
								padding : 0,
								show : "icon",
								appearance : "button-text-small",
								toolTipText : "<strong>"+lang("Deactivate All")+"</strong>"
							});
							this.buttons.attack.activateAll.addListener("changeValue", function () {
								var btnActivateAll = this.buttons.attack.activateAll;
								if (!btnActivateAll.getValue()) {
									btnActivateAll.setOpacity(1);
									btnActivateAll.setToolTipText("<strong>"+lang("Deactivate All")+"</strong>");
								} else {
									btnActivateAll.setOpacity(0.75);
									btnActivateAll.setToolTipText("<strong>"+lang("Activate All")+"</strong>");
								}
							}, this);
							this.buttons.attack.activateAll.addListener("execute", function () {
								var btnActivateAll = this.buttons.attack.activateAll;
								if (this.buttons.attack.activateInfantry.getValue() !== btnActivateAll.getValue()) {
									this.buttons.attack.activateInfantry.setValue(btnActivateAll.getValue());
								}
								if (this.buttons.attack.activateVehicles.getValue() !== btnActivateAll.getValue()) {
									this.buttons.attack.activateVehicles.setValue(btnActivateAll.getValue());
								}
								if (this.buttons.attack.activateAir.getValue() !== btnActivateAll.getValue()) {
									this.buttons.attack.activateAir.setValue(btnActivateAll.getValue());
								}
							}, this);

							// (De)activate Infantry Button
							this.buttons.attack.activateInfantry = new qx.ui.form.ToggleButton("", "FactionUI/icons/icon_alliance_bonus_inf.png");
							this.buttons.attack.activateInfantry.set({
								width : 44,
								height : 40,
								appearance : "button-text-small",
								toolTipText : "<strong>"+lang("Deactivate Infantry")+"</strong>"
							});
							this.buttons.attack.activateInfantry.addListener("changeValue", function () {
								var btnActivateInfantry = this.buttons.attack.activateInfantry;
								if (btnActivateInfantry.getValue() === this.buttons.attack.activateVehicles.getValue() && btnActivateInfantry.getValue() === this.buttons.attack.activateAir.getValue()) {
									this.buttons.attack.activateAll.setValue(btnActivateInfantry.getValue());
								}
								this.activateUnits('infantry', !btnActivateInfantry.getValue());
								if (!btnActivateInfantry.getValue()) {
									btnActivateInfantry.setOpacity(1);
									btnActivateInfantry.setToolTipText("<strong>"+lang("Deactivate Infantry")+"</strong>");
								} else {
									btnActivateInfantry.setOpacity(0.75);
									btnActivateInfantry.setToolTipText("<strong>"+lang("Activate Infantry")+"</strong>");
								}
							}, this);

							// (De)activate Vehicles Button
							this.buttons.attack.activateVehicles = new qx.ui.form.ToggleButton("", "FactionUI/icons/icon_alliance_bonus_tnk.png");
							this.buttons.attack.activateVehicles.set({
								width : 44,
								height : 40,
								appearance : "button-text-small",
								toolTipText : "<strong>"+lang("Deactivate Vehicles")+"</strong>"
							});
							this.buttons.attack.activateVehicles.addListener("changeValue", function () {
								var btnActivateVehicles = this.buttons.attack.activateVehicles;
								if (btnActivateVehicles.getValue() === this.buttons.attack.activateInfantry.getValue() && btnActivateVehicles.getValue() === this.buttons.attack.activateAir.getValue()) {
									this.buttons.attack.activateAll.setValue(btnActivateVehicles.getValue());
								}
								this.activateUnits('vehicles', !btnActivateVehicles.getValue());
								if (!btnActivateVehicles.getValue()) {
									btnActivateVehicles.setOpacity(1);
									btnActivateVehicles.setToolTipText("<strong>"+lang("Deactivate Vehicles")+"</strong>");
								} else {
									btnActivateVehicles.setOpacity(0.75);
									btnActivateVehicles.setToolTipText("<strong>"+lang("Activate Vehicles")+"</strong>");
								}
							}, this);

							// (De)activate Air Button
							this.buttons.attack.activateAir = new qx.ui.form.ToggleButton("", "FactionUI/icons/icon_alliance_bonus_air.png");
							this.buttons.attack.activateAir.set({
								width : 44,
								height : 40,
								appearance : "button-text-small",
								toolTipText : "<strong>"+lang("Deactivate Air")+"</strong>"
							});
							this.buttons.attack.activateAir.addListener("changeValue", function () {
								var btnActivateAir = this.buttons.attack.activateAir;
								if (btnActivateAir.getValue() === this.buttons.attack.activateInfantry.getValue() && btnActivateAir.getValue() === this.buttons.attack.activateVehicles.getValue()) {
									this.buttons.attack.activateAll.setValue(btnActivateAir.getValue());
								}
								this.activateUnits('air', !btnActivateAir.getValue());
								if (!btnActivateAir.getValue()) {
									btnActivateAir.setOpacity(1);
									btnActivateAir.setToolTipText("<strong>"+lang("Deactivate Air")+"</strong>");
								} else {
									btnActivateAir.setOpacity(0.75);
									btnActivateAir.setToolTipText("<strong>"+lang("Activate Air")+"</strong>");
								}
							}, this);

							// Reset Formation Button
							this.buttons.attack.formationReset = new qx.ui.form.Button("", resetIcon);
							this.buttons.attack.formationReset.set({
								width : 44,
								height : 40,
								appearance : "button-text-small",
								toolTipText : "<strong>"+lang("Reset Formation")+"</strong>"
							});
							this.buttons.attack.formationReset.addListener("click", this.resetFormation, this);

							// Flip Horizontal Button
							this.buttons.attack.flipHorizontal = new qx.ui.form.Button("", iconFlipHorizontal);
							this.buttons.attack.flipHorizontal.set({
								width : 44,
								height : 40,
								padding : 0,
								show : "icon",
								appearance : "button-text-small",
								toolTipText : "<strong>"+lang("Flip Horizontal")+"</strong>"
							});
							this.buttons.attack.flipHorizontal.addListener("click", function () {
								this.flipFormation('horizontal');
							}, this);

							// Flip Vertical Button
							this.buttons.attack.flipVertical = new qx.ui.form.Button("", iconFlipVertical);
							this.buttons.attack.flipVertical.set({
								width : 44,
								height : 40,
								padding : 0,
								show : "icon",
								appearance : "button-text-small",
								toolTipText : "<strong>"+lang("Flip Vertical")+"</strong>"
							});
							this.buttons.attack.flipVertical.addListener("click", function () {
								this.flipFormation('vertical');
							}, this);

							// Repair Mode Button
							this.buttons.attack.repairMode = new qx.ui.form.ToggleButton("", "FactionUI/icons/icon_mode_repair_active.png");
							this.buttons.attack.repairMode.set({
								width : 44,
								height : 40,
								padding : 0,
								show : "icon",
								appearance : "button-text-small",
								toolTipText : "<strong>"+lang("Activate Repair Mode")+"</strong>"
							});
							this.buttons.attack.repairMode.addListener("execute", this.toggleRepairMode, this);
							this.buttons.attack.repairMode.addListener("changeValue", function () {
								var btnRepairMode = this.buttons.attack.repairMode;
								if (!btnRepairMode.getValue()) {
									btnRepairMode.setToolTipText("<strong>"+lang("Deactivate Repair Mode")+"</strong>");
								} else {
									btnRepairMode.setToolTipText("<strong>"+lang("Activate Repair Mode")+"</strong>");
								}
							}, this);

							// The new refresh button
							this.buttons.attack.toolbarRefreshStats = new qx.ui.form.Button("", iconRefresh);
							this.buttons.attack.toolbarRefreshStats.addListener("click", this.refreshStatistics, this);
							this.buttons.attack.toolbarRefreshStats.set({
								width : 44,
								height : 40,
								padding : 0,
								show : "icon",
								appearance : "button-text-small",
								toolTipText : "<strong>"+lang("Refresh Stats")+"</strong>"
							});
							
							// The new stats window button
							this.buttons.attack.toolbarShowStats = new qx.ui.form.Button("", statsIcon);
							this.buttons.attack.toolbarShowStats.addListener("click", this.toggleTools, this);
							this.buttons.attack.toolbarShowStats.set({
								width : 44,
								height : 40,
								padding : 0,
								show : "icon",
								appearance : "button-text-small",
								toolTipText : "<strong>"+lang("Open Stats Window")+"</strong>"
							});
							
							// Undo
							this.buttons.attack.toolbarUndo = new qx.ui.form.Button("", undoIcon);
							this.buttons.attack.toolbarUndo.addListener("click", function(){console.log("Undo");}, this);
							this.buttons.attack.toolbarUndo.set({
								width : 44,
								height : 40,
								padding : 0,
								show : "icon",
								appearance : "button-text-small",
								toolTipText : "<strong>"+lang("Undo")+"</strong>"
							});
							
							// Redo (if possible)
							this.buttons.attack.toolbarRedo = new qx.ui.form.Button("", redoIcon);
							this.buttons.attack.toolbarRedo.addListener("click", function(){console.log("Redo");}, this);
							this.buttons.attack.toolbarRedo.set({
								width : 44,
								height : 40,
								padding : 0,
								show : "icon",
								appearance : "button-text-small",
								toolTipText : "<strong>"+lang("Redo")+"</strong>"
							});
							
							

							// Options Button
							this.buttons.attack.options = new qx.ui.form.Button().set({
									width : 44,
									height : 40,
									appearance : "button-text-small",
									icon : "FactionUI/icons/icon_forum_properties.png",
									toolTipText : "<strong>"+lang("Options")+"</strong>"
								});
							this.buttons.attack.options.addListener("click", this.toggleOptionsWindow, this);

							this.toolBar.add(this.buttons.attack.flipVertical, {
								top : 10,
								left : 10
							});
							this.toolBar.add(this.buttons.attack.flipHorizontal, {
								top : 10,
								left : 60
							});
							this.toolBar.add(this.buttons.attack.activateAll, {
								top : 10,
								left : 130
							});
							this.toolBar.add(this.buttons.attack.activateInfantry, {
								top : 10,
								left : 180
							});
							this.toolBar.add(this.buttons.attack.activateVehicles, {
								top : 10,
								left : 230
							});
							this.toolBar.add(this.buttons.attack.activateAir, {
								top : 10,
								left : 280
							});
							this.toolBar.add(this.buttons.attack.toolbarRefreshStats, {
								top : 10,
								left : 349
							});
							// right bound buttons
							this.toolBar.add(this.buttons.attack.options, {
								top : 10,
								right : 10
							});
							this.toolBar.add(this.buttons.attack.repairMode, {
								top : 10,
								right : 60
							});
							this.toolBar.add(this.buttons.attack.toolbarShowStats, {
								top : 10,
								right : 110
							});
							this.toolBar.add(this.buttons.attack.toolbarRedo, {
								top : 10,
								right : 175
							});
							this.toolBar.add(this.buttons.attack.toolbarUndo, {
								top : 10,
								right : 225
							});
							this.toolBar.add(this.buttons.attack.formationReset, {
								top : 10,
								right : 275
							});
							

							if (this.userInterface) {
								this._armyBar.remove(this.userInterface);
							}

							if (this.options.rightSide.getValue()) {
								var canvasWidth = 64;
								var interfaceBG = rightBG;
								var buttonsLeftPosition = 5;
								var shiftRRightPos = 0;
								var shiftLRightPos = 30;
								var shiftURightPos = 15;
								var shiftDRightPos = 15;
							} else {
								var canvasWidth = 90;
								var interfaceBG = leftBG;
								var buttonsLeftPosition = 15;
								var shiftRRightPos = 16;
								var shiftLRightPos = 46;
								var shiftURightPos = 30;
								var shiftDRightPos = 30;
							}

							// Interface Canvas
							this.userInterface = new qx.ui.container.Composite();
							this.userInterface.setLayout(new qx.ui.layout.Canvas());
							this.userInterface.setHeight(160);
							this.userInterface.setWidth(canvasWidth);
							this.userInterface.set({
								decorator : new qx.ui.decoration.Background().set({
									backgroundImage : interfaceBG
								})
							});
							if (this.options.rightSide.getValue()) {
								this._armyBar.add(this.userInterface, {
									top : 0,
									right : 53
								});
							} else {
								this._armyBar.add(this.userInterface, {
									top : 0,
									left : 0
								});
							}

							// Simulate Button
							this.buttons.attack.simulate = new qx.ui.form.Button("Sim!");//lang("Simulate"));
							this.buttons.attack.simulate.set({
								width : 58,
								appearance : "button-text-small",
								toolTipText : lang("Start Combat Simulation")
							});
							this.buttons.attack.simulate.addListener("click", this.startSimulation, this);

							// Tools Button
							this.buttons.attack.tools = new qx.ui.form.Button(lang("Stats"));
							this.buttons.attack.tools.set({
								width : 58,
								appearance : "button-text-small",
								toolTipText : lang("Open Simulator Tools")
							});
							this.buttons.attack.tools.addListener("click", this.toggleTools, this);

							//Shift Buttons
							this.buttons.shiftFormationLeft = new qx.ui.form.Button("<");
							this.buttons.shiftFormationLeft.set({
								width : 30,
								appearance : "button-text-small",
								toolTipText : lang("Shift units left")
							});
							this.buttons.shiftFormationLeft.addListener("click", function () {
								this.shiftFormation('l');
							}, this);

							this.buttons.shiftFormationRight = new qx.ui.form.Button(">");
							this.buttons.shiftFormationRight.set({
								width : 30,
								appearance : "button-text-small",
								toolTipText : lang("Shift units right")
							});
							this.buttons.shiftFormationRight.addListener("click", function () {
								this.shiftFormation('r');
							}, this);

							this.buttons.shiftFormationUp = new qx.ui.form.Button("^");
							this.buttons.shiftFormationUp.set({
								width : 30,
								appearance : "button-text-small",
								toolTipText : lang("Shift units up")
							});
							this.buttons.shiftFormationUp.addListener("click", function () {
								this.shiftFormation('u');
							}, this);

							this.buttons.shiftFormationDown = new qx.ui.form.Button("v");
							this.buttons.shiftFormationDown.set({
								width : 30,
								appearance : "button-text-small",
								toolTipText : lang("Shift units down")
							});
							this.buttons.shiftFormationDown.addListener("click", function () {
								this.shiftFormation('d');
							}, this);

							var temp = localStorage.ta_sim_showShift;
							if (temp) {
								temp = JSON.parse(localStorage.ta_sim_showShift);
							} else {
								temp = true;
							}
							if (temp) {
								this.userInterface.add(this.buttons.shiftFormationUp, {
									top : 16,
									right : shiftURightPos
								});
								this.userInterface.add(this.buttons.shiftFormationLeft, {
									top : 35,
									right : shiftLRightPos
								});
								this.userInterface.add(this.buttons.shiftFormationRight, {
									top : 35,
									right : shiftRRightPos
								});
								this.userInterface.add(this.buttons.shiftFormationDown, {
									top : 54,
									right : shiftDRightPos
								});
							}

							this.userInterface.add(this.buttons.attack.tools, {
								top : 77,
								left : buttonsLeftPosition
							});
							this.userInterface.add(this.buttons.attack.simulate, {
								top : 100,
								left : buttonsLeftPosition
							});
						} catch (e) {
							console.log(e);
						}
					},
					getAttackUnits : function () {
						try {
							var base_city = this._MainData.get_Cities().get_CurrentOwnCity();
							var target_city = this._MainData.get_Cities().get_CurrentCity();
							if (target_city != null) {
								var target_city_id = target_city.get_Id();
								var units = base_city.get_CityArmyFormationsManager().GetFormationByTargetBaseId(target_city_id);
								this.view.lastUnits = units;
								this.view.lastUnitList = units.get_ArmyUnits().l;
							}
							this.attackUnitsLoaded = true;
						} catch (e) {
							console.log(e);
						}
					},
					optionPopup : function () {
						localStorage.ta_sim_popup = JSON.stringify(this.options.autoDisplayStats.getValue());
					},
					optionShowShift : function () {
						localStorage.ta_sim_showShift = JSON.stringify(this.options.showShift.getValue());
						if (this.options.showShift.getValue()) {
							this.setupInterface();
						} else {
							this.userInterface.remove(this.buttons.shiftFormationUp);
							this.userInterface.remove(this.buttons.shiftFormationLeft);
							this.userInterface.remove(this.buttons.shiftFormationRight);
							this.userInterface.remove(this.buttons.shiftFormationDown);
						}
					},
					optionAttackLock : function () {
						try {
							localStorage.ta_sim_attackLock = JSON.stringify(this.options.attackLock.getValue());
							if (this.options.attackLock.getValue()) {
								this._armyBar.add(this.buttons.attack.unlock, {
									top : 108,
									right : 9
								});
							} else {
								this._armyBar.remove(this.buttons.attack.unlock);
							}
						} catch (e) {
							console.log(e);
						}
					},
					optionRepairLock : function () {
						try {
							localStorage.ta_sim_repairLock = JSON.stringify(this.options.repairLock.getValue());
							if (this.options.repairLock.getValue()) {
								this._armyBar.add(this.buttons.attack.repair, {
									top : 16,
									right : 9
								});
							} else {
								this._armyBar.remove(this.buttons.attack.repair);
							}
						} catch (e) {
							console.log(e);
						}
					},
					toggleTools : function () {
						this.battleResultsBox.isVisible() ? this.battleResultsBox.close() : this.battleResultsBox.open();
					},
					toggleOptionsWindow : function () {
						this.optionsWindow.isVisible() ? this.optionsWindow.close() : this.optionsWindow.open();
					},
					getAllUnitsDeactivated : function () {
						var f = this.getFormation();
						var unitEnabled = false;
						for (var i = 0; i < f.length; i++){
							if (f[i].e) {
								unitEnabled = true;
								break;
							}
						}
						//console.log(unitEnabled);
						if (unitEnabled) {
							return false;
						}else{
							return true;
						}
					},
					refreshStatistics : function () {
						
						try {
							var ownCity = this._MainData.get_Cities().get_CurrentOwnCity();
							if (!this.getAllUnitsDeactivated() && ownCity.GetOffenseConditionInPercent() > 0) {
								this.timerStart();
								ClientLib.API.Battleground.GetInstance().SimulateBattle();
								this.buttons.attack.refreshStats.setEnabled(false);
								this.buttons.attack.toolbarRefreshStats.setEnabled(false);
								this.buttons.attack.simulate.setEnabled(false);
								this.labels.countDown.setWidth(110);
								this.count = 10;
								this.statsOnly = true;
							}
						} catch (e) {
							console.log(e);
						}
					},
					countDownToNextSimulation : function () {
						try {
							var _this = window.TACS.getInstance();
							_this.count = _this.count - 1;
							_this.labels.countDown.setWidth(_this.labels.countDown.getWidth() - 11);
							if (_this.count <= 0) {
								clearInterval(_this.counter);
								_this.buttons.attack.refreshStats.setEnabled(true);
								_this.buttons.attack.toolbarRefreshStats.setEnabled(true);

								if (_this.warningIcon) {
									_this._armyBar.remove(_this.simulationWarning);
									_this.warningIcon = false;
								}
							}
						} catch (e) {
							console.log(e);
						}
					},
					formationChangeHandler : function () {
						try {
							var _this = this;
							if (this.labels.countDown.getWidth() != 0) {
								if (!_this.warningIcon) {
									// Simulation Warning
									_this.simulationWarning = new qx.ui.basic.Image("https://eaassets-a.akamaihd.net/cncalliancesgame/cdn/data/d75cf9c68c248256dfb416d8b7a86037.png");
									_this.simulationWarning.set({
										toolTipText : lang("Simulation will be based on most recently refreshed stats!")
									});
									if (this.options.rightSide.getValue()) {
										this._armyBar.add(_this.simulationWarning, {
											top : 122,
											right : 67
										});
									} else {
										this._armyBar.add(_this.simulationWarning, {
											top : 122,
											left : 27
										});
									}
									_this.warningIcon = true;
								}
							}
						} catch (e) {
							console.log(e);
						}
					},
					calculateLoot : function () {
						try {
							// Adapted from the CNC Loot script:
							// http://userscripts.org/scripts/show/135953
							//var city = this._MainData.get_Cities().get_CurrentCity(); // not used
							var mod;
							var spoils = {
								1 : 0,
								2 : 0,
								3 : 0,
								6 : 0,
								7 : 0
							};

							var loot = ClientLib.API.Battleground.GetInstance().GetLootFromCurrentCity();
							for (var i in loot) {
								spoils[loot[i].Type] += loot[i].Count;
							}

							this.stats.spoils.tiberium.setLabel(this.formatNumberWithCommas(spoils[1]));
							this.stats.spoils.crystal.setLabel(this.formatNumberWithCommas(spoils[2]));
							this.stats.spoils.credit.setLabel(this.formatNumberWithCommas(spoils[3]));
							this.stats.spoils.research.setLabel(this.formatNumberWithCommas(spoils[6]));
						} catch (e) {
							console.log(e);
						}
					},
					getRepairCost : function (unitStartHealth, unitEndHealth, unitMaxHealth, unitLevel, unitMDBID) {
						if (unitStartHealth != unitEndHealth) {
							if (unitEndHealth > 0) {
								var damageRatio = ((unitStartHealth - unitEndHealth) / 16) / unitMaxHealth;
							} else {
								var damageRatio = ((unitStartHealth / 16) / unitMaxHealth);
							}

							var repairCosts = ClientLib.API.Util.GetUnitRepairCosts(unitLevel, unitMDBID, damageRatio);
							// var crystal = 0;  // crystal didn't use, only RT
							var repairTime = 0;
							for (var j = 0; j < repairCosts.length; j++) {
								var c = repairCosts[j];
								var type = parseInt(c.Type);
								switch (type) {
									/*case ClientLib.Base.EResourceType.Crystal: // crystal ddidn't use, only RT
									crystal += c.Count;
									break;*/
								case ClientLib.Base.EResourceType.RepairChargeBase:
								case ClientLib.Base.EResourceType.RepairChargeInf:
								case ClientLib.Base.EResourceType.RepairChargeVeh:
								case ClientLib.Base.EResourceType.RepairChargeAir:
									repairTime += c.Count;
									break;
								}
							}
							return repairTime;
						}
						return 0;
					},
					setLabelColor : function (obj, val, dir) {
						var colors = ['green', 'blue', 'black', 'red'];
						var color = colors[0];
						var v = val;
						if (dir >= 0)
							v = 100.0 - v;
						if (v > 99.99)
							color = colors[3];
						else if (v > 50)
							color = colors[2];
						else if (v > 0)
							color = colors[1];
						obj.setTextColor(color);
					},
					updateLabel100 : function (obj, val, dir) {
						this.setLabelColor(obj, val, dir);
						val = Math.ceil(val * 100) / 100;
						obj.setValue(val.toFixed(2).toString());
					},
					updateLabel100time : function (obj, val, dir, time) {
						var s = val.toFixed(2).toString() + " @ " + phe.cnc.Util.getTimespanString(time);
						this.setLabelColor(obj, val, dir);
						obj.setValue(s);
					},
					updateStatsWindow : function () {
						var _this = this;
						var colors = ['black', 'blue', 'green', 'red'];
						var s = "";
						var n = 0;
						if (this.stats.damage.structures.construction === 0) {
							s = lang("Total Victory");
							n = 0;
						} else if (this.stats.damage.structures.overall < 100) {
							s = lang("Victory");
							n = 1;
						} else {
							s = lang("Total Defeat");
							n = 3;
						}
						this.labels.damage.outcome.setValue(s);
						this.labels.damage.outcome.setTextColor(colors[n]);
						this.updateLabel100(this.labels.damage.overall, this.stats.damage.overall,  - 1);
						this.updateLabel100(this.labels.damage.units.overall, this.stats.damage.units.overall,  - 1);
						this.updateLabel100(this.labels.damage.structures.overall, this.stats.damage.structures.overall,  - 1);
						this.updateLabel100(this.labels.damage.structures.construction, this.stats.damage.structures.construction,  - 1);
						this.updateLabel100(this.labels.damage.structures.defense, this.stats.damage.structures.defense,  - 1);
						// Command Center
						if (this.view.playerCity)
							this.updateLabel100(this.labels.damage.structures.command, this.stats.damage.structures.command,  - 1);
						else {
							this.labels.damage.structures.command.setValue("--");
							this.labels.damage.structures.command.setTextColor("green");
						}
						// SUPPORT
						var SLabel = (this.stats.supportLevel > 0) ? this.stats.supportLevel.toString() : '--';
						this.labels.supportLevel.setValue(lang('Support lvl ') + SLabel + ': ');
						this.updateLabel100(this.labels.damage.structures.support, this.stats.damage.structures.support,  - 1);
						// AVAILABLE RT
						this.labels.repair.available.setValue(phe.cnc.Util.getTimespanString(this.stats.repair.available));
						// AVAILABLE ATTACKS

						this.labels.attacks.available.setValue('CP:' + this.stats.attacks.availableAttacksCP + ' / F:' + this.stats.attacks.availableAttacksAtFullStrength + '/ C:' + this.stats.attacks.availableAttacksWithCurrentRepairCharges);
						// OVERALL
						this.updateLabel100time(this.labels.health.overall, this.stats.health.overall, 1, this.stats.repair.overall);
						// INF
						this.updateLabel100time(this.labels.health.infantry, this.stats.health.infantry, 1, this.stats.repair.infantry);
						// VEH
						this.updateLabel100time(this.labels.health.vehicle, this.stats.health.vehicle, 1, this.stats.repair.vehicle);
						// AIR
						this.updateLabel100time(this.labels.health.aircraft, this.stats.health.aircraft, 1, this.stats.repair.aircraft);
						// BATTLE TIME
						setTimeout(function () {
							_this.stats.time = _this._VisMain.get_Battleground().get_BattleDuration() / 1000;
							_this.setLabelColor(_this.labels.time, _this.stats.time / 120.0,  - 1); // max is 120s
							_this.labels.time.setValue(_this.stats.time.toFixed(2).toString());
						}, 1);
						//this.saveUndoState();
					},
					formatNumberWithCommas : function (x) {
						return Math.floor(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					},
					/* Not used:
					formatSecondsAsTime: function (secs, format) {
					var hr = Math.floor(secs / 3600);
					var min = Math.floor((secs - (hr * 3600)) / 60);
					var sec = Math.floor(secs - (hr * 3600) - (min * 60));

					if (hr < 10) hr = "0" + hr;
					if (min < 10) min = "0" + min;
					if (sec < 10) sec = "0" + sec;

					if (format !== null) {
					var formatted_time = format.replace('hh', hr);
					formatted_time = formatted_time.replace('h', hr * 1 + "");
					formatted_time = formatted_time.replace('mm', min);
					formatted_time = formatted_time.replace('m', min * 1 + "");
					formatted_time = formatted_time.replace('ss', sec);
					formatted_time = formatted_time.replace('s', sec * 1 + "");
					return formatted_time;
					} else {
					return hr + ':' + min + ':' + sec;
					}
					},
					 */
					unlockAttacks : function () {
						this._armyBar.remove(this.buttons.attack.unlock);
						var _this = this;
						setTimeout(function () {
							_this._armyBar.add(_this.buttons.attack.unlock);
						}, 2000);
					},
					unlockRepairs : function () {
						this._armyBar.remove(this.buttons.attack.repair);
						var _this = this;
						setTimeout(function () {
							_this._armyBar.add(_this.buttons.attack.repair);
						}, 5000);
					},
					/*calculateDefenseBonus : function (context, data) {
						try {
							var score = data.rpois[6].s;
							var rank = data.rpois[6].r;
							this.view.playerCityDefenseBonus = Math.round(ClientLib.Base.PointOfInterestTypes.GetTotalBonusByType(ClientLib.Base.EPOIType.DefenseBonus, rank, score));
						} catch (e) {
							console.log(e);
						}
					},*/
					hideAll : function () {
						if (this.buttons.attack.repairMode.getValue())
							this.buttons.attack.repairMode.execute();
						if (this.battleResultsBox.isVisible())
							this.battleResultsBox.close();
						/*if (this.toolBar.isVisible())
							this.toolBar.hide();
						if (this.toolBarMouse.isVisible())
							this.toolBarMouse.hide();*/
					},
					gameOverlaysToFront : function () {
						webfrontend.gui.reports.ReportsOverlay.getInstance().setZIndex(20);
						webfrontend.gui.mail.MailOverlay.getInstance().setZIndex(20);
						//webfrontend.gui.mail.MailMessageOverlay.getInstance().setZIndex(20);
						webfrontend.gui.alliance.AllianceOverlay.getInstance().setZIndex(20);
						webfrontend.gui.forum.ForumOverlay.getInstance().setZIndex(20);
						webfrontend.gui.research.ResearchOverlay.getInstance().setZIndex(20);
						webfrontend.gui.monetization.ShopOverlay.getInstance().setZIndex(20);
						webfrontend.gui.ranking.RankingOverlay.getInstance().setZIndex(20);
					},
					ownCityChangeHandler : function (oldId, newId) {
						console.log("CurrentOwnChange event");
						if (this._armyBarContainer.isVisible()) {
							this.buttons.attack.refreshStats.setEnabled(false);
							this.buttons.attack.toolbarRefreshStats.setEnabled(false);
							this.buttons.attack.simulate.setEnabled(false);
							this.onCityLoadComplete();
							this.resetDisableButtons();
						}
						this.updateSaveMarkers();
					},
					//onViewChange
					viewChangeHandler : function (oldMode, newMode) {
						//console.log("ViewModeChange event");
						this.curViewMode = newMode;
						this.buttons.attack.simulate.setEnabled(false);
						this.buttons.attack.refreshStats.setEnabled(false);
						this.buttons.attack.toolbarRefreshStats.setEnabled(false);
						try {

							this.hideAll();
							//this.getAvailableRepairAndCP();

							switch (newMode) {
								/*
								case ClientLib.Vis.Mode.None:
								break;
								case ClientLib.Vis.Mode.City: //own base
								break;
								case ClientLib.Vis.Mode.Region: //the map
								break;
								 */
							case ClientLib.Vis.Mode.Battleground: // 3: while attacking or simming
								this.curPAVM = qx.core.Init.getApplication().getPlayArea().getViewMode();
								this.onCityLoadComplete();
								break;
								/*
								case ClientLib.Vis.Mode.ArmySetup: //in own base / add upgrade units
								break;
								case ClientLib.Vis.Mode.DefenseSetup:
								break;
								case ClientLib.Vis.Mode.World: //world button
								break;
								 */
							case ClientLib.Vis.Mode.CombatSetup: // 7: formation setup
								this.curPAVM = qx.core.Init.getApplication().getPlayArea().getViewMode();
								this.onCityLoadComplete();
								break;
							}
							//console.log("\nViewMode: " + ClientLib.Vis.VisMain.GetInstance().get_Mode() + "\n");
							//console.log("curPAVM: " + this.curPAVM);
						} catch (e) {
							console.log(e);
						}
					},
					resetDisableButtons : function () {
						try {
							if (this.buttons.attack.activateInfantry.getValue(true))
								this.buttons.attack.activateInfantry.setValue(false);
							if (this.buttons.attack.activateVehicles.getValue(true))
								this.buttons.attack.activateVehicles.setValue(false);
							if (this.buttons.attack.activateAir.getValue(true))
								this.buttons.attack.activateAir.setValue(false);
						} catch (e) {
							console.log(e);
						}
					},
					onCityLoadComplete : function () {
						try {
							var _this = this;
							//console.log("Running onCityLoadComplete...");
							if (this._VisMain.GetActiveView().get_VisAreaComplete()) {
								setTimeout(function () {
									var cbtSetup = ClientLib.Vis.VisMain.GetInstance().get_CombatSetup();
									cbtSetup.SetPosition(0, cbtSetup.get_MinYPosition() + cbtSetup.get_DefenseOffsetY() * cbtSetup.get_GridHeight());
									//qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.OVL_PLAYAREA).getLayoutParent().setZIndex(1);
								}, 500);

								this.checkAttackRange();
								if (this.curPAVM > 3) {
									this.showCombatTools();

									var currentcity = this._MainData.get_Cities().get_CurrentCity();
									if (currentcity != null) {
										var ownCity = this._MainData.get_Cities().get_CurrentOwnCity();
										this.stats.attacks.attackCost = ownCity.CalculateAttackCommandPointCostToCoord(currentcity.get_PosX(),currentcity.get_PosY());
										this.getAvailableRepairAndCP();
										this.calculateLoot();
										this.updateLayoutsList();
										this.getAttackUnits();
										//if opened new city then reset disable buttons and calculate defense bonus
										if (this.targetCityId != null && this.targetCityId !== currentcity.get_Id()) {
											this.labels.repair.available.setValue(phe.cnc.Util.getTimespanString(this.stats.repair.available));
											//this.labels.attacks.available.setValue('CP:' + Math.floor(this.stats.attacks.availableCP / this.stats.attacks.attackCost) + ' / F:' + Math.floor(this.stats.repair.available / this.stats.repair.max) + '/ C:-');
											this.labels.attacks.available.setValue('CP:' + this.stats.attacks.availableAttacksCP + ' / F:' + this.stats.attacks.availableAttacksAtFullStrength + '/ C:-');
											this.resetDisableButtons();
											var cityFaction = currentcity.get_CityFaction();
											this.view.playerCity = cityFaction === ClientLib.Base.EFactionType.GDIFaction || cityFaction === ClientLib.Base.EFactionType.NODFaction;
											if (this.view.playerCity) {
												this.view.playerCityDefenseBonus = currentcity.get_AllianceDefenseBonus();
												/*var cityAllianceId = currentcity.get_OwnerAllianceId();
												ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand("GetPublicAllianceInfo", {
													id : cityAllianceId
												}, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, this.calculateDefenseBonus), null);*/
											}
										}
										this.targetCityId = currentcity.get_Id();
									}
								}
								return;
							}

							setTimeout(function () {
								_this.onCityLoadComplete();
							}, 200);
						} catch (e) {
							console.log(e);
						}
					},
					showCombatTools : function () {
						this.curPAVM = qx.core.Init.getApplication().getPlayArea().getViewMode();
						//console.log("showCombatTools PAVM: " + this.curPAVM);
						switch (this.curPAVM) {
							//4 Scrolled up (when more than ~50% of the top is in view) this should never be the case
						case ClientLib.Data.PlayerAreaViewMode.pavmCombatSetupBase: {
								console.log("!!!\n TACS Warning\n!!!\n onCityLoadComplete, unexpected case pavmCombatSetupBase");
								break;
							}
							//5 Scrolled down -- normal combat setup
						case ClientLib.Data.PlayerAreaViewMode.pavmCombatSetupDefense: {
								if (this.options.autoDisplayStats.getValue()) {
									this.battleResultsBox.open();
								}
								break;
							}
							//6 While attacking a target
						case ClientLib.Data.PlayerAreaViewMode.pavmCombatAttacker: {
								if (this.options.autoDisplayStats.getValue() && this.saveObj.checkbox.showStatsDuringAttack) {
									this.battleResultsBox.open();
									/*if(this._armyBarContainer.isVisible()){
										this.toolBar.show();
									}*/
								}
								break;
							}
							//8
						case ClientLib.Data.PlayerAreaViewMode.pavmCombatViewerAttacker: {
								console.log("pavmCombatViewerAttacker");
								break;
							}
							//9
						case ClientLib.Data.PlayerAreaViewMode.pavmCombatViewerDefender: {
								console.log("pavmCombatViewerDefender");
								break;
							}
							//10 Watching a "sim" OR replay
						case ClientLib.Data.PlayerAreaViewMode.pavmCombatReplay: {
								if (this.saveObj.checkbox.showStatsDuringSimulation) {
									console.log("simulation case 10");
									this.battleResultsBox.open();
								}
								break;
							}
						}
					},
					getAvailableRepairAndCP : function () {
						try {
							var ownCity = this._MainData.get_Cities().get_CurrentOwnCity();
							var offHealth = ownCity.GetOffenseConditionInPercent();
							var unitData = ownCity.get_CityUnitsData();
							//var availableInfRT = ownCity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeInf);
							//var availableVehRT = ownCity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeVeh);
							//var availableAirRT = ownCity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeAir);
							var maxInfRepairCharge = unitData.GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false);
							var maxVehRepairCharge = unitData.GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false);
							var maxAirRepairCharge = unitData.GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false);
							//this.stats.repair.available = this._MainData.get_Time().GetTimeSpan(Math.min(availableInfRT, availableAirRT, availableVehRT));
							this.stats.repair.available = ClientLib.Base.Resource.GetResourceCount(ownCity.get_RepairOffenseResources().get_RepairChargeOffense());
							this.stats.repair.max = this._MainData.get_Time().GetTimeSpan(Math.max(maxInfRepairCharge, maxAirRepairCharge, maxVehRepairCharge));
							this.stats.attacks.availableCP = this._MainData.get_Player().GetCommandPointCount();
							this.stats.attacks.availableAttacksCP = Math.floor(this.stats.attacks.availableCP / this.stats.attacks.attackCost);
							this.stats.attacks.availableAttacksAtFullStrength = Math.floor(this.stats.repair.available / this.stats.repair.max) + 1;
							this.stats.attacks.availableAttacksWithCurrentRepairCharges = Math.floor(this.stats.repair.available / this.stats.repair.overall) + 1;
							if (offHealth !== 100) {
								this.stats.attacks.availableAttacksAtFullStrength--;
								this.stats.attacks.availableAttacksAtFullStrength += '*';
							} // Decrease number of attacks by 1 when unit unhealthy. Borrowed from Maelstrom Tools - by krisan
						} catch (e) {
							console.log(e);
						}
					},
					returnSetup : function () {
						// Set the scene again, just in case it didn't work the first time
						try {
							this._Application.getPlayArea().setView(ClientLib.Data.PlayerAreaViewMode.pavmCombatSetupDefense, localStorage.ta_sim_last_city, 0, 0);
						} catch (e) {
							this._Application.getPlayArea().setView(ClientLib.Data.PlayerAreaViewMode.pavmCombatSetupDefense, localStorage.ta_sim_last_city, 0, 0);
							console.log(e);
						}
					},
					checkAttackRange : function () {
						try {
							var cities = this._MainData.get_Cities();
							var target_city = cities.get_CurrentCity();
							if (target_city != null) {
								var base_city = cities.get_CurrentOwnCity();
								var attackDistance = ClientLib.Base.Util.CalculateDistance(target_city.get_PosX(), target_city.get_PosY(), base_city.get_PosX(), base_city.get_PosY());
								if (attackDistance <= 10) {
									//console.log("Target in range");
									this.buttons.attack.simulate.setEnabled(true);
									if (this.count <= 0) {
										this.buttons.attack.refreshStats.setEnabled(true);
										this.buttons.attack.toolbarRefreshStats.setEnabled(true);
									}
								} else {
									//console.log("Target Out of range");
								}
							}
						} catch (e) {
							console.log(e);
						}
					},
					skipSimulation : function () {
						try {
							while (this._VisMain.get_Battleground().get_Simulation().DoStep(false)) {}
							this._VisMain.get_Battleground().set_ReplaySpeed(1);
						} catch (e) {
							console.log(e);
						}
					},
					startSimulation : function () {
						try {
							if (Date.now() - this.lastSimulation > 10000) {
								var ownCity = this._MainData.get_Cities().get_CurrentOwnCity();
								if (!this.getAllUnitsDeactivated() && ownCity.GetOffenseConditionInPercent() > 0) {
									ClientLib.API.Battleground.GetInstance().SimulateBattle();
									this.buttons.attack.refreshStats.setEnabled(false);
									this.buttons.attack.toolbarRefreshStats.setEnabled(false);
									this.buttons.attack.simulate.setEnabled(false);
									this.labels.countDown.setWidth(110);
									this.count = 10;
									this.statsOnly = false;
								}
							} else {
								this.enterSimulationView();
								this._VisMain.get_Battleground().RestartReplay();
								this._VisMain.get_Battleground().set_ReplaySpeed(1);
							}
						} catch (e) {
							console.log(e);
						}
					},
					onSimulateBattleFinishedEvent : function (data) {
						//console.log("data:");
						//console.log(data);
						this.timerEnd("onSimulateBattleFinishedEvent");
						try {
							if (!this.statsOnly) {
								this.enterSimulationView();
								setTimeout(function () {
									ClientLib.Vis.VisMain.GetInstance().get_Battleground().set_ReplaySpeed(1);
								}, 1);
							}
							var total_hp = 0;
							var end_hp = 0;
							var e_total_hp = 0;
							var e_end_hp = 0;
							var eb_total_hp = 0;
							var eb_end_hp = 0;
							var eu_total_hp = 0;
							var eu_end_hp = 0;
							var i_end_hp = 0;
							var v_end_hp = 0;
							var a_end_hp = 0;
							var v_total_hp = 0;
							var a_total_hp = 0;
							var i_total_hp = 0;
							var costInf = 0;
							var costAir = 0;
							var costVeh = 0;
							this.stats.damage.structures.defense = 0;
							this.stats.damage.structures.construction = 0;
							this.stats.damage.structures.command = 0;
							this.stats.supportLevel = 0;
							this.stats.damage.structures.support = 0;
							this.stats.repair.infantry = 0;
							this.stats.repair.vehicle = 0;
							this.stats.repair.aircraft = 0;

							this.lastSimulation = Date.now();
							if (this.count == 10) this.counter = setInterval(this.countDownToNextSimulation, 1000);

							for (var i = 0; i < data.length; i++) {
								var unitData = data[i].Value;
								var unitMDBID = unitData.t;
								var unit = ClientLib.Res.ResMain.GetInstance().GetUnit_Obj(unitMDBID);
								var placementType = unit.pt;
								var movementType = unit.mt;
								var unitLevel = unitData.l;
								var unitStartHealth = unitData.sh;
								var unitEndHealth = unitData.h;
								var unitMaxHealth = ClientLib.API.Util.GetUnitMaxHealthByLevel(unitLevel, unit, false);

								switch (placementType) {
								case ClientLib.Base.EPlacementType.Defense:
									if (this.view.playerCity) {
										var defenseBonus = this.view.playerCityDefenseBonus;
										var nerfBoostModifier = ClientLib.Base.Util.GetNerfAndBoostModifier(unitLevel, defenseBonus);
										unitMaxHealth = Math.floor((unitMaxHealth * nerfBoostModifier) / 100 * 16) / 16;
									}
									eu_total_hp += unitMaxHealth;
									eu_end_hp += unitEndHealth;
									e_total_hp += unitMaxHealth;
									e_end_hp += unitEndHealth;
									break;
								case ClientLib.Base.EPlacementType.Offense:
									total_hp += unitMaxHealth;
									end_hp += unitEndHealth;
									switch (movementType) {
									case ClientLib.Base.EUnitMovementType.Feet:
										i_total_hp += unitMaxHealth;
										i_end_hp += unitEndHealth;
										costInf += this.getRepairCost(unitStartHealth, unitEndHealth, unitMaxHealth, unitLevel, unitMDBID);
										break;
									case ClientLib.Base.EUnitMovementType.Wheel:
									case ClientLib.Base.EUnitMovementType.Track:
										v_total_hp += unitMaxHealth;
										v_end_hp += unitEndHealth;
										costVeh += this.getRepairCost(unitStartHealth, unitEndHealth, unitMaxHealth, unitLevel, unitMDBID);
										break;
									case ClientLib.Base.EUnitMovementType.Air:
									case ClientLib.Base.EUnitMovementType.Air2:
										a_total_hp += unitMaxHealth;
										a_end_hp += unitEndHealth;
										costAir += this.getRepairCost(unitStartHealth, unitEndHealth, unitMaxHealth, unitLevel, unitMDBID);
										break;
									}
									break;
								case ClientLib.Base.EPlacementType.Structure:
									if (this.view.playerCity) {
										var defenseBonus = this.view.playerCityDefenseBonus;
										var nerfBoostModifier = ClientLib.Base.Util.GetNerfAndBoostModifier(unitLevel, defenseBonus);
										unitMaxHealth = Math.floor((unitMaxHealth * nerfBoostModifier) / 100 * 16) / 16;
									}
									eb_total_hp += unitMaxHealth;
									eb_end_hp += unitEndHealth;
									e_total_hp += unitMaxHealth;
									e_end_hp += unitEndHealth;
									break;
								}

								if (unitMDBID >= 200 && unitMDBID <= 205) {
									this.stats.supportLevel = unitLevel;
									this.stats.damage.structures.support = (unitEndHealth / 16 / unitMaxHealth) * 100;
								} else {
									switch (unitMDBID) {
									case 131:
										// GDI DF
									case 158:
										// NOD DF
									case 195:
										// Forgotten DF
										this.stats.damage.structures.defense = (unitStartHealth > 0) ? (unitEndHealth / 16 / unitMaxHealth) * 100 : 0;
										break;
									case 112:
										// GDI CY
									case 151:
										// NOD CY
									case 177:
										// Forgotten CY
										this.stats.damage.structures.construction = (unitEndHealth / 16 / unitMaxHealth) * 100;
										break;
									case 111:
										// GDI CC
									case 159:
										// NOD CC
										this.stats.damage.structures.command = (unitEndHealth / 16 / unitMaxHealth) * 100;
										break;
									}
								}
							}

							// Calculate Percentages
							this.stats.health.infantry = i_total_hp ? (i_end_hp / 16 / i_total_hp) * 100 : 100;
							this.stats.health.vehicle = v_total_hp ? (v_end_hp / 16 / v_total_hp) * 100 : 100;
							this.stats.health.aircraft = a_total_hp ? (a_end_hp / 16 / a_total_hp) * 100 : 100;
							this.stats.damage.units.overall = eu_total_hp ? (eu_end_hp / 16 / eu_total_hp) * 100 : 0;
							this.stats.damage.structures.overall = (eb_end_hp / 16 / eb_total_hp) * 100;
							this.stats.damage.overall = (e_end_hp / 16 / e_total_hp) * 100;
							this.stats.health.overall = end_hp ? (end_hp / 16 / total_hp) * 100 : 0;

							// Calculate the repair time
							var _this = this;
							this.stats.repair.infantry = _this._MainData.get_Time().GetTimeSpan(costInf);
							this.stats.repair.aircraft = _this._MainData.get_Time().GetTimeSpan(costAir);
							this.stats.repair.vehicle = _this._MainData.get_Time().GetTimeSpan(costVeh);
							this.stats.repair.overall = _this._MainData.get_Time().GetTimeSpan(Math.max(costInf, costAir, costVeh));
							this.getAvailableRepairAndCP();
							this.updateStatsWindow();
							this.buttons.attack.simulate.setEnabled(true);

						} catch (e) {
							console.log('onSimulateBattleFinishedEvent()\n check getRepairCost()', e);
						}
					},
					enterSimulationView : function () {
						try {
							var city = this._MainData.get_Cities().get_CurrentCity();
							var ownCity = this._MainData.get_Cities().get_CurrentOwnCity();
							ownCity.get_CityArmyFormationsManager().set_CurrentTargetBaseId(city.get_Id());
							localStorage.ta_sim_last_city = city.get_Id();
							this._Application.getPlayArea().setView(ClientLib.Data.PlayerAreaViewMode.pavmCombatReplay, city.get_Id(), 0, 0);
						} catch (e) {
							console.log(e);
						}
					},
					//Undo / Redo
					saveUndoState : function () {
						var formation = this.getFormation();
						var ts = this.getTimestamp();
						var stats = this.badClone(this.stats);
						this.undoCache[0] = {
							f : formation,
							t : ts,
							s : stats
						};
						console.log(this.undoCache[0]);
						/*
						f.d = {
							eb : 0,
							de : 0,
							bu : 0,
							cy : 0,
							df : 0,
							cc : 0,
							sl : 0,
							ovr : this.stats.health.overall,
							inf : this.stats.health.infantry,
							veh : this.stats.health.vehicle,
							air : this.stats.health.aircraft,
							ou : 0,
							bt : 0
						};
						*/
						
					},
					wipeUndoStateAfter : function (timestamp) {
						var i;
						for (i = 0; i < this.undoCache.length; i++) {
							if (this.undoCache[i].t > timestamp){
								
								break;
							}
						}
						this.undoCache = this.undoCache.slice(0,i);
					},
					
					//Layouts
					updateLayoutsList : function () {
						try {
							this.layouts.list.removeAll();
							// Load the saved layouts for this city
							this.loadCityLayouts();
							if (this.layouts.current) {
								for (var i in this.layouts.current) {
									var layout = this.layouts.current[i];
									var item = new qx.ui.form.ListItem(layout.label, null, layout.id);
									//item.addListener("cellDblclick", function (){},this)
									this.layouts.list.add(item);
								}
							}
						} catch (e) {
							console.log(e);
						}
					},
					deleteCityLayout : function () {
						try {
							var list = this.layouts.list.getSelection();
							if (list != null && list.length > 0) {
								var lid = list[0].getModel();
								if (this.layouts.current && typeof this.layouts.current[lid] !== 'undefined') {
									delete this.layouts.current[lid];
									this.saveLayouts();
									this.updateLayoutsList();
									this.updateSaveMarkers();
								}
							}
						} catch (e) {
							console.log(e);
						}
					},
					loadCityLayout : function (lid) {
						try {
							var list = this.layouts.list.getSelection();
							if (list != null && list.length > 0) {
								var layout = typeof lid === 'object' ? list[0].getModel() : lid;
								if (this.layouts.current && typeof this.layouts.current[layout] !== 'undefined') {
									//console.log("layout: ");
									//console.log(layout);
									//console.log(this.layouts.current[layout].layout);
									this.loadFormation(this.layouts.current[layout].layout);
								}
							}
						} catch (e) {
							console.log(e);
						}
					},
					saveCityLayout : function () {
						var formation = [],
						lid,
						title;
						try {
							formation = this.getFormation();
							lid = new Date().getTime().toString();
							if (this.stats.damage.structures.construction !== null) {
								title = this.layouts.label.getValue() + " (" + this.stats.damage.structures.construction.toFixed(0).toString() + ":" + this.stats.damage.structures.defense.toFixed(0).toString() + ":" + this.stats.damage.units.overall.toFixed(0).toString() + ")";
							} else {
								title = this.layouts.label.getValue() + " (??:??:??)";
							}
							this.layouts.current[lid] = {
								id : lid,
								label : title,
								layout : formation
							};

							this.saveLayouts();
							this.updateLayoutsList();
							this.updateSaveMarkers();
							this.layouts.label.setValue("");
						} catch (e) {
							console.log(e);
						}
						return lid; // return value at the end
					},
					loadCityLayouts : function () {
						try {
							if (this._MainData.get_Cities().get_CurrentCity() == null)
								return;
							var target_city = this._MainData.get_Cities().get_CurrentCity().get_Id();
							var base_city = this._MainData.get_Cities().get_CurrentOwnCity().get_Id();
							if (!this.layouts.all.hasOwnProperty(target_city))
								this.layouts.all[target_city] = {};
							if (!this.layouts.all[target_city].hasOwnProperty(base_city))
								this.layouts.all[target_city][base_city] = {};
							this.layouts.current = this.layouts.all[target_city][base_city];
						} catch (e) {
							console.log(e);
						}
					},
					loadLayouts : function () {
						try {
							var temp = localStorage.ta_sim_layouts;
							if (temp)
								this.layouts.all = JSON.parse(temp);
							else
								this.layouts.all = {};
						} catch (e) {
							console.log(e);
						}
					},
					saveLayouts : function () {
						try {
							localStorage.ta_sim_layouts = JSON.stringify(this.layouts.all);
						} catch (e) {
							console.log(e);
						}
					},
					//Formations
					loadFormation : function (formation) {
						try {
							this.layouts.restore = true;
							//console.log("this.view = ");
							//console.log(this.view);

							for (var i = 0; i < formation.length; i++) {
								var unit = formation[i];
								if (i == formation.length - 1) this.layouts.restore = false;
								for (var j = 0; j < this.view.lastUnitList.length; j++) {
									if (this.view.lastUnitList[j].get_Id() === unit.id) {
										this.view.lastUnitList[j].MoveBattleUnit(unit.x, unit.y);
										if (unit.e === undefined)
											this.view.lastUnitList[j].set_Enabled(true);
										else
											this.view.lastUnitList[j].set_Enabled(unit.e);
									}
								}
							}

							//this.view.lastUnits.RefreshData(); // RefreshData() has been obfuscated ?

						} catch (e) {
							console.log(e);
						}
					},
					getFormation : function () {
						var formation = [];
						try {
							for (var i = 0; i < this.view.lastUnitList.length; i++) {
								var unit = this.view.lastUnitList[i];
								var armyUnit = {};
								armyUnit.x = unit.get_CoordX();
								armyUnit.y = unit.get_CoordY();
								armyUnit.id = unit.get_Id();
								armyUnit.e = unit.get_Enabled();
								formation.push(armyUnit);
							}
						} catch (e) {
							console.log(e);
						}
						return formation; // return value at the end
					},
					shiftFormation : function (direction) { //left right up down
						var Army = [],
						v_shift = 0,
						h_shift = 0;
						if (direction === "u")
							v_shift = -1;
						if (direction === "d")
							v_shift = 1;
						if (direction === "l")
							h_shift = -1;
						if (direction === "r")
							h_shift = 1;

						//read army, consider use getFormation(?)
						for (var i = 0; i < this.view.lastUnitList.length; i++) {
							var unit = this.view.lastUnitList[i];
							var armyUnit = {};
							var x = unit.get_CoordX() + h_shift;
							switch (x) {
							case 9:
								x = 0;
								break;
							case  - 1:
								x = 8;
								break;
							}
							var y = unit.get_CoordY() + v_shift;
							switch (y) {
							case 4:
								y = 0;
								break;
							case  - 1:
								y = 3;
								break;
							}
							armyUnit.x = x;
							armyUnit.y = y;
							armyUnit.id = unit.get_Id();
							armyUnit.e = unit.get_Enabled();
							Army.push(armyUnit);
						}
						this.loadFormation(Army);
					},
					flipFormation : function (axis) {
						var Army = [];
						try {
							for (var i = 0; i < this.view.lastUnitList.length; i++) {
								var unit = this.view.lastUnitList[i];
								var armyUnit = {};
								var x = unit.get_CoordX();
								var y = unit.get_CoordY();

								if (axis === 'horizontal') {
									x = Math.abs(x - 8);
								} else if (axis === 'vertical') {
									y = Math.abs(y - 3);
								}

								armyUnit.x = x;
								armyUnit.y = y;
								armyUnit.id = unit.get_Id();
								armyUnit.e = unit.get_Enabled();
								Army.push(armyUnit);
							}
							this.loadFormation(Army);
						} catch (e) {
							console.log(e);
						}
					},
					activateUnits : function (type, activate) {
						var Army = [];
						try {
							for (var i = 0; i < this.view.lastUnitList.length; i++) {
								var unit = this.view.lastUnitList[i];
								var armyUnit = {};

								switch (type) {
								case 'air':
									if (unit.get_UnitGameData_Obj().mt === ClientLib.Base.EUnitMovementType.Air || unit.get_UnitGameData_Obj().mt === ClientLib.Base.EUnitMovementType.Air2)
										unit.set_Enabled(activate);
									break;
								case 'infantry':
									if (unit.get_UnitGameData_Obj().mt === ClientLib.Base.EUnitMovementType.Feet)
										unit.set_Enabled(activate);
									break;
								case 'vehicles':
									if (unit.get_UnitGameData_Obj().mt === ClientLib.Base.EUnitMovementType.Wheel || unit.get_UnitGameData_Obj().mt === ClientLib.Base.EUnitMovementType.Track)
										unit.set_Enabled(activate);
									break;
								}

								armyUnit.x = unit.get_CoordX();
								armyUnit.y = unit.get_CoordY();
								armyUnit.e = unit.get_Enabled();
								armyUnit.id = unit.get_Id();
								Army.push(armyUnit);
							}
							this.loadFormation(Army);
						} catch (e) {
							console.log(e);
						}
					},
					resetFormation : function () {
						var Army = [];
						try {
							for (var i = 0; i < this.view.lastUnitList.length; i++) {
								var unit = this.view.lastUnitList[i];
								var armyUnit = {};

								armyUnit.x = unit.GetCityUnit().get_CoordX();
								armyUnit.y = unit.GetCityUnit().get_CoordY();
								armyUnit.id = unit.get_Id();
								Army.push(armyUnit);
							}
							this.loadFormation(Army);
							if (this.buttons.attack.activateInfantry.getValue(true))
								this.buttons.attack.activateInfantry.setValue(false);
							if (this.buttons.attack.activateVehicles.getValue(true))
								this.buttons.attack.activateVehicles.setValue(false);
							if (this.buttons.attack.activateAir.getValue(true))
								this.buttons.attack.activateAir.setValue(false);
						} catch (e) {
							console.log(e);
						}
					},
					//Audio
					playSound : function (str, _this) {
						var temp = _this.audio[str].cloneNode(true);
						temp.volume = _this.getAudioSettings().ui / 100;
						temp.play();
					},
					getAudioSettings : function () {
						return JSON.parse(localStorage.getItem("CNC_Audio"));
					},
					//Repair
					repairUnit : function () {
						try {
							ClientLib.Net.CommunicationManager.GetInstance().SendCommand("Repair", {
								cityid : this.ownCityId,
								entityId : this.unitId,
								mode : 4
							}, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, window.TACS.getInstance().repairResult), this.buttonId, true);
						} catch (e) {
							console.log(e);
						}
					},
					repairResult : function (buttonId, result) {
						// result erroneously true when not enough RT, button deletes/sound plays but unit does not repair.
						try {
							if (result) {
								var _this = window.TACS.getInstance();
								if (_this.saveObj.audio.playRepairSound) {
									if (_this.repairButtons[buttonId].unitType == "Inf"){
										_this.playSound("soundRepairReload", _this);
									} else {
										_this.playSound("soundRepairImpact", _this);
									}
								}
								_this._armyBar.remove(_this.repairButtons[buttonId]);
								delete _this.repairButtons[buttonId];
							}
						} catch (e) {
							console.log(e);
						}
					},
					removeAllRepairButtons : function () {
						for (var i in this.repairButtons) {
							this._armyBar.remove(this.repairButtons[i]);
						}
						this.repairButtons = [];
					},
					setResizeTimer : function () {
						var _this = this;
						if (this.repairButtonsRedrawTimer) {
							clearTimeout(_this.repairButtonsRedrawTimer);
						}
						this.repairButtonsRedrawTimer = setTimeout(function () {
								_this.redrawRepairButtons(_this);
							}, 500);
					},
					redrawRepairButtons : function (that) {
						var _this = that || this;
						var base_city_id = _this._MainData.get_Cities().get_CurrentOwnCity().get_Id();
						if (_this.repairButtons.length > 0) {
							_this.removeAllRepairButtons();
						}
						var cbtSetup = _this._VisMain.get_CombatSetup();
						var zoomFactor = cbtSetup.get_ZoomFactor();
						var startX = Math.round(cbtSetup.get_MinXPosition() * zoomFactor * -1) + 10; //qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_ATTACKSETUP).getChildren()[1].getBounds().left;
						var startY = 7;
						var gridWidth = Math.round(cbtSetup.get_GridWidth() * zoomFactor);
						var gridHeight = 38;

						for (var i = 0; i < _this.view.lastUnitList.length; i++) {
							var unit = _this.view.lastUnitList[i];

							if (unit.get_HitpointsPercent() < 1) {
								var cityUnit = unit.GetCityUnit();
								var unitRepairCharges = cityUnit.GetResourceCostForFullRepair().d;
								var resourceCost,
								repairCharge,
								unitType;

								for (var type in unitRepairCharges) {
									type = parseInt(type);
									switch (type) {
									case ClientLib.Base.EResourceType.Crystal:
										resourceCost = unitRepairCharges[type];
										break;
									case ClientLib.Base.EResourceType.RepairChargeInf:
										repairCharge = unitRepairCharges[type];
										unitType = "Inf";
										break;
									case ClientLib.Base.EResourceType.RepairChargeVeh:
										repairCharge = unitRepairCharges[type];
										unitType = "Veh";
										break;
									case ClientLib.Base.EResourceType.RepairChargeAir:
										repairCharge = unitRepairCharges[type];
										unitType = "Air";
										break;
									}

								}
								repairCharge = phe.cnc.Util.getTimespanString(_this._MainData.get_Time().GetTimeSpan(repairCharge));
								resourceCost = _this.formatNumberWithCommas(resourceCost);

								_this.repairButtons[i] = new qx.ui.form.Button("", "data:image/png;base64,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%3D%3D");
								_this.repairButtons[i].set({
									decorator : new qx.ui.decoration.Background().set({
										backgroundColor : 'transparent'
									}),
									width : gridWidth,
									height : gridHeight,
									show : "icon",
									center : false,
									padding : 3,
									appearance : "button-text-small",
									cursor : "pointer",
									toolTipText : "Crystal: " + resourceCost + " / Time: " + repairCharge + " / Type: " + unitType
								});
								_this.repairButtons[i].addListener("execute", _this.repairUnit, {
									ownCityId : base_city_id,
									unitId : unit.get_Id(),
									buttonId : i,
									frm : _this
								});
								_this.repairButtons[i].unitType = unitType;
								//        allowGrowY: false
								_this._armyBar.add(_this.repairButtons[i], {
									left : startX + gridWidth * unit.get_CoordX(),
									top : startY + gridHeight * unit.get_CoordY()
								});
							}
						}
					},
					toggleRepairMode : function () {
						try {
							var _this = this;
							if (!this.audio.soundRepairImpact) {
								this.audio.soundRepairImpact = new Audio(window.soundRepairImpact.d);
								this.audio.soundRepairReload = new Audio(window.soundRepairReload.d);
								this.audio.soundRepairImpact.volume = this.getAudioSettings().ui / 100;
								this.audio.soundRepairReload.volume = this.getAudioSettings().ui / 100;
							}
							this._armyBar.getLayoutParent().toggleEnabled();
							this._armyBar.setEnabled(true);
							this.userInterface.toggleEnabled();
							this.battleResultsBox.toggleEnabled();
							if (this.buttons.attack.repairMode.getValue()) {
								this.redrawRepairButtons();
								this._armyBar.addListener("resize", this.setResizeTimer, this);
								this.repairInfo.show();
								this.updateRepairTimeInfobox();
								this.repairModeTimer = setInterval(this.updateRepairTimeInfobox, 1000);
							} else {
								this.removeAllRepairButtons();
								this._armyBar.removeListener("resize", this.setResizeTimer, this);
								this.repairInfo.hide();
								clearInterval(this.repairModeTimer);
							}
						} catch (e) {
							console.log(e);
						}
					},
					updateRepairTimeInfobox : function () {
						try {
							var _this = window.TACS.getInstance();
							var ownCity = _this._MainData.get_Cities().get_CurrentOwnCity();
							var availableInfRT = ownCity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeInf);
							var availableVehRT = ownCity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeVeh);
							var availableAirRT = ownCity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeAir);
							_this.stats.repair.available = ClientLib.Base.Resource.GetResourceCount(ownCity.get_RepairOffenseResources().get_RepairChargeOffense());
							_this.labels.repairinfos.available.setValue(phe.cnc.Util.getTimespanString(_this.stats.repair.available));
							_this.labels.repairinfos.infantry.setValue(phe.cnc.Util.getTimespanString(availableInfRT - _this.stats.repair.available));
							_this.labels.repairinfos.vehicle.setValue(phe.cnc.Util.getTimespanString(availableVehRT - _this.stats.repair.available));
							_this.labels.repairinfos.aircraft.setValue(phe.cnc.Util.getTimespanString(availableAirRT - _this.stats.repair.available));
							
							/*var unitGroupData = phe.cnc.gui.RepairUtil.getUnitGroupCityData(ownCity);
							if (unitGroupData[ClientLib.Data.EUnitGroup.Infantry].lowestUnitDmgRatio == 1) console.log("No damage to Infantry");
							if (unitGroupData[ClientLib.Data.EUnitGroup.Vehicle].lowestUnitDmgRatio == 1) console.log("No damage to Vehicles");
							if (unitGroupData[ClientLib.Data.EUnitGroup.Aircraft].lowestUnitDmgRatio == 1) console.log("No damage to Aircraft");*/
							
						} catch (e) {
							console.log(e);
						}
					},
					resetDblClick : function () {
						try {
							var _this = window.TACS.getInstance();
							clearInterval(_this.armybarClearnClickCounter);
							_this.armybarClickCount = 0;
						} catch (e) {
							console.log(e);
						}
					},
					updateSaveMarkers : function () {
						try {
							if (this.options.markSavedTargets.getValue()) {
								var currCity = this._MainData.get_Cities().get_CurrentOwnCity();
								var base_city = currCity.get_Id();
								var x = currCity.get_X();
								var y = currCity.get_Y();
								var region = this._VisMain.get_Region();
								var attackDistance = this._MainData.get_Server().get_MaxAttackDistance() + 0.1;
								var playerFaction = this._MainData.get_Player().get_Faction();
								switch (playerFaction) {
								case ClientLib.Base.EFactionType.GDIFaction:
									var saveColor = ClientLib.Vis.EBackgroundPlateColor.Orange;
									break;
								case ClientLib.Base.EFactionType.NODFaction:
									var saveColor = ClientLib.Vis.EBackgroundPlateColor.Cyan;
									break;
								}

								for (var i = x - (attackDistance); i < (x + attackDistance); i++) {
									for (var j = y - attackDistance; j < (y + attackDistance); j++) {
										var visObject = region.GetObjectFromPosition(i * region.get_GridWidth(), j * region.get_GridHeight());
										if (visObject != null) {
											if (visObject.get_VisObjectType() == ClientLib.Vis.VisObject.EObjectType.RegionNPCCamp ||
												visObject.get_VisObjectType() == ClientLib.Vis.VisObject.EObjectType.RegionCityType ||
												visObject.get_VisObjectType() == ClientLib.Vis.VisObject.EObjectType.RegionNPCBase) {
												if (visObject.get_VisObjectType() == ClientLib.Vis.VisObject.EObjectType.RegionNPCCamp) {
													if (visObject.get_IsDestroyed())
														continue;
												}
												if (visObject.get_VisObjectType() == ClientLib.Vis.VisObject.EObjectType.RegionCityType) {
													if (visObject.IsOwnBase())
														continue;
												}

												visObject.get_BasePlate().setPlateColor(ClientLib.Vis.EBackgroundPlateColor.Black);
												var target_city = visObject.get_Id();
												if (this.layouts.all.hasOwnProperty(target_city)) {
													if (this.layouts.all[target_city].hasOwnProperty(base_city)) {
														var count = 0;
														for (var key in this.layouts.all[target_city][base_city]) {
															if (this.layouts.all[target_city][base_city].hasOwnProperty(key)) {
																count++;
															}
														}
														if (count > 0)
															visObject.get_BasePlate().setPlateColor(saveColor);
													}
												}
											}
										}
									}
								}
							}
						} catch (e) {
							console.log(e);
						}
					},
					//Util
					getDateFromMillis : function (ms) {
						return new Date(ms);
					},
					getTimestamp : function () {
						return new Date().getTime();
					},
					timerStart : function () {
						this.ts1 = this.getTimestamp();
					},
					timerEnd : function (functionName) {
						functionName = functionName || "nullName";
						this.ts2 = this.getTimestamp();
						var diff = this.ts2 - this.ts1;
						console.log(diff+"ms to run "+functionName)
					},
					badClone : function (obj) {
						// broken
						var stringied = JSON.stringify(obj);
						//var p = JSON.parse(stringied);
						return stringied;
					}
				}
			});
		}

		var TASuite_timeout = 0; // 10 seconds

		function TASuite_checkIfLoaded() {
			try {
				if (typeof qx !== 'undefined') {
					var a = qx.core.Init.getApplication(); // application
					var mb = qx.core.Init.getApplication().getMenuBar();
					var v = ClientLib.Vis.VisMain.GetInstance();
					var md = ClientLib.Data.MainData.GetInstance();
					if (a && mb && v && md && typeof PerforceChangelist !== 'undefined') {
						if (TASuite_timeout > 10 || typeof CCTAWrapper_IsInstalled !== 'undefined') {
							CreateTweak();
							window.TACS.getInstance().initialize();

							/*if (typeof ClientLib.API.Util.GetUnitMaxHealthByLevel == 'undefined') {
								for (var key in ClientLib.Base.Util) {
									var strFunction = ClientLib.Base.Util[key].toString();
									if (typeof ClientLib.Base.Util[key] === 'function' & strFunction.indexOf("1.1") > -1 & strFunction.indexOf("*=") > -1) {
										ClientLib.API.Util.GetUnitMaxHealthByLevel = ClientLib.Base.Util[key];
										break;
									}
								}
							}*/
							if (PerforceChangelist >= 392583) { //endgame patch - repair costs fix
								var currentCity = ClientLib.Data.Cities.prototype.get_CurrentCity.toString();
								for (var i in ClientLib.Data.Cities.prototype) {
									if (ClientLib.Data.Cities.prototype.hasOwnProperty(i) && typeof(ClientLib.Data.Cities.prototype[i]) === 'function') {
										var strCityFunction = ClientLib.Data.Cities.prototype[i].toString();
										if (strCityFunction.indexOf(currentCity) > -1) {
											if (i.length == 6) {
												currentCity = i;
												break;
											}
										}
									}
								}
								var currentOwnCity = ClientLib.Data.Cities.prototype.get_CurrentOwnCity.toString();
								for (var y in ClientLib.Data.Cities.prototype) {
									if (ClientLib.Data.Cities.prototype.hasOwnProperty(y) && typeof(ClientLib.Data.Cities.prototype[y]) === 'function') {
										var strOwnCityFunction = ClientLib.Data.Cities.prototype[y].toString();
										if (strOwnCityFunction.indexOf(currentOwnCity) > -1) {
											if (y.length == 6) {
												currentOwnCity = y;
												break;
											}
										}
									}
								}
								var strFunction = ClientLib.API.Util.GetUnitRepairCosts.toString();
								strFunction = strFunction.replace(currentCity, currentOwnCity);
								var functionBody = strFunction.substring(strFunction.indexOf("{") + 1, strFunction.lastIndexOf("}"));
								var fn = Function('a,b,c', functionBody);
								ClientLib.API.Util.GetUnitRepairCosts = fn;
							}

							// Solution for OnSimulateBattleFinishedEvent issue
							for (var key in ClientLib.API.Battleground.prototype) {
								if (typeof ClientLib.API.Battleground.prototype[key] === 'function') {
									strFunction = ClientLib.API.Battleground.prototype[key].toString();
									if (strFunction.indexOf("pavmCombatReplay,-1,0,0,0);") > -1) {
										strFunction = strFunction.substring(strFunction.indexOf("{") + 1, strFunction.lastIndexOf("}"));
										var re = /.I.[A-Z]{6}.[A-Z]{6}\(.I.[A-Z]{6}.pavmCombatReplay,-1,0,0,0\)\;/;
										strFunction = strFunction.replace(re, "");
										console.log(strFunction);
										var fn = Function('a,b', strFunction);
										ClientLib.API.Battleground.prototype[key] = fn;
										break;
									}
								}
							}

							for (var key in ClientLib.Vis.BaseView.BaseView.prototype) {
								if (typeof ClientLib.Vis.BaseView.BaseView.prototype[key] === 'function') {
									strFunction = ClientLib.Vis.BaseView.BaseView.prototype[key].toString();
									if (strFunction.indexOf(ClientLib.Vis.BaseView.BaseView.prototype.ShowToolTip.toString()) > -1) {
										console.log("ClientLib.Vis.BaseView.BaseView.prototype.ShowToolTip_Original = ClientLib.Vis.BaseView.BaseView.prototype." + key);
										var showToolTip_Original = "ClientLib.Vis.BaseView.BaseView.prototype.ShowToolTip_Original = ClientLib.Vis.BaseView.BaseView.prototype." + key;
										var stto = Function('', showToolTip_Original);
										stto();
										var showToolTip_New = "ClientLib.Vis.BaseView.BaseView.prototype." + key + "=function (a){if(ClientLib.Vis.VisMain.GetInstance().get_Mode()==7&&window.TACS.getInstance().saveObj.checkbox.disableAttackPreparationTooltips){return;}else{this.ShowToolTip_Original(a);}}";
										var sttn = Function('', showToolTip_New);
										sttn();
										console.log(showToolTip_New);
										break;
									}
								}
							}
							qx.core.Init.getApplication().getArmyUnitTooltipOverlay().setVisibility_Original = qx.core.Init.getApplication().getArmyUnitTooltipOverlay().setVisibility;
							qx.core.Init.getApplication().getArmyUnitTooltipOverlay().setVisibility = function (a) {
								if (window.TACS.getInstance().saveObj.checkbox.disableArmyFormationManagerTooltips) {
									qx.core.Init.getApplication().getArmyUnitTooltipOverlay().setVisibility_Original(false);
								} else {
									qx.core.Init.getApplication().getArmyUnitTooltipOverlay().setVisibility_Original(a);
								}
							};
						
						} else {
							TASuite_timeout++;
							window.setTimeout(TASuite_checkIfLoaded, 1000);
						}
					} else
						window.setTimeout(TASuite_checkIfLoaded, 1000);
				} else {
					window.setTimeout(TASuite_checkIfLoaded, 1000);
				}
			} catch (e) {
				if (typeof console !== 'undefined')
					console.log(e);
				else if (window.opera)
					opera.postError(e);
				else
					GM_log(e);
			}
		}

		if (/commandandconquer\.com/i.test(document.domain)) {
			window.setTimeout(TASuite_checkIfLoaded, 1000);
		}

	};
	// injecting, because there seem to be problems when creating game interface with unsafeWindow
	var TASuiteScript = document.createElement("script");
	var TAtxt = TASuite_mainFunction.toString();
	TASuiteScript.innerHTML = "(" + TAtxt + ")();";
	TASuiteScript.type = "text/javascript";
	if (/commandandconquer\.com/i.test(document.domain))
		document.getElementsByTagName("head")[0].appendChild(TASuiteScript);

	//Sound sample B64LOBs
	window.soundRepairImpact = {
		info : "Impact Wrench Sound; Used in TACS; courtesy of: http://www.freesfx.co.uk",
		d : "data:video/ogg;base64,T2dnUwACAAAAAAAAAADGNAAAAAAAAGaVV6ABHgF2b3JiaXMAAAAAAQB9AAAAAAAAAPoAAAAAAAC4AU9nZ1MAAAAAAAAAAAAAxjQAAAEAAACQEk9NDlL///////////////8RA3ZvcmJpcx0AAABYaXBoLk9yZyBsaWJWb3JiaXMgSSAyMDA3MDYyMgEAAAAhAAAAQ09NTUVOVFM9aHR0cDovL3d3dy5mcmVlc2Z4LmNvLnVrAQV2b3JiaXMiQkNWAQBAAAAkcxgqRqVzFoQQGkJQGeMcQs5r7BlCTBGCHDJMW8slc5AhpKBCiFsogdCQVQAAQAAAh0F4FISKQQghhCU9WJKDJz0IIYSIOXgUhGlBCCGEEEIIIYQQQgghhEU5aJKDJ0EIHYTjMDgMg+U4+ByERTlYEIMnQegghA9CuJqDrDkIIYQkNUhQgwY56ByEwiwoioLEMLgWhAQ1KIyC5DDI1IMLQoiag0k1+BqEZ0F4FoRpQQghhCRBSJCDBkHIGIRGQViSgwY5uBSEy0GoGoQqOQgfhCA0ZBUAkAAAoKIoiqIoChAasgoAyAAAEEBRFMdxHMmRHMmxHAsIDVkFAAABAAgAAKBIiqRIjuRIkiRZkiVZkiVZkuaJqizLsizLsizLMhAasgoASAAAUFEMRXEUBwgNWQUAZAAACKA4iqVYiqVoiueIjgiEhqwCAIAAAAQAABA0Q1M8R5REz1RV17Zt27Zt27Zt27Zt27ZtW5ZlGQgNWQUAQAAAENJpZqkGiDADGQZCQ1YBAAgAAIARijDEgNCQVQAAQAAAgBhKDqIJrTnfnOOgWQ6aSrE5HZxItXmSm4q5Oeecc87J5pwxzjnnnKKcWQyaCa0555zEoFkKmgmtOeecJ7F50JoqrTnnnHHO6WCcEcY555wmrXmQmo21OeecBa1pjppLsTnnnEi5eVKbS7U555xzzjnnnHPOOeec6sXpHJwTzjnnnKi9uZab0MU555xPxunenBDOOeecc84555xzzjnnnCA0ZBUAAAQAQBCGjWHcKQjS52ggRhFiGjLpQffoMAkag5xC6tHoaKSUOggllXFSSicIDVkFAAACAEAIIYUUUkghhRRSSCGFFGKIIYYYcsopp6CCSiqpqKKMMssss8wyyyyzzDrsrLMOOwwxxBBDK63EUlNtNdZYa+4555qDtFZaa621UkoppZRSCkJDVgEAIAAABEIGGWSQUUghhRRiiCmnnHIKKqiA0JBVAAAgAIAAAAAAT/Ic0REd0REd0REd0REd0fEczxElURIlURIt0zI101NFVXVl15Z1Wbd9W9iFXfd93fd93fh1YViWZVmWZVmWZVmWZVmWZVmWIDRkFQAAAgAAIIQQQkghhRRSSCnGGHPMOegklBAIDVkFAAACAAgAAABwFEdxHMmRHEmyJEvSJM3SLE/zNE8TPVEURdM0VdEVXVE3bVE2ZdM1XVM2XVVWbVeWbVu2dduXZdv3fd/3fd/3fd/3fd/3fV0HQkNWAQASAAA6kiMpkiIpkuM4jiRJQGjIKgBABgBAAACK4iiO4ziSJEmSJWmSZ3mWqJma6ZmeKqpAaMgqAAAQAEAAAAAAAACKpniKqXiKqHiO6IiSaJmWqKmaK8qm7Lqu67qu67qu67qu67qu67qu67qu67qu67qu67qu67qu67quC4SGrAIAJAAAdCRHciRHUiRFUiRHcoDQkFUAgAwAgAAAHMMxJEVyLMvSNE/zNE8TPdETPdNTRVd0gdCQVQAAIACAAAAAAAAADMmwFMvRHE0SJdVSLVVTLdVSRdVTVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTdM0TRMIDVkJAAABAMAchM4tqJBJCS2YiijEJOhSQQcp6M4wgqD3EjmDnMcUOUKQxpZJhJgGQkNWBABRAACAMcgxxBxyzlHqJEXOOSodpcY5R6mj1FFKsaYYM0oltlRr45yj1FHqKKUaS4sdpRRjirEAAIAABwCAAAuh0JAVAUAUAACBEFIKKYWUYs4p55BSyjHmHFKKOaecU845KJ2UyjkmnZMSKaWcY84p55yUzknlnJPSSSgAACDAAQAgwEIoNGRFABAnAOBwHM2TNE0UJU0TRU8UXdUTRdWVNM00NVFUVU0UTdVUVVkWTdWVJU0zTU0UVVMTRVUVVVOWTVWVZc80bdlUVd0WVVW3ZVv2bVeWdd8zTdkWVdXWTVW1dVeWdd2Vbd2XNM00NVFUVU0UVddUVVs2VdW2NVF0XVFVZVlUVVl2Zde2VVfWdU0UXddTTdkVVVWWVdnVZVWWdV90VV1XXdfXVVf2fdnWfV3WdWEYVdXWTdfVdVV2dV/Wbd+XdV1YJk0zTU0UXVUTRVU1VdW2TVWVbU0UXVdUVVkWTdWVVdn1ddV1bV0TRdcVVVWWRVWVXVV2dd+VZd0WVVW3Vdn1dVN1dV22bWOYbVsXTlW1dVV2dWGVXd2XddsYbl33jc00bdt0XV03XVfXbV03hlnXfV9UVV9XZdk3Vln2fd33sXXfGEZV1XVTdoVfdWVfuHVfWW5d57y2jWz7yjHrvjP8RnRfOJbVtimvbgvDrOv4wu4su/ArPdO0ddNVdd1UXV+XbVsZbl1HVFVfV2VZ+E1X9oVb143j1n1nGV2XrsqyL6yyrAy37xvD7vvCstq2ccy2jmvryrH7SmX3lWV4bdtXZl0nzLptHLuvM35hSAAAwIADAECACWWg0JAVAUCcAACDkHOIKQiRYhBCCCmFEFKKGIOQOSclY05KKSW1UEpqEWMQKsekZM5JCaW0FEppKZTSWikltlBKi621WlNrsYZSWgultFhKaTG1VmNrrcaIMQmZc1Iy56SUUlorpbSWOUelc5BSByGlklKLJaUYK+ekZNBR6SCkVFKJqaQUYyglxpJSjCWlGluKLbcYcw6ltFhSibGkFGOLKccWY84RY1Ay56RkzkkppbRWSmqtck5KByGlzEFJJaUYS0kpZs5J6iCk1EFHqaQUY0kptlBKbCWlGktJMbYYc24pthpKabGkFGtJKcYWY84tttw6CK2FVGIMpcTYYsy5tVZrKCXGklKsJaXaYqy1txhzDaXEWFKpsaQUa6ux1xhjzSm2XFOLNbcYe64tt15zDj61VnOKKdcWY+4xtyBrzr13EFoLpcQYSomxxVZrizHnUEqMJaUaS0mxthhzba3WHkqJsaQUa0mpxhhjzrHGXlNrtbYYe04t1lxz7r3GHINqreYWY+4ptpxrrr3X3IIsAABgwAEAIMCEMlBoyEoAIAoAADCGMecgNAo555yUBinnnJOSOQchhJQy5yCEkFLnHISSWuucg1BKa6WUlFqLsZSSUmsxFgAAUOAAABBgg6bE4gCFhqwEAFIBAAyOY1meZ5qqasuOJXmeKKqmq+q2I1meJ4qqqqq2bXmeKaqqqrqurlueJ4qqqrquq+ueaaqqqrquLOu+Z5qqqqquK8u+b6qq67quLMuy8Juq6rquK8uy7Qur68qyLNu2bhvD6rqyLMu2bevKceu6rvu+sRxHtq77ujD8xnAkAAA8wQEAqMCG1RFOisYCCw1ZCQBkAAAQxiBkEFLIIIQUUkgphJRSAgAABhwAAAJMKAOFhqwEAKIAAAAirLXWWmOttdZai6y11lprraWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUgEAUhMOAFIPNmhKLA5QaMhKACAVAAAwhimmHIMMOsOUc9BJKCWlhjHnnIOSUkqVc1JKSam11jLnpJSSUmsxZhBSaS3GGmvNIJSUWowx9hpKaS3GWnPPPZTSWou11txzaS3GHHvPQQiTUqu15hyEDqq1WmvOOfggTGux1hp0EEIYAIDT4AAAemDD6ggnRWOBhYasBABSAQAIhJRizDHnnENKMeacc845h5RizDHnnHNOMcacc85BCKFizDHnIIQQQuacc85BCCGEzDnnnIMQQgidcw5CCCGEEDrnIIQQQgghdA5CCCGEEELoIIQQQgghhNBBCCGEEEIIoYMQQgghhBBCAQCABQ4AAAE2rI5wUjQWWGjISgAACAAAgtpyLDEzSDnmLDYEIQW5VUgpxbRmRhnluFUKIaQ0ZE4xZKTEWnOpHAAAAIIAAAEhAQAGCApmAIDBAcLnIOgECI42AABBiMwQiYaF4PCgEiAipgKAxASFXACosLhIu7iALgNc0MVdB0IIQhCCWBxAAQk4OOGGJ97whBucoFNU6iAAAAAAAA4A4AEA4LgAIiKaw8jQ2ODo8PgACQkAAAAAABwA+AAAOESAiIjmMDI0Njg6PD5AQgIAAAAAAAAAAICAgAAAAAAAQAAAAICAT2dnUwAAQDoAAAAAAADGNAAAAgAAAI6VwgUsNzcxNCw0NDEzMigqJzQyMyspKyo3Nv7i8Ozg497p5SgoKCcoJigxMjY29+60KESpQcu8+vnCTK1FbMKAar2Hnlj/Q8i2Eaq8cHq1T7++eHYpP/TjN/tGla6gOHVWV3scT+flxCRZoWX+wBcRSUQwoIYHcI5UR51H0J7Va5ydH3npel4/dhxbHae/Lbk6fUo3qrUQMWxHF16jAOQwKTRzU6+ecxYkQnMCat5MrBrWeATD8mJePwPlxvSeApkEnm65rK2XZaoqMgdXsRIEP1kCDCD81xU5p509PQcAqrU0mLGTtWohLlCJLL/x8rRJ1kH5UfXMhrAv2Hk9Iop1Z28T7EKoBDhx9sgHdrdxAFTD17C/HO4Xvo2We7V5bRz2BOxbZKCKbBS/vVPclwMMRVxEs/8fF3sSUQGqHUelL6S5pMu/X+yWlx+Kj+3flvTbpTYz1bUY/O/xfVhmu+obtVcVHEVcYHL/7+ma0CoB1WZO2/efd/SL85c1ccMj+DTPYDEvr305bPWbUV7o+I383XVb57PPCkxN1DpUny/JGr3PmCkFqDrp7ffkf2HGdayKMwlEr+Yev55CV8LMxPHi+kYkyp/nwgA8U6khcV+1H1kpqATU0CP8JX/401CB91czUf558vh/g3voo/5ulxSuT8iS6/fSMPLvGbM8S0AzmV9/NUISFaAGzTxtjPp+18c+Xvtv+3L6Vqw+TDv9eD3d/07IcnQcUbvlVCi/DTxTwGLSf511t4TwgKrzWEll8KrmMOKw/MX9ubTEwxdlsg9fKlDztQQ0TVgiVubcfrsuJAwgoOpPd17FeoJM74pc4GDg0GlrmTJ+LRhHl3FezzYkUVhCmWwDMAJBZcD5VT/MgSLT5ltPgpVpYDyxR03u2rCZHkjGnAIkR8hug61Pn3Nvwgq9MQHVbrr64S/kbsnhnGJcuuhtZ2dVUjy5P65ubbHDyyFSrK63/TcPPFHA5dD626KzJg2otgyV1Yrx/pl+eDY3zOq+7p8P2poQP7bxHRSSuQJNKjwe2S+qqwMkTSkszuz+u+paQilADQKGHuO1IB63tkovL75ulPpz1ugw6nEWb47HFv4lvyBVXrfjSx8MT1ga4yx2fzO1doIkoCofXfaRavXtHQ378+7d+8EmMgpKTy5iJ6fJv7Q1DEkAQbJk95+YiE0K0AjCcr7/kFx4kFAWrxp5FL32MtfjtbajdCt3FgD8SqiUhPlvz8WeJQmoSlZrba5KrycjPfT1X475v91ToGKppbLofAzNDBIExETS0SiZVd/VbgxoBFRZK+kZw2saJLqRlNTUL6iLxxG7eR3SliEVj2AfHEVZZAbMv1ZdbCIjoJo1Z/j6qc9uP53/e7Jx5Nrii3vG//qYVW3puJRH9h329LDb7VJS/52vAUxRKWIsW/9xLtISjsQXCAWoQWR+4xzbyrXR+ppEN9nT0a91yCLD3LFkn7p7eHl8N43xdZItDjpY3BjP4cWWBjHMTA3hCQAgLoRGGYOdtapsXEqZgumO749yha4bc6/nkZqvTJdzr0Ojt43vfPXM+8HrS4/V43P7y1b3fhnFp89Xe1KzXfvhMIWN4n0eTqxWeVnyOmBBF4voD8okVDNbLZ2543HZKo8Ol+KLrg5G7OxNyaQNSr0omvTD7CgHYXZtVwCmHMk/omHYWtF4wn8v8rezs2LqQnroDyf4IWjgXQ20O+WqnZQQu4DaMUVsHfjlrQGjiQr6KaMd3hFOTLM7f0WONv5Gk14ULPRw8rhf/3wm+3vRpWb9yhbBM8aqypNazNjWiEPDeSLZZmWOH5I5gYpaqJohPhkcVBT0iGsgYi1ueOw9V2SLsbkZO0OkGeEGVgKouGzvSyZKDIT120cL631hDdP6jHTNbaXPYO9yVQ5zwrVGKbqkKnf0sUfMMYsP0jU81xEkw3PYRjKTjO/KFmg5ADJ5qV0eupbHH53FKhsd2umqwMXh9FTSnZf4MMlcNeITLnL80VrMGF2mSI3t2IAqb+5K7AlCUcQ7sqSaEardxSkXYXlYIp1d6sFMUc0aEHduVFjoYQcO4UuT79b8RwazmU2fsvTSRX6kbSULbSpc2qZrTX07cvtMhqJM3RuDOmj8h7BeFP74G+RVxJLXUJGcEhqfNdf7vGXPg1ndbMbZDNKafdlybFpLbOtzuS1ZXEa4Joptf7chEbt0e8end97CyX3tj9MotFNVeXzKYuUoVDHHIZw8xed1lFfFRjzbhFvPdLeLvecj2VUUqz6ODrZUcbV+KXmQC1c2rqbFIdHqz4ih5O2/t27j1kF+Gm2NN5DU/64o+RqBA0B5KMwFWWsZfWb5aIXvlEvYXuDajOm/oLaqdVE/7J+efqKaRrb1KytDyfCn/G9Vx9/hT1iJB1Hoen13ljX1KUZ8KHtmm73z1rVvfv91FmfXIlYO6idBNJFfz79yJL5Y3IDjEE03lkHBgPPDrIx3RV03G3ZnEUGwD+kYKVjMSpsTjktsXWYa/2DXOm2lX0/qXOc+7BlsUjEJNkkqfT0xf+uztBZ2xul1ajXBXKMqnP0g1xYPVbanmOuRF3ks88YvNQYyVY4b6nWzOYCS1CSBK9OObPdeIr5hGwovxUe5dwXCYOFHu783PfjjrmNi35yN7jXBlwF7mnnskZmlqjEdjidLjq7CUZ0WzYeNXl1PVeOVt5YBl88G5oodMD594OmYjiVllnLgYaltSvyDLMFBlXZVUJYsbhulqIicWyr1XaNqnXA2jcfFqf4OvofcpAwgK3EJYIGHeL95TinEbkhCt1zY0xIAFZfNtJmytTNLD7O38UB9OSTV/57n7Z95d3jFrnB23vbgNQoN+ioCrcpGLj+TS12i0C/xVg+dXQE+LI+VGYPt2HFjT0/4oKPoAf9fdge2xI8eQmrdu1JvIkNIEVMOPFfYCCqRuYDaUZGfne8T9bK1vN9DpeX1w1LHmh8BoRvJGbuAYSHUqHwDUdy9lXRLCRL67SZkmxXnMImXd5YwKCX3uUjZpQA89RnY2mRsxq6v8mY47gh8Fi8CF12XWcNKFvPLuSWOx4leJ9w0OcjsfukBwPHpsMbE1nN2p23iOXsX3N5kA0Bl2mSr8sbw7h/zOo2+Jk9X8pXeFtU5Zcram/32uaYzYaSEzkXFyOMq8lrv16PC3ju1Dmor79hMYSGZ2VplRc+0RuS4m1f78uc/JBiWQqsYurxy0XFxWbq3U7YKUn/sQa2cbr003Oyu7tcTGJUDooybS+MEeIH8tkPq21wDKpfirVzi9Ii+fyqjHbw28jJaDlFTeoMhsNiq73s7PWHosYQRJMleK1lL8e19AodiO/XYotzfQTWDC+LeSa6hJrEa1t6j8IgYAZ5X23geA+I6CJjULNMTu5FkpycDMToT5lx77IkA0PRZVVYpKere415Ms1c2X3K/O/JqYmofYcX5zH+mFrnfa+ichw3BwhOqWlhEbHXKq8uIyD0isn/InLvRwY8N2m7GWdaeKr4CKJupdqSbcpe84bAuZoKFRVQ0yIuRChYnVmvRXVipKMAcIZl8oAMq+2aYVtsg5iqjRLRAbO7aOh5Tl14X30aKoR0HIiqZeytPp6iKVWvFUHkJpCmrH9XvN5XvlGEpZxm3q05E+SogAhbznUOKKgUFrEXN03Od9zxdVp4324iCQeoVkwnwyJxPjHJg9dyHsDsmt3TBGQFQjY0rlopdG0v7t+eRJiG81ad+mmWxGtfkXMYqEz5zvMompkHF6dKN+3hEntT0FuJiB2GmYjcHHFtIefRVq0jIr34/9pZ0P3LIgjzO9rJbrQ45JdMg54M+aiWyqI+kmsmEfGbrERMVfMjwjzWFatpiHCkSwWqqI7pVx7iJmbdUV55CDkzdqwDIJycwTs6NOZVy5oI/GTc1ez95/+lqgTBMSylmCCWXCR89xfR+8ZBGK8xLbBvhxIj7NH2mIBebRwWeQ5X96TYcs48cCq4DlhcbBhHH6BUuDCV4cVXUH31w/Y/5U1TuPcxhzpEb601m9aaslXom5flK9a/XqWeyzU6/Z6ebddolZO3UfT6Lp8+zqGJllNQgkRFf/JJBLtOhZrTlJKpNVNbdqMdgIkWxUHWVuhpfR1g3X7rHil/PNQWwZ/P4guJ95C/VvUvZLIxiaLLq+xri7s78htK0KFuOyNnnpKU6t7pTd++45kCXofhQL1fiUP+TADp1PZS8bWsSl98tbVh8phw2+viaMVIbaUVPW8F3wlVJBDWvAK7OT+qbWU7V3wN6dVx3EpR29B3au73eBuw4WG5Rd+Pi4l0gDFCZ+zdnSwKDejPZ2uNXI55oSdEzG88d3W4fGo3kOFJCYkrOvviwFQ0SUJUYqett6Kep2DdZMVdF6+U8hdVNqEyGTXgZ9DhVWdRy95eZkSQBle09ya211OyLEH72HimPxXTvrB7yj1okp1hTB/Q0yH7q7rMuFhAEqLpp/MYaqf3bJvsEI1lNM4n25NnX+WNKfs6IAQQ5qSTcpNn9XXYAT0BVvBLykJm2kE/bisvR62L/gyw/qmQPktaechfkOgAlweM8r+oImCBU2JMQ1ioolJY0YfkUrbPNk+epC3Wnq/Radvw62S9Od/3wFlAIUGXWLx/Wpi6WT5BAFREt7Zx9VHu6jf6GWsLUkx0cPRwg5M+XRrSlATYxoNqm/DQxJeoy6z8PscfrW+W6m2rlj1Fd6m1Ua7/v/lS9fFkODEFIZYb0y1TcsmcqAVVJ+G27y1lV5fHhY/drmp8to0TnzeP0uvDZJ9HvTwrkKgNhRQs0R7zg8v757Z5AJqDaEhdr/7aL1fe8vr/vGa+Pq6en0n+lqnpn9793jO3DdxCoHv3y/mUxngA8R0jVAub5oFiN1pxAAqrNxOpx796flialz3OLteX38/GW79393z6N2jn38JQZC47H/Lqv/gC699tkC/CFuEYD0PDUv1X++tH/2x/lVZWTnj9cZLwtX0E9gp2r8XScNkjJ+uv3rDP/oc0j5sTXmSZL9vulwy521n0etf+delldxWNm4RAPwfVP45UwxvqclzmzO4eK2lkl20WxZo6FVYXiP4OHKL7OWZWPSWIrMqrS9JJM/USY/fvX/j0ZKVfHEZ2P7tdqh30qJh5UkMD9cz8NjWdR7mltp84Q28kwOaMkRovLE7Dd1f6We0i/5LfHrw/rkjjSeUuiLbgcZo1P+10JdYcNzbJ/Bzvvt8DringYXDGi3gU5GbBIuL9sp5xQx2dJVUN1foos3XsTBxQAvgfcNAFJ7e2KvKiKTo8SaNL04KLRRnzZ1gbBsRF5ZwA0mpVZsulFRHKk6XoTlc/oz1qLtmrym2lzS9O3a9BdwgujXbrfEGzkvapObBcQ1BEeNc96P7kcfd/320eOuePQTuTRXP2c8+rmdVxtIY66mIlWFqfPKSubPt0/0X+QorXyaOd01WLVZezfZaVftKudblALSzZB1MI0aQl+cC1bpWbU65i3gq+2F9z5kkEh9eVa920MMiEpIuLSNKDcpyqdRYfdfPygUe6lqM69f4m86Dzy5DJXOoFyFe9+15OJufjLluqMbPuT258gGSm2BE9nZ1MABHt4AAAAAAAAxjQAAAMAAAAknZ7hEPTt6+Xf5+Pj5N3g3NfQzbZ+KNwoCVi7uBSWDz2xq2MQnJ+zsxHqIONz1M2e0ALxLSQANhIANFWVGcqmAmh7rb7M3I+eaKW9tZFY+FabcM+37btBaohTwCyT/GmqjsYo8PcParRDDBC5PWKc1NyYR7J2X+XJyB8GblJKqDlqSd0gX77N7DidKEsYRopOB8qSmRxI9DsVtZPeiGgcnCDgYvKK9MQ9WlgJtS88nZlK7/aGxJSvqSKPG8Een8xl/Anh5zy9clQ549IRvq7e92Ry80JElNkjkdUob3QBNWmK5kHQDEyxVTHt3m+hIviojl7JqlQB6ZmxtDo7HJSCx+jrVTYaDegKHujL8yFd2CseLwveeUey8RHzhqCT4fo5OYJe3EBnABhrLwCAmSJWVsLD2ownfXUbmzGoFjO33xiRYnu3n48oBTd0j21G0UrKJFWOkxFt4/pFV7Gtc+rR7x9fk0+PZ4f8rGWJGi6eH93zRnJ99HWeVacvf5buEYo6T9peOMImQQyk7Gxf8azKo4ZopjrgogcFGyWV0Rf5tx0hZQunCWMG3WKXmcdnjhA/q0GlM6ZvJ37pt9/J/Wpbu9fHDFFgNWGIncsIfgmh+gkyg/1HBWGSWmFV8WgGag7BDlneF7NbUotwkpy7XQBn2l5/vbcAvqfbUCFokis8dHinDPH57RAhDszhTFyNCUDQe6teANTMoNL2VpZI+GxMk7uE9ZWvIz2WUc/ktLmW5fZNao87ALZCgcoRlb9vDqC39I3tB71P9qVUvKOUjL67H11TFSKqPZx9Xj+10DOYE9ocJuB4rv1dlPN6zcrBi6Q1exbaTvofRZXFwov3Y8Xr2tXRYKm+ya0Day+2dKJpQK7yf4A1vHF6YuJWl6qgInQaxsrDCPn5+UlvbMxpI3r2de5I0x161dEKJLlT0fNks6vAdzEd+6wp+cDbFn1EEpdvAtzZvlln51lO3RDIsu4QAp5n21TFM1ddCusHyKmH8PT2LUBd/TonZti0c88zq2wsK1cqmi7v03u2HBOsBmt00aa1h1prlvruCz2iOs7N4ynn9aIGIBU/rJ62qIWIaBKyUuuhCfjV00nlpxfCwtsLxwFeLCTbT8N5BRGaXRTp9iWGTrCuUZgOFuVCkPG0qN3IVLhZ0CRxqT11XSKRHw6WdisjmbZOlo9IIawqiXHiRH8sZUMxycs4WfBoftTCJ6xQ+PUR6uiqpVHO74Zrs3A7EQgf+Kqt6o6ZdOdeknOiGMupkWrNscPYsdBkyz7DWLFowdrhnAP+F9s4RbKydkECQuCpL5ib3fJYtqHPPTEwZ1VJ4mRb6D8NpiwxXauZeGrryNnPM9YhPDtOr2bNZ6Hm5tHjNCsTGQtHv21kWHK7uEdUOSpVH5NbKoPgsYjwTSHHVZjDLRiy5Z07jKIPMg+aJoyL1aGdfa97EPTVGwRA+Lj3/V0OZZ7Kk03eJSe+aTqe8Fgu8Ktl0Gm2s1jloXQnd648lBpMIzlFMlVxs5WblCmx+XtqGA5sT90ViTKCBzlwnTkh20H0YvzTV68+3lZ56mJgydbCMM77JCHRVfMYOFutduMDvvfaOEXSs7oEhFBxfhuoDm9ndtJNE2fVJ8+qLFuymVaq5YzLTXdpbiJKHGFtZ3z/XI49559b9T7ly0d5ZliX8CDHlSz/LFznB8qaMOJR3abxBBC/52tOizyBKDimz5I5/q1NOGJQ+5sKFt6jwIc6os5380xEx/Mlr9hzLUdxn46nK0XYGWeNyoUJ9pSzOcyA4jY0yHUy83HPFvTyDqTbKvlQDfjZ97TJpRaScdr/V8bpVoYfZevxFcrti1P9Kk5TRXOVywSuLfvUU9o9dZUZGMI9XINkI+wUxkUjh525ZEtH8D4+fnkHvtfawKZ0E5eMCyUsjk+NuniY0JGORp8TdctVFdBeNmcSEe8bp6S+Jq/b794k0Uc0aU7aGy0p6eIozfKT611FnZ2P8Hl/Y5Sc3CwyrNmCv6ecUOnzTGyiy2fxSOjhol2e2vBhBfZTCQM6un+OSa47ETpp9nK2q3u1xZ8Di+1HdNeUVc2qwD78PFJIei3LcbeX9VlZYjaCPrzqRaDqWdKlSM50Tw81aDnqxlovnFwN4pWZVe7rEsZ1iurmh87H8iFoqMPxeeVYsezSCqL9P8plYISsGvbkBzhjQZyPJSXl1FnlKgAep9qoxSDzDRZMRfDIfR9mE02bYfXptNkzDFamymfKBt1jjTpwTcNnR25Sb+wmaRznMt7P1vcfCjfjpNqw95TLi7b2UANquIGEdsyWdmOy9uns5BEY9dTllbvkPgb95JkiPDL3eD2yNzk6ps7NabwfK/ZhhWJG8S4NXpfJy6m+qEZNxAeqoppgVcsROZMvVT3bBDx3G5GrscvyyjFOkio81sELLqqCxP06zS0nY9jSGMI3xFidiGlWwoOkHwY5CCEHgDc4nLJS9zrwPFWlDsl9yutgCdMZir2mi3agemvadZK5Cz432pDTgF6ADNLjg+mgN9h6N+s+MbqYz8Sody91GgCq721JqpSC3BjaKUuT09TMydQ/Pc5RvzXI29OLsTxdhGIH3LMa3l3MskGAWu3J3FpuInC45fjugdjy3WMLcbI586zuHGlK6ohW7xVUZ0fqjBX7dYTiN7223WNKPT1oaU1k+jTXtCjuQjFzeMrIeaMsFQeElggXBY2+ymDBjht5tyI9WmNqOLM6rtA6d+NX56zHIEipiYeuYIl/UV/boV5mT8CI2P0IVPGLtmU+PNL1IiV+7Hd2b6dHwuqMS+4lLYAqkRVFBZ4XygGAj1wBtiB4on7jLJKxEbuL1s6TXX0G1qZsRVlUegZ7pDub0Y/1SOMd7iacX/788OURV9VZyWcbKcZePgwcou5DXR67WY0jRuy14nlnZtd/L6je8bvPanHYRsWPjXyHtUvFDhWKxR90myKcrv0MBx46FE/6+RVb2jnFK2uYU8B7K51yS5WrYVhG6VnTdWefQ2DNRSKwf2N264SI0esB+wknje65S2TG28RmsGQTjK3gidzpLNNMadS9yGQpnF1Vg4pt0Ab0L7+3h9rqekn0vq1GwvRRU3kkYCSE/uYZRlDIuQBs4HHrjGZ18PAhqclxWq6qSkkqQcb4q3z+9jQ2pP5//r1laeb3Y7zzlsmzkvdxXdhj5NOxVZeI42QLUe9I5GCGsS7iUj3cDjCLB8SWJglKD7QyLAqFLvuWkwVGxbnn6YUhBZKLR/das1ctWBxZaShuDcrW68Uk9HixH2wZ2fwZGbf8lgSUFXldVGUn24TuxYVRb5P/5XrxU3mc8qRSEaOFHy6vVm191onsFIt+mKeeqihJei+HTY3p/RPOeFwqgQ5+dMtTHEg1/zySj9yXGKl/rS4eB9cTzwDet8lSxo3YguqESuU5jDFC6nbcFsY81ycUcwajbMmRYLFYPZv90o8rX2v2yjCJ+Y/1+NvvaeFv/PVx8vzqyL30LA7Oarz3F3zj9S3oKsa1DkWtVIucczPGaT3fBbSd0KA6pHpJbj/F09c8xsZmTxRlVviiHa5ch/HmJR04Nab7K6Yqje4WGrjDZ+iUzIqrpggWmhWHiP7NXKXILKLi0h9eHLJqalHFC9nXs5XWEQ/blQFlgInKyFWns6TZOnvqMQUoRy6eiAuhA+dD5EfGZo//9f5BNrM0o3Xcrz44fsfJYcmDGsBAwKNz5DWRNiNjyxmdog0bQAPKxuXTSpKYlci6iqe92TgiNpjFj1pHGKMleIgodLrjIhKfx1bvn9WxcxVMx8EbLT+avi/Flg3IcLy5U5eMUlFrL+4uiZzj9GiBd3hLUfrNJUQLjK2YeZejjx/HNteXNQN10g5CECRIujhCijZTq8FsJbOGo3ATzr31oagedSdhwY75ikWtCCSywt/tgYhCsXuDUNvqsLlUIceedfm1srqiYwnNULfUBmfmzd/O9Ke5/+WImoxAcwvjTO0w5jNet8lKxwcANkyPNCbUybGxwers7FNH5sxRpUxJ3oGWkL/kkD/Vc2bLNUdo906OtCVEcV7ve13cnIXsDuGj7A2z/R3ryW2NpTce5KBTtyzoJ8yR0eu1qcmcl/RIBFWzdTjEAwNS/04FC5WrQ/aUFWtTXYIefImaXiYP3XYmpV6ur4X1NcJLiW3EuKShAHUEr2b/Jl0ZF9S8RfqBhbq5ji2LqNcqEb+eECSlzOzIk0vzXJhr4zPoh+V4zZ0z7FrM3So1166RnlqoG9F0zFcIACABXtdRTRQAQgcAHjGsHna3Vg6zFf2e1ntWVV/JjCQNFERNPJLftL0Pq77GNT1OTvXe0+Wo79njR/l/1YialWOMk+qyJ9Vw/R2Og5Wph7YPISuWF8XX/jLDyuIlVWqTcxIgai+AXLVYc1+zrzUjrfvopAYX6hRbRVYvZ9fDyALrzEu2cfMP1WsbvlNtcyHzkY9M7tXlEYZTn5+wPu2oRLAxR0Ux76q6otUIfOkf4pZiVk2yhtJUuZ0pLCtMWl5dnWJb8CYg9AFTlHjkODEYAH4HEnPntnG7TQypIH4AY4zUI43BCXvOOcyZOaUoERQCACAq2+yetE4y5eaX/7ZqzMfwv75j9vXQY4xh7++usqts9ZPkasx595fnYc45o69vtvDq6hbhVQRz5Est4KyIg+lp5unD+lYn1dXVMK++CRY6vM0555x7//wkAED1y6omS1iQXmdI+y1C8UTQHG9vbyK9vj0RDizko6qqYXWVRdXoOUfha2CeLgDAYroAsN/eLObBAUAD"
	};
	window.soundRepairReload = {
		info : "Reload sound; Used in TACS; courtesy of: http://www.freesfx.co.uk; 7806 bytes",
		d : "data:video/ogg;base64,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"
	};

// Tiberium Alliances Chat Helper (DTeCH)
        var chatHelper_main = function () {
            window.chatHelper_debug = 0; //initial debug level, top level for easy console access
            var chlog = function chlog(str, lvl) {
                console.log("ChatHelper_debug: " + str + "\n");
                /*
                 if (lvl > 0) { //lvl 1+
                 if (window.chatHelper_debug == 1) { // lvl 1
                 console.log("ChatHelper_debug: " + str + "\n");
                 }
                 if (window.chatHelper_debug == 2) { // lvl 2
                 console.log("ChatHelper_debug: " + str + "\n");
                 }

                 } else { //lvl 0 or no arg passed to lvl
                 console.log("ChatHelper_log: " + str + "\n");
                 } */
            };
            try {
                function createchatHelper() {
                    var onkeyupDelay = 50; //ms to wait after a keyupevent before searching contacts list. Lower for faster searching. Higher for better performance.
                    window.chatHelper_suppressBrowserAltKeys = true;
                    window.chatHelper_version = "4.0.4";
                    window.chatHelper_name = "Tiberium Alliances Chat Helper (DTeCH)";
                    chlog(window.chatHelper_name + ' v' + window.chatHelper_version + ': loading.', 0);
                    var saveObj = {
                        saveObjVer: "4.0.4",
                        contacts: []
                    };

                    var validCharPatt = /[-\w\.]/;
                    var isWhisp = false;
                    var contacts = [];
                    var timer;
                    var _sub;


                    function getCaretPos(obj) {
                        // getCaretPos from: http://userscripts.org/scripts/show/151099
                        obj.focus();

                        if (obj.selectionStart) {
                            return obj.selectionStart; //Gecko
                        } else if (document.selection) //IE
                        {
                            var sel = document.selection.createRange();
                            var clone = sel.duplicate();
                            sel.collapse(true);
                            clone.moveToElementText(obj);
                            clone.setEndPoint('EndToEnd', sel);
                            return clone.text.length;
                        }

                        return 0;
                    }

                    function moveCaret(inputObject, pos) {
                        // moveCaretPos from: http://userscripts.org/scripts/show/151099
                        if (inputObject.selectionStart) {
                            inputObject.setSelectionRange(pos, pos);
                            inputObject.focus();
                        }
                    }

                    function getCursorWordPos(inputField) {
                        var pos = getCaretPos(inputField);
                        var inText = inputField.value;
                        var lc = inText.charAt(pos - 1);
                        if (lc.match(validCharPatt) !== null) {
                            var sPos = pos;
                            var ePos = pos;
                            var t = inputField.value;
                            while (sPos >= 0 && t.charAt(sPos - 1).match(validCharPatt) !== null) {
                                sPos--;
                            }
                            while (ePos <= t.length && t.charAt(ePos).match(validCharPatt) !== null) {
                                ePos++;
                            }
                            //inputField.setSelectionRange(sPos,ePos);
                            return [sPos, ePos];
                        }
                    }

                    function tagWith(tag, inputField) {
                        var eTag = tag.replace('[', '[/'); //closing tag
                        var tagLen = tag.length;
                        var eTagLen = eTag.length;
                        if (inputField !== null) {
                            var pos = getCaretPos(inputField);
                            var inText = inputField.value;
                            //save scroll position
                            if (inputField.type === 'textarea')
                                var st = inputField.scrollTop;
                            //if there is selected text
                            if (inputField.selectionStart !== inputField.selectionEnd) {
                                var a = inText.slice(0, inputField.selectionStart);
                                var b = inText.slice(inputField.selectionStart, inputField.selectionEnd);
                                var c = inText.slice(inputField.selectionEnd, inText.length);
                                inputField.value = a + tag + b + eTag + c;
                                moveCaret(inputField, pos + tagLen + eTagLen + b.length);
                                //if ((input IS empty) OR (the last char was a space)) AND next char ISNOT a left sqbracket
                            } else if ((inText === "" || inText.charAt(pos - 1) === " ") && (inText.charAt(pos) !== '[')) {
                                inputField.value = inText.substr(0, pos) + tag + eTag + inText.substr(pos, inText.length);
                                moveCaret(inputField, pos + tagLen);
                                //if last character is a valid playername character
                            } else if (inText.charAt(pos - 1).match(validCharPatt) !== null) {
                                var arr = getCursorWordPos(inputField); //
                                var s = arr[0];
                                var e = arr[1];
                                inputField.value = inText.slice(0, s) + tag + inText.slice(s, e) + eTag + inText.slice(e, inText.length);
                                moveCaret(inputField, e + tagLen + eTagLen);
                            }
                            //restore scroll position
                            if (inputField.type === 'textarea')
                                inputField.scrollTop = st;
                        }
                    }

                    function showHelp() {
                        alert("Type /chelp in any text box to show this message.\n\nEnter key in chat:\tsearches your chat string for Urls and Coords and wraps them before submission.\n\nAlt + 1\t:\tsearches for Urls and Coords in a message or forum post and tags accordingly. Cursor is moved to the beginning.\nAlt + 2\t:\tManual URL insertion popup window\nAlt + 0\t:\tclears all tags\n\nWord wraps: tags a selected word -or- tags the word where the cursor is (if chat is empty or you hit <space> empty tags are inserted).\nAttempts to preserve cursor and scroll position.\n|\tAlt + p or Alt + 3\t:\tplayer tags\n|\tAlt + a or Alt + 4\t:\talliance tags\n|\tAlt + b\t\t\t:\tbold tags\n|\tAlt + i\t\t\t:\titalic tags\n|\tAlt + u\t\t\t:\tunderline tags\n|__\tAlt + s\t\t\t:\tstrikethrough tags\n\nContact list commands:\n/list -or- /contacts\n/add\n/del\n/del all - wipes your whole contact list");
                    }

                    function saveData() {
                        saveObj.contacts = contacts;
                        var jString = JSON.stringify(saveObj);
                        chlog("saveJSON: " + jString, 1);
                        localStorage.setItem('chatHelper', jString);
                    }

                    function loadData() {
                        try {
                            if (localStorage.getItem('myContacts')) { //should be removed eventually
                                var dat = localStorage.getItem('myContacts');
                                dat = dat.split(',');
                                saveObj.contacts = dat;

                                //unset old storage
                                localStorage.removeItem('myContacts');
                            } else if (localStorage.getItem('chatHelper')) {
                                var saveObjTmp = JSON.parse(localStorage.getItem('chatHelper'));
                                if (saveObjTmp.saveObjVer != window.chatHelper_version) {
                                    //version changed
                                    var va = saveObjTmp.saveObjVer.split('.');
                                    var vb = window.chatHelper_version.split('.');

                                    if (va[0] != vb[0]) { //major version change
                                        chlog("ChatHelper: Major version change from v" + va[0] + "." + va[1] + "." + va[2] + " to v" + vb[0] + "." + vb[1] + "." + vb[2]);
                                    } else {
                                        if (va[1] != vb[1]) { //minor version change
                                            chlog("ChatHelper: Minor version change from v" + va[0] + "." + va[1] + "." + va[2] + " to v" + vb[0] + "." + vb[1] + "." + vb[2]);
                                        } else {
                                            if (va[2] != vb[2]) { //patch release
                                                chlog("ChatHelper: Version Patched from v" + va[0] + "." + va[1] + "." + va[2] + " to v" + vb[0] + "." + vb[1] + "." + vb[2]);
                                            }
                                        }
                                    }
                                } else {
                                    //no version change
                                    localStorage.getItem('chatHelper');
                                }
                                saveObj = saveObjTmp;
                            }
                            contacts = saveObj.contacts;
                            saveData();
                        } catch (err) {
                            chlog(err);
                        }
                    }

                    if (!localStorage.myContacts) {
                        chlog("Deprecated contacts variable does not exist.", 1);
                        loadData();
                    } else {
                        //contacts = loadData();
                        loadData();
                        chlog("Contacts: " + contacts, 1);
                    }

                    function saveContact(fr) {
                        chlog("Number of contacts == " + contacts.length, 1);
                        contacts.push(fr);
                        chlog(fr + " added to contacts list.", 1);
                        saveData();
                    }

                    function caseInsensitiveSort(a, b) {
                        a = a.toLowerCase();
                        b = b.toLowerCase();
                        if (a > b)
                            return 1;
                        if (a < b)
                            return -1;
                        return 0;
                    }

                    function listContacts() {
                        var len = contacts.length;
                        var a = contacts.sort(caseInsensitiveSort);
                        if (len == 1) {
                            alert(len + " Contact:\n\n" + a.join("\n") + "\n");
                        } else if (len > 1) {
                            alert(len + " Contacts:\n\n" + a.join("\n") + "\n");
                        } else {
                            var p = prompt("Your contacts list is empty.\n\nType a name here to add a contact:\n", "");
                            if (p) {
                                saveContact(p);
                            }
                        }
                    }

                    function deleteContact(fr) {
                        if (fr === "all") {
                            contacts = [];
                            chlog("All contacts deleted", 1);
                            saveData();
                        } else {
                            var ind = contacts.indexOf(fr);
                            if (ind > -1) {
                                saveObj.contacts = contacts.splice(ind, 1);
                                saveData();
                                chlog(contacts, 1);
                                chlog(fr + " deleted from contacts list.");
                            }
                        }
                    }

                    function keyUpTimer(kEv) {
                        kEv = kEv || window.event;
                        if (kEv.target.type === "text" && kEv.target.value !== '') {
                            var inputField = kEv.target;
                            var inText = inputField.value;
                            var len = inText.length;
                            var sub;
                            var kc = kEv.keyCode;
                            if (len >= 10 && inText.match(/^(\/whisper)/) !== null) {
                                isWhisp = true;
                            }
                            if (isWhisp && len >= 10 && !kEv.altGraphKey && !kEv.ctrlKey && !kEv.altKey && kc > 47 && kc < 91) {
                                chlog("keyUpTimer keyCode ==" + kEv.keyCode, 1);
                                sub = inText.substr(9);
                                if (!sub.match(/\s/)) {
                                    for (var i = 0; i < contacts.length; i++) {
                                        var slen = sub.length;
                                        if (contacts[i][slen - 1] === sub[slen - 1] && contacts[i].substr(0, slen) == sub) {
                                            inputField.value = "/whisper " + contacts[i] + " ";
                                            inputField.setSelectionRange(10 + slen - 1, 10 + contacts[i].length, "forward");
                                        }
                                    }
                                } else {
                                    isWhisp = false;
                                }
                            } else {
                                isWhisp = false;
                            }
                        }
                    }

                    document.onkeyup = function (kEv) {
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                            keyUpTimer(kEv);
                        }, onkeyupDelay);
                    };

                    function delayedConfirm() {
                        if (confirm("Add " + _sub + " to your contacts list?\n\nYou can see a list of your contacts by typing /list")) {
                            saveContact(_sub);
                        }
                    }

                    function autoTag(inText) {
                        var isUrl = false;
                        var lookBack;
                        //the code here is mostly from Bruce Doan: http://userscripts.org/scripts/show/151965
                        ////auto url
                        inText = inText.replace(/(\[url\])*(https?:\/\/)([\da-z\.-]+)(\.[a-z]{2,6})([\/\w\.\-\=\?\&\%\+\|#:;,~\*\(\)\$]*)*\/?(\[\/url\])*/gi, function () {
                            var result = [];
                            var protocol = arguments[2].match(/https?:\/\//);
                            for (var i in arguments) {
                                chlog("autoTag url reg arg " + i + "= " + arguments[i], 1);
                            }
                            result.push('[url]');
                            result.push(arguments[2]); // http[s]://
                            result.push(arguments[3]); // domain
                            result.push(arguments[4]); // ext
                            result.push(arguments[5]); // query string
                            result.push('[/url]');
                            if (protocol === null) {
                                chlog("autotag url - no protocol", 2);
                            } else {
                                isUrl = true;
                                chlog("bypassing coords tagging\n detected protocol = " + protocol, 2);
                            }
                            return result.join('');
                        });
                        ////auto coords
                        //if (!isUrl) {
                        chlog("checking for coords", 1);
                        lookBack = inText.replace(/(\[coords\])?([#])?([0-9]{3,4})[:.]([0-9]{3,4})([:.]\w+)?(\[\/coords\])?/gi, function () {
                            for (var i in arguments) {
                                chlog("autoTag coords reg arg " + i + " = " + arguments[i], 1);
                            }
                            var hashBefore = arguments[2];
                            chlog("hashBefore " + hashBefore, 1);
                            if (!hashBefore) {
                                chlog("no hash returning");
                                var result = [];
                                result.push('[coords]');
                                result.push(arguments[3]);
                                result.push(':');
                                result.push(arguments[4]);
                                if (arguments[5] !== undefined) {
                                    result.push(arguments[5].replace('.', ':'));
                                }
                                result.push('[/coords]');
                                return result.join('');
                            } else {
                                return arguments[0];
                            }
                        });
                        inText = lookBack;
                        chlog("lookedback", 1);
                        chlog("LB string: " + lookBack, 1);
                        //}
                        // shorthand for player
                        inText = inText.replace(/\[p\]([a-z0-9_\-\s]+)\[\/p\]/gi, '[player]$1[/player]');
                        // shorthand for alliance
                        inText = inText.replace(/\[a\]([a-z0-9_\-\s]+)\[\/a\]/gi, '[alliance]$1[/alliance]');

                        return inText;
                    }

                    document.onkeydown = function (kEv) {
                        kEv = kEv || window.event;

                        /* Tab key
                         if (kEv.keyCode == 9){
                         chlog("Tab key pressed",1)
                         var input = qx.core.Init.getApplication().getChat().getChatWidget().getEditable(); // Input
                         kEv.preventDefault();
                         kEv.stopPropagation();
                         }
                         */
                        if (!kEv.shiftKey && kEv.keyCode === 13 && (kEv.target.type === "text" || kEv.target.type === "textarea")) {
                            var inputField1 = kEv.target;
                            var inText1 = inputField1.value;
                            var add = inText1.match(/^(\/add)/);
                            var del = inText1.match(/^(\/del)/);
                            var showContacts = inText1.match(/^((\/contacts)|(\/list))/);
                            var sub;
                            if (inText1.match(/^(\/whisper)/) !== null || add !== null) {
                                if (add !== null) {
                                    sub = inText1.substr(5);
                                } else {
                                    sub = inText1.substr(9);
                                }
                                if (sub.match(/^(\w*)\s/)) {
                                    //if space after player name (is a whisper or a typo)
                                    var arr = sub.match(/^(\w*)/);
                                    sub = arr[0].replace(/\s$/, "");
                                    if (contacts.indexOf(sub) == -1) {
                                        //not in contacts list
                                        _sub = sub;
                                        setTimeout(delayedConfirm, 500);
                                    }
                                } else if (contacts.indexOf(sub) == -1) {
                                    //no message to send, not in contacts, promt to add, clear input
                                    chlog("clearing input field", 1);
                                    inputField1.focus(); //?necessary?
                                    inputField1.value = "";
                                    var cf = confirm("Add " + sub + " to your contacts list?\n\nYou can see a list of your contacts by typing /list");
                                    if (cf) {
                                        saveContact(sub);
                                        return false;
                                    } else {
                                        return false;
                                    }
                                } else if (sub && contacts.indexOf(sub) > -1) {
                                    //not a whisper, reject duplicate contact
                                    alert(sub + " is already in your contacts list.");
                                }
                            }
                            //remove contact(s)
                            if (del) {
                                sub = inText1.substr(5);
                                chlog("clearing input field", 1);
                                inputField1.value = "";
                                if ((contacts.indexOf(sub) > -1 || sub == "all") && confirm("Really delete " + sub + " from your contacts?")) {
                                    deleteContact(sub);
                                } else {
                                    alert(sub + " is not in your contacts list.");
                                }
                                return false;
                            }
                            // show contacts list
                            if (showContacts) {
                                chlog("clearing input field", 1);
                                inputField1.value = "";
                                listContacts();
                                return false;

                            }
                            // /chelp dialog
                            if (inText1.length === 6 && inText1.match(/^(\/chelp)/) !== null) {
                                chlog("clearing input field", 1);
                                inputField1.value = "";
                                showHelp();
                                return false;
                            }

                            if (inputField1 !== null && inputField1.type === "text" && inText1 !== "") {
                                chlog("onEnter auto-tagging", 1);

                                inText1 = autoTag(inText1); //auto-tag

                                if (inText1 !== inputField1.value) {
                                    inputField1.value = inText1;
                                }
                            }
                        }

                        if (kEv.altKey && !kEv.shiftKey && !kEv.altGraphKey && !kEv.ctrlKey && kEv.target != null && (kEv.target.type === "textarea" || kEv.target.type === "text")) {
                            var inputField2 = kEv.target;
                            var inText2 = inputField2.value;
                            // Alt key, not Ctrl or AltGr
                            if (kEv.altKey && !kEv.altGraphKey && !kEv.ctrlKey) {
                                var cc = kEv.charCode;
                                var kc = kEv.keyCode;
                                chlog("charCode == " + cc, 1);
                                chlog("keyCode == " + kc, 1);

                                /* Alt+1 for auto Coordinates/Urls in message body */
                                if (inputField2.type === "textarea" && (cc === 49 || kc === 49)) {
                                    chlog("attempting Alt+1 message auto-tag", 1);
                                    if (inputField2 !== null) {
                                        var st = inputField2.scrollTop;

                                        inText2 = autoTag(inText2); //auto-tag

                                        if (inText2 !== "" || inText2 !== inputField2.value) {
                                            inputField2.value = inText2;
                                            inputField2.scrollTop = st;
                                            moveCaret(inputField2, 0);
                                        }
                                    }
                                }
                                /* Alt+2 for URLs fallback */
                                if (cc === 50 || kc === 50) {
                                    if (inputField2 !== null) {
                                        var url = prompt("Website (Syntax: google.com or www.google.com)", "");
                                        if (url != null) {
                                            inputField2.value += '[url]' + url + '[/url]';
                                        }
                                    }
                                }
                                /* Alt+3 or Alt+p for players */
                                if ((cc === 112 || kc === 80) || (cc === 51 || kc === 51)) {
                                    tagWith('[player]', inputField2);
                                    if (window.chatHelper_suppressBrowserAltKeys)
                                        return false;
                                }
                                /* Alt+4 or Alt+a for alliances */
                                if ((cc === 97 || kc === 65) || (cc === 52 || kc === 52)) {
                                    tagWith('[alliance]', inputField2);
                                    if (window.chatHelper_suppressBrowserAltKeys)
                                        return false;
                                }
                                /* Alt+0 to clear tags */
                                if (cc === 48 || kc === 48) {
                                    if (inputField2.type === 'textarea')
                                        var st = inputField2.scrollTop;
                                    if (inputField2 !== null) {
                                        inText2 = inText2.replace(/\[\/?coords\]/gi, '');
                                        inText2 = inText2.replace(/\[\/?url\]/gi, '');
                                        inText2 = inText2.replace(/\[\/?player\]/gi, '');
                                        inText2 = inText2.replace(/\[\/?alliance\]/gi, '');
                                        inText2 = inText2.replace(/\[\/?b\]/gi, '');
                                        inText2 = inText2.replace(/\[\/?i\]/gi, '');
                                        inText2 = inText2.replace(/\[\/?u\]/gi, '');
                                        inText2 = inText2.replace(/\[\/?s\]/gi, '');
                                        inputField2.value = inText2;
                                    }
                                    if (inputField2.type === 'textarea')
                                        inputField2.scrollTop = st;
                                }
                                /* Alt+b for bold */
                                if (cc === 98 || kc === 66) {
                                    tagWith('[b]', inputField2);
                                    if (window.chatHelper_suppressBrowserAltKeys)
                                        return false;
                                }
                                /* Alt+i for italics */
                                if (cc === 105 || kc === 73) {
                                    tagWith('[i]', inputField2);
                                    if (window.chatHelper_suppressBrowserAltKeys)
                                        return false;
                                }
                                /* Alt+u for underline */
                                if (cc === 117 || kc === 85) {
                                    tagWith('[u]', inputField2);
                                    if (window.chatHelper_suppressBrowserAltKeys)
                                        return false;
                                }
                                /* Alt+s for strikethrough */
                                if (cc === 115 || kc === 83) {
                                    tagWith('[s]', inputField2);
                                    if (window.chatHelper_suppressBrowserAltKeys)
                                        return false;
                                }
                            }
                        }
                    };
                }
            } catch (err) {
                chlog("createchatHelper: " + err, 1);
                console.error(err);
            }

            function chatHelper_checkIfLoaded() {
                try {
                    if (typeof qx !== 'undefined') {
                        createchatHelper();
                    } else {
                        window.setTimeout(chatHelper_checkIfLoaded, 1333);
                    }
                } catch (err) {
                    console.log("chatHelper_checkIfLoaded: ", err);
                }
            }

            window.setTimeout(chatHelper_checkIfLoaded, 1333);
        };
        try {
            var chatHelper = document.createElement("script");
            chatHelper.innerHTML = "(" + chatHelper_main.toString() + ")();";
            chatHelper.type = "text/javascript";
            document.getElementsByTagName("head")[0].appendChild(chatHelper);
        } catch (err) {
            console.log("chatHelper: init error: ", err);
        }

// PluginsLib - mhNavigator - (DTeCH) {last in version 199s... removed from v199t}

// Tiberium Alliances Zone Waves (DTeCH)
    var pzw = function () {
        function bG() {
            console.log("ZWaves loaded");
            qx.Class.define("Aa", {
                type: "singleton",
                extend: qx.core.Object,
                statics: {aG: 10},
                members: {
                    T: null,
                    V: null,
                    bD: null,
                    G: null,
                    bE: null,
                    R: null,
                    J: null,
                    F: null,
                    al: null,
                    K: null,
                    aF: null,
                    ae: null,
                    L: null,
                    H: null,
                    I: null,
                    r: null,
                    w: null,
                    Z: null,
                    D: null,
                    M: null,
                    Q: null,
                    z: null,
                    B: null,
                    AB: null,
                    MD: null,
                    initialize: function () {
                        this.aR();
                        this.MD = ClientLib.Data.MainData.GetInstance();
                        var a = new qx.ui.container.Composite(new qx.ui.layout.HBox(4));
                        a.add(new qx.ui.basic.Label("Forgotten bases within attack range:"));
                        a.add(this.V = (new qx.ui.basic.Label).set({textColor: "text-region-value"}));
                        a.add(this.bD = (new qx.ui.basic.Label(" (")).set({textColor: "text-region-value"}));
                        a.add(this.G = (new qx.ui.basic.Label).set({textColor: "yellow", font: "bold"}));
                        a.add(this.bE = (new qx.ui.basic.Label(")")).set({textColor: "text-region-value"}));
                        var b = new qx.ui.container.Composite(new qx.ui.layout.HBox(4));
                        b.add(new qx.ui.basic.Label("Levels:"));
                        b.add(this.R = (new qx.ui.basic.Label).set({textColor: "text-region-value"}));
                        var P = new qx.ui.container.Composite(new qx.ui.layout.HBox(4));
                        P.add(this.Z = (new qx.ui.basic.Label("Required Defence Level:")).set({
                            textColor: "text-region-value",
                            textAlign: "left"
                        }));
                        P.add(this.r = (new qx.ui.basic.Label).set({
                            textColor: "lime",
                            textAlign: "right",
                            font: "bold"
                        }));
                        var N = new qx.ui.container.Composite(new qx.ui.layout.HBox(4));
                        N.add(this.w = (new qx.ui.basic.Label("Your Current Defence Level:")).set({
                            textColor: "text-region-value",
                            textAlign: "left"
                        }));
                        N.add(this.I = (new qx.ui.basic.Label).set({
                            textColor: "red",
                            textAlign: "right",
                            font: "bold"
                        }));
                        var S = new qx.ui.container.Composite(new qx.ui.layout.HBox(4));
                        S.add(this.D = (new qx.ui.basic.Label).set({
                            textColor: "orange",
                            textAlign: "center",
                            font: "font_size_14_bold"
                        }));
                        this.T = (new qx.ui.container.Composite(new qx.ui.layout.VBox)).set({
                            marginTop: 6,
                            textColor: "text-region-tooltip"
                        });
                        this.T.add((new qx.ui.basic.Atom("Zone Waves - (TNC Tools)", "data:image/gif;base64,R0lGODlhHwAaAPMAAMzMzMyZzJnMmZmZmWZmZgCZAABmAAAzAAAAAP///wAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgAJACwAAAAAHwAaAEAEzjAlRKu9GEuUAKEFKCLGgYQkZVDdx3mnUcj0bNfy/H7TQPjAnzBIHP44u4xS2WLBUkjo5MRSOV1NKhRV0nKvToB4TC6by9jnd2tlJ5O4giRxq8/f2RC9bZjoUShZWStahGuGYC8Ac4yNjo1iPByPlJUbEx0DRUZBnD8DAAMsmm2ApSOECaQvonVxrzYcq6qiUISIboGho7WAfhxrclq0LAKiNXTIOAk1srUJAaJ3uHobt7zYhagja5nFrbDhscTOS+YW5Jln6+ykG+fwFRIRACH5BAkUAAkALAAAAAAfABoAQATMMCVEq70YS5QAoQUoIsaBhCRlUN3HeadRyPRs1/X7TQPR/74gcCj0cXSZZLLFgpEmq9MEZYCCJkzkScUlmaijbAdALpvP6LMrC05t3VGUGFaTJG54u0wrVn05cn5vcy5xXW1tcwB2jI2OjWQ7HI+UlRtYAANERUCcPgOZLJqHI4ZvUQmjLwMxeDiuNhyqqaxwpG4ocqGytSF3LKS/R7yirDIJOHd1ycSrw6csErldtMWl19CDu9WvMrCvzdVK4xXiHaBp6emjG+Tu5QkRACH5BAkUAAkALAAAAAAfABoAQATLMCVEq70YS5QAoQUoIsaBhCRlUN3HeadRyPRs1/X7TQPR/74gcCj0cXSZZLLFgiVQq6eKA+WskFiUVmWqprAdgHhMLpvLLuZp+vVeUWqmTPLE2egzGRi27k9OE1tHey5XhiOHfnxhdI2Oj45iOxyQlZYbEx0DREVAnT4DAAMsm2yCb4ikoy+jN652dhylsquJqG0jmqosIBO3fwWBu7RWN3V3OAl6CbO6X290bNDE1IJep02rzK2wrzY31NtK4xbirGfo6aUb5O0VEhEAIfkECQAACQAsAAAAAB8AGgBABMYwJUSrvRhLlAChBSgixoGEJGVQ3cd5p1HI9Gzb9dpyyED4wJ8wSBz+eLuMMpNMrngnlkoafbmSqKfW9MyyYC+AeEwum8tXsDdV1Y6aMEkCR5fTdWCnaqJDZflfaS5dU2xrKHAAcouMjYxiHxOOk5RySAADRUZBmz8DmCyZhX6jI08Joi8DMXetOSGoqxypboalVR2ysSJzoxOwa7uzqzVzxXU1w1+ypJa1sBvCwoem1aqhxK2udMrdS9/Yy2fj5KIb4OgVEhEAIfkECQAACQAsAAAAAB8AGgBABMwwJUSrvRhLlAChBSgixoGEJGVQ3cd5p1HI9Gzb9dpyyED4wJ8wSBz+eLuMMpNMFiarExQ0lb5cTpWWZEKhok2AeEwum81Y2Gkb/W5R4U8CR5fMc7MrSx1KlHhra34mE3qGbWwjiIYdAHaPkJGQYnIckpeYGxMdA0VGQZ8/AwADLJ1viiNuHKcvpXR4sTaspbSJKYGLcKSmtYVucyyptrYzfjjHNMnGxJxbdhVRYBJwrQmtq16ouM62srDgza1L5L17o2fp6acb5e4VEhEAIfkECQAACQAsAAAAAB8AGgBABMowJUSrvRhLlAChBSgixoGEJGVQ3cd5p1HI9GzX9ftNA9H/viBwKPRxdJlkssWCJVapBGolVXFQTORphJqOoNkOYEwum89mV9ab2rahWBgSZ5M8C7e6NgyawFl9bWFyf29WbXFqY3aMjY6NYzscj5SVGxMdA0RFQJw+AwADLJqHXaVfo6Ivonl0rjYcpLGqULWobnGqCbKmRyd+IxOzqVc3UjV3NMfDq30bbnB2wbK7qmy9vWChxK/dN8zVSuIW4ato5+ikz+PsLAkRACH/C0xWaWV3UHJvMjAwADs=")).set({
                            font: "font_size_14",
                            textColor: "text-region-value"
                        }));
                        this.T.add(a);
                        this.T.add(b);
                        this.T.add(this.J = (new qx.ui.basic.Atom("Only Camps\\Outposts in range.", "webfrontend/battleview/for/cities/base_level_2.png")).set({
                            font: "font_size_14",
                            textColor: "text-region-value"
                        }));
                        this.T.add(P);
                        this.T.add(N);
                        this.T.add(S);
                        var c = new qx.ui.container.Composite(new qx.ui.layout.HBox(6));
                        c.add((new qx.ui.basic.Label("Forgotten bases within range:")).set({alignY: "middle"}));
                        c.add(this.F = (new qx.ui.basic.Label).set({
                            alignY: "middle",
                            font: "bold",
                            textColor: "text-region-value"
                        }));
                        c.add(this.al = (new qx.ui.basic.Label(" (")).set({textColor: "text-region-value"}));
                        c.add(this.K = (new qx.ui.basic.Label).set({textColor: "yellow", font: "bold"}));
                        c.add(this.aF = (new qx.ui.basic.Label(")")).set({textColor: "text-region-value"}));
                        var d = new qx.ui.container.Composite(new qx.ui.layout.HBox(6));
                        d.add((new qx.ui.basic.Label("Levels:")).set({alignY: "middle"}));
                        d.add(this.ae = (new qx.ui.basic.Label).set({
                            alignY: "middle",
                            font: "bold",
                            textColor: "text-region-value"
                        }));
                        var s = new qx.ui.container.Composite(new qx.ui.layout.HBox(4));
                        s.add(this.AA = (new qx.ui.basic.Label("Required Defence Level:")).set({
                            textColor: "text-region-value",
                            textAlign: "left"
                        }));
                        s.add(this.Q = (new qx.ui.basic.Label).set({
                            textColor: "lime",
                            textAlign: "right",
                            font: "bold"
                        }));
                        var u = new qx.ui.container.Composite(new qx.ui.layout.HBox(4));
                        u.add(this.z = (new qx.ui.basic.Label("Your Current Defence Level:")).set({
                            textColor: "text-region-value",
                            textAlign: "left"
                        }));
                        u.add(this.M = (new qx.ui.basic.Label).set({
                            textColor: "red",
                            textAlign: "right",
                            font: "bold"
                        }));
                        var W = new qx.ui.container.Composite(new qx.ui.layout.HBox(4));
                        W.add(this.B = (new qx.ui.basic.Label).set({
                            textColor: "orange",
                            textAlign: "center",
                            font: "font_size_14_bold"
                        }));
                        var e = (new qx.ui.container.Composite(new qx.ui.layout.VBox)).set({textColor: "text-region-tooltip"});
                        e.add((new qx.ui.basic.Atom("Zone Waves - (TNC Tools)", "data:image/gif;base64,R0lGODlhHwAaAPMAAMzMzMyZzJnMmZmZmWZmZgCZAABmAAAzAAAAAP///wAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgAJACwAAAAAHwAaAEAEzjAlRKu9GEuUAKEFKCLGgYQkZVDdx3mnUcj0bNfy/H7TQPjAnzBIHP44u4xS2WLBUkjo5MRSOV1NKhRV0nKvToB4TC6by9jnd2tlJ5O4giRxq8/f2RC9bZjoUShZWStahGuGYC8Ac4yNjo1iPByPlJUbEx0DRUZBnD8DAAMsmm2ApSOECaQvonVxrzYcq6qiUISIboGho7WAfhxrclq0LAKiNXTIOAk1srUJAaJ3uHobt7zYhagja5nFrbDhscTOS+YW5Jln6+ykG+fwFRIRACH5BAkUAAkALAAAAAAfABoAQATMMCVEq70YS5QAoQUoIsaBhCRlUN3HeadRyPRs1/X7TQPR/74gcCj0cXSZZLLFgpEmq9MEZYCCJkzkScUlmaijbAdALpvP6LMrC05t3VGUGFaTJG54u0wrVn05cn5vcy5xXW1tcwB2jI2OjWQ7HI+UlRtYAANERUCcPgOZLJqHI4ZvUQmjLwMxeDiuNhyqqaxwpG4ocqGytSF3LKS/R7yirDIJOHd1ycSrw6csErldtMWl19CDu9WvMrCvzdVK4xXiHaBp6emjG+Tu5QkRACH5BAkUAAkALAAAAAAfABoAQATLMCVEq70YS5QAoQUoIsaBhCRlUN3HeadRyPRs1/X7TQPR/74gcCj0cXSZZLLFgiVQq6eKA+WskFiUVmWqprAdgHhMLpvLLuZp+vVeUWqmTPLE2egzGRi27k9OE1tHey5XhiOHfnxhdI2Oj45iOxyQlZYbEx0DREVAnT4DAAMsm2yCb4ikoy+jN652dhylsquJqG0jmqosIBO3fwWBu7RWN3V3OAl6CbO6X290bNDE1IJep02rzK2wrzY31NtK4xbirGfo6aUb5O0VEhEAIfkECQAACQAsAAAAAB8AGgBABMYwJUSrvRhLlAChBSgixoGEJGVQ3cd5p1HI9Gzb9dpyyED4wJ8wSBz+eLuMMpNMrngnlkoafbmSqKfW9MyyYC+AeEwum8tXsDdV1Y6aMEkCR5fTdWCnaqJDZflfaS5dU2xrKHAAcouMjYxiHxOOk5RySAADRUZBmz8DmCyZhX6jI08Joi8DMXetOSGoqxypboalVR2ysSJzoxOwa7uzqzVzxXU1w1+ypJa1sBvCwoem1aqhxK2udMrdS9/Yy2fj5KIb4OgVEhEAIfkECQAACQAsAAAAAB8AGgBABMwwJUSrvRhLlAChBSgixoGEJGVQ3cd5p1HI9Gzb9dpyyED4wJ8wSBz+eLuMMpNMFiarExQ0lb5cTpWWZEKhok2AeEwum81Y2Gkb/W5R4U8CR5fMc7MrSx1KlHhra34mE3qGbWwjiIYdAHaPkJGQYnIckpeYGxMdA0VGQZ8/AwADLJ1viiNuHKcvpXR4sTaspbSJKYGLcKSmtYVucyyptrYzfjjHNMnGxJxbdhVRYBJwrQmtq16ouM62srDgza1L5L17o2fp6acb5e4VEhEAIfkECQAACQAsAAAAAB8AGgBABMowJUSrvRhLlAChBSgixoGEJGVQ3cd5p1HI9GzX9ftNA9H/viBwKPRxdJlkssWCJVapBGolVXFQTORphJqOoNkOYEwum89mV9ab2rahWBgSZ5M8C7e6NgyawFl9bWFyf29WbXFqY3aMjY6NYzscj5SVGxMdA0RFQJw+AwADLJqHXaVfo6Ivonl0rjYcpLGqULWobnGqCbKmRyd+IxOzqVc3UjV3NMfDq30bbnB2wbK7qmy9vWChxK/dN8zVSuIW4ato5+ikz+PsLAkRACH/C0xWaWV3UHJvMjAwADs=")).set({
                            font: "font_size_14",
                            textColor: "text-region-value"
                        }));
                        e.add(c);
                        e.add(d);
                        e.add(this.H = (new qx.ui.basic.Atom("Only Camps\\Outposts in range.", "webfrontend/battleview/for/cities/base_level_2.png")).set({
                            font: "font_size_14",
                            textColor: "text-region-value"
                        }));
                        e.add(P);
                        e.add(N);
                        e.add(S);
                        webfrontend.gui.region.RegionCityMoveInfo.getInstance().addAt(e, 3);
                        var f = [webfrontend.gui.region.RegionCityStatusInfoOwn, webfrontend.gui.region.RegionCityStatusInfoAlliance, webfrontend.gui.region.RegionCityStatusInfoEnemy, webfrontend.gui.region.RegionNPCBaseStatusInfo, webfrontend.gui.region.RegionNPCCampStatusInfo, webfrontend.gui.region.RegionRuinStatusInfo];
                        for (var i = 0; i < f.length; i++) {
                            f[i].getInstance().addListener("appear", this.bM, this);
                        }
                        phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Notifications(), "NotificationAdded", ClientLib.Data.NotificationAdded, this, this.au);
                        var g = ClientLib.Vis.VisMain.GetInstance().GetMouseTool(ClientLib.Vis.MouseTool.EMouseTool.MoveBase);
                        phe.cnc.Util.attachNetEvent(g, "OnCellChange", ClientLib.Vis.MouseTool.OnCellChange, this, this.ar);
                        phe.cnc.Util.attachNetEvent(g, "OnDeactivate", ClientLib.Vis.MouseTool.OnDeactivate, this, this.ay);
                        phe.cnc.Util.attachNetEvent(g, "OnActivate", ClientLib.Vis.MouseTool.OnActivate, this, this.bu);
                    },
                    aR: function () {
                        var a;
                        if (typeof webfrontend.gui.region.RegionCityInfo.prototype.getObject !== "function") {
                            a = webfrontend.gui.region.RegionCityInfo.prototype.setObject.toString();
                            var b = a.match(/^function \(([A-Za-z]+)\)\{.+this\.([A-Za-z_]+)=\1;/)[2];
                            webfrontend.gui.region.RegionCityInfo.prototype.getObject = function () {
                                return this[b];
                            };
                        }
                        if (typeof ClientLib.Data.WorldSector.WorldObjectNPCBase.prototype.get_BaseLevelFloat !== "function") {
                            a = ClientLib.Vis.Region.RegionNPCBase.prototype.get_BaseLevelFloat.toString();
                            var c = a.match(/return this\.[A-Z]{6}\.([A-Z]{6});/)[1];
                            ClientLib.Data.WorldSector.WorldObjectNPCBase.prototype.get_BaseLevelFloat = function () {
                                return this[c];
                            };
                        }
                        if (typeof ClientLib.Data.WorldSector.WorldObjectNPCBase.prototype.get_BaseLevel !== "function") {
                            a = ClientLib.Vis.Region.RegionNPCBase.prototype.get_BaseLevel.toString();
                            var d = a.match(/return this\.[A-Z]{6}\.([A-Z]{6});/)[1];
                            ClientLib.Data.WorldSector.WorldObjectNPCBase.prototype.get_BaseLevel = function () {
                                return this[d];
                            };
                        }
                        if (typeof ClientLib.Data.WorldSector.WorldObjectNPCCamp.prototype.get_BaseLevelFloat !== "function") {
                            a = ClientLib.Vis.Region.RegionNPCCamp.prototype.get_BaseLevelFloat.toString();
                            var e = a.match(/return this\.[A-Z]{6}\.([A-Z]{6});/)[1];
                            ClientLib.Data.WorldSector.WorldObjectNPCCamp.prototype.get_BaseLevelFloat = function () {
                                return this[e];
                            };
                        }
                        if (typeof ClientLib.Data.WorldSector.WorldObjectNPCCamp.prototype.get_CampType !== "function") {
                            a = ClientLib.Vis.Region.RegionNPCCamp.prototype.get_CampType.toString();
                            var f = a.match(/return this\.[A-Z]{6}\.([A-Z]{6});/)[1];
                            ClientLib.Data.WorldSector.WorldObjectNPCCamp.prototype.get_CampType = function () {
                                return this[f];
                            };
                        }
                        if (typeof ClientLib.Data.WorldSector.WorldObjectPointOfInterest.prototype.get_Level !== "function") {
                            a = ClientLib.Vis.Region.RegionPointOfInterest.prototype.get_Level.toString();
                            var g = a.match(/return this\.[A-Z]{6}\.([A-Z]{6});/)[1];
                            ClientLib.Data.WorldSector.WorldObjectPointOfInterest.prototype.get_Level = function () {
                                return this[g];
                            };
                        }
                        if (typeof ClientLib.Data.WorldSector.WorldObjectPointOfInterest.prototype.get_Type !== "function") {
                            a = ClientLib.Vis.Region.RegionPointOfInterest.prototype.get_Type.toString();
                            var h = a.match(/return this\.[A-Z]{6}\.([A-Z]{6});/)[1];
                            ClientLib.Data.WorldSector.WorldObjectPointOfInterest.prototype.get_Type = function () {
                                return this[h];
                            };
                        }
                    },
                    bM: function (c) {
                        var d = c.getTarget();
                        var e = d.getLayoutParent().getObject();
                        var f = this.U(e.get_RawX(), e.get_RawY(), ClientLib.Data.MainData.GetInstance().get_Server().get_MaxAttackDistance(), [ClientLib.Data.WorldSector.ObjectType.NPCBase])[ClientLib.Data.WorldSector.ObjectType.NPCBase];
                        var g = this.aN(f);
                        var m = 0;
                        var O = f.length;
                        if (O > 49) {
                            this.V.setValue(O.toString());
                            this.G.setValue("5 Attacks");
                        } else if (O > 39) {
                            this.V.setValue(O.toString());
                            this.G.setValue("4 Attacks");
                        } else if (O > 29) {
                            this.V.setValue(O.toString());
                            this.G.setValue("3 Attacks");
                        } else if (O > 21) {
                            this.V.setValue(O.toString());
                            this.G.setValue("2 Attacks");
                        } else if (O < 22) {
                            this.V.setValue(O.toString());
                            this.G.setValue("1 Attack");
                        }
                        if (Object.keys(g).length > 0) {
                            this.R.setValue(Object.keys(g).sort(function (a, b) {
                                return b - a;
                            }).map(function (a) {
                                if (a > m) {
                                    m = a;
                                }
                                return g[a] + " x " + a;
                            }).join(", "));
                            switch (true) {
                                case m > 39:
                                    this.J.setLabel("Level " + m.toString() + " base in range");
                                    this.J.setIcon("webfrontend/battleview/for/cities/base_level_7.png");
                                    break;
                                case m > 34:
                                    this.J.setLabel("Level " + m.toString() + " base in range");
                                    this.J.setIcon("webfrontend/battleview/for/cities/base_level_6.png");
                                    break;
                                case m > 29:
                                    this.J.setLabel("Level " + m.toString() + " base in range");
                                    this.J.setIcon("webfrontend/battleview/for/cities/base_level_5.png");
                                    break;
                                case m > 24:
                                    this.J.setLabel("Level " + m.toString() + " base in range");
                                    this.J.setIcon("webfrontend/battleview/for/cities/base_level_4.png");
                                    break;
                                case m > 20:
                                    this.J.setLabel("Level " + m.toString() + " base in range");
                                    this.J.setIcon("webfrontend/battleview/for/cities/base_level_3.png");
                                    break;
                                case m < 16:
                                    this.J.setLabel("Level " + m.toString() + " base in range");
                                    this.J.setIcon("webfrontend/battleview/for/cities/base_level_2.png");
                                    break;
                                default:
                            }
                        } else {
                            this.R.setValue("-");
                            this.J.setLabel("Only Camps\\Outposts in range");
                            this.J.setIcon("webfrontend/battleview/for/cities/base_level_1.png");
                        }
                        if (m - 5 <= 0) {
                            this.Q.setValue(0);
                        } else {
                            this.Q.setValue(m - 5);
                        }
                        var xT = this.MD.get_Cities().get_CurrentOwnCity().get_LvlDefense().toFixed(2);
                        this.M.setValue(xT);
                        var xU = m - 5 - xT;
                        switch (true) {
                            case xU < -4:
                                this.B.setValue("Your defence is Outstanding!");
                                this.B.setTextColor("lime");
                                this.M.setTextColor("lime");
                                break;
                            case xU < -3:
                                this.B.setValue("Your defence is Excellent!");
                                this.B.setTextColor("green");
                                this.M.setTextColor("green");
                                break;
                            case xU < -2:
                                this.B.setValue("Your defence is Great!");
                                this.B.setTextColor("green");
                                this.M.setTextColor("green");
                                break;
                            case xU < -1:
                                this.B.setValue("Your defence is Very Good!");
                                this.B.setTextColor("green");
                                this.M.setTextColor("green");
                                break;
                            case xU < 0:
                                this.B.setValue("Your defence is Pretty Good!");
                                this.B.setTextColor("green");
                                this.M.setTextColor("green");
                                break;
                            case xU < 1:
                                this.B.setValue("Your defence is Good");
                                this.B.setTextColor("green");
                                this.M.setTextColor("green");
                                break;
                            case xU < 2:
                                this.B.setValue("Your defence is Fairly Good");
                                this.B.setTextColor("yellow");
                                this.M.setTextColor("yellow");
                                break;
                            case xU < 3:
                                this.B.setValue("Your defence may Hold");
                                this.B.setTextColor("yellow");
                                this.M.setTextColor("yellow");
                                break;
                            case xU < 4:
                                this.B.setValue("Your defence is Vulnerable");
                                this.B.setTextColor("yellow");
                                this.M.setTextColor("yellow");
                                break;
                            case xU < 5:
                                this.B.setValue("Your defence is Vulnerable");
                                this.B.setTextColor("orange");
                                this.M.setTextColor("orange");
                                break;
                            case xU < 6:
                                this.B.setValue("Your defence NEEDS Upgrading!");
                                this.B.setTextColor("red");
                                this.M.setTextColor("red");
                                break;
                            case xU < 7:
                                this.B.setValue("Your defence Will Fail!");
                                this.B.setTextColor("red");
                                this.M.setTextColor("red");
                                break;
                            case xU < 8:
                                this.B.setValue("Your defence Will Fail!");
                                this.B.setTextColor("red");
                                this.M.setTextColor("red");
                                break;
                            default:
                        }
                        d.add(this.T);
                    },
                    ar: function (x, y) {
                        var c = ClientLib.Base.MathUtil.EncodeCoordId(x, y);
                        var m = 0;
                        if (!(c in this.L)) {
                            var d = this.U(x, y, ClientLib.Data.MainData.GetInstance().get_Server().get_MaxAttackDistance(), [ClientLib.Data.WorldSector.ObjectType.NPCBase])[ClientLib.Data.WorldSector.ObjectType.NPCBase];
                            this.L[c] = {tK: d.length, rV: this.aN(d)};
                        }
                        var e = this.L[c];
                        var C = e.tK;
                        if (C > 49) {
                            this.F.setValue(C.toString());
                            this.K.setValue("5 Attacks");
                        } else if (C > 39) {
                            this.F.setValue(C.toString());
                            this.K.setValue("4 Attacks");
                        } else if (C > 29) {
                            this.F.setValue(C.toString());
                            this.K.setValue("3 Attacks");
                        } else if (C > 21) {
                            this.F.setValue(C.toString());
                            this.K.setValue("2 Attacks");
                        } else if (C < 22) {
                            this.F.setValue(C.toString());
                            this.K.setValue("1 Attack");
                        }
                        if (Object.keys(e.rV).length > 0) {
                            this.ae.setValue(Object.keys(e.rV).sort(function (a, b) {
                                return b - a;
                            }).map(function (a) {
                                if (a > m) {
                                    m = a;
                                }
                                return e.rV[a] + " x " + a;
                            }).join(", "));
                            switch (true) {
                                case m > 39:
                                    this.H.setLabel("Level " + m.toString() + " base in range");
                                    this.H.setIcon("webfrontend/battleview/for/cities/base_level_7.png");
                                    break;
                                case m > 34:
                                    this.H.setLabel("Level " + m.toString() + " base in range");
                                    this.H.setIcon("webfrontend/battleview/for/cities/base_level_6.png");
                                    break;
                                case m > 29:
                                    this.H.setLabel("Level " + m.toString() + " base in range");
                                    this.H.setIcon("webfrontend/battleview/for/cities/base_level_5.png");
                                    break;
                                case m > 24:
                                    this.H.setLabel("Level " + m.toString() + " base in range");
                                    this.H.setIcon("webfrontend/battleview/for/cities/base_level_4.png");
                                    break;
                                case m > 20:
                                    this.H.setLabel("Level " + m.toString() + " base in range");
                                    this.H.setIcon("webfrontend/battleview/for/cities/base_level_3.png");
                                    break;
                                case m < 16:
                                    this.H.setLabel("Level " + m.toString() + " base in range");
                                    this.H.setIcon("webfrontend/battleview/for/cities/base_level_2.png");
                                    break;
                                default:
                            }
                        } else {
                            this.ae.setValue("-");
                            this.H.setLabel("Only Camps\\Outposts in range");
                            this.H.setIcon("webfrontend/battleview/for/cities/base_level_1.png");
                        }
                        if (m - 5 <= 0) {
                            this.r.setValue((0).toFixed(2));
                        } else {
                            this.r.setValue((m - 5).toFixed(2));
                        }
                        var xT = this.MD.get_Cities().get_CurrentOwnCity().get_LvlDefense().toFixed(2);
                        this.I.setValue(xT);
                        var xU = (m - 5).toFixed(2) - xT;
                        switch (true) {
                            case xU < -4:
                                this.D.setValue("Your defence is Outstanding!");
                                this.D.setTextColor("lime");
                                this.I.setTextColor("lime");
                                break;
                            case xU < -3:
                                this.D.setValue("Your defence is Excellent!");
                                this.D.setTextColor("green");
                                this.I.setTextColor("green");
                                break;
                            case xU < -2:
                                this.D.setValue("Your defence is Great!");
                                this.D.setTextColor("green");
                                this.I.setTextColor("green");
                                break;
                            case xU < -1:
                                this.D.setValue("Your defence is Very Good!");
                                this.D.setTextColor("green");
                                this.I.setTextColor("green");
                                break;
                            case xU < 0:
                                this.D.setValue("Your defence is Pretty Good!");
                                this.D.setTextColor("green");
                                this.I.setTextColor("green");
                                break;
                            case xU < 1:
                                this.D.setValue("Your defence is Good");
                                this.D.setTextColor("green");
                                this.I.setTextColor("green");
                                break;
                            case xU < 2:
                                this.D.setValue("Your defence is Fairly Good");
                                this.D.setTextColor("yellow");
                                this.I.setTextColor("yellow");
                                break;
                            case xU < 3:
                                this.D.setValue("Your defence may Hold");
                                this.D.setTextColor("yellow");
                                this.I.setTextColor("yellow");
                                break;
                            case xU < 4:
                                this.D.setValue("Your defence is Vulnerable");
                                this.D.setTextColor("yellow");
                                this.I.setTextColor("yellow");
                                break;
                            case xU < 5:
                                this.D.setValue("Your defence is Vulnerable");
                                this.D.setTextColor("orange");
                                this.I.setTextColor("orange");
                                break;
                            case xU < 6:
                                this.D.setValue("Your defence NEEDS Upgrading!");
                                this.D.setTextColor("red");
                                this.I.setTextColor("red");
                                break;
                            case xU < 7:
                                this.D.setValue("Your defence Will Fail!");
                                this.D.setTextColor("red");
                                this.I.setTextColor("red");
                                break;
                            case xU < 8:
                                this.D.setValue("Your defence Will Fail!");
                                this.D.setTextColor("red");
                                this.I.setTextColor("red");
                                break;
                            default:
                        }
                    },
                    ay: function () {
                        this.L = null;
                    },
                    bu: function () {
                        this.L = {};
                    },
                    U: function (x, y, a, b) {
                        var c = ClientLib.Data.MainData.GetInstance().get_World();
                        var d = a * a;
                        var e = Math.floor(a);
                        var f = x - e;
                        var g = x + e;
                        var h = y - e;
                        var j = y + e;
                        var k = {};
                        for (var i = 0; i < b.length; i++) {
                            k[b[i]] = [];
                        }
                        for (var l = f; l <= g; l++) {
                            for (var m = h; m <= j; m++) {
                                var n = (x - l) * (x - l) + (y - m) * (y - m);
                                if (n > d) {
                                    continue;
                                }
                                var o = c.GetObjectFromPosition(l, m);
                                if (o !== null && b.indexOf(o.Type) !== -1) {
                                    k[o.Type].push(o);
                                }
                            }
                        }
                        return k;
                    },
                    aN: function (a) {
                        var b = {};
                        for (var i = 0; i < a.length; i++) {
                            var c = a[i].get_BaseLevel();
                            if (!(c in b)) {
                                b[c] = 0;
                            }
                            b[c]++;
                        }
                        return b;
                    },
                    au: function (a) {
                        if (a.get_CategoryId() === ClientLib.Data.ENotificationCategory.Combat) {
                            switch (a.get_MdbId()) {
                                case ClientLib.Data.ENotificationId.NPCPlayerCombatBattleDefaultDefense:
                                case ClientLib.Data.ENotificationId.NPCPlayerCombatBattleTotalLostDefense:
                                    var b = this.bU(a, webfrontend.gui.notifications.NotificationsUtil.ParameterReportId);
                                    var c = b[0], playerReportType = b[1];
                                    ClientLib.Data.MainData.GetInstance().get_Reports().MarkReportsAsRead([c], playerReportType, false);
                                    break;
                                default:
                            }
                        }
                    },
                    bU: function (a, b) {
                        var c = a.get_Parameters();
                        for (var i = 0; i < c.length; i++) {
                            if (c[i].t === b) {
                                return c[i].v;
                            }
                        }
                        throw new Error("Notification " + a.get_Id() + " parameter \"" + b + "\" not found");
                    }
                }
            });
            qx.Class.define("Aa.CountLabel", {
                extend: qx.ui.container.Composite, construct: function () {
                    qx.ui.container.Composite.call(this);
                    this.setLayout(new qx.ui.layout.HBox);
                    this.add(this.bB = (new qx.ui.basic.Label).set({textColor: "text-region-value"}));
                    this.add(new qx.ui.core.Spacer(4));
                    this.add(new qx.ui.basic.Label("("));
                    this.add(this.aJ = (new qx.ui.basic.Label).set({textColor: "text-region-value"}));
                    this.add(new qx.ui.basic.Label(")"));
                }, members: {
                    bB: null, aJ: null, bm: function (a) {
                        var b = this.aC(a);
                        this.bB.setValue(a.toString());
                        this.aJ.setValue(b.toString() + " Attack" + (b === 1 ? "" : "s"));
                    }, aC: function (a) {
                        return Math.max(1, Math.min(5, Math.floor(a / 10)));
                    }
                }
            });
        }

        function bk() {
            try {
                if (typeof qx !== "undefined" && qx.core.Init.getApplication() && qx.core.Init.getApplication().initDone) {
                    if (ClientLib.Data.MainData.GetInstance().get_Server().get_ForgottenAttacksEnabled()) {
                        bG();
                        Aa.getInstance().initialize();
                    } else {
                        console.log("ZWaves: Forgotten attacks not enabled. Init cancelled.");
                    }
                } else {
                    setTimeout(bk, 1000);
                }
            } catch (e) {
                console.log("ZWaves: ", e.toString());
            }
        }

        setTimeout(bk, 1000);
    };
    var qzw = document.createElement("script");
    qzw.innerHTML = "(" + pzw.toString() + ")();";
    qzw.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(qzw);

// Tiberium Alliances ReplayShare - DTeCH
        var mainRS = function () {
            'use strict';

            function createReplayShare() {
                console.log('ReplayShare loaded');

                Parse.initialize('PmNW9dH7wrTFQmYgInbDVgGqagUOVPIzENRwzfWu', 'ajepOC4n9K44jh89s5WKtEa4v0hh3OMokxNqLqt0');
                var Replay = Parse.Object.extend('Replay', {
                    /**
                     * @returns {Object}
                     */
                    getData: function () {
                        return this.get('data');
                    },
                    /**
                     * @param {Object} data
                     * @returns {Replay}
                     */
                    setData: function (data) {
                        this.set('data', data);
                        return this;
                    },
                    /**
                     * @param {Object} data
                     * @returns {Boolean}
                     */
                    equals: function (data) {
                        return JSON.stringify(this.getData()) === JSON.stringify(data);
                    }
                });

                qx.Class.define('ReplayShare', {
                    type: 'singleton',
                    extend: qx.core.Object,
                    events: {
                        lastReplayDataChange: 'qx.event.type.Data'
                    },
                    members: {
                        lastReplayData: null,
                        window: null,

                        initialize: function () {
                            this.initializeHacks();
                            this.initializeEntryPoints();
                        },

                        initializeHacks: function () {
                            var source = ClientLib.Vis.Battleground.Battleground.prototype.LoadCombatDirect.toString();
                            var initCombatMethodName = source.match(/this\.([A-Z]{6})\(null,[a-z]\);}$/)[1];

                            var context = this;
                            var originalInitCombat = ClientLib.Vis.Battleground.Battleground.prototype[initCombatMethodName];

                            ClientLib.Vis.Battleground.Battleground.prototype[initCombatMethodName] = function (extra, data) {
                                originalInitCombat.call(this, extra, data);
                                context.lastReplayData = data;
                                context.fireDataEvent('lastReplayDataChange', data);
                            };

                            var originalOpenLink = webfrontend.gui.Util.openLink;
                            webfrontend.gui.Util.openLink = function (url) {
                                if (!context.handleLink(url)) {
                                    originalOpenLink.apply(this, arguments);
                                }
                            };
                        },

                        initializeEntryPoints: function () {
                            var subMenu = new qx.ui.menu.Menu();
                            var button = new qx.ui.menu.Button('Open');
                            button.addListener('execute', this.openWindow, this);
                            subMenu.add(button);
                            qx.core.Init.getApplication().getMenuBar().getScriptsButton().Add('ReplayShare', 'FactionUI/icons/icn_replay_speedup.png', subMenu);

                            var shareButton = new qx.ui.form.Button('Share').set({
                                appearance: 'button-text-small',
                                toolTipText: 'Open in ReplayShare',
                                width: 80
                            });
                            shareButton.addListener('execute', this.onClickShare, this);
                            qx.core.Init.getApplication().getReportReplayOverlay().add(shareButton, {
                                right: 150,
                                top: 12
                            });
                        },

                        /**
                         * @param {String} key
                         * @returns {Object}
                         */
                        getConfig: function (key) {
                            var config = JSON.parse(localStorage.getItem('ReplayShare')) || {};
                            return key in config ? config[key] : null;
                        },

                        /**
                         * @param {String} key
                         * @param {Object} value
                         */
                        setConfig: function (key, value) {
                            var config = JSON.parse(localStorage.getItem('ReplayShare')) || {};
                            config[key] = value;
                            localStorage.setItem('ReplayShare', JSON.stringify(config));
                        },

                        /**
                         * @param {String} url
                         * @returns {Boolean}
                         */
                        handleLink: function (url) {
                            var matches = url.match(/^https?:\/\/replayshare\.parseapp\.com\/([A-Za-z0-9]+)/);

                            if (matches !== null) {
                                var id = matches[1];

                                if (this.getConfig('dontAsk')) {
                                    this.openWindow();
                                    this.window.download(id);
                                }
                                else {
                                    var context = this;
                                    var widget = new ReplayShare.ConfirmationWidget(url, function (dontAskAgain) {
                                        context.openWindow();
                                        context.window.download(id);

                                        if (dontAskAgain) {
                                            context.setConfig('dontAsk', true);
                                        }
                                    });
                                    widget.open();
                                }

                                return true;
                            }

                            return false;
                        },

                        openWindow: function () {
                            if (this.window === null) {
                                this.window = new ReplayShare.Window(this);
                            }

                            this.window.open();
                        },

                        onClickShare: function () {
                            this.openWindow();
                            this.window.onClickFetchReplayData();
                        },

                        /**
                         * @param {Object} replayData
                         * @returns {Boolean}
                         */
                        tryPlay: function (replayData) {
                            qx.core.Init.getApplication().getPlayArea().setView(ClientLib.Data.PlayerAreaViewMode.pavmCombatReplay, -1, 0, 0);

                            try {
                                ClientLib.Vis.VisMain.GetInstance().get_Battleground().LoadCombatDirect(replayData);
                            }
                            catch (e) {
                                console.log('ReplayShare::tryPlay', e.toString());
                                return false;
                            }

                            return true;
                        },

                        /**
                         * @returns {Boolean}
                         */
                        hasLastReplayData: function () {
                            return this.lastReplayData !== null;
                        },

                        /**
                         * @returns {Object}
                         */
                        getLastReplayData: function () {
                            return this.lastReplayData;
                        }
                    }
                });

                qx.Class.define('ReplayShare.Window', {
                    extend: qx.ui.window.Window,
                    construct: function (replayShare) {
                        qx.ui.window.Window.call(this);
                        this.replayShare = replayShare;

                        this.set({
                            caption: 'ReplayShare',
                            icon: 'FactionUI/icons/icn_replay_speedup.png',
                            contentPaddingTop: 0,
                            contentPaddingBottom: 2,
                            contentPaddingRight: 6,
                            contentPaddingLeft: 6,
                            showMaximize: false,
                            showMinimize: false,
                            allowMaximize: false,
                            allowMinimize: false,
                            resizable: true
                        });
                        this.getChildControl('icon').set({
                            scale: true,
                            width: 20,
                            height: 12,
                            alignY: 'middle'
                        });

                        this.initializePosition();
                        this.addListener('move', this.onWindowMove, this);
                        this.setLayout(new qx.ui.layout.VBox());

                        this.add(this.errorMessageLabel = new qx.ui.basic.Label().set({
                            font: 'font_size_13',
                            textColor: '#e44',
                            visibility: 'excluded'
                        }));

                        var createPlayerGroupBox = function (legend, factionImage, nameLabel, baseLabel, allianceLabel) {
                            var nameContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(4));
                            nameContainer.add(factionImage.set({
                                width: 18,
                                height: 18,
                                scale: true
                            }));
                            nameContainer.add(nameLabel);

                            var groupBox = new qx.ui.groupbox.GroupBox(legend);
                            groupBox.setLayout(new qx.ui.layout.Grid(2, 2)
                                    .setColumnFlex(0, 1)
                                    .setColumnFlex(1, 9)
                            );
                            groupBox.add(new qx.ui.basic.Label('Name:').set({font: 'font_size_13_bold'}), {
                                row: 0,
                                column: 0
                            });
                            groupBox.add(nameContainer, {row: 0, column: 1});
                            groupBox.add(new qx.ui.basic.Label('Base:').set({font: 'font_size_13_bold'}), {
                                row: 1,
                                column: 0
                            });
                            groupBox.add(baseLabel, {row: 1, column: 1});
                            groupBox.add(new qx.ui.basic.Label('Alliance:').set({font: 'font_size_13_bold'}), {
                                row: 2,
                                column: 0
                            });
                            groupBox.add(allianceLabel, {row: 2, column: 1});

                            return groupBox;
                        };

                        var detailsContainer = new qx.ui.container.Composite(new qx.ui.layout.Flow()).set({
                            font: 'font_size_13',
                            textColor: '#111'
                        });
                        this.add(detailsContainer);
                        detailsContainer.add(createPlayerGroupBox('Attacker',
                            this.attackerFactionImage = new qx.ui.basic.Image(),
                            this.attackerNameLabel = new qx.ui.basic.Label(),
                            this.attackerBaseLabel = new qx.ui.basic.Label(),
                            this.attackerAllianceLabel = new qx.ui.basic.Label()
                        ).set({width: 290}));
                        detailsContainer.add(createPlayerGroupBox('Defender',
                            this.defenderFactionImage = new qx.ui.basic.Image(),
                            this.defenderNameLabel = new qx.ui.basic.Label(),
                            this.defenderBaseLabel = new qx.ui.basic.Label(),
                            this.defenderAllianceLabel = new qx.ui.basic.Label()
                        ).set({width: 290}));

                        this.add(this.timeOfAttackLabel = new qx.ui.basic.Label().set({
                            alignX: 'right',
                            textColor: '#aaa'
                        }));

                        var controlsContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(4)).set({
                            marginBottom: 4,
                            marginLeft: 2,
                            marginTop: 4
                        });
                        this.add(controlsContainer);

                        this.fetchReplayDataButton = new qx.ui.form.Button('Fetch').set({
                            enabled: this.replayShare.hasLastReplayData(),
                            toolTipText: 'Fetch most recently viewed replay or simulation'
                        });
                        this.fetchReplayDataButton.addListener('execute', this.onClickFetchReplayData, this);
                        controlsContainer.add(this.fetchReplayDataButton, {flex: 1});

                        if (!this.replayShare.hasLastReplayData()) {
                            this.replayShare.addListenerOnce('lastReplayDataChange', this.onLastReplayDataChanged, this);
                        }

                        this.watchReplayButton = new qx.ui.form.Button('Play').set({
                            enabled: false,
                            toolTipText: 'Watch loaded replay'
                        });
                        this.watchReplayButton.addListener('execute', this.onClickWatchReplay, this);
                        controlsContainer.add(this.watchReplayButton, {flex: 1});

                        this.uploadButton = new qx.ui.form.Button('Get link').set({
                            enabled: false,
                            toolTipText: 'Get share link for loaded replay'
                        });
                        this.uploadButton.addListener('execute', this.onClickUpload, this);
                        controlsContainer.add(this.uploadButton, {flex: 1});
                    },
                    statics: {
                        DefaultWidth: 300,
                        DefaultHeight: null
                    },
                    members: {
                        replayShare: null,
                        sharePopup: null,
                        errorMessageLabel: null,
                        attackerFactionImage: null,
                        attackerNameLabel: null,
                        attackerBaseLabel: null,
                        attackerAllianceLabel: null,
                        defenderFactionImage: null,
                        defenderNameLabel: null,
                        defenderBaseLabel: null,
                        defenderAllianceLabel: null,
                        timeOfAttackLabel: null,
                        fetchReplayDataButton: null,
                        watchReplayButton: null,
                        uploadButton: null,
                        replay: null,

                        initializePosition: function () {
                            var bounds = this.replayShare.getConfig('bounds');

                            if (bounds === null) {
                                var baseNavBarX = qx.core.Init.getApplication().getBaseNavigationBar().getLayoutParent().getBounds().left;

                                bounds = {
                                    left: baseNavBarX - ReplayShare.Window.DefaultWidth - 16,
                                    top: 75,
                                    width: ReplayShare.Window.DefaultWidth,
                                    height: ReplayShare.Window.DefaultHeight
                                };
                            }

                            this.moveTo(bounds.left, bounds.top);
                            this.setWidth(bounds.width);
                            this.setHeight(bounds.height);
                        },

                        /**
                         * @param {qx.event.type.Data} event
                         */
                        onWindowMove: function (event) {
                            this.replayShare.setConfig('bounds', event.getData());
                        },

                        onLastReplayDataChanged: function () {
                            this.fetchReplayDataButton.setEnabled(true);
                        },

                        onClickFetchReplayData: function () {
                            var replayData = this.replayShare.getLastReplayData();
                            replayData = JSON.parse(JSON.stringify(replayData));    // clone
                            delete replayData.debug;

                            if (this.replay === null || !this.replay.equals(replayData)) {
                                this.setReplay(new Replay().setData(replayData));
                            }
                        },

                        onClickWatchReplay: function () {
                            var replayData = this.replay.getData();

                            if (!this.replayShare.tryPlay(replayData)) {
                                this.errorMessageLabel.setValue('Error: Invalid replay data');
                                this.errorMessageLabel.show();
                            }
                            else {
                                this.errorMessageLabel.exclude();
                            }
                        },

                        onClickUpload: function () {
                            this.openSharePopup();

                            if (this.replay.isNew()) {
                                var context = this;

                                this.replay.save(null, {
                                    success: function (replay) {
                                        context.sharePopup.setLinkURL('https://replayshare.parseapp.com/' + replay.id);
                                    },
                                    error: function (replay, error) {
                                        context.sharePopup.setError(error.message);
                                    }
                                });
                            }
                            else {
                                this.sharePopup.setLinkURL('https://replayshare.parseapp.com/' + this.replay.id);
                            }
                        },

                        /**
                         * @param {Object} replayData
                         */
                        setDetailsFromReplayData: function (replayData) {
                            var isForgottenAttacker = replayData.af !== ClientLib.Base.EFactionType.GDIFaction && replayData.af !== ClientLib.Base.EFactionType.NODFaction;
                            this.attackerFactionImage.setSource(phe.cnc.gui.util.Images.getFactionIcon(replayData.af));
                            this.attackerNameLabel.setValue(isForgottenAttacker ? this.tr('tnf:mutants') : replayData.apn);
                            this.attackerBaseLabel.setValue(this.getReplayAttackerBaseName(replayData));
                            this.attackerAllianceLabel.setValue(isForgottenAttacker ? this.tr('tnf:mutants') : (replayData.aan || '-'));

                            var isForgottenDefender = replayData.df !== ClientLib.Base.EFactionType.GDIFaction && replayData.df !== ClientLib.Base.EFactionType.NODFaction;
                            this.defenderFactionImage.setSource(phe.cnc.gui.util.Images.getFactionIcon(isForgottenDefender ? ClientLib.Base.EFactionType.FORFaction : replayData.df));
                            this.defenderNameLabel.setValue(isForgottenDefender ? this.tr('tnf:mutants') : replayData.dpn);
                            this.defenderBaseLabel.setValue(this.getReplayDefenderBaseName(replayData));
                            this.defenderAllianceLabel.setValue(isForgottenDefender ? this.tr('tnf:mutants') : (replayData.dan || '-'));

                            this.timeOfAttackLabel.setValue(phe.cnc.Util.getDateTimeString(new Date(replayData.toa)));
                        },

                        /**
                         * @param {Object} replayData
                         * @returns {String}
                         */
                        getReplayAttackerBaseName: function (replayData) {
                            var attackerBaseName;

                            switch (replayData.af) {
                                case ClientLib.Base.EFactionType.FORFaction:
                                case ClientLib.Base.EFactionType.NPCBase:
                                case ClientLib.Base.EFactionType.NPCCamp:
                                case ClientLib.Base.EFactionType.NPCOutpost:
                                    attackerBaseName = this.tr(replayData.an) + ' (' + replayData.abl + ')';
                                    break;
                                default:
                                    attackerBaseName = replayData.an;
                            }

                            return attackerBaseName;
                        },

                        /**
                         * @param {Object} replayData
                         * @returns {String}
                         */
                        getReplayDefenderBaseName: function (replayData) {
                            var defenderBaseName;

                            switch (replayData.df) {
                                case ClientLib.Base.EFactionType.FORFaction:
                                case ClientLib.Base.EFactionType.NPCBase:
                                case ClientLib.Base.EFactionType.NPCCamp:
                                case ClientLib.Base.EFactionType.NPCOutpost:
                                case ClientLib.Base.EFactionType.NPCFortress:
                                    var defenderPlayerId = replayData.dpi;
                                    var type;

                                    switch (Math.abs(defenderPlayerId) % 10) {
                                        case ClientLib.Data.WorldSector.WorldObjectNPCCamp.ECampType.Beginner:
                                        case ClientLib.Data.WorldSector.WorldObjectNPCCamp.ECampType.Random:
                                            type = 'tnf:mutants camp';
                                            break;
                                        case ClientLib.Data.WorldSector.WorldObjectNPCCamp.ECampType.Cluster:
                                            type = 'tnf:mutants outpost';
                                            break;
                                        case ClientLib.Data.WorldSector.WorldObjectNPCCamp.ECampType.Fortress:
                                            type = 'tnf:centerhub short';
                                            break;
                                        default:
                                            type = 'tnf:mutants base';
                                    }

                                    defenderBaseName = this.tr(type) + ' (' + Math.floor(Math.abs(defenderPlayerId) / 10) + ')';
                                    break;
                                default:
                                    defenderBaseName = replayData.dn;
                            }

                            return defenderBaseName;
                        },

                        /**
                         * @param {String} id
                         */
                        download: function (id) {
                            this.errorMessageLabel.exclude();
                            this.resetFields('Loading...');

                            var context = this;
                            var query = new Parse.Query(Replay);
                            query.get(id, {
                                success: function (replay) {
                                    context.setReplay(replay);
                                },
                                error: function (replay, error) {
                                    context.errorMessageLabel.setValue('Error: ' + error.message);
                                    context.errorMessageLabel.show();

                                    if (context.replay !== null) {
                                        context.setDetailsFromReplayData(context.replay.getData());
                                    }
                                    else {
                                        context.resetFields(null);
                                    }
                                }
                            });
                        },

                        /**
                         * @param {Replay} replay
                         */
                        setReplay: function (replay) {
                            this.replay = replay;
                            this.setDetailsFromReplayData(replay.getData());
                            this.watchReplayButton.setEnabled(true);
                            this.uploadButton.setEnabled(true);
                        },

                        openSharePopup: function () {
                            if (this.sharePopup === null) {
                                var bounds = this.getBounds();
                                this.sharePopup = new ReplayShare.Window.ShareLink();
                                this.sharePopup.moveTo(
                                    bounds.left - (this.sharePopup.getWidth() - bounds.width) / 2,
                                    bounds.top - (this.sharePopup.getHeight() - bounds.height) / 2
                                );
                            }

                            this.sharePopup.open();
                        },

                        /**
                         * @param {String} label
                         */
                        resetFields: function (label) {
                            this.attackerFactionImage.setSource(null);
                            this.attackerNameLabel.setValue(label);
                            this.attackerBaseLabel.setValue(label);
                            this.attackerAllianceLabel.setValue(label);
                            this.defenderFactionImage.setSource(null);
                            this.defenderNameLabel.setValue(label);
                            this.defenderBaseLabel.setValue(label);
                            this.defenderAllianceLabel.setValue(label);
                            this.timeOfAttackLabel.setValue(label);
                        }
                    }
                });

                qx.Class.define('ReplayShare.Window.ShareLink', {
                    extend: qx.ui.window.Window,
                    construct: function () {
                        qx.ui.window.Window.call(this);

                        this.set({
                            caption: 'Share link',
                            allowMaximize: false,
                            allowMinimize: false,
                            showMinimize: false,
                            showMaximize: false,
                            showClose: true,
                            resizable: false,
                            padding: 1,
                            textColor: '#aaa',
                            width: 378,
                            height: 98
                        });
                        this.setLayout(new qx.ui.layout.VBox());

                        this.add(new qx.ui.basic.Label('Copy the link to share this replay with others'));
                        this.add(this.linkField = new qx.ui.form.TextField().set({
                            readOnly: true,
                            focusable: true,
                            placeholder: 'Loading...'
                        }));
                        this.add(this.errorMessageLabel = new qx.ui.basic.Label().set({
                            textColor: '#e44',
                            visibility: 'excluded'
                        }));

                        this.linkField.addListener('click', this.linkField.selectAllText, this.linkField);
                        this.addListener('changeActive', this.onChangeActive, this);
                    },
                    members: {
                        linkField: null,
                        errorMessageLabel: null,

                        /**
                         * @param {qx.event.type.Data} event
                         */
                        onChangeActive: function (event) {
                            if (!event.getData()) {
                                this.close();
                            }
                        },

                        open: function () {
                            this.linkField.setValue(null);
                            this.errorMessageLabel.exclude();
                            qx.ui.window.Window.prototype.open.call(this);
                        },

                        /**
                         * @param {String} url
                         */
                        setLinkURL: function (url) {
                            this.linkField.setValue('[url]' + url + '[/url]');

                            new qx.util.DeferredCall(function () {
                                this.linkField.focus();
                                this.linkField.selectAllText();
                            }, this).schedule();
                        },

                        /**
                         * @param {String} error
                         */
                        setError: function (error) {
                            this.errorMessageLabel.setValue(error);
                            this.errorMessageLabel.show();
                        }
                    }
                });

                qx.Class.define('ReplayShare.ConfirmationWidget', {
                    extend: webfrontend.gui.CustomWindow,
                    construct: function (url, callback) {
                        webfrontend.gui.CustomWindow.call(this);
                        this.callback = callback;
                        this.url = url;

                        this.set({
                            caption: 'Open link',
                            allowMaximize: false,
                            allowMinimize: false,
                            showMaximize: false,
                            showMinimize: false,
                            showClose: false,
                            resizable: false,
                            modal: true
                        });
                        this.setLayout(new qx.ui.layout.VBox(10));
                        this.addListenerOnce('resize', this.center, this);

                        this.add(new qx.ui.basic.Label('Would you like to open this link with ReplayShare?').set({
                            rich: true,
                            maxWidth: 360,
                            wrap: true,
                            textColor: 'white'
                        }));

                        var buttonContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(10).set({
                            alignX: 'right'
                        }));

                        var yesDontAskButton = new webfrontend.ui.SoundButton('Yes and don\'t ask again');
                        yesDontAskButton.addListener('execute', this.openReplayShareAndDontAsk, this);

                        var yesButton = new webfrontend.ui.SoundButton('Yes');
                        yesButton.addListener('execute', this.openReplayShare, this);

                        var noButton = new webfrontend.ui.SoundButton('No');
                        noButton.addListener('execute', this.openExternal, this);

                        var cancelButton = new webfrontend.ui.SoundButton('Cancel');
                        cancelButton.addListener('execute', this.close, this);

                        buttonContainer.add(yesDontAskButton);
                        buttonContainer.add(yesButton);
                        buttonContainer.add(noButton);
                        buttonContainer.add(cancelButton);
                        this.add(buttonContainer);
                    },
                    members: {
                        callback: null,
                        url: null,

                        openExternal: function () {
                            this.close();
                            qx.core.Init.getApplication().showExternal(this.url);
                        },

                        openReplayShareAndDontAsk: function () {
                            this.close();
                            this.callback.call(null, true);
                        },

                        openReplayShare: function () {
                            this.close();
                            this.callback.call(null, false);
                        }
                    }
                });
            }

            function waitForGame() {
                try {
                    if (typeof Parse !== 'undefined' && typeof qx !== 'undefined' && qx.core.Init.getApplication() && qx.core.Init.getApplication().initDone) {
                        createReplayShare();
                        ReplayShare.getInstance().initialize();
                    }
                    else {
                        setTimeout(waitForGame, 1000);
                    }
                }
                catch (e) {
                    console.log('ReplayShare: ', e.toString());
                }
            }

            setTimeout(waitForGame, 1000);
        };

        var parseScript = document.createElement('script');
        parseScript.src = 'https://www.parsecdn.com/js/parse-1.2.19.min.js';
        parseScript.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(parseScript);

        var scriptRS = document.createElement('script');
        scriptRS.innerHTML = '(' + mainRS.toString() + ')();';
        scriptRS.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(scriptRS);

// C&C TA POIs Analyser - (DTeCH) {last in version 199u... removed from v199v}

// Tiberium Alliances Tunnel Info - DTeCH
        var TATI_main = function () {
            console.log('Tunnel Info loaded');
            function CreateTATI() {
                qx.Class.define("TATI", {
                    type: "singleton",
                    extend: qx.core.Object,
                    construct: function () {
                    },
                    members: {
                        _App: null,
                        _MainData: null,
                        _VisMain: null,
                        regionCityMoveInfoAddon: {
                            grid: null,
                            blockedTunnelImage: null,
                            offenseLevelLabel: null,
                            offenseLevelValue: null,
                            requiredOffenseLevelLabel: null,
                            requiredOffenseLevelValue: null,
                            activateYesNoLabel: null,
                            activateYesNoMessage: null
                        },
                        regionCityMoveInfoAddonExists: null,
                        currentCityOffenseLevel: null,
                        requiredOffenseLevel: null,
                        gridWidth: null,
                        gridHeight: null,
                        tunnelMarkerWidth: null,
                        tunnelMarkerHeight: null,
                        regionZoomFactor: null,
                        tunnelMarkerList: null,
                        tunnelInfluenceRange: null,
                        activateYesNo: null,
                        activateYesNoMsg: null,
                        initialize: function () {
                            try {
                                this._App = qx.core.Init.getApplication();
                                this._MainData = ClientLib.Data.MainData.GetInstance();
                                this._VisMain = ClientLib.Vis.VisMain.GetInstance();

                                this.tunnelMarkerList = [];

                                phe.cnc.Util.attachNetEvent(this._VisMain.GetMouseTool(ClientLib.Vis.MouseTool.EMouseTool.MoveBase), "OnCellChange", ClientLib.Vis.MouseTool.OnCellChange, this, this.baseMoveToolCellChange);
                                phe.cnc.Util.attachNetEvent(this._VisMain.GetMouseTool(ClientLib.Vis.MouseTool.EMouseTool.MoveBase), "OnActivate", ClientLib.Vis.MouseTool.OnActivate, this, this.baseMoveToolActivate);
                                phe.cnc.Util.attachNetEvent(this._VisMain.GetMouseTool(ClientLib.Vis.MouseTool.EMouseTool.MoveBase), "OnDeactivate", ClientLib.Vis.MouseTool.OnDeactivate, this, this.baseMoveToolDeactivate);

                                this.regionCityMoveInfoAddon.grid = new qx.ui.container.Composite();
                                var layout = new qx.ui.layout.Grid(5, 5);
                                this.regionCityMoveInfoAddon.grid.setLayout(layout);
                                this.regionCityMoveInfoAddon.blockedTunnelImage = new qx.ui.basic.Image('data:image/png;base64,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');

                                this.regionCityMoveInfoAddon.offenseLevelLabel = new qx.ui.basic.Label("Current Offensive Level:");
                                this.regionCityMoveInfoAddon.offenseLevelLabel.setTextColor("#FFF");
                                this.regionCityMoveInfoAddon.offenseLevelLabel.setAlignY("bottom");
                                this.regionCityMoveInfoAddon.offenseLevelLabel.setAlignX("left");

                                this.regionCityMoveInfoAddon.offenseLevelValue = new qx.ui.basic.Label("");
                                this.regionCityMoveInfoAddon.offenseLevelValue.setFont("bold");
                                this.regionCityMoveInfoAddon.offenseLevelValue.setTextColor("yellow");
                                this.regionCityMoveInfoAddon.offenseLevelValue.setAlignY("bottom");
                                this.regionCityMoveInfoAddon.offenseLevelValue.setAlignX("right");

                                this.regionCityMoveInfoAddon.requiredOffenseLevelLabel = new qx.ui.basic.Label("Required Level:");
                                this.regionCityMoveInfoAddon.requiredOffenseLevelLabel.setTextColor("#FFF");
                                this.regionCityMoveInfoAddon.requiredOffenseLevelLabel.setAlignY("top");
                                this.regionCityMoveInfoAddon.requiredOffenseLevelLabel.setAlignX("left");

                                this.regionCityMoveInfoAddon.requiredOffenseLevelValue = new qx.ui.basic.Label("");
                                this.regionCityMoveInfoAddon.requiredOffenseLevelValue.setFont("bold");
                                this.regionCityMoveInfoAddon.requiredOffenseLevelValue.setTextColor("#06ff00");
                                this.regionCityMoveInfoAddon.requiredOffenseLevelValue.setAlignY("top");
                                this.regionCityMoveInfoAddon.requiredOffenseLevelValue.setAlignX("right");

                                this.regionCityMoveInfoAddon.activateYesNoLabel = new qx.ui.basic.Label("You'll DE-ACTIVATE These");
                                this.regionCityMoveInfoAddon.activateYesNoLabel.setTextColor("orange");
                                this.regionCityMoveInfoAddon.activateYesNoLabel.setAlignY("top");
                                this.regionCityMoveInfoAddon.activateYesNoLabel.setAlignX("left");

                                this.regionCityMoveInfoAddon.activateYesNoMessage = new qx.ui.basic.Label("Influence = 6 spaces");
                                this.regionCityMoveInfoAddon.activateYesNoMessage.setTextColor("#FFF");
                                this.regionCityMoveInfoAddon.activateYesNoMessage.setAlignY("top");
                                this.regionCityMoveInfoAddon.activateYesNoMessage.setAlignX("left");

                                this.regionCityMoveInfoAddon.grid.add(this.regionCityMoveInfoAddon.blockedTunnelImage, {
                                    row: 0,
                                    column: 0,
                                    rowSpan: 4
                                });
                                this.regionCityMoveInfoAddon.grid.add(this.regionCityMoveInfoAddon.offenseLevelLabel, {
                                    row: 0,
                                    column: 1
                                });
                                this.regionCityMoveInfoAddon.grid.add(this.regionCityMoveInfoAddon.offenseLevelValue, {
                                    row: 0,
                                    column: 2
                                });
                                this.regionCityMoveInfoAddon.grid.add(this.regionCityMoveInfoAddon.requiredOffenseLevelLabel, {
                                    row: 1,
                                    column: 1
                                });
                                this.regionCityMoveInfoAddon.grid.add(this.regionCityMoveInfoAddon.requiredOffenseLevelValue, {
                                    row: 1,
                                    column: 2
                                });
                                this.regionCityMoveInfoAddon.grid.add(this.regionCityMoveInfoAddon.activateYesNoLabel, {
                                    row: 2,
                                    column: 1,
                                    colSpan: 2
                                });
                                this.regionCityMoveInfoAddon.grid.add(this.regionCityMoveInfoAddon.activateYesNoMessage, {
                                    row: 3,
                                    column: 1,
                                    colSpan: 2
                                });

                            } catch (e) {
                                console.log(e);
                            }
                        },

                        baseMoveToolActivate: function () {
                            try {
                                var announcement = ClientLib.Data.MainData.GetInstance().get_Alliance().get_Announcement();
                                var re = /\[tir\][0-9]\[\/tir\]/;
                                var tir = announcement.match(re);
                                if (tir !== null) {
                                    tir = tir.toString();
                                    this.tunnelInfluenceRange = parseInt(tir.substring(tir.indexOf("]") + 1, tir.lastIndexOf("[")));
                                } else {
                                    this.tunnelInfluenceRange = 6;
                                }
                                this.getRegionZoomFactorAndSetMarkerSize();
                                this.currentCityOffenseLevel = this._MainData.get_Cities().get_CurrentOwnCity().get_LvlOffense();
                                this.regionCityMoveInfoAddon.offenseLevelValue.setValue((this.currentCityOffenseLevel).toFixed(2));

                                phe.cnc.Util.attachNetEvent(this._VisMain.get_Region(), "PositionChange", ClientLib.Vis.PositionChange, this, this.repositionMarkers);
                                phe.cnc.Util.attachNetEvent(this._VisMain.get_Region(), "ZoomFactorChange", ClientLib.Vis.ZoomFactorChange, this, this.resizeMarkers);
                            } catch (e) {
                                console.log(e);
                            }
                        },

                        baseMoveToolDeactivate: function () {
                            try {
                                phe.cnc.Util.detachNetEvent(this._VisMain.get_Region(), "PositionChange", ClientLib.Vis.PositionChange, this, this.repositionMarkers);
                                phe.cnc.Util.detachNetEvent(this._VisMain.get_Region(), "ZoomFactorChange", ClientLib.Vis.ZoomFactorChange, this, this.resizeMarkers);
                                this.removeTunnelMarkers();
                            } catch (e) {
                                console.log(e);
                            }
                        },

                        baseMoveToolCellChange: function (startX, startY) {
                            try {
                                if (this.regionCityMoveInfoAddonExists === true) {
                                    webfrontend.gui.region.RegionCityMoveInfo.getInstance().remove(this.regionCityMoveInfoAddon.grid);
                                    this.regionCityMoveInfoAddonExists = false;
                                }

                                this.removeTunnelMarkers();

                                if (this.currentCityOffenseLevel > 0)
                                    this.findTunnels(startX, startY);
                            } catch (e) {
                                console.log(e);
                            }
                        },

                        findTunnels: function (startX, startY) {
                            try {
                                this.requiredOffenseLevel = 0;
                                var region = this._VisMain.get_Region();
                                var scanDistance = 7;
                                for (var x = startX - (scanDistance); x < (startX + scanDistance); x++) {
                                    for (var y = startY - scanDistance; y < (startY + scanDistance); y++) {
                                        var visObject = region.GetObjectFromPosition(x * region.get_GridWidth(), y * region.get_GridHeight());
                                        if (visObject !== null) {
                                            if (visObject.get_VisObjectType() == ClientLib.Vis.VisObject.EObjectType.RegionPointOfInterest) {
                                                var poiType = visObject.get_Type();
                                                if (poiType === 0) {
                                                    var tunnelX = visObject.get_RawX();
                                                    var tunnelY = visObject.get_RawY();
                                                    var tunnelLevel = visObject.get_Level();
                                                    var distanceToTunnel = ClientLib.Base.Util.CalculateDistance(startX, startY, tunnelX, tunnelY);
                                                    if (distanceToTunnel <= this.tunnelInfluenceRange) {
                                                        if (this.currentCityOffenseLevel < tunnelLevel - 6) {
                                                            // Blocking Tunnel
                                                            // this.activateYesNo = "Will DE-ACTIVATE Tunnel";
                                                            // this.regionCityMoveInfoAddon.activateYesNoLabel.setValue(this.activateYesNo);
                                                            // this.activateYesNoMsg = "Influence = 6 spaces";
                                                            // this.regionCityMoveInfoAddon.activateYesNoMessage.setValue(this.activateYesNoMsg);
                                                            this.regionCityMoveInfoAddon.offenseLevelValue.setTextColor("yellow");
                                                            this.regionCityMoveInfoAddonExists = true;
                                                            if (this.requiredOffenseLevel < tunnelLevel - 6)
                                                                this.requiredOffenseLevel = tunnelLevel - 6;
                                                            this.addTunnelMarker(tunnelX, tunnelY, "#ff3600");
                                                        } else {
                                                            // Activating Tunnel
                                                            this.regionCityMoveInfoAddon.offenseLevelValue.setTextColor("#06ff00");
                                                            // this.activateYesNo = "You'll ACTIVATE Tunnel";
                                                            // this.regionCityMoveInfoAddon.activateYesNoLabel.setValue(this.activateYesNo);
                                                            // this.activateYesNoMsg = "Tunnel influence is 6 spaces";
                                                            // this.regionCityMoveInfoAddon.activateYesNoMessage.setValue(this.activateYesNoMsg);
                                                            this.addTunnelMarker(tunnelX, tunnelY, "#06ff00");
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if (this.regionCityMoveInfoAddonExists === true) {
                                    this.regionCityMoveInfoAddon.requiredOffenseLevelValue.setValue(this.requiredOffenseLevel);
                                    webfrontend.gui.region.RegionCityMoveInfo.getInstance().add(this.regionCityMoveInfoAddon.grid);
                                }
                            } catch (e) {
                                console.log(e);
                            }
                        },

                        screenPosFromWorldPosX: function (x) {
                            try {
                                return this._VisMain.ScreenPosFromWorldPosX(x * this.gridWidth);
                            } catch (e) {
                                console.log(e);
                            }
                        },

                        screenPosFromWorldPosY: function (y) {
                            try {
                                return this._VisMain.ScreenPosFromWorldPosY(y * this.gridHeight);
                            } catch (e) {
                                console.log(e);
                            }
                        },

                        addTunnelMarker: function (tunnelX, tunnelY, color) {
                            try {
                                var tunnelMarker = new qx.ui.container.Composite(new qx.ui.layout.HBox(5)).set({
                                    decorator: new qx.ui.decoration.Single(1, "solid", "#000000").set({
                                        backgroundColor: color
                                    }),
                                    width: this.tunnelMarkerWidth,
                                    height: this.tunnelMarkerHeight,
                                    opacity: 0.5
                                });

                                this._App.getDesktop().addAfter(tunnelMarker, this._App.getBackgroundArea(), {
                                    left: this.screenPosFromWorldPosX(tunnelX),
                                    top: this.screenPosFromWorldPosY(tunnelY)
                                });
                                this.tunnelMarkerList.push({
                                    element: tunnelMarker,
                                    x: tunnelX,
                                    y: tunnelY
                                });
                            } catch (e) {
                                console.log(e);
                            }
                        },

                        removeTunnelMarkers: function () {
                            try {
                                if (this.tunnelMarkerList.length > 0) {
                                    for (var i = 0; i < this.tunnelMarkerList.length; i++) {
                                        this._App.getDesktop().remove(this.tunnelMarkerList[i].element);
                                    }
                                    this.tunnelMarkerList = [];
                                }
                            } catch (e) {
                                console.log(e);
                            }
                        },

                        getRegionZoomFactorAndSetMarkerSize: function () {
                            try {
                                this.gridWidth = this._VisMain.get_Region().get_GridWidth();
                                this.gridHeight = this._VisMain.get_Region().get_GridHeight();
                                this.regionZoomFactor = this._VisMain.get_Region().get_ZoomFactor();
                                this.tunnelMarkerWidth = this.regionZoomFactor * this.gridWidth;
                                this.tunnelMarkerHeight = this.tunnelMarkerWidth * 0.59;
                            } catch (e) {
                                console.log(e);
                            }
                        },

                        repositionMarkers: function () {
                            try {
                                for (var i = 0; i < this.tunnelMarkerList.length; i++) {
                                    this.tunnelMarkerList[i].element.setDomLeft(this.screenPosFromWorldPosX(this.tunnelMarkerList[i].x));
                                    this.tunnelMarkerList[i].element.setDomTop(this.screenPosFromWorldPosY(this.tunnelMarkerList[i].y));
                                }
                            } catch (e) {
                                console.log(e);
                            }
                        },

                        resizeMarkers: function () {
                            try {
                                this.getRegionZoomFactorAndSetMarkerSize();
                                for (var i = 0; i < this.tunnelMarkerList.length; i++) {
                                    this.tunnelMarkerList[i].element.setWidth(this.tunnelMarkerWidth);
                                    this.tunnelMarkerList[i].element.setHeight(this.tunnelMarkerHeight);
                                }
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    }
                });
            }

            function TATI_checkIfLoaded() {
                try {
                    if (typeof qx !== 'undefined' && typeof qx.locale !== 'undefined' && typeof qx.locale.Manager !== 'undefined' && qx.core.Init.getApplication() && ClientLib.Data.MainData.GetInstance().get_Player().get_Faction() !== null) {
                        CreateTATI();
                        window.TATI.getInstance().initialize();
                    } else {
                        window.setTimeout(TATI_checkIfLoaded, 1000);
                    }
                } catch (e) {
                    console.log("TATI_checkIfLoaded: ", e);
                }
            }

            if (/commandandconquer\.com/i.test(document.domain)) {
                window.setTimeout(TATI_checkIfLoaded, 1000);
            }
        };

        try {
            var TATI = document.createElement("script");
            TATI.innerHTML = "(" + TATI_main.toString() + ")();";
            TATI.type = "text/javascript";
            if (/commandandconquer\.com/i.test(document.domain)) {
                document.getElementsByTagName("head")[0].appendChild(TATI);
            }
        } catch (e) {
            console.log("TATI: init error: ", e);
        }

// Tiberium Alliances - New Resource Trade Window (DTeCH)
    var NewTradeOverlay_main = function () {
        console.log('NewTradeOverlay loaded');
        function CreateNewTradeOverlay() {
            qx.Class.undefine("webfrontend.gui.trade.TradeOverlay");
            qx.Class.define("webfrontend.gui.trade.TradeOverlay", {
                type : "singleton",
                extend : webfrontend.gui.OverlayWindow,
                construct : function () {
                    webfrontend.gui.OverlayWindow.call(this);
                    this.set({
                        autoHide : false
                    });
                    this.clientArea.setLayout(new qx.ui.layout.HBox());
                    this.clientArea.setMargin(0);
                    this.clientArea.setWidth(464);
                    this.setTitle(qx.locale.Manager.tr("tnf:trade window title"));
                    this.clientArea.add(new qx.ui.core.Spacer(), {
                        flex : 1
                    });
                    this.clientArea.add(this.tradeWindow());
                    this.clientArea.add(new qx.ui.core.Spacer(), {
                        flex : 1
                    });
                    this.tradeConfirmationWidget = new webfrontend.gui.widgets.confirmationWidgets.TradeConfirmationWidget();
                },
                members : {
                    activated : false,
                    transferWindowTableSelectedRows : null,
                    modifier : null,
                    tradeWindowTable : null,
                    tableColumnModel : null,
                    resourceTransferType : null,
                    transferAmountTextField : null,
                    largeTiberiumImage : null,
                    costToTradeLabel : null,
                    transferFromBaseLabel : null,
                    totalResourceAmount : null,
                    selectedRowData : null,
                    selectedRow : null,
                    tradeButton : null,
                    tenPercentButton : null,
                    twentyFivePercentButton : null,
                    fiftyPercentButton : null,
                    seventyFivePercentButton : null,
                    oneHundredPercentButton : null,
                    resourceSelectionRadioButtons : null,
                    selectAllNoneButton : null,
                    userDefinedMinimumAmount : -1,
                    userDefinedMaxDistance : -1,
                    tradeConfirmationWidget : null,
                    activate : function () {
                        if (!this.activated) {
                            ClientLib.Vis.VisMain.GetInstance().PlayUISound("audio/ui/OpenWindow");
                            phe.cnc.base.Timer.getInstance().addListener("uiTick", this._onTick, this);
                            this.selectedRowData = null;
                            this.selectedRow = null;
                            this.transferWindowTableSelectedRows = [];
                            this.transferAmountTextField.setValue("");
                            this.costToTradeLabel.setValue("0");
                            this.userDefinedMinimumAmount = -1;
                            this.userDefinedMaxDistance = -1;
                            this.resourceTransferType = ClientLib.Base.EResourceType.Tiberium;
                            this.tradeWindowTable.resetCellFocus();
                            this.tradeWindowTable.resetSelection();
                            this.transferFromBaseLabel.setValue(qx.locale.Manager.tr("tnf:select base for transfer"));
                            this.resourceSelectionRadioButtons.resetSelection();
                            this.largeTiberiumImage.setSource("webfrontend/ui/common/icon_res_large_tiberium.png");
                            this.TableRowFilter();
                            this.tableColumnModel.sortByColumn(2, true);
                            qx.locale.Manager.getInstance().addTranslation("en_US", {
                                "tnf:select all" : "Select All"
                            });
                            qx.locale.Manager.getInstance().addTranslation("en_US", {
                                "tnf:select none" : "Select None"
                            });
                            qx.locale.Manager.getInstance().addTranslation("en_US", {
                                "tnf:cannot manually modify" : "Cannot be modified with multiple rows selected"
                            });
                            qx.locale.Manager.getInstance().addTranslation("en_US", {
                                "tnf:trading with multiple bases" : "Trading with multiple bases"
                            });
                            qx.locale.Manager.getInstance().addTranslation("en_US", {
                                "tnf:percent buttons" : "Please use one of the Percent buttons"
                            });
                            this.activated = true;
                        }
                    },
                    deactivate : function () {
                        if (this.activated) {
                            phe.cnc.base.Timer.getInstance().removeListener("uiTick", this._onTick, this);
                            this.tradeWindowTable.resetSelection();
                            this.tradeWindowTable.resetCellFocus();
                            this.transferAmountTextField.setValue("");
                            this.transferWindowTableSelectedRows = [];
                            this.costToTradeLabel.setValue("");
                            this.selectedRow = null;
                            this.selectedRowData = null;
                            this.modifier = 1;
                            this.activated = false;
                        }
                    },
                    getFilterMinimimAmount : function () {
                        return this.userDefinedMinimumAmount;
                    },
                    getFilterDistanceLimit : function () {
                        return this.userDefinedMaxDistance;
                    },
                    tradeWindow : function () {
                        var tradeWindowContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(2)).set({
                            marginTop : 10,
                            marginBottom : 10,
                            marginLeft : 4
                        });

                        tradeWindowContainer.add(new qx.ui.core.Spacer(), {
                            flex : 1
                        });

                        var selectResourcesLabel = new qx.ui.basic.Label(qx.locale.Manager.tr("tnf:select resources:")).set({
                            textColor : "text-label",
                            alignY : "middle",
                            font : "font_size_13"
                        });
                        var resourceSelectionContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(5)).set({
                            height : 26
                        });
                        var tiberiumToggleButton = new qx.ui.form.ToggleButton(null, "webfrontend/ui/common/icon_res_large_tiberium.png").set({
                            appearance : "button-toggle",
                            width : 84
                        });
                        tiberiumToggleButton.setUserData("key", ClientLib.Base.EResourceType.Tiberium);
                        var tiberiumImage = new qx.ui.basic.Image("webfrontend/ui/common/icn_res_tiberium.png").set({
                            width : 24,
                            height : 24,
                            scale : true
                        });
                        var crystalToggleButton = new qx.ui.form.ToggleButton(null, "webfrontend/ui/common/icon_res_large_crystal.png").set({
                            appearance : "button-toggle",
                            width : 84
                        });
                        crystalToggleButton.setUserData("key", ClientLib.Base.EResourceType.Crystal);
                        var crystalImage = new qx.ui.basic.Image("webfrontend/ui/common/icn_res_chrystal.png").set({
                            width : 24,
                            height : 24,
                            scale : true
                        });
                        resourceSelectionContainer.add(new qx.ui.core.Spacer(), {
                            flex : 1
                        });
                        resourceSelectionContainer.add(selectResourcesLabel);
                        resourceSelectionContainer.add(tiberiumToggleButton);
                        resourceSelectionContainer.add(new qx.ui.core.Spacer().set({
                            width : 2
                        }));
                        resourceSelectionContainer.add(crystalToggleButton);
                        resourceSelectionContainer.add(new qx.ui.core.Spacer(), {
                            flex : 1
                        });
                        this.resourceSelectionRadioButtons = new qx.ui.form.RadioGroup(tiberiumToggleButton, crystalToggleButton);
                        this.resourceSelectionRadioButtons.addListener("changeSelection", this.ChangeResourceType, this);

                        tradeWindowContainer.add(resourceSelectionContainer);

                        var currentServer = ClientLib.Data.MainData.GetInstance().get_Server();
                        var tradeCostToolTip = qx.locale.Manager.tr("tnf:trade costs %1 (+%2 per field)", currentServer.get_TradeCostMinimum(), currentServer.get_TradeCostPerField());
                        var searchContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(2));
                        var searchBox = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
                        var minimumAmountLabel = new qx.ui.basic.Label(qx.locale.Manager.tr("tnf:minimum amount:")).set({
                            textColor : "text-label",
                            alignY : "middle",
                            font : "font_size_13"
                        });
                        this.minimumAmountTextField = new qx.ui.form.TextField("").set({
                            toolTipText : qx.locale.Manager.tr("tnf:only numbers allowed")
                        });
                        this.minimumAmountTextField.setFilter(/[0-9]/);
                        this.minimumAmountTextField.setMaxLength(12);
                        var maxDistanceLabel = new qx.ui.basic.Label(qx.locale.Manager.tr("tnf:distance limit:")).set({
                            textColor : "text-label",
                            alignY : "middle",
                            font : "font_size_13",
                            toolTipText : tradeCostToolTip
                        });
                        this.maxDistanceTextField = new qx.ui.form.TextField("").set({
                            toolTipText : qx.locale.Manager.tr("tnf:only numbers allowed")
                        });
                        this.maxDistanceTextField.setFilter(/[0-9]/);
                        this.maxDistanceTextField.setMaxLength(3);
                        searchBox.add(minimumAmountLabel);
                        searchBox.add(this.minimumAmountTextField);
                        searchBox.add(new qx.ui.core.Spacer(), {
                            flex : 1
                        });
                        searchBox.add(maxDistanceLabel);
                        searchBox.add(this.maxDistanceTextField);
                        searchBox.add(new qx.ui.core.Spacer(), {
                            flex : 2
                        });

                        searchContainer.add(searchBox);

                        var searchButton = new webfrontend.ui.SoundButton(qx.locale.Manager.tr("tnf:search")).set({
                            width : 300,
                            maxWidth : 300,
                            marginBottom : 8,
                            marginTop : 4,
                            alignX : "center"
                        });
                        searchButton.addListener("execute", this.TableRowFilter, this);
                        searchContainer.add(searchButton);

                        //tradeWindowContainer.add(searchContainer);

                        this.selectAllNoneButton = new webfrontend.ui.SoundButton(qx.locale.Manager.tr("tnf:select all")).set({
                            enabled : true,
                            //appearance: "button-forum-light",
                            //textColor: "text-label",
                            width : 160
                        });

                        this.selectAllNoneButton.addListener("click", this.SelectAllRows, this);

                        tradeWindowContainer.add(this.selectAllNoneButton);

                        this.tableColumnModel = new webfrontend.data.SimpleColFormattingDataModel();
                        this.tableColumnModel.setColumns([qx.locale.Manager.tr("tnf:base"), qx.locale.Manager.tr("tnf:distance"), qx.locale.Manager.tr("tnf:$ / 1000"), qx.locale.Manager.tr("tnf:amount"), "Amount", "Max", "ID"], ["Base", "Distance", "Credits", "AmountDesc", "Amount", "Max", "ID"]);
                        this.tableColumnModel.setColumnSortable(0, true);
                        this.tableColumnModel.setColumnSortable(1, true);
                        this.tableColumnModel.setColumnSortable(2, true);
                        this.tableColumnModel.setColumnSortable(3, true);
                        this.tableColumnModel.setSortMethods(3, this.AmountSort);
                        this.tradeWindowTable = new webfrontend.gui.trade.TradeBaseTable(this.tableColumnModel).set({
                            statusBarVisible : false,
                            columnVisibilityButtonVisible : false,
                            maxHeight : 300
                        });
                        var eventType = "cellTap";
                        if (PerforceChangelist >= 436669) { // 15.3 patch
                            eventType = "cellTap";
                        } else { //old
                            eventType = "cellClick";
                        }
                        this.tradeWindowTable.addListener(eventType, this.TradeWindowTableCellClick, this);
                        this.tradeWindowTable.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION);
                        this.tradeWindowTable.setDataRowRenderer(new webfrontend.gui.trade.TradeBaseTableRowRenderer(this.tradeWindowTable));
                        this.tradeWindowTable.showCellToolTip = true;
                        var tradeWindowTableColumnModel = this.tradeWindowTable.getTableColumnModel();
                        tradeWindowTableColumnModel.setDataCellRenderer(0, new qx.ui.table.cellrenderer.String());
                        tradeWindowTableColumnModel.setDataCellRenderer(1, new qx.ui.table.cellrenderer.Number());
                        tradeWindowTableColumnModel.setDataCellRenderer(2, new qx.ui.table.cellrenderer.Number());
                        tradeWindowTableColumnModel.setHeaderCellRenderer(2, new qx.ui.table.headerrenderer.Default());
                        tradeWindowTableColumnModel.getHeaderCellRenderer(2).setToolTip(tradeCostToolTip);
                        tradeWindowTableColumnModel.setDataCellRenderer(3, new webfrontend.gui.trade.TradeBaseTableCellRenderer());
                        tradeWindowTableColumnModel.setColumnWidth(0, 160);
                        tradeWindowTableColumnModel.setColumnWidth(1, 60);
                        tradeWindowTableColumnModel.setColumnWidth(2, 100);
                        tradeWindowTableColumnModel.setColumnVisible(4, false);
                        tradeWindowTableColumnModel.setColumnVisible(5, false);
                        tradeWindowTableColumnModel.setColumnVisible(6, false);
                        tradeWindowContainer.add(this.tradeWindowTable);

                        var transferAmountContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());
                        var transferAmountBox = new qx.ui.container.Composite(new qx.ui.layout.HBox(2)).set({
                            minHeight : 36
                        });
                        this.largeTiberiumImage = new qx.ui.basic.Image("webfrontend/ui/common/icon_res_large_tiberium.png").set({
                            alignY : "middle",
                            width : 22,
                            height : 20,
                            scale : true
                        });
                        this.transferFromBaseLabel = new qx.ui.basic.Label(qx.locale.Manager.tr("tnf:select base for transfer")).set({
                            rich : true,
                            textColor : "text-label",
                            marginBottom : 2,
                            alignY : "middle",
                            maxWidth : 182
                        });
                        this.transferAmountTextField = new qx.ui.form.TextField("").set({
                            toolTipText : qx.locale.Manager.tr("tnf:only numbers allowed"),
                            enabled : false,
                            width : 208,
                            marginRight : 1
                        });
                        this.transferAmountTextField.setFilter(/[0-9]/);
                        this.transferAmountTextField.setMaxLength(20);
                        this.transferAmountTextField.addListener("input", this.ResourceAmountChanged, this);
                        transferAmountBox.add(this.largeTiberiumImage);
                        transferAmountBox.add(this.transferFromBaseLabel);
                        var percentButtonsBox = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
                            marginTop : 2
                        });
                        this.tenPercentButton = new webfrontend.ui.SoundButton("10%").set({
                            enabled : false,
                            appearance : "button-forum-light",
                            textColor : "text-label",
                            width : 42
                        });
                        this.tenPercentButton.addListener("execute", this.TenPercent, this);
                        this.twentyFivePercentButton = new webfrontend.ui.SoundButton("25%").set({
                            enabled : false,
                            appearance : "button-forum-light",
                            textColor : "text-label",
                            width : 42
                        });
                        this.twentyFivePercentButton.addListener("execute", this.TwentyFivePercent, this);
                        this.fiftyPercentButton = new webfrontend.ui.SoundButton("50%").set({
                            enabled : false,
                            appearance : "button-forum-light",
                            textColor : "text-label",
                            width : 42
                        });
                        this.fiftyPercentButton.addListener("execute", this.FiftyPercent, this);
                        this.seventyFivePercentButton = new webfrontend.ui.SoundButton("75%").set({
                            enabled : false,
                            appearance : "button-forum-light",
                            textColor : "text-label",
                            width : 42
                        });
                        this.seventyFivePercentButton.addListener("execute", this.SeventyFivePercent, this);
                        this.oneHundredPercentButton = new webfrontend.ui.SoundButton("100%").set({
                            enabled : false,
                            appearance : "button-forum-light",
                            textColor : "text-label",
                            width : 42
                        });
                        this.oneHundredPercentButton.addListener("execute", this.OneHundredPercent, this);
                        percentButtonsBox.add(this.tenPercentButton);
                        percentButtonsBox.add(this.twentyFivePercentButton);
                        percentButtonsBox.add(this.fiftyPercentButton);
                        percentButtonsBox.add(this.seventyFivePercentButton);
                        percentButtonsBox.add(this.oneHundredPercentButton);
                        transferAmountContainer.add(transferAmountBox);
                        transferAmountContainer.add(this.transferAmountTextField);
                        transferAmountContainer.add(percentButtonsBox);
                        var tradeCostContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                            alignX : "center",
                            maxWidth : 148
                        });
                        var tradeCostLabel = new qx.ui.basic.Label(qx.locale.Manager.tr("tnf:costs:")).set({
                            textColor : "text-label",
                            marginBottom : 2,
                            font : "font_size_13_bold",
                            width : 148,
                            textAlign : "center"
                        });
                        var tradeCostBox = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
                            alignX : "center",
                            allowGrowX : true,
                            marginTop : 10
                        });
                        this.costToTradeLabel = new qx.ui.basic.Label().set({
                            textColor : "text-value",
                            alignY : "middle",
                            font : "font_size_14_bold",
                            marginLeft : 3
                        });
                        var dollarImage = new qx.ui.basic.Image("webfrontend/ui/common/icon_res_large_credits.png").set({
                            width : 18,
                            height : 20,
                            scale : true,
                            AutoFlipH : false
                        });
                        tradeCostBox.add(new qx.ui.core.Spacer(), {
                            flex : 1
                        });
                        tradeCostBox.add(dollarImage);
                        tradeCostBox.add(this.costToTradeLabel);
                        tradeCostBox.add(new qx.ui.core.Spacer(), {
                            flex : 1
                        });
                        this.tradeButton = new webfrontend.ui.SoundButton(qx.locale.Manager.tr("tnf:trade")).set({
                            width : 196,
                            enabled : false
                        });
                        this.tradeButton.addListener("execute", this.TradeWithBases, this);
                        tradeCostContainer.add(tradeCostLabel);
                        tradeCostContainer.add(tradeCostBox);
                        tradeCostContainer.add(this.tradeButton);
                        var tradeWindowCanvas = new qx.ui.container.Composite(new qx.ui.layout.Canvas()).set({
                            decorator : new qx.ui.decoration.Background().set({
                                backgroundRepeat : 'no-repeat',
                                backgroundImage : "webfrontend/ui/menues/resource_transfer/bgr_restransfer_summary.png"
                            })
                        });
                        tradeWindowCanvas.add(transferAmountContainer, {
                            left : 50,
                            top : 5
                        });
                        tradeWindowCanvas.add(tradeCostContainer, {
                            left : 285,
                            top : 18
                        });
                        tradeWindowCanvas.add(this.tradeButton, {
                            left : 134,
                            top : 100
                        });
                        tradeWindowContainer.add(tradeWindowCanvas);
                        return tradeWindowContainer;
                    },
                    TableRowFilter : function () {
                        var tableArray = [];
                        var currentCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                        if (currentCity !== null) {
                            this.userDefinedMaxDistance = this.maxDistanceTextField.getValue() === "" ? -1 : parseInt(this.maxDistanceTextField.getValue(), 10);
                            this.userDefinedMinimumAmount = this.minimumAmountTextField.getValue() === "" ? -1 : parseInt(this.minimumAmountTextField.getValue(), 10);
                            var allCities = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities();
                            for (var currentBase in allCities.d) {
                                if (currentCity.get_Id() != currentBase && allCities.d[currentBase].IsOwnBase()) {
                                    var otherCity = allCities.d[currentBase];
                                    var currentBaseID = currentBase;
                                    var otherCityName = otherCity.get_Name();
                                    var distance = ClientLib.Base.Util.CalculateDistance(currentCity.get_X(), currentCity.get_Y(), otherCity.get_X(), otherCity.get_Y());
                                    var costToTrade = currentCity.CalculateTradeCostToCoord(otherCity.get_X(), otherCity.get_Y(), 1000);
                                    var resourceAmount = Math.floor(otherCity.GetResourceCount(this.resourceTransferType));
                                    var maxResources = Math.floor(otherCity.GetResourceMaxStorage(this.resourceTransferType));
                                    var disqualifyDistance = false;
                                    var disqualifyAmount = false;
                                    if (this.userDefinedMaxDistance != -1 && this.userDefinedMaxDistance < distance)
                                        disqualifyDistance = true;
                                    if (this.userDefinedMinimumAmount != -1 && this.userDefinedMinimumAmount > resourceAmount)
                                        disqualifyAmount = true;
                                    if (!disqualifyDistance && !disqualifyAmount) {
                                        var formattedAmount = phe.cnc.gui.util.Numbers.formatNumbers(resourceAmount);
                                        tableArray.push({
                                            Base : otherCityName,
                                            Distance : distance,
                                            Credits : costToTrade,
                                            AmountDesc : formattedAmount,
                                            Amount : resourceAmount,
                                            Max : maxResources.toString(),
                                            ID : currentBaseID
                                        });
                                    }
                                }
                            }
                            this.tableColumnModel.setDataAsMapArray(tableArray, true);
                            this.selectedRow = null;
                            this.selectedRowData = null;
                            this.tradeWindowTable.resetCellFocus();
                            this.MaintainTradeWindow();
                        }
                    },
                    SelectAllRows : function () {
                        if (this.tradeWindowTable.getSelectionModel().getSelectedCount() != this.tableColumnModel.getRowCount()) {
                            this.tradeWindowTable.getSelectionModel().setSelectionInterval(0, this.tableColumnModel.getRowCount() - 1);
                            this.transferAmountTextField.setValue("");
                            this.totalResourceAmount = 0;
                            this.costToTradeLabel.setValue("0");
                            this.selectAllNoneButton.setLabel(qx.locale.Manager.tr("tnf:select none"));
                            this.transferFromBaseLabel.setValue(qx.locale.Manager.tr("tnf:trading with multiple bases"));
                            this.UpdateSelectedRows(this.tableColumnModel.getRowData(0));
                            this.selectedRowData = this.tableColumnModel.getRowData(0);
                        } else {
                            this.tradeWindowTable.resetSelection();
                            this.tradeWindowTable.resetCellFocus();
                            this.transferAmountTextField.setValue("");
                            this.transferWindowTableSelectedRows = [];
                            this.SetCostLabel();
                            this.transferAmountTextField.setToolTipText(qx.locale.Manager.tr("tnf:only numbers allowed"));
                            this.transferFromBaseLabel.setValue(qx.locale.Manager.tr("tnf:select base for transfer"));
                            this.selectAllNoneButton.setLabel(qx.locale.Manager.tr("tnf:select all"));
                        }
                    },
                    AmountSort : function (bI, bJ) {
                        if (bI[4] < bJ[4])
                            return -1;
                        if (bI[4] > bJ[4])
                            return 1;
                        return 0;
                    },
                    UpdateSelectedRows : function (rowData) {
                        this.transferWindowTableSelectedRows = [];

                        var localRows = [];
                        var colModel = this.tableColumnModel;

                        this.tradeWindowTable.getSelectionModel().iterateSelection(function (index) {
                            var city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(colModel.getRowData(index).ID);
                            if (city !== null && city.CanTrade() == ClientLib.Data.ETradeError.None)
                                localRows.push(colModel.getRowData(index));
                        });
                        this.transferWindowTableSelectedRows = localRows;

                    },
                    TradeWindowTableCellClick : function (e) {

                        var rowData = this.tableColumnModel.getRowData(e.getRow());
                        var city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(rowData.ID);

                        this.modifier = 0;
                        this.transferAmountTextField.setValue("");
                        this.SetCostLabel();

                        if (city !== null && city.CanTrade() == ClientLib.Data.ETradeError.None) {
                            this.selectedRow = e.getRow();
                            this.selectedRowData = rowData;

                            this.UpdateSelectedRows();

                            if (this.transferWindowTableSelectedRows.length == 1)
                                this.transferFromBaseLabel.setValue(qx.locale.Manager.tr("tnf:trade with %1", "<b>" + rowData.Base + "</b>"));
                            if (this.transferWindowTableSelectedRows.length > 1)
                                this.transferFromBaseLabel.setValue(qx.locale.Manager.tr("tnf:trading with multiple bases"));

                        }

                        this.MaintainTradeWindow();

                    },
                    ChangeResourceType : function (e) {
                        var userObject = e.getData()[0];
                        this.transferAmountTextField.setValue("");
                        this.transferWindowTableSelectedRows = [];
                        this.SetCostLabel();
                        this.tradeWindowTable.resetSelection();
                        this.tradeWindowTable.resetCellFocus();
                        this.resourceTransferType = userObject.getUserData("key");
                        if (this.resourceTransferType == ClientLib.Base.EResourceType.Tiberium) {
                            this.largeTiberiumImage.setSource("webfrontend/ui/common/icon_res_large_tiberium.png");
                        } else {
                            this.largeTiberiumImage.setSource("webfrontend/ui/common/icon_res_large_crystal.png");
                        }
                        this.selectAllNoneButton.setLabel(qx.locale.Manager.tr("tnf:select all"));
                        this.MaintainTradeWindow();
                    },
                    ResourceAmountChanged : function () {
                        this.modifier = 1;
                        this.SetCostLabel();
                    },
                    CalculateTradeCost : function () {
                        this.totalTransferAmount = 0;

                        if (this.transferWindowTableSelectedRows.length > 0) {

                            var cities = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d;
                            var selectedCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();

                            if (this.transferWindowTableSelectedRows.length > 1) {
                                for (var base in this.transferWindowTableSelectedRows) {
                                    this.totalTransferAmount += cities[this.transferWindowTableSelectedRows[base].ID].CalculateTradeCostToCoord(selectedCity.get_PosX(), selectedCity.get_PosY(), this.transferWindowTableSelectedRows[base].Amount * this.modifier);
                                }
                            } else {
                                this.totalTransferAmount += cities[this.selectedRowData.ID].CalculateTradeCostToCoord(selectedCity.get_PosX(), selectedCity.get_PosY(), parseInt(this.transferAmountTextField.getValue().replace(/[^0-9]/g, '')));
                            }
                            return this.totalTransferAmount;
                        }
                        return 0;
                    },
                    ModifyResourceAmount : function (modifier) {
                        this.totalResourceAmount = 0;

                        this.UpdateSelectedRows(this.selectedRowData);

                        if (this.transferWindowTableSelectedRows.length > 0) {
                            for (var base in this.transferWindowTableSelectedRows) {
                                this.totalResourceAmount += Math.floor(this.transferWindowTableSelectedRows[base].Amount * modifier);
                            }
                            return this.totalResourceAmount;
                        }
                        return 0;
                    },
                    SetCostLabel : function () {
                        var tradeCost = this.CalculateTradeCost();
                        if (this.transferAmountTextField.getValue() === "")
                            tradeCost = 0;
                        this.costToTradeLabel.setValue(phe.cnc.gui.util.Numbers.formatNumbersCompactAfterMillion(tradeCost).toString());
                        this.costToTradeLabel.setToolTipText(phe.cnc.gui.util.Numbers.formatNumbers(tradeCost).toString());
                        //this.MaintainTradeWindow();
                    },
                    TenPercent : function () {
                        this.modifier = 0.1;
                        var resourceAmount = this.ModifyResourceAmount(0.1);
                        this.transferAmountTextField.setValue(phe.cnc.gui.util.Numbers.formatNumbers(resourceAmount));
                        this.SetCostLabel();
                    },
                    TwentyFivePercent : function () {
                        this.modifier = 0.25;
                        var resourceAmount = this.ModifyResourceAmount(0.25);
                        this.transferAmountTextField.setValue(phe.cnc.gui.util.Numbers.formatNumbers(resourceAmount));
                        this.SetCostLabel();
                    },
                    FiftyPercent : function () {
                        this.modifier = 0.5;
                        var resourceAmount = this.ModifyResourceAmount(0.5);
                        this.transferAmountTextField.setValue(phe.cnc.gui.util.Numbers.formatNumbers(resourceAmount));
                        this.SetCostLabel();
                    },
                    SeventyFivePercent : function () {
                        this.modifier = 0.75;
                        var resourceAmount = this.ModifyResourceAmount(0.75);
                        this.transferAmountTextField.setValue(phe.cnc.gui.util.Numbers.formatNumbers(resourceAmount));
                        this.SetCostLabel();
                    },
                    OneHundredPercent : function () {
                        this.modifier = 1;
                        var resourceAmount = this.ModifyResourceAmount(1);
                        this.transferAmountTextField.setValue(phe.cnc.gui.util.Numbers.formatNumbers(resourceAmount));
                        this.SetCostLabel();
                    },
                    TradeWithBases : function () {
                        var transferAmount = 0;
                        var currentCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                        if (this.transferWindowTableSelectedRows.length > 0) {
                            if (currentCity !== null && this.transferAmountTextField.getValue() !== "") {
                                for (var base in this.transferWindowTableSelectedRows) {
                                    var currentBase = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(this.transferWindowTableSelectedRows[base].ID);
                                    if (currentBase !== null && currentBase.CanTrade() == ClientLib.Data.ETradeError.None && currentCity.CanTrade() == ClientLib.Data.ETradeError.None) {
                                        this.tradeButton.setEnabled(false);
                                        if (this.transferWindowTableSelectedRows.length == 1) {
                                            transferAmount = parseInt(this.transferAmountTextField.getValue().replace(/[^0-9]/g, ''));
                                        } else {
                                            transferAmount = parseInt(this.transferWindowTableSelectedRows[base].Amount * this.modifier, 10);
                                        }
                                        ClientLib.Data.MainData.GetInstance().get_Player().AddCredits(-currentCity.CalculateTradeCostToCoord(currentBase.get_X(), currentBase.get_Y(), transferAmount));
                                        currentCity.AddResources(this.resourceTransferType, transferAmount);
                                        currentBase.AddResources(this.resourceTransferType, -transferAmount);
                                        ClientLib.Net.CommunicationManager.GetInstance().SendCommand("SelfTrade", {
                                            targetCityId : currentCity.get_Id(),
                                            sourceCityId : currentBase.get_Id(),
                                            resourceType : this.resourceTransferType,
                                            amount : transferAmount
                                        }, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, this.TradeResult), null);
                                    }
                                }

                                this.tradeWindowTable.resetSelection();
                                this.tradeWindowTable.resetCellFocus();
                                this.transferWindowTableSelectedRows = [];
                                this.transferAmountTextField.setValue("");
                                this.selectAllNoneButton.setLabel(qx.locale.Manager.tr("tnf:select all"));
                                this.SetCostLabel();
                            }
                        }
                    },
                    TradeResult : function (ce, result) {
                        if (result != ClientLib.Base.EErrorCode.Success) {
                            var city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(this.selectedRowData.ID);
                            this.tradeConfirmationWidget.showTradeError(this, null, city.get_Name());
                        } else {
                            this.SetCostLabel();
                        }
                        this.tradeButton.setEnabled(true);
                    },
                    UpdateTradeTableData : function () {
                        var updatedResourceCount = [];
                        var otherCity = null;
                        var currentCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                        if (currentCity !== null) {
                            var transferWindowsTableData = this.tableColumnModel.getDataAsMapArray();
                            for (var row in transferWindowsTableData) {
                                otherCity = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(transferWindowsTableData[row].ID);
                                if (otherCity !== null && currentCity.get_Id() != otherCity.get_Id() && otherCity.IsOwnBase()) {
                                    var otherCityID = otherCity.get_Id();
                                    var otherCityName = otherCity.get_Name();
                                    var otherCityDistance = ClientLib.Base.Util.CalculateDistance(currentCity.get_X(), currentCity.get_Y(), otherCity.get_X(), otherCity.get_Y());
                                    var otherCityTradeCost = currentCity.CalculateTradeCostToCoord(otherCity.get_X(), otherCity.get_Y(), 1000);
                                    var otherCityResourceCount = Math.floor(otherCity.GetResourceCount(this.resourceTransferType));
                                    var otherCityMaxStorage = Math.floor(otherCity.GetResourceMaxStorage(this.resourceTransferType));
                                    var otherCityResourceCountFormatted = phe.cnc.gui.util.Numbers.formatNumbers(otherCityResourceCount);
                                    updatedResourceCount.push({
                                        Base : otherCityName,
                                        Distance : otherCityDistance,
                                        Credits : otherCityTradeCost,
                                        AmountDesc : otherCityResourceCountFormatted,
                                        Amount : otherCityResourceCount,
                                        Max : otherCityMaxStorage.toString(),
                                        ID : otherCityID
                                    });
                                } else {
                                    updatedResourceCount.push(transferWindowsTableData[row]);
                                }
                            }
                            this.tableColumnModel.setDataAsMapArray(updatedResourceCount, true, false);
                            if (this.selectedRow !== null) {
                                var selectedRowData = this.tableColumnModel.getRowData(this.selectedRow);
                                otherCity = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(selectedRowData.ID);
                                if (otherCity !== null && currentCity.get_Id() != otherCity.get_Id() && otherCity.IsOwnBase() && otherCity.CanTrade() != ClientLib.Data.ETradeError.None) {
                                    this.selectedRowData = null;
                                    this.selectedRow = null;
                                    this.tradeWindowTable.resetCellFocus();
                                } else {
                                    this.selectedRowData = selectedRowData;
                                }
                            }
                        }
                    },
                    MaintainTradeWindow : function () {

                        var hasEnoughtCredits = false;
                        var validResourceAmount = true;

                        if (this.transferWindowTableSelectedRows.length > 0) {

                            var resourcesInTextField = parseInt(this.transferAmountTextField.getValue().replace(/[^0-9]/g, ''));
                            var tradeCost = this.CalculateTradeCost();
                            var playerCreditCount = ClientLib.Data.MainData.GetInstance().get_Player().GetCreditsCount();

                            if (playerCreditCount < tradeCost) {
                                this.costToTradeLabel.setTextColor("text-error");
                            } else {
                                this.costToTradeLabel.resetTextColor();
                            }

                            var selectedBaseResourceAmount = parseInt(this.selectedRowData.Amount, 10);

                            if (this.transferAmountTextField.getValue() !== "" && this.transferWindowTableSelectedRows.length > 1) {
                                //Automatically update the text field with the new resource amount each tick
                                var resourceAmount = this.ModifyResourceAmount(this.modifier);
                                this.transferAmountTextField.setValue(phe.cnc.gui.util.Numbers.formatNumbers(resourceAmount));
                                this.SetCostLabel();
                            }

                            if (this.transferWindowTableSelectedRows.length == 1) {
                                if (resourcesInTextField === 0 || selectedBaseResourceAmount < resourcesInTextField) {
                                    this.transferAmountTextField.setTextColor("text-error");
                                } else {
                                    this.transferAmountTextField.resetTextColor();
                                }
                                validResourceAmount = resourcesInTextField > 0 && resourcesInTextField <= selectedBaseResourceAmount;
                            }

                            hasEnoughtCredits = playerCreditCount >= tradeCost;

                        }

                        this.tradeButton.setEnabled(this.transferWindowTableSelectedRows.length > 0 && hasEnoughtCredits && validResourceAmount && this.transferAmountTextField.getValue() != "");
                        this.transferAmountTextField.setEnabled(this.transferWindowTableSelectedRows.length > 0);
                        this.tenPercentButton.setEnabled(this.transferWindowTableSelectedRows.length > 0);
                        this.twentyFivePercentButton.setEnabled(this.transferWindowTableSelectedRows.length > 0);
                        this.fiftyPercentButton.setEnabled(this.transferWindowTableSelectedRows.length > 0);
                        this.seventyFivePercentButton.setEnabled(this.transferWindowTableSelectedRows.length > 0);
                        this.oneHundredPercentButton.setEnabled(this.transferWindowTableSelectedRows.length > 0);

                        this.transferAmountTextField.setReadOnly(this.transferWindowTableSelectedRows.length > 1);

                        if (this.tradeWindowTable.getSelectionModel().getSelectedCount() > 1) {
                            this.transferAmountTextField.setToolTipText(qx.locale.Manager.tr("tnf:percent buttons"));
                        } else {
                            this.transferAmountTextField.setToolTipText(qx.locale.Manager.tr("tnf:only numbers allowed"));
                        }

                    },
                    _onTick : function () {
                        var currentCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                        if (currentCity !== null && currentCity.get_HasIncommingAttack()) {
                            this.onBtnClose();
                        }
                        this.UpdateTradeTableData();
                        this.MaintainTradeWindow();
                    }
                }
            });
        }

        function NewTradeOverlay_checkIfLoaded() {
            try {
                if (typeof qx !== 'undefined' && typeof qx.locale !== 'undefined' && typeof qx.locale.Manager !== 'undefined' && typeof webfrontend.gui.trade.TradeOverlay !== 'undefined') {
                    CreateNewTradeOverlay();
                } else {
                    window.setTimeout(NewTradeOverlay_checkIfLoaded, 1000);
                }
            } catch (e) {
                console.log("NewTradeOverlay_checkIfLoaded: ", e);
            }
        }

        if (/commandandconquer\.com/i.test(document.domain)) {
            window.setTimeout(NewTradeOverlay_checkIfLoaded, 1000);
        }
    };

    try {
        var NewTradeOverlay = document.createElement("script");
        NewTradeOverlay.innerHTML = "(" + NewTradeOverlay_main.toString() + ")();";
        NewTradeOverlay.type = "text/javascript";
        if (/commandandconquer\.com/i.test(document.domain)) {
            document.getElementsByTagName("head")[0].appendChild(NewTradeOverlay);
        }
    } catch (e) {
        console.log("NewTradeOverlay: init error: ", e);
    }

// TA Base Upgrade Tool - DTeCH
    var ijctFunc = function () {
        function createClasses() {
            qx.Class.define("Upgrade", {
                type: "singleton",
                extend: qx.core.Object,
                construct: function () {
                    try {
                        var qxApp = qx.core.Init.getApplication();

                        var btnUpgrade = new qx.ui.form.Button(qxApp.tr("tnf:toggle upgrade mode"), "FactionUI/icons/icon_building_detail_upgrade.png").set({
                            toolTipText: qxApp.tr("tnf:toggle upgrade mode"),
                            alignY: "middle",
                            show: "icon",
                            width: 60,
                            allowGrowX: false,
                            allowGrowY: false,
                            appearance: "button"
                        });
                        btnUpgrade.addListener("click", this.toggleWindow, this);

                        var btnTrade = qx.core.Init.getApplication().getPlayArea().getHUD().getUIItem(ClientLib.Data.Missions.PATH.WDG_TRADE);
                        btnTrade.getLayoutParent().addAfter(btnUpgrade, btnTrade);
                    } catch (e) {
                        console.log("Error setting up Upgrade Constructor: ");
                        console.log(e.toString());
                    }
                },
                destruct: function () {
                },
                members: {
                    toggleWindow: function () {
                        if (Upgrade.Window.getInstance().isVisible()) Upgrade.Window.getInstance().close();
                        else Upgrade.Window.getInstance().open();
                    }
                }
            });
            qx.Class.define("Upgrade.Window", {
                type: "singleton",
                extend: qx.ui.window.Window,
                construct: function () {
                    try {
                        this.base(arguments);
                        this.set({
                            layout: new qx.ui.layout.VBox().set({spacing: 0}),
                            contentPadding: 5,
                            contentPaddingTop: 0,
                            allowMaximize: false,
                            showMaximize: false,
                            allowMinimize: false,
                            showMinimize: false,
                            resizable: false
                        });
                        this.moveTo(124, 31);
                        this.getChildControl("icon").set({width: 18, height: 18, scale: true, alignY: "middle"});

                        this.add(new Upgrade.Current());
                        this.add(new Upgrade.All());
                        this.add(new Upgrade.Repairtime());

                        this.addListener("appear", this.onOpen, this);
                        this.addListener("close", this.onClose, this);
                    } catch (e) {
                        console.log("Error setting up Upgrade.Window Constructor: ");
                        console.log(e.toString());
                    }
                },
                destruct: function () {
                },
                members: {
                    onOpen: function () {
                        phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "ViewModeChange", ClientLib.Vis.ViewModeChange, this, this.onViewModeChanged);
                        this.onViewModeChanged(null, ClientLib.Vis.VisMain.GetInstance().get_Mode());
                    },
                    onClose: function () {
                        phe.cnc.Util.detachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "ViewModeChange", ClientLib.Vis.ViewModeChange, this, this.onViewModeChanged);
                    },
                    onViewModeChanged: function (oldMode, newMode) {
                        if (oldMode !== newMode) {
                            var qxApp = qx.core.Init.getApplication();
                            switch (newMode) {
                                case ClientLib.Vis.Mode.City:
                                    this.setCaption(qxApp.tr("tnf:toggle upgrade mode") + ": " + qxApp.tr("tnf:base"));
                                    this.setIcon("FactionUI/icons/icon_arsnl_base_buildings.png");
                                    break;
                                case ClientLib.Vis.Mode.DefenseSetup:
                                    this.setCaption(qxApp.tr("tnf:toggle upgrade mode") + ": " + qxApp.tr("tnf:defense"));
                                    this.setIcon("FactionUI/icons/icon_def_army_points.png");
                                    break;
                                case ClientLib.Vis.Mode.ArmySetup:
                                    this.setCaption(qxApp.tr("tnf:toggle upgrade mode") + ": " + qxApp.tr("tnf:offense"));
                                    this.setIcon("FactionUI/icons/icon_army_points.png");
                                    break;
                                default:
                                    this.close();
                                    break;
                            }
                        }
                    }
                }
            });
            qx.Class.define("Upgrade.All", {
                extend: qx.ui.container.Composite,
                construct: function () {
                    try {
                        qx.ui.container.Composite.call(this);
                        this.set({
                            layout: new qx.ui.layout.VBox(5),
                            padding: 5,
                            decorator: "pane-light-opaque"
                        });
                        this.add(this.title = new qx.ui.basic.Label("").set({
                            alignX: "center",
                            font: "font_size_14_bold"
                        }));

                        var level = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
                        level.add(new qx.ui.basic.Label(this.tr("tnf:level:")).set({alignY: "middle"}));
                        level.add(this.txtLevel = new qx.ui.form.Spinner(1).set({maximum: 150, minimum: 1}));
                        this.txtLevel.addListener("changeValue", this.onInput, this);
                        level.add(this.btnLevel = new qx.ui.form.Button(this.tr("tnf:toggle upgrade mode"), "FactionUI/icons/icon_building_detail_upgrade.png"));
                        this.btnLevel.addListener("execute", this.onUpgrade, this);
                        this.add(level);

                        var requires = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
                        requires.add(new qx.ui.basic.Label(this.tr("tnf:requires:")));
                        var resource = new qx.ui.container.Composite(new qx.ui.layout.VBox(5));
                        resource.add(this.resTiberium = new qx.ui.basic.Atom("-", "webfrontend/ui/common/icn_res_tiberium.png"));
                        this.resTiberium.setToolTipIcon("webfrontend/ui/common/icn_res_tiberium.png");
                        this.resTiberium.getChildControl("icon").set({
                            width: 18,
                            height: 18,
                            scale: true,
                            alignY: "middle"
                        });
                        resource.add(this.resChrystal = new qx.ui.basic.Atom("-", "webfrontend/ui/common/icn_res_chrystal.png"));
                        this.resChrystal.setToolTipIcon("webfrontend/ui/common/icn_res_chrystal.png");
                        this.resChrystal.getChildControl("icon").set({
                            width: 18,
                            height: 18,
                            scale: true,
                            alignY: "middle"
                        });
                        resource.add(this.resPower = new qx.ui.basic.Atom("-", "webfrontend/ui/common/icn_res_power.png"));
                        this.resPower.setToolTipIcon("webfrontend/ui/common/icn_res_power.png");
                        this.resPower.getChildControl("icon").set({
                            width: 18,
                            height: 18,
                            scale: true,
                            alignY: "middle"
                        });
                        requires.add(resource);
                        this.add(requires);

                        this.addListener("appear", this.onAppear, this);
                        this.addListener("disappear", this.onDisappear, this);
                    } catch (e) {
                        console.log("Error setting up Upgrade.All Constructor: ");
                        console.log(e.toString());
                    }
                },
                destruct: function () {
                },
                members: {
                    title: null,
                    txtLevel: null,
                    btnLevel: null,
                    resTiberium: null,
                    resChrystal: null,
                    resPower: null,
                    onAppear: function () {
                        phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "ViewModeChange", ClientLib.Vis.ViewModeChange, this, this.onViewModeChanged);
                        phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, this.onCurrentCityChange);
                        phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentChange", ClientLib.Data.CurrentCityChange, this, this.onCurrentCityChange);
                        phe.cnc.base.Timer.getInstance().addListener("uiTick", this.onTick, this);
                        this.onViewModeChanged(null, ClientLib.Vis.VisMain.GetInstance().get_Mode());
                    },
                    onDisappear: function () {
                        phe.cnc.Util.detachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "ViewModeChange", ClientLib.Vis.ViewModeChange, this, this.onViewModeChanged);
                        phe.cnc.Util.detachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, this.onCurrentCityChange);
                        phe.cnc.Util.detachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentChange", ClientLib.Data.CurrentCityChange, this, this.onCurrentCityChange);
                        phe.cnc.base.Timer.getInstance().removeListener("uiTick", this.onTick, this);
                    },
                    onViewModeChanged: function (oldViewMode, newViewMode) {
                        if (oldViewMode !== newViewMode) {
                            switch (newViewMode) {
                                case ClientLib.Vis.Mode.City:
                                    this.title.setValue(this.tr("All buildings"));
                                    this.reset();
                                    break;
                                case ClientLib.Vis.Mode.DefenseSetup:
                                    this.title.setValue(this.tr("All defense units"));
                                    this.reset();
                                    break;
                                case ClientLib.Vis.Mode.ArmySetup:
                                    this.title.setValue(this.tr("All army units"));
                                    this.reset();
                                    break;
                            }
                        }
                    },
                    onCurrentCityChange: function (oldCurrentCity, newCurrentCity) {
                        if (oldCurrentCity !== newCurrentCity) {
                            this.reset();
                        }
                    },
                    getResTime: function (need, type) {
                        var CurrentOwnCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                        var Alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
                        need -= CurrentOwnCity.GetResourceCount(type);
                        need = Math.max(0, need);
                        var Con = CurrentOwnCity.GetResourceGrowPerHour(type);
                        var Bonus = CurrentOwnCity.get_hasCooldown() ? 0 : CurrentOwnCity.GetResourceBonusGrowPerHour(type);
                        var POI = CurrentOwnCity.get_IsGhostMode() ? 0 : Alliance.GetPOIBonusFromResourceType(type);
                        return (need <= 0 ? 0 : need / (Con + Bonus + POI) * 3600);
                    },
                    getUpgradeCostsToLevel: function (newLevel) {
                        if (newLevel > 0) {
                            switch (ClientLib.Vis.VisMain.GetInstance().get_Mode()) {
                                case ClientLib.Vis.Mode.City:
                                    return ClientLib.API.City.GetInstance().GetUpgradeCostsForAllBuildingsToLevel(newLevel);
                                case ClientLib.Vis.Mode.DefenseSetup:
                                    return ClientLib.API.Defense.GetInstance().GetUpgradeCostsForAllUnitsToLevel(newLevel);
                                case ClientLib.Vis.Mode.ArmySetup:
                                    return ClientLib.API.Army.GetInstance().GetUpgradeCostsForAllUnitsToLevel(newLevel);
                            }
                        }
                        return null;
                    },
                    getLowLevel: function () {
                        for (var newLevel = 1, Tib = 0, Cry = 0, Pow = 0; Tib === 0 && Cry === 0 && Pow === 0 && newLevel < 1000; newLevel++) {
                            var costs = this.getUpgradeCostsToLevel(newLevel);
                            if (costs !== null) {
                                for (var i = 0; i < costs.length; i++) {
                                    var uCosts = costs[i];
                                    var cType = parseInt(uCosts.Type, 10);
                                    switch (cType) {
                                        case ClientLib.Base.EResourceType.Tiberium:
                                            Tib += uCosts.Count;
                                            break;
                                        case ClientLib.Base.EResourceType.Crystal:
                                            Cry += uCosts.Count;
                                            break;
                                        case ClientLib.Base.EResourceType.Power:
                                            Pow += uCosts.Count;
                                            break;
                                    }
                                }
                            }
                        }
                        return (newLevel === 1000 ? 0 : (newLevel - 1));
                    },
                    reset: function () {
                        var LowLevel = this.getLowLevel();
                        if (LowLevel > 0) {
                            this.txtLevel.setMinimum(LowLevel);
                            this.txtLevel.setMaximum(LowLevel + 50);
                            this.txtLevel.setValue(LowLevel);
                            this.txtLevel.setEnabled(true);
                            this.btnLevel.setEnabled(true);
                        } else {
                            this.txtLevel.setMinimum(0);
                            this.txtLevel.setMaximum(0);
                            this.txtLevel.resetValue();
                            this.txtLevel.setEnabled(false);
                            this.btnLevel.setEnabled(false);
                        }
                        this.onInput();
                    },
                    onTick: function () {
                        this.onInput();
                    },
                    onInput: function () {
                        var newLevel = parseInt(this.txtLevel.getValue(), 10);
                        var costs = this.getUpgradeCostsToLevel(newLevel);
                        if (newLevel > 0 && costs !== null) {
                            for (var i = 0, Tib = 0, Cry = 0, Pow = 0, TibTime = 0, CryTime = 0, PowTime = 0; i < costs.length; i++) {
                                var uCosts = costs[i];
                                switch (parseInt(uCosts.Type, 10)) {
                                    case ClientLib.Base.EResourceType.Tiberium:
                                        Tib += uCosts.Count;
                                        TibTime += this.getResTime(uCosts.Count, ClientLib.Base.EResourceType.Tiberium);
                                        break;
                                    case ClientLib.Base.EResourceType.Crystal:
                                        Cry += uCosts.Count;
                                        CryTime += this.getResTime(uCosts.Count, ClientLib.Base.EResourceType.Crystal);
                                        break;
                                    case ClientLib.Base.EResourceType.Power:
                                        Pow += uCosts.Count;
                                        PowTime += this.getResTime(uCosts.Count, ClientLib.Base.EResourceType.Power);
                                        break;
                                }
                            }
                            this.resTiberium.setLabel(phe.cnc.gui.util.Numbers.formatNumbersCompact(Tib) + (TibTime > 0 ? " @ " + phe.cnc.Util.getTimespanString(TibTime) : ""));
                            this.resTiberium.setToolTipText(phe.cnc.gui.util.Numbers.formatNumbers(Tib));
                            if (Tib === 0) this.resTiberium.exclude();
                            else this.resTiberium.show();
                            this.resChrystal.setLabel(phe.cnc.gui.util.Numbers.formatNumbersCompact(Cry) + (CryTime > 0 ? " @ " + phe.cnc.Util.getTimespanString(CryTime) : ""));
                            this.resChrystal.setToolTipText(phe.cnc.gui.util.Numbers.formatNumbers(Cry));
                            if (Cry === 0) this.resChrystal.exclude();
                            else this.resChrystal.show();
                            this.resPower.setLabel(phe.cnc.gui.util.Numbers.formatNumbersCompact(Pow) + (PowTime > 0 ? " @ " + phe.cnc.Util.getTimespanString(PowTime) : ""));
                            this.resPower.setToolTipText(phe.cnc.gui.util.Numbers.formatNumbers(Pow));
                            if (Pow === 0) this.resPower.exclude();
                            else this.resPower.show();
                        } else {
                            this.resTiberium.setLabel("-");
                            this.resTiberium.resetToolTipText();
                            this.resTiberium.show();
                            this.resChrystal.setLabel("-");
                            this.resChrystal.resetToolTipText();
                            this.resChrystal.show();
                            this.resPower.setLabel("-");
                            this.resPower.resetToolTipText();
                            this.resPower.show();
                        }
                    },
                    onUpgrade: function () {
                        var newLevel = parseInt(this.txtLevel.getValue(), 10);
                        if (newLevel > 0) {
                            switch (ClientLib.Vis.VisMain.GetInstance().get_Mode()) {
                                case ClientLib.Vis.Mode.City:
                                    ClientLib.API.City.GetInstance().UpgradeAllBuildingsToLevel(newLevel);
                                    this.reset();
                                    break;
                                case ClientLib.Vis.Mode.DefenseSetup:
                                    ClientLib.API.Defense.GetInstance().UpgradeAllUnitsToLevel(newLevel);
                                    this.reset();
                                    break;
                                case ClientLib.Vis.Mode.ArmySetup:
                                    ClientLib.API.Army.GetInstance().UpgradeAllUnitsToLevel(newLevel);
                                    this.reset();
                                    break;
                            }
                        }
                    }
                }
            });
            qx.Class.define("Upgrade.Current", {
                extend: qx.ui.container.Composite,
                construct: function () {
                    try {
                        qx.ui.container.Composite.call(this);
                        this.set({
                            layout: new qx.ui.layout.VBox(5),
                            padding: 5,
                            decorator: "pane-light-opaque"
                        });
                        this.add(this.title = new qx.ui.basic.Label("").set({
                            alignX: "center",
                            font: "font_size_14_bold"
                        }));
                        this.add(this.txtSelected = new qx.ui.basic.Label("").set({alignX: "center"}));

                        var level = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
                        level.add(new qx.ui.basic.Label(this.tr("tnf:level:")).set({alignY: "middle"}));
                        level.add(this.txtLevel = new qx.ui.form.Spinner(1).set({maximum: 150, minimum: 1}));
                        this.txtLevel.addListener("changeValue", this.onInput, this);
                        level.add(this.btnLevel = new qx.ui.form.Button(this.tr("tnf:toggle upgrade mode"), "FactionUI/icons/icon_building_detail_upgrade.png"));
                        this.btnLevel.addListener("execute", this.onUpgrade, this);
                        this.add(level);

                        var requires = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
                        requires.add(new qx.ui.basic.Label(this.tr("tnf:requires:")));
                        var resource = new qx.ui.container.Composite(new qx.ui.layout.VBox(5));
                        resource.add(this.resTiberium = new qx.ui.basic.Atom("-", "webfrontend/ui/common/icn_res_tiberium.png"));
                        this.resTiberium.setToolTipIcon("webfrontend/ui/common/icn_res_tiberium.png");
                        this.resTiberium.getChildControl("icon").set({
                            width: 18,
                            height: 18,
                            scale: true,
                            alignY: "middle"
                        });
                        resource.add(this.resChrystal = new qx.ui.basic.Atom("-", "webfrontend/ui/common/icn_res_chrystal.png"));
                        this.resChrystal.setToolTipIcon("webfrontend/ui/common/icn_res_chrystal.png");
                        this.resChrystal.getChildControl("icon").set({
                            width: 18,
                            height: 18,
                            scale: true,
                            alignY: "middle"
                        });
                        resource.add(this.resPower = new qx.ui.basic.Atom("-", "webfrontend/ui/common/icn_res_power.png"));
                        this.resPower.setToolTipIcon("webfrontend/ui/common/icn_res_power.png");
                        this.resPower.getChildControl("icon").set({
                            width: 18,
                            height: 18,
                            scale: true,
                            alignY: "middle"
                        });
                        requires.add(resource);
                        this.add(requires);

                        this.addListener("appear", this.onAppear, this);
                        this.addListener("disappear", this.onDisappear, this);
                    } catch (e) {
                        console.log("Error setting up Upgrade.Current Constructor: ");
                        console.log(e.toString());
                    }
                },
                destruct: function () {
                },
                members: {
                    title: null,
                    txtSelected: null,
                    txtLevel: null,
                    btnLevel: null,
                    resTiberium: null,
                    resChrystal: null,
                    resPower: null,
                    Selection: null,
                    onAppear: function () {
                        phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "ViewModeChange", ClientLib.Vis.ViewModeChange, this, this.onViewModeChanged);
                        phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "SelectionChange", ClientLib.Vis.SelectionChange, this, this.onSelectionChange);
                        phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, this.onCurrentCityChange);
                        phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentChange", ClientLib.Data.CurrentCityChange, this, this.onCurrentCityChange);
                        phe.cnc.base.Timer.getInstance().addListener("uiTick", this.onTick, this);
                        this.onViewModeChanged(null, ClientLib.Vis.VisMain.GetInstance().get_Mode());
                    },
                    onDisappear: function () {
                        phe.cnc.Util.detachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "ViewModeChange", ClientLib.Vis.ViewModeChange, this, this.onViewModeChanged);
                        phe.cnc.Util.detachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "SelectionChange", ClientLib.Vis.SelectionChange, this, this.onSelectionChange);
                        phe.cnc.Util.detachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, this.onCurrentCityChange);
                        phe.cnc.Util.detachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentChange", ClientLib.Data.CurrentCityChange, this, this.onCurrentCityChange);
                        phe.cnc.base.Timer.getInstance().removeListener("uiTick", this.onTick, this);
                    },
                    onViewModeChanged: function (oldViewMode, newViewMode) {
                        if (oldViewMode !== newViewMode) {
                            switch (newViewMode) {
                                case ClientLib.Vis.Mode.City:
                                    this.title.setValue(this.tr("Selected building"));
                                    this.reset();
                                    break;
                                case ClientLib.Vis.Mode.DefenseSetup:
                                    this.title.setValue(this.tr("Selected defense unit"));
                                    this.reset();
                                    break;
                                case ClientLib.Vis.Mode.ArmySetup:
                                    this.title.setValue(this.tr("Selected army unit"));
                                    this.reset();
                                    break;
                            }
                        }
                    },
                    onSelectionChange: function (oldSelection, newSelection) {
                        if (newSelection !== null) {
                            var name, level;
                            switch (newSelection.get_VisObjectType()) {
                                case ClientLib.Vis.VisObject.EObjectType.CityBuildingType:
                                    this.Selection = newSelection;
                                    name = newSelection.get_BuildingName();
                                    level = newSelection.get_BuildingLevel();
                                    this.txtSelected.setValue(name + " (" + level + ")");
                                    this.txtLevel.setMinimum(level + 1);
                                    this.txtLevel.setMaximum(level + 51);
                                    this.txtLevel.setValue(level + 1);
                                    this.txtLevel.setEnabled(true);
                                    this.btnLevel.setEnabled(true);
                                    this.onInput();
                                    break;
                                case ClientLib.Vis.VisObject.EObjectType.DefenseUnitType:
                                case ClientLib.Vis.VisObject.EObjectType.ArmyUnitType:
                                    this.Selection = newSelection;
                                    name = newSelection.get_UnitName();
                                    level = newSelection.get_UnitLevel();
                                    this.txtSelected.setValue(name + " (" + level + ")");
                                    this.txtLevel.setMinimum(level + 1);
                                    this.txtLevel.setMaximum(level + 51);
                                    this.txtLevel.setValue(level + 1);
                                    this.txtLevel.setEnabled(true);
                                    this.btnLevel.setEnabled(true);
                                    this.onInput();
                                    break;
                            }
                        }
                    },
                    onCurrentCityChange: function (oldCurrentCity, newCurrentCity) {
                        if (oldCurrentCity !== newCurrentCity) {
                            this.reset();
                        }
                    },
                    getResTime: function (need, type) {
                        var CurrentOwnCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                        var Alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
                        need -= CurrentOwnCity.GetResourceCount(type);
                        need = Math.max(0, need);
                        var Con = CurrentOwnCity.GetResourceGrowPerHour(type);
                        var Bonus = CurrentOwnCity.get_hasCooldown() ? 0 : CurrentOwnCity.GetResourceBonusGrowPerHour(type);
                        var POI = CurrentOwnCity.get_IsGhostMode() ? 0 : Alliance.GetPOIBonusFromResourceType(type);
                        return (need <= 0 ? 0 : need / (Con + Bonus + POI) * 3600);
                    },
                    getUpgradeCostsToLevel: function (unit, newLevel) {
                        var costs = null;
                        if (unit !== null && newLevel > 0) {
                            switch (unit.get_VisObjectType()) {
                                case ClientLib.Vis.VisObject.EObjectType.CityBuildingType:
                                    if (newLevel > unit.get_BuildingLevel())
                                        costs = ClientLib.API.City.GetInstance().GetUpgradeCostsForBuildingToLevel(unit.get_BuildingDetails(), newLevel);
                                    break;
                                case ClientLib.Vis.VisObject.EObjectType.DefenseUnitType:
                                    if (newLevel > unit.get_UnitLevel())
                                        costs = ClientLib.API.Defense.GetInstance().GetUpgradeCostsForUnitToLevel(unit.get_UnitDetails(), newLevel);
                                    break;
                                case ClientLib.Vis.VisObject.EObjectType.ArmyUnitType:
                                    if (newLevel > unit.get_UnitLevel())
                                        costs = ClientLib.API.Army.GetInstance().GetUpgradeCostsForUnitToLevel(unit.get_UnitDetails(), newLevel);
                                    break;
                            }
                        }
                        return costs;
                    },
                    reset: function () {
                        this.Selection = null;
                        this.txtSelected.setValue("-");
                        this.txtLevel.setMinimum(0);
                        this.txtLevel.setMaximum(0);
                        this.txtLevel.resetValue();
                        this.txtLevel.setEnabled(false);
                        this.btnLevel.setEnabled(false);
                        this.onInput();
                    },
                    onTick: function () {
                        this.onInput();
                    },
                    onInput: function () {
                        var costs = this.getUpgradeCostsToLevel(this.Selection, parseInt(this.txtLevel.getValue(), 10));
                        if (costs !== null) {
                            for (var i = 0, Tib = 0, Cry = 0, Pow = 0, TibTime = 0, CryTime = 0, PowTime = 0; i < costs.length; i++) {
                                var uCosts = costs[i];
                                switch (parseInt(uCosts.Type, 10)) {
                                    case ClientLib.Base.EResourceType.Tiberium:
                                        Tib += uCosts.Count;
                                        TibTime += this.getResTime(uCosts.Count, ClientLib.Base.EResourceType.Tiberium);
                                        break;
                                    case ClientLib.Base.EResourceType.Crystal:
                                        Cry += uCosts.Count;
                                        CryTime += this.getResTime(uCosts.Count, ClientLib.Base.EResourceType.Crystal);
                                        break;
                                    case ClientLib.Base.EResourceType.Power:
                                        Pow += uCosts.Count;
                                        PowTime += this.getResTime(uCosts.Count, ClientLib.Base.EResourceType.Power);
                                        break;
                                }
                            }
                            this.resTiberium.setLabel(phe.cnc.gui.util.Numbers.formatNumbersCompact(Tib) + (TibTime > 0 ? " @ " + phe.cnc.Util.getTimespanString(TibTime) : ""));
                            this.resTiberium.setToolTipText(phe.cnc.gui.util.Numbers.formatNumbers(Tib));
                            if (Tib === 0) this.resTiberium.exclude();
                            else this.resTiberium.show();
                            this.resChrystal.setLabel(phe.cnc.gui.util.Numbers.formatNumbersCompact(Cry) + (CryTime > 0 ? " @ " + phe.cnc.Util.getTimespanString(CryTime) : ""));
                            this.resChrystal.setToolTipText(phe.cnc.gui.util.Numbers.formatNumbers(Cry));
                            if (Cry === 0) this.resChrystal.exclude();
                            else this.resChrystal.show();
                            this.resPower.setLabel(phe.cnc.gui.util.Numbers.formatNumbersCompact(Pow) + (PowTime > 0 ? " @ " + phe.cnc.Util.getTimespanString(PowTime) : ""));
                            this.resPower.setToolTipText(phe.cnc.gui.util.Numbers.formatNumbers(Pow));
                            if (Pow === 0) this.resPower.exclude();
                            else this.resPower.show();
                        } else {
                            this.resTiberium.setLabel("-");
                            this.resTiberium.resetToolTipText();
                            this.resTiberium.show();
                            this.resChrystal.setLabel("-");
                            this.resChrystal.resetToolTipText();
                            this.resChrystal.show();
                            this.resPower.setLabel("-");
                            this.resPower.resetToolTipText();
                            this.resPower.show();
                        }
                    },
                    onUpgrade: function () {
                        var newLevel = parseInt(this.txtLevel.getValue(), 10);
                        if (newLevel > 0 && this.Selection !== null) {
                            switch (this.Selection.get_VisObjectType()) {
                                case ClientLib.Vis.VisObject.EObjectType.CityBuildingType:
                                    if (newLevel > this.Selection.get_BuildingLevel()) {
                                        ClientLib.API.City.GetInstance().UpgradeBuildingToLevel(this.Selection.get_BuildingDetails(), newLevel);
                                        this.onSelectionChange(null, this.Selection);
                                    }
                                    break;
                                case ClientLib.Vis.VisObject.EObjectType.DefenseUnitType:
                                    if (newLevel > this.Selection.get_UnitLevel()) {
                                        ClientLib.API.Defense.GetInstance().UpgradeUnitToLevel(this.Selection.get_UnitDetails(), newLevel);
                                        this.onSelectionChange(null, this.Selection);
                                    }
                                    break;
                                case ClientLib.Vis.VisObject.EObjectType.ArmyUnitType:
                                    if (newLevel > this.Selection.get_UnitLevel()) {
                                        ClientLib.API.Army.GetInstance().UpgradeUnitToLevel(this.Selection.get_UnitDetails(), newLevel);
                                        this.onSelectionChange(null, this.Selection);
                                    }
                                    break;
                            }
                        }
                    }
                }
            });
            qx.Class.define("Upgrade.Repairtime", {
                extend: qx.ui.container.Composite,
                construct: function () {
                    try {
                        qx.ui.container.Composite.call(this);
                        this.set({
                            layout: new qx.ui.layout.VBox(5),
                            padding: 5,
                            decorator: "pane-light-opaque"
                        });
                        this.add(this.title = new qx.ui.basic.Label(this.tr("tnf:repair points")).set({
                            alignX: "center",
                            font: "font_size_14_bold"
                        }));
                        this.add(this.grid = new qx.ui.container.Composite(new qx.ui.layout.Grid()));

                        this.grid.add(this.basRT = new qx.ui.basic.Atom("", "FactionUI/icons/icon_arsnl_base_buildings.png").set({toolTipText: this.tr("tnf:base")}), {
                            row: 0,
                            column: 0
                        });
                        this.basRT.getChildControl("icon").set({width: 18, height: 18, scale: true, alignY: "middle"});
                        this.grid.add(new qx.ui.basic.Label("").set({alignX: "right", alignY: "middle"}), {
                            row: 0,
                            column: 2
                        });
                        this.grid.add(new qx.ui.basic.Label("").set({alignX: "right", alignY: "middle"}), {
                            row: 0,
                            column: 4
                        });
                        this.grid.add(this.btnBuildings = new qx.ui.form.Button(null, "FactionUI/icons/icon_building_detail_upgrade.png").set({
                            toolTipText: this.tr("tnf:toggle upgrade mode"),
                            width: 25,
                            maxHeight: 17,
                            alignY: "middle",
                            show: "icon",
                            iconPosition: "top",
                            appearance: "button-addpoints"
                        }), {row: 0, column: 6});
                        this.btnBuildings.getChildControl("icon").set({width: 14, height: 14, scale: true});
                        this.btnBuildings.addListener("execute", function () {
                            this.upgradeBuilding(ClientLib.Base.ETechName.Construction_Yard);
                        }, this);

                        this.grid.add(this.infRT = new qx.ui.basic.Atom("", "FactionUI/icons/icon_arsnl_off_squad.png").set({toolTipText: this.tr("tnf:infantry repair title")}), {
                            row: 1,
                            column: 0
                        });
                        this.infRT.getChildControl("icon").set({width: 18, height: 18, scale: true, alignY: "middle"});
                        this.grid.add(new qx.ui.basic.Label("").set({alignX: "right", alignY: "middle"}), {
                            row: 1,
                            column: 2
                        });
                        this.grid.add(new qx.ui.basic.Label("").set({alignX: "right", alignY: "middle"}), {
                            row: 1,
                            column: 4
                        });
                        this.grid.add(this.btnInfantry = new qx.ui.form.Button(null, "FactionUI/icons/icon_building_detail_upgrade.png").set({
                            toolTipText: this.tr("tnf:toggle upgrade mode"),
                            width: 25,
                            maxHeight: 17,
                            alignY: "middle",
                            show: "icon",
                            iconPosition: "top",
                            appearance: "button-addpoints"
                        }), {row: 1, column: 6});
                        this.btnInfantry.getChildControl("icon").set({width: 14, height: 14, scale: true});
                        this.btnInfantry.addListener("execute", function () {
                            this.upgradeBuilding(ClientLib.Base.ETechName.Barracks);
                        }, this);

                        this.grid.add(this.vehRT = new qx.ui.basic.Atom("", "FactionUI/icons/icon_arsnl_off_vehicle.png").set({toolTipText: this.tr("tnf:vehicle repair title")}), {
                            row: 2,
                            column: 0
                        });
                        this.vehRT.getChildControl("icon").set({width: 18, height: 18, scale: true, alignY: "middle"});
                        this.grid.add(new qx.ui.basic.Label("").set({alignX: "right", alignY: "middle"}), {
                            row: 2,
                            column: 2
                        });
                        this.grid.add(new qx.ui.basic.Label("").set({alignX: "right", alignY: "middle"}), {
                            row: 2,
                            column: 4
                        });
                        this.grid.add(this.btnVehicle = new qx.ui.form.Button(null, "FactionUI/icons/icon_building_detail_upgrade.png").set({
                            toolTipText: this.tr("tnf:toggle upgrade mode"),
                            width: 25,
                            maxHeight: 17,
                            alignY: "middle",
                            show: "icon",
                            iconPosition: "top",
                            appearance: "button-addpoints"
                        }), {row: 2, column: 6});
                        this.btnVehicle.getChildControl("icon").set({width: 14, height: 14, scale: true});
                        this.btnVehicle.addListener("execute", function () {
                            this.upgradeBuilding(ClientLib.Base.ETechName.Factory);
                        }, this);

                        this.grid.add(this.airRT = new qx.ui.basic.Atom("", "FactionUI/icons/icon_arsnl_off_plane.png").set({toolTipText: this.tr("tnf:aircraft repair title")}), {
                            row: 3,
                            column: 0
                        });
                        this.airRT.getChildControl("icon").set({width: 18, height: 18, scale: true, alignY: "middle"});
                        this.grid.add(new qx.ui.basic.Label("").set({alignX: "right", alignY: "middle"}), {
                            row: 3,
                            column: 2
                        });
                        this.grid.add(new qx.ui.basic.Label("").set({alignX: "right", alignY: "middle"}), {
                            row: 3,
                            column: 4
                        });
                        this.grid.add(this.btnAircraft = new qx.ui.form.Button(null, "FactionUI/icons/icon_building_detail_upgrade.png").set({
                            toolTipText: this.tr("tnf:toggle upgrade mode"),
                            width: 25,
                            maxHeight: 17,
                            alignY: "middle",
                            show: "icon",
                            iconPosition: "top",
                            appearance: "button-addpoints"
                        }), {row: 3, column: 6});
                        this.btnAircraft.getChildControl("icon").set({width: 14, height: 14, scale: true});
                        this.btnAircraft.addListener("execute", function () {
                            this.upgradeBuilding(ClientLib.Base.ETechName.Airport);
                        }, this);

                        this.grid.getLayout().setRowFlex(0, 0);
                        this.grid.getLayout().setRowFlex(1, 0);
                        this.grid.getLayout().setRowFlex(2, 0);
                        this.grid.getLayout().setRowFlex(3, 0);
                        this.grid.getLayout().setColumnFlex(1, 200);
                        this.grid.getLayout().setColumnFlex(3, 200);
                        this.grid.getLayout().setColumnFlex(5, 200);

                        this.addListener("appear", this.onAppear, this);
                        this.addListener("disappear", this.onDisappear, this);
                    } catch (e) {
                        console.log("Error setting up Upgrade.Repairtime Constructor: ");
                        console.log(e.toString());
                    }
                },
                destruct: function () {
                },
                members: {
                    title: null,
                    grid: null,
                    btnBuildings: null,
                    btnInfantry: null,
                    btnVehicle: null,
                    btnAircraft: null,
                    onAppear: function () {
                        phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, this.onCurrentCityChange);
                        phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentChange", ClientLib.Data.CurrentCityChange, this, this.onCurrentCityChange);
                        phe.cnc.base.Timer.getInstance().addListener("uiTick", this.onTick, this);
                        this.getInfo();
                    },
                    onDisappear: function () {
                        phe.cnc.Util.detachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, this.onCurrentCityChange);
                        phe.cnc.Util.detachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentChange", ClientLib.Data.CurrentCityChange, this, this.onCurrentCityChange);
                        phe.cnc.base.Timer.getInstance().removeListener("uiTick", this.onTick, this);
                    },
                    onTick: function () {
                        this.getInfo();
                    },
                    onCurrentCityChange: function (oldCurrentCity, newCurrentCity) {
                        if (oldCurrentCity !== newCurrentCity) {
                            this.getInfo();
                        }
                    },
                    canUpgradeBuilding: function (ETechName) {
                        var city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                        var building = city.get_CityBuildingsData().GetUniqueBuildingByTechName(ETechName);
                        if (building) {
                            var ResourceRequirements_Obj = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj(building.get_CurrentLevel() + 1, building.get_UnitGameData_Obj());
                            return (building.get_CurrentDamage() === 0 && !city.get_IsLocked() && city.HasEnoughResources(ResourceRequirements_Obj));
                        } else return false;
                    },
                    upgradeBuilding: function (ETechName) {
                        var city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                        var building = city.get_CityBuildingsData().GetUniqueBuildingByTechName(ETechName);
                        if (building) {
                            ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", {
                                cityid: city.get_Id(),
                                posX: building.get_CoordX(),
                                posY: building.get_CoordY()
                            }, null, null, true);
                        }
                    },
                    getInfo: function () {
                        try {
                            var lvl, win, city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();

                            lvl = city.get_CityBuildingsData().GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Construction_Yard).get_CurrentLevel();
                            win = (city.get_CityBuildingsData().GetFullRepairTime(true) - city.get_CityBuildingsData().GetFullRepairTime(false)) * -1;
                            this.grid.getLayout().getCellWidget(0, 0).setLabel("(" + lvl + ")");
                            this.grid.getLayout().getCellWidget(0, 2).setValue(phe.cnc.Util.getTimespanString(city.get_CityBuildingsData().GetFullRepairTime()));
                            this.grid.getLayout().getCellWidget(0, 4).setValue("-" + phe.cnc.Util.getTimespanString(win));

                            if (city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false) > 0) {
                                lvl = city.get_CityBuildingsData().GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Barracks).get_CurrentLevel();
                                win = (city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, true) - city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false)) * -1;
                                this.grid.getLayout().getCellWidget(1, 0).setLabel("(" + lvl + ")");
                                this.grid.getLayout().getCellWidget(1, 2).setValue(phe.cnc.Util.getTimespanString(city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false)));
                                this.grid.getLayout().getCellWidget(1, 4).setValue("-" + phe.cnc.Util.getTimespanString(win));
                                this.grid.getLayout().setRowHeight(1, 18);
                            } else {
                                this.grid.getLayout().setRowHeight(1, 0);
                            }

                            if (city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false) > 0) {
                                lvl = city.get_CityBuildingsData().GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Factory).get_CurrentLevel();
                                win = (city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, true) - city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false)) * -1;
                                this.grid.getLayout().getCellWidget(2, 0).setLabel("(" + lvl + ")");
                                this.grid.getLayout().getCellWidget(2, 2).setValue(phe.cnc.Util.getTimespanString(city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false)));
                                this.grid.getLayout().getCellWidget(2, 4).setValue("-" + phe.cnc.Util.getTimespanString(win));
                                this.grid.getLayout().setRowHeight(2, 18);
                            } else {
                                this.grid.getLayout().setRowHeight(2, 0);
                            }

                            if (city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false) > 0) {
                                lvl = city.get_CityBuildingsData().GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Airport).get_CurrentLevel();
                                win = (city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, true) - city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false)) * -1;
                                this.grid.getLayout().getCellWidget(3, 0).setLabel("(" + lvl + ")");
                                this.grid.getLayout().getCellWidget(3, 2).setValue(phe.cnc.Util.getTimespanString(city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false)));
                                this.grid.getLayout().getCellWidget(3, 4).setValue("-" + phe.cnc.Util.getTimespanString(win));
                                this.grid.getLayout().setRowHeight(3, 18);
                            } else {
                                this.grid.getLayout().setRowHeight(3, 0);
                            }

                            if (this.canUpgradeBuilding(ClientLib.Base.ETechName.Construction_Yard)) this.btnBuildings.setEnabled(true);
                            else this.btnBuildings.setEnabled(false);
                            if (this.canUpgradeBuilding(ClientLib.Base.ETechName.Barracks)) this.btnInfantry.setEnabled(true);
                            else this.btnInfantry.setEnabled(false);
                            if (this.canUpgradeBuilding(ClientLib.Base.ETechName.Factory)) this.btnVehicle.setEnabled(true);
                            else this.btnVehicle.setEnabled(false);
                            if (this.canUpgradeBuilding(ClientLib.Base.ETechName.Airport)) this.btnAircraft.setEnabled(true);
                            else this.btnAircraft.setEnabled(false);
                        } catch (e) {
                            console.log("Error in Upgrade.Repairtime.getInfo: ");
                            console.log(e.toString());
                        }
                    }
                }
            });

        }

        function translation() {
            var localeManager = qx.locale.Manager.getInstance();

            // Default language is english (en)
            // Available Languages are: ar,ce,cs,da,de,en,es,fi,fr,hu,id,it,nb,nl,pl,pt,ro,ru,sk,sv,ta,tr,uk
            // You can send me translations so I can include them in the Script.

            // German
            localeManager.addTranslation("de", {
                "Selected building": "Markiertes Gebäude",
                "All buildings": "Alle Gebäude",
                "Selected defense unit": "Markierte Abwehrstellung",
                "All defense units": "Alle Abwehrstellungen",
                "Selected army unit": "Markierte Armee-Einheit",
                "All army units": "Alle Armee-Einheiten"
            });

            // Hungarian
            localeManager.addTranslation("hu", {
                "Selected building": "Kiválasztott létesítmény",
                "All buildings": "Összes létesítmény",
                "Selected defense unit": "Kiválasztott védelmi egység",
                "All defense units": "Minden védelmi egység",
                "Selected army unit": "Kiválasztott katonai egység",
                "All army units": "Minden katonai egység"
            });

            // Russian
            localeManager.addTranslation("ru", {
                "Selected building": "Вывбранное здание",
                "All buildings": "Все здания",
                "Selected defense unit": "Выбранный оборонный юнит",
                "All defense units": "Все оборонные юниты",
                "Selected army unit": "Выделенный юнит атаки",
                "All army units": "Все юниты атаки"
            });
        }

        function waitForGame() {
            try {
                if (typeof qx !== 'undefined' && typeof qx.core !== 'undfined' && typeof qx.core.Init !== 'undefined') {
                    var app = qx.core.Init.getApplication();
                    if (app.initDone === true) {
                        try {
                            console.log("WarChiefs - Tiberium Alliances Upgrade Base/Defense/Army: Loading");
                            translation();
                            createClasses();
                            Upgrade.getInstance();
                            console.log("WarChiefs - Tiberium Alliances Upgrade Base/Defense/Army: Loaded");
                        } catch (e) {
                            console.log(e);
                        }
                    } else {
                        window.setTimeout(waitForGame, 1000);
                    }
                } else {
                    window.setTimeout(waitForGame, 1000);
                }
            } catch (e) {
                console.log(e);
            }
        }

        window.setTimeout(waitForGame, 1000);
    };

    var scriptBUT = document.createElement("script");
    var txtBUT = ijctFunc.toString();
    scriptBUT.innerHTML = "(" + txtBUT + ")();";
    scriptBUT.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(scriptBUT);
    
//TA Chat Coloriser
  var ta_chat_colorize_main = function ()
  {
    function ta_chat_initialize()
    {
      console.log('-:C&C TA Chat Colorize:- loaded');
      var config = {
        colors: [
          {
            name: 'Leader',
            color: '#ff7878'
          },
          {
            name: 'Second Commander',
            color: '#ca91d4'
          },
          {
            name: 'Officer',
            color: '#fdd94b'
          },
          {
            name: 'Veteran',
            color: '#4ec49f'
          },
          {
            name: 'Member',
            color: '#a5f25b'
          },
          {
            name: 'Newbe',
            color: '#a5f25b'
          },
          {
            name: 'Inactive',
            color: '#ababab'
          }
        ],
        append_alliance_name_limit: 15
      };
      var options = {
        colorize_names: true,
        colorize_comments: false,
        append_abbr: true
      };
      // module functions
      var mod = {
        colorize: function () {
          var css_colors = '';
          var role_colors = [
          ];
          var LibData = ClientLib.Data.MainData.GetInstance().get_Alliance();
          // get correct role id
          var alliance_roles = LibData.get_Roles().d;
          for (var akey in alliance_roles)
          {
            for (var ckey in config.colors)
            {
              if (config.colors[ckey].name == alliance_roles[akey].Name) {
                role_colors[alliance_roles[akey].Id] = config.colors[ckey].color;
              }
            }
          }
          // assign styles to the each player of the current alliance

          var players = LibData.get_MemberDataAsArray();
          for (var pkey in players)
          {
            var current_player = players[pkey];
            if (typeof role_colors[current_player.Role] != 'undefined')
            {
              if (options.colorize_comments) {
                css_colors += '[color="#a5f25b"] #CHAT_SENDER_' + current_player.Name + ',[color="#a5f25b"] #CHAT_SENDER_' + current_player.Name + ' + * {color: ' + role_colors[current_player.Role] + '}';
              } else {
                css_colors += '[color="#a5f25b"] #CHAT_SENDER_' + current_player.Name + ' {color: ' + role_colors[current_player.Role] + '}';
              }
            }
          }
          append_styles(css_colors);
        },
        /**
       * Append the alliance abbreviation to the player's name
       * @example der_flake -> #RoF der_flake
       */
        add_abbr: function () {
          //get top [append_alliance_name_limit] alliances by rating
          ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand('RankingGetData', {
            firstIndex: 0,
            lastIndex: config.append_alliance_name_limit - 1,
            view: 1,
            rankingType: 0,
            sortColumn: 2,
            ascending: true
          }, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, function (context, data) {
            if (data !== null)
            {
              for (var i = 0; i < data.a.length; i++)
              {
                var alliance_id = data.a[i]['a'];
                // get alliance players
                ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand('GetPublicAllianceInfo', {
                  id: alliance_id
                }, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, function (context, alliance_data) {
                  var alliance_shortname = alliance_data['a'],
                  alliance_players = alliance_data['m'],
                  css_names = [
                  ];
                  for (var akey in alliance_players)
                  {
                    css_names.push('[color="#4becff"] #CHAT_SENDER_' + alliance_players[akey]['n'] + ':after');
                  }
                  var temp_css = css_names.join(',') + ' {content: " #' + alliance_shortname + '";opacity: .6;font-size: 11px;}';
                  append_styles(temp_css);
                }), null);
              }
            }
          }), null);
        }
      };
      if (options.colorize_names) {
        mod.colorize();
      }
      if (options.append_abbr)
      {
        mod.add_abbr();
      }
    }
    function append_styles(css) {
      document.getElementsByTagName('style') [0].innerHTML += css;
    }
    function tachat_checkIfLoaded() {
      try {
        if (typeof qx != 'undefined') {
          if (qx.core.Init.getApplication() && qx.core.Init.getApplication().getMenuBar()) {
            // @TODO try to find other method to make ClientLib "WORKABLE"
            window.setTimeout(ta_chat_initialize, 15000);
          } else
          window.setTimeout(tachat_checkIfLoaded, 1000);
        } else {
          window.setTimeout(tachat_checkIfLoaded, 1000);
        }
      } catch (e) {
        console.log('tachat_checkIfLoaded: ', e);
      }
    }
    if (/commandandconquer\.com/i.test(document.domain)) {
      window.setTimeout(tachat_checkIfLoaded, 1000);
    }
  };
  var tachatScript = document.createElement('script');
  tachatScript.innerHTML = '(' + ta_chat_colorize_main.toString() + ')();';
  tachatScript.type = 'text/javascript';
  if (/commandandconquer\.com/i.test(document.domain)) {
    document.getElementsByTagName('head') [0].appendChild(tachatScript);
  }

// TA Alliance Member Online - DTeCH
        var AllianceMemberOnline0 = function () {
            // create the main class
            function createClass() {
                console.log("Starting creation of classes");
                // define the memberoverview class
                qx.Class.define("AllianceMemberOnline.Main",
                    {
                        type: "singleton",
                        extend: qx.core.Object,

                        // constructor of the class
                        construct: function () {
                            try {
                                console.log("Initializing AllianceMemberOnlineButton Button");
                                var AllianceMemberOnlineButton = new qx.ui.form.Button("Alliance Overview");
                                AllianceMemberOnlineButton.set(
                                    {
                                        alignY: "middle",
                                        width: 120,
                                        toolTipText: "open AllianceMemberOnline window",
                                        appearance: "button-text-small"
                                    });

                                AllianceMemberOnlineButton.addListener("execute", this.__openAllianceMemberOnlineWindow, this);

                                console.log("Adding AllianceMemberOnlineButton to view");
                                var app = qx.core.Init.getApplication();
                                app.getDesktop().add(AllianceMemberOnlineButton,
                                    {
                                        bottom: 0,
                                        right: 120
                                    });

                                //    var AllianceMemberOnlineWindow = AllianceMemberOnline.Window.getInstance();
                                //    AllianceMemberOnlineWindow.open();
                            }
                            catch (e) {
                                console.log("Failed to initialize AllianceMemberOnline: ", e);
                            }
                            console.log("AllianceMemberOnline loaded");
                        },

                        // destructor of the class
                        destruct: function () {
                        },

                        members: {
                            // Method to show the window
                            __openAllianceMemberOnlineWindow: function () {
                                var AllianceMemberOnlineWindow = AllianceMemberOnline.Window.getInstance();

                                if (AllianceMemberOnlineWindow.isVisible()) {
                                    console.log("closing AllianceMemberOnlineWindow");
                                    AllianceMemberOnlineWindow.close();
                                }
                                else {
                                    console.log("opening AllianceMemberOnlineWindow");
                                    AllianceMemberOnlineWindow.open();
                                }
                            }
                        }
                    });

                qx.Class.define("AllianceMemberOnline.Window",
                    {
                        type: "singleton",
                        extend: qx.ui.window.Window,

                        // constructor of the class
                        construct: function () {
                            try {
                                console.log("Creating AllianceMemberOnline.Window");
                                this.base(arguments);
                                this.setLayout(new qx.ui.layout.Canvas());

                                this.set(
                                    {
                                        width: 150,
                                        caption: "Online Members",
                                        allowMaximize: false,
                                        showMaximize: false,
                                        allowMinimize: false,
                                        showMinimize: false,
                                        resizable: true
                                    });

                                this.model = new qx.ui.table.model.Simple();
                                this.model.setColumns(["Role", "Name", "OnlineState", "RoleText"]);
                                this.model.sortByColumn(1, true);
                                this.list = new qx.ui.table.Table(this.model);
                                this.list.setColumnVisibilityButtonVisible(false);
                                this.list.setColumnWidth(0, 0);
                                this.list.setColumnWidth(1, 130);
                                this.list.setColumnWidth(2, 0);
                                this.list.setColumnWidth(3, 0);
                                this.list.set({width: 130, minHeight: 250});
                                var tModel = this.list.getTableColumnModel();
                                tModel.setColumnVisible(0, false);
                                tModel.setColumnVisible(2, false);
                                tModel.setColumnVisible(3, false);
                                this.list.setStatusBarVisible(false);
                                this.add(this.list, {
                                    bottom: 0,
                                    left: 0
                                });

                                this.list.addListener("mousemove", function (e) {
                                    var cell = this.getCellUnderMouse(this.list, e);
                                    var row = cell.row;
                                    var col = cell.col;
                                    if ((row >= 0) && (col >= 0)) {
                                        if ((this._curTtRow != row) || (this._curTtCol != col)) {
                                            this.list.setToolTipText("");
                                            var ttManager = qx.ui.tooltip.Manager.getInstance();
                                            ttManager.resetCurrent();
                                            var ttText = this._onGetToolTipText(this.list, row, col);
                                            if (ttText && (ttText !== "")) {
                                                this.list.setToolTipText(ttText);
                                                ttManager.showToolTip(this.list);
                                            }
                                        }
                                    }
                                    else {
                                        if ((this._curTtRow >= 0) && (this._curTtCol >= 0)) {
                                            this.list.setToolTipText("");
                                            var ttManager = qx.ui.tooltip.Manager.getInstance();
                                            ttManager.resetCurrent();
                                        }
                                    }
                                    this._curTtRow = row;
                                    this._curTtCol = col;
                                }, this);

                                try {
                                    var timer = qx.util.TimerManager.getInstance();
                                }
                                catch (e) {
                                    console.log("Failed to get timer");
                                    throw e;
                                }
                                timer.start(function () {
                                        console.log("Timer function running");
                                        // example getting player title icon
                                        // console.log(ClientLib.Data.MainData.GetInstance().get_Player().get_TitleIcon());
                                        console.log("Getting Members and members count");
                                        var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
                                        alliance.RefreshMemberData();
                                        var members = alliance.get_MemberDataAsArray();

                                        console.log("Creating model");
                                        var rowArr = [];

                                        var iCounter = 0;
                                        for (i = 0; i < alliance.get_NumMembers(); i++) {
                                            var member = members[i];
                                            var name = member.Name;
                                            if (member.OnlineState == ClientLib.Data.EMemberOnlineState.Away)
                                                name = "AFK > " + name;
                                            if (member.OnlineState == ClientLib.Data.EMemberOnlineState.Online || member.OnlineState == ClientLib.Data.EMemberOnlineState.Away) {

                                                //   var name = member.Name;
                                                rowArr.push([member.Role, name, member.OnlineState, member.RoleName]);
                                                console.log(member.Role + " - " + member.Name);
                                                console.log("AllianceMemberOnlineView: " + member.Name + " - " + member.OnlineState);
                                                iCounter++;
                                            }
                                        }

                                        this.model.removeRows(0, this.model.getRowCount(), true);
                                        this.model.setData(rowArr);
                                        this.model.sortByColumn(0, true);
                                    },
                                    5000,
                                    this,
                                    null,
                                    1000);
                            }
                            catch (e) {
                                console.log("Failed to initialize AllianceMemberOnline.Window");
                                console.log(e);
                            }
                            console.log("AllianceMemberOnline loaded");
                        },

                        // destructor of the class
                        destruct: function () {
                        },

                        members: {
                            model: null,
                            list: null,

                            getCellUnderMouse: function (table, mouseEvent) {
                                var row = -1, col = -1;
                                if (table && mouseEvent) {
                                    var pageX = mouseEvent.getDocumentLeft();
                                    var pageY = mouseEvent.getDocumentTop();
                                    var sc = table.getTablePaneScrollerAtPageX(pageX);
                                    if (sc) {
                                        row = sc._getRowForPagePos(pageX, pageY);
                                        col = sc._getColumnForPageX(pageX);
                                        if ((row === null) || (row === undefined)) {
                                            row = -1;
                                        }
                                        if ((col === null) || (col === undefined)) {
                                            col = -1;
                                        }
                                    }
                                }
                                return ({"row": row, "col": col});
                            },

                            _onGetToolTipText: function (table, row, col) {
                                //  console.log(this.model.getValue(3, row));
                                return this.model.getValue(3, row);
                            }
                        }
                    });
            }


            // **************************************************************
            // Main Initialization
            function AllianceMemberOnline_checkIfLoaded() {
                try {
                    if (typeof qx != 'undefined' && qx.core.Init.getApplication() && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION) && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION).isVisible()) {
                        createClass();
                        window.AllianceMemberOnline.Main.getInstance();
                    } else {
                        window.setTimeout(AllianceMemberOnline_checkIfLoaded, 1000);
                    }
                } catch (e) {
                    console.log("AllianceMemberOnline_checkIfLoaded: ", e);
                }
            }

            if (/commandandconquer\.com/i.test(document.domain)) {
                window.setTimeout(AllianceMemberOnline_checkIfLoaded, 1000);
            }
        };

        try {
            var scriptAMO0 = document.createElement("script");
            scriptAMO0.innerHTML = "(" + AllianceMemberOnline0.toString() + ")();";
            scriptAMO0.type = "text/javascript";
            if (/commandandconquer\.com/i.test(document.domain)) {
                document.getElementsByTagName("head")[0].appendChild(scriptAMO0);
            }
        }
        catch (e) {
            console.log("AllianceMemberOnline init error: ", e);
        }
    })();
} catch (e) {
    console.log("TA Script Bug-Fixes Pack: ", e);
}

