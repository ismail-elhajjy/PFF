<?php

namespace App\Http\Controllers;

use App\Models\Billboard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class BillboardController extends Controller
{
    // return all billboards
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

    // return one billboard by id
    public function show($id)
    {
        $billboard = Billboard::findOrFail($id);

        return response()->json($billboard);
    }

    // create billboard 
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'city' => 'required|string',
            'zone' => 'required|string',
            'type' => 'required|string',
            'size' => 'required|string',
            'price' => 'required|numeric',
            'is_available' => 'required|boolean',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        try {
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = Str::uuid().'.'.$file->getClientOriginalExtension();
                $file->move(public_path('images/billboards'), $filename);
                $validatedData['image'] = $filename;
            }

            $billboard = Billboard::create($validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Billboard created successfully!',
                'data' => $billboard,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create billboard: '.$e->getMessage(),
            ], 500);
        }
    }

    // update billboard li deja kayna fi db
    public function update(Request $request, Billboard $billboard)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'city' => 'required|string',
            'zone' => 'required|string',
            'type' => 'required|string',
            'size' => 'required|string',
            'price' => 'required|numeric',
            'is_available' => 'required|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        try {
            if ($request->hasFile('image')) {
                $this->deleteBillboardImage($billboard->image);

                $file = $request->file('image');
                $filename = Str::uuid().'.'.$file->getClientOriginalExtension();
                $file->move(public_path('images/billboards'), $filename);
                $validatedData['image'] = $filename;
            }

            $billboard->update($validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Billboard updated successfully!',
                'data' => $billboard->fresh(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update billboard: '.$e->getMessage(),
            ], 500);
        }
    }

    // delete billboard 
    public function destroy(Billboard $billboard)
    {
        try {
            $this->deleteBillboardImage($billboard->image);
            $billboard->delete();

            return response()->json([
                'success' => true,
                'message' => 'Billboard deleted successfully!',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete billboard: '.$e->getMessage(),
            ], 500);
        }
    }

    // delete billboard image
    private function deleteBillboardImage(?string $image): void
    {
        if (! $image) {
            return;
        }

        $publicImagePath = public_path('images/billboards/'.$image);
        $storageImagePath = storage_path('app/public/'.$image);

        if (File::exists($publicImagePath)) {
            File::delete($publicImagePath);
        }

        if (str_starts_with($image, 'billboards/') && File::exists($storageImagePath)) {
            File::delete($storageImagePath);
        }
    }
}

