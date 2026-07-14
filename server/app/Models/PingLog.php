<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\UptimeCheck;
use Illuminate\Database\Eloquent\Prunable;
use Override;

class PingLog extends Model
{
    use Prunable;
    public function prunable()
    {
        return static::where('created_at', '<=', now()->subDays(7));
    }
    protected $fillable = ['uptime_check_id', 'response_time_ms', 'is_up', 'error_message', 'status_code'];
    public function uptimecheck(): BelongsTo
    {
        return $this->belongsTo(UptimeCheck::class);
    }
}
