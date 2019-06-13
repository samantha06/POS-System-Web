$("#spnOrderDate").text(new Date().toLocaleDateString());

loadOrderId();
loadAllCustomersIds();
$("#cmbCustomerId").val("");
loadAllItemCodes();
$("#cmbItemCode").val("");

function loadOrderId() {
    var ajaxConfig = {
        method: "GET",
        url: "http://localhost:8080/Order",
        async: true
    }

    $.ajax(ajaxConfig).done(function (Order) {
        console.log("working");
        if (Order == null) {
            $("#spnOrderId").text("1");
        } else {
            var id = Order[Order.length - 1].id + 1;
            $("#spnOrderId").text(id);
        }
    }).fail(function (jqxhr, textStatus, errorMsg) {
        console.log(errorMsg);
    });
}

function loadAllCustomersIds() {
    var ajaxConfig = {
        method: "GET",
        url: "http://localhost:8080/customer",
        async: true
    }

    $.ajax(ajaxConfig).done(function (customers) {

        for (var i = 0; i < customers.length; i++) {
            var id = customers[i].id;
            var html = '<option value="' + id + '">' + id + '</option>';
            $("#cmbCustomerId").append(html);
        }
    }).fail(function (jqxhr, textStatus, errorMsg) {
        console.log(errorMsg);
    });


    $("#cmbCustomerId").change(function () {
        var customerId = $(this).val();
        console.log(customerId);
        var ajaxConfig = {
            method: "GET",
            url: "http://localhost:8080/customer/" + customerId,
            async: true
        }

        $.ajax(ajaxConfig).done(function (customers) {
            $("#lblCustomerName").text(customers.name);
        }).fail(function (jqxhr, textStatus, errorMsg) {
            console.log(errorMsg);
        });
    });
}

function loadAllItemCodes() {
    var ajaxConfig = {
        method: "GET",
        url: "http://localhost:8080/Item",
        async: true
    }

    $.ajax(ajaxConfig).done(function (item) {

        for (var i = 0; i < item.length; i++) {
            var code = item[i].code;
            var html = '<option value="' + code + '">' + code + '</option>';
            $("#cmbItemCode").append(html);
        }
    }).fail(function (jqxhr, textStatus, errorMsg) {
        console.log(errorMsg);
    });


    $("#cmbItemCode").change(function () {
        var itemCode = $(this).val();
        var ajaxConfig = {
            method: "GET",
            url: "http://localhost:8080/Item/" + itemCode,
            async: true
        }

        $.ajax(ajaxConfig).done(function (item) {
            $("#lblDescription").text(item.description);
            $("#lblQtyOnHand").text(item.qtyOnHand);
            $("#lblUnitPrice").text(item.unitPrice);
        }).fail(function (jqxhr, textStatus, errorMsg) {
            console.log(errorMsg);
        });
    });
}

$("#txtQty").keypress(function (eventData) {
    if (eventData.which == 13) {

        var code = $("#cmbItemCode").val();
        var unitPrice = parseFloat($("#lblUnitPrice").text());
        var qty = parseInt($(this).val());
        var description = $("#lblDescription").text();
        var qtyOnHand = parseInt($("#lblQtyOnHand").text());

        if (qty <= 0 && qty > qtyOnHand) {
            alert("Invalid qty. Please enter valid Qty");
            $(this).select();
            return;
        }

        var disabled = $("#cmbItemCode").attr("disabled");
        if (disabled) {

            $("#tblOrderDetails tbody tr td:first-child").each(function () {
                var itemCode = $(this).text();
                if (itemCode == code) {

                    var oldQty = parseInt($(this).parents("tr").find("td:nth-child(3)").text());
                    $(this).parents("tr").find("td:nth-child(3)").text(qty);
                    $(this).parents("tr").find("td:nth-child(5)").text(qty * unitPrice);

                    // var item;

                    var ajaxConfig ={
                        method: "GET",
                        url: "http://localhost:8080/Item" + itemCode,
                        async: true
                    }

                    var ItemQtyOnHand = 0;

                    $.ajax(ajaxConfig).done(function (Item) {
                        // item = Item;
                        ItemQtyOnHand = Item.qtyOnHand;
                        ItemQtyOnHand += oldQty;
                        ItemQtyOnHand = Item.qtyOnHand - qty;
                    }).fail(function (jqxhr,textStatus,errorMsg) {
                        console.log(errorMsg);
                    })

                    // item.qtyOnHand += oldQty;
                    // item.qtyOnHand = item.qtyOnHand - qty;
                }
            });

        } else {
            var isExist = false;
            $("#tblOrderDetails tbody tr td:first-child").each(function () {
                var itemCode = $(this).text();
                if (itemCode == code) {
                    var oldQty = parseInt($(this).parents("tr").find("td:nth-child(3)").text());
                    $(this).parents("tr").find("td:nth-child(3)").text(oldQty + qty);
                    $(this).parents("tr").find("td:nth-child(5)").text(qty * unitPrice);
                    isExist = true;
                }
            });
            if (!isExist) {
                var html = '<tr>' +
                    '<td>' + code + '</td>' +
                    '<td>' + description + '</td>' +
                    '<td>' + qty + '</td>' +
                    '<td>' + unitPrice + '</td>' +
                    '<td>' + qty * unitPrice + '</td>' +
                    '<td><i class="fas fa-trash"></i></td>' +
                    '</tr>';
                $("#tblOrderDetails tbody").append(html);

                $("#tblOrderDetails tbody tr:last-child").click(function () {
                    var code = $(this).find("td:first-child").text();
                    var qty = $(this).find("td:nth-child(3)").text();
                    $("#txtQty").val(qty);
                    $("#cmbItemCode").val(code);
                    $("#cmbItemCode").trigger('change');
                    $("#cmbItemCode").attr('disabled', true);
                });

                $("#tblOrderDetails tbody tr:last-child td:last-child i").click(function () {

                    // var item = items.find(function (item) {
                    //     return item.code == code;
                    // });

                    // var qty = parseInt($(this).parents("tr").find("td:nth-child(3)").text());
                    // item.qtyOnHand += qty;

                    var row = $(this).parents("tr");
                    row.fadeOut(500, function () {
                        row.remove();
                        clearTextFields();
                        calculateTotal();
                    });

                });
            }
            // var item = items.find(function (item) {
            //     return item.code == code;
            // });
            // item.qtyOnHand = item.qtyOnHand - qty;
        }

        clearTextFields();
        calculateTotal();

    }
});

