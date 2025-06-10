<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use stdClass;

class ProductController extends Controller
{
    /**
     * store using ajax
     *
     * @param  mixed $request
     * @return json
     */
    public function store(Request $request)
    {
        //validate form
        $request->validate(
            [
                'productName'  => ['required', 'min:5'],
                'quantity'  => ['required', 'numeric', 'min:1'],
                'priceItem'  => ['required', 'numeric']
            ],
            [
                'productName.min' => 'Product Name Minimun: :min characters!'
            ]
        );

        //get old data
        $oldData = Storage::disk('public')->get('products.json');
        $oldData = json_decode($oldData);
        if ($oldData === null) {
            $oldData = [];
        }
        
        //create Product Object
        $product = new stdClass();
        $product->id = count($oldData) + 1;
        $product->name = $request->post('productName');
        $product->quantity = $request->post('quantity');
        $product->price = $request->post('priceItem');
        $product->created_at = date('Y-m-d H:i:s');

        array_push($oldData, $product);

        Storage::disk('public')->put('products.json', json_encode($oldData));

        return response()->json([
            'code' => '200',
            'message' => 'Product Created',
            'data' => []
        ], 200);
    }

    /**
     * Load data
     *
     * @return json
     */
    public function load(Request $request)
    {
        $oldData = Storage::disk('public')->get('products.json');
        $oldData = json_decode($oldData);
        if ($oldData === null) {
            $oldData = [];
        }

        $data = [];
        $data['products'] = $oldData;

        return response()->json([
            'code' => '200',
            'message' => 'Products Loaded',
            'data' => $data
        ], 200);
    }

    /**
     * update
     *
     * @param  mixed $request
     * @return json
     */
    public function update(Request $request)
    {
        //validate form
        $request->validate(
            [
                'id'  => ['required', 'numeric'],
                'name'  => ['required', 'min:5'],
                'quantity'  => ['required', 'numeric', 'min:1'],
                'price'  => ['required', 'numeric']
            ],
            [
                'productName.min' => 'Product Name Minimun: :min characters!'
            ]
        );

        //get old data
        $oldData = Storage::disk('public')->get('products.json');
        $oldData = json_decode($oldData);
        if ($oldData === null) {
            $oldData = [];
        }
        
        foreach ($oldData as $key => $product) {
            if ($product->id == $request->post('id')) {
                $product->name = $request->post('name');
                $product->quantity = $request->post('quantity');
                $product->price = $request->post('price');
                break;
            }
        }
        
        Storage::disk('public')->put('products.json', json_encode($oldData));

        return response()->json([
            'code' => '200',
            'message' => 'Product Updated',
            'data' => []
        ], 200);
    }

    /**
     * delete
     *
     * @param  mixed $request
     * @return json
     */
    public function delete(Request $request)
    {
        //Delete Product
        $oldData = Storage::disk('public')->get('products.json');
        $oldData = json_decode($oldData);
        if ($oldData === null) {
            $oldData = [];
        }

        foreach ($oldData as $key => $product) {
            if ($product->id == $request->post('id')) {
                array_splice($oldData, $key, 1);
                break;
            }
        }

        Storage::disk('public')->put('products.json', json_encode($oldData));

        return response()->json([
            'code' => '200',
            'message' => 'Product Deleted',
            'data' => []
        ], 200);
    }
}
