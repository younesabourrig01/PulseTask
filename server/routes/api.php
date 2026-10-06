<?php

use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\DashboardController;
use App\Http\Controllers\api\ScriptController;
use App\Http\Controllers\api\ScriptRunController;
use App\Http\Controllers\api\ServerController;
use App\Http\Controllers\api\TeamController;
use App\Http\Controllers\api\UptimeCheckController;
use Illuminate\Support\Facades\Route;

#=========PUBLIC ROUTES==========# 
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password/send-otp', [AuthController::class, 'sendOtp'])->middleware('throttle:5,1');
Route::post('/forgot-password/reset', [AuthController::class, 'resetPassword'])->middleware('throttle:5,1');
#================================#

#====PRIVATE ROUTES==========================================================================================#

Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {

    #--Dashboard endpoint----------------------------------------------------------------------#
    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);

    #--user regulare endpoints-----------------------------------------------------------------#
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::patch('/updatePassword', [AuthController::class, 'updatePassword']);
    Route::delete('/delete_account', [AuthController::class, 'deleteAccount']);
    Route::match(['post', 'patch'], '/update_profile_info', [AuthController::class, 'update']);

    #--Server endpoints:----------------------------------------------------------------------#
    Route::get('/servers', [ServerController::class, 'index']);
    Route::post('/servers', [ServerController::class, 'store']);
    Route::get('/servers/{server}', [ServerController::class, 'show']);
    Route::delete('/servers/{server}', [ServerController::class, 'destroy']);
    Route::patch('/servers/{server}', [ServerController::class, 'update']);
    Route::post('/generate-token', [ServerController::class, 'generateToken']);

    #--Uptime Check endpoints:-----------------------------------------------------------------#
    Route::get('/servers/{server}/uptime-checks', [UptimeCheckController::class, 'index']);
    Route::post('/servers/{server}/uptime-checks', [UptimeCheckController::class, 'store']);
    Route::patch('/uptime-checks/{uptimeCheck}', [UptimeCheckController::class, 'update']);
    Route::delete('/uptime-checks/{uptimeCheck}', [UptimeCheckController::class, 'destroy']);
    Route::post('/uptime-checks/{uptimeCheck}/ping', [UptimeCheckController::class, 'pingNow']);
    Route::get('/servers/{server}/ping-history', [UptimeCheckController::class, 'history']);

    #--script endpoints-----------------------------------------------------------------------#
    Route::get('/scripts', [ScriptController::class, 'index']);
    Route::get('/scripts/{script}', [ScriptController::class, 'show']);
    Route::post('/scripts', [ScriptController::class, 'store']);
    Route::patch('/scripts/{script}', [ScriptController::class, 'update']);
    Route::delete('/scripts/{script}', [ScriptController::class, 'delete']);

    #--run script endpoints--------------------------------------------------------------------#
    Route::get('/script-runs', [ScriptRunController::class, 'index']);
    Route::get('/script-runs/{scriptRun}', [ScriptRunController::class, 'show']);
    Route::get('/scripts/{script}/runs', [ScriptRunController::class, 'scriptRuns']);
    Route::get('/servers/{server}/runs', [ScriptRunController::class, 'serverRuns']);
    Route::post('/run/{script}/on/{server}', [ScriptRunController::class, 'trigger']);
    Route::post('/cli/run-script', [ScriptRunController::class, 'triggerFromCli']);
    Route::get('/cli/run-status/{scriptRun}', [ScriptRunController::class, 'getStatusFromCli']);

    #--Team endpoints--------------------------------------------------------------------------#
    Route::get('/team/about', [TeamController::class, 'teamInfo']);
    Route::post('/team/create', [TeamController::class, 'create']);
    Route::post('/team/join', [TeamController::class, 'joinByCode']);
    Route::post('/team/generate-inv-code', [TeamController::class, 'generateInvCode']);
    Route::post('/team/leave', [TeamController::class, 'leave']);
    Route::delete('/team/delete-team', [TeamController::class, 'deleteTeam']);
    Route::patch('/team/update/{team}', [TeamController::class, 'update']);
});
