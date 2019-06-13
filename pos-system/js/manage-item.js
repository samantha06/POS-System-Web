$(".btn-clear").click(clear);

function clear(){
    $("#txtItemCode").val("");
    $("#txtItemDescription").val("");
    $("#txtItemQty").val("");
    $("#txtItemUnitPrice").val("");
}

$("#btn-save").click(function () {
    var code = $("#txtItemCode").val();
    var description = $("#txtItemDescription").val();
    var qty = $("#txtItemQty").val();
    var unitprice = $("#txtItemUnitPrice").val();


    var isEmpty = checkEmpty(code,description,qty,unitprice);
    if (isEmpty) {
        var isValidate = checkValidate(code,description,qty,unitprice);
        if (isValidate) {
            addItem(code,description,qty,unitprice);
            reload();
            clear();
            grey();
        }
    }
});

function checkEmpty(code,description,qty,unitprice) {
    if ($.trim(code).length == 0){
        $("#txtItemCode").css("border-color","red");
        alert("Item Code is empty");
        $("#txtItemCode").focus();
        return false;
    }else if ($.trim(description).length == 0){
        grey();
        $("#txtItemDescription").css("border-color","red");
        alert("Item Description is empty");
        $("#txtItemDescription").focus();
        return false;
    } else if ($.trim(qty).length == 0){
        grey();
        $("#txtItemQty").css("border-color","red");
        alert("Item Qty is empty");
        $("#txtItemQty").focus();
        return false;
    } else if ($.trim(unitprice).length == 0){
        grey();
        $("#txtItemUnitPrice").css("border-color","red");
        alert("Item UnitPrice is empty");
        $("#txtItemUnitPrice").focus();
        return false;
    }else {
        grey();
        return true;
    }
};

function checkValidate(code,description,qty,unitprice) {
    var validateCode =  /^[I]{1}[0-9]{3}$/;
    var validateDesc = /^[A-Za-z0-9]+$/;
    var validateQty = /^[0-9]+$/;
    var validateUnitPrice = /^[0-9]{1,}[.][0-9]{2}$/;

    if (!validateCode.test(code)){
        $("#txtItemCode").css("border-color","red");
        $("#txtItemCode").focus();
        alert("incorrect item Code - I001");
        return false;
    }else if (!validateDesc.test(description)){
        grey();
        $("#txtItemDescription").css("border-color","red");
        $("#txtItemDescription").focus();
        alert("incorrect description");
        return false;
    }else if (!validateQty.test(qty)){
        grey();
        $("#txtItemQty").css("border-color","red");
        $("#txtItemQty").focus();
        alert("incorrect qty");
        return false;
    }else if (!validateUnitPrice.test(unitprice)){
        grey();
        $("#txtItemUnitPrice").css("border-color","red");
        $("#txtItemUnitPrice").focus();
        alert("incorrect unitprice - 0.00");
        return false;
    }else {
        console.log("validate Success");
        grey();
        return true;
    }
}


function addItem(code,description,qty,unitprice) {
    items.push({
        code:code,
        description:description,
        qtyOnHand:qty,
        unitPrice:unitprice
    });
}

function getAllItems() {
    return items;
}

function deleteItem(code) {
    var tempArray=getAllItems();
    for(var i=0;i<tempArray.length;i++) {
        var itemCode = tempArray[i].code;
        if (itemCode == code) {
            items.pop(tempArray[i]);
            return;
        }
    }
}

function reload() {
    var tempArray=getAllItems();
    $('#tbody').empty();
    for(var i=0;i<tempArray.length;i++){
        var itemCode=tempArray[i].code;
        var itemDes=tempArray[i].description;
        var itemQty=tempArray[i].qtyOnHand;
        var itemUnitPrice=tempArray[i].unitPrice;

        var row="<tr>" +
            "<td>"+itemCode+"</td>" +
            "<td>"+itemDes+"</td>" +
            "<td>"+itemQty+"</td>" +
            "<td>"+itemUnitPrice+"</td>" +
            "<td><img src='images/recyclebin.png' width='30px'> </td>" +
            "</tr>";
        $('#tbody').append(row);

        $("#tbody tr td:last").click(function () {
            console.log("clicked")
            var code= $(this).parent().children().first().text();
            console.log("item code : " +code);
            deleteItem(code);
            $(this).parent().fadeOut(500);
        });
    }

}


function grey() {
    $("#txtItemCode").css("border-color","lightgrey");
    $("#txtItemDescription").css("border-color","lightgrey");
    $("#txtItemQty").css("border-color","lightgrey");
    $("#txtItemUnitPrice").css("border-color","lightgrey");
}

$("#txtItemCode").click(function () {
    grey();
});

$("#txtItemDescription").click(function () {
    grey();
});

$("#txtItemQty").click(function () {
    grey();
});

$("#txtItemUnitPrice").click(function () {
    grey();
});
