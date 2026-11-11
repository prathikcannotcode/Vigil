package example.tamarind.device

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import com.google.android.gms.location.LocationServices
import example.tamarind.api.DeviceApi
import example.tamarind.api.LocationRow
import kotlinx.coroutines.tasks.await
import java.time.Instant
import java.util.concurrent.TimeUnit

class LocationSyncWorker(context: Context, params: WorkerParameters) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        val location = LocationServices.getFusedLocationProviderClient(applicationContext).lastLocation.await()
            ?: return Result.retry()
        DeviceApi.get(applicationContext).postLocation(
            LocationRow(location.latitude, location.longitude, location.accuracy, Instant.now()),
        )
        return Result.success()
    }

    companion object {
        fun schedule(context: Context) {
            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                "location-sync",
                ExistingPeriodicWorkPolicy.KEEP,
                PeriodicWorkRequestBuilder<LocationSyncWorker>(6, TimeUnit.HOURS).build(),
            )
        }
    }
}
