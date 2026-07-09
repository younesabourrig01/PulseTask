<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Server;
use App\Models\PingLog;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UptimeCheck extends Model
{
    protected $fillable = ['server_id', 'url', 'expected_status_code', 'is_enabled'];

    public function server(): BelongsTo
    {
        return $this->belongsTo(Server::class);
    }

    public function pinglogs(): HasMany
    {
        return $this->hasMany(PingLog::class);
    }
}
