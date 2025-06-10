<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>Laravel Test V2</title>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.bunny.net">
  <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

  <!-- Styles / Scripts -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
  <link href="{{ asset('assets/thirdparty/toast/jquery.toast.min.css') }}" rel="stylesheet" />
  
  <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <link rel="stylesheet" href="https://cdn.datatables.net/2.3.2/css/dataTables.dataTables.css" />
  <script src="https://cdn.datatables.net/2.3.2/js/dataTables.js"></script>
  <script src="https://cdn.datatables.net/2.3.2/js/dataTables.bootstrap5.js"></script>
  
  <script src="{{ asset('assets/js/general.js') }}"></script>
  <script type="text/javascript">
        var BASE_URL = "{{ url('/') }}";
  </script>
</head>

<body class="bg-light">

  <div class="container">
    <div class="py-5 text-center">
      <h2>Product Form</h2>
    </div>

    <div class="row">
      <div class="col-md-12">
        <form id="productForm" action="{{ route('product.create') }}" method="POST">
          <div class="alert alert-danger" style="display:none" id="alert"><ul class="error-list"></ul></div>
          @csrf
          <div class="row">
            <div class="col-md-12 mb-3">
              <label for="productName">Product Name</label>
              <input type="text" class="form-control" id="productName" name="productName" placeholder="" value="" required>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 mb-3">
              <label for="quantity">Quantity in stock</label>
              <input type="number" class="form-control" id="quantity" name="quantity" placeholder="" value="" required>
            </div>
          </div>

          <div class="mb-3">
            <label for="priceItem">Price per item</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">$</span>
              </div>
              <input type="number" class="form-control" id="priceItem" name="priceItem" placeholder="0" required>
            </div>
          </div>

          <button id="btn-submit" class="btn btn-primary btn-lg btn-block" type="submit">Save</button>
        </form>

        <hr class="mb-4">

        <table id="product-table" class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Product Name</th>
              <th scope="col">Quantity in stock</th>
              <th scope="col">Price per item</th>
              <th scope="col">Datetime submitted</th>
              <th scope="col">Total value number</th>
            </tr>
          </thead>
          <tbody id="productList">
            <tr>
              <td>Test</td>
              <td>2</td>
              <td>$2.00</td>
              <td>10-06-2025 22:46</td>
              <td>$4.00</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" class="text-end">Total:</td>
              <td id="totalPrice">$0.00</td>
            </tr>
        </table>


      </div>
    </div>

    <footer class="my-5 pt-5 text-muted text-center text-small">
      <p class="mb-1">&copy; 2025 &copy; Jeremy</p>
    </footer>
  </div>

  <script src="{{ asset('assets/thirdparty/toast/jquery.toast.min.js') }}"></script>
  <script src="{{ asset('assets/js/home.js') }}"></script>
</body>

</html>