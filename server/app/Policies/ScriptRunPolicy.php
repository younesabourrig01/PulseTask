<?php

namespace App\Policies;

use App\Models\ScriptRun;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ScriptRunPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return !empty($user->team_id);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ScriptRun $scriptRun): bool
    {
        return $user->team_id === $scriptRun->server->team_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ScriptRun $scriptRun): bool
    {
        return $user->team_id === $scriptRun->script->team_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ScriptRun $scriptRun): bool
    {
        return $user->team_id === $scriptRun->script->team_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ScriptRun $scriptRun): bool
    {
        return $user->team_id === $scriptRun->script->team_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ScriptRun $scriptRun): bool
    {
        return $user->team_id === $scriptRun->script->team_id;
    }
}
