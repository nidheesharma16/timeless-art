var API_URL = "https://api.timelessart.io/api/timelessart/marketPlace";
var MEDIUM_API_URL = "https://api.timelessart.io/api/timelessart/findmedium";
var current_page = 1;
var records_per_page = 16;
var totalData = 0;
var lstMediumFilters = [];
var selectedCurrency = "";

$(document).ready(function () {

    var sidebar = sidebarFiltersHtml();
    $(".sidebar-col").html(sidebar);

    displayPaginationButtons();
    bindMediumListing(MEDIUM_API_URL);
    bindMarketPlaceListing(API_URL);
});

function displayPaginationButtons() {
    var html = '<div class="col-wrapper pagination"> <div class="col-25"> </div> <div class="col-75"> <a href="javascript:prevPage()" id="btn_prev" style="color:blue; font-size:20px;"><< Prev</a>&nbsp;&nbsp;&nbsp; <a href="javascript:nextPage()" id="btn_next" style="color: blue; font-size: 20px; ">Next >></a>&nbsp;&nbsp;&nbsp; <span style="font-size: 20px;">page: <span id="page" style="font-size: 20px;"></span></span> </div> </div>';
    $(html).insertAfter(".has--sticky");
}

function bindMediumListing(api_url) {
    console.log("API URL=", api_url);
    $.get(api_url, function (response) {
        console.log("Medium API response=", response);
        if (response && response.response_data) {
            lstMediumFilters = response.response_data;

            var fltHtml = "<h3>Medium</h3>";
            lstMediumFilters.forEach(function (medium, index) {
                fltHtml += '<div class="filter-option"><input type="checkbox" id="chkMedium' + index + '" value="' + medium + '" class="filter-highlight filter"><div class="filter-text">' + medium + '</div></div>';
            });
            $(".filter-box.medium").html(fltHtml);
        }
        else {
        }
    });
}

function bindMarketPlaceListing(api_url) {
    StartLoading();
    console.log("API URL=", api_url);
    $.get(api_url, function (response) {
        console.log("API response=", response);
        if (response && response.response_data) {
            var arts_list = response.response_data;

            totalData = response.pagination.totaldata;
            changePage(current_page, false);

            if (arts_list.length > 0) {

                var finalHTML = "";

                arts_list.forEach(function (item, index) {

                    var artId = item.artId;
                    var artName = item.artName;
                    var artImage = item.primaryImage;
                    var creator = item.creator;
                    var currencySymbol = item.currencySymbol;
                    var artListingPrice = item.artListingPrice;
                    //var conversionRate = getFormattedConversionRate(item.conversionRate);
                    var externalLink = item.externalLink;
                    var userType = item.userType;
                    var svgIcon = getSVGIcon(userType);

                    var artical = getArtColumnHTML();
                    artical = artical.replace("#ART_NAME#", artName);
                    artical = artical.replace("#ART_IMAGE#", artImage);
                    artical = artical.replace("#CREATOR#", creator);
                    artical = artical.replace("#METAVERSE_LINK#", externalLink);
                    artical = artical.replace("#SELL_AMOUNT#", currencySymbol + artListingPrice);
                    //artical = artical.replace("#MRP_AMOUNT#", "$" + conversionRate);
                    artical = artical.replace("#SVG_ICON#", svgIcon);

                    finalHTML += artical;
                });

                $(".all-art__wrap").removeAttr("style");
                $(".all-art__wrap").html(finalHTML);
                $(".pagination").show();
            }
            else {
                $(".all-art__wrap").removeAttr("style");
                $(".all-art__wrap").css("height", "100%");

                var noDataHTML = "<h3 style='text-align: center; width: 100%; position: relative; top: 50%;'>No Data Found !!</h3>";
                $(".all-art__wrap").html(noDataHTML);
                $(".pagination").hide();
            }
            StopLoading();
        }
        else {
            $(".pagination").hide();
            StopLoading();
        }

    });
}

function getFormattedConversionRate(value) {
    var rate = 0;
    if (value) {
        var isDecimalValue = value.includes('.');
        if (isDecimalValue) {
            rate = parseFloat(value).toFixed(2);
        }
        else {
            rate = value;
        }
    }
    return rate;
}

$(document).on("click", ".filter", function () {
    hightlightSelectedFilter($(this));
    filterData();
});

