package com.example.kamran.hackathon;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
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
import com.example.kamran.hackathon.data.LogModel;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import model.Constants;
import model.SessionManager;
import model.Utils;

public class signup extends AppCompatActivity
{
    ImageView sback;
    RecyclerView recyclerView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup);

        recyclerView = (RecyclerView) findViewById(R.id.recyclerview);
        LinearLayoutManager layoutManager = new LinearLayoutManager(this);

        recyclerView.setLayoutManager(layoutManager);
        recyclerView.setAdapter(new NotifAdapter(this, getNotifs()));

       /* sback = (ImageView)findViewById(R.id.sback);
        sback.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                Intent it = new Intent(signup.this, main.class);
                startActivity(it);
            }
        });*/
    }

    private ArrayList<LogModel> getNotifs() {
        ArrayList<LogModel> models = new ArrayList<>();

        models.add(new LogModel("New product! Check it out", null, null));
        models.add(new LogModel("Open an account in minutes", null, null));
        models.add(new LogModel("Credit line opportunity", null, null));
        models.add(new LogModel("New credit score! Score: 5/20", null, null));


        return models;
    }

}
