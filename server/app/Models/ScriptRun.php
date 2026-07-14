<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Prunable;
use Override;

class ScriptRun extends Model
{
    use Prunable;
    public function prunable()
    {
        return static::where('created_at', '<=', now()->subDays(30));
    }
    public function script(): BelongsTo
    {
        return $this->belongsTo(Script::class);
    }

    public function server(): BelongsTo
    {
        return $this->belongsTo(Server::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
