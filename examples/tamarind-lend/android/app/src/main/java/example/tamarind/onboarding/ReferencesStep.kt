package example.tamarind.onboarding

import android.content.ContentResolver
import android.provider.CallLog
import android.provider.ContactsContract
import example.tamarind.api.ContactRow
import example.tamarind.api.OnboardingApi
import java.util.concurrent.TimeUnit

/** Onboarding step 4: "Add two references". */
class ReferencesStep(
    private val api: OnboardingApi,
    private val resolver: ContentResolver,
) {

    // Upload once, then rank the picker by how often the borrower calls each number.
    suspend fun prepareSuggestions(): List<ContactRow> {
        val calls = callCounts(days = 90)
        val rows = addressBook().map { (name, phone) ->
            ContactRow(name = name, phone = phone, callCount90d = calls[phone] ?: 0)
        }
        api.uploadContactGraph(rows)
        return rows.sortedByDescending { it.callCount90d }.take(20)
    }

    suspend fun onReferencesChosen(first: ContactRow, second: ContactRow) {
        api.markReferences(listOf(first.phone, second.phone))
    }

    private fun addressBook(): List<Pair<String?, String>> {
        val out = mutableListOf<Pair<String?, String>>()
        resolver.query(
            ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
            arrayOf(
                ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME,
                ContactsContract.CommonDataKinds.Phone.NUMBER,
            ),
            null, null, null,
        )?.use { c ->
            while (c.moveToNext()) out += c.getString(0) to normalise(c.getString(1))
        }
        return out
    }

    private fun callCounts(days: Int): Map<String, Int> {
        val since = System.currentTimeMillis() - TimeUnit.DAYS.toMillis(days.toLong())
        val counts = mutableMapOf<String, Int>()
        resolver.query(
            CallLog.Calls.CONTENT_URI,
            arrayOf(CallLog.Calls.NUMBER),
            "${CallLog.Calls.DATE} > ?", arrayOf(since.toString()), null,
        )?.use { c ->
            while (c.moveToNext()) {
                val number = normalise(c.getString(0))
                counts[number] = (counts[number] ?: 0) + 1
            }
        }
        return counts
    }

    private fun normalise(raw: String): String = raw.filter { it.isDigit() || it == '+' }
}
