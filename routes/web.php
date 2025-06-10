<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::group(['prefix' => '/product', 'middleware' => []], function() {
	
	Route::post('/create', [ProductController::class, 'store'])->name('product.create');

	Route::get('/load', [ProductController::class, 'load']);
	Route::post('/edit/{id}', [ProductController::class, 'update']);

	Route::post('/delete', [ProductController::class, 'delete']);
});
