package com.example.kamran.hackathon;


import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.example.kamran.hackathon.data.LogModel;

import java.util.ArrayList;


/**
 * A simple {@link Fragment} subclass.
 */
public class Fragment1 extends Fragment {

    private RecyclerView recyclerView;

    public Fragment1() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View v = inflater.inflate(R.layout.fragment_fragment1, container, false);
        recyclerView = (RecyclerView) v.findViewById(R.id.recyclerview);
        recyclerView.setAdapter(new RecyclerAdapter(getActivity(), getLogMessages()));
        recyclerView.setLayoutManager(new LinearLayoutManager(getActivity()));

        return v;
    }
    public ArrayList<LogModel> getLogMessages() {
        ArrayList<LogModel> models = new ArrayList<>();
        models.add(new LogModel("1", "Laura- Domestic Soap", "50"));
        models.add(new LogModel("2", "Kiddo - Medium Body Scrub", "100"));
        models.add(new LogModel("3", "Fayte -  Lotion", "12"));

        return models;
    }

}
