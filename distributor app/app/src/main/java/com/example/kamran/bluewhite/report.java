package com.example.kamran.bluewhite;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.CardView;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Spinner;
import android.widget.TextView;

import customfonts.MyTextView;
import model.SessionManager;

public class report extends AppCompatActivity implements AdapterView.OnItemSelectedListener{

    TextView cancelpayment;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_report);

        //TextView failed = (TextView)findViewById(R.id.failed);
        //TextView successful = (TextView)findViewById(R.id.successful);
        TextView updatedDate = (TextView)findViewById(R.id.updatedDate);
        String[] bankNames={"Select Product","Laura- Domestic Soap","Super Size - Laura- Domestic Soap","Kiddo - Medium Body Scrub","Fayte -  Lotion","Master Swag - Finna"};
        Spinner spin = (Spinner) findViewById(R.id.RProductId);
        spin.setOnItemSelectedListener(this);

//Creating the ArrayAdapter instance having the bank name list
        ArrayAdapter aa = new ArrayAdapter(this,android.R.layout.simple_spinner_item,bankNames);
        aa.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
//Setting the ArrayAdapter data on the Spinner
        spin.setAdapter(aa);
        //TextView feedstats = (TextView)findViewById(R.id.seniorStaffs);
        //cancelpayment = (TextView)findViewById(R.id.cancel);
       // CardView cardTap = (CardView)findViewById(R.id.CARD_TapNFC);

       /* cardTap.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getApplicationContext(), amount.class);
                startActivity(intent);
            }
        });*/


        /*cancelpayment.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getApplicationContext(), main.class);
                startActivity(intent);
            }
        });*/


        updatedDate.setText("Last Updated at : "+new SessionManager(report.this).getLastUpdatedDate());
       // feedstats.setText(new SessionManager(report.this).getFeedStats().replaceAll("[{}\"]","").replace(":",": ").replace(",","\n\t"));
      //  failed.setText("Failed Cards : "+new SessionManager(report.this).getFailureCount());
       // successful.setText("Successful Cards : "+new SessionManager(report.this).getSuccessfulCount());
    }

    @Override
    public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {

    }

    @Override
    public void onNothingSelected(AdapterView<?> adapterView) {

    }
}
