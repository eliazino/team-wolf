package model;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.graphics.drawable.ColorDrawable;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.text.format.Time;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.TextView;

import com.example.kamran.bluewhite.R;

/**
 * Created by Petlams on 2017-08-28.
 */

public class Utils {

    private static Dialog dialog;
    public  static void StartProgress(Activity context, String title, String message){


        dialog = new Dialog(context);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.getWindow().setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));
        LayoutInflater inflater = (LayoutInflater)context.getSystemService                                        (Context.LAYOUT_INFLATER_SERVICE);
        View v = inflater.inflate(R.layout.dialog_layout, null);
        TextView mMessage = (TextView)v.findViewById(R.id.loading_message);
        mMessage.setText(message);
        dialog.setContentView(v);
        dialog.setCancelable(false);
        dialog.show();

        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();

        lp.copyFrom(dialog.getWindow().getAttributes());
        lp.width = 650;
        lp.height = 500;
        dialog.getWindow().setAttributes(lp);

    }

    public static boolean isConnected(Context context){
        ConnectivityManager connMgr = (ConnectivityManager) context.getSystemService(Activity.CONNECTIVITY_SERVICE);
        NetworkInfo netwrokInfo = connMgr.getActiveNetworkInfo();
        if(netwrokInfo != null && netwrokInfo.isConnected())
            return  true;
        else
            return false;
    }

    public static String GetPresentDate(){
        Time today = new Time(Time.getCurrentTimezone());
        today.setToNow();
        int month = today.month + 1;
        String date = today.year + "-" + month + "-" + today.monthDay + " " + today.hour + ":" + today.minute + ":" + today.second;
        return date;
    }

    public  static void  StopProgress(){
        if(dialog!=null){
            dialog.dismiss();
        }
    }
}
