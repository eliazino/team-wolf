package com.example.kamran.hackathon;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.RetryPolicy;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import customfonts.MyEditText;
import customfonts.MyTextView;
import model.Constants;
import model.HttpsTrustManager;
import model.SessionManager;
import model.Utils;

public class signin extends AppCompatActivity {

    ImageView sback;
    MyTextView signIn;
    EditText username, password;
    //ProgressDialog progressDialog;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signin);
        HttpsTrustManager.allowAllSSL();
        Log.d("Usrn", new SessionManager(getApplicationContext()).getUsername());
        if(new SessionManager(getApplicationContext()).getUsername() != ""){
            this.startActivity(new Intent(this,main.class));
            this.finish();
        }

        signIn = (MyTextView)findViewById(R.id.sin);
          username = (EditText)findViewById(R.id.usrusr);

          password = (EditText)findViewById(R.id.pswrd);

        // String mUsername = username.getText().toString();

        //String mPassword = password.getText().toString();

        signIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                new SessionManager(getApplicationContext()).setUsername("159180");

                new SessionManager(getApplicationContext()).setPublicKey("159180");
                Intent intent = new Intent(getApplicationContext(), main.class);
                // intent.putExtra(KEY_USERNAME, username);
                startActivity(intent);
               // this.finish();
               /* if(username.getText().equals("") && password.getText().equals("")){
                    Toast.makeText(getApplicationContext(), "Please fill the required fields", Toast.LENGTH_LONG).show();
                }else{
                    Log.d("Login", username.getText()+" "+password.getText());
                    Login(username.getText().toString(), password.getText().toString());

                }*/


                //Perform Sign In operationa and login on success

            }
        });


        /*sback = (ImageView)findViewById(R.id.sinb);
        sback.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent it = new Intent(signin.this,main.class);
                startActivity(it);
            }
        });*/


    }


    void Login(final String Username, final String Password){
        //Utils.StartProgress(this,"Login..", "Wait for login");
        //Log.d("username :", Username);
        //Log.d("Password :", Password);
        String LOGIN_URL = Constants.API_BASE_URL+"admin/login";
        try {
            // Simulate network access.
            final JSONObject jsonObject = new JSONObject();
            jsonObject.putOpt("username", Username);
            jsonObject.putOpt("password", Password);
            final JSONObject njsonObject = new JSONObject();
            njsonObject.putOpt("data", jsonObject);

            StringRequest stringRequest = new StringRequest(Request.Method.POST, LOGIN_URL,
                    new Response.Listener<String>() {
                        @Override
                        public void onResponse(String response) {

                            Log.d("Response", response);
                            try{
                                JSONObject jsonObject = new JSONObject(response);
                                //Toast.makeText(getApplicationContext(), response, Toast.LENGTH_LONG).show();
                                // Toast.makeText(LoginActivity.this, jsonObject.getJSONObject("success").getString("code"), Toast.LENGTH_LONG).show();
                                if (jsonObject.getJSONObject("success").getString("status").equals("200")) {
                                   // Utils.StopProgress();
                                    openProfile(jsonObject);
                                } else {
                                    Toast.makeText(getApplicationContext(), response, Toast.LENGTH_LONG).show();
                                }

                            }catch (Exception e){

                            }
                        }
                    },
                    new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            Toast.makeText(getApplicationContext(), error.toString(), Toast.LENGTH_LONG).show();
                        }
                    }) {
                @Override
                public String getBodyContentType() {
                    return "application/json; charset=utf-8";
                }

                @Override
                protected Map<String, String> getParams() throws AuthFailureError {
                    Log.d( "Sent", njsonObject.toString());
                    Map<String, String> map = new HashMap<String, String>();
                    map.put("", njsonObject.toString());
                    //map.put("password", password);
                    //map.put("deviceCode",Utils.getDeviceImei(getApplicationContext()));
                    return map;
                }
            };

            int socketTimeout = 25000;//25 seconds - change to what you want
            RetryPolicy policy = new DefaultRetryPolicy(socketTimeout, DefaultRetryPolicy.DEFAULT_MAX_RETRIES, DefaultRetryPolicy.DEFAULT_BACKOFF_MULT);
            stringRequest.setRetryPolicy(policy);
            //queue.add(stringRequest);
            RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());
            requestQueue.add(stringRequest);

        } catch (Exception e) {
            // return false;
        }
    }
    private void openProfile(JSONObject json){
        Log.d("Result", json.toString());
        try {
            JSONObject mjsonObject = json.getJSONObject("content");
            JSONArray mjsonData = mjsonObject.getJSONArray("data");
            //JSONObject arrayObject = mjsonData.


           // Log.d("AllParams123", mjsonObject.getJSONObject("data").getString("merchantID"));
            // Log.d("AllParams123", mjsonObject.toString());
            new SessionManager(getApplicationContext()).setUsername(mjsonData.getJSONObject(0).getString("username"));
           // new SessionManager(getApplicationContext()).createLoginSession( mjsonObject.getJSONObject("data").getString("username"));
            //new SessionManager(getApplicationContext()).setcashierName(mjsonData.getJSONObject(0).getString("fullname"));
            //new SessionManager(getApplicationContext()).setMerchantId(mjsonObject.getJSONObject("data").getString("merchantID"));
            //new SessionManager(getApplicationContext()).setcashierId(mjsonObject.getJSONObject("data").getString("cashierID"));
            new SessionManager(getApplicationContext()).setPublicKey(mjsonData.getJSONObject(0).getString("publicKey"));
        }catch (Exception ex){
            Log.d("Error", ex.getMessage());
            // Toast.makeText(this, ex.getMessage(), Toast.LENGTH_LONG).show();
        }
        //Utils.StopProgress();
        Intent intent = new Intent(getApplicationContext(), main.class);
        // intent.putExtra(KEY_USERNAME, username);
        startActivity(intent);
        this.finish();
    }
}
