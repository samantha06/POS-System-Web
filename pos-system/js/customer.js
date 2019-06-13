$(window).on('load', function () {
    generateId();
    loadTable();
});

function generateId(){
    var cid = parseInt(customer[customer.length-1].id.substr(1))+1;
    var pref = "C";
        if(cid.toString().length == 1){
        pref = "C00";
    }else if(cid.toString().length == 2){
        pref = "C0";
    }
    var id = pref+cid;
    $('#txtCusId').val(id);
}

$('#btnCusSubmit').click(function () {

    var bool = false;
    if($('#txtAddress').val().trim().length == 0){
        $('#txtAddress').css('border-color','red');
        $('#txtAddress').focus();
        $('#txtAddress').select();
        bool = true;
    }
    if($('#txtName').val().trim().length == 0){
        $('#txtName').css('border-color','red');
        $('#txtName').focus();
        $('#txtName').select();
        bool = true;
    }
    if(bool){
        return;
    }

    if($('#btnCusSubmit').text() == "Submit"){
        customer.push(
            {
                id:$('#txtCusId').val(),
                name:$('#txtName').val(),
                address:$('#txtAddress').val()
            }
        );
    }else if($('#btnCusSubmit').text() == "Update"){
        for(var i=0; i<customer.length; i++){
            if(customer[i].id == $('#txtCusId').val()){
                customer[i].name =  $('#txtName').val();
                customer[i].address = $('#txtAddress').val();
            }
        }
        afterUpdate();
    }
    loadTable();
    clearForm();
});

function afterUpdate() {
    $('#btnCusSubmit').text("Submit");
}

function clearForm(){
    $('#txtCusId').val("");
    $('#txtName').val("");
    $('#txtAddress').val("");
}

$('#btnNewCustomer').click(function () {
    generateId();
    $('#txtName').val("");
    $('#txtAddress').val("");
});

function loadTable() {
    $('#tblCustomer tbody tr').remove();
    for(var i=0; i<customer.length; i++){
        $('#tblCustomer tbody').append('<tr>' +
            '<td>'+ customer[i].id+'</td>' +
            '<td>'+ customer[i].name +'</td>' +
            '<td>'+ customer[i].address +'</td>' +
            '<td><i class="fas fa-trash"></i></td>' +
            '</tr>');

        $('#tblCustomer tbody:last-child').find('i').click(function () {
            console.log('came to delete');
            setInterval(deleteCustomer($(this),4000));
        });

        $('#tblCustomer tbody').children().last().click(function () {
            $('#btnCusSubmit').text('Update');
            setSelectedRow($(this));
            $(this).css('background-color','#AED6F1');
        });
    }
}

function setSelectedRow(id){
    $('#txtCusId').val($(id.children()[0]).text());
    $('#txtName').val($(id.children('td')[1]).text());
    $('#txtAddress').val($(id.children('td')[2]).text());
}

$('#txtName').keypress(function(){
    $('#txtName').css('border-color','#ced4da');
});

$('#txtAddress').keypress(function(){
    $('#txtAddress').css('border-color','#ced4da');
});

function deleteCustomer(id){
    console.log('came to fade delete');
    id.parents('tr').fadeOut('slow',function () {
        var code = $(id.parents('tr').children('td')[0]).text();
        id.parent('tr').remove();
        for(var i=0; i<customer.length; i++){
            console.log(customer.length);
            if(customer[i].id == code){
                customer.splice(i,1);
                console.log('Deleted');
                console.log(customer.length);
                return;
            }
        }
    });
}