function hightlightSelectedFilter(element) {
    var isChecked = element.is(':checked');
    if (isChecked) {
        element.parent().addClass("active");
    }
    else {
        element.parent().removeClass("active");
    }
}

$(document).on("change", "#Price-Min, #Price-Max", function () {

    var minPrice = $('#Price-Min').val();
    var maxPrice = $('#Price-Max').val();

    // Validation
    if (minPrice && maxPrice) {
        if (parseFloat(minPrice) > parseFloat(maxPrice)) {
            alert("Invalid price range");
            return false;
        }
    }

    if ((minPrice && maxPrice) || (!minPrice && !maxPrice))
        filterData();
});

function filterData() {

    var offset = (current_page - 1) * records_per_page;
    var filtered_api_url = API_URL;
    var param_filter = "?offset=" + offset;

    /* Browse by Category - Start */
    var chkPhysical = $('#chkPhysical:checked').val();
    var chkDigital = $('#chkDigital:checked').val();

    if (chkPhysical || chkDigital) {
        var str = "";
        if (chkPhysical) {
            str += chkPhysical;
        }
        if (chkDigital) {
            str += str ? "," + chkDigital : chkDigital;
        }

        param_filter += "&artType=" + str;
    }

    /* Browse by Category - End */

    /* Price Range - Start */

    var minPrice = $('#Price-Min').val();
    var maxPrice = $('#Price-Max').val();

    if (minPrice && maxPrice) {
        var sign = param_filter ? "&" : "?";
        param_filter += sign + "pricemin=" + minPrice + "&pricemax=" + maxPrice;
    }

    /* Price Range - End */

    /* Artist Category - Start */
    var chkElite = $('#chkElite:checked').val();
    var chkEstablished = $('#chkEstablished:checked').val();
    var chkEmerging = $('#chkEmerging:checked').val();

    if (chkElite || chkEstablished || chkEmerging) {
        var str = "";
        if (chkElite) {
            str += chkElite;
        }

        if (chkEstablished) {
            str += str ? "," + chkEstablished : chkEstablished;
        }

        if (chkEmerging) {
            str += str ? "," + chkEmerging : chkEmerging;
        }

        var sign = param_filter ? "&" : "?";
        param_filter += sign + "artistCategory=" + str;
    }

    /* Artist Category - End */

    /* Art Form - Start */

    var chkDrawing = $('#chkDrawing:checked').val();
    var chkPainting = $('#chkPainting:checked').val();
    var chkSculpture = $('#chkSculpture:checked').val();
    var chkPhotography = $('#chkPhotography:checked').val();

    if (chkDrawing || chkPainting || chkSculpture || chkPhotography) {
        var str = "";
        if (chkDrawing) {
            str += chkDrawing;
        }

        if (chkPainting) {
            str += str ? "," + chkPainting : chkPainting;
        }

        if (chkSculpture) {
            str += str ? "," + chkSculpture : chkSculpture;
        }

        if (chkPhotography) {
            str += str ? "," + chkPhotography : chkPhotography;
        }

        var sign = param_filter ? "&" : "?";
        param_filter += sign + "artCategory=" + str;
    }

    /* Art Form - End */

    /* Medium - Start */

    var mediumFilterCount = $(".filter-box.medium .filter:checked").length;
    if (mediumFilterCount > 0) {
        var str = "";
        $(".filter-box.medium .filter:checked").each(function () {
            var value = $(this).val();
            str += str ? "," + value : value;
        });
        var sign = param_filter ? "&" : "?";
        param_filter += sign + "medium=" + str;
    }

    /* Medium - End */

    filtered_api_url += param_filter;

    bindMarketPlaceListingNEW(filtered_api_url);

}

