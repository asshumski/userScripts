// ==UserScript==
// @name         bitBucket to phpstorm linker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Andrey Shumski
// @match        https://bitbucket.org/*/pull-requests/*
// @match        https://bitbucket.org/*/commits/*
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
                this._addCheckoutBtn();
                this._addFilterControl();
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
        },

        _addCheckoutBtn: function(){
            var widgetConatainer = $('.compare-widget-container'),
                branchName = $('.compare-widget-container [data-branch-name]:first-child').data('branchName'),
                checkoutBtn = $('<button style="cursor:pointer;" class="diff-entry-lozenge aui-lozenge aui-lozenge-subtle aui-lozenge-complete">Copy Checkout Command</button>');

            checkoutBtn.on('click', function(){
                var $temp = $("<input>");
                $("body").append($temp);
                $temp.val('git checkout ' + branchName).select();
                document.execCommand("copy");
                $temp.remove();
            });

            checkoutBtn.appendTo(widgetConatainer);
        },
        _addFilterControl: function(){
            var $fileList = $('.commit-files-summary .file'),
                extList = ['all', 'phtml', 'xml', 'less', 'js', 'php'],
                $filterControl = $('<select />'),
                $option;

            $fileList.each(function(){
                var filePath = $(this).data('fileIdentifier'),
                    fileExt = filePath.split('.').reverse()[0];
                $(this).attr('extension', fileExt);
            });

            $.each(extList, function(){
                $option = $('<option />');
                $option.attr('value', this);
                $option.text(this);

                $filterControl.append($option);
            })

            $filterControl.on('change', function(){
                if (this.value != 'all'){
                    $fileList.show();
                    $fileList.filter(':not([extension=' + this.value + '])').hide();
                } else {
                    $fileList.show();
                }
            });

            $filterControl.insertBefore('#commit-files-summary');
        }
    };

    widget._init();
})();
