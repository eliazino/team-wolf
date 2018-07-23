package com.example.kamran.bluewhite;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.example.kamran.bluewhite.data.LogModel;

import java.util.ArrayList;

public class RecyclerAdapter extends RecyclerView.Adapter<RecyclerAdapter.RecyclerHolder> {

    private Context context;
    private ArrayList<LogModel> models;

    public RecyclerAdapter(Context context, ArrayList<LogModel> models) {
        this.context = context;
        this.models = models;
    }

    @Override
    public RecyclerHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.list_item, parent, false);
        return new RecyclerHolder(v);
    }

    @Override
    public void onBindViewHolder(RecyclerHolder holder, int position) {
        LogModel logModel = models.get(position);

        holder.sn.setText(logModel.getSn());
        holder.field1.setText(logModel.getName());
        holder.field2.setText(logModel.getPhone());
    }

    @Override
    public int getItemCount() {
        return models.size();
    }

    class RecyclerHolder extends RecyclerView.ViewHolder {

        private TextView sn, field1, field2;

        public RecyclerHolder(View itemView) {
            super(itemView);

            sn = (TextView) itemView.findViewById(R.id.sn);
            field1 = (TextView) itemView.findViewById(R.id.field1);
            field2 = (TextView) itemView.findViewById(R.id.field2);
        }
    }
}
