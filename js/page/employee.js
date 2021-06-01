$(document).ready(function () {
    setEvent();
    loadData(1);
})

function setEvent() {
    
    // Gán sự kiện cho button Add:
    $("#btnAdd").click(function () {
        
        var newCode = getNewEmployeeId();
        //$('#txtEmployeeCode').val($(newCode));
        formMode = 0;
       
    // Hiển thị form thêm mới:
        $('#dlgEmployeeDetail').removeClass('dialog-hide');
        $('#txtEmployeeCode').focus();
        // làm trắng diaglog
        $('.dialog input').val(null);
        $('.dialog select').val(null);
        $('#txtEmployeeCode').val(newCode);
    })

    $(".btn-close").click(function () {
        $('#dlgEmployeeDetail').addClass('dialog-hide');
    })


    $(document).on('dblclick', '#tblListEmployee tbody tr', rowOnDbClick); 

    $('#btnSave').click(function(){
        checkValidate;
        if(checkValidate() == true) {
            btnSaveOnClick();
            $('#mes-alert').addClass('mes-hide');
        }
        else {
           $('#mes-alert').removeClass('mes-hide');

        }
    })

    $(document).on('contextmenu', '#tblListEmployee tbody tr', function(){
        var id = $(this).data('recordId');
        var employeeCode = getEmployee(id).EmployeeCode;
        var trFocus = $(this);
        $(trFocus).addClass('tr-focus');
        $('#alert-text-header').text("XÓA NHÂN VIÊN " + employeeCode);
        $('#text-del').text("Bạn có chắc chắc muốn xóa nhân viên mã " + employeeCode );
        $('#alertDetail').removeClass('alert-hide');
        selectEmployeeId = $(this).data('recordId');
        //console.log(selectEmployeeId);
        $('#sure').click(function(){
            $.ajax({
                method: "DELETE",
                url: `http://api.manhnv.net/v1/Employees/${selectEmployeeId}`,
                async: false,
            }).done(function (response) {
                $('#alertDetail').addClass('alert-hide');
                loadData();

            }).fail(function (response) {
                alert(console.log(response));
                console.log(response);
            })   
        })
        $('#cancel, #alert-close').click(function(){
            $('#alertDetail').addClass('alert-hide');
            $(trFocus).removeClass('tr-focus');
        
        })
    }); 

    // $("#cbbDepartment").change(function() {
    //     //selectId = 1;
    //     var selectionId= $(this).val();
    //     console.log(selectionId);
    //     var data = getData1(selectionId);
    //     console.table(data);
    //     buildDataTableHTML(data);
    // })

}

function getEmployee(id) {
    var employee = null;
    $.ajax({
        method: "GET",
        url: "http://api.manhnv.net/v1/Employees/" + id,
        async: false,
    }).done(function (response) {
        employee = response;
    }).fail(function (response) {
        console.log(response);
    }) 
    return employee;
}
   

var formMode = 0; //0 -thêm; 1- sửa 

function bindingData(employee){
    var newDate = new Date(employee.DateOfBirth);
    var dateString = newDate.getDate();
    var monthString = newDate.getMonth() + 1;
    var year = newDate.getFullYear();
    monthString = monthString < 10 ? `0${monthString}` : monthString;
    dateString = dateString < 10 ? `0${dateString}` : dateString;
    var dobformat = `${year}-${monthString}-${dateString}`;
    
    $('#txtEmployeeCode').val(employee.EmployeeCode);
    $('#txtFullName').val(employee.FullName);
    $('#cbGender').val(employee.Gender);
    $('#dtDateOfBirth').val(dobformat);
    $('#txtPhoneNumber').val(employee.PhoneNumber);
    $('#txtEmail').val(employee.Email);
    $('#cbPositionName').val(employee.PositionId);
    $('#cbDepartmentName').val(employee.DepartmentId);
    $('#txtSalary').val(formatMoney(employee.Salary));
    $('#cbWorkStatus').val(employee.WorkStatus);
    $('#dlgEmployeeDetail').removeClass('dialog-hide');
}

