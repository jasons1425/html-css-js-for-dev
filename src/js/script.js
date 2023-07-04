$(function () {
    $(".navbar-toggle").blur(function (event) {
        var screenwidth = window.innerWidth;
        if (screenwidth < 768) {
            $("#collapsable-nav").collapse('hide');
        }
    });
});

(function (global) {
    var dc = {};

    var homeHtml = "snippets/home-snippet.html";
    var allCategoriesUrl =
    "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
    var categoriesTitleHtml = "snippets/categories-title-snippet.html";
    var categoryHtml = "snippets/category-snippet.html";

    var insertHtml = (selector, html) => {
        var targetElem = document.querySelector(selector);
        if (targetElem) {
            targetElem.innerHTML = html;
        }
    };

    var showLoading = (selector) => {
        var html = "<div class='text-center'>";
        html += "<img src='images/ajax-loader.gif'></div>";
        insertHtml(selector, html);
    };

    var insertProperty = (string, propName, propValue) => {
        var propToReplace = "{{" + propName + "}}"
        string = string.replace(new RegExp(propToReplace, "g"), propValue);
        return string;
    };

    document.addEventListener("DOMContentLoaded", (event) => {
        showLoading("#main-content");
        global.$ajaxUtils.sendGetRequest(
            homeHtml,
            (responseText) => {
                $("#main-content")[0].innerHTML = responseText;
            },
            false,
        );
    });

    dc.loadMenuCategories = () => {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            allCategoriesUrl,
            buildAndShowCategoriesHTML
        );
    };

    function buildAndShowCategoriesHTML(categories) {
        $ajaxUtils.sendGetRequest(
            categoriesTitleHtml,
            (categoriesTitleHtml) => {
                $ajaxUtils.sendGetRequest(
                    categoryHtml,
                    (categoryHtml) => {
                        var categoriesViewHtml = 
                          buildCategoriesViewHtml(
                            categories,
                            categoriesTitleHtml,
                            categoryHtml
                          );
                        insertHtml("#main-content", categoriesViewHtml);
                    },
                    false,
                );
            },
            false,
        );
    }

    function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml) {
        var finalHtml = categoriesTitleHtml;
        finalHtml += "<section class='row'>";

        for (var i = 0; i < categories.length; i++) {
            var html = categoryHtml;
            var name = "" + categories[i].name;
            var short_name = categories[i].short_name;
            html = insertProperty(html, "name", name);
            html = insertProperty(html, "short_name", short_name);
            finalHtml += html
        }

        finalHtml += "</section>"
        return finalHtml;
    }

    global.$dc = dc;
})(window);