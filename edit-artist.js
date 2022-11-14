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

const updateNoofFiles = function(){
    document.getElementById('no-of-files').textContent = currentFiles + currentLinks
}

const showArtDetails = function(urls, files){
    const block = document.querySelector('.art-details-wrapper')
    let html = ''

    urls.forEach( (url, i) => {
        html += `<div class="art-upload-info" data-url='${url}'>

        <a href="#" class="file-deselector w-inline-block">
        <img class='uploaded-img' src='${url}'>
        </img>
        <div>
        ${files[i].name}</div>
        <img src="https://uploads-ssl.webflow.com/629e3d15e8ee4837214bee58/634814774357a011e1937be2_Group%2091.svg" loading="lazy" alt="">
        </a>
        <div class="col-wrapper"><div class="col-50"><label for="title-2" class="label">Art Title</label><input type="text" class="input w-input" maxlength="256" name="title" data-name="title" placeholder="Art Title" id="title"><label for="description-2" class="label">Art Description</label><textarea placeholder="Art Description" maxlength="5000" id="description" name="description" data-name="field" class="input w-input"></textarea></div><div class="col-50"><div class="unit-wrap"><label for="unit" class="label is--inline">Art Dimensions</label><select id="unit" name="unit" data-name="unit" class="input units w-select"><option value="inches">Inches</option><option value="Cm">Centimeters</option></select></div><div class="div-block"><input type="text" class="input dimension w-input" maxlength="256" name="width" data-name="width" placeholder="Width" id="width"><input type="text" class="input dimension w-input" maxlength="256" name="height" data-name="height" placeholder="Height" id="height"><input type="text" class="input dimension last w-input" maxlength="256" name="depth" data-name="depth" placeholder="Depth" id="depth"></div><label for="art-medium" class="label">Art Medium</label><select id="art-medium" name="art-medium" data-name="art-medium" class="input w-select"><option value="">Please select</option><option value="Oil">Oil</option><option value="Acrylic">Acrylic</option><option value="Mixed Media">Mixed Media</option><option value="Watercolor">Watercolor</option><option value="Encaustic">Encaustic</option><option value="Ink">Ink</option><option value="Tempera">Tempera</option><option value="Spray Paint">Spray Paint</option><option value="Digital">Digital</option><option value="Another option">Pencil</option><option value="Another option">Charcoal</option><option value="Pastels">Pastels</option><option value="Bronze">Bronze</option><option value="Steel">Steel</option><option value="Iron">Iron</option><option value="Precious Metals">Precious Metals</option><option value="Marble">Marble</option><option value="Other Stone">Other Stone</option><option value="Found Materials">Found Materials</option><option value="Glass">Glass</option><option value="Ceramic">Ceramic</option><option value="Paper Mache">Paper Mache</option></select></div></div>        
        </div>
        `
    })

    block.innerHTML += html

    // Remove Art
    document.querySelectorAll('.file-deselector').forEach( e => {
        e.addEventListener('click', () => {
            e.parentElement.remove()
            currentFiles += -1

            updateNoofFiles()
        })
    })

    // Hide previous file input
    document.querySelectorAll('input[type="file"]').forEach( el => el.style.display = 'none')

    // Add new input
    var input = document.createElement('input');
    input.type="file";
    input.setAttribute('multiple', true)

    block.parentElement.parentElement.parentElement.appendChild(input);

    // Add event listener to new input
    input.addEventListener("change", event => {
        fileInputTrigger(event)
    });
}

const getArts = function(){
    let arr = []

    const blocks = document.querySelectorAll('.art-upload-info')
    const mBlocks = document.querySelectorAll('.art-duplicateable')

    blocks.forEach( block => {
        const item = {
            "artTitle": block.querySelector('[data-name="title"]').value,
            "artDesc": block.querySelector('textarea').value,
            "arturl": block.getAttribute('data-url'),
            "artMedium": block.querySelector('#art-medium').value,
            "artDimensions": {
                "unit": block.querySelector('#unit').value,
                "height": block.querySelector('[data-name="height"]').value,
                "width": block.querySelector('[data-name="width"]').value,
                "depth": block.querySelector('[data-name="depth"]').value,
            }
        }

        arr.push(item)
    })

    mBlocks.forEach( block => {
        const inputs = block.querySelectorAll('input')

        if( inputs[0].value != ''){

            const item = {
                "artTitle": inputs[0].value,
                "artDesc": block.querySelector('textarea').value,
                "arturl": block.getAttribute('data-url'),
                "artMedium": block.querySelector('#art-medium').value,
                "artDimensions": {
                    "unit": block.querySelector('#unit').value,
                    "height": block.querySelector('[data-name="height"]').value,
                    "width": block.querySelector('[data-name="width"]').value,
                    "depth": block.querySelector('[data-name="depth"]').value,
                }
            }
    
            arr.push(item)
        }
    })

    return arr
}

// FILE UPLOAD
const uploadFile = (files) => {
    const API_ENDPOINT = "https://api.timelessart.io/api/timelessart/artistfileupload";
    const request = new XMLHttpRequest();
    const formData = new FormData();
  
    request.open("POST", API_ENDPOINT, true);
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {  
        const artUrls = JSON.parse(request.responseText).Data

        showArtDetails(artUrls, files)
      }
    };
    
    for (let i = 0; i < files.length; i++) {
      // formData.append(files[i].name, files[i])
      formData.append('files', files[i])
    }
    request.send(formData);
};
  
// Select your input type file and store it in a variable
const fileInput = document.getElementById('file-upload');
let currentLinks = 0

function fileInputTrigger(event){
    const files = event.target.files;
    currentFiles += files.length

    if(currentFiles < 11){
        uploadFile(files);

        updateNoofFiles()
    } else{
        alert('You can only submit a maximum of 10 art pieces')
        currentFiles = currentFiles - files.length
    }

}

function addArtWlink(input){

    if(input.value != ''){
        input.setAttribute('filled', true)
    } else{
        input.setAttribute('filled', false)
    }

    currentLinks = Number(document.querySelectorAll('input[filled="true"]').length)

    if(currentLinks + currentFiles > 10){
        alert('You can only submit a maximum of 10 art pieces')
        input.value = ''
        input.setAttribute('filled', false)
    }

    updateNoofFiles()
}

// EVENT LISTENERS

// It will be triggered when a file will be selected
fileInput.addEventListener("change", event => {
    fileInputTrigger(event)
});

document.querySelectorAll('.art-duplicateable').forEach( e => {
    const art = e.querySelectorAll('input')[0]

    art.addEventListener('change', () => {
        addArtWlink(art)
    })
})

easyNumberSeparator({
    selector: '.add-commas',
})
