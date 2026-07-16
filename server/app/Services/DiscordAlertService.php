<?php

namespace App\Services;

use App\Models\Team;
use Illuminate\Support\Facades\Http;

class DiscordAlertService
{
    public static function send(Team $team, string $title, string $description, string $status = 'info')
    {
        $webhookUrl = $team->discord_webhook_url;

        if (!$webhookUrl) {
            return;
        }

        $color = match ($status) {
            'danger' => 15158332,
            'success' => 3066993,
            default => 3447003,
        };

        $payload = [
            'embeds' => [
                [
                    'title' => $title,
                    'description' => $description,
                    'color' => $color,
                    'timestamp' => now()->toIso8601String(),
                    'footer' => [
                        'text' => 'PulseTask Engine',
                    ]
                ]
            ]
        ];

        Http::post($webhookUrl, $payload);
    }
}