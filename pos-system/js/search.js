$(window).on('load',function () {
    loadTable();
});

function loadTable() {

    $('#tblSearch tbody tr').remove();

    for(var i=0; i<orders.length; i++){
        var cname = "";
        for(var j=0; j<customer.length; j++){
            if(customer[j].id == orders[i].cusId){
                cname = customer[j].name;
            }
        }
        var totPrice = 0;
        for(var j=0; j<orderDetails.length; j++){
            if(orderDetails[j].orderId == orders[i].oid){
                totPrice += parseFloat(orderDetails[j].unitPrice) * parseInt(orderDetails[j].qty);
            }
        }
        $('#tblSearch tbody').append(
            '<tr>' +
            '<td>'+orders[i].oid+'</td>' +
            '<td>'+orders[i].odate+'</td>' +
            '<td>'+cname+'</td>' +
            '<td>'+totPrice+'</td>' +
            '</tr>'
        );
        $('#tblSearch tbody tr').last().click(function () {
            console.log(this);
            showDetails($(this));
        });
    }
}

function showDetails(id){
    $('#tblOrderedItems tbody tr').remove();
    var code = $(id.children('td')[0]).text();
    for(var i=0; i<orderDetails.length; i++){
        if(orderDetails[i].orderId == code){
            $('#tblOrderedItems tbody').append(
                '<tr>' +
                '<td>'+ orderDetails[i].itemCode +'</td>' +
                '<td>description</td>' +
                '<td>'+orderDetails[i].unitPrice+'</td>' +
                '<td>'+orderDetails[i].qty+'</td>' +
                '<td>'+parseInt(orderDetails[i].qty) * parseFloat(orderDetails[i].unitPrice)+'</td>' +
                '</tr>'
            );
        }
    }
}

$('#txtSearchText').keyup(function () {
    var searchVal = $('#txtSearchText').val();
    if(searchVal.length == 0){
        loadTable();
    }else{
        $('#tblSearch tbody tr').hide();
        // $( 'td:contains('+searchVal+')' ).parent('tr').css('background-color','blue');
        $( 'td:contains('+searchVal+')' ).parent('tr').show();

    }
});