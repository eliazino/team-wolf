package model;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.util.Log;

public class SessionManager {
    // Shared Preferences
    SharedPreferences pref;

    // Editor for Shared preferences
    Editor editor;

    // Context
    Context _context;

    // Shared pref mode
    int PRIVATE_MODE = 0;

    // Sharedpref file name
    private static final String PREF_NAME = "AttendanceAppPref";

    // All Shared Preferences Keys
    private static final String IS_LOGIN = "IsLoggedIn";

    // Token value receive from api (make variable public to access from
    // outside)

   // public static final String KEY_STAFFID = "matric_nb";

    public static final String KEY_USERNAME = "username";

   // public static final String KEY_FULLNAME = "full_name";

   // public static final String KEY_DEPT = "dept";


    private String KEY_CHECKIN = "checkin";
    private String KEY_CHECKOUT = "checkout";
    private String KEY_SYNC_ID = "sync_id";

    // Constructor
    public SessionManager(Context context) {
        this._context = context;
        pref = _context.getSharedPreferences(PREF_NAME, PRIVATE_MODE);
        editor = pref.edit();
    }
    public void createLoginSession( String username){
        // Storing login value as TRUE
        editor.putBoolean(IS_LOGIN, true);

        // Storing email in pref
        //editor.putString(KEY_TOKEN, _token);

        editor.putString(KEY_USERNAME, username);

        // commit changes
        editor.commit();
    }

    public boolean isLoggedIn(){
        return pref.getBoolean(IS_LOGIN, false);
    }

    public String getCHECKIN() {
        return pref.getString(KEY_CHECKIN, "");
    }

    public void setCHECKIN(String CHECKIN) {
        pref.edit().putString(KEY_CHECKIN, CHECKIN).commit();
    }

    public String getCHECKOUT() {
        return pref.getString(KEY_CHECKOUT, "");
    }

    public void setCHECKOUT(String CHECKOUT) {
        pref.edit().putString(KEY_CHECKOUT, CHECKOUT).commit();
    }

    public void setLastSyncId(int id) {
        editor.putInt(KEY_SYNC_ID, id);
        Log.d("Id", id + "");
        editor.commit();
    }

    public int getLastSyncId() {
        Log.d("saved_id", pref.getInt(KEY_SYNC_ID, 0) + "");
        return pref.getInt(KEY_SYNC_ID, 0);
    }
    public String getUsername(){return  pref.getString("username", "");}

    public String setUsername(String username) {
        editor.putString("username", username);
        editor.commit();
        return username;
    }

    public String getSettled(){return  pref.getString("settled", "");}

    public String setSettled(String status) {
        editor.putString("settled", status);
        editor.commit();
        return status;
    }
    public String getSuccessfulCount(){return  pref.getString("successful", "");}
    public String getFailureCount(){return  pref.getString("failed", "");}
    public String getLastUpdatedDate(){return  pref.getString("update", "");}

    public String setSuccessfulCount(String status) {
        editor.putString("successful", status);
        editor.commit();
        return status;
    }
    public String setFailureCount(String status) {
        editor.putString("failed", status);
        editor.commit();
        return status;
    }

    public String setLastUpdatedDate(String date) {
        editor.putString("update", date);
        editor.commit();
        return date;
    }

    public String getFeedStats(){return  pref.getString("feedstats", "");}

    public String setFeedStats(String status) {
        editor.putString("feedstats", status);
        editor.commit();
        return status;
    }



    public String getPublicKey(){return  pref.getString("key", "");}

    public String setPublicKey(String key) {
        editor.putString("key", key);
        editor.commit();
        return key;
    }

    public String getMerchantId() {
        return pref.getString("merchantID", "");
    }

    public String setMerchantId(String merchantid) {
        editor.putString("merchantID", merchantid);
        editor.commit();
        return merchantid;
    }

    public String getcashierId() {
        return pref.getString("cashierID", "");
    }
    public String getcashierName() {
        return pref.getString("cashierName", "");
    }

    public String setcashierId(String cashierid) {
        editor.putString("cashierID", cashierid);
        editor.commit();
        return cashierid;
    }
    public String setcashierName(String cashierid) {
        editor.putString("cashierName", cashierid);
        editor.commit();
        return cashierid;
    }



    /**
     * Check login method wil check user login status If false it will redirect
     * user to login page Else won't do anything
     * */
}
