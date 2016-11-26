function store(tag){
    var jsonData = {
        "currentTagName" : tag.value
    }

    localStorage.setItem('myStorage',JSON.stringify(jsonData));
    location.reload();

}