function getArtColumnHTML() {
    var htmlData = '';
    htmlData += '';

    htmlData += '<div class="art__item">';
    htmlData += '<img src="#ART_IMAGE#" style="width:200px; height: 200px;" loading="lazy" sizes="(max-width: 479px) 83vw, 200px" alt="Art Image" class="art__image" />';
    htmlData += '<div class="art__info">';
    htmlData += '<h3 class="art__title" style="width:160px; height: 60px; font-size:13px;">#ART_NAME#</h3>';
    htmlData += '<div>';
    htmlData += '<h3 class="artist__name under-art" style="text-transform: none;">#CREATOR#</h3>';
    htmlData += '<img src="#SVG_ICON#" loading="lazy" width="17" alt="" class="artist__badge under-art" />';
    htmlData += '</div>';
    htmlData += '<div class="art__info-stats">';
    htmlData += '<h5 class="art__info-number" style="font-weight:500">#SELL_AMOUNT#</h5>';
    /*htmlData += '<div>#MRP_AMOUNT#</div>';*/
    htmlData += '</div>';
    htmlData += '<div class="art-button-wrap"><a href="#" class="button art-button top w-button">View Art Page</a><a href="#METAVERSE_LINK#" class="button art-button w-button">View in Metaverse</a></div>';
    htmlData += '</div>';
    htmlData += '</div>';

    return htmlData;
}

function getSVGIcon(userType) {
    var icon = "";
    if (userType == "Elite") {
        icon = "https://uploads-ssl.webflow.com/63066914489fb9bc850e1c54/6360a599990398aa5a4bab73_Established.svg"; // blue
    }
    else if (userType == "Established") {
        icon = "https://uploads-ssl.webflow.com/63066914489fb9bc850e1c54/6360a599798bc2837502bdf5_Elite.svg"; // yellow
    }
    else if (userType == "Emerging") {
        icon = "https://uploads-ssl.webflow.com/63066914489fb9bc850e1c54/6360a59912ba460bfbc699de_Emerging.svg"; // black
    }
    return icon;
}

function StartLoading() {
    jQuery.blockUI({ message: "<h4>Please Wait...</h4>" });
}

function StopLoading() {
    jQuery.unblockUI();
}

function sidebarFiltersHtml() {
    var htmlData = "";

    // Browse by Category
    htmlData += '<div class="filter-box">';
    htmlData += '<h3>Browse by Category</h3>';
    htmlData += '<div class="filter-option">';
    htmlData += '<input type="checkbox" id="chkPhysical" value="physical" class="filter-highlight filter" />';
    htmlData += '<div class="filter-text">Physical</div>';
    htmlData += '</div>';
    htmlData += '<div class="filter-option">';
    htmlData += '<input type="checkbox" id="chkDigital" value="digital" class="filter-highlight filter" />';
    htmlData += '<div class="filter-text">Digital</div>';
    htmlData += '</div>';
    htmlData += '</div>';

    // Price Range
    htmlData += '<div class="filter-box">';
    htmlData += '<h3>Price Range</h3>';
    htmlData += '<div class="w-form">';
    htmlData += '<form id="email-form" name="email-form" data-name="Email Form" method="get">';
    htmlData += '<input type="number" class="price-filter w-input" maxlength="256" name="Price-Min" data-name="Price Min" placeholder="Min" id="Price-Min" />';
    htmlData += '<div class="price-label">to</div>';
    htmlData += '<input type="number" class="price-filter w-input" maxlength="256" name="Price-Max" data-name="Price Max" placeholder="Max" id="Price-Max" />';
    htmlData += '</form>';
    htmlData += '<div class="w-form-done">';
    htmlData += '<div>Thank you! Your submission has been received!</div>';
    htmlData += '</div>';
    htmlData += '<div class="w-form-fail">';
    htmlData += '<div>Oops! Something went wrong while submitting the form.</div>';
    htmlData += '</div>';
    htmlData += '</div>';
    htmlData += '</div>';

    // Artist Category
    htmlData += '<div class="filter-box">';
    htmlData += '<h3>Artist Category</h3>';
    htmlData += '<div class="filter-option">';
    htmlData += '<input type="checkbox" id="chkElite" value="Elite" class="filter-highlight filter" />';
    htmlData += '<div class="filter-text">Elite</div>';
    htmlData += '</div>';
    htmlData += '<div class="filter-option">';
    htmlData += '<input type="checkbox" id="chkEstablished" value="Established" class="filter-highlight filter" />';
    htmlData += '<div class="filter-text">Established</div>';
    htmlData += '</div>';
    htmlData += '<div class="filter-option">';
    htmlData += '<input type="checkbox" id="chkEmerging" value="Emerging" class="filter-highlight filter" />';
    htmlData += '<div class="filter-text">Emerging</div>';
    htmlData += '</div>';
    htmlData += '</div>';

    // Art Form
    htmlData += '<div class="filter-box">';
    htmlData += '<h3>Art Form</h3>';
    htmlData += '<div class="filter-option">';
    htmlData += '<input type="checkbox" id="chkDrawing" value="Drawing" class="filter-highlight filter" />';
    htmlData += '<div class="filter-text">Drawing</div>';
    htmlData += '</div>';
    htmlData += '<div class="filter-option">';
    htmlData += '<input type="checkbox" id="chkPainting" value="Painting" class="filter-highlight filter" />';
    htmlData += '<div class="filter-text">Painting</div>';
    htmlData += '</div>';
    htmlData += '<div class="filter-option">';
    htmlData += '<input type="checkbox" id="chkSculpture" value="Sculpture" class="filter-highlight filter" />';
    htmlData += '<div class="filter-text">Sculpture</div>';
    htmlData += '</div>';
    htmlData += '<div class="filter-option">';
    htmlData += '<input type="checkbox" id="chkPhotography" value="Photography" class="filter-highlight filter" />';
    htmlData += '<div class="filter-text">Photography</div>';
    htmlData += '</div>';
    htmlData += '</div>';

    // Medium
    htmlData += '<div class="filter-box medium">';
    htmlData += '</div>';

    return htmlData;
}

