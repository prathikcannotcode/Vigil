package example.tamarind.onboarding

import example.tamarind.api.KycApi
import example.tamarind.camera.OneShotCamera

/** Onboarding step 3: a liveness selfie, matched against the KYC document photo. */
class SelfieStep(
    private val api: KycApi,
    private val camera: OneShotCamera,
) {

    suspend fun capture(applicationId: Long): Boolean {
        val frames = camera.use { it.captureBurst(frames = 3) }  // camera is released when the burst ends
        return api.submitSelfie(applicationId, frames).livenessPassed
    }
}
