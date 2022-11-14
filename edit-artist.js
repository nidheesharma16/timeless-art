function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

// API Calls
function easyHTTP(){
    this.http = new XMLHttpRequest;
 }
 
 let  URL = 'https://api-dev.timelessart.io/api/timelessart/artistprofile'
 
 // HTTP POST request
 easyHTTP.prototype.post = function(url, data, callback){
 
    this.http.open('POST', url, true)
 
    this.http.setRequestHeader('Content-type', 'application/json');
 
    let self = this;
    this.http.onload = function() {
      console.log(self.http);

       if(self.http.status === 201){
         console.log(data);
       } else{

           callback(self.http.status)
       }
    }
       
    this.http.send(JSON.stringify(data))
 }

const btns = document.querySelectorAll('.plus-icon')
let i = 1;

const duplicate = function(btn){
    const duplicateable = btn.parentElement.querySelector('.duplicateable')
    console.log(duplicateable, ' duplicateable');
    let clone = duplicateable.cloneNode(true)

    let re = /-\d$/

    clone.querySelectorAll('[name]').forEach( e => {
        let name = e.getAttribute('name')
        let dataName = e.getAttribute('data-name')

        if(re.test(name)){
            name = name.replace(re, `-${i}`)
            dataName = dataName.replace(re, `-${i}`)
        } else{
            name = `${name}-${i}`
            dataName = `${dataName}-${i}`
        }
        e.setAttribute('name', name)
        e.setAttribute('data-name', dataName)

        e.value = ''
    })

    let div = document.createElement('div')
    div.classList.add('black-line')

    btn.parentElement.insertBefore(div, btn)
    btn.parentElement.insertBefore(clone, btn)

    if(clone.classList.contains('art-duplicateable')){
        const art = clone.querySelectorAll('input')[0]

        art.addEventListener('change', () => {
            addArtWlink(art)
        })
    }

    i++;
    return i;
}

btns.forEach( e => {
    e.addEventListener('click', () => {
        duplicate(e)
    }) 
})

const xhr = new easyHTTP()
let images = []
let currentFiles = 0

document.getElementById('wf-form-Artist-Form').addEventListener('submit', e => {
    e.preventDefault()

    sender()
})

function tester(){
    document.querySelectorAll('input').forEach( e => {
        const type = e.getAttribute('type')
        e.value = e.name

        if(type == 'email'){
            e.value = 'test@gmail.com'
        }
    })
}

//MAIN POST FUNCTION
const sender = function(){
    
    let item = {
        "emailID": document.getElementById('email').value,
        "contactInfo" : {
         "legalName" : document.getElementById('Legal-Name').value,
         "workingName" : document.getElementById('Psudoname').value,
         "artistName" : document.getElementById('Psudoname').value,
         "mailingAddress" : document.getElementById('Mailing-address-Line').value + document.getElementById('Mailing-address-Line-2').value + document.getElementById('Mailing-Address-Line-3').value,
         "shippingAddress" : document.getElementById('Mailing-address-Line').value + document.getElementById('Mailing-address-Line-2').value + document.getElementById('Mailing-Address-Line-3').value,
         "phoneNumber" : document.getElementById('Phone-Number').value,
         "email" :  document.getElementById('email').value,
         "artWebsite" : document.getElementById('Art-Website').value,
         "administrativeName" : document.getElementById('Admin-Contact-Name').value,
         "administrativePhone" : document.getElementById('Admin-Contact-Phone').value,
         "administrativeEmail" : document.getElementById('Admin-Contact-mail').value,
         "createdNFTs" : $("input[name='Previous NFTs']:checked").val(),
         "otherNFTMarketplaces" : {
            
            "whichones" : checkMarketplaces()
            
            }
        },
      
        "artInfo" : {
            
            "primaryArt" : {
            
            "twoDimensial" : {
            
            "painting": checkPaintings(),
            
            "drawing": checkDrawings(),
            
            "other":checkOtherArt()
            
            },
            
            "threeDimensial" : {
            
            "sculpture" : check3D()
            
            }
            
            }
            
            },
        "artDetails": getArts(),
        "museumExhibitions" : checkDuplicateable('museum-exhibitions'),
        "galleryExhibitions" : checkDuplicateable('gallery-exhibitions'),
        "artCompetitionAwards" : checkDuplicateable('art-awards'),
        "currentGalleryRepresentation" : checkDuplicateable('representation'),
        "artEducation" : checkSection('art-education'),
        "sales" : {
            
            "numberOfWorks" :document.getElementById('numberOfWorks').value,
            
            "highestValueOfWorks" :document.getElementById('highestValueOfWorks').value,
            
            "lowestValueOfWorks" :document.getElementById('lowestValueOfWorks').value,
            
            "averageValueOfWorks" :document.getElementById('averageValueOfWorks').value
            
            },
        "socialMediaLink" : {
             "facebook" :document.getElementById('facebook').value,
             "twitter" : document.getElementById('twitter').value,
             "instagram" : document.getElementById('instagram').value,
             "others" : document.getElementById('otherSocials').value,
         },

         "artCategoryMedium": checkArtCategories()
     }
     
     xhr.post(URL, item, (response) => {
        
        console.log(response);

        if(response == 409){
            
            document.querySelector('.success-head').textContent = 'Your application was already submitted to the Timeless team and a representative will get in touch with you'
            document.querySelector('.success-para').textContent = 'If you need support please contact info@timelessart.io'
        } else{
            document.querySelector('.success-head').textContent = 'There has been an error with your submission'
            document.querySelector('.success-para').textContent = 'Please reload the page and try again'
            
        }

    })

}

