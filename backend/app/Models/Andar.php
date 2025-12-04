<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Testing\Fluent\Concerns\Has;

class Andar extends Model
{
    use HasFactory;

    protected $fillable = [
        'label',
    ];

    public function quartos() {
        return $this->hasMany(Quarto::class);
    }
}
