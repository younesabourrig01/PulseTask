<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;
use App\Models\Server;
use App\Models\Script;

class Team extends Model
{
    protected $fillable = ['name', 'invite_code'];

    public function members(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function servers(): HasMany
    {
        return $this->hasMany(Server::class);
    }

    public function scripts(): HasMany
    {
        return $this->hasMany(Script::class);
    }
}