// SIDE FUNCTIONS
const checkArtCategories = function(){
    const categoryBlocks = document.querySelectorAll('.art-category-medium')
    let item = []

    categoryBlocks.forEach(block => {
        const title = block.querySelector('h4').textContent

        const wrappers = block.querySelectorAll('.col-wrapper')

        let medium = []
        let artCategory = []

        block.querySelectorAll('input').forEach( e => {
            if( e.checked ){
                medium.push(e.name)
            }
        })

        wrappers.forEach( wrapper => {
            let cat = ''

            wrapper.querySelectorAll('input').forEach( e => {
                if(e.checked){
                    cat = wrapper.previousElementSibling.textContent
                }
            })

            artCategory.push(cat)
        })

        item.push({
            "type": title,
            "medium": medium,
            "artCategory": artCategory
        })
    })

    return item
}

const checkMarketplaces = function(){
    let prevNft = 'none'
    if($("input[name='Previous NFTs']:checked").val() == 'yes' ){
        prevNft = document.getElementById('NFT-Marketplaces').value
    }

    return prevNft
}

const checkPaintings = function(){
    let paintings = []

    document.querySelectorAll('#painting-checkboxes checkbox').forEach( e => {
        if( e.checked ){
            paintings.push(e.name)
            mediums.push(e.name)
        }
    })

    if(document.querySelector('#Painting-Other-Checkbox').checked){
        paintings.push(document.getElementById('Painting-Other').value)
        mediums.push(document.getElementById('Painting-Other').value)
    }

    return paintings
}

const checkDrawings = function(){
    let drawings = []

    document.querySelectorAll('#drawing-checkboxes checkbox').forEach( e => {
        if( e.checked ){
            drawings.push(e.name)
            mediums.push(e.name)
        }
    })

    if(document.querySelector('#Drawing-Other-Checkbox').checked){
        drawings.push(document.getElementById('Drawing-Other').value)
        mediums.push(document.getElementById('Drawing-Other').value)
    }

    return drawings
}

const checkOtherArt = function(){
    let val = null
    
    if(document.getElementById('2D-Art-Other-Checkbox').checked){
        val = document.getElementById('2D-Art-Other').value
    }
    
    return val
}

const check3D = function(){
    let threeD = []

    document.querySelectorAll('#threeD-checkboxes checkbox').forEach( e => {
        if( e.checked ){
            threeD.push(e.name)
            mediums.push(e.name)
        }
    })

    if(document.querySelector('#Sculpture-Other-Checkbox').checked){
        threeD.push(document.getElementById('Sculpture-Other').value)
        mediums.push(document.getElementById('Sculpture-Other').value)
    }

    return threeD
}

const checkDuplicateable = function(id){
    const pages = document.getElementById(id).querySelectorAll('.duplicateable')

    let arr = []

    pages.forEach( page => {

        let item = {}

        page.querySelectorAll('input').forEach( input => {

            let re = /-\d$/

            let identifier = input.getAttribute('name')

            if(re.test(identifier)){
                identifier = identifier.replace(re, ``)
            }

            const type = input.getAttribute('type')
            if(!type !== 'radio'){
    
                Object.assign(item, {[identifier]: input.value})

            } else if(input.checked){
                Object.assign(item, {[identifier]: input.value})
            }
        })

        arr.push(item)
    })

    return arr
}

const checkSection = function(id){
    const page = document.getElementById(id)

    let item = {}

    page.querySelectorAll('input').forEach( input => {

        let re = /-\d$/

        let identifier = input.getAttribute('name')

        if(re.test(identifier)){
            identifier = identifier.replace(re, ``)
        }

        const type = input.getAttribute('type')
        if(!type !== 'radio'){

            Object.assign(item, {[identifier]: input.value})

        } else if(input.checked){
            Object.assign(item, {[identifier]: input.value})
        }
    })

    return item
}
