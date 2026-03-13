<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();

            $table->string('reference_number');

            $table->unsignedBigInteger('court_id');
            $table->unsignedBigInteger('user_id');

            $table->date('date');
            $table->time('time');

            $table->string('mode'); // day, night, open

            $table->string('status')->default('Pending');
            $table->boolean('is_pending')->default(true);

            $table->timestamps();

            $table->foreign('court_id')->references('id')->on('courts')->cascadeOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();

            $table->unique(['court_id', 'date', 'time']);
        });

        // Schema::create('bookings', function (Blueprint $table) {
        //     $table->id();
        //     $table->unsignedBigInteger('court_id');
        //     $table->unsignedBigInteger('user_id');
        //     $table->date('date');
        //     $table->string('time');
        //     $table->string('status')->default('Pending');
        //     $table->boolean('is_pending')->default(true);
        //     $table->timestamps();

        //     $table->foreign('court_id')->references('id')->on('courts')->cascadeOnDelete();
        //     $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();

        //     $table->unique(['court_id', 'date', 'time']); 
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};