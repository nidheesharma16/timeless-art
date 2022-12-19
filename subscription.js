var API_URL = "https://api.timelessart.io/api/timelessart/fetchSubs";
var colors = ['#cff1ec', '#ecf1e0', '#ffe1e1', '#f0eaea', 'red'];

$(window).on('load', function () {

    $.get(API_URL, function (response) {
        if (response && response.message && response.message.data) {
            var list = response.message.data;
            var total_plans = list.length;
            var columnSize = 12 / total_plans;

            var finalHTML = "";
            list.forEach(function (item, index) {
                var planName = item.nickname;
                var metaData = item.metadata;
                var planUrl = item.url;
                var planAmount = item.amount / 100;
                var buttonText = "Current Plan";

                var columnHtml = getColumnHTML(columnSize);

                columnHtml = columnHtml.replace("#PLANNAME#", planName);
                columnHtml = columnHtml.replace("#PLANAMOUNT#", planAmount);
                columnHtml = columnHtml.replace("#PLANURL#", planUrl);
                columnHtml = columnHtml.replace("#BACKGROUNDCOLOR#", colors[index]);
                columnHtml = columnHtml.replace("#COLUMNSIZE#", columnSize);
                columnHtml = columnHtml.replace("#BUTTONTEXT#", buttonText);

                finalHTML += columnHtml;
            });

            $(".w-row").html(finalHTML);
        }
    });

});

function getColumnHTML() {
    var htmlData = "";
    htmlData += '<div class="w-col w-col-#COLUMNSIZE#" style="height:500px; background-color:#BACKGROUNDCOLOR#">';
    htmlData += '<h3 class="heading-3">#PLANNAME#</h3>';
    htmlData += '<div class="w-row">';
    htmlData += '<div class="w-col w-col-12">';
    htmlData += '<div class="text-block" style="text-align:center;">$#PLANAMOUNT# <span style="font-size:18px; font-weight: bold;">/mo</span></div>';
    htmlData += '</div>';
    htmlData += '</div>';

    htmlData += '<div class="clsMetadata">';
    htmlData += '<div class="text-block-3">100 requests monthly</div>';
    htmlData += '<div class="text-block-3">No Rate Limit</div>';
    htmlData += '<div class="text-block-3">No credit card required</div>';
    htmlData += '</div>';

    htmlData += '<div class="section-2 wf-section"><a href="#PLANURL#" target="_blank" class="button-3 w-button">#BUTTONTEXT#</a></div>';
    htmlData += '</div>';
    return htmlData;
}
