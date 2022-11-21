let getArtistProfile = 'https://api-dev.timelessart.io/api/timelessart/artistwithoutToken';

// HTTP GET request
easyHTTP.prototype.get = function (url, callback) {
    this.http.open('GET', url, true)
    this.http.setRequestHeader('Content-type', 'application/json');
    let self = this;
    this.http.onload = function () {
        callback(self.http);
    }
    this.http.send();
}

window.addEventListener('load', (event) => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    let url = getArtistProfile + '?emailID=' + params.emailID + '&profileID=' + params.profileID;
    xhr.get(url, (response) => {
        if(response.status == 200 && response.responseText){
            let resData = JSON.parse(response.responseText);
            if(resData.response_data.length > 0){
                autoPopulateData(resData.response_data[0]);
            }
        }
    });
});

//MAIN GET FUNCTION
const autoPopulateData = function (data) {
    document.getElementById('email').value = data.emailID ? data.emailID : '';

    if(data.contactInfo){
        getContactInfo(data.contactInfo);
    }

    if(data.artInfo && data.artInfo.primaryArt){
        getArtInfo(data.artInfo.primaryArt);
    }
    
    if(data.artDetails){
        getArtDetails(data.artDetails);
    }

    if(data.museumExhibitions){
        getMuseumExhibitions(data.museumExhibitions);
    }

    if(data.galleryExhibitions){
        getGalleryExhibitions(data.galleryExhibitions);
    }

    if(data.artCompetitionAwards){
        getArtCompetitionAwards(data.artCompetitionAwards);
    }

    if(data.currentGalleryRepresentation){
        getCurrentGalleryRepresentation(data.currentGalleryRepresentation);
    }

    if(data.artEducation){
        getArtEducation(data.artEducation);
    }

    if(data.sales){
        getSalesData(data.sales);
    }

    if(data.socialMediaLink){
        getSocialMediaLink(data.socialMediaLink);
    }
}

const getContactInfo = function(contactInfoData){
    document.getElementById('Legal-Name').value = contactInfoData.legalName ? contactInfoData.legalName : '';
    document.getElementById('Psudoname').value = contactInfoData.workingName ? contactInfoData.workingName : '';
    document.getElementById('Mailing-address-Line').value = contactInfoData.mailingAddress ? contactInfoData.mailingAddress : '';
    document.getElementById('Mailing-address-Line').value = contactInfoData.shippingAddress ? contactInfoData.shippingAddress : '';
    document.getElementById('Phone-Number').value = contactInfoData.phoneNumber ? contactInfoData.phoneNumber : '';
    document.getElementById('Art-Website').value = contactInfoData.artWebsite ? contactInfoData.artWebsite : '';
    document.getElementById('Admin-Contact-Name').value = contactInfoData.administrativeName ? contactInfoData.administrativeName : '';
    document.getElementById('Admin-Contact-Phone').value = contactInfoData.administrativePhone ? contactInfoData.administrativePhone : '';
    document.getElementById('Admin-Contact-mail').value = contactInfoData.administrativeEmail ? contactInfoData.administrativeEmail : '';
    document.querySelector("input[name='Previous-NFTs'][value='Yes']").checked = contactInfoData.createdNFTs && contactInfoData.createdNFTs == 'Yes' ? true : false;
    document.querySelector("input[name='Previous-NFTs'][value='No']").checked = contactInfoData.createdNFTs && contactInfoData.createdNFTs == 'No'  ? true : false;
    document.getElementById('NFT-Marketplaces').value = contactInfoData.otherNFTMarketplaces && contactInfoData.otherNFTMarketplaces.whichones ? contactInfoData.otherNFTMarketplaces.whichones : '';
}