// pagination function 
function prevPage() {
    if (current_page > 1) {
        current_page--;
        changePage(current_page, true);
    }
}

function nextPage() {
    if (current_page < getnumPages()) {
        current_page++;
        changePage(current_page, true);
    }
}

function changePage(page, isFilter) {

    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");
    var page_span = document.getElementById("page");

    // Validate page
    var numPages = getnumPages();
    if (page < 1) page = 1;
    if (page > numPages)
        page = numPages;

    current_page = page;

    if (isFilter) {
        filterData();
    }

    page_span.innerHTML = page;

    if (page == 1) {
        btn_prev.style.display = "none";
    } else {
        btn_prev.style.display = "inline-block";
    }

    if (page == numPages) {
        btn_next.style.display = "none";
    } else {
        btn_next.style.display = "inline-block";
    }
}

function getnumPages() {
    return Math.ceil(totalData / records_per_page);
}

function bindMarketPlaceListingNEW(api_url) {
    StartLoading();
    console.log("API URL=", api_url);
    $.get(api_url, function (response) {
        console.log("API response=", response);
        if (response && response.response_data) {
            var arts_list = response.response_data;

            totalData = response.pagination.totaldata;

            if (arts_list.length > 0) {

                var finalHTML = "";

                arts_list.forEach(function (item, index) {

                    var artId = item.artId;
                    var artName = item.artName;
                    var artImage = item.primaryImage;
                    var creator = item.creator;
                    var currencySymbol = item.currencySymbol;
                    var artListingPrice = item.artListingPrice;
                    //var conversionRate = getFormattedConversionRate(item.conversionRate);
                    var externalLink = item.externalLink;
                    var userType = item.userType;
                    var svgIcon = getSVGIcon(userType);

                    var artical = getArtColumnHTML();
                    artical = artical.replace("#ART_NAME#", artName);
                    artical = artical.replace("#ART_IMAGE#", artImage);
                    artical = artical.replace("#CREATOR#", creator);
                    artical = artical.replace("#METAVERSE_LINK#", externalLink);
                    artical = artical.replace("#SELL_AMOUNT#", currencySymbol + artListingPrice);
                    //artical = artical.replace("#MRP_AMOUNT#", "$" + conversionRate);
                    artical = artical.replace("#SVG_ICON#", svgIcon);

                    finalHTML += artical;
                });

                $(".all-art__wrap").removeAttr("style");
                $(".all-art__wrap").html(finalHTML);
                $(".pagination").show();
            }
            else {
                $(".all-art__wrap").removeAttr("style");
                $(".all-art__wrap").css("height", "100%");

                var noDataHTML = "<h3 style='text-align: center; width: 100%; position: relative; top: 50%;'>No Data Found !!</h3>";
                $(".all-art__wrap").html(noDataHTML);
                $(".pagination").hide();
            }

            StopLoading();
        }
        else {
            $(".pagination").hide();
            StopLoading();
        }

    });
}