//add KH 
function btnSaveOnClick() {


        var employeeCode = $('#txtEmployeeCode').val()
        var fullName = $('#txtFullName').val()
        var dob = $('#dtDateOfBirth').val()
        var gender = $('#cbGender').val()
        var identityNumber = $('#txtIdentityNumber').val()
        var identityDate = $('#dtIdentityDate').val()
        var identityPlace = $('#txtIdentityPlace').val()
        var email= $('#txtEmail').val()
        var phoneNumber = $('#txtPhoneNumber').val()
        var departmentId = $('#cbDepartment').val()
        var positionId = $('#cbPosition').val()
        var personalTaxCode = $('#txtPersonalTaxCode').val()
        var salary = $('#txtSlary').val()
        var joinDate = $('#dtJoinDate').val()
        var workStatus = $('#cbWorkStatus').val()
        // build thành object
        var employee = {
            "EmployeeCode": employeeCode,
            "FullName": fullName,
            "DateOfBirth": dob,
            "Gender": gender,
            "IentityNumber": identityNumber,
            "IdentityDate": identityDate,
            "IdentityPlace": identityPlace,
            "Email": email,
            "PhoneNumber": phoneNumber,
            "DepartmentId": departmentId,
            "PositionId": positionId,
            "PersonalTaxCode": personalTaxCode,
            "Salary": salary,
            "JoinDate": joinDate,
            "WorkStatus": workStatus,
        }
        
        //gọi service POST để thực hiện cất DL
        console.log(formMode);
        var method = "POST";
        var mes = "Thêm thành công";
        url = "http://api.manhnv.net/v1/Employees";
        if( formMode == 1) {
            method = "PUT";
            url = `http://api.manhnv.net/v1/Employees/${selectEmployeeId}`;
            mes = "Sửa thành công";
        }
        $.ajax({
                method: method,
                url: url,
                data: JSON.stringify(employee),
                contentType: "application/json"
            }).done(function (response) {
                //console.log(selectEmployeeId);
                alert(mes);
                loadData();
            }).fail(function (response) {
                alert(console.log(response));
                console.log(response);
            })
   

        
} 
// sinh mã nhân viên
function getNewEmployeeId() {
    var newCode = null;
    $.ajax({
        method: "GET",
        url: `http://api.manhnv.net/v1/Employees/NewEmployeeCode`,
        async: false,
    }).done(function (response) {
        newCode = response;
    }).fail(function (response) {
        console.log(response);
    }) 
    return newCode;
}
   
function checkValidate(){
    var check = null;
    var employeeCode = $('#txtEmployeeCode').val();
    var fullName = $("#txtFullName").val();
    var identityNum = $('#txtIdentityNumber').val();
    var email = $('#txtEmail').val();
    var phoneNumber = $('#txtPhoneNumber').val();
    if (employeeCode == "" ) {
        document.getElementById('txtEmployeeCode').style.borderColor='red';
        check = false;  
    }
    else {
        document.getElementById('txtEmployeeCode').style.borderColor='#bbb';
    }
    if (fullName == "") {
        document.getElementById('txtFullName').style.borderColor='red';
        check = false;
    }
    else {
        document.getElementById('txtFullName').style.borderColor='#bbb';
    }
    if (identityNum == "") {
        document.getElementById('txtIdentityNumber').style.borderColor='red';
        check = false;
    }
    else {
        document.getElementById('txtIdentityNumber').style.borderColor='#bbb';
    }
    if (email == "") {
        document.getElementById('txtEmail').style.borderColor='red';
        check = false;
    }
    else {
        document.getElementById('txtEmail').style.borderColor='#bbb';
    }
    if (phoneNumber == "") {
        document.getElementById('txtPhoneNumber').style.borderColor='red';
        check = false;
    }
    else {
        document.getElementById('txtPhoneNumber').style.borderColor='#bbb';
    }
    if(employeeCode != "" && fullName != "" && identityNum !="" && email != "" && phoneNumber != "" ) check = true;
    console.log(check);
    return check;
}

