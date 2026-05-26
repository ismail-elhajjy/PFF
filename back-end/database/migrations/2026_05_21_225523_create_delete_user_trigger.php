<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        
            DB::unprepared('
            CREATE TRIGGER log_deleted_users
            AFTER DELETE ON users
            FOR EACH ROW
            BEGIN

                INSERT INTO user_logs (
                    deleted_user_id,
                    deleted_user_name,
                    deleted_user_email,
                    deleted_at
                )

                VALUES (
                    OLD.id,
                    OLD.name,
                    OLD.email,
                    NOW()
                );

            END

        ');
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
       DB::unprepared("
            DROP TRIGGER IF EXISTS log_deleted_users
        ");
    }
};
