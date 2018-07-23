package com.example.kamran.hackathon;

import android.app.AlertDialog;
import android.app.PendingIntent;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.CardView;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.sanwocorelib.SanwoCore;

import java.util.ArrayList;

import model.RowItem;
import model.SessionManager;
import model.TransactionDataSource;
import static android.R.attr.button;



public class main extends AppCompatActivity {


    Button button;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        button = (Button) findViewById(R.id.logout);

        CardView RetailerRegistration = (CardView)findViewById(R.id.CheckIn);
        CardView LogPurchases = (CardView)findViewById(R.id.report);
        CardView FillStocks = (CardView)findViewById(R.id.stock);
       // CardView LogInputs = (CardView)findViewById(R.id.log);
        TextView cashiername = (TextView)findViewById(R.id.cashierName);

       // cashiername.setText(new SessionManager(this).getcashierName());
        LogPurchases.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent rs = new Intent(main.this,amount.class);
                startActivity(rs);
            }
        });
        RetailerRegistration.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent ci = new Intent(main.this,signup.class);
                startActivity(ci);
            }
        });

        FillStocks.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent ci = new Intent(main.this,LogActivity.class);
                startActivity(ci);
            }
        });

        /*LogInputs.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent ci = new Intent(main.this,LogActivity.class);
                startActivity(ci);
            }
        });*/

        //Get All saved Data here at Login



        button.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v) {
                android.support.v7.app.AlertDialog.Builder builder = new android.support.v7.app.AlertDialog.Builder(main.this, R.style.AlertDialogDanger);
                builder.setTitle(R.string.app_name);
                builder.setIcon(R.mipmap.ic_launcher);
                builder.setMessage("Do you want to Logout?")
                        .setCancelable(false)
                        .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int id) {
                                new SessionManager(getApplicationContext()).setUsername("");
                                Intent cj = new Intent(main.this, signin.class);
                                startActivity(cj);
                                finish();
                            }
                        })
                        .setNegativeButton("No", new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int id) {
                                dialog.cancel();
                            }
                        });
                android.support.v7.app.AlertDialog alert = builder.create();
                alert.show();
            }
        });



    }





}


