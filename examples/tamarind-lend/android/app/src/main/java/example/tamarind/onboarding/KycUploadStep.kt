package example.tamarind.onboarding

import example.tamarind.api.KycApi

/** Onboarding step 5: identity and address proof. */
class KycUploadStep(private val api: KycApi) {

    val documentTypes = listOf("aadhaar", "passport", "voter_id", "driving_licence")

    val instructions = mapOf(
        "aadhaar" to "Take clear photos of the front and back of your Aadhaar card. Make sure all four corners are visible.",
        "passport" to "Take clear photos of the first and last pages of your passport.",
        "voter_id" to "Take clear photos of the front and back of your voter ID.",
        "driving_licence" to "Take clear photos of the front and back of your driving licence.",
    )

    suspend fun submit(applicationId: Long, docType: String, front: ByteArray, back: ByteArray) =
        api.uploadOvd(applicationId, docType, front, back)
}
