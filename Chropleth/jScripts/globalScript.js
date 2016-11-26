function store(tag){
    var jsonData = {
        "currentTagName" : tag.attributes.id.nodeValue
    }

    localStorage.setItem('myStorage',JSON.stringify(jsonData));
    location.reload();

}