function clearTextFields() {
    $("#cmbItemCode").val("");
    $("#lblDescription").text("");
    $("#lblUnitPrice").text("");
    $("#lblQtyOnHand").text("");
    $("#txtQty").val("");
    $("#cmbItemCode").focus();
    $("#cmbItemCode").attr('disabled', false);
}

function calculateTotal() {
    var total = 0;
    $("#tblOrderDetails tbody tr td:nth-child(5)").each(function () {
        total += parseFloat($(this).text());
    });
    $("#spnTotal").text(total);
}

$("#btnPlaceOrder").click(function () {
    var array = [];
    $("#tblOrderDetails tbody tr").each(function () {
        var orderId = parseInt($("#spnOrderId").text());
        var itemCode = $(this).find("td:first-child").text();
        var qty = parseInt($(this).find("td:nth-child(2)").text());
        var unitPrice = parseFloat($(this).find("td:nth-child(3)").text());

        array.push({ orderId: orderId, itemCode: itemCode, qty: qty,unitPrice: unitPrice });

        var ajaxConfig ={
            method: "GET",
            url: "http://localhost:8080/Item" + itemCode,
            async: true
        }

        var description ="";
        $.ajax(ajaxConfig).done(function (Item) {
            description = Item.description;
        }).fail(function (jqxhr,textStatus,errorMsg) {
            console.log(errorMsg);
        })

        var data = {
            code: itemCode,
            description: description,
            qtyOnHand: qty,
            unitPrice: unitPrice
        };

        var ajaxConfig = {
            method: "PUT",
            url: "http://localhost:8080/Item",
            async: true,
            data: JSON.stringify(data),
            contentType: "application/json"
        }
        $.ajax(ajaxConfig).done(function (response) {
            selectedRowUpdate = $("table tr:nth-child(" + selectedRowUpdate +")");
            $(selectedRowUpdate).find("td:nth-child(2)").text(description);
            $(selectedRowUpdate).find("td:nth-child(3)").text(qtyOnHand);
            $(selectedRowUpdate).find("td:nth-child(4)").text(unitPrice);
            // $("#tblCustomers").refresh();
        }).fail(function (jqxhr,textStatus,errorMsg) {
            console.log(errorMsg);
        });

    });

    
    var data = {
        id: parseInt($("#spnOrderId").text()),
        date: $("#spnOrderDate").text(),
        customerId: parseInt($("#cmbCustomerId").val()),
        orderDetail: array
    };

    var ajaxConfig = {
        method: "POST",
        url: "http://localhost:8080/Order",
        async: true,
        data: JSON.stringify(data),
        contentType: "application/json"
    };

    $.ajax(ajaxConfig).done(function (response) {

        console.log("working order and orderdetail save");

    }).fail(function (xhjqr,textStatus,errorMsg) {
       console.log(errorMsg);
    });



});


