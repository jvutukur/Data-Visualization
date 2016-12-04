function store(tag){
    var jsonData = JSON.parse(localStorage.getItem('myStorage'));
    jsonData.currentTagName = tag.attributes.id.nodeValue;

    localStorage.setItem('myStorage',JSON.stringify(jsonData));
    location.reload();

}


function moveUp(){
    var jsonDataString = localStorage.getItem('myStorage');
    var jsonData = JSON.parse(jsonDataString);
    var currentBoxNum = +jsonData.currentBox;
    var nextBoxNum = (currentBoxNum - 1);
    if(nextBoxNum == -1){
        nextBoxNum = 3;
    }
    $("#box"+currentBoxNum).hide();
    $("#box"+nextBoxNum).show();
    jsonData.currentBox = nextBoxNum;
    localStorage.setItem('myStorage', JSON.stringify(jsonData));
}

function moveDown(){
    var jsonDataString = localStorage.getItem('myStorage');
    var jsonData = JSON.parse(jsonDataString);
    var currentBoxNum = +jsonData.currentBox;
    var nextBoxNum = (currentBoxNum + 1) % 4;
    $("#box"+currentBoxNum).hide();
    $("#box"+nextBoxNum).show("slow");
    jsonData.currentBox = nextBoxNum;
    localStorage.setItem('myStorage', JSON.stringify(jsonData));
}