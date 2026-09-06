<?php
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\ScriptRunController;
use App\Http\Controllers\api\ServerController;
use App\Models\Script;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\TeamController;

#=========PUBLIC ROUTES==========# 
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password/send-otp', [AuthController::class, 'sendOtp'])->middleware('throttle:5,1');
Route::post('/forgot-password/reset', [AuthController::class, 'resetPassword'])->middleware('throttle:5,1');
#================================#

#====PRIVATE ROUTES==========================================================================================#

Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {

    #--user regulare endpoints-----------------------------------------------------------------#
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::patch('/updatePassword', [AuthController::class, 'updatePassword']);
    Route::delete('/delete_account', [AuthController::class, 'deleteAccount']);
    Route::match(['post', 'patch'], '/update_profile_info', [AuthController::class, 'update']);

    #--Server endpoints:----------------------------------------------------------------------#
    Route::get('/servers', [ServerController::class, 'index']);
    Route::post('/servers', [ServerController::class, 'store']);
    //operations
    Route::get('/servers/{server}', [ServerController::class, 'show']);
    Route::delete('/servers/{server}', [ServerController::class, 'destroy']);
    Route::patch('/servers/{server}', [ServerController::class, 'update']);
    //token generate endpoint
    Route::post('/generate-token', [ServerController::class, 'generateToken']);

    #--script endpoints-----------------------------------------------------------------------#
    Route::get('/scripts', [Script::class, 'index']);
    Route::get('/scripts/{script}', [Script::class, 'show']);
    Route::post('/scripts', [Script::class, 'store']);
    Route::patch('/scripts/{script}', [Script::class, 'update']);
    Route::delete('/scripts/{script}', [Script::class, 'delete']);

    #--run script endpoints--------------------------------------------------------------------#
    //run script in the application interface
    Route::post('/run/{script}/on/{server}', [ScriptRunController::class, 'trigger']);
    //run script from cli 
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
