<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Team;
use App\Models\Server;

class StartDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //user 1
        User::firstOrCreate([
            'name' => 'user1',
            'team_id' => 1,
            'email' => 'user1@email.com',
            'avatar' => null,
            'password' => bcrypt('user1'),
        ]);

        //user 2
        User::firstOrCreate([
            'name' => 'user2',
            'team_id' => 1,
            'email' => 'user2@email.com',
            'avatar' => null,
            'password' => bcrypt('user2'),
        ]);

        //team 
        Team::firstOrCreate([
            'id' => 1,
            'name' => 'Test Team',
            'invite_code' => '12321312',
        ]);

        //server
        Server::firstOrCreate([
            'team_id' => 1,
            'name' => 'ubuntu server',
            'ip_address' => '182990290',
            'ssh_user' => 'sjx ss cdffmdsodm soddiwdjdmcm',
            'ssh_private_key' => 'sjx ss cdffmdsodm soddiwdjdmcm',
            'status' => 'running'
        ]);
    }
}
