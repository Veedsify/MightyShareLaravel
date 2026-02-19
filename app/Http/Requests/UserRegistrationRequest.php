<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRegistrationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'phone' => ['required', 'string', 'regex:/^(\+234|0)[789][01]\d{8}$/'],
            'password' => ['required', 'string', 'min:8'],
            'package_id' => ['required', 'integer', 'exists:thrift_packages,id'],
            'referral_code' => ['nullable', 'string', 'max:255', 'exists:users,referral_id'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Full name is required',
            'name.string' => 'Full name must be a valid string',
            'name.max' => 'Full name cannot exceed 255 characters',

            'email.required' => 'Email address is required',
            'email.email' => 'Please provide a valid email address',
            'email.unique' => 'Sorry this account already exists',
            'email.max' => 'Email address cannot exceed 255 characters',

            'phone.required' => 'Phone number is required',
            'phone.regex' => 'Please provide a valid Nigerian phone number',

            'password.required' => 'Password is required',
            'password.min' => 'Password must be at least 8 characters long',

            'package_id.required' => 'Please select a package',
            'package_id.integer' => 'Invalid package selection',
            'package_id.exists' => 'Selected package does not exist',

            'referral_code.string' => 'Referral code must be a valid string',
            'referral_code.max' => 'Referral code cannot exceed 255 characters',
            'referral_code.exists' => 'The referral code is invalid or does not exist',
        ];
    }
}
