<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('script_runs', function (Blueprint $table) {
            $table->id();
            $table->foreignId("script_id")->constrained("scripts")->cascadeOnDelete();
            $table->foreignId("server_id")->constrained("servers")->cascadeOnDelete();
            $table->foreignId("user_id")->constrained("users")->cascadeOnDelete();
            $table->string("status");
            $table->text("output")->nullable();
            $table->text("error_output")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('script_runs');
    }
};
