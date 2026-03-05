<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function validateData(Request $request){
       $validated = $request->validate([
        'fullname' => 'required|min:3',
        'email' => 'required|email',
        'message' => 'required|max:1000',
        ]);
        
        Contact::create($validated);
        return response()->json(['message' => 'Message sent successfully!'], 201);

    }
}
