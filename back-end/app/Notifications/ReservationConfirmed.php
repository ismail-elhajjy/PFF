<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReservationConfirmed extends Notification
{
    use Queueable;
    protected $reservation;

    public function __construct($reservation)
    {
        $this->reservation = $reservation;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Reservation Confirmed - AtlasAds')
            ->greeting('Hello '.$notifiable->name.'!')
            ->line('Your reservation for "'.$this->reservation->billboard->title.'" has been confirmed.')
            ->action('View My Reservations', url('/profile'))
            ->line('Thank you for choosing AtlasAds!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $clientName = $this->reservation->user?->name ?? 'a client';
        $billboardTitle = $this->reservation->billboard?->title ?? 'a billboard';

        return [
            'message' => 'New reservation from '.$clientName.' for "'.$billboardTitle.'"',
            'reservation_id' => $this->reservation->id,
            'billboard_title' => $billboardTitle,
            'client_name' => $clientName,
            'amount' => $this->reservation->total_price,
        ];
    }
}
