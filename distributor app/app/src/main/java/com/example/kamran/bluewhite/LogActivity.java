package com.example.kamran.bluewhite;

import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import com.rd.PageIndicatorView;

public class LogActivity extends AppCompatActivity {

    private ViewPager viewPager;

    //private PageIndicatorView indicatorView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_log);

        viewPager = (ViewPager) findViewById(R.id.viewpager);
        viewPager.setAdapter(new ViewpagerAdapter(getSupportFragmentManager()));

        //indicatorView = (PageIndicatorView) findViewById(R.id.indicator);
        //indicatorView.setViewPager(viewPager);
    }
}
