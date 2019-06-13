$(".btn-clear").click(clear);

function clear(){
    $("#txtCustomerID").val("");
    $("#txtCustomerIName").val("");
    $("#txtCustomerAddress").val("");

    $("#txtCustomerID").css("border-color","lightgrey");
    $("#txtCustomerIName").css("border-color","lightgrey");
    $("#txtCustomerAddress").css("border-color","lightgrey");
}

$("#btn-save").click(function () {
    var id = $("#txtCustomerID").val();
    var name = $("#txtCustomerIName").val();
    var address = $("#txtCustomerAddress").val();


    var isEmpty = checkEmpty(id,name,address);
    if (isEmpty) {
        var isValidate = checkValidate(id,name,address);
        if (isValidate) {
            addCustomer(id, name, address);
            reload();
        }
    }
});

function checkEmpty(id,name,address) {
    if ($.trim(id).length == 0){
        $("#txtCustomerID").css("border-color","red");
        console.log("Customer ID is empty");
        $("#txtCustomerID").focus();
        return false;
    }else if ($.trim(name).length == 0){
        $("#txtCustomerID").css("border-color","lightgrey");
        $("#txtCustomerIName").css("border-color","red");
        console.log("Customer Name is empty");
        $("#txtCustomerIName").focus();
        return false;
    } else if ($.trim(address).length == 0){
        $("#txtCustomerIName").css("border-color","lightgrey");
        $("#txtCustomerAddress").css("border-color","red");
        console.log("Customer Address is empty");
        $("#txtCustomerAddress").focus();
        return false;
    }else {
        $("#txtCustomerID").css("border-color","lightgrey");
        $("#txtCustomerIName").css("border-color","lightgrey");
        $("#txtCustomerAddress").css("border-color","lightgrey");
        return true;
    }
};

function checkValidate(id,name,address) {
    var validateID =  /^[A-Za-z0-9]+$/;
    var validateName = /^[A-Za-z]+$/;
    var validateAddress = /^[A-Za-z0-9]+$/;

    if (!validateName.test(name)){
        $("#txtCustomerIName").css("border-color","red");
        $("#txtCustomerIName").focus();
        alert("incorrect name");
        return false;
    }else if (!validateAddress.test(address)){
        grey();
        $("#txtCustomerAddress").css("border-color","red");
        $("#txtCustomerAddress").focus();
        alert("incorrect address");
        return false;
    }else if (!validateID.test(id)){
        grey();
        alert("incorrect cutsomer ID");
        $("#txtCustomerID").focus();
        $("#txtCustomerID").css("border-color","red");
        return false;
    }else if($.trim(id).length != 4){
        grey();
        alert("you must enter charcter 4");
        $("#txtCustomerID").focus();
        $("#txtCustomerID").css("border-color","red");
        return false;
    }else {
        console.log("validate Success");
        grey();
        return true;
    }
}

function addCustomer(id, name, address) {
    customers.push({
        id: id,
        name: name,
        address: address
    });
}

function getAllCustomers() {
    return customers;
}

function deleteCustomer(id) {
    // var tempCustomer= new CustomerDTO(id,name,address);
    // customers.pop(tempCustomer);
    var tempArray=getAllCustomers();

    for(var i=0;i<tempArray.length;i++) {
        var customerID = tempArray[i].id;
        if (customerID == id) {
            customers.pop(tempArray[i]);
            return;
        }
    }
}

function reload() {
    var tempArray=getAllCustomers();
    $('#tbody').empty();
    alert("customer length : "+tempArray.length);
    for(var i=0;i<tempArray.length;i++){
        var customerID=tempArray[i].id;
        var customerName=tempArray[i].name;
        var customerAddress=tempArray[i].address;

        var row="<tr>" +
            "<td>"+customerID+"</td>" +
            "<td>"+customerName+"</td>" +
            "<td>"+customerAddress+"</td>" +
            "<td><img src='images/recyclebin.png' width='30px'> </td>" +
            "</tr>";
        $('#tbody').append(row);

        $("#tbody tr td:last").click(function () {
            console.log("clicked")
            var id= $(this).parent().children().first().text();
            console.log("id : " +id);
            deleteCustomer(id);
            $(this).parent().fadeOut(500);
        });
    }
}

function grey() {
    $("#txtCustomerID").css("border-color","lightgrey");
    $("#txtCustomerIName").css("border-color","lightgrey");
    $("#txtCustomerAddress").css("border-color","lightgrey");
}
$("#txtCustomerID").click(function () {
    grey();
});
$("#txtCustomerIName").click(function () {
    grey();
});
$("#txtCustomerAddress").click(function () {
    grey();
});
