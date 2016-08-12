/*
 *  create-case-controller.js
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
 * A Create Case controller to handle case creation operations.
 */
define(['angular', 'postal',
    '../../../module',
    '../services/create-case-data-service'], function (ng) {
    'use strict';

    // Module dependencies
    var dependencies = [
        'Directive.typeaheadInput',
        'Directives.geControlGroup',
        'ui.bootstrap',
        'Services.createCaseMarshallerService',
        'Services.createCaseService',
        'Directive.messageField',
        'Services.fileUploadService',
        'Services.selectedStudyListService',
        'Directive.geAttachmentList',
        'Services.pacsSearchService',
        'Services.createCaseDataService',
        'Services.caseExchangeDataService',
        'CaseDataSvc',
        'Services.clinicalReasonsService',
        'Services.getBillingOrganizationsService'
    ];

    var createcase = ng.module('cloudav.caseExchange.createCaseCtrl', dependencies);

    /**
     * Converts the first letter of word to uppercase
     */
    createcase.filter('capitalize', function () {
        return function (input) {
            if (input) {
                return input[0].toUpperCase() + input.slice(1);
            }
        };
    });

    /**
     * Converts the given number from byte to MB and concatenates the 'MB' unit to it
     */
    createcase.filter('byteToMB', function () {
        return function (input) {
            if (input) {
                return (input / ( 1024 * 1024)).toFixed(2) + ' MB';
            }
        };
    });

    createcase.controller('CreateCaseCtrl', ['$scope', '$state', '$stateParams', '$timeout', '$log',
        '$location', '$filter', 'CreateCaseMarshallerService', 'CreateCaseService', 'FileUploadService', 'SelectedStudyListService',
        'PacsSearchService', 'CaseDataService', 'CreateCaseDataService', 'CaseExchangeDataService', 'ClinicalReasonsService', 'GetBillingOrganizationsService',
        function ($scope, $state, $stateParams, $timeout, $log, $location, $filter, CreateCaseMarshallerService, CreateCaseService, FileUploadService, SelectedStudyListService,
                  PacsSearchService, CaseDataService, CreateCaseDataService, caseExchangeDataService, clinicalReasonsService, getBillingOrganizationsService) {

            // Switch for creating or updating case
            $scope.mode = $state.current.params.mode;

            // Mock service URL to load JSON file to retrieve users
            $scope.usersURL = caseExchangeDataService.getServiceURL() + "/userregistry/v2/user/_search";

            // Container for all form data
            $scope.formData = {};

            // Array of Clinical Reasons filled with API response
            $scope.clinicalReasons = [];

            // Value to be updated on the selection of dropdown box
            $scope.formData.clinicalReason = null;

            // Show already attached files
            $scope.showAttachedFiles = false;

            // List of added recipients will be pushed into this array
            $scope.addedRecipients = [];

            // Boolean to verify recipients added or not
            $scope.noRecipientsAdded = false;

            // Boolean to verify case message added or not
            $scope.noMessageAdded = false;

            // List of attached files
            $scope.fileList = [];

            // List of existing patient studies
            $scope.existingListItems = [];

            // List of already attached files
            $scope.attachedFileList = [];

            // Current case priority
            $scope.casePriority = "NORMAL";

            // Gets case update type to filter page and enable specific operation as per type
            $scope.caseUpdateType = caseExchangeDataService.getCaseUpdateType();

            // Hides the More Details link
            $scope.hideLink = true;

            // Boolean determining whether or not the current user is a patient
            $scope.isCurrentUserPatient = false;

            if(!caseExchangeDataService.getCurrentUser()){
                caseExchangeDataService.queryCurrentUser().then(function(currentUser){
                    caseExchangeDataService.setCurrentUser(currentUser);
                    // Checks if logged in user is Patient
                    $scope.isCurrentUserPatient = currentUser.isPatient();
                });
            } else {
                // Checks if logged in user is Patient
                $scope.isCurrentUserPatient = caseExchangeDataService.getCurrentUser().isPatient();
            }

            // Logic for populating Priority Dropdown
            if ($scope.mode === 'CREATE') {
                $scope.priorityOptions = [{
                    name: $filter("translate")('createcase.selectPriority'),
                    value: 'NORMAL'
                }, {
                    name: $filter("translate")('createcase.normal'),
                    value: 'NORMAL'
                }, {
                    name: $filter("translate")('createcase.high'),
                    value: 'HIGH',
                    icon: true
                }];
            }
            else{
                // Remove 'LOW' condition once 'LOW' is completely removed from backend
                if (caseExchangeDataService.getSelectedCaseData().priority === 'NORMAL'
                 || caseExchangeDataService.getSelectedCaseData().priority === 'LOW'){
                    $scope.priorityOptions = [{
                        name: $filter("translate")('createcase.normalPriority'),
                        value: 'NORMAL'
                    }, {
                        name: $filter("translate")('createcase.setAsHigh'),
                        value: 'HIGH',
                        icon: true
                    }];
                }
                else{
                    $scope.priorityOptions = [{
                        name: $filter("translate")('createcase.highPriority'),
                        value: 'HIGH',
                        icon: true
                    }, {
                        name: $filter("translate")('createcase.setAsNormal'),
                        value: 'NORMAL'
                    }];
                }
            }

            if (!$scope.formData.priority){
                $scope.formData.priority = $scope.priorityOptions[0];
            }

            var sizeLimit = (1024 * 1024 * 100);

            var sumSizeLimit = (1024 * 1024 * 200);

            var allowedExtensions = [
                "pdf", "doc", "docx", "xls", "xlsx", "csv", "rtf", "tiff", "tif", "txt", "bmp", "jpeg", "jpg", "ppt", "pptx", "dcm", "xml", "mp4", "mov"
            ];

            // The id defined in DB for Clinical Reason Other
            // Note:: Need to update the value if DB value changes
            $scope.clinicalReasonOtherId = '9';

            /**
             * Attachment types.
             * Possible values:
             *  1) DocumentReference: Non-Dicom files
             *  2) ImagingStudy: DICOM studies
             */
            var ATTACHMENT_TYPES = {
                document: 'DocumentReference',
                image: 'ImagingStudy'
            };

            function collectAttachments(data) {
                _.each(data.transactions, function (transaction) {
                    _.each(transaction.attachments, function (attachment) {
                       if (attachment.type === ATTACHMENT_TYPES.document) {
                            $scope.attachedFileList.push({
                                name: attachment.description,
                                lastModifiedDate: typeof(attachment.created) === 'string' ? caseExchangeDataService.convertToDate(attachment.created): attachment.created
                            });
                        }
                    });
                });
            }

            /**
             * Cancels case creation and routes to case inbox
             */
            $scope.cancelCreateCase = function () {
                SelectedStudyListService.clearSelectedPatient();
                PacsSearchService.clearPacsSearchParams();
                CreateCaseDataService.clearCreateCaseData();
                caseExchangeDataService.resetSelectedCaseData();
                caseExchangeDataService.resetCaseUpdateType();
                $state.transitionTo($stateParams.redirectTo, {id : $stateParams.id});
            };

            function addIdToFiles(transaction, fileList){
                var filesWithId = [];
                _.each(transaction.attachments, function(attachment) {
                    if( attachment.type === ATTACHMENT_TYPES.document && 'identifier' in attachment ) {
                        var file = _.find(fileList, function(file){ return attachment.description === file.name; });
                        file.uuid = attachment.identifier;
                        filesWithId.push(file);
                    }
                });
                return filesWithId;
            }

            function uploadFiles(caseId, transaction) {
                var filesToUpload = addIdToFiles(transaction, $scope.fileList);
                FileUploadService.doUploadFiles(caseId, filesToUpload,
                    function () {
                        console.log('File sending to BLOB store was successful.');
                    },
                    function () {
                        console.log('File sending to BLOB store was un-successful.');
                        // Make API call to update attachment status update
                        if(filesToUpload && filesToUpload.length > 0){
                            for(var i= 0, iEnd = filesToUpload.length; i<iEnd; i++){
                                CreateCaseService.updateUploadStatus(caseId, filesToUpload[i].uuid, CreateCaseMarshallerService.marshalAttachmentUploadStatus());
                            }
                        }

                    });
            }

            /**
             * Upload the studies on dicom devices
             */
            function uploadStudies(transactions, caseId){
                // Makes a call to case method and retrieve the case object with attached studies
                var caseAttachmentData = CreateCaseMarshallerService.marshallDicomAttachment(transactions);

                // Makes a call to Create case service to POST case attachment to upload the case on pacs
                CreateCaseService.uploadCaseAttachment(caseAttachmentData, caseId);
            }

            /**
             * Creates case and redirects to case inbox
             */
            var createCase = function () {
                if ($scope.createCaseForm.$valid && $scope.addedRecipients.length > 0) {

                    // Makes a call to Create case method and retrieve the case object
                    var caseData = CreateCaseMarshallerService.marshalCreateCase($scope.formData);

                    // Makes a call to Case transaction method and retrieve the case transaction object
                    var caseTransaction = CreateCaseMarshallerService.marshalCaseTransaction($scope.formData.caseMessage, $scope.patientData, $scope.selectedListItems, $scope.caseUpdateType, $scope.formData.priority.value);

                    // Adds the case transaction in Create case object
                    caseData.transaction = caseTransaction;

                    // Adds the participants/recipients in Case transaction object
                    for (var i = 0, iEnd = $scope.addedRecipients.length; i < iEnd; i++) {
                        caseData.transaction.addedParticipants.push(CreateCaseMarshallerService.marshalParticipants($scope.addedRecipients[i]));
                    }

                    _.forEach($scope.fileList, function (file) {
                        caseData.transaction.attachments.push(CreateCaseMarshallerService.marshalFileAttachment(file));
                    });

                    // Makes a call to Create case service to POST case data to create a case
                    CreateCaseService.createCase(caseData).then(function (responseData){
                        if ($scope.fileList.length && 'id' in responseData && 'transactions' in responseData && responseData.transactions.length === 1) {
                            uploadFiles(responseData.id, responseData.transactions[0]);
                        }
                        if($scope.patientData && $scope.selectedListItems.length){
                            uploadStudies(responseData.transactions, responseData.id);
                        }
                        $scope.showAlertMessage($filter('translate')('createcase.inProgress'), $scope.alertTypes.success);
                        $state.transitionTo('caseexchange.caseinbox', {id : $stateParams.id});
                    }, function () {
                        $scope.showAlertMessage($filter('translate')('common.genericError'), $scope.alertTypes.error);
                    });


                }
                else {
                    if (($scope.formData.caseMessage && $scope.formData.caseMessage === '') || !$scope.formData.caseMessage) {
                        $scope.noMessageAdded = true;
                    }
                    if ($scope.addedRecipients.length === 0) {
                        $scope.noRecipientsAdded = true;
                    }
                }
            };

            /**
             * Function to validate the user input for Add Users screen.
             * @returns
             *  boolean: true in case of validation passed, else false.
             */
            function validateAddUsersFormCustomFields(validateRecipients){
                var isValid = true;
                // Check at-least recipient is present in case of Add users.
                if(validateRecipients && $scope.addedRecipients.length === 0){
                    $scope.noRecipientsAdded = true;
                    isValid = false;
                }

                if(!$scope.formData.caseMessage){
                    $scope.noMessageAdded = true;
                    isValid = false;
                }
                return isValid;
            }

            /**
             * Updates case and redirects to case inbox
             * Possible entry points for the method:
             *  1) Add to case
             *  2) Add Users
             */
            var updateCase = function () {
                /**
                 * Perform validation for add users / add to case form.
                 * Check for valid recipients only in a case of add users
                 * If fails, then simply return the control from here.
                 */
                var validateRecipients = $scope.caseUpdateType === 'ADDUSERS';
                if(!validateAddUsersFormCustomFields(validateRecipients)){
                    return;
                }

                // Check if form is in valid state, then only allows the form to submit.
                if ($scope.createCaseForm.$valid) {

                    // Makes a call to Case transaction method and retrieve the case transaction object
                    var caseTransaction = CreateCaseMarshallerService.marshalCaseTransaction($scope.formData.caseMessage, $scope.patientData, $scope.selectedListItems, $scope.caseUpdateType, $scope.formData.priority.value);

                    // Adds the participants/recipients in Case transaction object
                    for (var i = 0, iEnd = $scope.addedRecipients.length; i < iEnd; i++) {
                        caseTransaction.addedParticipants.push(CreateCaseMarshallerService.marshalParticipants($scope.addedRecipients[i]));
                    }

                    _.forEach($scope.fileList, function (file) {
                        caseTransaction.attachments.push(CreateCaseMarshallerService.marshalFileAttachment(file));
                    });

                    // Makes a call to Create case service to POST transaction data to create a transaction
                    CreateCaseService.createTransaction(caseTransaction, caseExchangeDataService.getSelectedCaseData().id).then(function (transaction) {
                        // Only upload the attachments in Add to case scenario.
                        if ($scope.caseUpdateType === 'ADDCASE' && $scope.fileList.length && angular.isObject(transaction)) {
                            uploadFiles(caseExchangeDataService.getSelectedCaseData().id, transaction);
                        }

                        if($scope.patientData && $scope.selectedListItems.length){
                            uploadStudies([transaction], caseExchangeDataService.getSelectedCaseData().id);
                        }

                        var successMsg = $scope.caseUpdateType === 'ADDUSERS' ? 'addUsers.caseShareSuccessMsg' : 'addToCase.successMessage';
                        $scope.showAlertMessage($filter('translate')(successMsg), $scope.alertTypes.success);
                        // Redirects to passed state
                        $state.transitionTo($stateParams.redirectTo, {id : $stateParams.id});
                        // Resets case update type
                        caseExchangeDataService.resetCaseUpdateType();
                    }, function () {
                        $scope.showAlertMessage($filter('translate')('common.genericError'), $scope.alertTypes.error);
                    });
                }
            };

            /**
             * Creates or updates the case.
             */
            $scope.submitCase = function (mode) {
                if (mode === 'CREATE') {
                    createCase();
                } else {
                    updateCase();
                }
            };

            /**
             * Triggering File Input click event on 'Files (PDF ...)' link click
             * to browse non-dcm files
             */
            $scope.browseFiles = function () {
                $timeout(function () {
                    $(document.querySelector('#fileInput')).click();
                }, 100);
            };

            /**
             * Triggering Folder Input click event on 'Imaging From CD/DVD/Local File System' link click
             * to browse DICOM files
             */
            $scope.browseFolders = function () {
                $timeout(function () {
                    $(document.querySelector('#folderInput')).click();
                }, 100);
            };

            /**
             * converts file list to an array, what is sorted by filename
             * @param files
             * @returns {Array}
             */
            function convertFileListToSortedByNameArray(files) {
                var fileArray = [];

                _.each(files, function (file) {
                    fileArray.push(file);
                });

                fileArray.sort(function (a, b) {
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    }

                    return 0;
                });
                return fileArray;
            }

            /**
             * Adds the selected files to the attachment list after validation
             * @param files
             */
            $scope.addFiles = function (files) {
                var fileValidationErrors = [];
                var sumSizeLimitReached = false;

                var fileArray = convertFileListToSortedByNameArray(files);
                //deep clone of scope.fileList
                var alreadySelectedFileList = _.clone($scope.fileList);
                for (var i = 0; i < fileArray.length; i++) {
                    var file = fileArray[i];
                    var isFileListSizeUnderLimit = FileUploadService.isFileListSizeUnderLimit(alreadySelectedFileList, fileArray, sumSizeLimit);
                    var isValidSize = FileUploadService.isFileSizeUnderLimit(file, sizeLimit);
                    var isValidExtensions = FileUploadService.isFileExtensionValid(file, allowedExtensions);
                    var alreadyExistingFileName = (FileUploadService.isFileNameAlreadyExistInList(file, $scope.fileList)
                        || FileUploadService.isFileNameAlreadyExistInList(file, $scope.attachedFileList));
                    //summarized file size limit has the highest priority
                    if (!isFileListSizeUnderLimit) {
                        sumSizeLimitReached = true;
                        break;
                    }
                    else if (!isValidSize || !isValidExtensions || alreadyExistingFileName) {
                        fileValidationErrors.push({
                            file: file,
                            invalidSize: !isValidSize,
                            invalidExtension: !isValidExtensions,
                            duplicatedName: alreadyExistingFileName,
                            sizeLimit: sizeLimit
                        });
                    } else {
                        $scope.fileList.push(file);
                    }
                }

                $scope.handleFileValidationErrors(fileValidationErrors, sumSizeLimitReached);

                $scope.$apply();

                angular.element(document.querySelector('#fileInput'))[0].value = null;
            };

            /**
             *  convert file validation errors to messages and show that message
             * @param errors
             */
            $scope.handleFileValidationErrors = function (errors, sumSizeLimitReached) {
                var msg = FileUploadService.convertFileValidationErrorsToErrorMessages(errors, sumSizeLimitReached, sizeLimit, sumSizeLimit);
                if (msg && msg !== "") {
                    $scope.showAlertMessage(msg, $scope.alertTypes.error);
                }
            };

            /**
             * Concatenate patient first name, middle name, last name for display purpose only
             */
            $scope.updatedPatientName = function (patient) {
                var patientName = "";
                if (patient && patient.name) {
                    patientName = $filter('name')(patient.name);
                }
                return patientName;
            };

            /**
             * Loading Selected Patient details on intializatio of controller after selecting Studies
             */
            $scope.patientData = SelectedStudyListService.getSelectedPatient();

            /**
             * Loading Selected Patient Studies on intializatio of controller after selecting Studies
             */
            $scope.selectedListItems = SelectedStudyListService.getList();

            /**
             * Callback function to Check if study length is 0 then remove the patient
             * banner
             */
            $scope.checkStudyLength = function () {
                if($scope.patientData && $scope.selectedListItems.length === 0 && $scope.existingListItems.length === 0){
                    if ($scope.formData.subjectInput === $filter('name')($scope.patientData.name)) {
                        $scope.formData.subjectInput = "";
                    }
                    SelectedStudyListService.clearSelectedPatient();
                    PacsSearchService.clearPacsSearchParams();
                    $scope.patientData = null;
                }
            };

            /**
             * displays/hide the existing attachments if available
             * with the case
             *
             */
            $scope.toggleShowAttachedFiles = function () {
                $scope.showAttachedFiles = !$scope.showAttachedFiles;
            };

            /**
             * Function to navigate to PACS Query search screen
             * User entered data for create case screen will be stored in a factory before navigating.
             *
             * @params:
             *    $event: Click event object
             */
            $scope.navigateToPacsQuery = function ($event) {
                var data = $scope.formData;
                data.addedRecipients = $scope.addedRecipients;
                // Assign selected non-dicom files to data cache, so that it can be re-assign later on.
                data.fileList = $scope.fileList;
                CreateCaseDataService.setCreateCaseData(data);
                var pacsSearchData=PacsSearchService.getPacsSearchParams();
                if(pacsSearchData.dicomDevices){
                    pacsSearchData.dicomDevices=[];
                }
                $state.transitionTo('caseexchange.pacsquery', {id : $stateParams.id});
                $event.preventDefault();
            };

            /**
             * Updates case suject if patient data available
             */
            function updateCaseSubject() {
                // If there is a patient selected already, then, replace the subject field value with patient name
                if ($scope.patientData && !$scope.formData.subjectInput && $scope.patientData.name) {
                    $scope.formData.subjectInput = $filter('name')($scope.patientData.name);
                }
            };

            /**
             * Parses the transactions
             * @param data
             */
            function parseTransactions(data) {
                var transactionLength = data.transactions ? data.transactions.length : 0;
                for (var t = 0, tEnd = transactionLength; t < tEnd; t++) {
                    var attachmentLength = data.transactions[t].attachments ? data.transactions[t].attachments.length : 0;
                    for (var a = 0, aEnd = attachmentLength; a < aEnd; a++) {
                        var dicomAttachment = data.transactions[t].attachments[a];
                        if (dicomAttachment.type === ATTACHMENT_TYPES.image && !checkExistingDicomAttachment(dicomAttachment.uid)) {
                            /**
                             * This is to display the date in correct format.
                             */
                            dicomAttachment.started = typeof(dicomAttachment.started) === 'string' ? caseExchangeDataService.convertToDate(dicomAttachment.started): dicomAttachment.started;
                            $scope.existingListItems.push(dicomAttachment);
                        }
                    }
                }

                /**
                 * Set the existing studies to selected Patient object
                 * So, that it can be retrieve on PACS Search w/f.
                 */
                if($scope.existingListItems.length) {
                    var selectedPatient = SelectedStudyListService.getSelectedPatient();
                    selectedPatient.existingStudies = $scope.existingListItems;
                    SelectedStudyListService.setSelectedPatient(selectedPatient);
                }
            }

            /**
             * Makes an API call to retrieve Clinical Reasons and populate Dropdown box
             */
            function populateClinicalReasons() {
                clinicalReasonsService.getClinicalReasons().then(function (response) {
                    if (response && response instanceof Array) {
                        $scope.clinicalReasons = response;
                    }
                }, function () {
                    $scope.showAlertMessage($filter('translate')('common.genericError'), $scope.alertTypes.error);
                    $state.transitionTo('caseexchange.caseinbox', {id: $stateParams.id});
                });
            };

            /**
             * Makes an API call to retrieve Billing Organizations and populate Dropdown box
             */
            function populateBillingOrganizations(){
                var params = {
                    role: "administrator",
                    level: {
                        value: "2"
                    }
                };

                getBillingOrganizationsService.getOrganizationsForLoggedInUser(params).then(function(data){
                    $scope.billingOrganizationList = _.map(data.role, function(val){
                        return val.scopingOrganization;
                    });

                    //redirect to Case Inbox if no organization is present
                    if($scope.billingOrganizationList.length < 1){
                        redirectToCaseInbox();
                    }

                    //If only 1 organization is present,then select that organization
                    if($scope.billingOrganizationList.length === 1){
                        $scope.selectedBillingOrganization = $scope.billingOrganizationList[0];
                    }
                }, function(){
                    redirectToCaseInbox();
                });
            };

            /**
             * Function to redirect to case inbox
             */
            function redirectToCaseInbox() {
                $state.transitionTo('caseexchange.caseinbox', {
                    id: $stateParams.id
                });
                $scope.showAlertMessage($filter('translate')('createcase.noOrganizationWarning'), $scope.alertTypes.error);
            }

            /**
             * Function to be called on initialization of a controller
             */
            function init() {
                if ($scope.mode === 'UPDATE') {
                    var caseDetails = caseExchangeDataService.getSelectedCaseData();
                    if ($scope.caseUpdateType === 'ADDCASE' && caseDetails.patient) {
                        var selectedCase = {};
                        selectedCase.patient = {
                            identifier: caseDetails.patient.identifier,
                            name: {
                                family: caseDetails.patient.name.family,
                                given: caseDetails.patient.name.given
                            },
                            birthDate: caseDetails.patient.birthDate,
                            gender: caseDetails.patient.gender,
                            studyList: [],
                            existingStudies: []
                        };

                        SelectedStudyListService.setSelectedPatient(selectedCase.patient);
                        $scope.patientData = angular.copy(selectedCase.patient);
                        if ($scope.patientData && $scope.patientData.birthDate) {
                            $scope.patientData.birthDate = caseExchangeDataService.convertToDate($scope.patientData.birthDate);
                            $scope.patientData.age = caseExchangeDataService.calculatePatientAge($scope.patientData.birthDate);
                        }
                        parseTransactions(caseDetails);
                    }
                    collectAttachments(caseDetails);
                }

                if ($scope.mode === "CREATE") {
                    // Populates clinical reasons dropdown
                    populateClinicalReasons();
                    populateBillingOrganizations();
                }
                addRecipientAndSubject();
            }

            /**
             * Function to recipient and subject in create case
             */
            function addRecipientAndSubject() {
                var savedData = CreateCaseDataService.getCreateCaseData();
                if (savedData) {
                    $scope.addedRecipients = savedData.addedRecipients;
                    $scope.formData = savedData;
                    // Re-assign Non-DICOM attachments
                    $scope.fileList = savedData.fileList;

                    //Updates case subject if patient data available
                    if ($scope.patientData) {
                        updateCaseSubject();
                    }
                }
                else {
                    $scope.formData.subjectInput = caseExchangeDataService.getSelectedCaseData().subject;
                }

                if ($scope.existingListItems.length < 1 && $scope.selectedListItems.length < 1) {
                    $scope.patientData = SelectedStudyListService.clearSelectedPatient();
                }
            }

            /**
             * Check if DICOM Attachment already present in the list.
             * @param studyUid : Study UUID which is unique
             * @returns boolean: Returns true if exist, else false.
             */
            function checkExistingDicomAttachment(studyUid) {
                var isExists = false;
                if ($scope.existingListItems) {
                    for (var i = 0, iEnd = $scope.existingListItems.length; i < iEnd; i++) {
                        if ($scope.existingListItems[i].uid === studyUid) {
                            isExists = true;
                            break;
                        }
                    }
                }
                return isExists;
            }

            // Calling the initialization function
            init();
        }
    ]);
});
