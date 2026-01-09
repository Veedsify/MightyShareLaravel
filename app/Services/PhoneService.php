<?php
namespace App\Services;

use libphonenumber\PhoneNumberUtil;
use libphonenumber\PhoneNumberFormat;
use App\Models\User;

class PhoneService
{
    public static function normalize(string $phone, string $region = 'NG'): ?string
    {
        try {
            $util = PhoneNumberUtil::getInstance();
            $proto = $util->parse($phone, $region);
            return $util->isValidNumber($proto)
                ? $util->format($proto, PhoneNumberFormat::E164)
                : null;
        } catch (\Exception $e) {
            return null;
        }
    }

    public static function findUser(string $phone, string $region = 'NG'): ?User
    {
        $e164 = static::normalize($phone, $region);
        return $e164 ? User::where('phone', $e164)->first() : null;
    }
}