const getArtInfo = function(artInfo){
    if(artInfo.twoDimensial && artInfo.twoDimensial.painting && artInfo.twoDimensial.painting.length > 0){
        let paintingCheckbox = document.querySelectorAll('#painting-checkboxes input[type=checkbox]');
        paintingCheckbox.forEach(e => {
            if (artInfo.twoDimensial.painting.indexOf(e.name) >= 0) {
                e.checked = true;
            }
        })
        
        // if(artInfo.twoDimensial && artInfo.twoDimensial.other && artInfo.twoDimensial.other != ''){
        //     document.getElementById('Painting-Other-Checkbox').checked = true;
        // }
    }

    if(artInfo.twoDimensial && artInfo.twoDimensial.drawing && artInfo.twoDimensial.drawing.length > 0){
        let drawingCheckbox = document.querySelectorAll('#drawing-checkboxes input[type=checkbox]');
        drawingCheckbox.forEach(e => {
            if (artInfo.twoDimensial.drawing.indexOf(e.name) >= 0) {
                e.checked = true;
            }
        })
    }

    artInfo.twoDimensial.other = 'other';
    if(artInfo.twoDimensial && artInfo.twoDimensial.other && artInfo.twoDimensial.other != ''){
        document.getElementById('2D-Art-Other-Checkbox').checked = true;
    }

    if(artInfo.threeDimensial && artInfo.threeDimensial.sculpture && artInfo.threeDimensial.sculpture.length > 0){
        let sculptureCheckbox = document.querySelectorAll('#threeD-checkboxes input[type=checkbox]');
        sculptureCheckbox.forEach(e => {
            if (artInfo.threeDimensial.sculpture.indexOf(e.name) >= 0) {
                e.checked = true;
            }
        })
    }
}

const getMuseumExhibitions = function(museumExhibitionsData){
    /* if data stored as object */
    if(museumExhibitionsData.length == undefined && museumExhibitionsData.museumName){
        let museumExhibitions = [];
        museumExhibitions.push(museumExhibitionsData);
        museumExhibitionsData = museumExhibitions;
    }
    if(museumExhibitionsData.length > 0){
        let postfix = '';
        museumExhibitionsData.forEach((museumData, index) => {
            postfix = '';
            if(museumExhibitionsData.length > 1 && index > 0){
                let element = document.querySelector('#museum-exhibitions .plus-icon');
                let postfixIndex = duplicate(element);
                postfix = '-'+(postfixIndex-1);
            }
            document.querySelector('input[name="museumName'+postfix+'"]').value = museumData.museumName ? museumData.museumName : '';
            document.querySelector('input[name="museumWebsite'+postfix+'"]').value = museumData.museumWebsite ? museumData.museumWebsite : '';
            document.querySelector('textarea[name="museumAddress'+postfix+'"]').value = museumData.museumAddress ? museumData.museumAddress : '';
            document.querySelector('input[name="museumPhoneNumber'+postfix+'"]').value = museumData.museumPhoneNumber ? museumData.museumPhoneNumber : '';
            document.querySelector('input[name="museumContactName'+postfix+'"]').value = museumData.museumContactName ? museumData.museumContactName : '';
            document.querySelector('input[name="museumEmailAddress'+postfix+'"]').value = museumData.museumEmailAddress ? museumData.museumEmailAddress : '';
            document.querySelector('input[name="exhibitionName'+postfix+'"]').value = museumData.exhibitionName ? museumData.exhibitionName : '';
            document.querySelector('input[name="exhibitionDates'+postfix+'"]').value = museumData.exhibitionDates ? museumData.exhibitionDates : '';
            document.querySelector('input[name="museumExhibitionUrl'+postfix+'"]').value = museumData.museumExhibitionUrl ? museumData.museumExhibitionUrl : '';
            document.querySelector('input[name="galleryOrSoloExhibition'+postfix+'"][id="Group"]').checked = museumData.galleryOrSoloExhibition && museumData.galleryOrSoloExhibition == 'Group' ? true : false;
            document.querySelector('input[name="galleryOrSoloExhibition'+postfix+'"][id="Solo"]').checked = museumData.galleryOrSoloExhibition && museumData.galleryOrSoloExhibition == 'Solo' ? true : false;
        });
    }
}

