// ==UserScript==
// @name         GitLab Collapse
// @namespace    http://muhammmada.li
// @version      0.3
// @description  collapse all gitlab files in diff view
// @author       Muhammad Ali
// @match        https://git.sauniverse.com/*/merge_requests*
// @match        https://git.sauniverse.com/*/commit*
// @grant        none
// #@require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function() {
    'use strict';

    /*var buttonHtml = '<div id="#collapse-all-button" class="award-menu-holder">' +
                     '  <button class="btn" type="button">' +
                     '    <i class="fa fa-compress award-control-icon-normal"></i>' +
                     '    <span class="award-control-text">' +
                     '      Collapse' +
                     '    </span>' +
                     '  </button>' +
                     '</div>';*/

    var buttonHtml2 = '<i id="collapse-all-button" class="fa fa-compress award-control-icon-normal"></i>';

    var parent = $(".award-menu-holder")[0];
    if (parent === undefined) {
        parent = $(".awards.js-awards-block")[0];
    }

    $(buttonHtml2).prependTo(parent);
    var collapseBtn = $("#collapse-all-button");

    var first = true;
    collapseBtn.click(function(){
        var before = "fa-compress";
        var after = "fa-expand";
        var loading = "fa-spinner";
        var collapsing = true;
        if (collapseBtn.hasClass(after)) {
            var temp = before;
            before = after;
            after = temp;
            collapsing = false;
        }

        collapseBtn.removeClass(before).addClass(loading);

        setTimeout(function() {
            if (first) {
                first = false;
                showFilenamesBox();
            }

            var buttons = $('.diff-toggle-caret');
            buttons.each(function() {
                if(collapsing) {
                    if($(this).hasClass("fa-caret-down")) {
                        $(this).click();
                    }
                } else {
                    if($(this).hasClass("fa-caret-right")) {
                        $(this).click();
                    }
                }
            });

            collapseBtn.removeClass(loading).addClass(after);
        }, 1);

    });


    var showFilenamesBox = function() {
        var rows = $(".file-header-content").find("a");
        var filenames = {};
        rows.each(function() {
            var strongEle = $(this).find("strong");
            if (strongEle.length !== 0) {
                var text = strongEle.text().trim();
                if (text !== "") {
                    var link = $(this).attr("href");
                    if (link.startsWith("#")) {
                        filenames[text] = link;
                    }
                }
            }
        });
        var keys = Object.keys(filenames);
        keys = unique(keys.sort());

        var shortenedFilenames = shortenFilenames(keys);

        var files = '<div class="mr-state-widget">';
        files += '  <ul>';
        $(keys).each(function() {
            files += '    <li><a href="' + filenames[this] + '">' + shortenedFilenames[this] + '</a></li>';
        });
        files += '  </ul>';
        files += '</div>';

        var parent = $(".emoji-list-container")[0];
        if (parent === undefined) {
            parent = $(".commit-stat-summary")[0];
        }
        $(files).insertAfter(parent);
    };

    function unique(array){
        return array.filter(function(el, index, arr) {
            return index === arr.indexOf(el);
        });
    }

    function shortenFilenames(filenames) {
        var common = filenames[0];
        var i = 0;
        var broken = false;
        while(!broken) {
            for (var j = 0; j < filenames.length; j++) {
                var name = filenames[j];
                if (i >= name.length || common.charAt(i) !== name.charAt(i)) {
                    broken = true;
                    break;
                }
            }
            i += 1;
        }

        var shortenedNames = {};
        for (var j = 0; j < filenames.length; j++) {
            var name = filenames[j];
            shortenedNames[name] = "…" + name.substring(i-1, name.length);
        }

        return shortenedNames;
    }

})();

