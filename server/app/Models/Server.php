<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Team;
use App\Models\UptimeCheck;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Server extends Model
{
    protected $fillable = ['team_id', 'name', 'ip_address', 'ssh_user', 'ssh_private_key', 'status'];
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function uptimesCheck(): HasMany
    {
        return $this->hasMany(UptimeCheck::class);
    }

    public function scriptsrun(): HasMany
    {
        return $this->hasMany(ScriptRun::class);
    }
}
