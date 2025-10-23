<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;

class ResetPasswordNotification extends Notification implements ShouldQueue
{
      use Queueable;

      /**
       * The password reset token.
       *
       * @var string
       */
      public $token;

      /**
       * Create a new notification instance.
       *
       * @param  string  $token
       * @return void
       */
      public function __construct($token)
      {
            $this->token = $token;
      }

      /**
       * Get the notification's delivery channels.
       *
       * @param  mixed  $notifiable
       * @return array
       */
      public function via($notifiable)
      {
            return ['mail'];
      }

      /**
       * Get the mail representation of the notification.
       *
       * @param  mixed  $notifiable
       * @return \Illuminate\Notifications\Messages\MailMessage
       */
      public function toMail($notifiable)
      {
            $url = url(route('password.reset', [
                  'token' => $this->token,
                  'email' => $notifiable->getEmailForPasswordReset(),
            ], false));

            $expireMinutes = config('auth.passwords.' . config('auth.defaults.passwords') . '.expire');

            return (new MailMessage)
                  ->subject('Reset Your MightyShare Password')
                  ->view('emails.reset-password', [
                        'actionUrl' => $url,
                        'greeting' => 'Hello ' . $notifiable->name . '! 👋',
                        'expireTime' => $expireMinutes,
                        'notifiable' => $notifiable,
                  ]);
      }

      /**
       * Get the array representation of the notification.
       *
       * @param  mixed  $notifiable
       * @return array
       */
      public function toArray($notifiable)
      {
            return [
                  //
            ];
      }
}
