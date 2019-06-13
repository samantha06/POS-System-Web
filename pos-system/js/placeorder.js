function getAllCustomers() {
    return customers;
}
function getAllItems() {
    return items;
}

var customerArray;
var itemArray;

switch (document.readyState) {
    case "loading":
        customerArray = getAllCustomers();
        itemArray = getAllItems();
        loadCustomerCombo();
        loadItemCombo();
        break;
    default:
        alert("nothing");
}

function loadCustomerCombo() {
    for(var i=0;i<customerArray.length;i++){
        var customerObject=customerArray[i];
        var customerID=customerObject.id;
        $("#selectCustomerID").append("<option>"+customerID+"</option>");
        $("#customerName").text(customerArray[0].name);
    }
}
$("#selectCustomerID").click(function () {
    var selectedCode = $("#selectCustomerID").val();
    for(var i=0;i<customerArray.length;i++){
        var customerObject=customerArray[i];
        var customerID=customerObject.id;
        if (selectedCode == customerID) {
            $("#customerName").text(customerArray[i].name);
        }
    }
});

function loadItemCombo() {
    for(var i=0;i<itemArray.length;i++){
        var itemObject=itemArray[i];
        var itemCode=itemObject.code;
        $("#selectItemCode").append("<option>"+itemCode+"</option>");
        $("#itemName").text(itemArray[0].description);
        $("#itemQty").text(itemArray[0].qtyOnHand);
        $("#itemPrice").text(itemArray[0].unitPrice);
    }
};

$("#selectItemCode").click(function () {
    var selectedCode = $("#selectItemCode").val();
    for(var i=0;i<itemArray.length;i++){
        var itemObject=itemArray[i];
        var itemCode=itemObject.code;
        if (selectedCode == itemCode) {
            $("#itemName").text(itemArray[i].description);
            $("#itemQty").text(itemArray[i].qtyOnHand);
            $("#itemPrice").text(itemArray[i].unitPrice);
        }
    }
});
var total = 0.00;
$("#orderQtyField").keydown(function () {
    var orderItemCode = $("#selectItemCode").val();
    var orderItemDescription = $("#itemName").val();
    var orderItemUnitPrice = $("#itemPrice").val();
    var orderItemQty = $("#orderQtyField").val();
    var amount = orderItemUnitPrice * orderItemQty;
    total = total + amount;
    if (event.which == '13'){
        loadTable(orderItemCode,orderItemDescription,orderItemUnitPrice,orderItemQty,amount);
    }
})

function loadTable(orderItemCode,orderItemDescription,orderItemUnitPrice,orderItemQty,amount) {
    var row="<tr>" +
        "<td>"+orderItemCode+"</td>" +
        "<td>"+orderItemDescription+"</td>" +
        "<td>"+orderItemQty+"</td>" +
        "<td>"+orderItemUnitPrice+"</td>" +
        "<td>"+amount+"</td>" +
        "<td><img src='images/recyclebin.png' width='30px'> </td>" +
        "</tr>";
    $('#tbody').append(row);
}
