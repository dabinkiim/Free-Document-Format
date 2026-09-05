function createIndex(config){
    let indexElements = document.getElementsByClassName(config.spanClassIndex);
    let arrayIndex = [];
    let num = 0;
  
    for(let i = 0; i < indexElements.length; ++i){
        let indexElement = indexElements[i];
  
        // create array with all data-book-index
        let indexKey = indexElement.dataset.bookIndex;
        let indexKeyFirst = indexKey.slice(0, 1);
        let newIndexKey; 
        if(indexKeyFirst == "<"){
            if(indexKey.slice(0, 3) == "<i>"){
                newIndexKey = indexKey.replace("<i>", "") + "-iTemp";         
            }else if(indexKey.slice(0, 4) == "<em>"){
                newIndexKey = indexKey.replace("<em>", "") + "-emTemp";
            }
        }else{
            newIndexKey = indexKey;
        }
        
        arrayIndex.push(newIndexKey);
  
        // create id for span whithout
        num++;
        if(indexElement.id == ''){ indexElement.id = 'book-index-' + num; }
    }
  
    // filter array to remove duplicate and undefined values, and sort by alphabetical order
    let newArrayIndex = arrayIndex.filter(onlyUnique).filter(item => item !== undefined).sort((a, b) => a.localeCompare(b, 'ko', { sensitivity: 'base' }));
  
    // create <ul> element for the index
    let indexElementDiv = document.querySelector(config.indexElement);
    let indexUl = document.createElement("ul");
    indexUl.id = "list-index-generated";
    indexElementDiv.appendChild(indexUl); 
  
    // create <li> element for the index
    for(var a = 0; a < newArrayIndex.length; a++){           
        // create alphabet
        if(config.alphabet){
            z = a - 1;
            let firstLetter = newArrayIndex[a].charAt(0);
            if(a == 0){
                let alphabetLiFirst = document.createElement("li");
                alphabetLiFirst.classList.add("list-alphabet-element");
                alphabetLiFirst.id = "alphabet-element-" + firstLetter;
                alphabetLiFirst.innerHTML = firstLetter;
                indexUl.appendChild(alphabetLiFirst);
            }
            if(z > 0){
                let firstLetterPrevious = newArrayIndex[z].charAt(0);
                if(firstLetter != firstLetterPrevious){
                    let alphabetLi = document.createElement("li");
                    alphabetLi.classList.add("list-alphabet-element");
                    alphabetLi.id = "alphabet-element-" + firstLetter;
                    alphabetLi.innerHTML = firstLetter;
                    indexUl.appendChild(alphabetLi);
                }
            }
        }
  
        // create <li> element for the index
        let indexNewLi = document.createElement("li");
        indexNewLi.classList.add("list-index-element");
        
        let dataIndex;
        if(newArrayIndex[a].substr(newArrayIndex[a].length - 6) == "-iTemp"){
            dataIndex = "<i>" + newArrayIndex[a].replace("-iTemp", "");         
        }else if(newArrayIndex[a].substr(newArrayIndex[a].length - 7) == "-emTemp"){
            dataIndex = "<em>" + newArrayIndex[a].replace("-emTemp", "");   
        }else{
            dataIndex = newArrayIndex[a];
        }
    
        indexNewLi.dataset.listIndex = dataIndex;
        indexUl.appendChild(indexNewLi);  
    }
  
    let indexLi = document.getElementById('list-index-generated').getElementsByClassName('list-index-element');
  
    for(var n = 0; n < indexLi.length; n++){
        
        // find data and add HTML of the list
        let dataIndex = indexLi[n].dataset.listIndex;
        let spanIndex = document.querySelectorAll("[data-book-index='" + dataIndex + "']");
        indexLi[n].innerHTML = '<span class="index-value">' + dataIndex + '</span><span class="links-pages"></span>';
  
        // add span for link page
        spanIndex.forEach(function(elem) {
            spanIndexId = elem.id;
            let spanPage = document.createElement("span");
            spanPage.classList.add("link-page");
            spanPage.innerHTML = '<a href="#' + spanIndexId + '"></a>';
            indexLi[n].getElementsByClassName('links-pages')[0].appendChild(spanPage);  
        });
  
    }
  }
  
  // function for filter array to remove duplicate
  function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
  }