'use strict'

$(document).ready(function () {
  initTable();
});

$('#productForm').on("submit", function (e) {
  e.preventDefault();
  var $this = $(this);

  var alertEl = $this.find('.alert');
  alertEl.css('display', 'none');
  $this.find('input').removeClass('is-invalid');

  buttonLoading('#btn-submit');
  $.ajax({
    beforeSend: function (xhr) {
      xhr.setRequestHeader("X-CSRF-TOKEN", $('meta[name="csrf-token"]').attr('content'));
    },
    url: $this.attr('action'),
    data: $this.serialize(),
    type: $this.attr('method'),
    complete: function () {
      initTable();
    },
    success: function (res) {
      buttonUnloading('#btn-submit');
      alertEl.css('display', 'none');
      $this.find('input').removeClass('is-invalid');
      $('#productForm').trigger("reset");
      $.toast({
        heading: 'Success!',
        text: res.message,
        icon: 'success',
        loader: false,
        hideAfter: 2000,
        position: 'top-right',
        afterHidden: function () {
        }
      });
    },
    error: function (err) {
      if (err.status == 422) { // when status code is 422, it's a validation issue
        // display errors on each form field
        $.each(err.responseJSON.errors, function (i, error) {
          alertEl.find('.error-list').html('<li><strong>' + error[0] + '</strong></li>');
          alertEl.css('display', 'block');
          $this.find('input[name="' + i + '"]').addClass('is-invalid');
        });
        buttonUnloading('#btn-submit');
      }
    }
  });
});

function initTable() {
  $('#product-table').DataTable({
    "bDestroy": true,
    "bAutoWidth": false,
    "bLengthChange": false,
    "bFilter": false,
    "bInfo": false,
    "bPaginate": false,
    "ordering": false
  });

  let loadingSpinner = `<div class="d-flex justify-content-center">
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>`;

  $('#product-table tbody').css('display', 'table-caption')
  $('#product-table tbody').html(loadingSpinner);

  var rowTable = '';

  $.ajax({
    beforeSend: function (xhr) {
      xhr.setRequestHeader("X-CSRF-TOKEN", $('meta[name="csrf-token"]').attr('content'));
    },
    url: BASE_URL + '/product/load',
    type: 'get',
    complete: function () {
      $('#product-table tbody').css('display', 'revert')
      $('#product-table tbody').html(rowTable);
    },
    success: function (res) {

      let products = res.data.products;
      var totalAmount = 0;
      for (let i = 0; i < products.length; i++) {
        const single = products[i];
        let totalValue = single.price * single.quantity;
        totalAmount += totalValue;
        rowTable += `<tr id="${single.id}" data-product="${single.id}">
            <td class="text-center name-col">
                ${single.name}
            </td>
            <td class="text-center quantity-col">
                ${single.quantity}
            </td>
            <td class="text-center price-col">
                ${formatDollar(single.price)}
            </td>
            <td class="text-center created-col">
                ${single.created_at}
            </td>
            <td class="text-center">
                ${formatDollar(totalValue)}
            </td>
            <td class="text-center">
                <a href="#" class="btn btn-sm btn-info" onClick="editRow(this)"><i class="fa-solid fa-pencil"></i></a>
                <a href="#" class="btn btn-sm btn-danger" onClick="confirmDelete(${single.id})"><i class="fa-solid fa-trash"></i></a>
            </td>
        </tr>`;
      }
      $('#totalPrice').html(formatDollar(totalAmount));

    },
    error: function (err) {

    }
  });
}

