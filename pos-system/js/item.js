$(window).on('load', function () {
    generateId();
    loadTable();
});

function generateId(){

    if(item.length == 0){
        $('#txtItemCode').val('Item001');
    }else{
        var iid = parseInt(item[item.length-1].code.substr(4))+1;
        var pref = "Item";
        if(iid.toString().length == 1){
            pref = "Item00";
        }else if(iid.toString().length == 2){
            pref = "Item0";
        }
        var id = pref+iid;
        $('#txtItemCode').val(id);
    }
}

$('#btnItemSubmit').click(function () {

    var bool = false;

    if($('#txtItemDescription').val().trim().length == 0){
        $('#txtItemDescription').css('border-color','red');
        $('#txtItemDescription').focus();
        $('#txtItemDescription').select();
        bool = true;
    }

    if($('#txtItemQty').val().trim().length == 0){
        $('#txtName').css('border-color','red');
        $('#txtName').focus();
        $('#txtName').select();
        bool = true;
    }

    if($('#txtItemQty').val().trim().length > 0){
        var regEx = /^\d*$/;
        var val1 = regEx.test($('#txtItemQty').val());
        if(!val1) {
            alert("Please Enter a Number");
            $('#txtItemUnitPrice').css('border-color','red');
            $('#txtItemQty').focus();
            $('#txtItemQty').select();
            bool = true;
        }
    }

    if($('#txtItemUnitPrice').val().trim().length == 0){
        $('#txtItemUnitPrice').css('border-color','red');
        $('#txtItemUnitPrice').focus();
        $('#txtItemUnitPrice').select();
        bool = true;
    }

    if($('#txtItemUnitPrice').val().trim().length > 0){
        var regEx = /^\d*$/;
        var val1 = regEx.test($('#txtItemUnitPrice').val());
        if(!val1) {
            alert("Please Enter a valid Price");
            $('#txtItemUnitPrice').css('border-color','red');
            $('#txtItemUnitPrice').focus();
            $('#txtItemUnitPrice').select();
            bool = true;
        }
    }

    if(bool){
        return;
    }

    if($('#btnItemSubmit').text() == "Submit"){
        item.push(
            {
                code:$('#txtItemCode').val(),
                description:$('#txtItemDescription').val(),
                unitPrice : $('#txtItemUnitPrice').val(),
                qty:$('#txtItemQty').val()
            }
        );
    }else if($('#btnItemSubmit').text() == "Update"){
        for(var i=0; i<item.length; i++){
            if(item[i].code == $('#txtItemCode').val()){
                item[i].description =  $('#txtItemDescription').val();
                item[i].qty =  $('#txtItemQty').val();
                item[i].unitPrice = $('#txtItemUnitPrice').val();
            }
        }
        afterUpdate();
    }

    loadTable();
    clearForm();
});

function afterUpdate() {
    $('#btnItemSubmit').text("Submit");
}

function clearForm(){
    $('#txtItemCode').val("");
    $('#txtItemDescription').val("");
    $('#txtItemQty').val("");
    $('#txtItemUnitPrice').val("");
}

$('#btnNewItem').click(function () {
    generateId();
    $('#txtItemDescription').val("");
    $('#txtItemQty').val("");
    $('#txtItemUnitPrice').val("");
});

function loadTable() {
    $('#tblItem tbody tr').remove();
    for(var i=0; i<item.length; i++){
        $('#tblItem tbody').append('<tr>' +
            '<td>'+ item[i].code+'</td>' +
            '<td>'+ item[i].description +'</td>' +
            '<td>'+ item[i].qty +'</td>' +
            '<td>'+ item[i].unitPrice +'</td>' +
            '<td><i class="fas fa-trash"></i></td>' +
            '</tr>');

        $('#tblItem tbody:last-child').find('i').click(function () {
            console.log('came to delete');
            setInterval(deleteItem($(this),4000));
        });

        $('#tblItem tbody').children().last().click(function () {
            $('#btnItemSubmit').text('Update');
            setSelectedRow($(this));
            $(this).css('background-color','#AED6F1');
        });
    }
}

function setSelectedRow(id){
    $('#txtItemCode').val($(id.children()[0]).text());
    $('#txtItemDescription').val($(id.children('td')[1]).text());
    $('#txtItemQty').val($(id.children('td')[2]).text());
    $('#txtItemUnitPrice').val($(id.children('td')[3]).text());
}

$('#txtItemDescription').keypress(function(){
    $('#txtItemDescription').css('border-color','#ced4da');
});

$('#txtItemQty').keypress(function(){
    $('#txtItemQty').css('border-color','#ced4da');
});

$('#txtItemUnitPrice').keypress(function(){
    $('#txtItemUnitPrice').css('border-color','#ced4da');
});

function deleteItem(id){
    console.log('came to fade delete');
    id.parents('tr').fadeOut('slow',function () {
        var code = $(id.parents('tr').children('td')[0]).text();
        id.parent('tr').remove();
        for(var i=0; i<item.length; i++){
            console.log(item.length);
            if(item[i].code == code){
                item.splice(i,1);
                console.log('Deleted');
                console.log(item.length);
                return;
            }
        }
    });
}

