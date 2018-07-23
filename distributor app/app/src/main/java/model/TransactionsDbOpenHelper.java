package model;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

public class TransactionsDbOpenHelper extends SQLiteOpenHelper {
	
	private static final String LOGTAG = "ProvisioninDb"; //log tag
	
	private static final String DATABASE_NAME = "ProvisioninDb";
	private static final int DATABASE_VERSION = 1;
	
	private static final String ATTENDANCE_TABLE = "ProvisioninTb1";
	private static final String COLUMN_ID = "Id";
	private static final String COLUMN_CARDID = "cardserial";
	//private static final String COLUMN_STAFFID = "staffid";
	private static final String COLUMN_DATE = "datetime";
    private static final String COLUMN_SYNCED = "sync";
	private static final String COLUMN_REF = "ref";
	
	private static final String TABLE_CREATE ="CREATE TABLE " + ATTENDANCE_TABLE + " (" +
    COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, "+COLUMN_CARDID + " TEXT, "+COLUMN_DATE + " TEXT, "+COLUMN_SYNCED +" TEXT, "+COLUMN_REF +" TEXT"+");";
	

	public TransactionsDbOpenHelper(Context context) {
		super(context, DATABASE_NAME, null, DATABASE_VERSION);
		// TODO Auto-generated constructor stub
	}

	@Override
	public void onCreate(SQLiteDatabase db) {
		db.execSQL(TABLE_CREATE);
		Log.e(LOGTAG, "TABLE has been created");
	}

	@Override
	public void onUpgrade(SQLiteDatabase arg0, int arg1, int arg2) {
		arg0.execSQL("DROP TABLE IF EXISTS " + ATTENDANCE_TABLE);
		onCreate(arg0);
	}
}
