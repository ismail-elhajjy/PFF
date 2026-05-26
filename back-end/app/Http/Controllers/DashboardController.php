<?php

namespace App\Http\Controllers;

use App\Models\Billboard;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // get just pending and confirmed for statistics
        $totalRevenue = Reservation::whereIn('status', ['confirmed', 'pending'])->sum('total_price');
        $totalBillboards = Billboard::count();
        $activeReservations = Reservation::where('status', 'confirmed')
            ->where('end_date', '>=', now())
            ->count();

        // for charts
        $monthlyRevenue = Reservation::whereIn('status', ['confirmed', 'pending'])
            ->selectRaw('DATE_FORMAT(created_at, "%b") as month, SUM(total_price) as revenue, MONTH(created_at) as month_num')
            ->whereYear('created_at', date('Y'))
            ->groupBy('month', 'month_num')
            ->orderBy('month_num')
            ->get();

        
        $panelTypes = Billboard::selectRaw('type as name, count(*) as value')
            ->groupBy('type')
            ->get();

        $cityDistribution = Billboard::selectRaw('city, count(*) as count')
            ->groupBy('city')
            ->get();

        // last 5 reservations
        $recentReservations = Reservation::with(['user:id,name,email', 'billboard:id,title,city'])
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'stats' => [
                    'total_revenue' => (float)$totalRevenue,
                    'total_billboards' => $totalBillboards,
                    'active_reservations' => $activeReservations,
                    'total_users' => User::count(),
                    'pending_reservations' => Reservation::where('status', 'pending')->count(),
                ],
                'charts' => [
                    'revenue_history' => $monthlyRevenue, 
                    'panel_types' => $panelTypes,      
                    'cities' => $cityDistribution,
                ],
                'recent_reservations' => $recentReservations,
            ]
        ], 200);
    }
}