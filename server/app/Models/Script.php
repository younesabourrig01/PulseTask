<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Team;
use App\Models\ScriptRun;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Script extends Model
{
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function scriptruns(): HasMany
    {
        return $this->hasMany(ScriptRun::class);
    }
}
