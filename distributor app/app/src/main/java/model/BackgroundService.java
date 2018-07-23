package model;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.app.ProgressDialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.PowerManager;
import android.os.SystemClock;
import android.util.Log;

import com.android.volley.AuthFailureError;
import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.RetryPolicy;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.Format;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static android.content.Context.ALARM_SERVICE;

/**
 * Created by USER on 1/22/2016.
 */
public class BackgroundService extends BroadcastReceiver{
    private String TAG_WAKE_UP="parking_wake_up";
    final public static String ONE_TIME = "onetime";
    private RequestQueue queue;
    private ProgressDialog progressDialog;
    private ProgressDialog pDialog;
    String codes="";
    private int lastId;

    @Override
    public void onReceive(final Context context, Intent intent) {
        //queue = VolleySingleton.getsInstance().getmRequestQueue();

        PowerManager pwm=(PowerManager)context.getSystemService(Context.POWER_SERVICE);
        PowerManager.WakeLock wl = pwm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, TAG_WAKE_UP);
        //Acquire the lock
        wl.acquire();
        pDialog = new ProgressDialog(context);

        //You can do the processing here update the widget/remote views.
        Bundle extras = intent.getExtras();
        StringBuilder msgStr = new StringBuilder();

        if(extras != null && extras.getBoolean(ONE_TIME, Boolean.FALSE)){
            msgStr.append("One time Timer : ");
        }
        Format formatter = new SimpleDateFormat("hh:mm:ss a");
        msgStr.append(formatter.format(new Date()));
        //Toast.makeText(context, "hello there", Toast.LENGTH_SHORT).show();


        //Toast.makeText(context, msgStr, Toast.LENGTH_LONG).show();
        if (Utils.isConnected(context)) {
            TransactionDataSource tds = new TransactionDataSource(context);
            tds.open();
            ArrayList<RowItem> items=tds.getTransactions();
            tds.close();
            Log.d("Count",items.size()+"");
            if (items.size() > 0) {
                SessionManager sessionManager = new SessionManager(context);

                syncTransactions(context);
                tds.close();
            } else {
                //Toast.makeText(context, "No transaction to sync", Toast.LENGTH_LONG).show();
                tds.close();
            }
        } else {
            //Toast.makeText(context, "No internet connection to sync transactions", Toast.LENGTH_LONG).show();
        }

