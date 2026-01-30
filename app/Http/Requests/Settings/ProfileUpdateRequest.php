<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],

            'phone' => ['nullable', 'string', 'max:20'],

            'date_of_birth' => ['nullable', 'date', 'before_or_equal:today'],

            'next_of_kin_name' => ['nullable', 'string', 'max:255'],
            'next_of_kin_phone' => ['nullable', 'string', 'max:20'],
            'next_of_kin_gender' => ['nullable', 'string', 'max:20'],
            'next_of_kin_date_of_birth' => ['nullable', 'date', 'before_or_equal:today'],
            'next_of_kin_relationship' => ['nullable', 'string', 'max:255'],
            'next_of_kin_address' => ['nullable', 'string', 'max:255'],
        ];
    }
}
