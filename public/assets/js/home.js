'use strict'



$(document).ready(function () {
  initTable();

  $('.btn-delete').on('click', function (e) {
    e.preventDefault();
    let productID = $(this).data('id');

    Swal.fire({
      title: 'Are you sure?',
      text: "Deleted data cannot be revert",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTask(productID);
      }
    });

  })
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
      $.toast({
        heading: 'Success!',
        text: res.message,
        icon: 'success',
        loader: false,
        hideAfter: 2000,
        position: 'top-right',
        afterHidden: function () {
          buttonUnloading('#btn-submit');
          alertEl.css('display', 'none');
          $this.find('input').removeClass('is-invalid');
          $('#productForm').trigger("reset");
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
    "bPaginate": true,
    "pageLength": 10,
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
            <td class="text-center">
                ${single.name}
            </td>
            <td class="text-center">
                ${single.quantity}
            </td>
            <td class="text-center">
                ${formatDollar(single.price)}
            </td>
            <td class="text-center">
                ${single.created_at}
            </td>
            <td class="text-center">
                ${formatDollar(totalValue)}
            </td>
        </tr>`;
      }
      $('#totalPrice').html(formatDollar(totalAmount));

    },
    error: function (err) {

    }
  });
}

function deleteTask(id) {
  let request = $.ajax({
    beforeSend: function (xhr) {
      xhr.setRequestHeader("X-CSRF-TOKEN", $('meta[name="csrf-token"]').attr('content'));
    },
    url: "/tasks/delete",
    type: "post",
    data: {
      'id': id,
    },
    success: function (res) {
      $.toast({
        heading: 'Success!',
        text: `Task Deleted!`,
        icon: 'success',
        loader: false,
        hideAfter: 2000,
        position: 'top-right',
        afterHidden: function () {
          window.location = '/tasks';
        }
      });
    },
    error: function (res) {

    },
    complete: function () {

    }
  });
}