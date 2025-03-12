/* global QUnit */
// https://api.qunitjs.com/config/autostart/
QUnit.config.autostart = false;

sap.ui.require([
	"z_hrms_portal/test/unit/AllTests"
], function (Controller) {
	"use strict";
	QUnit.start();
});