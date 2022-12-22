var API_URL = "https://api.timelessart.io/api/timelessart/fetchSubs";
var IMAGE_URL = "https://uploads-ssl.webflow.com/629e3d15e8ee4837214bee58/63a14b4ea97b93538ec5c797_subscription-p-500.jpeg"; 

$(document).ready(function () {

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
                var buttonText = "PURCHASE NOW";
                
                var columnHtml = getColumnHTML(columnSize);
                columnHtml = columnHtml.replace("#PLANNAME#", planName);
                columnHtml = columnHtml.replace("#PLANAMOUNT#", planAmount);
                columnHtml = columnHtml.replace("#PLANIMAGEURL#", IMAGE_URL);
                columnHtml = columnHtml.replace("#PLANURL#", planUrl);
                columnHtml = columnHtml.replace("#COLUMNSIZE#", columnSize);
                columnHtml = columnHtml.replace("#BUTTONTEXT#", buttonText);

                var metadataHtml = "";
                if (metaData != null)
                {
                    if (metaData.Curation != null)
                        metadataHtml += '<div class="paragraph-regular-2 margin-bottom-20">' + metaData.Curation + '</div>';

                    if (metaData.Listing != null)
                        metadataHtml += '<div class="paragraph-regular-2 margin-bottom-20">' + metaData.Listing + '</div>';

                    if (metaData.Metaverse != null)
                        metadataHtml += '<div class="paragraph-regular-2 margin-bottom-20">' + metaData.Metaverse + '</div>';
                }

                columnHtml = columnHtml.replace("#METADATA#", metadataHtml);

                finalHTML += columnHtml; 
            }); 

            $(".pricing-wrapper-2").html(finalHTML);
        }
    });

});

function getColumnHTML() {
    var htmlData = "";
    htmlData += '<div class="pricing-card-2">';
    htmlData += '<img src="#PLANIMAGEURL#" loading="lazy" height="180" width="320" alt="Plan Image" class="image-2" />';
    htmlData += '<h2 class="pricing-title-2" style="font-size: 13px; line-height: 25px; text-align: center;">#PLANNAME#</h2>';
    htmlData += '<div class="pricing-price-2" style="padding-top: 20px; margin-bottom: 80px;">$#PLANAMOUNT#</div>';
    htmlData += '<div class="clsMetadata">#METADATA#</div>';
    htmlData += '<h1 class="heading-5">Timeless</h1>';
    htmlData += '<div class="pricing-divider-2"></div>';
    htmlData += '<a href="#PLANURL#" target="_blank" class="button-primary-2 outline-button w-button">#BUTTONTEXT#</a>';
    htmlData += '</div>';
    return htmlData;
}