function editRow(e){
    let row = $(e).closest('tr');
    let backupData = {
        id: row.attr('id'),
        name: row.find('.name-col').text().trim(),
        quantity: row.find('.quantity-col').text().trim(),
        price: row.find('.price-col').text().trim().replace(/[$,]/g, ''),
        created_at: row.find('.created-col').text().trim()
    };
    
    let jsonBackup = JSON.stringify(backupData);
    
    let newRow = `<td class="text-center name-col">
        <input type="text" class="form-control" name="name" value="${row.find('.name-col').text().trim()}">
    </td>
    <td class="text-center quantity-col">
        <input type="number" class="form-control" name="quantity" value="${row.find('.quantity-col').text().trim()}">
    </td>
    <td class="text-center price-col">
        <input type="number" class="form-control" name="price" value="${row.find('.price-col').text().trim().replace(/[$,]/g, '')}">
    </td>
    <td class="text-center">
        
    </td>
    <td class="text-center">
        
    </td>
    <td class="text-center">
        <input type="hidden" name="backupData" value="${btoa(jsonBackup)}">
        <button class="btn btn-sm btn-success" onClick="saveRow(this)"><i class="fa-solid fa-check"></i></button>
        <button class="btn btn-sm btn-secondary" onClick="cancelEdit(this)"><i class="fa-solid fa-xmark"></i></button>
    </td>`;

    row.html(newRow);
}

function cancelEdit(e){
    let row = $(e).closest('tr');
    let backupData = JSON.parse(atob(row.find('input[name="backupData"]').val()));
    
    let newRow = `<td class="text-center name-col">
        ${backupData.name}
    </td>
    <td class="text-center quantity-col">
        ${backupData.quantity}
    </td>
    <td class="text-center price-col">
        ${formatDollar(backupData.price)}
    </td>
    <td class="text-center">
        ${backupData.created_at}
    </td>
    <td class="text-center">
        ${formatDollar(backupData.quantity * backupData.price)}
    </td>
    <td class="text-center">
        <a href="#" class="btn btn-sm btn-info" onClick="editRow(this)"><i class="fa-solid fa-pencil"></i></a>
        <a href="#" class="btn btn-sm btn-danger" onClick="confirmDelete(${backupData.id})"><i class="fa-solid fa-trash"></i></a>
    </td>`;

    
    row.html(newRow);
}
function saveRow(e){
    let row = $(e).closest('tr');
    let backupData = JSON.parse(atob(row.find('input[name="backupData"]').val()));

    let name = row.find('input[name="name"]').val();
    let quantity = row.find('input[name="quantity"]').val();
    let price = row.find('input[name="price"]').val();

    if(name == '' || quantity == '' || price == ''){
        $.toast({
            heading: 'Error!',
            text: 'All fields are required',
            icon: 'error',
            loader: false,
            hideAfter: 2000,
            position: 'top-right'
        });
        return;
    }

    buttonLoading(e);
    $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-CSRF-TOKEN", $('meta[name="csrf-token"]').attr('content'));
        },
        url: BASE_URL + '/product/update',
        type: 'post',
        data: {
            id: backupData.id,
            name: name,
            quantity: quantity,
            price: price
        },
        success: function (res) {
            buttonUnloading(e);
            initTable();
            $.toast({
                heading: 'Success!',
                text: res.message,
                icon: 'success',
                loader: false,
                hideAfter: 2000,
                position: 'top-right'
            });
        },
        error: function (err) {
        }
    });
} 

function confirmDelete(id){
    Swal.fire({
      title: 'Are you sure?',
      text: "Deleted data cannot be revert",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct(id);
      }
    });
}
function deleteProduct(id) {
  let request = $.ajax({
    beforeSend: function (xhr) {
      xhr.setRequestHeader("X-CSRF-TOKEN", $('meta[name="csrf-token"]').attr('content'));
    },
    url: BASE_URL + "/product/delete",
    type: "post",
    data: {
      'id': id,
    },
    success: function (res) {
      $.toast({
        heading: 'Success!',
        text: `Product Deleted!`,
        icon: 'success',
        loader: false,
        hideAfter: 2000,
        position: 'top-right',
        afterHidden: function () {
          // window.location = '/';
        }
      });
    },
    error: function (res) {

    },
    complete: function () {
      initTable();
    }
  });
}