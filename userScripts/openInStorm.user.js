// ==UserScript==
// @name         bitBucket to phpstorm linker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Andrey Shumski
// @match        https://bitbucket.org/kinomoltd/ecom-magento-cloud/pull-requests/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery,
        intervalFlag,
        widget = {
        _init: function(){
            this._waitForDiff();
        },

        _waitForDiff: function(){
            intervalFlag = setInterval(this._checkDiff.bind(this), 1000);
        },

        _checkDiff: function(){
            if ($('.commit-files-summary .file').length) {
                clearInterval(intervalFlag);
                this._createLinks();
            }

        },

        _createLinks: function(){
            var $fileList = $('.commit-files-summary .file');

            $fileList.each(function(){
                var currentListItem = $(this),
                    currentFilePath = currentListItem.data('fileIdentifier'),
                    currentFileDiffBlockTitle = $('[data-path="' + currentFilePath + '"] h1'),
                    linkToStorm = $('<a href="http://localhost:63342/api/file/' + currentFilePath + '" title="http://localhost:63342/api/file/' + currentFilePath + '" target="_blank" class="diff-entry-lozenge aui-lozenge aui-lozenge-subtle aui-lozenge-complete">Open in phpStorm</a>');

                linkToStorm.on('click', function(e){
                    e.preventDefault();

                    $.get( 'http://localhost:63342/api/file/' + currentFilePath);
                });

                linkToStorm.appendTo(currentListItem);
                linkToStorm.clone(true, true).appendTo(currentFileDiffBlockTitle);
            });
        }
    };

    widget._init();
})();