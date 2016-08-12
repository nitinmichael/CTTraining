/*
 *  module.js
 *
 *  Copyright (c) 2015 by General Electric Company. All rights reserved.
 *
 *  The copyright to the computer software herein is the property of
 *  General Electric Company. The software may be used and/or copied only
 *  with the written permission of General Electric Company or in accordance
 *  with the terms and conditions stipulated in the agreement/contract
 *  under which the software has been supplied.
 */

/**
 * A module config file to load case creation related files.
 */
define(['angular', 'postal', 'angular-ui',
    '../../widgets/ge-control-group/ge-control-group-directive',
    '../../widgets/typeahead-input/typeahead-input-directive',
    '../../widgets/message-field/message-field-directive',
    '../../widgets/ge-patient-list/ge-patient-list-directive',
    '../../widgets/ge-attachment-list/ge-attachment-list-directive',
    '../../widgets/ge-progress-bar/ge-progress-bar-directive',
    './services/create-case-marshaller-service',
    './services/create-case-service',
    './services/pacs-search-marshaller-service',
    './services/file-upload-service',
    './services/file-upload-service',
    './services/pacs-search-service',
    './services/study-list-service',
    './services/selected-study-list-service',
    './services/get-clinical-reasons-service',
    './services/get-billing-organizations-service'], function (ng) {
    'use strict';

    // Create case module
    var createcase = ng.module('cloudav.caseExchange.createCase', []);

    // TODO: Create case related sub modules and routes should be configured here

    return createcase;
});