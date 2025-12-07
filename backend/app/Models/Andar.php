<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Testing\Fluent\Concerns\Has;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Andar extends Model
{
    use HasFactory;

    protected $fillable = [
        'label',
    ];

    public function quarto() {
        return $this->hasMany(Quarto::class);
    }
}
