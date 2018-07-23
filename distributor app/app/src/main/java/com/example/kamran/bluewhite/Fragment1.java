package com.example.kamran.bluewhite;


import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.example.kamran.bluewhite.data.LogModel;

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
        models.add(new LogModel("1", "Olamide Afolabi", "08035870063"));
        models.add(new LogModel("2", "Michael Oluwole", "08012345678"));
        models.add(new LogModel("3", "Ade Ola", "08035601234"));

        return models;
    }

}
