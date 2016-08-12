/*
 *  get-billing-organizations-service.js
 *
 *  Copyright (c) 2015 by General Electric Company. All rights reserved.
 *
 *  The copyright to the computer software herein is the property of
 *  General Electric Company. The software may be used and/or copied only
 *  with the written permission of General Electric Company or in accordance
 *  with the terms and conditions stipulated in the agreement/contract
 *  under which the software has been supplied.
 */

define(['angular'], function () {

    // Module Dependencies
    var dependencies = ['Services.caseExchangeDataService'];

    // Module Definition
    var mod = angular.module('Services.getBillingOrganizationsService', dependencies);

    /**
     * @name GetOrganizationsForLoggedInUserService
     * @type factory
     *
     * @description
     * A factory that provides methods for making request to the REST API to get the Clinical Reasons.
     */
    mod.factory('GetBillingOrganizationsService', ['CaseExchangeDataService', '$http', '$q', '$log', function (caseExchangeDataService, $http, $q, $log) {
        /**
         * Base url for making request to the GET Clinical Reasons REST API.
         */
        var GET_ORGANIZATIONS_URL = caseExchangeDataService.getServiceURL() + '/v1/user/me/organization';//  v1/user/id/organization

        /**
         * Gets the organizations for a LoggedInUser
         * @param params
         * @method getOrganizationsForLoggedInUser
         * @return promise
         */
        function getOrganizationsForLoggedInUser(params) {

            var deferred = $q.defer();

            $http({
                async: true,
                method: 'get',
                data: params,
                url: GET_ORGANIZATIONS_URL,
            }).success(function(data) {
                $log.log('Success: GetBillingOrganizationsService: getOrganizationsForLoggedInUser');
                var response = data || null;
                deferred.resolve(response);
            }).error(function(jqXHR, textStatus, errorThrown) {
                var errorMsg = 'Error: GetBillingOrganizationsService: getOrganizationsForLoggedInUser: ' + errorThrown;
                $log.error(errorMsg);
                deferred.reject(jqXHR);
            })
            return deferred.promise;
        }


        return {
            getOrganizationsForLoggedInUser: getOrganizationsForLoggedInUser
        };
    }]);
});