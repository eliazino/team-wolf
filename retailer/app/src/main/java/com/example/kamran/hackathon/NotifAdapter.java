package com.example.kamran.hackathon;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.example.kamran.hackathon.data.LogModel;

import java.util.ArrayList;

public class NotifAdapter extends RecyclerView.Adapter<NotifAdapter.RecyclerHolder> {

    private Context context;
    private ArrayList<LogModel> models;

    public NotifAdapter(Context context, ArrayList<LogModel> models) {
        this.context = context;
        this.models = models;
    }

    @Override
    public RecyclerHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.notification_list_item, parent, false);
        return new RecyclerHolder(v);
    }

    @Override
    public void onBindViewHolder(RecyclerHolder holder, int position) {
        LogModel logModel = models.get(position);

        holder.notifBody.setText(logModel.getSn());
    }

    @Override
    public int getItemCount() {
        return models.size();
    }

    class RecyclerHolder extends RecyclerView.ViewHolder {

        private TextView notifBody;

        public RecyclerHolder(View itemView) {
            super(itemView);

            notifBody = (TextView) itemView.findViewById(R.id.notif_body);
        }
    }
}