const getGalleryExhibitions = function(galleryExhibitionsData){
    /* if data stored as object */
    if(galleryExhibitionsData.length == undefined && galleryExhibitionsData.galleryName){
        let galleryExhibitions = [];
        galleryExhibitions.push(galleryExhibitionsData);
        galleryExhibitionsData = galleryExhibitions;
    }
    if(galleryExhibitionsData.length > 0){
        let postfix = '';
        galleryExhibitionsData.forEach((galleryData, index) => {
            postfix = '';
            if(galleryExhibitionsData.length > 1 && index > 0){
                let element = document.querySelector('#gallery-exhibitions .plus-icon');
                let postfixIndex = duplicate(element);
                postfix = '-'+(postfixIndex-1);
            }
            document.querySelector('input[name="galleryName'+postfix+'"]').value = galleryData.galleryName ? galleryData.galleryName : '';
            document.querySelector('input[name="exhibitionDates'+postfix+'"]').value = galleryData.exhibitionDates ? galleryData.exhibitionDates : '';
            document.querySelector('textarea[name="galleryAddress'+postfix+'"]').value = galleryData.galleryAddress ? galleryData.galleryAddress : '';
            document.querySelector('input[name="galleryWebsite'+postfix+'"]').value = galleryData.galleryWebsite ? galleryData.galleryWebsite : '';
            document.querySelector('input[name="galleryPhoneNumber'+postfix+'"]').value = galleryData.galleryPhoneNumber ? galleryData.galleryPhoneNumber : '';
            document.querySelector('input[name="galleryContactName'+postfix+'"]').value = galleryData.galleryContactName ? galleryData.galleryContactName : '';
            document.querySelector('input[name="galleryEmailAddress'+postfix+'"]').value = galleryData.galleryEmailAddress ? galleryData.galleryEmailAddress : '';
            document.querySelector('input[name="galleryOrSoloExhibition'+postfix+'"][id="Group"]').checked = galleryData.galleryOrSoloExhibition && galleryData.galleryOrSoloExhibition == 'Group' ? true : false;
            document.querySelector('input[name="galleryOrSoloExhibition'+postfix+'"][id="Solo"]').checked = galleryData.galleryOrSoloExhibition && galleryData.galleryOrSoloExhibition == 'Solo' ? true : false;
        });
    }
}

const getCurrentGalleryRepresentation = function(crntGalleryRepresentationData){
    /* if data stored as object */
    if(crntGalleryRepresentationData.length == undefined && crntGalleryRepresentationData.galleryName){
        let galleryExhibitions = [];
        galleryExhibitions.push(crntGalleryRepresentationData);
        crntGalleryRepresentationData = galleryExhibitions;
    }
    if(crntGalleryRepresentationData.length > 0){
        let postfix = '';
        crntGalleryRepresentationData.forEach((galleryData, index) => {
            postfix = '';
            if(crntGalleryRepresentationData.length > 1 && index > 0){
                let element = document.querySelector('#representation .plus-icon');
                let postfixIndex = duplicate(element);
                postfix = '-'+(postfixIndex-1);
            }
            document.querySelector('input[name="galleryName'+postfix+'"]').value = galleryData.galleryName ? galleryData.galleryName : '';
            document.querySelector('input[name="representationDates'+postfix+'"]').value = galleryData.representationDates ? galleryData.representationDates : '';
            document.querySelector('textarea[name="galleryAddress'+postfix+'"]').value = galleryData.galleryAddress ? galleryData.galleryAddress : '';
            document.querySelector('input[name="galleryWebsite'+postfix+'"]').value = galleryData.galleryWebsite ? galleryData.galleryWebsite : '';
            document.querySelector('input[name="galleryPhoneNumber'+postfix+'"]').value = galleryData.galleryPhoneNumber ? galleryData.galleryPhoneNumber : '';
            document.querySelector('input[name="galleryContactName'+postfix+'"]').value = galleryData.galleryContactName ? galleryData.galleryContactName : '';
            document.querySelector('input[name="galleryEmailAddress'+postfix+'"]').value = galleryData.galleryEmailAddress ? galleryData.galleryEmailAddress : '';
        });
    }
}

