package example.tamarind.onboarding

import android.Manifest
import example.tamarind.api.OnboardingApi
import example.tamarind.device.LocationSyncWorker

/** Onboarding step 2: ask for the device permissions the next steps use. */
class PermissionsStep(
    private val api: OnboardingApi,
    private val prompter: PermissionPrompter,
) {

    private val rationale = linkedMapOf(
        Manifest.permission.CAMERA to "Take a selfie so we can confirm it's you",
        Manifest.permission.ACCESS_FINE_LOCATION to "Confirm your current city for KYC",
        Manifest.permission.READ_CONTACTS to "Pick two people who know you as references",
        Manifest.permission.READ_CALL_LOG to "Suggest references you talk to often",
        Manifest.permission.ACCESS_BACKGROUND_LOCATION to "Keep your account secure",
    )

    suspend fun run(context: android.content.Context) {
        for ((permission, reason) in rationale) {
            val granted = prompter.request(permission, reason)
            api.recordConsent(purpose = "permission:$permission", granted = granted, noticeVersion = NOTICE_VERSION)
        }
        if (prompter.isGranted(Manifest.permission.ACCESS_BACKGROUND_LOCATION)) {
            LocationSyncWorker.schedule(context)
        }
    }

    companion object {
        const val NOTICE_VERSION = "2026-04"
    }
}
