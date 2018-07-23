package model;

import android.app.Activity;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.BaseAdapter;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.example.kamran.hackathon.R;

import java.util.ArrayList;

/**
 * Created by Petlams on 2017-08-27.
 */

public class CardsAdapter extends BaseAdapter {

    private Context context;
    private ArrayList<RowItem> rowItems;

    public CardsAdapter(Context context, ArrayList<RowItem> rowItems){
        this.context = context;
        this.rowItems = rowItems;
    }

    @Override
    public int getCount() {
        return rowItems.size();
    }

    @Override
    public Object getItem(int position) {
        return rowItems.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if (convertView == null) {
            LayoutInflater mInflater = (LayoutInflater)
                    context.getSystemService(Activity.LAYOUT_INFLATER_SERVICE);
            convertView = mInflater.inflate(R.layout.cardlist_view, null);
            if(position>1){
                /*if((position-1)%2>0){
                    LinearLayout lay=(LinearLayout)convertView.findViewById(R.id.layoutBack);
                    lay.setBackgroundColor(0x00EEEEEE);
                }*/
            }

        }

        TextView serialNumber = (TextView) convertView.findViewById(R.id.cardSN);
        TextView cardSerial = (TextView) convertView.findViewById(R.id.cardSerial);
        TextView Date = (TextView) convertView.findViewById(R.id.transDate);


        if(position != 0){
            serialNumber.setText(String.valueOf(position));
        } else {
            serialNumber.setText("");
        }

        cardSerial.setText(rowItems.get(position).getCardSerial());
        Date.setText(rowItems.get(position).getDate());



        return convertView;
    }
}