        //Release the lock
        wl.release();

    }





    /*public void StartBAckgroundService(Context context)
    {
        AlarmManager am=(AlarmManager)context.getSystemService(ALARM_SERVICE);
        Intent intent = new Intent(context, BackgroundService.class);
        intent.putExtra(ONE_TIME, Boolean.FALSE);
        PendingIntent pi = PendingIntent.getBroadcast(context, 0, intent, 0);
        //After every 300 seconds
        am.setRepeating(AlarmManager.RTC_WAKEUP, System.currentTimeMillis(), 1000 * 60, pi);
    }*/
    public static void StartBAckgroundService(Context context) {
        Intent i = new Intent(context, BackgroundService.class);

        PendingIntent sender = PendingIntent.getBroadcast(context,0, i, 0);

        // We want the alarm to go off 3 seconds from now.
        long firstTime = SystemClock.elapsedRealtime();
        firstTime += 3 * 1000;//start 3 seconds after first register.

        // Schedule the alarm!
        AlarmManager am = (AlarmManager) context
                .getSystemService(ALARM_SERVICE);
        am.setRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP, firstTime,
                600000, sender);//10min interval

    }

    public long milliseconds(String date)
    {
        //String date_ = date;
        Date d = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try
        {
            Date mDate = sdf.parse(date);
            long timeInMilliseconds = mDate.getTime();
            Log.d("date","Date in milli :: " + timeInMilliseconds);
            return timeInMilliseconds;
        }
        catch (ParseException e)
        {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        return 0;
    }
    String transId;

    private void syncTransactions(final Context context) {
        //final ProgressDialog progressDialog = new ProgressDialog(getActivity());
        //progressDialog.setMessage("Syncing Transactions, please wait");
        //progressDialog.setCancelable(false);
        //progressDialog.show();
        if(Utils.isConnected(context)){
            TransactionDataSource tds=new TransactionDataSource(context);
            tds.open();
            ArrayList<RowItem> mtransactions =  tds.getAttendanceBySynced("0");
            String transdata="";
            String str ="data:[";
            try {
                JSONObject savedObj;
                JSONArray transactions = new JSONArray();
                for (int j = 0; j < mtransactions.size(); j++) {
                    savedObj = new JSONObject();
                    savedObj.putOpt("cardSerial", mtransactions.get(j).getCardSerial());
                    savedObj.putOpt("transDate", milliseconds(mtransactions.get(j).getDate()));
                    savedObj.putOpt("transID", mtransactions.get(j).getRef());
                    transactions.put(savedObj);


                }
                //Log.d("Size", id + "");
                JSONObject mdata = new JSONObject();
                mdata.putOpt("data", transactions);
                    /*jsonObject = new JSONObject();
                    jsonObject.putOpt("transactions", mdata);*/
                Log.d("Sample", mdata.toString());
                Log.d("Username", new SessionManager(context).getUsername());
                Log.d("CashierID", new SessionManager(context).getcashierId());
                transdata  = mdata.toString();
                Log.d("myusername",  new SessionManager(context).getUsername());
            }catch (Exception ex){

            }
            String url = Constants.API_BASE_URL + "cashier/sync/transactions";

            try {
                // Simulate network access.
                final String finalTransdata = transdata;
                StringRequest stringRequest = new StringRequest(Request.Method.POST, url, new com.android.volley.Response.Listener<String>() {

                    @Override
                    public void onResponse(String response) {
                        handleResponse(response, context);
                        Log.d("rResponse", response);
                        //Preocess Responce


                    }
                },
                        new com.android.volley.Response.ErrorListener() {
                            @Override
                            public void onErrorResponse(VolleyError error) {
                               try{
                                    Log.d("Error", error.getMessage());
                                }catch (Exception ex){

                               }
                            }
                        }) {
                    @Override
                    protected Map<String, String> getParams() throws AuthFailureError {
                        Map<String, String> map = new HashMap<String, String>();
                        map.put("cashierUsername", new SessionManager(context).getUsername());
                        map.put("cashierID", new SessionManager(context).getcashierId());
                        map.put("canteenID", new SessionManager(context).getMerchantId());
                        map.put("transactions", finalTransdata);

                        return map;
                    }
                };

                int socketTimeout = 25000;//25 seconds - change to what you want
                RetryPolicy policy = new DefaultRetryPolicy(socketTimeout, DefaultRetryPolicy.DEFAULT_MAX_RETRIES, DefaultRetryPolicy.DEFAULT_BACKOFF_MULT);
                stringRequest.setRetryPolicy(policy);
                //queue.add(stringRequest);
                RequestQueue requestQueue = Volley.newRequestQueue(context);
                requestQueue.add(stringRequest);

            } catch (Exception e) {
                // return false;
            }

        }
    }
    private void handleResponse(String response, Context context) {
        try {
            JSONObject resp = new JSONObject(response);
            JSONObject content = resp.getJSONObject("content");
           /* new SessionManager(context).setSettled(content.getJSONObject("cashierData").getString("settled"));
            new SessionManager(context).setUnSettled(content.getJSONObject("cashierData").getString("unsettled"));
            new SessionManager(context).setFeedStats(content.getJSONObject("FeedStat").toString());
            new SessionManager(context).setLastUpdatedDate(Utils.GetPresentDate());
*/
            syncCards(context);
        }catch (Exception ex){
            Log.d("Error", ex.getMessage());
        }
    }
    public void syncCards(final Context context) {


            String url = Constants.API_BASE_URL + "canteenCashier/getCards";

            try {
                // Simulate network access.
                //final String finalTransdata = transdata;
                StringRequest stringRequest = new StringRequest(Request.Method.POST, url, new com.android.volley.Response.Listener<String>() {

                    @Override
                    public void onResponse(String response) {
                        Log.d("cardResponse", response);
                        handleCardResponse(response, context);
                        //Preocess Responce


                    }
                },
                        new com.android.volley.Response.ErrorListener() {
                            @Override
                            public void onErrorResponse(VolleyError error) {
                                try {
                                    Log.d("Error", error.getMessage());
                                }catch (Exception ex){

                                }
                            }
                        }) {
                    @Override
                    protected Map<String, String> getParams() throws AuthFailureError {
                        Map<String, String> map = new HashMap<String, String>();
                        map.put("username", new SessionManager(context).getUsername());
                        map.put("publicKey", new SessionManager(context).getPublicKey());

                        return map;
                    }
                };

                int socketTimeout = 25000;//25 seconds - change to what you want
                RetryPolicy policy = new DefaultRetryPolicy(socketTimeout, DefaultRetryPolicy.DEFAULT_MAX_RETRIES, DefaultRetryPolicy.DEFAULT_BACKOFF_MULT);
                stringRequest.setRetryPolicy(policy);
                //queue.add(stringRequest);
                RequestQueue requestQueue = Volley.newRequestQueue(context);
                requestQueue.add(stringRequest);

            } catch (Exception e) {
                // return false;
            }

        }
    //public static TinyDB tinyDb;
    private void handleCardResponse(String response, Context context) {
        try{
            JSONObject resp = new JSONObject(response);
            JSONObject content = resp.getJSONObject("content");

            JSONArray cards = content.getJSONArray("cards");
            TinyDB tinyDb  = new TinyDB(context);
            ArrayList<String> nCards = new ArrayList<String>();
            nCards.add("card");
            tinyDb.remove("cards");
            tinyDb.putListString("cards", nCards);

            for(int i=0; i<cards.length(); i++){
                Log.d("cards", cards.getJSONObject(i).getString("cardSerial"));
                nCards.add(cards.getJSONObject(i).getString("cardSerial"));

                //tds.DeleteTransactionList(cards.get(i).toString());
            }
            tinyDb.putListString("cards", nCards);

        }catch (Exception ex){

        }
    }
}

