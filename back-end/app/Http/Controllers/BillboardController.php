<?php

namespace App\Http\Controllers;

use App\Models\Billboard;

class BillboardController extends Controller
{
    public function billboards()
    {
        try {
            $data = Billboard::all();

            return response()->json([
                'success' => true,
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong!',
            ], 500);
        }
    }
}
