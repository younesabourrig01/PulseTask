<?php
use App\Http\Controllers\api\AuthController;
use Illuminate\Support\Facades\Route;

#-----PUBLIC ROUTES-----# 
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
#-----------------------#

#----PRIVATE ROUTES-----#
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::patch('/updatePassword', [AuthController::class, 'updatePassword']);
    Route::delete('/delete_account', [AuthController::class, 'delete']);
    Route::patch('/update_profile_info', [AuthController::class, 'update']);
});
