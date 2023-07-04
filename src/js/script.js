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
    var menuItemsUrl =
    "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
    var menuItemsTitleHtml = "snippets/menu-items-title.html";
    var menuItemHtml = "snippets/menu-item.html";

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

    var switchMenuToActive = () => {
        var classes = $("#navHomeButton")[0].className;
        classes = classes.replace(new RegExp("active", "g"), "");
        $("#navHomeButton")[0].className = classes;

        classes = $("#navMenuButton")[0].className;
        if (classes.indexOf("active") == -1){
            classes += " active";
            $("#navMenuButton")[0].className = classes;
        }
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

    dc.loadMenuItems = (categoryShort) => {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            menuItemsUrl + categoryShort + ".json",
            buildAndShowMenuItemsHTML
        );
    };

    function buildAndShowCategoriesHTML(categories) {
        $ajaxUtils.sendGetRequest(
            categoriesTitleHtml,
            (categoriesTitleHtml) => {
                $ajaxUtils.sendGetRequest(
                    categoryHtml,
                    (categoryHtml) => {
                        switchMenuToActive();
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

    function buildAndShowMenuItemsHTML(categoryMenuItems) {
        $ajaxUtils.sendGetRequest(
            menuItemsTitleHtml,
            (menuItemsTitleHtml) => {
                $ajaxUtils.sendGetRequest(
                    menuItemHtml,
                    (menuItemHtml) => {
                        switchMenuToActive();
                        var menuItemsViewHtml = buildMenuItemsViewHtml(
                            categoryMenuItems,
                            menuItemsTitleHtml,
                            menuItemHtml
                        );
                        insertHtml("#main-content", menuItemsViewHtml);
                    },
                    false,
                );
            },
            false,
        );
    }

    function buildMenuItemsViewHtml (categoryMenuItems, menuItemsTitleHtml, menuItemHtml) {
        menuItemsTitleHtml = insertProperty(
            menuItemsTitleHtml,
            "name",
            categoryMenuItems.category.name,
        );
        menuItemsTitleHtml = insertProperty(
            menuItemsTitleHtml,
            "special_instructions",
            categoryMenuItems.category.special_instructions,
        )

        var finalHtml = menuItemsTitleHtml;
        finalHtml += "<section class='row'>";

        var menuItems = categoryMenuItems.menu_items;
        var catShortName = categoryMenuItems.category.short_name;
        for (var i = 0; i < menuItems.length; i++) {
            var html = menuItemHtml;
            html = insertProperty(html, "short_name", menuItems[i].short_name);
            html = insertProperty(html, "catShortName", catShortName);
            html = insertProperty(html, "price_small", menuItems[i].price_small);
            html = insertItemPortionName(
                html,
                "small_portion_name",
                menuItems[i].small_portion_name
            );
            html = insertItemPrice(html, "price_large", menuItems[i].price_large);
            html = insertItemPortionName(
                html,
                "large_portion_name",
                menuItems[i].large_portion_name
            );
            html = insertProperty(html, "name", menuItems[i].name);
            html = insertProperty(html, "description", menuItems[i].description);

            if (i % 2 != 0) {
                html += "<div class='clearfix visible-lg-block visible-md-block'></div>";
            }
            finalHtml += html;
        }

        finalHtml += "</section>";
        return finalHtml;

    }

    function insertItemPrice(html, pricePropName, priceValue) {
        // If not specified, replace with empty string
        if (!priceValue) {
          return insertProperty(html, pricePropName, "");
        }
    
        priceValue = "$" + priceValue.toFixed(2);
        html = insertProperty(html, pricePropName, priceValue);
        return html;
    }
    
    // Appends portion name in parens if it exists
    function insertItemPortionName(html, portionPropName, portionValue) {
        // If not specified, return original string
        if (!portionValue) {
            return insertProperty(html, portionPropName, "");
        }

        portionValue = "(" + portionValue + ")";
        html = insertProperty(html, portionPropName, portionValue);
        return html;
    }


    global.$dc = dc;
})(window);