function rowOnDbClick() {
    formMode = 1;
    $('#mes-alert').addClass('mes-hide');
    
    $('#dlgEmployeeDetail').removeClass('dialog-hide');
    var recordId = $(this).data('recordId');
    selectEmployeeId = recordId;
    $.ajax({
        method: "GET",
        url: `http://api.manhnv.net/v1/employees/${selectEmployeeId}`,
        async: false,
    }).done(function (response) {
        var employee = response;
        console.log(employee);
        bindingData(employee);
    }).fail(function (response) {
        console.log(response);
    })
    return
}

/**
 * Load dữ liệu nhân viên
 * */
function loadData() {
    // làm trắng trang 
    $('#tblListEmployee tbody').empty();
    // lấy dữ liệu từ Api về;
    
        var data = getData();
        console.table(data);
        buildDataTableHTML(data);
   
}

// function loadData1(selectionId) {
//     console.log(111);
//     alert(selectionId);
//     // làm trắng trang 
//     $('#tblListEmployee tbody').empty();
//     // lấy dữ liệu từ Api về;
//     var data = getData1(selectionId);
//     console.table(data);
//     buildDataTableHTML(data);
// }

/**
 * Hàm thực hiện lấy dữ liệu
 * */
function getData() {
    var employees = null;
    $.ajax({
        method: "GET",
        url: "http://api.manhnv.net/v1/Employees",
        data: null,
        async: false,
        contentType: "application/json"
    }).done(function (response) {
        employees = response;
    }).fail(function (response) {
        alert("Không thể lấy dữ liệu từ Api");
    })
    return employees;
}

// Lấy dữ liệu có điều kiện
// function getData1(id) {
//     var employees = null;
//     $.ajax({
//         method: "GET",
//         url: "http://api.manhnv.net/v1/Employees/" + id,
//         contentType: "application/json"
//     }).done(function (response) {
//         alert(1)
//         employees = response;
//     }).fail(function (response) {
//         alert("Không thể lấy dữ liệu từ Api");
//     })
//     return employees;
// }

/*
 Thực hiện build bảng dữ liệu tương ứng với dữ liệu lấy từ Api
 */
function buildDataTableHTML(data) {
   // $('table#tblListemloyee tbody').html('');
    $.each(data, function (index, employee) {
        var dateOfBirth = employee.DateOfBirth;
        //debugger;
        var dateFormat = formatDateDDMMYYYY(dateOfBirth);
        var trHTML = $(`<tr>
                        <td>${employee.EmployeeCode}</td>
                        <td>${employee.FullName}</td>
                        <td>${employee.GenderName}</td>
                        <td>${dateFormat}</td>
                        <td>${employee.PhoneNumber}</td>
                        <td>${employee.Email}</td>
                        <td>${employee.PositionName}</td>
                        <td>${employee.DepartmentName}</td>
                        <td style="text-align: right">${formatMoney(employee.Salary)}</td>
                        <td>${formatWorkStatus(employee.WorkStatus)}</td>
                        
                    </tr>`);
        trHTML.data('recordId', employee.EmployeeId);
        $('table#tblListEmployee tbody').append(trHTML);
    })
}

function formatWorkStatus(workStatus) {
    if (workStatus == 0) return "Đã nghỉ việc";
    if (workStatus == 1) return "Đang thử việc";
    if (workStatus == 2) return "Đang làm việc";
    
// xử lí lại ngày
}
function formatDateDDMMYYYY(date) {
    if (!date) {
        return "";
    }
    var newDate = new Date(date);
    var dateString = newDate.getDate();
    var monthString = newDate.getMonth() + 1;
    var year = newDate.getFullYear();
    monthString = monthString < 10 ? `0${monthString}` : monthString;
    dateString = dateString < 10 ? `0${dateString}` : dateString
    return `${dateString}/${monthString}/${year}`;
}

// định dạng tiền tệ
function formatMoney(money) {
    var moneyFormat = money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + " VND";;
    return moneyFormat;
}
function formatMoney(money) {
    const formatter = new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: 0
    })
    if (money) {
        return formatter.format(money) // "$1,000.00"
    }
    return "";
}