const getArtCompetitionAwards = function(artCompetitionAwards){
    document.querySelector('input[name="competitionName"]').value = artCompetitionAwards.galleryName ? artCompetitionAwards.galleryName : '';
    document.querySelector('input[name="competitionYear"]').value = artCompetitionAwards.competitionYear ? artCompetitionAwards.competitionYear : '';
    document.querySelector('input[name="competitionWebsite"]').value = artCompetitionAwards.competitionWebsite ? artCompetitionAwards.competitionWebsite : '';
    document.querySelector('input[name="organizerName"]').value = artCompetitionAwards.organizerName ? artCompetitionAwards.organizerName : '';
    document.querySelector('textarea[name="organizerAddress"]').value = artCompetitionAwards.organizerAddress ? artCompetitionAwards.organizerAddress : '';
    document.querySelector('input[name="organizerPhoneNumber"]').value = artCompetitionAwards.organizerPhoneNumber ? artCompetitionAwards.organizerPhoneNumber : '';
    document.querySelector('input[name="organizerContactName"]').value = artCompetitionAwards.organizerContactName ? artCompetitionAwards.organizerContactName : '';
    document.querySelector('input[name="organizerEmailAddress"]').value = artCompetitionAwards.organizerEmailAddress ? artCompetitionAwards.organizerEmailAddress : '';
    document.querySelector('input[name="awardsWon"]').value = artCompetitionAwards.awardsWon ? artCompetitionAwards.awardsWon : '';
}

const getArtEducation = function(artCompetitionAwards){
    document.querySelector('input[name="institutionName"]').value = artCompetitionAwards.institutionName ? artCompetitionAwards.institutionName : '';
    document.querySelector('input[name="degreeCurriculumName"]').value = artCompetitionAwards.degreeCurriculumName ? artCompetitionAwards.degreeCurriculumName : '';
    document.querySelector('input[name="attendanceDates"]').value = artCompetitionAwards.attendanceDates ? artCompetitionAwards.attendanceDates : '';
    document.querySelector('input[name="institutionAddress"]').value = artCompetitionAwards.institutionAddress ? artCompetitionAwards.institutionAddress : '';
    document.querySelector('input[name="institutionPhoneNumber"]').value = artCompetitionAwards.institutionPhoneNumber ? artCompetitionAwards.institutionPhoneNumber : '';
    document.querySelector('input[name="institutionWebsite"]').value = artCompetitionAwards.institutionWebsite ? artCompetitionAwards.institutionWebsite : '';
    document.querySelector('input[name="institutionEmailAddress"]').value = artCompetitionAwards.institutionEmailAddress ? artCompetitionAwards.institutionEmailAddress : '';
}

const getArtDetails = function(artDetails){
    if(artDetails.length > 0){
        artDetails.forEach((artData, index) => { 
            let artUrl = artData.arturl ? artData.arturl : '';
            let artTitle = artData.artTitle ? artData.artTitle : '';
            let artMedium = artData.artMedium ? artData.artMedium : '';
            let files = [{'name': artTitle}];
            showArtDetails([artUrl], files, artData);
            let artUploadInfo = document.querySelectorAll('.art-upload-info');
            artUploadInfo[index].querySelector('#art-medium option[value="'+artMedium+'"]').setAttribute('selected', 'selected');
        });
        updateNoofFiles();
    }
}

const getSocialMediaLink = function(socialMediaData){
    document.getElementById('instagram').value = socialMediaData.instagram ? socialMediaData.instagram : '';
    document.getElementById('facebook').value = socialMediaData.facebook ? socialMediaData.facebook : '';
    document.getElementById('twitter').value = socialMediaData.twitter ? socialMediaData.twitter : '';
    document.getElementById('otherSocials').value = socialMediaData.others ? socialMediaData.others : '';
}

const getSalesData = function(salesData){
    document.getElementById('numberOfWorks').value = salesData.numberOfWorks ? salesData.numberOfWorks : '';
    document.getElementById('highestValueOfWorks').value = salesData.highestValueOfWorks ? salesData.highestValueOfWorks : '';
    document.getElementById('lowestValueOfWorks').value = salesData.lowestValueOfWorks ? salesData.lowestValueOfWorks : '';
    document.getElementById('averageValueOfWorks').value = salesData.averageValueOfWorks ? salesData.averageValueOfWorks : '';
}